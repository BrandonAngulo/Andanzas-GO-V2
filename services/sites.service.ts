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
    }
};

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
        tarifa_en: dbSite.tarifa_en
    };
}
