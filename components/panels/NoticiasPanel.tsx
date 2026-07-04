import React, { useState, useMemo } from 'react';
import { FeedItem, Site } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

import { getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import StarRating from '../shared/StarRating';
import { Megaphone, MessageSquare, ArrowRight, Activity, Filter, MapPin } from 'lucide-react';
import { LazyImage } from '../ui/lazy-image';

const timeSince = (date: Date, t: (key: string, options?: any) => string): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return t('noticias.justNow') || 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('noticias.minutesAgo', { count: minutes });

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('noticias.hoursAgo', { count: hours });

    const days = Math.floor(hours / 24);
    return t('noticias.daysAgo', { count: days });
}

interface NoticiasPanelProps {
    feed: FeedItem[];
    onOpenSite: (site: Site) => void;
    sites: Site[];
}

const NoticiasPanel: React.FC<NoticiasPanelProps> = ({ feed, onOpenSite, sites }) => {
    const { t, language } = useI18n();
    const [filter, setFilter] = useState<'all' | 'anuncio' | 'publicacion_sitio' | 'reseña_usuario'>('all');

    const filteredFeed = useMemo(() => {
        if (filter === 'all') return feed;
        return feed.filter(item => item.type === filter);
    }, [feed, filter]);

    const renderFeedCard = (item: FeedItem) => {
        if (item.type === 'anuncio') {
            const Icon = item.icono || Megaphone;
            return (
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground group transition-transform duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-white/80">{t('noticias.announcement') || 'Anuncio'} • {timeSince(new Date(item.fecha), t)}</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 leading-tight">{getTranslated(item, 'titulo', language)}</h3>
                        <p className="text-primary-foreground/90 leading-relaxed text-sm">
                            {getTranslated(item, 'contenido', language)}
                        </p>
                    </CardContent>
                </Card>
            );
        }

        if (item.type === 'publicacion_sitio' && item.siteId) {
            const site = sites.find(s => s.id === item.siteId);
            if (!site) return null;
            return (
                <Card className="overflow-hidden border shadow-sm group hover:shadow-xl transition-all duration-300 bg-card rounded-2xl">
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                        <LazyImage
                            src={site.logoUrl}
                            alt={getTranslated(site, 'nombre', language) as string}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                            <LazyImage
                                src={site.logoUrl}
                                alt="Logo"
                                className="h-10 w-10 rounded-full border-2 border-white bg-white object-cover shadow-sm shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-white leading-tight truncate">{getTranslated(site, 'nombre', language)}</h4>
                                <p className="text-xs text-white/80 flex items-center gap-1 truncate"><MapPin className="h-3 w-3" /> Novedad • {timeSince(new Date(item.fecha), t)}</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-5">
                        <p className="text-muted-foreground text-[15px] mb-5 line-clamp-4 leading-relaxed">
                            {getTranslated(item, 'contenido', language)}
                        </p>
                        <Button variant="outline" className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors border-primary/20 bg-primary/5" onClick={() => onOpenSite(site)}>
                            {t('seeMore')} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        if (item.type === 'reseña_usuario' && item.review) {
            const site = sites.find(s => s.id === item.review?.siteId);
            if (!site) return null;
            return (
                <Card className="overflow-hidden border border-border/60 bg-muted/20 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardContent className="p-5">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                    {t('noticias.userReview') || 'Reseña de la Comunidad'} • {timeSince(new Date(item.fecha), t)}
                                </p>
                                <StarRating value={item.review.rating} />
                            </div>
                        </div>

                        <p className="italic text-foreground/90 text-[15px] leading-relaxed mb-5 relative z-10">
                            "{item.review.text}"
                        </p>

                        <div className="bg-card border rounded-xl p-2.5 flex items-center gap-3 hover:bg-muted/80 cursor-pointer transition-colors shadow-sm" onClick={() => onOpenSite(site)}>
                            <LazyImage src={site.logoUrl} alt={getTranslated(site, 'nombre', language) as string} className="h-10 w-10 rounded-lg object-cover bg-white" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{getTranslated(site, 'nombre', language)}</p>
                                <p className="text-xs text-muted-foreground truncate">Ver detalles del sitio</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground mr-1" />
                        </div>
                    </CardContent>
                </Card>
            );
        }
        return null;
    };

    return (
        <ScrollArea className="h-[72vh] bg-muted/10">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header Hero */}
                <div className="mb-6 pb-6 border-b flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                            <Activity className="h-8 w-8 text-primary" />
                            El Pulso de la Ciudad
                        </h2>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            Descubre lo último en cultura, anuncios oficiales y lo que otros usuarios están viviendo ahora mismo en Cali.
                        </p>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2">
                        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" className="rounded-full font-medium" onClick={() => setFilter('all')}>
                            Todos
                        </Button>
                        <Button variant={filter === 'anuncio' ? 'default' : 'outline'} size="sm" className="rounded-full font-medium" onClick={() => setFilter('anuncio')}>
                            📢 Anuncios
                        </Button>
                        <Button variant={filter === 'publicacion_sitio' ? 'default' : 'outline'} size="sm" className="rounded-full font-medium" onClick={() => setFilter('publicacion_sitio')}>
                            📍 Novedades
                        </Button>
                        <Button variant={filter === 'reseña_usuario' ? 'default' : 'outline'} size="sm" className="rounded-full font-medium" onClick={() => setFilter('reseña_usuario')}>
                            ⭐ Comunidad
                        </Button>
                    </div>
                </div>

                {/* Masonry / Grid for feed */}
                {filteredFeed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-card rounded-2xl border shadow-sm">
                        <Filter className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <p className="font-semibold text-xl text-foreground mb-1">No hay publicaciones</p>
                        <p className="text-sm">Intenta seleccionar otra categoría de filtro.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredFeed.map(item => (
                            <div key={item.id} className="break-inside-avoid shadow-sm rounded-2xl">
                                {renderFeedCard(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default NoticiasPanel;