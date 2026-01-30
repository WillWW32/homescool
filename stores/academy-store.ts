import { create } from 'zustand';
import { HomeScoolAcademy } from '@/sdk';
import { supabase } from '@/lib/supabase';
import { TeacherResponse, StudentContext } from '@/sdk/personas/types';

interface AcademyStore {
  academy: HomeScoolAcademy | null;
  studentContext: StudentContext | null;
  loading: boolean;
  
  // Initialize academy with API key
  initAcademy: (apiKey: string) => void;
  
  // Load student context
  loadStudentContext: (userId: string) => Promise<void>;
  
  // Chat with teacher
  chatWithTeacher: (teacherId: string, message: string) => Promise<TeacherResponse>;
}

export const useAcademyStore = create<AcademyStore>((set, get) => ({
  academy: null,
  studentContext: null,
  loading: false,
  
  initAcademy: (apiKey: string) => {
    const academy = new HomeScoolAcademy({
      apiKey: apiKey,
      supabase: supabase,
    });
    set({ academy });
  },
  
  loadStudentContext: async (userId: string) => {
    set({ loading: true });
    
    try {
      // Fetch student data from Supabase
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', userId)
        .single();
      
      if (error) throw error;
      
      // Fetch active challenges
      const { data: challenges } = await supabase
        .from('student_challenges')
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq('student_id', student.id)
        .eq('status', 'active');
      
      // Fetch active projects
      const { data: projects } = await supabase
        .from('projects')
        .select('title')
        .eq('student_id', student.id)
        .eq('status', 'active');
      
      const studentContext: StudentContext = {
        id: student.id,
        name: student.name,
        age: student.age,
        credits: student.credits,
        level: student.level,
        activeProjects: projects?.map(p => p.title) || [],
        activeChallenges: challenges?.map(c => c.challenge) || [],
        recentConversations: [],
      };
      
      set({ studentContext, loading: false });
    } catch (error) {
      console.error('Error loading student context:', error);
      set({ loading: false });
    }
  },
  
  chatWithTeacher: async (teacherId: string, message: string) => {
    const { academy, studentContext } = get();
    
    if (!academy || !studentContext) {
      throw new Error('Academy or student context not initialized');
    }
    
    // Route question to teacher
    const result = await academy.routeQuestion(
      message,
      studentContext,
      teacherId
    );
    
    return result.response;
  },
}));
