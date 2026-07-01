import { supabase } from '../lib/supabaseClient';
import { Site } from '../types';
import { CULTURAL_SITES } from '../data/sites';

export const sitesService = {
    async getAll(): Promise<Site[]> {
        const { data, error } = await supabase
            .from('sites')
            .select('*');

        if (error) {
            console.error('Error fetching ALL sites from Supabase:', error);
            // Fallback to local sites only
            return CULTURAL_SITES;
        }

        const dbSites = data?.map(mapSite) || [];

        // Explicit map: local text IDs → corresponding database s-prefixed IDs
        // Local entries have richer content (importancia, datosHistoricos, datosCuriosos, etc.)
        // and take priority over the leaner database version for those fields.
        const LOCAL_TO_DB_ID: Record<string, string> = {
            'museo-salsa-obrero':      's25',
            'plazoleta-jairo-varela':  's21',
            'galeria-alameda':         's9',
            'teatro-municipal':        's2',
            'biblioteca-centenario':   's53',
            'bulevar-petronio':        's3',
            'iglesia-ermita':          's16',
            'capilla-san-antonio':     's63',
            'gato-tejada':             's8',
            'museo-tertulia':          's1',
            'zoologico-cali':          's13',
            'teatro-jorge-isaacs':     's22',
            'tec-teatro-experimental': 's96',
        };

        // Build reverse map: dbId → localSite, for enrichment
        const dbIdToLocal: Record<string, typeof CULTURAL_SITES[0]> = {};
        for (const localSite of CULTURAL_SITES) {
            const dbId = LOCAL_TO_DB_ID[localSite.id];
            if (dbId) dbIdToLocal[dbId] = localSite;
        }

        // IDs of purely local sites (not present in the DB)
        const dbIdsCoveredByLocal = new Set(Object.values(LOCAL_TO_DB_ID));
        const purelyLocalSites = CULTURAL_SITES.filter(s => !LOCAL_TO_DB_ID[s.id]);

        // Enrich DB sites with local rich content where available, keep all DB sites
        const enrichedDbSites = dbSites.map(dbSite => {
            const local = dbIdToLocal[dbSite.id];
            if (!local) return dbSite;
            // Merge: DB base data + local rich fields (local wins for rich content fields)
            return {
                ...dbSite,
                importancia:       local.importancia       ?? dbSite.importancia,
                importancia_en:    local.importancia_en    ?? dbSite.importancia_en,
                datosHistoricos:   local.datosHistoricos   ?? dbSite.datosHistoricos,
                datosHistoricos_en:local.datosHistoricos_en?? dbSite.datosHistoricos_en,
                datosCuriosos:     local.datosCuriosos     ?? dbSite.datosCuriosos,
                datosCuriosos_en:  local.datosCuriosos_en  ?? dbSite.datosCuriosos_en,
                descripcion:       local.descripcion       || dbSite.descripcion,
                descripcion_en:    local.descripcion_en    || dbSite.descripcion_en,
                horario:           local.horario           ?? dbSite.horario,
                horario_en:        local.horario_en        ?? dbSite.horario_en,
                tarifa:            local.tarifa            ?? dbSite.tarifa,
                tarifa_en:         local.tarifa_en         ?? dbSite.tarifa_en,
            };
        });

        // Final list: all DB sites (enriched) + purely local sites not in DB
        return [...enrichedDbSites, ...purelyLocalSites];
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
        accessibility_features: dbSite.accessibility_features,
        horario: dbSite.horario,
        horario_en: dbSite.horario_en,
        tarifa: dbSite.tarifa,
        tarifa_en: dbSite.tarifa_en
    };
}
