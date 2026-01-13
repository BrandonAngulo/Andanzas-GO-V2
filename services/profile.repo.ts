
import { supabase } from '../lib/supabaseClient';

export interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    city: string | null;
    language: string;
    avatar_url: string | null;
}

export const profileRepo = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
        return data as Profile | null;
    },

    async updateProfile(userId: string, updates: Partial<Profile>) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as Profile;
    },

    async createProfile(profile: Profile) {
        const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
        if (error) throw error;
        return data;
    }
};
