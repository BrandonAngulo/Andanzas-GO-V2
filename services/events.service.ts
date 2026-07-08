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
    },

    // Admin methods
    async getAllAdmin(): Promise<Evento[]> {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching admin events:', error);
            return [];
        }
        return data.map(mapEvent);
    },

    async create(evento: Partial<Evento>): Promise<Evento | null> {
        const { data, error } = await supabase
            .from('events')
            .insert([unmapEvent(evento)])
            .select()
            .single();
        if (error) {
            console.error('Error creating event:', error);
            return null;
        }
        return mapEvent(data);
    },

    async update(id: string, updates: Partial<Evento>): Promise<Evento | null> {
        const { data, error } = await supabase
            .from('events')
            .update(unmapEvent(updates))
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error updating event:', error);
            return null;
        }
        return mapEvent(data);
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting event:', error);
            return false;
        }
        return true;
    }
};

function unmapEvent(evento: Partial<Evento>): any {
    const unmapped: any = {};
    // events table uses BIGINT for id, so skip it for insert unless needed
    if (evento.titulo !== undefined) unmapped.titulo = evento.titulo;
    if (evento.titulo_en !== undefined) unmapped.titulo_en = evento.titulo_en;
    if (evento.fecha !== undefined) unmapped.fecha = evento.fecha;
    if (evento.lugar !== undefined) unmapped.lugar = evento.lugar;
    if (evento.lugar_en !== undefined) unmapped.lugar_en = evento.lugar_en;
    if (evento.resumen !== undefined) unmapped.resumen = evento.resumen;
    if (evento.resumen_en !== undefined) unmapped.resumen_en = evento.resumen_en;
    if (evento.img !== undefined) unmapped.img = evento.img;
    if (evento.descripcion !== undefined) unmapped.descripcion = evento.descripcion;
    if (evento.descripcion_en !== undefined) unmapped.descripcion_en = evento.descripcion_en;
    if (evento.siteId !== undefined) unmapped.site_id = evento.siteId;
    if (evento.lat !== undefined) unmapped.lat = evento.lat;
    if (evento.lng !== undefined) unmapped.lng = evento.lng;
    if (evento.status !== undefined) unmapped.status = evento.status;
    return unmapped;
}

function mapEvent(dbEvent: any): Evento {
    return {
        id: String(dbEvent.id),
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
        lng: dbEvent.lng,
        status: dbEvent.status || (dbEvent.is_published ? 'published' : 'draft')
    };
}
