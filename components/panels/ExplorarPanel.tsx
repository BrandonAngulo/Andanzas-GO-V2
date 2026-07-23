import React, { useMemo, useState, useEffect } from 'react';
import { Site, Evento, CuriousFact, Ruta } from '../../types';
import { curiositiesService } from '../../services/curiosities.service';
import { promotedBannerService, PromotedBanner } from '../../services/banner.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { getTranslated, getMacroCategory } from '../../lib/utils';
import { PanelBanner } from './shared/PanelBanner';
import { LazyImage } from '../ui/lazy-image';
import { imagePositionStyle } from '../shared/ImagePositioner';
import { Badge } from '../ui/badge';
import { CategoryCarousel } from '../shared/CategoryCarousel';
import { Accessibility, Ear, Eye, Compass, Music, Utensils, Paintbrush, BookOpen, Trees, Landmark, ArrowRight, Sparkles, Library, Map, Route, CalendarDays, Gamepad2 } from 'lucide-react';

// --- Reusable Card Components for the Feed ---

const SiteCard: React.FC<{ site: Site; onOpenSite: (site: Site) => void }> = ({ site, onOpenSite }) => {
  const { t, language } = useI18n();
  return (
    <Card className="overflow-hidden flex h-full min-h-[300px] flex-col rounded-2xl border-border/70">
      <LazyImage
        src={site.logoUrl}
        alt={getTranslated(site, 'nombre', language) as string}
        textFallback={getTranslated(site, 'nombre', language) as string}
        className="w-full h-32 object-cover bg-muted"
        style={imagePositionStyle(site.image_position)}
      />
      <CardHeader className="px-4 pb-2 pt-4">
        <CardTitle className="text-sm leading-tight truncate">{getTranslated(site, 'nombre', language)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-4 text-xs text-muted-foreground space-y-2">
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
      <CardFooter className="mt-auto px-4 pb-4 pt-3">
        <Button size="sm" variant="outline" onClick={() => onOpenSite(site)}>{t('seeMore')}</Button>
      </CardFooter>
    </Card>
  );
};

const TARGET_TYPE_ICON: Record<string, React.ElementType> = {
  route: Route,
  event: CalendarDays,
  game: Gamepad2,
  url: ArrowRight,
};

interface ExplorarPanelProps {
  sites: Site[];
  query: string;
  onOpenSite: (site: Site) => void;
  onNavigateToRoutes?: () => void;
  onOpenRoute?: (route: Ruta) => void;
  onNavigateToAprende?: () => void;
  onOpenLearnEntry?: (entryId: string) => void;
  rutasTematicas: Ruta[];
  onNavigateToTab?: (tab: string, itemId?: string) => void;
}

const ExplorarPanel: React.FC<ExplorarPanelProps> = ({ sites, query, onOpenSite, onNavigateToRoutes, onOpenRoute, onNavigateToAprende, onOpenLearnEntry, rutasTematicas, onNavigateToTab }) => {
  const { language } = useI18n();

  // Abre la historia de "Pa' que sepás" ligada al dato curioso; si no hay vínculo,
  // (o la historia ya no existe) cae a la vista general de Pa' que sepás.
  const openRelatedStory = () => {
    if (randomFact?.related_entry_id && onOpenLearnEntry) onOpenLearnEntry(randomFact.related_entry_id);
    else onNavigateToAprende?.();
  };

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [randomFact, setRandomFact] = useState<CuriousFact | null>(null);
  const [promotedBanners, setPromotedBanners] = useState<PromotedBanner[]>([]);
  const [bannersLoaded, setBannersLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facts, banners] = await Promise.all([
          curiositiesService.getPublished('home'),
          promotedBannerService.getAll()
        ]);
        if (facts && facts.length > 0) {
          // Dato del día: determinista por fecha (UTC) para que sea el mismo todo el día,
          // cambie a diario y recorra todo el pool antes de repetir.
          const dayNumber = Math.floor(Date.now() / 86_400_000);
          setRandomFact(facts[dayNumber % facts.length]);
        }
        setPromotedBanners(banners);
      } catch (err) {
        console.error("Failed to load ExplorarPanel data", err);
      } finally {
        setBannersLoaded(true);
      }
    };
    loadData();
  }, []);

  const handleBannerClick = (banner: PromotedBanner) => {
    if (!banner.target_type) return;
    if (banner.target_type === 'route') {
      if (banner.target_id && onOpenRoute) {
        const route = rutasTematicas.find(item => item.id === banner.target_id);
        if (route) onOpenRoute(route);
        else onNavigateToRoutes?.();
      } else if (onNavigateToRoutes) {
        onNavigateToRoutes();
      }
    } else if (banner.target_type === 'event') {
      if (onNavigateToTab) onNavigateToTab('eventos', banner.target_id);
    } else if (banner.target_type === 'game') {
      if (onNavigateToTab) onNavigateToTab('juegos', banner.target_id);
    } else if (banner.target_type === 'url' && banner.target_id) {
      window.open(banner.target_id, '_blank', 'noopener');
    }
  };

  const CATEGORY_TAGS = useMemo(() => [
    { id: 'salsa', filter: 'Salsa y Música', label: language === 'es' ? 'Salsa y Música' : 'Salsa & Music', icon: Music, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50' },
    { id: 'sabores', filter: 'Gastronomía', label: language === 'es' ? 'Gastronomía' : 'Gastronomy', icon: Utensils, color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50' },
    { id: 'arte', filter: 'Arte y Teatro', label: language === 'es' ? 'Arte y Teatro' : 'Art & Theater', icon: Paintbrush, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50' },
    { id: 'naturaleza', filter: 'Parques y Naturaleza', label: language === 'es' ? 'Parques y Naturaleza' : 'Parks & Nature', icon: Trees, color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50' },
    { id: 'cultura', filter: 'Museos y Cultura', label: language === 'es' ? 'Museos y Cultura' : 'Museums & Culture', icon: BookOpen, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' },
    { id: 'bibliotecas', filter: 'Bibliotecas y Librerías', label: language === 'es' ? 'Bibliotecas y Librerías' : 'Libraries & Bookstores', icon: Library, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50' },
    { id: 'historicos', filter: 'Sitios Históricos / Otros', label: language === 'es' ? 'Sitios Históricos' : 'Historic Sites', icon: Landmark, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' },
  ], [language]);

  const feedItems = useMemo(() => {
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
    if (!normalizedQuery) {
      for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
      }
    }
    return combined;
  }, [sites, query, language, categoryFilter]);

  return (
    <ScrollArea className="h-full">
      {!query && (
        <PanelBanner
          panelKey="explorar"
          defaultImage="/images/banners/unified/explorar-v2.webp"
          marginClass="mx-4 md:mx-8"
          gradientClass="from-blue-50/95 via-blue-50/70 to-transparent dark:from-slate-900/95 dark:via-slate-900/70 dark:to-transparent"
          icon={
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-md text-white">
              <Compass className="h-6 w-6" />
            </div>
          }
          titleClassName="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-950 dark:text-blue-50"
          defaultTitle={language === 'es' ? '¿Qué querés vivir hoy en Cali?' : 'What do you want to experience today?'}
          defaultSubtitle={
            language === 'es'
              ? 'No somos solo un mapa. Elegí una experiencia y dejá que te guiemos paso a paso por lo mejor de la ciudad.'
              : 'We are not just a map. Choose an experience and let us guide you step by step through the best of the city.'
          }
        >
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
        </PanelBanner>
      )}

      {/* Imperdibles Banners — dynamic, grid layout */}
      {!query && !categoryFilter && (
        <div className="px-4 md:px-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              {language === 'es' ? 'Imperdibles' : 'Must See'}
            </h3>
          </div>
          {/* Grid uniforme: todas las tarjetas del mismo tamaño y alineadas. */}
          {promotedBanners.length === 0 && !bannersLoaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl bg-muted animate-pulse h-52" />
              ))}
            </div>
          ) : promotedBanners.length === 0 ? null : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotedBanners.map(banner => {
                const Icon = banner.target_type ? TARGET_TYPE_ICON[banner.target_type] : null;
                return (
                  <button
                    type="button"
                    key={banner.id}
                    className="cursor-pointer group rounded-2xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-300 h-52 text-left"
                    onClick={() => handleBannerClick(banner)}
                  >
                    <LazyImage
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                      style={imagePositionStyle(banner.image_position)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                      {banner.tag && (
                        <Badge className="w-fit mb-1.5 bg-primary/90 text-white border-none text-xs">
                          {Icon && React.createElement(Icon, { className: 'w-3 h-3 inline mr-1' })}
                          {banner.tag}
                        </Badge>
                      )}
                      <h4 className="text-white font-bold text-lg leading-tight mb-0.5">{banner.title}</h4>
                      {banner.subtitle && (
                        <p className="text-white/75 text-xs line-clamp-2">{banner.subtitle}</p>
                      )}
                      <div className="mt-2 flex items-center text-xs text-white/60 font-semibold group-hover:text-white transition-colors">
                        {language === 'es' ? 'Ver más' : 'Learn more'} <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sabías que Banner */}
      {!query && !categoryFilter && randomFact && (
        <div className="px-4 md:px-8 mb-8">
          <div
            className="bg-card border border-primary/20 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all group flex items-start gap-4 relative overflow-hidden"
            onClick={openRelatedStory}
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

      <div className="px-4 pb-12 md:px-8 md:pb-16">
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
