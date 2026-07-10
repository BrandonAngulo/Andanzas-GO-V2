import { supabase } from '../lib/supabaseClient';

export interface Banner {
    id: string;
    section_key: string;
    title?: string;
    image_url?: string;
    is_active: boolean;
    content_text?: string;
}

export const bannerService = {
    async getBanner(panelName: string): Promise<Banner | null> {
        const { data, error } = await supabase
            .from('institutional_content')
            .select('*')
            .eq('section_key', `banner_${panelName}`)
            .eq('is_active', true)
            .single();
            
        if (error || !data) {
            return null;
        }
        return data as Banner;
    },

    async updateBanner(panelName: string, imageUrl: string, isActive: boolean = true): Promise<Banner | null> {
        const sectionKey = `banner_${panelName}`;
        
        // Check if exists
        const { data: existing } = await supabase
            .from('institutional_content')
            .select('*')
            .eq('section_key', sectionKey)
            .single();
            
        if (existing) {
            const { data, error } = await supabase
                .from('institutional_content')
                .update({ image_url: imageUrl, is_active: isActive })
                .eq('id', existing.id)
                .select()
                .single();
            return error ? null : data;
        } else {
            const { data, error } = await supabase
                .from('institutional_content')
                .insert({
                    section_key: sectionKey,
                    image_url: imageUrl,
                    is_active: isActive,
                    content_text: `Banner for ${panelName}`
                })
                .select()
                .single();
            return error ? null : data;
        }
    },

    async getProfileBanners(): Promise<Banner[]> {
        const { data, error } = await supabase
            .from('institutional_content')
            .select('*')
            .like('section_key', 'profile_banner_%');
        return error || !data ? [] : (data as Banner[]);
    },

    async updateProfileBanner(id: string, title: string, contentText: string, imageUrl: string, isActive: boolean = true): Promise<Banner | null> {
        const sectionKey = id.startsWith('profile_banner_') ? id : `profile_banner_${id}`;
        const { data: existing } = await supabase
            .from('institutional_content')
            .select('*')
            .eq('section_key', sectionKey)
            .single();

        if (existing) {
            const { data, error } = await supabase
                .from('institutional_content')
                .update({ title, content_text: contentText, image_url: imageUrl, is_active: isActive })
                .eq('id', existing.id)
                .select()
                .single();
            return error ? null : data;
        } else {
            const { data, error } = await supabase
                .from('institutional_content')
                .insert({
                    section_key: sectionKey,
                    title: title,
                    content_text: contentText,
                    image_url: imageUrl,
                    is_active: isActive
                })
                .select()
                .single();
            return error ? null : data;
        }
    }
};
