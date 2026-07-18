import { supabase } from '../lib/supabaseClient';
import { analyticsService } from './analytics.service';

export interface GameChallenge {
    id: string;
    game_id: string;
    challenger_id: string;
    challenged_id?: string | null;
    // Legado (flujo viejo "juega y reta"); el duelo modo propio no los usa.
    challenger_session_id?: string | null;
    challenged_session_id?: string | null;
    status: 'pending' | 'draft' | 'awaiting_opponent' | 'in_progress' | 'completed' | 'cancelled' | 'expired' | 'invalidated';
    winner_id?: string | null;
    // Duelo autoritativo (modo propio): reglas y resultados congelados/resueltos en servidor.
    question_ids?: string[] | null;
    ruleset?: DuelRuleset | null;
    expires_at?: string | null;
    challenger_score?: number | null;
    challenged_score?: number | null;
    challenger_time_ms?: number | null;
    challenged_time_ms?: number | null;
    challenger_correct?: number | null;
    challenged_correct?: number | null;
    created_at: string;
    completed_at?: string | null;
}

export interface DuelRuleset {
    mode: string;
    scoring_version: number;
    question_count: number;
    round_seconds: number;        // reloj global de la partida (180)
    per_question_seconds: number; // reloj por pregunta (25)
}

// Pregunta del duelo SIN la respuesta correcta (la verificación ocurre en servidor).
export interface DuelQuestion {
    id: string;
    question_text: string;
    question_type: 'multiple_choice' | 'image_choice';
    options: any; // string[] | {label,image_url}[]
    category?: string;
    level?: number;
}

export interface DuelPlay {
    challenge_id: string;
    game_id?: string;
    questions: DuelQuestion[];
    ruleset: DuelRuleset;
}

export interface DuelAnswer {
    question_id: string;
    selected: string | null; // null = no respondida / timeout => incorrecta en servidor
    time_ms: number;         // tiempo efectivo de esa pregunta (pausado durante el feedback)
}

export interface DuelRunResult {
    status: 'ok' | 'already_submitted' | string;
    role?: 'challenger' | 'challenged';
    correct?: number;
    score?: number;
    answered?: number;
    time_ms?: number;
    resolved?: boolean;
}

export const challengeService = {
    // ---- Duelo autoritativo (modo propio) ----

    // El retador crea el duelo: congela set de preguntas + reglas y las devuelve para jugar YA.
    async createDuel(gameId: string, questionCount?: number): Promise<DuelPlay> {
        const { data, error } = await supabase.rpc('create_duel', {
            p_game_id: gameId,
            p_question_count: questionCount ?? 10,
        });
        if (error) throw error;
        const play = data as DuelPlay;
        analyticsService.trackEvent('challenge_created', 'game_challenge', play.challenge_id, { game_id: gameId });
        return play;
    },

    // El rival abre el enlace y obtiene el MISMO set congelado (solo si el retador ya terminó).
    async getDuelPlay(challengeId: string): Promise<DuelPlay> {
        const { data, error } = await supabase.rpc('get_duel_play', { p_challenge_id: challengeId });
        if (error) throw error;
        analyticsService.trackEvent('challenge_accepted', 'game_challenge', challengeId, {});
        return data as DuelPlay;
    },

    // Envía la corrida completa; el servidor verifica, puntúa y resuelve si ambos jugaron.
    async submitDuelRun(challengeId: string, answers: DuelAnswer[]): Promise<DuelRunResult> {
        const { data, error } = await supabase.rpc('submit_duel_run', {
            p_challenge_id: challengeId,
            p_answers: answers,
        });
        if (error) throw error;
        const res = data as DuelRunResult;
        if (res?.resolved) {
            analyticsService.trackEvent('challenge_completed', 'game_challenge', challengeId, { role: res.role ?? null });
        }
        return res;
    },

    // El retador cancela un duelo aún no cerrado.
    async cancelDuel(challengeId: string): Promise<void> {
        const { error } = await supabase.rpc('cancel_duel', { p_challenge_id: challengeId });
        if (error) throw error;
    },

    // Metadatos del reto (lobby / veredicto). SELECT es público por RLS.
    async getChallenge(challengeId: string): Promise<GameChallenge | null> {
        try {
            const { data, error } = await supabase
                .from('game_challenges')
                .select('*')
                .eq('id', challengeId)
                .single();
            if (error) throw error;
            return data as GameChallenge;
        } catch (error) {
            console.error('Error fetching challenge:', error);
            return null;
        }
    },

    // ---- LEGADO (flujo viejo "juega y reta"). Se retira al migrar GameSessionModal al duelo modo propio. ----
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
                    status: 'pending',
                })
                .select()
                .single();
            if (error) throw error;
            return data as GameChallenge;
        } catch (error) {
            console.error('Error creating challenge:', error);
            return null;
        }
    },

    async completeChallenge(challengeId: string, challengedSessionId: string, winnerId: string | null): Promise<GameChallenge | null> {
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
                    completed_at: new Date().toISOString(),
                })
                .eq('id', challengeId)
                .select()
                .single();
            if (error) throw error;
            return data as GameChallenge;
        } catch (error) {
            console.error('Error completing challenge:', error);
            return null;
        }
    },
};
