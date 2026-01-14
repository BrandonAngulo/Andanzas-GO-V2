import React, { useState, useMemo } from 'react';
import { Evento, Site } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface EventosPanelProps {
  eventos: Evento[];
  query: string;
  sites: Site[];
  onOpenEvent: (event: Evento) => void;
}

const EventCard: React.FC<{ event: Evento; onOpenEvent: (event: Evento) => void }> = ({ event, onOpenEvent }) => {
  const { t, language } = useI18n();
  const dateObj = new Date(event.fecha);

  // Format: "Lun 14 Ene • 18:00"
  const dateStr = dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeStr = dateObj.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 group cursor-pointer" onClick={() => onOpenEvent(event)}>
      <div className="relative h-40 overflow-hidden">
        <LazyImage
          src={event.img}
          alt={getTranslated(event, 'titulo', language) as string}
          textFallback={getTranslated(event, 'titulo', language) as string}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {dateStr}
        </div>
      </div>

      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base leading-tight line-clamp-2 min-h-[2.5rem]">
          {getTranslated(event, 'titulo', language)}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs pt-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{getTranslated(event, 'lugar', language)}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 pt-2 flex-grow">
        <p className="text-xs text-muted-foreground line-clamp-3">
          {getTranslated(event, 'resumen', language) || getTranslated(event, 'descripcion', language)}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 mt-auto">
        <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border-none shadow-none">
          {t('seeMore')}
        </Button>
      </CardFooter>
    </Card>
  );
};

const EventosPanel: React.FC<EventosPanelProps> = ({ eventos, query, sites, onOpenEvent }) => {
  const { t, language } = useI18n();
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // --- 1. Extract Categories Safely ---
  const eventCategories = useMemo(() => {
    const categories = new Set<string>();
    eventos.forEach(event => {
      // Try to find the linked site to get its category
      let site = null;
      if (event.siteId) {
        site = sites.find(s => s.id === event.siteId);
      }
      // Fallback: Try match by name (legacy support)
      if (!site && event.lugar) {
        site = sites.find(s => s.nombre === event.lugar || s.nombre_en === event.lugar_en);
      }

      if (site) {
        const cat = getTranslated(site, 'tipo', language) as string;
        if (cat) categories.add(cat);
      } else {
        // Optional: Add 'Otros' or 'General' if no site linked? 
        // For now, ignoring unlinked events for categorization list to avoid clutter
      }
    });
    return ['all', ...Array.from(categories).sort()];
  }, [eventos, sites, language]);

  // --- 2. Filter Logic ---
  const filteredEvents = useMemo(() => {
    let result = [...eventos];

    // Helper to get start of day for comparisons
    const getStartOfDay = (d: Date) => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0);
      return copy;
    };

    const now = new Date();
    const todayStart = getStartOfDay(now);

    const nextWeek = new Date(todayStart);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // A. Filter by Query
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      result = result.filter(e =>
        (getTranslated(e, 'titulo', language) as string)?.toLowerCase().includes(q) ||
        (getTranslated(e, 'lugar', language) as string)?.toLowerCase().includes(q) ||
        (getTranslated(e, 'descripcion', language) as string)?.toLowerCase().includes(q)
      );
    }

    // B. Filter Past Events (Always applied: Hide events from yesterday or older)
    // We keep events from "today" regardless of time, to be safe.
    result = result.filter(e => {
      const eDate = new Date(e.fecha);
      return eDate >= todayStart;
    });

    // C. Apply Time Filters
    if (dateFilter === 'today') {
      result = result.filter(e => {
        const eDate = new Date(e.fecha);
        return getStartOfDay(eDate).getTime() === todayStart.getTime();
      });
    } else if (dateFilter === 'week') {
      result = result.filter(e => {
        const eDate = new Date(e.fecha);
        return eDate >= todayStart && eDate <= nextWeek;
      });
    }

    // D. Apply Category Filter
    if (categoryFilter !== 'all') {
      result = result.filter(e => {
        let site = sites.find(s => s.id === e.siteId);
        if (!site) site = sites.find(s => s.nombre === e.lugar || s.nombre_en === e.lugar_en);

        // If no site found, we can't categorize it, so filter it out if a specific category is selected
        if (!site) return false;

        const cat = getTranslated(site, 'tipo', language) as string;
        return cat === categoryFilter;
      });
    }

    // E. Sort by Date Ascending
    result.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    return result;
  }, [eventos, query, dateFilter, categoryFilter, language, sites]);

  return (
    <ScrollArea className="h-[72vh]">
      <div className="p-4 space-y-6">

        {/* Filters Header */}
        <div className="flex flex-col gap-3 bg-muted/40 p-3 rounded-xl border">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={dateFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateFilter('all')}
              className="rounded-full h-8 text-xs"
            >
              {t('eventosFilters.all')}
            </Button>
            <Button
              variant={dateFilter === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateFilter('today')}
              className="rounded-full h-8 text-xs"
            >
              {t('eventosFilters.today')}
            </Button>
            <Button
              variant={dateFilter === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateFilter('week')}
              className="rounded-full h-8 text-xs"
            >
              {t('eventosFilters.week')}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t('eventosFilters.category')}:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 max-w-[200px] text-xs">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat === 'all' ? t('eventosFilters.allCategories') : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between px-1">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('panelTitles.eventos')}
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filteredEvents.length}
            </span>
          </h3>
        </div>

        {/* Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onOpenEvent={onOpenEvent} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4 border-2 border-dashed rounded-xl border-muted">
            <Calendar className="h-12 w-12 text-muted-foreground/30" />
            <div className="space-y-1">
              <p className="font-medium">No se encontraron eventos</p>
              <p className="text-sm opacity-80">Prueba ajustando los filtros o tu búsqueda.</p>
            </div>
            {(dateFilter !== 'all' || categoryFilter !== 'all' || query) && (
              <Button variant="outline" size="sm" onClick={() => { setDateFilter('all'); setCategoryFilter('all'); }}>
                Limpiar filtros
              </Button>
            )}
          </div>
        )}

      </div>
    </ScrollArea>
  );
};

export default EventosPanel;
