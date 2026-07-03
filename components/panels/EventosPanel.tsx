import React, { useState, useMemo } from 'react';
import { Evento, Site } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useI18n } from '../../i18n';
import { getTranslated, cn, getCategoryIcon, getMacroCategory } from '../../lib/utils';
import { Calendar, MapPin, Clock, Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '../ui/input';
import { LazyImage } from '../ui/lazy-image';

interface EventosPanelProps {
  eventos: Evento[];
  query: string;
  sites: Site[];
  onOpenEvent: (event: Evento) => void;
  onQueryChange?: (q: string) => void;
}

const getEventCategory = (event: Evento, sites: Site[], language: 'es' | 'en'): string => {
  let site = sites.find(s => s.id === event.siteId);
  if (!site && event.lugar) {
    site = sites.find(s => s.nombre === event.lugar || s.nombre_en === event.lugar_en);
  }
  return site ? getMacroCategory(getTranslated(site, 'tipo', language) as string, language) : (language === 'es' ? 'Evento' : 'Event');
};

const EventCard: React.FC<{ event: Evento; onOpenEvent: (event: Evento) => void; sites: Site[]; onCategoryClick?: (cat: string) => void }> = ({ event, onOpenEvent, sites, onCategoryClick }) => {
  const { t, language } = useI18n();
  const dateObj = new Date(event.fecha);

  const dayStr = dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: '2-digit' });
  const monthStr = dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short' }).toUpperCase();
  const timeStr = dateObj.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  const category = getEventCategory(event, sites, language);
  const isPast = dateObj.getTime() < new Date().getTime();

  return (
    <Card
      className={cn(
        "overflow-hidden flex flex-col group cursor-pointer border shadow-sm hover:shadow-md transition-all duration-300 bg-card rounded-2xl",
        isPast ? "opacity-75 grayscale-[0.3]" : ""
      )}
      onClick={() => onOpenEvent(event)}
    >
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        {event.img ? (
          <img src={event.img} alt={event.titulo} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40">
            <Calendar className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-md px-2 py-1.5 rounded-lg shadow-sm flex flex-col items-center justify-center border leading-none">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{monthStr}</span>
          <span className="text-base font-extrabold">{dayStr}</span>
        </div>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span 
            className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-primary/10 text-primary border border-primary/20"
            onClick={(e) => {
              e.stopPropagation();
              if (onCategoryClick) onCategoryClick(category);
            }}
          >
            {category}
          </span>
          {isPast && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
              Evento Pasado
            </span>
          )}
        </div>

        <CardTitle className="text-base leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {getTranslated(event, 'titulo', language)}
        </CardTitle>

        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
            {timeStr}
          </div>
          <div className="flex items-start text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary/70 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{getTranslated(event, 'lugar', language)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors border-primary/20 bg-primary/5">
          {t('seeMore')} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const EventosPanel: React.FC<EventosPanelProps> = ({ eventos, query, sites, onOpenEvent, onQueryChange }) => {
  const { t, language } = useI18n();
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [specificDate, setSpecificDate] = useState<string>('');

  // --- 1. Extract Categories Safely ---
  const eventCategories = useMemo(() => {
    const categories = new Set<string>();
    eventos.forEach(event => {
      categories.add(getEventCategory(event, sites, language));
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

    // B. (Removed) We no longer hide past events. We keep them and sort them to the end.

    // C. Apply Time Filters
    if (specificDate) {
      const specDateParts = specificDate.split('-');
      if (specDateParts.length === 3) {
        const specD = new Date(parseInt(specDateParts[0]), parseInt(specDateParts[1]) - 1, parseInt(specDateParts[2]));
        result = result.filter(e => {
          const eDate = new Date(e.fecha);
          return getStartOfDay(eDate).getTime() === specD.getTime();
        });
      }
    } else if (dateFilter === 'today') {
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
        return getEventCategory(e, sites, language) === categoryFilter;
      });
    }

    // E. Sort by Date: Upcoming first, then Past at the end.
    result.sort((a, b) => {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();
      const nowTime = now.getTime();

      const isAPast = dateA < nowTime;
      const isBPast = dateB < nowTime;

      if (isAPast && !isBPast) return 1; // A past, B future -> B first
      if (!isAPast && isBPast) return -1; // A future, B past -> A first
      
      // Both future: closest to now first
      if (!isAPast && !isBPast) {
        return dateA - dateB;
      }
      
      // Both past: most recently past first
      return dateB - dateA;
    });

    return result;
  }, [eventos, query, dateFilter, categoryFilter, specificDate, language, sites]);

  return (
    <ScrollArea className="h-[72vh] bg-muted/10">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Header Hero */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Cartelera Cultural</h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Cali vibra con cultura todos los días. Explora lo que está ocurriendo hoy, lo que se viene o ese plan perfecto a tu medida. Filtra, elige y disfruta.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-card p-5 rounded-2xl border shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filtrado por:
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Buscar evento:</label>
                  <Input 
                    type="text"
                    placeholder="Ej. Concierto, Salsa..."
                    value={query}
                    onChange={(e) => {
                      if (e.target.value) {
                         // Fallback to internal if prop not passed
                         // We just use query prop via parent, but EventosPanel doesn't update query itself
                         // so it relies on the top-level search bar. Let's make this read-only or pass onQueryChange
                         if (onQueryChange) onQueryChange(e.target.value);
                      }
                    }}
                    className="bg-muted/50 rounded-xl"
                  />
                  <div className="text-xs text-muted-foreground text-right">{filteredEvents.length} eventos</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Fecha específica:</label>
                  <input 
                    type="date" 
                    value={specificDate}
                    onChange={(e) => { setSpecificDate(e.target.value); setDateFilter('all'); }}
                    className="flex h-10 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Rango de fechas:</label>
                  <div className="flex flex-col gap-2">
                    <Button variant={dateFilter === 'all' && !specificDate ? 'default' : 'outline'} className="rounded-xl justify-start" onClick={() => { setDateFilter('all'); setSpecificDate(''); }}>Todos</Button>
                    <Button variant={dateFilter === 'today' && !specificDate ? 'default' : 'outline'} className="rounded-xl justify-start" onClick={() => { setDateFilter('today'); setSpecificDate(''); }}>Eventos de Hoy</Button>
                    <Button variant={dateFilter === 'week' && !specificDate ? 'default' : 'outline'} className="rounded-xl justify-start" onClick={() => { setDateFilter('week'); setSpecificDate(''); }}>Esta Semana</Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Tipo de evento:</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full bg-muted/50 rounded-xl">
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'all' ? 'Todos los tipos' : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Event Grid */}
          <div className="flex-1">
            {/* Quick Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {eventCategories.filter(c => c !== 'all').map(cat => (
                <Button 
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'} 
                  size="sm"
                  className="rounded-full bg-background hover:bg-muted"
                  onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                >
                  <span className="mr-2 text-primary">{getCategoryIcon(cat)}</span>
                  {cat}
                </Button>
              ))}
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} onOpenEvent={onOpenEvent} sites={sites} onCategoryClick={setCategoryFilter} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground space-y-4 bg-card rounded-2xl border shadow-sm">
                <Calendar className="h-16 w-16 text-muted-foreground/30" />
                <div className="space-y-1">
                  <p className="font-semibold text-lg text-foreground">No hay eventos para esta selección</p>
                  <p className="text-sm">Intenta cambiando las fechas o categorías para descubrir más planes.</p>
                </div>
                <Button variant="default" className="mt-4 rounded-xl" onClick={() => { setDateFilter('all'); setCategoryFilter('all'); setSpecificDate(''); }}>
                  Limpiar todos los filtros
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </ScrollArea>
  );
};

export default EventosPanel;
