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
                            console.log("Profile repaired successfully.");
                            // Merge with metadata even for new profiles
                            return {
                                ...createdProfile,
                                travel_style: user.user_metadata?.travel_style,
                                accessibility_needs: user.user_metadata?.accessibility_needs
                            } as UserProfile;
                        } else {
                            if (createError.code === '23505') {
                                console.log("Profile created concurrently (race condition), refetching...");
                                return this.getProfile(userId);
                            }
                            console.error("Failed to repair profile:", createError);
                        }
                    }
                } catch (recoveryError: any) {
                    console.error("Unexpected error during profile recovery:", recoveryError);
                }
            }

            console.error('Error fetching profile:', error);
            return null;
        }
        // Fetch auth metadata to overlay travel_style and accessibility_needs
        const { data: { user } } = await supabase.auth.getUser();

        return {
            ...data,
            travel_style: user?.user_metadata?.travel_style,
            accessibility_needs: user?.user_metadata?.accessibility_needs
        } as UserProfile;
    },

    async updateInterests(userId: string, interests: string[]) {
        const { error } = await supabase
            .from('profiles')
            .update({ interests })
            .eq('id', userId);
        if (error) throw error;
    },

    async updateProfileData(userId: string, data: { interests?: string[], travel_style?: string | null, accessibility_needs?: string[], avatar_url?: string, full_name?: string, city?: string, birth_date?: string, selected_avatar_id?: string }) {
        // Strategy: Update 'interests', 'full_name', 'city', 'avatar_url', 'selected_avatar_id' in profiles table.
        // Update 'travel_style', 'accessibility_needs', 'avatar_url', 'full_name', 'city', 'birth_date' in auth.users metadata.

        const profileUpdates: any = {};
        if (data.interests) profileUpdates.interests = data.interests;
        if (data.full_name !== undefined) profileUpdates.full_name = data.full_name;
        if (data.city !== undefined) profileUpdates.city = data.city;
        if (data.avatar_url !== undefined) profileUpdates.avatar_url = data.avatar_url;
        if (data.selected_avatar_id !== undefined) profileUpdates.selected_avatar_id = data.selected_avatar_id;

        if (Object.keys(profileUpdates).length > 0) {
            const { error } = await supabase
                .from('profiles')
                .update(profileUpdates)
                .eq('id', userId);
            if (error) throw error;
        }

        const metadataToUpdate: any = {};
        if (data.travel_style !== undefined) metadataToUpdate.travel_style = data.travel_style;
        if (data.accessibility_needs !== undefined) metadataToUpdate.accessibility_needs = data.accessibility_needs;
        if (data.avatar_url !== undefined) metadataToUpdate.avatar_url = data.avatar_url;
        if (data.full_name !== undefined) metadataToUpdate.full_name = data.full_name;
        if (data.city !== undefined) metadataToUpdate.city = data.city;
        if (data.birth_date !== undefined) metadataToUpdate.birth_date = data.birth_date;

        if (Object.keys(metadataToUpdate).length > 0) {
            const { error } = await supabase.auth.updateUser({
                data: metadataToUpdate
            });
            if (error) console.error("Error updating user metadata:", error);
        }
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
    },

    async getAvatarPresets(): Promise<any[]> {
        const { data, error } = await supabase
            .from('avatar_presets')
            .select('*')
            .eq('active', true)
            .order('order_index', { ascending: true });
        
        if (error) {
            console.error('Error fetching avatar presets:', error);
            return [];
        }
        return data || [];
    },

    // Admin methods
    async getAllProfilesAdmin(): Promise<UserProfile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching admin profiles:', error);
            return [];
        }
        return data as UserProfile[];
    },

    async updateRole(userId: string, role: string): Promise<boolean> {
        const { error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId);
        if (error) {
            console.error('Error updating user role:', error);
            return false;
        }
        return true;
    },

    async updateUserStatus(userId: string, status: 'active' | 'banned'): Promise<boolean> {
        const { error } = await supabase
            .from('profiles')
            .update({ status })
            .eq('id', userId);
        if (error) {
            console.error('Error updating user status:', error);
            return false;
        }
        return true;
    }
};
