import React, { useState, useMemo } from 'react';
import { Evento, Site } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useI18n } from '../../i18n';
import { getTranslated, cn } from '../../lib/utils';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface EventosPanelProps {
  eventos: Evento[];
  query: string;
  sites: Site[];
  onOpenEvent: (event: Evento) => void;
}

const EventCard: React.FC<{ event: Evento; onOpenEvent: (event: Evento) => void; sites: Site[] }> = ({ event, onOpenEvent, sites }) => {
  const { t, language } = useI18n();
  const dateObj = new Date(event.fecha);

  // Format: "14 Ene", "18:00"
  const dayStr = dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric' });
  const monthStr = dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short' }).toUpperCase();
  const weekdayStr = dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long' });
  const timeStr = dateObj.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  // Find linked site for category
  let site = sites.find(s => s.id === event.siteId);
  if (!site && event.lugar) {
    site = sites.find(s => s.nombre === event.lugar || s.nombre_en === event.lugar_en);
  }
  const category = site ? (getTranslated(site, 'tipo', language) as string) : (language === 'es' ? 'Evento' : 'Event');

  // Generate color based on category
  const getCategoryColor = (cat: string) => {
    if (!cat) return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
    const colors = [
      "border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/20",
      "border-l-rose-500 bg-rose-50 dark:bg-rose-950/20",
      "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
      "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20",
      "border-l-cyan-500 bg-cyan-50 dark:bg-cyan-950/20",
      "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20",
    ];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const colorClass = getCategoryColor(category);

  return (
    <Card
      className={cn(
        "overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group cursor-pointer border-l-4",
        colorClass.split(' ')[0], // Only use the border color for the card's border prop
        "bg-card" // base background
      )}
      onClick={() => onOpenEvent(event)}
    >
      <CardHeader className={cn("p-4 pb-2 flex flex-row items-start gap-4 space-y-0 relative overflow-hidden")}>
        {/* Subtle background int for header only if desired, or keep clean */}
        <div className={cn("absolute inset-0 opacity-30 pointer-events-none", colorClass.split(' ')[1])} />

        {/* Date Box */}
        <div className="relative z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm border rounded-lg p-2 min-w-[3.5rem] shadow-sm text-center">
          <span className="text-xs font-bold text-muted-foreground uppercase">{monthStr}</span>
          <span className="text-xl font-extrabold leading-none">{dayStr}</span>
        </div>

        <div className="relative z-10 flex-1 min-w-0">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-1">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-background/50 border shadow-sm text-foreground/80")}>
              {category}
            </span>
          </div>

          <CardTitle className="text-lg leading-snug line-clamp-2 mb-1">
            {getTranslated(event, 'titulo', language)}
          </CardTitle>

          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {timeStr}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
          <span className="truncate font-medium">{getTranslated(event, 'lugar', language)}</span>
        </div>

        <p className="text-sm text-muted-foreground/90 line-clamp-3 leading-relaxed">
          {getTranslated(event, 'resumen', language) || getTranslated(event, 'descripcion', language)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="w-full pt-3 border-t border-dashed flex justify-between items-center text-xs">
          <span className="text-muted-foreground capitalize font-medium">{weekdayStr}</span>

          <span className="font-medium text-primary flex items-center group-hover:underline">
            {t('seeMore')}
            <span className="ml-1 text-[10px]">→</span>
          </span>
        </div>
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

        // If no site found, we can't categorize it to a specific category, 
        // unless maybe we implement a 'Sin Categoría' bucket, for now we filter it out.
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
              <EventCard key={event.id} event={event} onOpenEvent={onOpenEvent} sites={sites} />
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
