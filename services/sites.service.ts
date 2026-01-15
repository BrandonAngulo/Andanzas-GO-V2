import { supabase } from '../lib/supabaseClient';
import { Site } from '../types';

export const sitesService = {
    async getAll(): Promise<Site[]> {
        const { data, error } = await supabase
            .from('sites')
            .select('*');

        if (error) {
            console.error('Error fetching sites:', error);
            return [];
        }
        return data.map(mapSite);
    },

    async getById(id: string): Promise<Site | null> {
        const { data, error } = await supabase
            .from('sites')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching site ${id}:`, error);
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
        accessibility_features: dbSite.accessibility_features
    };
}
