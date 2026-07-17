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
};
