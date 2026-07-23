import { Award, CheckCircle2, MapPinned, Sparkles } from 'lucide-react';
import { Ruta } from '../../types';
import { getTranslated } from '../../lib/utils';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';

interface RouteCompletionModalProps {
  route: Ruta | null;
  language: 'es' | 'en';
  onClose: () => void;
  onExploreRoutes: () => void;
}

export function RouteCompletionModal({
  route,
  language,
  onClose,
  onExploreRoutes,
}: RouteCompletionModalProps) {
  if (!route) return null;

  const routeName = getTranslated(route, 'nombre', language);
  const closingMessage = getTranslated(route, 'mensajeCierre', language);
  const copy = language === 'es'
    ? {
        eyebrow: 'Andanza completada',
        title: `¡Lo lograste! Recorriste ${routeName}`,
        description: closingMessage || 'Cada parada sumó una nueva historia a tu recorrido. Tu próxima andanza ya te está esperando.',
        stops: `${route.puntos.length} paradas descubiertas`,
        reward: 'Recompensa de ruta registrada',
        close: 'Volver al mapa',
        routes: 'Descubrir otra ruta',
      }
    : {
        eyebrow: 'Journey completed',
        title: `You did it! You explored ${routeName}`,
        description: closingMessage || 'Each stop added a new story to your journey. Your next adventure is already waiting.',
        stops: `${route.puntos.length} stops discovered`,
        reward: 'Route reward registered',
        close: 'Back to map',
        routes: 'Discover another route',
      };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="relative isolate overflow-hidden bg-[#063f38] px-6 pb-7 pt-8 text-white sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(251,191,36,0.25),transparent_28%)]" />
          <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
          <img
            src="/brand/andi/andi-frontal-512-transparent-v2.png"
            alt=""
            className="absolute -bottom-8 -right-3 h-44 w-auto drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] sm:h-52"
            aria-hidden="true"
          />
          <div className="relative max-w-[70%]">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-orange-300">
              <Sparkles className="h-4 w-4" />
              {copy.eyebrow}
            </p>
            <DialogTitle className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
              {copy.title}
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm font-medium leading-relaxed text-white/80">
              {copy.description}
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-5 bg-background px-6 py-6 sm:px-8">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-3.5 text-emerald-800 dark:text-emerald-200">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white">
                <MapPinned className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold">{copy.stops}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-orange-500/10 p-3.5 text-orange-800 dark:text-orange-200">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-400 text-orange-950">
                {route.reward_badge_id ? <Award className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              </span>
              <span className="text-sm font-bold">{copy.reward}</span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-full" onClick={onClose}>
              {copy.close}
            </Button>
            <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={onExploreRoutes}>
              {copy.routes}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
