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
                                ...existingProfile,
    travel_style: user?.user_metadata?.travel_style,
    accessibility_needs: user?.user_metadata?.accessibility_needs
} as UserProfile;
                        }
                    }
console.error("Profile recovery exception:", recoveryError);
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

    async updateProfileData(userId: string, data: { interests?: string[], travel_style?: string | null, accessibility_needs?: string[] }) {
    // Prepare update object. We map frontend keys to DB keys if necessary.
    // Assuming current schema only has 'interests', we might need to store new fields differently
    // IF the columns don't exist yet, we can store them in a JSON column or add them.
    // For now, let's try to update assuming columns exist or store in metadata if possible.
    // Since we don't have migrations tool access right now, we will store them in 'raw_user_meta_data' via auth.updateUser 
    // OR try to update 'profiles' if we can add columns.

    // Strategy: Update 'interests' in profiles table (existing column).
    // Update 'travel_style' and 'accessibility_needs' in auth.users metadata for flexibility without schema migration for now.

    if (data.interests) {
        const { error } = await supabase
            .from('profiles')
            .update({ interests: data.interests })
            .eq('id', userId);
        if (error) throw error;
    }

    if (data.travel_style || data.accessibility_needs) {
        const { error } = await supabase.auth.updateUser({
            data: {
                travel_style: data.travel_style,
                accessibility_needs: data.accessibility_needs
            }
        });
        if (error) console.error("Error updating user metadata:", error);
    }
},

    async getFavorites(userId: string): Promise < string[] > {
    const { data, error } = await supabase
        .from('favorites')
        .select('site_id')
        .eq('user_id', userId);

    if(error) {
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
