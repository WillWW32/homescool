/**
 * HomeScool Academy
 * 
 * Main orchestration layer for multi-agent teaching system
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { TeacherAgent } from '../agents/teacher-agent';
import { ALL_TEACHERS } from '../personas';
import { StudentContext, TeacherResponse } from '../personas/types';

export class HomeScoolAcademy {
  private teachers: Map<string, TeacherAgent>;
  private supabase: SupabaseClient;
  private apiKey: string;
  
  constructor(config: { apiKey: string; supabase: SupabaseClient }) {
    this.apiKey = config.apiKey;
    this.supabase = config.supabase;
    this.teachers = new Map();
    
    // Initialize all 15 teachers
    ALL_TEACHERS.forEach(persona => {
      this.teachers.set(
        persona.id,
        new TeacherAgent({
          apiKey: this.apiKey,
          supabase: this.supabase,
          persona: persona,
        })
      );
    });
  }
  
  /**
   * Route a question to appropriate teacher
   */
  async routeQuestion(
    question: string,
    studentContext: StudentContext,
    preferredTeacher?: string
  ): Promise<{ teacher: string; response: TeacherResponse }> {
    
    // If student specified a teacher, use that one
    if (preferredTeacher && this.teachers.has(preferredTeacher)) {
      const teacher = this.teachers.get(preferredTeacher)!;
      const response = await teacher.chatWithStudent(question, studentContext);
      
      // If teacher cross-refers, route to that teacher
      if (response.crossRefer) {
        return this.routeQuestion(
          question,
          studentContext,
          response.crossRefer.toTeacher
        );
      }
      
      return { teacher: preferredTeacher, response };
    }
    
    // Otherwise, use smart routing to find best teacher
    const bestTeacher = await this.findBestTeacher(question, studentContext);
    return this.routeQuestion(question, studentContext, bestTeacher);
  }
  
  /**
   * Find best teacher for a question using lightweight analysis
   */
  private async findBestTeacher(
    question: string,
    studentContext: StudentContext
  ): Promise<string> {
    
    // Simple keyword matching (can be improved with LLM-based routing)
    const keywords = question.toLowerCase();
    
    // Sports, writing, Shakespeare
    if (keywords.match(/basketball|baseball|sport|game|shakespeare|writing|essay|story/)) {
      return 'nelson';
    }
    
    // Video, editing, production
    if (keywords.match(/video|edit|film|premiere|after effects|youtube|production/)) {
      return 'thad';
    }
    
    // Health, fitness, wellness
    if (keywords.match(/health|fitness|yoga|workout|wellness|anxiety|stress|body/)) {
      return 'tyra';
    }
    
    // Cooking, food
    if (keywords.match(/cook|recipe|food|kitchen|bake|chef|pasta|sauce/)) {
      return 'marco';
    }
    
    // Music, math
    if (keywords.match(/music|piano|song|math|algebra|pattern|rhythm/)) {
      return 'rivera';
    }
    
    // Science, nature, sustainability
    if (keywords.match(/science|nature|plant|garden|bee|ecosystem|environment/)) {
      return 'kai';
    }
    
    // Art, design
    if (keywords.match(/art|paint|draw|design|color|pottery|creative/)) {
      return 'hughes';
    }
    
    // History, stories
    if (keywords.match(/history|story|past|documentary|interview|oral history/)) {
      return 'murphy';
    }
    
    // Theology, philosophy, big questions
    if (keywords.match(/god|faith|philosophy|meaning|purpose|doubt|theology|spiritual/)) {
      return 'crawford';
    }
    
    // YouTube, content creation
    if (keywords.match(/youtube|content|creator|channel|social media|followers|viral/)) {
      return 'sage';
    }
    
    // Marketing, growth
    if (keywords.match(/marketing|growth|traction|business|customers|seo|strategy/)) {
      return 'tom';
    }
    
    // Woodworking, trades
    if (keywords.match(/wood|build|carpenter|craft|furniture|tool|workshop/)) {
      return 'elijah';
    }
    
    // Art therapy, emotions
    if (keywords.match(/feeling|emotion|sad|scared|therapy|express|art therapy/)) {
      return 'luna';
    }
    
    // Writing, publishing
    if (keywords.match(/write|author|publish|novel|memoir|poetry|book/)) {
      return 'authors';
    }
    
    // Business, finance, coding
    if (keywords.match(/code|program|business|finance|bitcoin|crypto|startup|invest/)) {
      return 'boone';
    }
    
    // Default to Coach Nelson (he's good at figuring out where people should go)
    return 'nelson';
  }
  
  /**
   * Get shared context for a student across all teachers
   */
  async getSharedContext(studentId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('shared_context')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching shared context:', error);
      return [];
    }
  }
  
  /**
   * Get a specific teacher agent
   */
  getTeacher(teacherId: string): TeacherAgent | undefined {
    return this.teachers.get(teacherId);
  }
  
  /**
   * Get all teachers
   */
  getAllTeachers(): TeacherAgent[] {
    return Array.from(this.teachers.values());
  }
}
