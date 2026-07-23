import { supabase } from '../lib/supabaseClient';
import { Ruta, RouteProgress } from '../types';

export interface RouteRegistrationResult {
    success: boolean;
    status?: 'confirmed' | 'waitlist';
    already_registered?: boolean;
}

export const routesService = {
    async getUserRouteProgress(userId: string): Promise<{ inProgress: string[]; completed: string[] }> {
        const { data, error } = await supabase
            .from('user_route_progress')
            .select('route_id, status')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching route progress:', error);
            return { inProgress: [], completed: [] };
        }

        return {
            inProgress: (data || []).filter(item => item.status === 'in_progress').map(item => item.route_id),
            completed: (data || []).filter(item => item.status === 'completed').map(item => item.route_id),
        };
    },

    async syncUserRouteProgress(userId: string, inProgress: string[], completed: string[]): Promise<boolean> {
        const rows = [
            ...inProgress.map(routeId => ({ user_id: userId, route_id: routeId, status: 'in_progress', updated_at: new Date().toISOString() })),
            ...completed.map(routeId => ({ user_id: userId, route_id: routeId, status: 'completed', updated_at: new Date().toISOString() })),
        ];
        if (rows.length === 0) return true;

        const { error } = await supabase
            .from('user_route_progress')
            .upsert(rows, { onConflict: 'user_id,route_id' });

        if (error) {
            console.error('Error syncing route progress:', error);
            return false;
        }
        return true;
    },

    async getRouteProgress(userId: string, routeId: string): Promise<RouteProgress | null> {
        const { data, error } = await supabase
            .from('user_route_progress')
            .select('route_id,status,started_at,completed_at,abandoned_at,last_stop_id,visited_stop_ids,progress_percent,total_points_earned')
            .eq('user_id', userId)
            .eq('route_id', routeId)
            .maybeSingle();

        if (error) {
            console.warn('Could not load detailed route progress:', error.message);
            return null;
        }

        return data ? mapRouteProgress(data) : null;
    },

    async startOrResumeRoute(userId: string, route: Ruta, restart = false): Promise<RouteProgress | null> {
        const existing = await this.getRouteProgress(userId, route.id);
        const now = new Date().toISOString();
        const payload = {
            user_id: userId,
            route_id: route.id,
            status: 'in_progress',
            started_at: restart ? now : existing?.startedAt || now,
            completed_at: null,
            abandoned_at: null,
            last_stop_id: restart ? null : existing?.lastStopId || null,
            visited_stop_ids: restart ? [] : existing?.visitedStopIds || [],
            progress_percent: restart ? 0 : existing?.progressPercent || 0,
            total_points_earned: restart ? 0 : existing?.totalPointsEarned || 0,
            updated_at: now,
        };

        const { data, error } = await supabase
            .from('user_route_progress')
            .upsert(payload, { onConflict: 'user_id,route_id' })
            .select('route_id,status,started_at,completed_at,abandoned_at,last_stop_id,visited_stop_ids,progress_percent,total_points_earned')
            .single();

        if (error) {
            console.warn('Could not start or resume route:', error.message);
            return existing;
        }
        return mapRouteProgress(data);
    },

    async saveStopProgress(
        userId: string,
        route: Ruta,
        stopId: string,
        visitedStopIds: string[],
    ): Promise<boolean> {
        const uniqueVisited = [...new Set(visitedStopIds)].filter(id => route.puntos.includes(id));
        const progressPercent = Math.round((uniqueVisited.length / Math.max(route.puntos.length, 1)) * 100);
        const { error } = await supabase
            .from('user_route_progress')
            .upsert({
                user_id: userId,
                route_id: route.id,
                status: 'in_progress',
                completed_at: null,
                abandoned_at: null,
                last_stop_id: stopId,
                visited_stop_ids: uniqueVisited,
                progress_percent: progressPercent,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,route_id' });

        if (error) console.warn('Could not save route stop progress:', error.message);
        return !error;
    },

    async completeDetailedRoute(userId: string, route: Ruta, visitedStopIds: string[]): Promise<boolean> {
        const completedAt = new Date().toISOString();
        const { error } = await supabase
            .from('user_route_progress')
            .upsert({
                user_id: userId,
                route_id: route.id,
                status: 'completed',
                completed_at: completedAt,
                abandoned_at: null,
                last_stop_id: route.puntos[route.puntos.length - 1] || null,
                visited_stop_ids: [...new Set(visitedStopIds)],
                progress_percent: 100,
                updated_at: completedAt,
            }, { onConflict: 'user_id,route_id' });

        if (error) console.warn('Could not complete detailed route progress:', error.message);
        return !error;
    },

    async abandonRoute(userId: string, route: Ruta, visitedStopIds: string[]): Promise<boolean> {
        const abandonedAt = new Date().toISOString();
        const uniqueVisited = [...new Set(visitedStopIds)];
        const { error } = await supabase
            .from('user_route_progress')
            .upsert({
                user_id: userId,
                route_id: route.id,
                status: 'abandoned',
                abandoned_at: abandonedAt,
                last_stop_id: uniqueVisited[uniqueVisited.length - 1] || route.puntos[0] || null,
                visited_stop_ids: uniqueVisited,
                progress_percent: Math.round((uniqueVisited.length / Math.max(route.puntos.length, 1)) * 100),
                updated_at: abandonedAt,
            }, { onConflict: 'user_id,route_id' });

        if (error) console.warn('Could not mark route as abandoned:', error.message);
        return !error;
    },

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
                registration_status: route.registration_status || 'open',
                image_url: route.image_url,
                image_position: route.image_position ?? null
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
        if (route.image_url !== undefined) updates.image_url = route.image_url;
        if (route.image_position !== undefined) updates.image_position = route.image_position;

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

    async registerForRoute(routeId: string): Promise<RouteRegistrationResult> {
        const { data, error } = await supabase.rpc('register_for_route', { p_route_id: routeId });
        if (error) {
            console.error('Error registering for route:', error);
            return { success: false };
        }
        return data as RouteRegistrationResult;
    },

    async cancelRegistration(routeId: string, userId?: string): Promise<boolean> {
        const { data, error } = await supabase.rpc('cancel_route_registration', {
            p_route_id: routeId,
            p_user_id: userId || null,
        });
        if (error) {
            console.error('Error cancelling route registration:', error);
            return false;
        }
        return Boolean(data);
    },

    async getRegistrations(routeId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('route_registrations')
            .select(`
                id, user_id, status, created_at,
                profiles:user_id (id, full_name, email)
            `)
            .eq('route_id', routeId)
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
        image_url: dbRoute.image_url,
        image_position: dbRoute.image_position,
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
        gamification_level: dbRoute.gamification_level,
        completion_status: dbRoute.completion_status,
        narrative_question: dbRoute.narrative_question,
        narrative_question_en: dbRoute.narrative_question_en,
        intro_text: dbRoute.intro_text,
        intro_text_en: dbRoute.intro_text_en,
        closing_text: dbRoute.closing_text,
        closing_text_en: dbRoute.closing_text_en,
        points_reward: dbRoute.points_reward,
        publico: dbRoute.is_published,
        status: dbRoute.status || (dbRoute.is_published ? 'published' : 'draft'),
        reward_badge_id: dbRoute.reward_badge_id,
        requires_registration: dbRoute.requires_registration,
        max_capacity: dbRoute.max_capacity,
        current_registrations: dbRoute.current_registrations,
        registration_status: dbRoute.registration_status
    };
}

function mapRouteProgress(row: any): RouteProgress {
    return {
        routeId: row.route_id,
        status: row.status,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        abandonedAt: row.abandoned_at,
        lastStopId: row.last_stop_id,
        visitedStopIds: row.visited_stop_ids || [],
        progressPercent: row.progress_percent || 0,
        totalPointsEarned: row.total_points_earned || 0,
    };
}
