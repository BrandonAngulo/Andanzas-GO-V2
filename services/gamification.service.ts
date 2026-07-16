import { supabase } from '../lib/supabaseClient';
import { Insignia, PassportStamp } from '../types';
import { Heart, PenTool, Map as MapIcon, Flag, Award, Bell, Utensils, Palette, Feather, Music, Church, Cat, Footprints, Unlock, Trophy } from 'lucide-react';

// Umbrales de conteo por tier (1=bronce, 2=plata, 3=oro) para cada familia de insignias
// progresivas. Ajustar aquí si se necesita recalibrar la dificultad de un nivel.
export const FAMILY_TIER_THRESHOLDS: Record<string, number[]> = {
    fav: [1, 10, 25],
    review: [1, 5, 15],
    route_create: [1, 3, 7],
    route_complete: [1, 5, 10],
};

export interface EconomySummary {
    level: number; experience_points: number; level_start_xp: number; next_level_xp: number;
    app_points: number; coins: number; gems: number; lives: number; max_lives: number;
    next_life_at: string | null; gem_coin_reference_value: number; life_recharge_minutes: number;
    shop_offers: { key: string; title: string; quantity: number; currency: 'coin' | 'gem'; price: number }[];
}

const iconMap: Record<string, any> = {
    'Heart': Heart,
    'PenTool': PenTool,
    'MapIcon': MapIcon,
    'Flag': Flag,
    'Award': Award,
    'Bell': Bell,
    'Utensils': Utensils,
    'Palette': Palette,
    'Feather': Feather,
    'Music': Music,
    'Church': Church,
    'Cat': Cat,
    'Footprints': Footprints,
    'Unlock': Unlock,
    'Trophy': Trophy
};

export const gamificationService = {
    async getEconomySummary() {
        const { data, error } = await supabase.rpc('get_my_economy_summary');
        if (error) {
            console.error('Error fetching economy summary:', error);
            return null;
        }
        return data as EconomySummary;
    },

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
    },

    // Suma 1 al contador de progreso de una familia de insignias (favoritos, reseñas,
    // rutas creadas, rutas completadas) y desbloquea automáticamente el tier correspondiente
    // (bronce/plata/oro) cuando el conteo cruza su umbral. Devuelve la insignia recién
    // desbloqueada (si la hubo) para poder mostrar la notificación, o null si no se cruzó nada.
    async incrementFamilyProgress(userId: string, familyKey: string): Promise<Insignia | null> {
        if (!userId) return null;

        const { data: existing } = await supabase
            .from('user_badge_progress')
            .select('count')
            .eq('user_id', userId)
            .eq('family_key', familyKey)
            .maybeSingle();

        const newCount = (existing?.count || 0) + 1;

        const { error: upsertError } = await supabase
            .from('user_badge_progress')
            .upsert(
                { user_id: userId, family_key: familyKey, count: newCount, updated_at: new Date().toISOString() },
                { onConflict: 'user_id,family_key' }
            );

        if (upsertError) {
            console.error('Error updating badge progress:', upsertError);
            return null;
        }

        const thresholds = FAMILY_TIER_THRESHOLDS[familyKey];
        if (!thresholds) return null;

        const { data: familyBadges } = await supabase
            .from('badges')
            .select('*')
            .eq('family_key', familyKey)
            .order('tier', { ascending: true });

        if (!familyBadges) return null;

        for (const badge of familyBadges) {
            const threshold = thresholds[(badge.tier || 1) - 1];
            if (threshold && newCount === threshold) {
                const unlocked = await this.unlockBadge(userId, badge.id);
                if (unlocked) return mapBadge(badge);
            }
        }
        return null;
    },

    // Progreso actual del usuario por familia (ej. { fav: 3, review: 1 }), usado por la UI
    // para mostrar una barra de "3/10 hacia el siguiente nivel" en las insignias progresivas.
    async getUserBadgeProgress(userId: string): Promise<Record<string, number>> {
        if (!userId) return {};
        const { data, error } = await supabase
            .from('user_badge_progress')
            .select('family_key, count')
            .eq('user_id', userId);

        if (error || !data) return {};
        return data.reduce((acc: Record<string, number>, row: any) => {
            acc[row.family_key] = row.count;
            return acc;
        }, {});
    },

    async getGlobalLeaderboard(limit: number = 10): Promise<any[]> {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, full_name, avatar_url, total_points')
            .order('total_points', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
        return data;
    },

    async getUserPassportStamps(userId: string): Promise<PassportStamp[]> {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('passport_stamps')
            .select('*')
            .eq('user_id', userId)
            .order('unlocked_at', { ascending: false });

        if (error) {
            console.error('Error fetching passport stamps:', error);
            return [];
        }
        return data as PassportStamp[];
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
        image_url: dbBadge.image_url,
        family_key: dbBadge.family_key || undefined,
        tier: dbBadge.tier || undefined,
        obtenida: false
    };
}
