import { supabase } from '../lib/supabaseClient';

export interface HelpEntry {
    key: string;
    title_es?: string;
    body_es?: string;
    title_en?: string;
    body_en?: string;
    is_active: boolean;
}

export type HelpMap = Record<string, HelpEntry>;

// Panels that expose a contextual "?" hint. 'economy' is the profile points dialog.
export const HELP_KEYS = ['mapa', 'favoritos', 'reseñas', 'tendencias', 'noticias', 'diccionario', 'perfil', 'economy'] as const;

let cache: HelpMap | null = null;
let inflight: Promise<HelpMap> | null = null;

async function fetchHelpMap(): Promise<HelpMap> {
    const { data, error } = await supabase.from('app_help_content').select('*');
    const map: HelpMap = {};
    if (!error && data) {
        data.forEach((row: any) => { map[row.key] = row as HelpEntry; });
    }
    return map;
}

export const helpService = {
    /** Cached: fetches once per session unless refreshed. */
    async getMap(): Promise<HelpMap> {
        if (cache) return cache;
        if (!inflight) {
            inflight = fetchHelpMap().then(m => { cache = m; inflight = null; return m; });
        }
        return inflight;
    },

    /** Bypasses the cache and refreshes it (used by the admin after saving). */
    async refresh(): Promise<HelpMap> {
        cache = await fetchHelpMap();
        return cache;
    },

    async getAll(): Promise<HelpMap> {
        return this.refresh();
    },

    async update(key: string, patch: Partial<HelpEntry>): Promise<HelpEntry | null> {
        const payload: any = { key, ...patch, updated_at: new Date().toISOString() };
        const { data, error } = await supabase
            .from('app_help_content')
            .upsert(payload, { onConflict: 'key' })
            .select()
            .maybeSingle();
        if (error) {
            console.error('Error updating help content', error);
            return null;
        }
        await this.refresh();
        return data as HelpEntry;
    },
};
