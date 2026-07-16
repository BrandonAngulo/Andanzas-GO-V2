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
    cover_theme?: string;
    release_at?: string;
    show_countdown?: boolean;
    featured?: boolean;
    time_limit_seconds?: number;
    points_per_correct_answer?: number;
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
    mechanic_type?: 'safe_zones' | 'lives' | 'multiplier' | 'sudden_death';
    instructions?: string;
    lives_count?: number;
    questions_per_match?: number;
    level_distribution?: Record<string, number>;
    // Identidad visual por juego (tema completo: color, icono y fondo temático en la pantalla de juego)
    theme_accent?: string;       // color principal en hex, ej. "#E85D2A"
    theme_accent_soft?: string;  // tono claro del mismo color, para fondos/paneles
    theme_icon?: string;         // clave de icono (mapeada a un ícono de lucide-react en el cliente)
    theme_pattern?: string;      // clave de patrón/textura decorativa de fondo (ej. "salsa", "nature", "default")
}

export interface GameQuestion {
    id: string;
    game_id: string;
    question_text: string;
    question_text_en?: string;
    // Tipo funcional de pregunta: determina qué interacción y qué lógica de verificación se usa.
    question_type: 'multiple_choice' | 'multi_select' | 'ordering' | 'matching' | 'image_choice';
    // Variante cosmética, solo aplica sobre 'multiple_choice': cambia el copy/encabezado, no la lógica.
    // 'standard' = pregunta normal | 'true_false' = Verdadero o falso | 'fill_blank' = completar la frase
    // | 'elimination' = "¿cuál no pertenece?"
    question_format?: 'standard' | 'true_false' | 'fill_blank' | 'elimination';
    category?: string;
    // Campaña/paquete temático (ej. 'vocabulario'). NULL = contenido núcleo del juego.
    campaign?: string | null;
    level: number;
    // Estructura de 'options' según question_type:
    // - multiple_choice / multi_select: string[]
    // - ordering: string[] (los ítems a ordenar, en cualquier orden de presentación)
    // - matching: { left: string[], right: string[] }
    // - image_choice: { label: string, image_url: string }[]
    options: any; // jsonb
    // Estructura de 'correct_answer' según question_type:
    // - multiple_choice / image_choice: string (debe ser igual a uno de los valores de 'options')
    // - multi_select: string[] (subconjunto de 'options', el orden no importa)
    // - ordering: string[] (los mismos ítems de 'options', en el orden correcto)
    // - matching: Record<string, string> (mapa left -> right correcto)
    correct_answer: any; // jsonb
    explanation?: string;
    points_reward: number;
    time_limit_sec: number;
    status: 'draft' | 'review' | 'published' | 'archived';
    version: number;
    related_learn_id?: string;
    related_news_id?: string;
}

export interface QuestionEditorialCheck {
    question_id: string;
    score: number;
    issues: string[];
    warnings: string[];
    checked_at: string;
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

    // Temas jugables de un juego: categorías del núcleo + campañas (para el selector).
    async getGameThemes(gameId: string): Promise<{ category: string; isCampaign: boolean }[]> {
        const { data, error } = await supabase
            .from('game_questions')
            .select('category, campaign')
            .eq('game_id', gameId)
            .eq('status', 'published');
        if (error) { console.error('Error fetching game themes:', error); return []; }
        const map = new Map<string, boolean>();
        for (const row of (data || []) as any[]) {
            const cat = row.category as string | null;
            if (!cat) continue;
            const isCampaign = !!row.campaign;
            // Si una categoría aparece como campaña en alguna fila, la marcamos como campaña.
            map.set(cat, (map.get(cat) || false) || isCampaign);
        }
        return Array.from(map.entries())
            .map(([category, isCampaign]) => ({ category, isCampaign }))
            .sort((a, b) => Number(a.isCampaign) - Number(b.isCampaign) || a.category.localeCompare(b.category));
    },

    async deleteGame(id: string): Promise<boolean> {
        const { error } = await supabase.from('games').delete().eq('id', id);
        if (error) {
            console.error('Error deleting game:', error);
            return false;
        }
        return true;
    },

    // ---- QUESTIONS CRUD ----
    async getQuestionsByGame(gameId: string): Promise<GameQuestion[]> {
        const { data, error } = await supabase.from('game_questions').select('*').eq('game_id', gameId).order('created_at', { ascending: true });
        if (error) return [];
        return data as GameQuestion[];
    },

    async createQuestion(question: Partial<GameQuestion>): Promise<GameQuestion | null> {
        const { data, error } = await supabase.from('game_questions').insert(question).select().single();
        if (error) throw error;
        return data as GameQuestion;
    },

    async updateQuestion(id: string, question: Partial<GameQuestion>): Promise<GameQuestion | null> {
        const { data, error } = await supabase.from('game_questions').update(question).eq('id', id).select().single();
        if (error) throw error;
        return data as GameQuestion;
    },

    async updateQuestionsStatus(ids: string[], status: GameQuestion['status']): Promise<number> {
        if (ids.length === 0) return 0;
        const { data, error } = await supabase
            .from('game_questions')
            .update({ status, updated_at: new Date().toISOString() })
            .in('id', ids)
            .select('id');
        if (error) throw error;
        return data?.length || 0;
    },

    async deleteQuestions(ids: string[]): Promise<number> {
        if (ids.length === 0) return 0;
        const { data, error } = await supabase
            .from('game_questions')
            .delete()
            .in('id', ids)
            .select('id');
        if (error) throw error;
        return data?.length || 0;
    },

    async refreshQuestionEditorialChecks(gameId: string): Promise<number> {
        const { data, error } = await supabase.rpc('refresh_question_editorial_checks', { p_game_id: gameId });
        if (error) throw error;
        return Number(data || 0);
    },

    async getQuestionEditorialChecks(questionIds: string[]): Promise<QuestionEditorialCheck[]> {
        if (!questionIds.length) return [];
        const { data, error } = await supabase
            .from('question_editorial_checks')
            .select('*')
            .in('question_id', questionIds);
        if (error) throw error;
        return (data || []) as QuestionEditorialCheck[];
    },

    async deleteQuestion(id: string): Promise<boolean> {
        const { error } = await supabase.from('game_questions').delete().eq('id', id);
        if (error) throw error;
        return true;
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
