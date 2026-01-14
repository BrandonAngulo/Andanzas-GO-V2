import { supabase } from '../lib/supabaseClient';
import { Evento } from '../types';

export const eventsService = {
    async getAll(): Promise<Evento[]> {
        // Fetch events starting from *yesterday* to avoid timezone issues hiding today's events
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .gte('fecha', yesterday.toISOString())
            .order('fecha', { ascending: true });

        if (error) {
            console.error('Error fetching events:', error);
            return [];
        }
        return data.map(mapEvent);
    }
};

function mapEvent(dbEvent: any): Evento {
    return {
        id: dbEvent.id,
        titulo: dbEvent.titulo,
        titulo_en: dbEvent.titulo_en,
        fecha: dbEvent.fecha,
        lugar: dbEvent.lugar,
        lugar_en: dbEvent.lugar_en,
        resumen: dbEvent.resumen,
        resumen_en: dbEvent.resumen_en,
        img: dbEvent.img,
        descripcion: dbEvent.descripcion,
        descripcion_en: dbEvent.descripcion_en,
        siteId: dbEvent.site_id,
        lat: dbEvent.lat,
        lng: dbEvent.lng
    };
}
