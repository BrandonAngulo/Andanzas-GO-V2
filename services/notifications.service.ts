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
            .order('fecha', { ascending: false });

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
        return data.map(mapNotification);
    },

    async markAsRead(id: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ leida: true })
            .eq('id', id);

        if (error) console.error('Error marking notification as read:', error);
    },

    async markAllAsRead(userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ leida: true })
            .eq('user_id', userId);

        if (error) console.error('Error marking all notifications as read:', error);
    },

    async addNotification(notif: Omit<Notificacion, 'id' | 'fecha'>, userId: string) {
        // Helper for client-side triggered notifications (e.g. badges)
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                titulo: notif.titulo,
                titulo_en: notif.titulo_en,
                descripcion: notif.descripcion,
                descripcion_en: notif.descripcion_en,
                icono_name: 'Star', // Default or map from notif.icono which matches frontend type
                leida: notif.leida,
                fecha: new Date().toISOString()
            });
        if (error) console.error('Error adding notification:', error);
    },

    async broadcastMessage(titulo: string, descripcion: string) {
        const { error } = await supabase.rpc('broadcast_notification', {
            p_titulo: titulo,
            p_descripcion: descripcion,
            p_icono_name: 'Megaphone'
        });
        if (error) {
            console.error('Error broadcasting notification:', error);
            throw error;
        }
    },

    // Crea (una vez por día, dedupe en servidor) la notificación de la Pregunta del día
    // si el usuario aún no respondió hoy. Pensada para llamarse al cargar la app.
    async ensureDailyNotification(): Promise<boolean> {
        try {
            const { data, error } = await supabase.rpc('ensure_daily_notification');
            if (error) return false;
            return !!(data as any)?.created;
        } catch {
            return false;
        }
    }
};

function mapNotification(dbNotif: any): Notificacion {
    return {
        id: dbNotif.id,
        titulo: dbNotif.titulo,
        titulo_en: dbNotif.titulo_en,
        descripcion: dbNotif.descripcion,
        descripcion_en: dbNotif.descripcion_en,
        fecha: dbNotif.fecha,
        leida: dbNotif.leida,
        icono: iconMap[dbNotif.icono_name] || Compass,
        tipo: dbNotif.tipo || undefined
    };
}
