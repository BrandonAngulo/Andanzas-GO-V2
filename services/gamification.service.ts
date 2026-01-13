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

    async addPoints(userId: string, amount: number) {
        // First get current points
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching points for update:', fetchError);
            return;
        }

        const newPoints = (profile?.points || 0) + amount;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ points: newPoints })
            .eq('id', userId);

        if (updateError) {
            console.error('Error updating points:', updateError);
        }
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
