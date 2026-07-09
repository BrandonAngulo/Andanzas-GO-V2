import { supabase } from '../lib/supabaseClient';

export interface Banner {
    id: string;
    section_key: string;
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
    }
};
