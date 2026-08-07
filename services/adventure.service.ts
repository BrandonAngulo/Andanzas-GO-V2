import { supabase } from '../lib/supabaseClient';
import type { GameQuestion } from './games.service';

export interface GameCharacter {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    image_url?: string | null;
}

export interface GameChapter {
    id: string;
    game_id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    cover_image_url?: string | null;
    image_position?: { x: number; y: number; zoom: number } | null;
    reward_character_id?: string | null;
    levels_count: number;
    questions_per_level: number;
    unlock_min_levels: number;
    unlock_min_correct: number;
    status: 'draft' | 'published' | 'archived';
    version: number;
    order_index: number;
}

export interface ChapterLevel {
    id: string;
    chapter_id: string;
    level_number: number;
    title: string;
    narrative?: string | null;
    purpose?: string | null;
    questions_per_run?: number | null;
    assigned_count?: number;
}

export interface AdventureMapLevel extends ChapterLevel {
    completed: boolean;
    best_score: number;
    available: boolean;
}

export interface AdventureMap {
    chapter: Pick<GameChapter, 'id' | 'slug' | 'title' | 'subtitle' | 'description' | 'cover_image_url' | 'levels_count' | 'questions_per_level' | 'unlock_min_levels' | 'unlock_min_correct' | 'version'> & {
        character?: (GameCharacter & { owned?: boolean }) | null;
    };
    progress: { levels_completed: number; unique_correct: number; unlocked: boolean; unlocked_at?: string | null };
    levels: AdventureMapLevel[];
}

export interface AdventureRun {
    chapter_level_id: string;
    questions_per_run: number;
    questions: Array<Pick<GameQuestion, 'id' | 'question_text' | 'question_type' | 'options' | 'category' | 'level' | 'prompt_image_url'>>;
}

export interface AdventureResult {
    correct: number;
    total: number;
    levels_completed: number;
    unique_correct: number;
    unlock_min_levels: number;
    unlock_min_correct: number;
    unlocked_now: boolean;
    character?: GameCharacter | null;
}

export const adventureService = {
    async getChapters(gameId: string): Promise<GameChapter[]> {
        const { data, error } = await supabase.from('game_chapters').select('*').eq('game_id', gameId).order('order_index');
        if (error) throw error;
        return (data || []) as GameChapter[];
    },

    async getCharacters(): Promise<GameCharacter[]> {
        const { data, error } = await supabase.from('characters').select('id,slug,name,description,image_url').order('order_index');
        if (error) throw error;
        return (data || []) as GameCharacter[];
    },

    async getLevels(chapterId: string): Promise<ChapterLevel[]> {
        const { data, error } = await supabase.from('game_chapter_levels').select('*').eq('chapter_id', chapterId).order('level_number');
        if (error) throw error;
        const levels = (data || []) as ChapterLevel[];
        const ids = levels.map(level => level.id);
        if (!ids.length) return levels;
        const { data: assignments, error: assignmentError } = await supabase
            .from('game_chapter_level_questions').select('chapter_level_id').in('chapter_level_id', ids);
        if (assignmentError) throw assignmentError;
        const counts = new Map<string, number>();
        for (const row of assignments || []) counts.set(row.chapter_level_id, (counts.get(row.chapter_level_id) || 0) + 1);
        return levels.map(level => ({ ...level, assigned_count: counts.get(level.id) || 0 }));
    },

    async updateChapter(id: string, patch: Partial<GameChapter>): Promise<void> {
        const { error } = await supabase.from('game_chapters').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
        if (error) throw error;
    },

    async updateLevel(id: string, patch: Partial<ChapterLevel>): Promise<void> {
        const { error } = await supabase.from('game_chapter_levels').update(patch).eq('id', id);
        if (error) throw error;
    },

    async getAssignedQuestionIds(levelId: string): Promise<string[]> {
        const { data, error } = await supabase.from('game_chapter_level_questions')
            .select('question_id').eq('chapter_level_id', levelId).order('order_index');
        if (error) throw error;
        return (data || []).map(row => row.question_id);
    },

    async assignQuestion(levelId: string, questionId: string): Promise<void> {
        const { count, error: countError } = await supabase.from('game_chapter_level_questions')
            .select('*', { count: 'exact', head: true }).eq('chapter_level_id', levelId);
        if (countError) throw countError;
        const { error } = await supabase.from('game_chapter_level_questions').upsert({
            chapter_level_id: levelId,
            question_id: questionId,
            order_index: count || 0,
        }, { onConflict: 'chapter_level_id,question_id' });
        if (error) throw error;
    },

    async removeQuestion(levelId: string, questionId: string): Promise<void> {
        const { error } = await supabase.from('game_chapter_level_questions')
            .delete().eq('chapter_level_id', levelId).eq('question_id', questionId);
        if (error) throw error;
    },

    async getPublishedQuestions(gameId: string): Promise<GameQuestion[]> {
        const { data, error } = await supabase.from('game_questions')
            .select('id,game_id,question_text,question_type,category,campaign,level,options,correct_answer,prompt_image_url,explanation,points_reward,time_limit_sec,status,version')
            .eq('game_id', gameId).eq('status', 'published').order('category').order('level');
        if (error) throw error;
        return (data || []) as GameQuestion[];
    },

    async getChapterMap(chapterId: string): Promise<AdventureMap> {
        const { data, error } = await supabase.rpc('get_chapter_map', { p_chapter_id: chapterId });
        if (error) throw error;
        return data as AdventureMap;
    },

    async startChapterLevel(levelId: string): Promise<AdventureRun> {
        const { data, error } = await supabase.rpc('start_chapter_level', { p_chapter_level_id: levelId });
        if (error) throw error;
        return data as AdventureRun;
    },

    async submitChapterLevel(levelId: string, answers: Array<{ question_id: string; selected: unknown }>): Promise<AdventureResult> {
        const { data, error } = await supabase.rpc('submit_chapter_level', { p_chapter_level_id: levelId, p_answers: answers });
        if (error) throw error;
        return data as AdventureResult;
    },
};
