import { supabase } from '../lib/supabaseClient';

export interface Ticket {
    id: string;
    user_id: string;
    category: string;
    message: string;
    status: 'open' | 'resolved' | 'closed';
    created_at: string;
}

export const supportService = {
    async submitTicket(userId: string, category: string, message: string): Promise<Ticket | null> {
        const { data, error } = await supabase
            .from('tickets')
            .insert({
                user_id: userId,
                category,
                message
            })
            .select()
            .single();

        if (error) {
            console.error('Error submitting ticket:', error);
            return null;
        }
        return data as Ticket;
    },

    async getUserTickets(userId: string): Promise<Ticket[]> {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tickets:', error);
            return [];
        }
        return data as Ticket[];
    }
};
