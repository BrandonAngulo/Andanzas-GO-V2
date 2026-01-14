import React, { useState, useMemo } from 'react';
import { Evento, Site } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';

interface EventosPanelProps {
  eventos: Evento[];
  query: string;
  sites: Site[]; // Needed for category lookup
  onOpenEvent: (event: Evento) => void;
}

const EventCard: React.FC<{ event: Evento; onOpenEvent: (event: Evento) => void }> = ({ event, onOpenEvent }) => {
  const { t, language } = useI18n();
  return (
    <Card className="overflow-hidden flex flex-col">
      <LazyImage
        src={event.img}
        alt={getTranslated(event, 'titulo', language) as string}
        className="w-full h-32 object-cover"
      />
      <CardHeader className="py-2">
        <CardTitle className="text-sm leading-tight truncate">{getTranslated(event, 'titulo', language)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow -mt-2 text-xs text-muted-foreground">
        {new Date(event.fecha).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {getTranslated(event, 'lugar', language)}
      </CardContent>
      <CardFooter className="pt-2">
        <Button size="sm" onClick={() => onOpenEvent(event)}>{t('seeMore')}</Button>
      </CardFooter>
    </Card>
  );
};

const EventosPanel: React.FC<EventosPanelProps> = ({ eventos, query, sites, onOpenEvent }) => {
  const { t, language } = useI18n();
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const eventCategories = useMemo(() => {
    const categories = new Set<string>();
    eventos.forEach(event => {
      const site = sites.find(s => s.id === event.siteId) || sites.find(s => s.nombre === event.lugar || s.nombre_en === event.lugar_en);
      if (site) {
        categories.add(getTranslated(site, 'tipo', language) as string);
      }
    });
    return ['all', ...Array.from(categories).sort()];
  }, [language, eventos, sites]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfToday = new Date(today);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const normalizedQuery = query.toLowerCase().trim();

    const filtered = eventos.filter(event => {
      // 0. Query Filter
      if (normalizedQuery) {
        const title = (getTranslated(event, 'titulo', language) as string).toLowerCase();
        const place = (getTranslated(event, 'lugar', language) as string).toLowerCase();
        const desc = (getTranslated(event, 'descripcion', language) as string).toLowerCase();

        if (!title.includes(normalizedQuery) && !place.includes(normalizedQuery) && !desc.includes(normalizedQuery)) {
          return false;
        }
      }

      // 1. Time parsing
      const dateString = event.fecha.includes('T') ? event.fecha : `${event.fecha}T00:00:00`;
      const eventDate = new Date(dateString);

      // 2. Global Filter: No past events
      if (eventDate < startOfToday) return false;

      // 3. Date filtering
      if (dateFilter === 'today') {
        if (eventDate.toDateString() !== today.toDateString()) return false;
      } else if (dateFilter === 'week') {
        if (eventDate > endOfWeek) return false;
      }

      // 4. Category filtering
      if (categoryFilter !== 'all') {
        const site = sites.find(s => s.id === event.siteId) || sites.find(s => s.nombre === event.lugar || s.nombre_en === event.lugar_en);
        if (!site || (getTranslated(site, 'tipo', language) as string) !== categoryFilter) return false;
      }

      return true;
    });

    // Sort by date ascending (soonest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.fecha.includes('T') ? a.fecha : `${a.fecha}T00:00:00`).getTime();
      const dateB = new Date(b.fecha.includes('T') ? b.fecha : `${b.fecha}T00:00:00`).getTime();
      return dateA - dateB;
    });

  }, [eventos, sites, dateFilter, categoryFilter, language, query]);

  return (
    <ScrollArea className="h-[72vh]">
      <div className="p-3">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
          <div className="flex items-center gap-1">
            <Button size="sm" variant={dateFilter === 'all' ? 'default' : 'ghost'} onClick={() => setDateFilter('all')}>{t('eventosFilters.all')}</Button>
            <Button size="sm" variant={dateFilter === 'today' ? 'default' : 'ghost'} onClick={() => setDateFilter('today')}>{t('eventosFilters.today')}</Button>
            <Button size="sm" variant={dateFilter === 'week' ? 'default' : 'ghost'} onClick={() => setDateFilter('week')}>{t('eventosFilters.week')}</Button>
          </div>
          <div className="flex-1 min-w-[150px]">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder={t('eventosFilters.category')} />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? t('eventosFilters.allCategories') : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onOpenEvent={onOpenEvent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-2">{query ? `No se encontraron eventos para "${query}"` : t('eventosFilters.noEvents')}</p>
            {dateFilter !== 'all' && (
              <Button variant="outline" size="sm" onClick={() => setDateFilter('all')}>
                Ver todos los eventos
              </Button>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default EventosPanel;
