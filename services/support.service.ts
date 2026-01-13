import { supabase } from '../lib/supabaseClient';

export interface SupportTicket {
    id?: string;
    user_id?: string;
    email?: string;
    phone?: string;
    ticket_type: 'callback' | 'contact';
    subject?: string;
    message?: string;
    status?: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at?: string;
}

export const supportService = {
    async createTicket(ticket: SupportTicket) {
        const { data, error } = await supabase
            .from('support_tickets')
            .insert(ticket)
            .select()
            .single();

        if (error) {
            console.error('Error creating support ticket:', error);
            throw error;
        }
        return data;
    },

    async getUserTickets(userId: string) {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching support tickets:', error);
            throw error;
        }
        return data;
    }
};
