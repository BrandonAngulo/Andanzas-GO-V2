import { supabase } from '../lib/supabaseClient';
import { Ruta } from '../types';

export const routesService = {
    async getAll(): Promise<Ruta[]> {
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .eq('is_published', true);

        if (error) {
            console.error('Error fetching all routes from Supabase:', error);
            return [];
        }

        return data?.map(mapRoute) || [];
    },

    async getAllAdmin(): Promise<Ruta[]> {
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all routes for admin:', error);
            return [];
        }

        return data?.map(mapRoute) || [];
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
                is_published: route.publico || false,
                requires_registration: route.requires_registration || false,
                max_capacity: route.max_capacity,
                current_registrations: route.current_registrations || 0,
                registration_status: route.registration_status || 'open'
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
        if (route.requires_registration !== undefined) updates.requires_registration = route.requires_registration;
        if (route.max_capacity !== undefined) updates.max_capacity = route.max_capacity;
        if (route.current_registrations !== undefined) updates.current_registrations = route.current_registrations;
        if (route.registration_status !== undefined) updates.registration_status = route.registration_status;

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
    },

    async registerForRoute(routeId: string, userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('ruta_registrations')
            .insert({ ruta_id: routeId, user_id: userId, status: 'confirmed' });
        
        if (error) {
            console.error('Error registering for route:', error);
            return false;
        }
        return true;
    },

    async cancelRegistration(routeId: string, userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('ruta_registrations')
            .update({ status: 'cancelled' })
            .eq('ruta_id', routeId)
            .eq('user_id', userId);
        
        if (error) {
            console.error('Error cancelling route registration:', error);
            return false;
        }
        return true;
    },

    async getRegistrations(routeId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('ruta_registrations')
            .select(`
                id, status, created_at,
                profiles:user_id (id, full_name, email)
            `)
            .eq('ruta_id', routeId)
            .neq('status', 'cancelled');
        
        if (error) {
            console.error('Error fetching route registrations:', error);
            return [];
        }
        return data || [];
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
        status: dbRoute.status || (dbRoute.is_published ? 'published' : 'draft'),
        reward_badge_id: dbRoute.reward_badge_id,
        requires_registration: dbRoute.requires_registration,
        max_capacity: dbRoute.max_capacity,
        current_registrations: dbRoute.current_registrations,
        registration_status: dbRoute.registration_status
    };
}
