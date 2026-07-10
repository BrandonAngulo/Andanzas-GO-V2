import { supabase } from '../lib/supabaseClient';
import { CustomRouteRequest } from '../types';

export const customRoutesService = {
    async getAllAdmin(): Promise<CustomRouteRequest[]> {
        const { data, error } = await supabase
            .from('custom_route_requests')
            .select(`
                *,
                profile:user_id (nombre, avatar_url, email)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching custom route requests:', error);
            return [];
        }

        return data as any[];
    },

    async updateStatus(id: string, status: string): Promise<boolean> {
        const { error } = await supabase
            .from('custom_route_requests')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            return false;
        }

        return true;
    },

    async updateDetails(id: string, details: string): Promise<boolean> {
        const { error } = await supabase
            .from('custom_route_requests')
            .update({ details })
            .eq('id', id);

        if (error) {
            console.error('Error updating details:', error);
            return false;
        }

        return true;
    }
};
