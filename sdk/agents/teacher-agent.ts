/**
 * Teacher Agent
 * 
 * Combines Jess Light core with unique teacher persona
 */

import { JessLightSDK, Message, ChatResponse } from '../core/jess-light';
import { TeacherPersona, StudentContext, CrossRefer, TeacherResponse } from '../personas/types';

export class TeacherAgent extends JessLightSDK {
  private persona: TeacherPersona;
  
  constructor(config: { apiKey: string; supabase: any; persona: TeacherPersona }) {
    super(config);
    this.persona = config.persona;
  }
  
  /**
   * Build complete system prompt (Jess Light + Persona)
   */
  private buildSystemPrompt(): string {
    const basePrompt = this.getBaseSystemPrompt();
    
    return `${basePrompt}

---

PERSONA LAYER:
${this.persona.systemPromptAddition}

---

CONTEXT AWARENESS:
You are part of HomeScool Academy with 14 other teachers.
You can refer students to other teachers when their question fits another expertise.

Your cross-referral teachers:
${this.persona.crossRefers.map(id => `- ${id}`).join('\n')}

You have access to the student's:
- Name and age
- Current projects and challenges
- Learning history and credits earned
- Recent conversations with other teachers (shared context)
`;
  }
  
  /**
   * Chat with student
   */
  async chatWithStudent(
    message: string,
    studentContext: StudentContext,
    conversationId?: string
  ): Promise<TeacherResponse> {
    try {
      // Load conversation history
      const history = conversationId 
        ? await this.loadConversation(studentContext.id, this.persona.id)
        : [];
      
      // Build contextualized message
      const contextualizedMessage = `
STUDENT CONTEXT:
- Name: ${studentContext.name}
- Age: ${studentContext.age}
- Credits: ${studentContext.credits}
- Level: ${studentContext.level}
- Active Projects: ${studentContext.activeProjects.join(', ') || 'None'}
- Active Challenges: ${studentContext.activeChallenges.map(c => c.title).join(', ') || 'None'}

STUDENT MESSAGE:
${message}
`;
      
      // Get response from Grok
      const systemPrompt = this.buildSystemPrompt();
      const responseText = await this.chat(systemPrompt, contextualizedMessage, history);
      
      // Detect cross-referral
      const crossRefer = this.detectCrossRefer(responseText);
      
      // Detect credits awarded
      const creditsAwarded = this.detectCreditsAwarded(responseText);
      
      // Save conversation
      const newMessage: Message = {
        role: 'student',
        content: message,
        timestamp: new Date().toISOString(),
      };
      
      const responseMessage: Message = {
        role: 'teacher',
        content: responseText,
        timestamp: new Date().toISOString(),
        credits_awarded: creditsAwarded,
      };
      
      await this.saveConversation(
        studentContext.id,
        this.persona.id,
        [...history, newMessage, responseMessage],
        'lesson'
      );
      
      // Award credits if detected
      if (creditsAwarded > 0) {
        await this.awardCredits(
          studentContext.id,
          creditsAwarded,
          'Teacher awarded during conversation',
          this.persona.id
        );
      }
      
      return {
        message: responseText,
        teacherId: this.persona.id,
        creditsAwarded: creditsAwarded,
        crossRefer: crossRefer,
      };
      
    } catch (error) {
      console.error('Error in chatWithStudent:', error);
      throw error;
    }
  }
  
  /**
   * Detect cross-referral in response
   * Looks for patterns like "Let me send you to [Teacher]" or "This is really a question for [Teacher]"
   */
  private detectCrossRefer(response: string): CrossRefer | null {
    // Simple pattern matching (can be improved with more sophisticated parsing)
    const patterns = [
      /(?:send you to|talk to|see|ask)\s+(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /(?:this is (?:really )?(?:a question )?for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    ];
    
    for (const pattern of patterns) {
      const match = response.match(pattern);
      if (match) {
        const teacherName = match[1];
        
        // Map teacher names to IDs (simplified - should use a proper lookup)
        const teacherMap: Record<string, string> = {
          'Author\'s Guild': 'authors',
          'Authors Guild': 'authors',
          'Tyra': 'tyra',
          'Crawford': 'crawford',
          'Kai': 'kai',
          'Professor Kai': 'kai',
          'Thad': 'thad',
          'Marco': 'marco',
          'Chef Marco': 'marco',
          // Add more mappings
        };
        
        const teacherId = teacherMap[teacherName];
        
        if (teacherId && this.persona.crossRefers.includes(teacherId)) {
          return {
            toTeacher: teacherId,
            reason: `Cross-referred from ${this.persona.name}`,
          };
        }
      }
    }
    
    return null;
  }
  
  /**
   * Detect credits awarded in response
   * Looks for patterns like "+50 credits" or "earned 25 credits"
   */
  private detectCreditsAwarded(response: string): number {
    const pattern = /(?:\+|earned\s+)(\d+)\s+credits?/i;
    const match = response.match(pattern);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  /**
   * Get persona info
   */
  getPersona(): TeacherPersona {
    return this.persona;
  }
}
