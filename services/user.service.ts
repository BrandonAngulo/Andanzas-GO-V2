import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';

export const userService = {
    async getProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data as UserProfile;
    },

    async updateInterests(userId: string, interests: string[]) {
        const { error } = await supabase
            .from('profiles')
            .update({ interests })
            .eq('id', userId);
        if (error) throw error;
    },

    async getFavorites(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('favorites')
            .select('site_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
        // @ts-ignore
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
