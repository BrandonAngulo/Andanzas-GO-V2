import { supabase } from '../lib/supabaseClient';
import { AnalyticsEvent, UserSession } from '../types';

export const analyticsService = {
  /**
   * Initializes or gets the current session ID for the user
   */
  async getOrCreateSessionId(userId?: string): Promise<string> {
    const storageKey = 'andanzas_session_id';
    let sessionId = localStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(storageKey, sessionId);
      
      // Try to register the new session
      try {
        await supabase.from('user_sessions').insert({
          session_id: sessionId,
          user_id: userId || null,
          device_type: navigator.userAgent.substring(0, 255)
        });
      } catch (error) {
        console.error('Failed to create session record', error);
      }
    }
    return sessionId;
  },

  /**
   * Ends the current session
   */
  async endSession(): Promise<void> {
    const storageKey = 'andanzas_session_id';
    const sessionId = localStorage.getItem(storageKey);
    
    if (sessionId) {
      try {
        await supabase.from('user_sessions')
          .update({ ended_at: new Date().toISOString() })
          .eq('session_id', sessionId);
      } catch (error) {
        console.error('Failed to end session record', error);
      }
      localStorage.removeItem(storageKey);
    }
  },

  /**
   * Tracks a general analytics event
   */
  async trackEvent(eventName: string, entityType?: string, entityId?: string, metadata?: any): Promise<void> {
    try {
      // Get current auth state
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      const sessionId = await this.getOrCreateSessionId(userId);

      const event: Partial<AnalyticsEvent> = {
        event_name: eventName,
        session_id: sessionId,
        user_id: userId || undefined,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata
      };

      await supabase.from('analytics_events').insert(event);
      
    } catch (error) {
      console.warn(`Failed to track event ${eventName}`, error);
    }
  }
};
