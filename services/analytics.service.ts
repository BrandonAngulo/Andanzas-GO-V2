import { supabase } from '../lib/supabaseClient';
import { AnalyticsEvent, UserSession } from '../types';

export const analyticsService = {
  /**
   * Initializes or gets the current session ID for the user
   */
  async getOrCreateSessionId(userId: string): Promise<string> {
    const storageKey = `andanzas_session_id:${userId}`;
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(storageKey, sessionId);
      
      // Try to register the new session
      try {
        const { error } = await supabase.from('user_sessions').insert({
          session_id: sessionId,
          user_id: userId,
          device_type: navigator.userAgent.substring(0, 255)
        });
        if (error && error.code !== '23505') console.warn('Failed to create analytics session', error.message);
      } catch (error) {
        console.error('Failed to create session record', error);
      }
    }
    return sessionId;
  },

  /**
   * Ends the current session
   */
  async endSession(userId: string): Promise<void> {
    const storageKey = `andanzas_session_id:${userId}`;
    const sessionId = sessionStorage.getItem(storageKey);
    
    if (sessionId) {
      try {
        const { error } = await supabase.from('user_sessions')
          .update({ ended_at: new Date().toISOString() })
          .eq('session_id', sessionId);
        if (error) console.warn('Failed to close analytics session', error.message);
      } catch (error) {
        console.error('Failed to end session record', error);
      }
      sessionStorage.removeItem(storageKey);
    }
  },

  /**
   * Tracks a general analytics event
   */
  async trackEvent(eventName: string, entityType?: string, entityId?: string, metadata?: Record<string, string | number | boolean | null>): Promise<void> {
    try {
      // Get current auth state
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      
      const sessionId = await this.getOrCreateSessionId(userId);

      const event: Partial<AnalyticsEvent> = {
        event_name: eventName,
        session_id: sessionId,
        user_id: userId,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata
      };

      const { error } = await supabase.from('analytics_events').insert(event);
      if (error) console.warn(`Failed to track event ${eventName}`, error.message);
      
    } catch (error) {
      console.warn(`Failed to track event ${eventName}`, error);
    }
  }
};
