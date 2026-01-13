import React from 'react';
import { FeedItem, Site } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

import { getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import StarRating from '../shared/StarRating';
import { Megaphone, MessageSquare } from 'lucide-react';

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

    if (feed.length === 0) {
        // ... (existing empty state)
        return (
            <div className="h-[72vh] grid place-items-center text-center p-6">
                <div>
                    <h3 className="text-lg font-semibold">{t('noticias.emptyTitle')}</h3>
                    <p className="text-muted-foreground">{t('noticias.emptyDescription')}</p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[72vh]">
            <div className="p-3 space-y-4 max-w-2xl mx-auto">
                {feed.map(item => {
                    if (item.type === 'anuncio') {
                        const Icon = item.icono || Megaphone;
                        return (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Icon className="h-5 w-5 text-primary" />
                                        <span>{getTranslated(item, 'titulo', language)}</span>
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground pt-1">{t('noticias.announcement')} · {timeSince(new Date(item.fecha), t)}</p>
                                </CardHeader>
                                <CardContent>
                                    <p>{getTranslated(item, 'contenido', language)}</p>
                                </CardContent>
                            </Card>
                        );
                    }
                    if (item.type === 'publicacion_sitio' && item.siteId) {
                        const site = sites.find(s => s.id === item.siteId);
                        if (!site) return null;
                        return (
                            <Card key={item.id}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <img src={site.logoUrl} alt={getTranslated(site, 'nombre', language) as string} className="h-10 w-10 rounded-full object-cover bg-white" />
                                        <div>
                                            <p className="font-semibold">{getTranslated(site, 'nombre', language)}</p>
                                            <p className="text-xs text-muted-foreground">{t('noticias.sitePost')} · {timeSince(new Date(item.fecha), t)}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>{getTranslated(item, 'contenido', language)}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" onClick={() => onOpenSite(site)}>{t('seeMore')}</Button>
                                </CardFooter>
                            </Card>
                        );
                    }
                    if (item.type === 'reseña_usuario' && item.review) {
                        const site = sites.find(s => s.id === item.review?.siteId);
                        if (!site) return null;
                        return (
                            <Card key={item.id}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{t('noticias.userReview')}</p>
                                            <p className="text-xs text-muted-foreground">{t('noticias.postedAt')} <b>{getTranslated(site, 'nombre', language)}</b> · {timeSince(new Date(item.fecha), t)}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-2">
                                        <StarRating value={item.review.rating} />
                                    </div>
                                    <p className="italic">"{item.review.text}"</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" onClick={() => onOpenSite(site)}>{t('seeMore')}</Button>
                                </CardFooter>
                            </Card>
                        );
                    }
                    return null;
                })}
            </div>
        </ScrollArea>
    );
};

export default NoticiasPanel;