
import { supabase } from '../lib/supabaseClient';
import { profileRepo } from './profile.repo';

export const authService = {
    async signUp(email: string, password: string, fullName: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        if (error) throw error;

        // Create profile immediately if user is created
        if (data.user) {
            await profileRepo.createProfile({
                id: data.user.id,
                email: data.user.email || email,
                full_name: fullName,
                city: 'Cali', // Default
                language: 'es',
                avatar_url: null
            });
        }

        return data;
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    async resetPasswordForEmail(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
    },

    onAuthStateChange(callback: (event: any, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    }
};
