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
            // Self-Healing: If profile is missing (PGRST116), attempt to create it on the fly.
            // This handles legacy users or cases where the DB trigger might have been skipped.
            if (error.code === 'PGRST116') {
                console.warn("Profile missing for user, attempting to repair...", userId);
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user && user.id === userId) {
                        const newProfile = {
                            id: user.id,
                            email: user.email,
                            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Explorador',
                            city: 'Cali',
                            language: 'es',
                            points: 0,
                            level: 1
                        };
                        const { data: createdProfile, error: createError } = await supabase
                            .from('profiles')
                            .insert(newProfile)
                            .select()
                            .single();

                        if (!createError) {
                            console.log("Profile repaired successfully.");
                            return createdProfile as UserProfile;
                        } else {
                            console.error("Failed to repair profile:", createError);
                        }
                    }
                } catch (recoveryError) {
                    console.error("Profile recovery exception:", recoveryError);
                }
            }

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
