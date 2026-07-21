import { supabase } from '../lib/supabaseClient';

export interface ModifierConfig {
    force_mechanic?: 'safe_zones' | 'lives' | 'multiplier' | 'sudden_death';
    score_multiplier?: number;
    time_scale?: number;
}

export interface GameModifier {
    key: string;
    label: string;
    description: string;
    config: ModifierConfig;
    is_active?: boolean;
    starts_at?: string | null;
    ends_at?: string | null;
    order_index?: number;
    /** true si el activo viene de la rotación automática (no del flag manual). */
    auto?: boolean;
}

export interface ModifierRotation {
    enabled: boolean;
    period_days: number;
    started_at: string;
}

export const modifierService = {
    // Modificador activo (dentro de su ventana), o null. Lo usan el motor y la entrada del juego.
    async getActive(): Promise<GameModifier | null> {
        const { data, error } = await supabase.rpc('get_active_modifier');
        if (error) { console.error('Error fetching active modifier', error); return null; }
        return (data as GameModifier) || null;
    },

    // Catálogo completo (para el control de admin: elegir cuál versión activar).
    async list(): Promise<GameModifier[]> {
        const { data, error } = await supabase.from('game_modifiers').select('*').order('order_index', { ascending: true });
        if (error) { console.error('Error listing modifiers', error); return []; }
        return (data || []) as GameModifier[];
    },

    async setActive(key: string, endsAt?: string | null): Promise<GameModifier | null> {
        const { data, error } = await supabase.rpc('set_active_modifier', { p_key: key, p_starts_at: null, p_ends_at: endsAt ?? null });
        if (error) throw error;
        return (data as GameModifier) || null;
    },

    async clearActive(): Promise<void> {
        const { error } = await supabase.rpc('clear_active_modifier');
        if (error) throw error;
    },

    // Rotación automática: todos los modificadores se turnan solos, uno a la vez, en bucle.
    async getRotation(): Promise<ModifierRotation> {
        const { data, error } = await supabase.from('game_modifier_rotation').select('enabled, period_days, started_at').eq('id', 1).maybeSingle();
        if (error || !data) return { enabled: false, period_days: 7, started_at: new Date().toISOString() };
        return data as ModifierRotation;
    },

    async setRotation(enabled: boolean, periodDays?: number): Promise<void> {
        const { error } = await supabase.rpc('set_modifier_rotation', { p_enabled: enabled, p_period_days: periodDays ?? null });
        if (error) throw error;
    },
};
