import { supabase } from '../lib/supabaseClient';
import { GameChallenge } from '../types';

export const challengesService = {
  /**
   * Obtiene los retos donde el usuario está involucrado (como retador o retado)
   */
  async getUserChallenges(userId: string): Promise<GameChallenge[]> {
    try {
      const { data, error } = await supabase
        .from('game_challenges')
        .select(`
          *,
          challenger:user_profiles!game_challenges_challenger_id_fkey(full_name, avatar_url),
          challenged:user_profiles!game_challenges_challenged_id_fkey(full_name, avatar_url),
          game:games(title, logo_url)
        `)
        .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user challenges:", error);
        return [];
      }

      return data as any; // Casting to any first due to joined relations not strictly typed in GameChallenge yet
    } catch (error) {
      console.error("Unexpected error fetching user challenges:", error);
      return [];
    }
  },

  /**
   * Obtiene un reto específico
   */
  async getChallengeById(challengeId: string): Promise<GameChallenge | null> {
    try {
      const { data, error } = await supabase
        .from('game_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (error) {
        console.error("Error fetching challenge:", error);
        return null;
      }
      return data as GameChallenge;
    } catch (error) {
      console.error("Unexpected error fetching challenge:", error);
      return null;
    }
  },

  /**
   * Crea un nuevo reto
   */
  async createChallenge(challenge: Omit<GameChallenge, 'id' | 'created_at' | 'updated_at'>): Promise<GameChallenge | null> {
    try {
      const { data, error } = await supabase
        .from('game_challenges')
        .insert([challenge])
        .select()
        .single();

      if (error) {
        console.error("Error creating challenge:", error);
        return null;
      }
      return data as GameChallenge;
    } catch (error) {
      console.error("Unexpected error creating challenge:", error);
      return null;
    }
  },

  /**
   * Actualiza el estado y puntaje de un reto (cuando el retado termina)
   */
  async updateChallenge(challengeId: string, updates: Partial<GameChallenge>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('game_challenges')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', challengeId);

      if (error) {
        console.error("Error updating challenge:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Unexpected error updating challenge:", error);
      return false;
    }
  }
};
