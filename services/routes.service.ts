import { supabase } from '../lib/supabaseClient';
import { Ruta } from '../types';
import { CULTURAL_ROUTES } from '../data/routes';

export const routesService = {
    async getAll(): Promise<Ruta[]> {
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .eq('is_published', true);

        const dbRoutes = error ? [] : data?.map(mapRoute) || [];

        // Return mostly our curated routes first, then DB routes if they are distinct
        // (Just appending for now to ensure they show up)
        return [...CULTURAL_ROUTES, ...dbRoutes];
    },

    async getUserRoutes(userId: string): Promise<Ruta[]> {
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user routes:', error);
            return [];
        }
        return data.map(mapRoute);
    },

    async createRoute(route: Partial<Ruta>, userId: string): Promise<Ruta | null> {
        const { data, error } = await supabase
            .from('routes')
            .insert({
                id: route.id, // Optional, can let DB generate if UUID, but here we likely pass 'r_...'
                user_id: userId,
                nombre: route.nombre,
                puntos: route.puntos,
                duracion_min: route.duracionMin,
                descripcion: route.descripcion,
                justificaciones: route.justificaciones,
                is_published: route.publico || false
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating route:', error);
            return null;
        }
        return mapRoute(data);
    },

    async updateRoute(route: Partial<Ruta>): Promise<Ruta | null> {
        if (!route.id) return null;

        const updates: any = {};
        if (route.nombre !== undefined) updates.nombre = route.nombre;
        if (route.descripcion !== undefined) updates.descripcion = route.descripcion;
        if (route.publico !== undefined) updates.is_published = route.publico;
        if (route.puntos !== undefined) updates.puntos = route.puntos;

        const { data, error } = await supabase
            .from('routes')
            .update(updates)
            .eq('id', route.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating route:', error);
            return null;
        }
        return mapRoute(data);
    },

    async deleteRoute(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('routes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting route:', error);
            return false;
        }
        return true;
    }
};

function mapRoute(dbRoute: any): Ruta {
    return {
        id: dbRoute.id,
        nombre: dbRoute.nombre,
        nombre_en: dbRoute.nombre_en,
        puntos: dbRoute.puntos,
        duracionMin: dbRoute.duracion_min,
        descripcion: dbRoute.descripcion,
        descripcion_en: dbRoute.descripcion_en,
        intro_story: dbRoute.intro_story,
        intro_story_en: dbRoute.intro_story_en,
        justificaciones: dbRoute.justificaciones,
        justificaciones_en: dbRoute.justificaciones_en,
        recomendaciones: dbRoute.recomendaciones,
        gamificacion: dbRoute.gamificacion,
        publico: dbRoute.is_published,
        reward_badge_id: dbRoute.reward_badge_id
    };
}
