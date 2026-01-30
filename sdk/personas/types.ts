/**
 * Teacher Persona Types
 * 
 * Defines the structure for all 15 HomeScool Academy teachers
 */

export interface ClassPet {
  name: string | null;
  type: string | null;
  description: string | null;
}

export interface TeacherPersona {
  id: string;
  name: string;
  fullName: string;
  age: number | null;
  subjects: string[];
  background: string;
  voice: string;
  teachingStyle: string[];
  personality: string;
  specialSkill: string;
  philosophy: string;
  quirks: string;
  catchphrases: string[];
  crossRefers: string[];
  classPet: ClassPet;
  classroomId: string;
  systemPromptAddition: string;
}

export interface Challenge {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  difficulty: 'small' | 'large';
  estimatedWeeks: number;
  credits: number;
  skillsTaught: string[];
  requirements?: string[];
}

export interface StudentContext {
  id: string;
  name: string;
  age: number;
  credits: number;
  level: string;
  activeProjects: string[];
  activeChallenges: Challenge[];
  recentConversations: {
    teacherId: string;
    lastMessage: string;
    timestamp: string;
  }[];
}

export interface CrossRefer {
  toTeacher: string;
  reason: string;
  suggestedAction?: string;
}

export interface TeacherResponse {
  message: string;
  teacherId: string;
  creditsAwarded: number;
  crossRefer: CrossRefer | null;
}
