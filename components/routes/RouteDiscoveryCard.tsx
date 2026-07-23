import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock3,
  Compass,
  Footprints,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Ruta, Site } from '../../types';
import { cn, formatDuration, getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { imagePositionStyle } from '../shared/ImagePositioner';

interface RouteDiscoveryCardProps {
  route: Ruta;
  sites: Site[];
  language: 'es' | 'en';
  saved: boolean;
  completed: boolean;
  inProgress: boolean;
  featured?: boolean;
  saving?: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}

interface RouteVisual {
  image: string;
  overlay: string;
  accent: string;
}

const ROUTE_VISUALS: Array<{ keywords: string[]; visual: RouteVisual }> = [
  {
    keywords: ['histor', 'colonial'],
    visual: {
      image: '/routes/ruta_historica.jpg',
      overlay: 'from-amber-950/5 via-orange-950/20 to-[#3b1f10]/95',
      accent: 'text-amber-200',
    },
  },
  {
    keywords: ['pincel', 'mural', 'arte', 'calle'],
    visual: {
      image: '/routes/ruta_arte.jpg',
      overlay: 'from-fuchsia-950/5 via-violet-950/20 to-[#29104d]/95',
      accent: 'text-fuchsia-200',
    },
  },
  {
    keywords: ['clave', 'barrio', 'salsa', 'musica'],
    visual: {
      image: '/routes/ruta_salsa.jpg',
      overlay: 'from-rose-950/5 via-red-950/20 to-[#3b1015]/95',
      accent: 'text-rose-200',
    },
  },
  {
    keywords: ['naturaleza', 'verde', 'ecolog'],
    visual: {
      image: '/routes/ruta_naturaleza.jpg',
      overlay: 'from-emerald-950/5 via-green-950/20 to-[#0b3927]/95',
      accent: 'text-emerald-200',
    },
  },
  {
    keywords: ['papel', 'liter', 'libro', 'letra'],
    visual: {
      image: '/routes/ruta_literatura.jpg',
      overlay: 'from-sky-950/5 via-blue-950/20 to-[#102a43]/95',
      accent: 'text-sky-200',
    },
  },
  {
    keywords: ['fogon', 'gastronom', 'cocina', 'sabor'],
    visual: {
      image: '/routes/ruta_gastronomia.jpg',
      overlay: 'from-orange-950/5 via-amber-950/25 to-[#3a2109]/95',
      accent: 'text-orange-200',
    },
  },
];

const DEFAULT_ROUTE_VISUAL: RouteVisual = {
  image: '/routes/ruta_historica.jpg',
  overlay: 'from-emerald-950/5 via-teal-950/20 to-[#042e2b]/95',
  accent: 'text-emerald-200',
};

function normalizeRouteName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getRouteVisual(routeName: string): RouteVisual {
  const normalizedName = normalizeRouteName(routeName);
  return ROUTE_VISUALS.find(({ keywords }) => keywords.some((keyword) => normalizedName.includes(keyword)))?.visual
    || DEFAULT_ROUTE_VISUAL;
}

export function RouteDiscoveryCard({
  route,
  sites,
  language,
  saved,
  completed,
  inProgress,
  featured = false,
  saving = false,
  onOpen,
  onToggleSave,
}: RouteDiscoveryCardProps) {
  const routeSites = route.puntos
    .map((pointId) => sites.find((site) => site.id === pointId))
    .filter(Boolean) as Site[];
  const firstPoint = routeSites[0];
  const routeName = getTranslated(route, 'nombre', language) as string;
  const visual = getRouteVisual(route.nombre || routeName);
  const editorialImage = route.image_url || route.coverUrl;
  const routeImage = editorialImage || visual.image || firstPoint?.fotos?.[0] || firstPoint?.logoUrl || '';
  const status = completed
    ? { label: language === 'es' ? 'Completada' : 'Completed', icon: CheckCircle2, tone: 'bg-amber-300 text-amber-950' }
    : inProgress
      ? { label: language === 'es' ? 'En recorrido' : 'In progress', icon: Compass, tone: 'bg-emerald-500 text-white' }
      : { label: language === 'es' ? 'Lista para explorar' : 'Ready to explore', icon: Sparkles, tone: 'bg-white/90 text-emerald-950' };
  const StatusIcon = status.icon;

  return (
    <article
      className={cn(
        'group relative isolate overflow-hidden rounded-[1.5rem] border border-emerald-950/10 bg-white shadow-[0_18px_55px_-35px_rgba(6,78,59,0.75)] transition-transform duration-300 dark:border-white/10 dark:bg-slate-950 sm:rounded-[1.75rem]',
        featured ? 'min-h-[20.5rem] sm:min-h-[22rem]' : 'min-h-[19rem] sm:min-h-[20rem]',
        'focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 motion-safe:hover:-translate-y-1',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-10 rounded-[1.5rem] focus:outline-none sm:rounded-[1.75rem]"
        aria-label={`${language === 'es' ? 'Ver recorrido' : 'View route'}: ${getTranslated(route, 'nombre', language)}`}
      />

      <div className="absolute inset-0">
        <LazyImage
          src={routeImage}
          className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
          alt=""
          style={editorialImage ? imagePositionStyle(route.image_position) : undefined}
        />
        <div className={cn('absolute inset-0 bg-gradient-to-b', visual.overlay)} />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.26),transparent_46%)]" />
      </div>

      <div className="relative flex min-h-[inherit] flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] shadow-sm', status.tone)}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>
          <button
            type="button"
            disabled={saving}
            onClick={(event) => {
              event.stopPropagation();
              onToggleSave();
            }}
            className="relative z-20 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/25 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/40 disabled:opacity-50"
            aria-label={saved
              ? (language === 'es' ? 'Quitar de Por andar' : 'Remove saved route')
              : (language === 'es' ? 'Guardar en Por andar' : 'Save route')}
          >
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-auto text-white">
          {routeSites.length > 0 && (
            <div className="mb-3 flex items-center">
              {routeSites.slice(0, 5).map((site, index) => (
                <React.Fragment key={site.id}>
                  <span className="relative h-9 w-9 shrink-0 overflow-visible rounded-full border-2 border-white/90 bg-emerald-700 shadow-md">
                    <LazyImage
                      src={site.fotos?.[0] || site.logoUrl || ''}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                      textFallback={String(index + 1)}
                    />
                    <span className={cn(
                      'absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full border border-white text-[8px] font-black',
                      index === 0 ? 'bg-orange-400 text-orange-950' : 'bg-emerald-600 text-white',
                    )}>
                      {index + 1}
                    </span>
                  </span>
                  {index < Math.min(routeSites.length, 5) - 1 && (
                    <span className="h-px w-3 border-t border-dashed border-white/70 sm:w-5" />
                  )}
                </React.Fragment>
              ))}
              {routeSites.length > 5 && (
                <span className="ml-2 text-xs font-bold text-white/80">+{routeSites.length - 5}</span>
              )}
            </div>
          )}

          <p className={cn('mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em]', visual.accent)}>
            <MapPin className="h-3.5 w-3.5" />
            {language === 'es' ? 'Circuito cultural' : 'Cultural circuit'}
          </p>
          <h3 className={cn('font-heading font-black leading-[1.03] text-white', featured ? 'text-[1.75rem] sm:text-4xl' : 'text-2xl')}>
            {routeName}
          </h3>
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80">
            {getTranslated(route, 'intro_story', language) || getTranslated(route, 'descripcion', language)}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <Clock3 className="h-3.5 w-3.5 text-orange-300" />
              {formatDuration(route.duracionMin, language as 'es' | 'en')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <Footprints className="h-3.5 w-3.5 text-emerald-300" />
              {route.puntos.length} {language === 'es' ? 'paradas' : 'stops'}
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-black text-emerald-950 shadow-sm">
              {language === 'es' ? 'Ver recorrido' : 'View route'}
              <Compass className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
