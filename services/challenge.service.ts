import { supabase } from '../lib/supabaseClient';

export interface GameChallenge {
    id: string;
    game_id: string;
    challenger_id: string;
    challenged_id?: string;
    challenger_session_id: string;
    challenged_session_id?: string;
    status: 'pending' | 'completed';
    winner_id?: string;
    created_at: string;
    completed_at?: string;
}

export const challengeService = {
    async createChallenge(gameId: string, challengerSessionId: string): Promise<GameChallenge | null> {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return null;

            const { data, error } = await supabase
                .from('game_challenges')
                .insert({
                    game_id: gameId,
                    challenger_id: userData.user.id,
                    challenger_session_id: challengerSessionId,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating challenge:', error);
            return null;
        }
    },

    async getChallenge(challengeId: string): Promise<GameChallenge | null> {
        try {
            const { data, error } = await supabase
                .from('game_challenges')
                .select('*')
                .eq('id', challengeId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching challenge:', error);
            return null;
        }
    },

    async completeChallenge(
        challengeId: string, 
        challengedSessionId: string, 
        winnerId: string | null
    ): Promise<GameChallenge | null> {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return null;

            const { data, error } = await supabase
                .from('game_challenges')
                .update({
                    challenged_id: userData.user.id,
                    challenged_session_id: challengedSessionId,
                    status: 'completed',
                    winner_id: winnerId,
                    completed_at: new Date().toISOString()
                })
                .eq('id', challengeId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error completing challenge:', error);
            return null;
        }
    }
};
