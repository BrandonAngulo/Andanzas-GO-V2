import { supabase } from '../lib/supabaseClient';
import { analyticsService } from './analytics.service';

export interface DailyQuestionData {
    day: string;
    answered: boolean;
    streak: number;
    best_streak: number;
    /** Protectores de racha en reserva (se ganan al completar semanas; tope 2). */
    protectors: number;
    /** true si el protector está armado (solo salva faltas ocurridas DESPUÉS de armarlo). */
    protector_armed: boolean;
    question: {
        id: string;
        question_text: string;
        question_type: string;
        options: any;
        category?: string;
    };
    review: {
        selected: string | null;
        correct_answer: any;
        is_correct: boolean;
        explanation?: string | null;
    } | null;
}

export interface DailyReward {
    coins: number;
    gems: number;
    daily_coins: number;
    weekly_bonus: number;
}

export interface DailyAnswerResult {
    is_correct?: boolean;
    correct_answer?: any;
    explanation?: string | null;
    streak?: number;
    best_streak?: number;
    already_answered?: boolean;
    reward?: DailyReward;
    /** true si un protector armado salvó la racha en esta respuesta (se consumió). */
    protector_used?: boolean;
    /** true si esta respuesta completó una semana y otorgó un protector nuevo. */
    protector_earned?: boolean;
    protectors?: number;
}

export const dailyService = {
    async getDaily(): Promise<DailyQuestionData> {
        const { data, error } = await supabase.rpc('get_daily_question');
        if (error) throw error;
        const d = data as DailyQuestionData;
        analyticsService.trackEvent('daily_question_viewed', 'daily', d?.day, { answered: !!d?.answered });
        return d;
    },

    async answerDaily(selected: string): Promise<DailyAnswerResult> {
        const { data, error } = await supabase.rpc('answer_daily_question', { p_selected: selected });
        if (error) throw error;
        const res = data as DailyAnswerResult;
        if (!res.already_answered) {
            analyticsService.trackEvent('daily_question_answered', 'daily', undefined, { is_correct: res.is_correct ?? null, protector_used: res.protector_used ?? false });
        }
        return res;
    },

    /** Arma (requiere tener >=1) o desarma el protector de racha. */
    async setProtector(armed: boolean): Promise<void> {
        const { error } = await supabase.rpc('set_daily_protector', { p_armed: armed });
        if (error) throw error;
        analyticsService.trackEvent('daily_protector_toggled', 'daily', undefined, { armed });
    },
};
