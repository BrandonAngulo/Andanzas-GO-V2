import { supabase } from '../lib/supabaseClient';

// Modos de juego que consumen preguntas. La elegibilidad por modo se decide por regla
// automática (fn_mode_default_eligible) con override manual (tabla game_mode_eligibility).
export type GameMode = 'reto' | 'contrarreloj' | 'duelo' | 'diaria' | 'practica' | 'aventura';
export type GameSessionMode = 'reto' | 'clasica' | 'contrarreloj' | 'lugar' | 'vocabulario' | 'historia';
export const GAME_MODES: { key: GameMode; label: string; hint: string }[] = [
    { key: 'reto', label: 'Reto', hint: 'Todo el banco publicado' },
    { key: 'contrarreloj', label: 'Contrarreloj', hint: 'Solo opción múltiple (rápidas)' },
    { key: 'duelo', label: 'Duelo', hint: 'Opción múltiple/imagen con explicación' },
    { key: 'diaria', label: 'Pregunta del día', hint: 'MC con explicación, nivel ≤ 3' },
    { key: 'practica', label: 'Práctica', hint: 'Todo el banco (adaptativo)' },
    { key: 'aventura', label: 'Aventura', hint: 'Solo por asignación a capítulo' },
];
export interface ModePoolSize { mode: GameMode; elegibles: number; publicadas: number; overrides: number; }
export interface QuestionModeEligibility { mode: GameMode; eligible: boolean; source: 'rule' | 'override'; note: string | null; }

export interface Game {
    id: string;
    title: string;
    title_en?: string;
    slug: string;
    description?: string;
    description_en?: string;
    type: 'trivia' | 'quiz' | 'daily' | 'guess' | 'visual' | 'matching' | 'ordering';
    difficulty_level: 'easy' | 'medium' | 'hard' | null;
    status: 'draft' | 'review' | 'published' | 'paused' | 'archived' | 'coming_soon' | 'scheduled';
    cover_title?: string;
    cover_subtitle?: string;
    cover_image_url?: string;
    image_position?: { x: number; y: number; zoom: number } | null;
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
    // Colección jugable o ámbito territorial. Nunca se usa para identificar un lote editorial.
    campaign?: string | null;
    // Procedencia operativa del contenido (por ejemplo, un lote de importación).
    // No crea una tarjeta, escala o filtro para el jugador.
    content_batch?: string | null;
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
    // Imagen opcional del ENUNCIADO (patrón "1 imagen + opciones de texto"). Independiente del tipo.
    prompt_image_url?: string | null;
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

export interface GameTheme {
    key: string;
    label: string;
    isCampaign: boolean;
    kind: 'place' | 'topic' | 'category';
    questionCount?: number;
    sortOrder?: number;
}

export interface GameQuestionScope {
    game_id: string;
    key: string;
    label: string;
    kind: 'global' | 'country' | 'region' | 'city' | 'place' | 'topic';
    parent_key: string | null;
    is_playable: boolean;
    is_active: boolean;
    sort_order: number;
    icon_key: string | null;
}

export interface GameQuestionCategory {
    game_id: string;
    key: string;
    label: string;
    is_active: boolean;
    sort_order: number;
}

export interface GameModeSessionSummary {
    started: number;
    completed: number;
    best_score: number;
    best_accuracy: number;
    total_correct: number;
    total_answered: number;
    best_streak: number;
    last_played_at: string | null;
}

export interface UserCategoryProgress {
    attempts: number;
    correct_answers: number;
    mastery: number;
    xp: number;
    level: number;
    updated_at: string | null;
}

export interface ThemeQuestionStats {
    total: number;
    direct: number;
    inverse: number;
    trueFalse: number;
    other: number;
}

export interface GameModeSessionMetric {
    mode_key: GameSessionMode;
    theme_key: string | null;
    started: number;
    completed: number;
    average_accuracy: number;
    best_score: number;
}

export const GAME_QUESTION_SCOPES = [
    { key: 'world_general', label: 'Banco global (Clásica)', kind: 'global', parent_key: null, is_playable: false, is_active: true, sort_order: 0, icon_key: 'globe' },
    { key: 'country_colombia', label: 'Colombia', kind: 'country', parent_key: 'world_general', is_playable: true, is_active: true, sort_order: 10, icon_key: 'colombia' },
    { key: 'region_valle_del_cauca', label: 'Valle del Cauca', kind: 'region', parent_key: 'country_colombia', is_playable: true, is_active: true, sort_order: 20, icon_key: 'sugar_cane' },
    { key: 'city_cali', label: 'Cali', kind: 'city', parent_key: 'region_valle_del_cauca', is_playable: true, is_active: true, sort_order: 30, icon_key: 'salsa' },
    { key: 'vocabulario', label: 'Vocabulario caleño', kind: 'topic', parent_key: 'city_cali', is_playable: true, is_active: true, sort_order: 40, icon_key: 'vocabulary' },
] as const satisfies ReadonlyArray<Omit<GameQuestionScope, 'game_id'>>;

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

    async getQuestionScopes(gameId: string, includeInactive = false): Promise<GameQuestionScope[]> {
        let query = supabase
            .from('game_question_scopes')
            .select('game_id,key,label,kind,parent_key,is_playable,is_active,sort_order,icon_key')
            .eq('game_id', gameId)
            .order('sort_order', { ascending: true })
            .order('label', { ascending: true });
        if (!includeInactive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error) return (data || []) as GameQuestionScope[];

        // Compatibilidad durante una restauración anterior a la migración del catálogo.
        console.warn('Question scope catalog unavailable; using local defaults.', error);
        return GAME_QUESTION_SCOPES.map(scope => ({ game_id: gameId, ...scope })) as GameQuestionScope[];
    },

    async upsertQuestionScope(scope: GameQuestionScope): Promise<GameQuestionScope> {
        const normalizedKey = scope.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        const { data, error } = await supabase.from('game_question_scopes').upsert({
            ...scope,
            key: normalizedKey,
            parent_key: scope.parent_key || null,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'game_id,key' }).select('game_id,key,label,kind,parent_key,is_playable,is_active,sort_order,icon_key').single();
        if (error) throw error;
        return data as GameQuestionScope;
    },

    async getQuestionCategories(gameId: string): Promise<GameQuestionCategory[]> {
        const { data, error } = await supabase
            .from('game_question_categories')
            .select('game_id,key,label,is_active,sort_order')
            .eq('game_id', gameId)
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .order('label', { ascending: true });
        if (!error) return (data || []) as GameQuestionCategory[];

        const questions = await this.getQuestionsByGame(gameId);
        return Array.from(new Set(questions.map(question => question.category).filter(Boolean) as string[]))
            .sort((a, b) => a.localeCompare(b, 'es'))
            .map((label, index) => ({ game_id: gameId, key: label, label, is_active: true, sort_order: index }));
    },

    // Experiencias jugables registradas explícitamente. Un lote editorial no se convierte
    // en tema por el solo hecho de existir en el banco.
    async getGameThemes(gameId: string): Promise<GameTheme[]> {
        const [scopeRows, questionResult] = await Promise.all([
            this.getQuestionScopes(gameId),
            supabase.from('game_questions')
                .select('category, campaign')
                .eq('game_id', gameId)
                .eq('status', 'published'),
        ]);
        const { data, error } = questionResult;
        if (error) { console.error('Error fetching game themes:', error); return []; }
        const scopeByKey = new Map(scopeRows.map(scope => [scope.key, scope]));
        const map = new Map<string, GameTheme>();
        for (const row of (data || []) as any[]) {
            const cat = row.category as string | null;
            const campaign = row.campaign as string | null;
            if (campaign) {
                const scope = scopeByKey.get(campaign);
                // Los ámbitos nuevos quedan ocultos hasta que un editor los activa.
                if (!scope?.is_active || !scope.is_playable || scope.kind === 'global') continue;
                const mapKey = `campaign:${campaign}`;
                const current = map.get(mapKey);
                map.set(mapKey, current ? { ...current, questionCount: (current.questionCount || 0) + 1 } : {
                    key: campaign,
                    label: scope.label,
                    isCampaign: true,
                    kind: scope.kind === 'topic' ? 'topic' : 'place',
                    questionCount: 1,
                    sortOrder: scope.sort_order,
                });
            } else if (cat) {
                const mapKey = `category:${cat}`;
                const current = map.get(mapKey);
                map.set(mapKey, current ? { ...current, questionCount: (current.questionCount || 0) + 1 } : {
                    key: cat,
                    label: cat,
                    isCampaign: false,
                    kind: 'category',
                    questionCount: 1,
                });
            }
        }
        return Array.from(map.values())
            .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || Number(a.isCampaign) - Number(b.isCampaign) || a.label.localeCompare(b.label, 'es'));
    },

    async getPublishedQuestionCount(gameId: string): Promise<number> {
        const { count, error } = await supabase
            .from('game_questions')
            .select('id', { count: 'exact', head: true })
            .eq('game_id', gameId)
            .eq('status', 'published');
        if (error) throw error;
        return count || 0;
    },

    async getMyGameModeSummary(gameId: string, modeKey: GameSessionMode, themeKey: string | null = null): Promise<GameModeSessionSummary> {
        const { data, error } = await supabase.rpc('get_my_game_mode_summary', {
            p_game_id: gameId,
            p_mode_key: modeKey,
            p_theme_key: themeKey,
        });
        if (error) throw error;
        const value = (data || {}) as Partial<GameModeSessionSummary>;
        return {
            started: Number(value.started || 0),
            completed: Number(value.completed || 0),
            best_score: Number(value.best_score || 0),
            best_accuracy: Number(value.best_accuracy || 0),
            total_correct: Number(value.total_correct || 0),
            total_answered: Number(value.total_answered || 0),
            best_streak: Number(value.best_streak || 0),
            last_played_at: value.last_played_at || null,
        };
    },

    async getMyCategoryProgress(gameId: string, category: string): Promise<UserCategoryProgress | null> {
        const { data, error } = await supabase
            .from('user_category_progress')
            .select('attempts,correct_answers,mastery,xp,level,updated_at')
            .eq('game_id', gameId)
            .eq('category', category)
            .maybeSingle();
        if (error) throw error;
        if (!data) return null;
        return {
            attempts: Number(data.attempts || 0),
            correct_answers: Number(data.correct_answers || 0),
            mastery: Number(data.mastery || 0),
            xp: Number(data.xp || 0),
            level: Number(data.level || 1),
            updated_at: data.updated_at || null,
        };
    },

    async getThemeQuestionStats(gameId: string, themeKey: string): Promise<ThemeQuestionStats> {
        const { data, error } = await supabase
            .from('game_questions')
            .select('question_text,question_format')
            .eq('game_id', gameId)
            .eq('status', 'published')
            .eq('campaign', themeKey);
        if (error) throw error;

        const stats: ThemeQuestionStats = { total: 0, direct: 0, inverse: 0, trueFalse: 0, other: 0 };
        for (const question of data || []) {
            const text = String(question.question_text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
            stats.total += 1;
            if (question.question_format === 'true_false') stats.trueFalse += 1;
            else if (text.includes('que significa')) stats.direct += 1;
            else if (text.includes('cual de estas palabras') || text.includes('cual palabra')) stats.inverse += 1;
            else stats.other += 1;
        }
        return stats;
    },

    async getGameSessionModeMetrics(gameId: string): Promise<GameModeSessionMetric[]> {
        const { data, error } = await supabase.rpc('get_game_session_mode_metrics', { p_game_id: gameId });
        if (error) throw error;
        return ((data || []) as any[]).map(row => ({
            mode_key: row.mode_key as GameSessionMode,
            theme_key: row.theme_key || null,
            started: Number(row.started || 0),
            completed: Number(row.completed || 0),
            average_accuracy: Number(row.average_accuracy || 0),
            best_score: Number(row.best_score || 0),
        }));
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

    // Sube una imagen de opción (preguntas image_choice) al bucket público `content`
    // y devuelve su URL pública. Las imágenes deben seguir la línea de diseño de la app.
    async uploadQuestionImage(file: File): Promise<string> {
        const ext = (file.name.split('.').pop() || 'png').toLowerCase();
        const path = `questions/q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error } = await supabase.storage.from('content').upload(path, file, { upsert: false, contentType: file.type || undefined });
        if (error) throw error;
        const { data } = supabase.storage.from('content').getPublicUrl(path);
        return data.publicUrl;
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

    // ---- ELEGIBILIDAD POR MODO ----
    // Modelo: regla por defecto (automática) + override manual. Las preguntas nuevas se
    // clasifican solas; el override es la excepción. Ver docs/trivia-mode-eligibility.md.
    async getModePoolSizes(gameId: string): Promise<ModePoolSize[]> {
        const { data, error } = await supabase.rpc('get_mode_pool_sizes', { p_game_id: gameId });
        if (error) throw error;
        return (data || []) as ModePoolSize[];
    },

    // Elegibilidad efectiva (regla u override) de UNA pregunta en los 6 modos.
    async getQuestionModeEligibility(questionId: string): Promise<QuestionModeEligibility[]> {
        const { data, error } = await supabase
            .from('v_question_mode_eligibility')
            .select('mode, eligible, source, note')
            .eq('question_id', questionId);
        if (error) throw error;
        return (data || []) as QuestionModeEligibility[];
    },

    // Fija un override manual (excepción a la regla) para (pregunta, modo).
    async setQuestionModeOverride(questionId: string, mode: GameMode, eligible: boolean, note?: string): Promise<void> {
        const { error } = await supabase.from('game_mode_eligibility').upsert({
            question_id: questionId, mode, eligible, note: note ?? null, updated_at: new Date().toISOString(),
        }, { onConflict: 'question_id,mode' });
        if (error) throw error;
    },

    // Quita el override → la pregunta vuelve a regirse por la regla por defecto.
    async clearQuestionModeOverride(questionId: string, mode: GameMode): Promise<void> {
        const { error } = await supabase.from('game_mode_eligibility')
            .delete().eq('question_id', questionId).eq('mode', mode);
        if (error) throw error;
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
