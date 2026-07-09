import React, { useMemo, useState, useEffect } from 'react';
import { Site, Evento, CuriousFact } from '../../types';
import { curiositiesService } from '../../services/curiosities.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { getTranslated, getMacroCategory } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { Badge } from '../ui/badge';
import { CategoryCarousel } from '../shared/CategoryCarousel';
import { Accessibility, Ear, Eye, Compass, Music, Utensils, Paintbrush, BookOpen, Trees, Landmark, ArrowRight, Sparkles, Library, Map } from 'lucide-react';

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

// --- Reusable Card Components for the Feed ---

const SiteCard: React.FC<{ site: Site; onOpenSite: (site: Site) => void }> = ({ site, onOpenSite }) => {
  const { t, language } = useI18n();
  return (
    <Card className="overflow-hidden flex flex-col">
      <LazyImage
        src={site.logoUrl}
        alt={getTranslated(site, 'nombre', language) as string}
        textFallback={getTranslated(site, 'nombre', language) as string}
        className="w-full h-32 object-cover bg-muted"
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



const ExplorarPanel: React.FC<ExplorarPanelProps> = ({ sites, query, onOpenSite, onNavigateToRoutes, onOpenRoute, onNavigateToAprende }) => {
  const { language } = useI18n();

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [randomFact, setRandomFact] = useState<CuriousFact | null>(null);

  useEffect(() => {
    const loadFact = async () => {
      try {
        const facts = await curiositiesService.getPublished('home');
        if (facts && facts.length > 0) {
          // Select a random fact from the available ones for the home
          const randomIndex = Math.floor(Math.random() * facts.length);
          setRandomFact(facts[randomIndex]);
        }
      } catch (err) {
        console.error("Failed to load random fact", err);
      }
    };
    loadFact();
  }, []);

  const CATEGORY_TAGS = useMemo(() => [
    { id: 'salsa', filter: 'Salsa y Música', label: language === 'es' ? 'Salsa y Música' : 'Salsa & Music', icon: Music, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50' },
    { id: 'sabores', filter: 'Gastronomía', label: language === 'es' ? 'Gastronomía' : 'Gastronomy', icon: Utensils, color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50' },
    { id: 'arte', filter: 'Arte y Teatro', label: language === 'es' ? 'Arte y Teatro' : 'Art & Theater', icon: Paintbrush, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50' },
    { id: 'naturaleza', filter: 'Parques y Naturaleza', label: language === 'es' ? 'Parques y Naturaleza' : 'Parks & Nature', icon: Trees, color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50' },
    { id: 'cultura', filter: 'Museos y Cultura', label: language === 'es' ? 'Museos y Cultura' : 'Museums & Culture', icon: BookOpen, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' },
    { id: 'bibliotecas', filter: 'Bibliotecas y Librerías', label: language === 'es' ? 'Bibliotecas y Librerías' : 'Libraries & Bookstores', icon: Library, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50' },
    { id: 'historicos', filter: 'Sitios Históricos / Otros', label: language === 'es' ? 'Sitios Históricos' : 'Historic Sites', icon: Landmark, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' },
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
  }, [sites, query, language, categoryFilter]);

  return (
    <ScrollArea className="h-[72vh]">
      {!query && (
        <div className="relative p-6 md:p-10 mb-4 border-b overflow-hidden rounded-[2rem] bg-blue-50/50 dark:bg-blue-950/20 shadow-sm">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Decorative Background Elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 right-32 w-40 h-40 bg-sky-100 dark:bg-sky-900/30 rounded-full blur-2xl opacity-60"></div>
            
            {/* Vector Icons forming an illustration */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-80 hidden md:flex">
                <div className="relative w-40 h-40">
                    <Compass className="absolute inset-0 w-full h-full text-blue-200 dark:text-blue-800/40 drop-shadow-sm" strokeWidth={1} />
                    <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400 drop-shadow-sm animate-pulse" />
                    <Map className="absolute -bottom-2 -left-4 w-10 h-10 text-sky-400 drop-shadow-sm" />
                </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full max-w-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-2.5 rounded-2xl shadow-md text-white">
                      <Compass className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-950 dark:text-blue-50">
                      {language === 'es' ? '¿Qué querés vivir hoy en Cali?' : 'What do you want to experience today?'}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-medium">
                    {language === 'es' 
                      ? 'No somos solo un mapa. Elegí una experiencia y dejá que te guiemos paso a paso por lo mejor de la ciudad.'
                      : 'We are not just a map. Choose an experience and let us guide you step by step through the best of the city.'}
                  </p>
                  <CategoryCarousel 
                    categories={CATEGORY_TAGS.map(tag => ({
                      id: tag.filter,
                      label: tag.label,
                      icon: <tag.icon className="w-4 h-4" />
                    }))}
                    activeCategoryId={categoryFilter || ''}
                    onSelectCategory={(id) => setCategoryFilter(categoryFilter === id ? null : id)}
                    className="mb-0"
                  />
              </div>
          </div>
        </div>
      )}

      {/* Imperdibles Banners */}
      {!query && !categoryFilter && (
        <div className="px-4 md:px-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              {language === 'es' ? 'Imperdibles' : 'Must See'}
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
            {IMPERDIBLES.map(item => (
              <div 
                key={item.id} 
                className="min-w-[280px] md:min-w-[320px] snap-center shrink-0 cursor-pointer group rounded-2xl overflow-hidden relative shadow-md hover:shadow-xl transition-all"
                onClick={() => onOpenRoute && onOpenRoute({ id: item.id } as any)}
              >
                <LazyImage src={item.image} alt={item.title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <Badge className="w-fit mb-2 bg-primary/90 text-white border-none">{item.tag}</Badge>
                  <h4 className="text-white font-bold text-lg leading-tight mb-1">{item.title}</h4>
                  <p className="text-white/80 text-sm font-medium">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sabías que Banner */}
      {!query && !categoryFilter && randomFact && (
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
              <h4 className="font-bold text-lg text-primary mb-1">
                {randomFact.title || "Pa' que sepás"}
              </h4>
              <p className="text-sm text-foreground/80 font-medium mb-3">
                {randomFact.text}
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
