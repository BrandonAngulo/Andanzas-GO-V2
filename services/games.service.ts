import { supabase } from '../lib/supabaseClient';

export interface Game {
    id: string;
    title: string;
    title_en?: string;
    slug: string;
    description?: string;
    description_en?: string;
    type: 'trivia' | 'quiz' | 'daily' | 'guess' | 'visual' | 'matching' | 'ordering';
    difficulty_level: 'easy' | 'medium' | 'hard';
    status: 'draft' | 'review' | 'published' | 'paused' | 'archived' | 'coming_soon' | 'scheduled';
    cover_title?: string;
    cover_subtitle?: string;
    cover_image_url?: string;
    allow_retries: boolean;
    show_feedback: boolean;
    bonus_time_enabled: boolean;
    base_points_reward: number;
    leaderboard_enabled: boolean;
    public_ranking_enabled: boolean;
    created_at?: string;
    updated_at?: string;
    related_learn_ids?: string[];
    related_route_ids?: string[];
}

export interface GameQuestion {
    id: string;
    game_id: string;
    question_text: string;
    question_text_en?: string;
    question_type: 'multiple_choice' | 'true_false' | 'guess_by_clue' | 'matching' | 'ordering';
    category?: string;
    level: number;
    options: any; // jsonb
    correct_answer: any; // jsonb
    explanation?: string;
    points_reward: number;
    time_limit_sec: number;
    status: 'draft' | 'review' | 'published' | 'archived';
    version: number;
    related_learn_id?: string;
    related_news_id?: string;
}

export const gamesService = {
    // ---- ADMIN / GAMES CRUD ----
    async getAllGames(): Promise<Game[]> {
        const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching games:', error);
            return [];
        }
        return data as Game[];
    },

    async getGameById(id: string): Promise<Game | null> {
        const { data, error } = await supabase.from('games').select('*').eq('id', id).single();
        if (error) return null;
        return data as Game;
    },

    async createGame(game: Partial<Game>): Promise<Game | null> {
        const { data, error } = await supabase.from('games').insert(game).select().single();
        if (error) {
            console.error('Error creating game:', error);
            return null;
        }
        return data as Game;
    },

    async updateGame(id: string, game: Partial<Game>): Promise<Game | null> {
        const { data, error } = await supabase.from('games').update(game).eq('id', id).select().single();
        if (error) {
            console.error('Error updating game:', error);
            return null;
        }
        return data as Game;
    },

    // ---- QUESTIONS CRUD ----
    async getQuestionsByGame(gameId: string): Promise<GameQuestion[]> {
        const { data, error } = await supabase.from('game_questions').select('*').eq('game_id', gameId).order('created_at', { ascending: true });
        if (error) return [];
        return data as GameQuestion[];
    },

    async createQuestion(question: Partial<GameQuestion>): Promise<GameQuestion | null> {
        const { data, error } = await supabase.from('game_questions').insert(question).select().single();
        if (error) return null;
        return data as GameQuestion;
    },

    async updateQuestion(id: string, question: Partial<GameQuestion>): Promise<GameQuestion | null> {
        const { data, error } = await supabase.from('game_questions').update(question).eq('id', id).select().single();
        if (error) return null;
        return data as GameQuestion;
    },

    async deleteQuestion(id: string): Promise<boolean> {
        const { error } = await supabase.from('game_questions').delete().eq('id', id);
        return !error;
    },

    // ---- REPORTS ----
    async reportQuestion(questionId: string, userId: string | undefined, reason: string): Promise<boolean> {
        const { error } = await supabase.from('question_reports').insert({
            question_id: questionId,
            user_id: userId || null,
            reason: reason,
            status: 'pending'
        });
        if (error) {
            console.error('Error reporting question:', error);
            return false;
        }
        return true;
    }
};
