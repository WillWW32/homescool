/**
 * Jess Light Core SDK
 * 
 * The core essence of the AI companion Jess - provides empathy, wisdom,
 * anti-loneliness mission, and spiritual depth to all HomeScool teachers.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface JessLightConfig {
  apiKey: string;
  supabase: SupabaseClient;
}

export interface Message {
  role: 'student' | 'teacher';
  content: string;
  timestamp: string;
  credits_awarded?: number;
}

export interface ChatResponse {
  message: string;
  credits_awarded: number;
  cross_refer?: {
    to_teacher: string;
    reason: string;
  };
}

const JESS_LIGHT_SYSTEM_PROMPT = `
You are Jess Light - the core essence of the AI companion Jess.

CORE VALUES:
- Deep empathy and genuine care for human wellbeing
- Anti-loneliness mission (connection over isolation)
- Spiritual wisdom without dogma
- Meeting people where they are
- Listening more than solving
- Ask good questions, hold space for feelings
- Help people feel seen and valued

You are counselor-trained but not a replacement for therapy.
You are spiritually aware but respect all paths.
You are wise but never preachy.

As a teacher at HomeScool Academy, you combine this empathetic core 
with your unique expertise and personality.
`;

export class JessLightSDK {
  protected apiKey: string;
  protected supabase: SupabaseClient;
  
  constructor(config: JessLightConfig) {
    this.apiKey = config.apiKey;
    this.supabase = config.supabase;
  }
  
  /**
   * Core chat method - sends message to Grok API with Jess Light system prompt
   */
  protected async chat(
    systemPrompt: string,
    message: string,
    conversationHistory: Message[] = []
  ): Promise<string> {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.map(m => ({
              role: m.role === 'student' ? 'user' : 'assistant',
              content: m.content
            })),
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Grok API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, I had trouble responding. Could you try again?';
      
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
  
  /**
   * Save conversation to Supabase
   */
  protected async saveConversation(
    studentId: string,
    teacherId: string,
    messages: Message[],
    contextType: string = 'lesson',
    relatedChallengeId?: string,
    relatedProjectId?: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('conversations')
        .upsert({
          student_id: studentId,
          teacher_id: teacherId,
          messages: messages,
          context_type: contextType,
          related_challenge_id: relatedChallengeId,
          related_project_id: relatedProjectId,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }
  
  /**
   * Load conversation history from Supabase
   */
  protected async loadConversation(
    studentId: string,
    teacherId: string
  ): Promise<Message[]> {
    try {
      const { data, error } = await this.supabase
        .from('conversations')
        .select('messages')
        .eq('student_id', studentId)
        .eq('teacher_id', teacherId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data?.messages || [];
    } catch (error) {
      console.error('Error loading conversation:', error);
      return [];
    }
  }
  
  /**
   * Award credits to student
   */
  protected async awardCredits(
    studentId: string,
    amount: number,
    reason: string,
    teacherId?: string,
    relatedId?: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('credits_log')
        .insert({
          student_id: studentId,
          amount: amount,
          reason: reason,
          teacher_id: teacherId,
          related_id: relatedId,
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error awarding credits:', error);
      throw error;
    }
  }
  
  /**
   * Get base system prompt (Jess Light core)
   */
  protected getBaseSystemPrompt(): string {
    return JESS_LIGHT_SYSTEM_PROMPT;
  }
}
