import { Compass, Search } from 'lucide-react';
import { Button } from '../ui/button';

interface RoutesEmptyStateProps {
  language: 'es' | 'en';
  mode?: 'catalog' | 'filtered' | 'saved';
  onReset?: () => void;
}

export function RoutesEmptyState({ language, mode = 'catalog', onReset }: RoutesEmptyStateProps) {
  const copy = {
    catalog: language === 'es'
      ? {
          title: 'Estamos preparando nuevas andanzas',
          description: 'Andi está reuniendo historias, paradas y experiencias para que muy pronto tengas nuevos recorridos.',
        }
      : {
          title: 'New journeys are on the way',
          description: 'Andi is gathering stories, stops and experiences for your next route.',
        },
    filtered: language === 'es'
      ? {
          title: 'No hay rutas con ese filtro',
          description: 'Prueba otra duración o explora todas las rutas disponibles.',
        }
      : {
          title: 'No routes match that filter',
          description: 'Try another duration or explore every available route.',
        },
    saved: language === 'es'
      ? {
          title: 'Tu próxima salida puede empezar aquí',
          description: 'Guarda las rutas que te interesen y Andi las mantendrá reunidas para cuando quieras recorrerlas.',
        }
      : {
          title: 'Your next outing can start here',
          description: 'Save the routes that interest you and Andi will keep them together until you are ready to explore.',
        },
  }[mode];

  return (
    <div className="relative mt-4 overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-gradient-to-br from-[#eef8ef] via-white to-[#fff4df] p-5 shadow-sm dark:border-white/10 dark:from-emerald-950/35 dark:via-background dark:to-orange-950/25 sm:p-7">
      <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-emerald-600/10" />
      <div className="relative flex min-h-[11rem] items-center gap-4 sm:gap-7">
        <div className="min-w-0 flex-1">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            {mode === 'filtered' ? <Search className="h-5 w-5" /> : <Compass className="h-5 w-5" />}
          </span>
          <h3 className="max-w-md text-xl font-black text-emerald-950 dark:text-emerald-50 sm:text-2xl">{copy.title}</h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
          {mode === 'filtered' && onReset && (
            <Button type="button" size="sm" className="mt-4 rounded-full" onClick={onReset}>
              {language === 'es' ? 'Ver todas las rutas' : 'View all routes'}
            </Button>
          )}
        </div>
        <img
          src="/brand/andi/andi-frontal-512-transparent-v2.png"
          alt=""
          className="h-28 w-auto shrink-0 self-end object-contain drop-shadow-xl sm:h-40"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
