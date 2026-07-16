import { supabase } from '../lib/supabaseClient';
import { CustomRouteRequest } from '../types';

export const customRoutesService = {
    async getAllAdmin(): Promise<CustomRouteRequest[]> {
        const { data, error } = await supabase
            .from('custom_route_requests')
            .select(`
                *,
                profile:user_id (full_name, avatar_url, email)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching custom route requests:', error);
            return [];
        }

        return data as any[];
    },

    async createRequest(payload: any): Promise<boolean> {
        const { error } = await supabase
            .from('custom_route_requests')
            .insert(payload);
        if (error) {
            console.error('Error creating request:', error);
            throw error;
        }
        return true;
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
    },

    async updateManagement(id: string, updates: Partial<CustomRouteRequest>): Promise<boolean> {
        const { id: _id, user_id: _userId, created_at: _createdAt, ...safeUpdates } = updates as CustomRouteRequest;
        const { error } = await supabase.from('custom_route_requests').update(safeUpdates).eq('id', id);
        if (error) {
            console.error('Error updating route request management:', error);
            throw error;
        }
        return true;
    }
};
