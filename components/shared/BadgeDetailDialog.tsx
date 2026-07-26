import { CheckCircle2, Compass, LockKeyhole, Sparkles } from 'lucide-react';
import type { Insignia } from '../../types';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AchievementEmblem } from './AchievementEmblem';
import { getBadgeThreshold, getBadgeTierLabel, getBadgeVisual } from '../../lib/badge-system';

interface BadgeDetailDialogProps {
  insignia: Insignia | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obtenida: boolean;
  progress?: number;
}

export function BadgeDetailDialog({
  insignia,
  open,
  onOpenChange,
  obtenida,
  progress,
}: BadgeDetailDialogProps): JSX.Element | null {
  const { language } = useI18n();

  if (!insignia) return null;

  const visual = getBadgeVisual(insignia);
  const threshold = getBadgeThreshold(insignia);
  const current = Math.max(0, progress || 0);
  const progressValue = threshold ? Math.min(current, threshold) : obtenida ? 1 : 0;
  const progressMax = threshold || 1;
  const percentage = Math.round((progressValue / progressMax) * 100);
  const tierLabel = getBadgeTierLabel(insignia.tier);
  const name = getTranslated(insignia, 'nombre', language);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] border-0 p-0 shadow-2xl">
        <div
          className="relative flex min-h-[18rem] items-center justify-center overflow-hidden px-6 pb-4 pt-10 sm:min-h-[20rem]"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${visual.glow}, rgba(255,255,255,.94) 48%, ${visual.primary}22 100%)`,
          }}
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full border border-white/70" />
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full border border-white/60" />
          <span
            className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] shadow-sm backdrop-blur"
            style={{ color: visual.deep }}
          >
            <Compass className="h-3.5 w-3.5" />
            {visual.groupLabel}
          </span>

          <AchievementEmblem
            insignia={insignia}
            obtained={obtenida}
            size={230}
            className="relative z-10 drop-shadow-[0_24px_24px_rgba(6,78,59,0.22)]"
          />
        </div>

        <div className="px-5 pb-6 pt-5 sm:px-7">
          <DialogHeader className="mb-0 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className={obtenida
                ? 'inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800'
                : 'inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600'
              }>
                {obtenida ? <CheckCircle2 className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                {obtenida ? 'Conseguida' : 'Por descubrir'}
              </span>
              {tierLabel && (
                <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: visual.primary }}>
                  Nivel {insignia.tier} · {tierLabel}
                </span>
              )}
            </div>
            <DialogTitle className="mt-3 font-heading text-2xl font-black leading-tight sm:text-3xl">
              {name}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed sm:text-base">
              {getTranslated(insignia, 'descripcion', language)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rounded-2xl border bg-muted/35 p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" style={{ color: visual.primary }} />
                {obtenida ? 'Cómo la conseguiste' : 'Cómo conseguirla'}
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-snug">{visual.ruleLabel}</p>
            </div>

            {threshold !== undefined && (
              <div className="min-w-[10rem] rounded-2xl border bg-background p-4">
                <div className="mb-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Tu progreso</span>
                  <span>{progressValue} / {threshold}</span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label={`Progreso para ${name}`}
                  aria-valuemin={0}
                  aria-valuemax={threshold}
                  aria-valuenow={progressValue}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${visual.primary}, ${visual.secondary})`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
