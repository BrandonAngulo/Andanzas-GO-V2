import { supabase } from '../lib/supabaseClient';
import { Evento } from '../types';

export const eventsService = {
    async getAll(): Promise<Evento[]> {
        console.log('EventsService: Fetching all events...');
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('fecha', { ascending: true });

        if (error) {
            console.error('EventsService Error:', error);
            return [];
        }

        console.log(`EventsService: Fetched ${data?.length} events.`);
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
