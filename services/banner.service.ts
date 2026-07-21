import { supabase } from '../lib/supabaseClient';

export interface Banner {
    key: string;
    scope?: 'app' | 'profile';
    title_es?: string;
    subtitle_es?: string;
    title_en?: string;
    subtitle_en?: string;
    image_url?: string;
    is_active: boolean;
    // Backward-compat aliases used by existing consumers (profile banners).
    section_key?: string;
    title?: string;
    content_text?: string;
}

export interface BannerTextPatch {
    title_es?: string;
    subtitle_es?: string;
    title_en?: string;
    subtitle_en?: string;
    image_url?: string;
    is_active?: boolean;
}

// Adds legacy aliases so components that still read `section_key`, `title` or
// `content_text` keep working after the move to the `app_banners` table.
const withLegacyAliases = (row: any): Banner => ({
    ...row,
    section_key: row.key,
    title: row.title_es,
    content_text: row.subtitle_es,
});

export const bannerService = {
    async getAppBanners(): Promise<Banner[]> {
        const { data, error } = await supabase
            .from('app_banners')
            .select('*')
            .eq('scope', 'app');
        if (error || !data) return [];
        return data.map(withLegacyAliases);
    },

    async getBanner(key: string): Promise<Banner | null> {
        const { data, error } = await supabase
            .from('app_banners')
            .select('*')
            .eq('key', key)
            .maybeSingle();
        if (error || !data) return null;
        return withLegacyAliases(data);
    },

    async updateAppBanner(key: string, patch: BannerTextPatch): Promise<Banner | null> {
        const { data, error } = await supabase
            .from('app_banners')
            .upsert({ key, scope: 'app', ...patch, updated_at: new Date().toISOString() }, { onConflict: 'key' })
            .select()
            .maybeSingle();
        if (error) {
            console.error('Error updating app banner', error);
            return null;
        }
        return data ? withLegacyAliases(data) : null;
    },

    async getProfileBanners(): Promise<Banner[]> {
        const { data, error } = await supabase
            .from('app_banners')
            .select('*')
            .eq('scope', 'profile');
        if (error || !data) return [];
        return data.map(withLegacyAliases);
    },

    // `id` may be either the bare banner id (e.g. 'banner_bulevar_rio') or the
    // full key ('profile_banner_banner_bulevar_rio'). We normalize to the key.
    async updateProfileBanner(
        id: string,
        title: string,
        contentText: string,
        imageUrl: string,
        isActive: boolean = true,
        titleEn?: string,
        subtitleEn?: string,
    ): Promise<Banner | null> {
        const key = id.startsWith('profile_banner_') ? id : `profile_banner_${id}`;
        const payload: any = {
            key,
            scope: 'profile',
            title_es: title,
            subtitle_es: contentText,
            image_url: imageUrl,
            is_active: isActive,
            updated_at: new Date().toISOString(),
        };
        if (titleEn !== undefined) payload.title_en = titleEn;
        if (subtitleEn !== undefined) payload.subtitle_en = subtitleEn;

        const { data, error } = await supabase
            .from('app_banners')
            .upsert(payload, { onConflict: 'key' })
            .select()
            .maybeSingle();
        if (error) {
            console.error('Error updating profile banner', error);
            return null;
        }
        return data ? withLegacyAliases(data) : null;
    },

    // Evalúa las reglas de desbloqueo (definidas en cada banner, app_banners.unlock_rule) contra
    // las métricas del usuario; el servidor persiste y devuelve los nuevos desbloqueos.
    async syncProfileBannerUnlocks(stats: {
        reviews: number; saved_routes: number; level: number; routes_completed: number; badges: number;
    }): Promise<{ unlocked_banners: string[]; newly_unlocked: { id: string; name: string; description: string }[] }> {
        const { data, error } = await supabase.rpc('sync_profile_banner_unlocks', { p_stats: stats });
        if (error) throw error;
        return (data || { unlocked_banners: [], newly_unlocked: [] }) as any;
    },
};

// --- Promoted Banners (Imperdibles) ---
export interface PromotedBanner {
    id: string;
    title: string;
    subtitle?: string;
    image_url: string;
    image_position?: { x: number; y: number; zoom: number } | null;
    tag?: string;
    target_type?: 'route' | 'event' | 'game' | 'url';
    target_id?: string;
    is_active: boolean;
    order_index: number;
}

export const promotedBannerService = {
    async getAll(): Promise<PromotedBanner[]> {
        const { data, error } = await supabase
            .from('promoted_banners')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });
        if (error) { console.error('Error fetching promoted banners:', error); return []; }
        return (data as PromotedBanner[]) || [];
    },

    async getAllAdmin(): Promise<PromotedBanner[]> {
        const { data, error } = await supabase
            .from('promoted_banners')
            .select('*')
            .order('order_index', { ascending: true });
        if (error) { console.error('Error fetching admin promoted banners:', error); return []; }
        return (data as PromotedBanner[]) || [];
    },

    async create(banner: Omit<PromotedBanner, 'id'>): Promise<PromotedBanner | null> {
        const { data, error } = await supabase
            .from('promoted_banners')
            .insert(banner)
            .select()
            .single();
        if (error) { console.error('Error creating promoted banner:', error); return null; }
        return data as PromotedBanner;
    },

    async update(id: string, updates: Partial<PromotedBanner>): Promise<PromotedBanner | null> {
        const { data, error } = await supabase
            .from('promoted_banners')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) { console.error('Error updating promoted banner:', error); return null; }
        return data as PromotedBanner;
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('promoted_banners')
            .delete()
            .eq('id', id);
        if (error) { console.error('Error deleting promoted banner:', error); return false; }
        return true;
    }
};
