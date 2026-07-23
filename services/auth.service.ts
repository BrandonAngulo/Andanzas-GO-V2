
import { supabase } from '../lib/supabaseClient';
import { profileRepo } from './profile.repo';

export const authService = {
    async signUp(email: string, password: string, fullName: string, extraData?: { city?: string; travel_style?: string; birth_date?: string }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/confirmed`,
                data: {
                    full_name: fullName,
                    ...extraData
                },
            },
        });
        if (error) throw error;

        // Profile creation is now handled by a Database Trigger (public.handle_new_user)
        // This prevents RLS errors when the user is not yet fully authenticated (e.g. email confirmation pending).

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

    async signInWithGoogle() {
        // Always specify redirectTo to ensure the user returns to the current domain (e.g. Vercel)
        // rather than the Supabase "Site URL" which might be set to localhost by mistake.
        // NOTE: This requires 'window.location.origin' (e.g. https://yourapp.vercel.app) to be in Supabase "Redirect URLs".
        const redirectUrl = window.location.origin;

        console.log("Initiating Google Auth with explicit redirect:", redirectUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        });
        if (error) {
            console.error("GOOGLE AUTH ERROR:", error);
            throw error;
        }
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

export const getAuthErrorMessage = (error: unknown): string => {
    const message = error instanceof Error ? error.message : String(error || '');
    const normalized = message.toLowerCase();

    if (normalized.includes('rate limit') || normalized.includes('over_email_send_rate_limit')) {
        return 'El servicio de correo alcanzó temporalmente su límite de envíos. Tu cuenta todavía no fue creada; inténtalo de nuevo más tarde o avisa al equipo de Andanzas GO.';
    }
    if (normalized.includes('already registered') || normalized.includes('user already registered')) {
        return 'Este correo ya está registrado. Intenta iniciar sesión.';
    }
    if (normalized.includes('invalid login credentials')) {
        return 'El correo o la contraseña no coinciden.';
    }
    if (normalized.includes('email not confirmed')) {
        return 'Primero confirma tu correo desde el mensaje que te enviamos.';
    }

    return message || 'No pudimos completar la autenticación. Inténtalo nuevamente.';
};
