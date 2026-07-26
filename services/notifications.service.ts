import { supabase } from '../lib/supabaseClient';
import { Notificacion } from '../types';
import {
    Award,
    Bell,
    BookOpen,
    Calendar,
    Compass,
    Lightbulb,
    Megaphone,
    Route,
    Sparkles,
    Star,
    Trophy,
} from 'lucide-react';

const iconMap: Record<string, any> = {
    Compass,
    Calendar,
    Star,
    Route,
    Megaphone,
    BookOpen,
    Sparkles,
    Trophy,
    Lightbulb,
    Award,
    Bell,
};

const iconNameForType = (notif: Omit<Notificacion, 'id' | 'fecha'>): string => {
    if (notif.icono_name) return notif.icono_name;
    if (notif.tipo === 'badge_earned' || notif.tipo === 'reward') return 'Award';
    if (notif.tipo === 'route_completed' || notif.tipo === 'route_reminder') return 'Route';
    if (notif.tipo === 'word_of_day') return 'BookOpen';
    return 'Bell';
};

export const notificationsService = {
    async getUserNotifications(userId: string): Promise<Notificacion[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('fecha', { ascending: false })
            .limit(100);

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

    async markAsConsulted(id: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ leida: true, consultada_at: new Date().toISOString() })
            .eq('id', id);

        if (error) console.error('Error marking notification as consulted:', error);
    },

    async markMatchingAsConsulted(tipo: string, targetId?: string) {
        let query = supabase
            .from('notifications')
            .update({ leida: true, consultada_at: new Date().toISOString() })
            .eq('tipo', tipo);
        if (targetId) query = query.eq('target_id', targetId);
        const { error } = await query;
        if (error) console.error('Error completing related notifications:', error);
    },

    async markAllAsRead(userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ leida: true })
            .eq('user_id', userId);

        if (error) console.error('Error marking all notifications as read:', error);
    },

    async addNotification(
        notif: Omit<Notificacion, 'id' | 'fecha'>,
        _userId: string,
    ): Promise<Notificacion | null> {
        const { data, error } = await supabase.rpc('create_user_notification', {
            p_titulo: notif.titulo,
            p_descripcion: notif.descripcion,
            p_titulo_en: notif.titulo_en ?? null,
            p_descripcion_en: notif.descripcion_en ?? null,
            p_icono_name: iconNameForType(notif),
            p_tipo: notif.tipo ?? null,
            p_dedupe_key: notif.dedupe_key ?? null,
            p_target_type: notif.target_type ?? null,
            p_target_id: notif.target_id ?? null,
            p_payload: notif.payload ?? {},
        });
        if (error) {
            console.error('Error adding notification:', error);
            return null;
        }
        return data ? mapNotification(data) : null;
    },

    async broadcastMessage(titulo: string, descripcion: string) {
        const { error } = await supabase.rpc('broadcast_notification', {
            p_titulo: titulo,
            p_descripcion: descripcion,
            p_icono_name: 'Megaphone',
        });
        if (error) {
            console.error('Error broadcasting notification:', error);
            throw error;
        }
    },

    /** Orquesta todas las fuentes idempotentes antes de leer la bandeja. */
    async ensureAppNotifications(): Promise<{ created: number; resurfaced: number }> {
        try {
            const [appResult, dailyFactResult] = await Promise.all([
                supabase.rpc('ensure_app_notifications'),
                supabase.rpc('ensure_daily_curiosity_notification'),
            ]);
            const data = appResult.data as any;
            const dailyFact = dailyFactResult.data as any;
            return {
                created:
                    (appResult.error ? 0 : Number(data?.created || 0)) +
                    (dailyFactResult.error ? 0 : Number(dailyFact?.created || 0)),
                resurfaced: appResult.error ? 0 : Number(data?.resurfaced || 0),
            };
        } catch {
            return { created: 0, resurfaced: 0 };
        }
    },
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
        icono_name: dbNotif.icono_name || undefined,
        tipo: dbNotif.tipo || undefined,
        dedupe_key: dbNotif.dedupe_key || undefined,
        target_type: dbNotif.target_type || undefined,
        target_id: dbNotif.target_id || undefined,
        payload: dbNotif.payload && typeof dbNotif.payload === 'object' ? dbNotif.payload : {},
        consultada_at: dbNotif.consultada_at || undefined,
    };
}
