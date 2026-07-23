import { Clock3, Edit, Footprints, PenTool, Play, Trash2 } from 'lucide-react';
import { Ruta } from '../../types';
import { formatDuration, getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { Button } from '../ui/button';
import { imagePositionStyle } from '../shared/ImagePositioner';

interface UserRouteCardProps {
  route: Ruta;
  language: 'es' | 'en';
  onOpen: () => void;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserRouteCard({ route, language, onOpen, onStart, onEdit, onDelete }: UserRouteCardProps) {
  const image = route.image_url || route.coverUrl || '';
  const routeName = getTranslated(route, 'nombre', language) as string;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-emerald-950/10 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-600/30 hover:shadow-md dark:border-white/10">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
        aria-label={`${language === 'es' ? 'Ver mi ruta' : 'View my route'}: ${routeName}`}
      />
      <div className="flex min-h-[8.5rem]">
        <div className="relative w-28 shrink-0 overflow-hidden bg-gradient-to-br from-emerald-700 to-teal-950 sm:w-36">
          {image ? (
            <LazyImage
              src={image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
              style={imagePositionStyle(route.image_position)}
              textFallback={routeName}
            />
          ) : (
            <div className="grid h-full place-items-center text-4xl text-white">
              {route.emoji || <PenTool className="h-9 w-9" />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 to-transparent" />
        </div>

        <div className="min-w-0 flex-1 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            {language === 'es' ? 'Creada por ti' : 'Created by you'}
          </p>
          <h3 className="mt-1 truncate text-base font-black">{routeName}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {getTranslated(route, 'descripcion', language)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5 text-orange-500" />
              {formatDuration(route.duracionMin, language)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Footprints className="h-3.5 w-3.5 text-emerald-600" />
              {route.puntos.length} {language === 'es' ? 'paradas' : 'stops'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-center gap-1 border-t border-border/60 bg-muted/20 px-3 py-2">
        <Button type="button" size="sm" className="h-9 rounded-full px-3 text-xs" onClick={onStart}>
          <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
          {language === 'es' ? 'Comenzar' : 'Start'}
        </Button>
        <div className="ml-auto flex gap-1">
          <Button type="button" size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={onEdit} aria-label={language === 'es' ? 'Editar ruta' : 'Edit route'}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-9 w-9 rounded-full text-destructive" onClick={onDelete} aria-label={language === 'es' ? 'Eliminar ruta' : 'Delete route'}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
