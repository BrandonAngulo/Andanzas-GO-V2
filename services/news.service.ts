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
    }
};

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
        icono: dbItem.icono_name ? iconMap[dbItem.icono_name] : undefined
    };
}
