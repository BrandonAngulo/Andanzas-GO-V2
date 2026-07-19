import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface AndiGuiaProps {
  message: string;
  variant?: 'default' | 'tip' | 'warning' | 'celebration';
  title?: string;
  actionLabel?: string;
  onClose?: () => void;
  className?: string;
}

const VARIANT_STYLES = {
  default: {
    button: 'border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100',
    pulse: 'bg-emerald-400/35',
    header: 'from-emerald-950 via-emerald-800 to-emerald-600',
    eyebrow: 'text-amber-300',
    detail: 'bg-emerald-500',
  },
  tip: {
    button: 'border-amber-400/50 bg-amber-50 hover:bg-amber-100',
    pulse: 'bg-amber-400/35',
    header: 'from-emerald-950 via-emerald-800 to-amber-500',
    eyebrow: 'text-amber-300',
    detail: 'bg-amber-400',
  },
  warning: {
    button: 'border-orange-400/50 bg-orange-50 hover:bg-orange-100',
    pulse: 'bg-orange-400/35',
    header: 'from-slate-950 via-orange-900 to-orange-500',
    eyebrow: 'text-orange-200',
    detail: 'bg-orange-500',
  },
  celebration: {
    button: 'border-emerald-400/50 bg-emerald-50 hover:bg-emerald-100',
    pulse: 'bg-emerald-400/35',
    header: 'from-emerald-950 via-emerald-700 to-teal-400',
    eyebrow: 'text-yellow-300',
    detail: 'bg-yellow-400',
  },
} as const;

const DEFAULT_TITLES = {
  default: 'Andi te acompaña',
  tip: 'Una pista de Andi',
  warning: 'Andi te avisa',
  celebration: '¡Andi celebra contigo!',
} as const;

export function AndiGuia({
  message,
  variant = 'default',
  title,
  actionLabel = 'Seguir explorando',
  onClose,
  className,
}: AndiGuiaProps) {
  const [open, setOpen] = useState(false);
  const styles = VARIANT_STYLES[variant];
  const resolvedTitle = title || DEFAULT_TITLES[variant];

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) onClose?.();
  };

  return (
    <div className={cn('flex justify-end', className)}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Abrir guía: ${resolvedTitle}`}
            className={cn(
              'group relative h-14 w-14 shrink-0 overflow-visible !rounded-full border-2 p-1.5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl',
              styles.button,
            )}
          >
            <span
              aria-hidden="true"
              className={cn('pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full opacity-60', styles.pulse)}
            />
            <span className="relative h-full w-full overflow-hidden rounded-full bg-emerald-800 ring-2 ring-white shadow-inner">
              <img
                src="/brand/andi/andi-app-mark-512.png"
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="max-w-[26rem] overflow-hidden !rounded-[2rem] border-0 !p-0 shadow-2xl sm:max-w-[26rem]"
        >
          <div className={cn('relative overflow-hidden bg-gradient-to-br px-6 py-6 text-white', styles.header)}>
            <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -bottom-20 right-10 h-36 w-36 rounded-full border border-amber-300/25" />
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              aria-label="Cerrar guía de Andi"
              className="absolute right-4 top-4 z-20 rounded-full bg-black/15 p-1.5 text-white/90 transition-colors hover:bg-black/25 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <DialogHeader className="relative z-10 grid !mb-0 grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-4 pr-6 text-left">
              <div className="h-[5.25rem] w-[5.25rem] overflow-hidden rounded-full border-4 border-white/90 bg-emerald-800 shadow-xl">
                <img
                  src="/brand/andi/andi-app-mark-512.png"
                  alt="Andi, guía de Andanzas GO"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className={cn('mb-1 flex items-center gap-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em]', styles.eyebrow)}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Andi te acompaña
                </p>
                <DialogTitle className="text-2xl font-black leading-tight text-white">
                  {resolvedTitle}
                </DialogTitle>
              </div>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 pb-6 pt-5">
            <DialogDescription className="text-base font-medium leading-relaxed text-foreground">
              {message}
            </DialogDescription>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span className={cn('h-2.5 w-2.5 rounded-full', styles.detail)} />
                Pista de viaje
              </span>
              <Button
                onClick={() => handleOpenChange(false)}
                className="min-w-[9.5rem] whitespace-nowrap rounded-full px-5 shadow-md"
              >
                {actionLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
