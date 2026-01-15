import React, { useMemo } from 'react';
import { Site, Evento } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { Badge } from '../ui/badge';
import { Accessibility, Ear, Eye } from 'lucide-react';

// --- Reusable Card Components for the Feed ---

const SiteCard: React.FC<{ site: Site; onOpenSite: (site: Site) => void }> = ({ site, onOpenSite }) => {
  const { t, language } = useI18n();
  return (
    <Card className="overflow-hidden flex flex-col">
      <LazyImage
        src={site.logoUrl}
        alt={getTranslated(site, 'nombre', language) as string}
        textFallback={getTranslated(site, 'nombre', language) as string}
        className="w-full h-32 object-cover bg-white"
      />
      <CardHeader className="py-2">
        <CardTitle className="text-sm leading-tight truncate">{getTranslated(site, 'nombre', language)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow -mt-2 text-xs text-muted-foreground space-y-2">
        <div>{getTranslated(site, 'tipo', language)} · ⭐ {site.rating}</div>
        {site.accessibility_features && site.accessibility_features.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {site.accessibility_features.includes('wheelchair') && <Badge variant="secondary" className="px-1 py-0"><Accessibility className="w-3 h-3 text-blue-600" /></Badge>}
            {site.accessibility_features.includes('audio_guide') && <Badge variant="secondary" className="px-1 py-0"><Ear className="w-3 h-3 text-purple-600" /></Badge>}
            {site.accessibility_features.includes('braille') && <Badge variant="secondary" className="px-1 py-0"><Eye className="w-3 h-3 text-green-600" /></Badge>}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button size="sm" variant="outline" onClick={() => onOpenSite(site)}>{t('seeMore')}</Button>
      </CardFooter>
    </Card>
  );
};

const EventCard: React.FC<{ event: Evento; onOpenEvent: (event: Evento) => void }> = ({ event, onOpenEvent }) => {
  const { t, language } = useI18n();
  return (
    <Card className="overflow-hidden flex flex-col">
      <LazyImage
        src={event.img}
        alt={getTranslated(event, 'titulo', language) as string}
        textFallback={getTranslated(event, 'titulo', language) as string}
        className="w-full h-32 object-cover"
      />
      <CardHeader className="py-2">
        <CardTitle className="text-sm leading-tight truncate">{getTranslated(event, 'titulo', language)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow -mt-2 text-xs text-muted-foreground">
        {new Date(event.fecha).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')} · {getTranslated(event, 'lugar', language)}
      </CardContent>
      <CardFooter className="pt-2">
        <Button size="sm" onClick={() => onOpenEvent(event)}>{t('seeMore')}</Button>
      </CardFooter>
    </Card>
  );
};

interface ExplorarPanelProps {
  sites: Site[];
  events: Evento[];
  query: string;
  onOpenSite: (site: Site) => void;
  onOpenEvent: (event: Evento) => void;
}

const ExplorarPanel: React.FC<ExplorarPanelProps> = ({ sites, events, query, onOpenSite, onOpenEvent }) => {
  const { language } = useI18n();

  // Combine sites and events into a single feed and shuffle it for variety
  const feedItems = useMemo(() => {
    // Filter by query if present
    const normalizedQuery = query.toLowerCase().trim();

    let filteredSites = sites;
    let filteredEvents = events;

    if (normalizedQuery) {
      filteredSites = sites.filter(s => {
        const name = (getTranslated(s, 'nombre', language) as string).toLowerCase();
        const type = (getTranslated(s, 'tipo', language) as string).toLowerCase();
        const desc = (getTranslated(s, 'descripcion', language) as string).toLowerCase();
        return name.includes(normalizedQuery) || type.includes(normalizedQuery) || desc.includes(normalizedQuery);
      });

      filteredEvents = events.filter(e => {
        const title = (getTranslated(e, 'titulo', language) as string).toLowerCase();
        const place = (getTranslated(e, 'lugar', language) as string).toLowerCase();
        return title.includes(normalizedQuery) || place.includes(normalizedQuery);
      });
    }

    const sitesWithType = filteredSites.map(s => ({ type: 'site' as const, data: s, id: s.id }));

    // Filter events to only show future ones
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const eventsWithType = filteredEvents
      .filter(e => {
        const dateString = e.fecha.includes('T') ? e.fecha : `${e.fecha}T00:00:00`;
        return new Date(dateString) >= startOfToday;
      }) // Don't show past events in explore feed
      .map(e => ({ type: 'event' as const, data: e, id: e.id }));

    const combined = [...sitesWithType, ...eventsWithType];

    // Simple shuffle function (Fisher-Yates) - only shuffle if no query to keep relevance? 
    // Actually shuffling is fine for exploration, but maybe better to keep relevance if searching.
    // For now, let's keep shuffle for consistency with original design, but maybe skip if searching to show matches clearly.
    if (!normalizedQuery) {
      for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
      }
    }

    return combined;
  }, [sites, events, query, language]);

  return (
    <ScrollArea className="h-[72vh]">
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedItems.length > 0 ? (
          feedItems.map((item) => {
            if (item.type === 'site') {
              return <SiteCard key={`site-${item.id}`} site={item.data} onOpenSite={onOpenSite} />;
            }
            if (item.type === 'event') {
              return <EventCard key={`event-${item.id}`} event={item.data} onOpenEvent={onOpenEvent} />;
            }
            return null;
          })
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No se encontraron resultados para "{query}"
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ExplorarPanel;
