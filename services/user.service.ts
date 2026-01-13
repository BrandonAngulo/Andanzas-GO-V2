import { supabase } from '../lib/supabaseClient';

export const userService = {
    async getFavorites(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('favorites')
            .select('site_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
        return data.map((f: any) => f.site_id);
    },

    async addFavorite(userId: string, siteId: string) {
        const { error } = await supabase
            .from('favorites')
            .insert({ user_id: userId, site_id: siteId });
        if (error) throw error;
    },

    async removeFavorite(userId: string, siteId: string) {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('site_id', siteId);
        if (error) throw error;
    }
};
