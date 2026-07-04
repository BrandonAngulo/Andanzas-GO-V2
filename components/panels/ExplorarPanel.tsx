import React, { useMemo, useState } from 'react';
import { Site, Evento } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { getTranslated, getMacroCategory } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { Badge } from '../ui/badge';
import { Accessibility, Ear, Eye, Compass, Music, Utensils, Paintbrush, BookOpen, Trees, Landmark, ArrowRight, Sparkles } from 'lucide-react';

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
        <div>{getMacroCategory(getTranslated(site, 'tipo', language) as string, language)} · ⭐ {site.rating}</div>
        {site.accessibility_features && site.accessibility_features.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {site.accessibility_features.includes('wheelchair') && (
              <Badge variant="secondary" className="px-1 py-0 cursor-help" title={language === 'es' ? "Acceso para silla de ruedas" : "Wheelchair access"}>
                <Accessibility className="w-3 h-3 text-blue-600" />
              </Badge>
            )}
            {site.accessibility_features.includes('audio_guide') && (
              <Badge variant="secondary" className="px-1 py-0 cursor-help" title={language === 'es' ? "Audioguía disponible" : "Audio guide available"}>
                <Ear className="w-3 h-3 text-purple-600" />
              </Badge>
            )}
            {site.accessibility_features.includes('braille') && (
              <Badge variant="secondary" className="px-1 py-0 cursor-help" title={language === 'es' ? "Señalización en Braille" : "Braille signage"}>
                <Eye className="w-3 h-3 text-green-600" />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button size="sm" variant="outline" onClick={() => onOpenSite(site)}>{t('seeMore')}</Button>
      </CardFooter>
    </Card>
  );
};

interface ExplorarPanelProps {
  sites: Site[];
  query: string;
  onOpenSite: (site: Site) => void;
  onNavigateToRoutes?: () => void;
  onOpenRoute?: (route: any) => void;
  onNavigateToAprende?: () => void;
}

const IMPERDIBLES = [
  {
    id: 'route-salsa',
    title: 'Ruta de la Salsa: Obrero',
    subtitle: 'Historia y ritmo en el corazón de Cali',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000&auto=format&fit=crop',
    tag: 'Ruta Recomendada'
  },
  {
    id: 'route-food',
    title: 'Fogones de la Memoria',
    subtitle: 'El talento de los sabores vallecaucanos',
    image: 'https://images.unsplash.com/photo-1628267280784-884d5df68c2e?q=80&w=1000&auto=format&fit=crop',
    tag: 'Ruta Gastronómica'
  },
  {
    id: 'route-art',
    title: 'Pinceles de la Calle',
    subtitle: 'Arte urbano y memoria viva',
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=1000&auto=format&fit=crop',
    tag: 'Ruta Visual'
  }
];

const ExplorarPanel: React.FC<ExplorarPanelProps> = ({ sites, query, onOpenSite, onNavigateToRoutes, onOpenRoute, onNavigateToAprende }) => {
  const { language } = useI18n();

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const CATEGORY_TAGS = useMemo(() => [
    { id: 'salsa', filter: 'Salsa y Música', label: language === 'es' ? 'Salsa y Música' : 'Salsa & Music', icon: Music, color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
    { id: 'sabores', filter: 'Gastronomía', label: language === 'es' ? 'Gastronomía' : 'Gastronomy', icon: Utensils, color: 'bg-red-500/10 text-red-600 border-red-200' },
    { id: 'arte', filter: 'Arte y Teatro', label: language === 'es' ? 'Arte y Teatro' : 'Art & Theater', icon: Paintbrush, color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
    { id: 'naturaleza', filter: 'Parques y Naturaleza', label: language === 'es' ? 'Naturaleza' : 'Nature', icon: Trees, color: 'bg-green-500/10 text-green-600 border-green-200' },
    { id: 'cultura', filter: 'Museos y Cultura', label: language === 'es' ? 'Cultura' : 'Culture', icon: BookOpen, color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
    { id: 'historicos', filter: 'Sitios Históricos / Otros', label: language === 'es' ? 'Históricos' : 'Historic', icon: Landmark, color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  ], [language]);

  // Show sites in a feed and shuffle it for variety
  const feedItems = useMemo(() => {
    // Filter by query if present
    const normalizedQuery = query.toLowerCase().trim();

    let filteredSites = sites;

    if (categoryFilter) {
      filteredSites = filteredSites.filter(s => getMacroCategory(getTranslated(s, 'tipo', 'es') as string, 'es') === categoryFilter);
    }

    if (normalizedQuery) {
      filteredSites = filteredSites.filter(s => {
        const name = (getTranslated(s, 'nombre', language) as string).toLowerCase();
        const type = getMacroCategory(getTranslated(s, 'tipo', language) as string, language).toLowerCase();
        const desc = (getTranslated(s, 'descripcion', language) as string).toLowerCase();
        return name.includes(normalizedQuery) || type.includes(normalizedQuery) || desc.includes(normalizedQuery);
      });
    }

    const sitesWithType = filteredSites.map(s => ({ type: 'site' as const, data: s, id: s.id }));

    const combined = [...sitesWithType];

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
  }, [sites, query, language]);

  return (
    <ScrollArea className="h-[72vh]">
      {!query && (
        <div className="p-5 md:p-8 bg-gradient-to-br from-primary/10 via-background to-background mb-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded-full">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {language === 'es' ? '¿Qué querés vivir hoy en Cali?' : 'What do you want to experience today?'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            {language === 'es' 
              ? 'No somos solo un mapa. Elegí una experiencia y dejá que te guiemos paso a paso por lo mejor de la ciudad.'
              : 'We are not just a map. Choose an experience and let us guide you step by step through the best of the city.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {CATEGORY_TAGS.map(tag => {
              const Icon = tag.icon;
              const isActive = categoryFilter === tag.filter;
              return (
                <button
                  key={tag.id}
                  onClick={() => setCategoryFilter(isActive ? null : tag.filter)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all hover:scale-105 active:scale-95 hover:shadow-md ${isActive ? 'bg-primary text-primary-foreground border-primary shadow-md' : tag.color + ' bg-background'}`}
                >
                  <Icon className="w-5 h-5" />
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Carrusel de Imperdibles */}
      {!query && !categoryFilter && (
        <div className="mb-8 overflow-hidden">
          <div className="px-5 md:px-8 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-lg text-foreground">
              {language === 'es' ? 'Imperdibles esta semana' : 'Must-sees this week'}
            </h3>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 px-5 md:px-8 gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {IMPERDIBLES.map(item => (
              <div 
                key={item.id} 
                className="snap-center shrink-0 w-[85vw] md:w-[45vw] lg:w-[400px] max-w-[500px] h-[250px] relative rounded-2xl overflow-hidden cursor-pointer group shadow-md"
                onClick={() => onOpenRoute?.({ id: item.id })}
              >
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {item.tag}
                  </span>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="text-2xl font-extrabold leading-tight mb-1">{item.title}</h4>
                  <p className="text-white/80 text-sm mb-3">{item.subtitle}</p>
                  <Button variant="secondary" size="sm" className="rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-sm border-0 transition-colors">
                    Descubrir <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
            {/* Pseudo-element to ensure padding at the end of the scroll container */}
            <div className="snap-center shrink-0 w-4 h-full" />
          </div>
          
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      )}

      {/* Sabías que Banner */}
      {!query && !categoryFilter && (
        <div className="px-5 md:px-8 mb-8">
          <div 
            className="bg-card border border-primary/20 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all group flex items-start gap-4 relative overflow-hidden"
            onClick={onNavigateToAprende}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BookOpen className="w-24 h-24 text-primary" />
            </div>
            
            <div className="bg-primary/10 p-3 rounded-full shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1 relative z-10">
              <h4 className="font-bold text-lg text-primary mb-1">Pa' que sepás</h4>
              <p className="text-sm text-foreground/80 font-medium mb-3">
                ¿Sabías que en los años 70, los caleños aceleraban los discos de vinilo de salsa a 45 rpm para bailarla más rápido?
              </p>
              <div className="flex items-center text-xs font-bold text-primary group-hover:underline">
                Aprender más sobre cultura local <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-4 md:px-8 pb-4">
        {(query || categoryFilter) && (
          <div className="flex items-center justify-between mb-3 ml-1">
            <h3 className="font-semibold text-lg text-muted-foreground">Resultados de búsqueda</h3>
            {categoryFilter && (
               <Button variant="ghost" size="sm" onClick={() => setCategoryFilter(null)} className="h-8 text-xs text-muted-foreground">Limpiar filtro</Button>
            )}
          </div>
        )}
        {!query && !categoryFilter && (
          <h3 className="font-semibold text-lg mb-4 ml-1">Lugares Destacados</h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedItems.length > 0 ? (
          feedItems.map((item) => {
            if (item.type === 'site') {
              return <SiteCard key={`site-${item.id}`} site={item.data} onOpenSite={onOpenSite} />;
            }
            return null;
          })
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No se encontraron resultados para "{query}"
          </div>
        )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ExplorarPanel;
