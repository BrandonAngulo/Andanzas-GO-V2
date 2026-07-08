import { supabase } from '../lib/supabaseClient';
import { FeedItem } from '../types';
import { Megaphone, MapPin, Compass } from 'lucide-react';

const iconMap: Record<string, any> = {
    'Megaphone': Megaphone,
    'MapPin': MapPin,
    'Compass': Compass
};

export const newsService = {
    async getFeed(): Promise<FeedItem[]> {
        const { data, error } = await supabase
            .from('feed_items')
            .select('*')
            .order('fecha', { ascending: false }); // Using 'fecha' as mapped column

        if (error) {
            console.error('Error fetching feed:', error);
            return [];
        }
        return data.map(mapFeedItem);
    },

    // Admin methods
    async getAllAdmin(): Promise<FeedItem[]> {
        const { data, error } = await supabase
            .from('feed_items')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching admin news:', error);
            return [];
        }
        return data.map(mapFeedItem);
    },

    async getById(id: string): Promise<FeedItem | null> {
        const { data, error } = await supabase
            .from('feed_items')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching news by id:', error);
            return null;
        }
        return mapFeedItem(data);
    },

    async create(news: Partial<FeedItem>): Promise<FeedItem | null> {
        const { data, error } = await supabase
            .from('feed_items')
            .insert([unmapFeedItem(news)])
            .select()
            .single();
        if (error) {
            console.error('Error creating news:', error);
            return null;
        }
        return mapFeedItem(data);
    },

    async update(id: string, updates: Partial<FeedItem>): Promise<FeedItem | null> {
        const { data, error } = await supabase
            .from('feed_items')
            .update(unmapFeedItem(updates))
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error updating news:', error);
            return null;
        }
        return mapFeedItem(data);
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('feed_items')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting news:', error);
            return false;
        }
        return true;
    }
};

function unmapFeedItem(item: Partial<FeedItem>): any {
    const unmapped: any = {};
    if (item.type !== undefined) unmapped.type = item.type;
    if (item.fecha !== undefined) unmapped.fecha = item.fecha;
    if (item.titulo !== undefined) unmapped.titulo = item.titulo;
    if (item.titulo_en !== undefined) unmapped.titulo_en = item.titulo_en;
    if (item.contenido !== undefined) unmapped.contenido = item.contenido;
    if (item.contenido_en !== undefined) unmapped.contenido_en = item.contenido_en;
    if (item.siteId !== undefined) unmapped.site_id = item.siteId;
    if (item.status !== undefined) unmapped.status = item.status;
    
    // Reverse map icon
    if (item.icono) {
        const iconName = Object.keys(iconMap).find(key => iconMap[key] === item.icono);
        if (iconName) unmapped.icono_name = iconName;
    }
    
    return unmapped;
}

function mapFeedItem(dbItem: any): FeedItem {
    return {
        id: dbItem.id,
        type: dbItem.type as any,
        fecha: dbItem.fecha,
        titulo: dbItem.titulo,
        titulo_en: dbItem.titulo_en,
        siteId: dbItem.site_id,
        contenido: dbItem.contenido,
        contenido_en: dbItem.contenido_en,
        icono: dbItem.icono_name ? iconMap[dbItem.icono_name] : undefined,
        status: dbItem.status || 'draft'
    };
}
