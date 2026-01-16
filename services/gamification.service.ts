import { supabase } from '../lib/supabaseClient';
import { Insignia } from '../types';
import { Heart, PenTool, Map as MapIcon, Flag, Award } from 'lucide-react';

const iconMap: Record<string, any> = {
    'Heart': Heart,
    'PenTool': PenTool,
    'MapIcon': MapIcon,
    'Flag': Flag,
    'Award': Award
};

export const gamificationService = {
    async getAllBadges(): Promise<Insignia[]> {
        const { data, error } = await supabase
            .from('badges')
            .select('*');

        if (error) {
            console.error('Error fetching badges:', error);
            return [];
        }
        return data.map(mapBadge);
    },

    async getUserBadgeIds(userId: string): Promise<string[]> {
        if (!userId) return [];

        const { data, error } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching user badge IDs:', error);
            return [];
        }

        // Return IDs as strings to ensure type consistency
        return data.map((item: any) => String(item.badge_id));
    },

    async getBadgesForUser(userId: string): Promise<Insignia[]> {
        // This is redundant now but kept for compatibility during refactor
        const all = await this.getAllBadges();
        const earnedIds = await this.getUserBadgeIds(userId);
        const earnedSet = new Set(earnedIds);

        return all.map(b => ({
            ...b,
            obtenida: earnedSet.has(b.id)
        }));
    },

    async awardPoints(amount: number, reason: string) {
        const { data, error } = await supabase.rpc('award_points', {
            points_to_add: amount,
            reason_text: reason
        });

        if (error) {
            console.error('Error awarding points:', error);
            return null;
        }
        return data;
    },

    async unlockBadge(userId: string, badgeId: string): Promise<boolean> {
        const { data: existing } = await supabase
            .from('user_badges')
            .select('id')
            .eq('user_id', userId)
            .eq('badge_id', badgeId)
            .single();

        if (existing) return false;

        const { error } = await supabase
            .from('user_badges')
            .insert({ user_id: userId, badge_id: badgeId });

        if (error) {
            console.error('Error unlocking badge:', error);
            return false;
        }
        return true;
    },

    async addPoints(userId: string, amount: number) {
        return this.awardPoints(amount, 'Generic Action');
    }
};

function mapBadge(dbBadge: any): Insignia {
    // Ensure ID is string
    const idStr = String(dbBadge.id);
    return {
        id: idStr,
        nombre: dbBadge.nombre,
        nombre_en: dbBadge.nombre_en,
        descripcion: dbBadge.descripcion,
        descripcion_en: dbBadge.descripcion_en,
        icono: iconMap[dbBadge.icono_name] || Award,
        obtenida: false
    };
}
