import { supabase } from '../lib/supabaseClient';
import { Notificacion } from '../types';
import { Compass, Calendar, Star, Route, Megaphone } from 'lucide-react';

const iconMap: Record<string, any> = {
    'Compass': Compass,
    'Calendar': Calendar,
    'Star': Star,
    'Route': Route,
    'Megaphone': Megaphone
};

export const notificationsService = {
    async getUserNotifications(userId: string): Promise<Notificacion[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
        return data.map(mapNotification);
    },

    async markAsRead(id: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        if (error) console.error('Error marking notification as read:', error);
    },

    async markAllAsRead(userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId);

        if (error) console.error('Error marking all notifications as read:', error);
    },

    async addNotification(notif: Omit<Notificacion, 'id' | 'fecha'>, userId: string) {
        // Helper for client-side triggered notifications (e.g. badges)
        // Ideally these happen server-side via triggers
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                title: notif.titulo,
                title_en: notif.titulo_en,
                description: notif.descripcion,
                description_en: notif.descripcion_en,
                icon_name: 'Star', // Default or map from notif.icono
                read: notif.leida
            });
        if (error) console.error('Error adding notification:', error);
    }
};

function mapNotification(dbNotif: any): Notificacion {
    return {
        id: dbNotif.id,
        titulo: dbNotif.title,
        titulo_en: dbNotif.title_en,
        descripcion: dbNotif.description,
        descripcion_en: dbNotif.description_en,
        fecha: dbNotif.created_at,
        leida: dbNotif.read,
        icono: iconMap[dbNotif.icon_name] || Compass
    };
}
