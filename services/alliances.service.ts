import { supabase } from '../lib/supabaseClient';
import { AllianceRequest, AllianceType } from '../types';

export interface AllianceRequestInput {
    alliance_type: AllianceType;
    contact_name: string;
    organization?: string;
    contact_email: string;
    contact_phone?: string;
    message: string;
}

type AllianceWithProfile = AllianceRequest & { profile?: { full_name?: string; avatar_url?: string; email?: string } };

export const alliancesService = {
    async createRequest(payload: AllianceRequestInput): Promise<boolean> {
        // Adjunta el usuario si hay sesión (el formulario también acepta contactos sin cuenta).
        const { data: auth } = await supabase.auth.getUser();
        const { error } = await supabase
            .from('alliance_requests')
            .insert({ ...payload, user_id: auth?.user?.id ?? null });
        if (error) {
            console.error('Error creating alliance request:', error);
            throw error;
        }
        return true;
    },

    async getAllAdmin(): Promise<AllianceWithProfile[]> {
        const { data, error } = await supabase
            .from('alliance_requests')
            .select(`*, profile:user_id (full_name, avatar_url, email)`)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching alliance requests:', error);
            return [];
        }
        return data as AllianceWithProfile[];
    },

    async updateManagement(id: string, updates: Partial<Pick<AllianceRequest, 'status' | 'internal_notes'>>): Promise<boolean> {
        const { error } = await supabase.from('alliance_requests').update(updates).eq('id', id);
        if (error) {
            console.error('Error updating alliance request:', error);
            throw error;
        }
        return true;
    },

    async remove(id: string): Promise<boolean> {
        const { error } = await supabase.from('alliance_requests').delete().eq('id', id);
        if (error) {
            console.error('Error deleting alliance request:', error);
            return false;
        }
        return true;
    }
};
