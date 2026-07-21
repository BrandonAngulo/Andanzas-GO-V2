import { supabase } from '../lib/supabaseClient';
import { Site } from '../types';
import { sitesData } from '../data/sites';

export const sitesService = {
    async getAll(): Promise<Site[]> {
        const { data, error } = await supabase
            .from('sites')
            .select('*');

        const CACHE_KEY = 'andanzas_go_sites_cache';

        if (error) {
            console.error('Error fetching ALL sites from Supabase:', error);
            // Fallback to local storage cache if offline
            const cachedStr = localStorage.getItem(CACHE_KEY);
            if (cachedStr) {
                try {
                    const cachedSites = JSON.parse(cachedStr);
                    console.log(`Loaded ${cachedSites.length} sites from offline cache`);
                    return cachedSites;
                } catch (e) {
                    console.error('Failed to parse sites from cache', e);
                }
            }
            return sitesData;
        }

        const dbSites = data?.map(mapSite) || [];

        // Combine DB sites and purely local sites avoiding duplicates by ID
        const dbSiteIds = new Set(dbSites.map(s => s.id));
        const uniqueLocalSites = sitesData.filter((s: Site) => !dbSiteIds.has(s.id));
        const allSites = [...dbSites, ...uniqueLocalSites];

        // Save successfully fetched sites to cache for offline support
        if (allSites.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(allSites));
        }

        return allSites;
    },

    async getById(id: string): Promise<Site | null> {
        const { data, error } = await supabase
            .from('sites')
            .select('*')
            .eq('id', id)
            .single();

        const CACHE_KEY = 'andanzas_go_sites_cache';

        if (error) {
            console.error(`Error fetching site ${id}:`, error);
            const cachedStr = localStorage.getItem(CACHE_KEY);
            if (cachedStr) {
                try {
                    const cachedSites: Site[] = JSON.parse(cachedStr);
                    const found = cachedSites.find(s => s.id === id);
                    if (found) {
                        return found;
                    }
                } catch (e) {
                    console.error('Failed to parse sites from cache', e);
                }
            }
            return null;
        }
        return mapSite(data);
    },

    async incrementVisit(id: string): Promise<void> {
        const { error } = await supabase.rpc('increment_site_visit', { site_id_input: id });
        if (error) console.error('Error incrementing visits:', error);
    },

    // Admin methods
    async getAllAdmin(): Promise<Site[]> {
        const { data, error } = await supabase
            .from('sites')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching admin sites:', error);
            return [];
        }
        return data.map(mapSite);
    },

    async create(site: Partial<Site>): Promise<Site | null> {
        const { data, error } = await supabase
            .from('sites')
            .insert([unmapSite(site)])
            .select()
            .single();
        if (error) {
            console.error('Error creating site:', error);
            return null;
        }
        return mapSite(data);
    },

    async update(id: string, updates: Partial<Site>): Promise<Site | null> {
        const { data, error } = await supabase
            .from('sites')
            .update(unmapSite(updates))
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error updating site:', error);
            return null;
        }
        return mapSite(data);
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('sites')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting site:', error);
            return false;
        }
        return true;
    }
};

function unmapSite(site: Partial<Site>): any {
    const unmapped: any = {};
    if (site.id !== undefined) unmapped.id = site.id;
    if (site.nombre !== undefined) unmapped.nombre = site.nombre;
    if (site.nombre_en !== undefined) unmapped.nombre_en = site.nombre_en;
    if (site.tipo !== undefined) unmapped.tipo = site.tipo;
    if (site.tipo_en !== undefined) unmapped.tipo_en = site.tipo_en;
    if (site.lat !== undefined) unmapped.lat = site.lat;
    if (site.lng !== undefined) unmapped.lng = site.lng;
    if (site.rating !== undefined) unmapped.rating = site.rating;
    if (site.visitas !== undefined) unmapped.visitas = site.visitas;
    if (site.logoUrl !== undefined) unmapped.logo_url = site.logoUrl;
    if (site.image_position !== undefined) unmapped.image_position = site.image_position;
    if (site.descripcion !== undefined) unmapped.descripcion = site.descripcion;
    if (site.descripcion_en !== undefined) unmapped.descripcion_en = site.descripcion_en;
    if (site.importancia !== undefined) unmapped.importancia = site.importancia;
    if (site.importancia_en !== undefined) unmapped.importancia_en = site.importancia_en;
    if (site.datosHistoricos !== undefined) unmapped.datos_historicos = site.datosHistoricos;
    if (site.datosHistoricos_en !== undefined) unmapped.datos_historicos_en = site.datosHistoricos_en;
    if (site.datosCuriosos !== undefined) unmapped.datos_curiosos = site.datosCuriosos;
    if (site.datosCuriosos_en !== undefined) unmapped.datos_curiosos_en = site.datosCuriosos_en;
    if (site.reconocimientos !== undefined) unmapped.reconocimientos = site.reconocimientos;
    if (site.reconocimientos_en !== undefined) unmapped.reconocimientos_en = site.reconocimientos_en;
    if (site.image_credit !== undefined) unmapped.image_credit = site.image_credit;
    if (site.accessibility_features !== undefined) unmapped.accessibility_features = site.accessibility_features;
    if (site.horario !== undefined) unmapped.horario = site.horario;
    if (site.horario_en !== undefined) unmapped.horario_en = site.horario_en;
    if (site.tarifa !== undefined) unmapped.tarifa = site.tarifa;
    if (site.tarifa_en !== undefined) unmapped.tarifa_en = site.tarifa_en;
    if (site.status !== undefined) unmapped.status = site.status;
    return unmapped;
}

function mapSite(dbSite: any): Site {
    return {
        id: dbSite.id,
        nombre: dbSite.nombre,
        nombre_en: dbSite.nombre_en,
        tipo: dbSite.tipo,
        tipo_en: dbSite.tipo_en,
        lat: dbSite.lat,
        lng: dbSite.lng,
        rating: dbSite.rating,
        visitas: dbSite.visitas,
        logoUrl: dbSite.logo_url,
        image_position: dbSite.image_position,
        descripcion: dbSite.descripcion,
        descripcion_en: dbSite.descripcion_en,
        importancia: dbSite.importancia,
        importancia_en: dbSite.importancia_en,
        datosHistoricos: dbSite.datos_historicos,
        datosHistoricos_en: dbSite.datos_historicos_en,
        datosCuriosos: dbSite.datos_curiosos,
        datosCuriosos_en: dbSite.datos_curiosos_en,
        reconocimientos: dbSite.reconocimientos,
        reconocimientos_en: dbSite.reconocimientos_en,
        image_credit: dbSite.image_credit,
        accessibility_features: dbSite.accessibility_features,
        horario: dbSite.horario,
        horario_en: dbSite.horario_en,
        tarifa: dbSite.tarifa,
        tarifa_en: dbSite.tarifa_en,
        status: dbSite.status || (dbSite.is_published ? 'published' : 'draft')
    };
}
