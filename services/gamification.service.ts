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

    async getBadgesForUser(userId: string): Promise<Insignia[]> {
        if (!userId) return this.getAllBadges();

        const { data: allBadges, error: badgesError } = await supabase
            .from('badges')
            .select('*');

        if (badgesError) {
            console.error('Error fetching badges:', badgesError);
            return [];
        }

        const { data: userBadges, error: userError } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', userId);

        if (userError) {
            console.error('Error fetching user badges:', userError);
            // Fallback to returning all badges with obtenida=false
            return allBadges.map(mapBadge);
        }

        const earnedSet = new Set(userBadges.map((ub: any) => ub.badge_id));

        return allBadges.map((b: any) => ({
            ...mapBadge(b),
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
        // Check if already obtained to avoid errors (or rely on unique constraint db side)
        const { data: existing, error: checkError } = await supabase
            .from('user_badges')
            .select('id')
            .eq('user_id', userId)
            .eq('badge_id', badgeId)
            .single();

        if (existing) return false; // Already has it

        const { error } = await supabase
            .from('user_badges')
            .insert({ user_id: userId, badge_id: badgeId });

        if (error) {
            console.error('Error unlocking badge:', error);
            return false;
        }
        return true;
    },

    // Deprecated legacy method signature support if needed, or remove
    async addPoints(userId: string, amount: number) {
        return this.awardPoints(amount, 'Generic Action');
    }
};

function mapBadge(dbBadge: any): Insignia {
    return {
        id: dbBadge.id,
        nombre: dbBadge.nombre,
        nombre_en: dbBadge.nombre_en,
        descripcion: dbBadge.descripcion,
        descripcion_en: dbBadge.descripcion_en,
        icono: iconMap[dbBadge.icono_name] || Award,
        obtenida: false
    };
}
