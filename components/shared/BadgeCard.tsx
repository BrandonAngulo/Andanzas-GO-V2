import type { Insignia } from '../../types';
import { cn, getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { CheckCircle2, Compass, LockKeyhole } from 'lucide-react';
import { AchievementEmblem } from './AchievementEmblem';
import { getBadgeThreshold, getBadgeTierLabel, getBadgeVisual } from '../../lib/badge-system';

interface BadgeCardProps {
  insignia: Insignia;
  obtenida: boolean;
  compact?: boolean;
  progress?: number;
}

export function BadgeCard({
  insignia,
  obtenida,
  compact = false,
  progress,
}: BadgeCardProps): JSX.Element {
  const { language } = useI18n();
  const visual = getBadgeVisual(insignia);
  const threshold = getBadgeThreshold(insignia);
  const current = Math.max(0, progress || 0);
  const percentage = threshold ? Math.min(100, Math.round((current / threshold) * 100)) : obtenida ? 100 : 0;
  const tierLabel = getBadgeTierLabel(insignia.tier);

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border bg-card p-3">
        <AchievementEmblem insignia={insignia} obtained={obtenida} size={64} />
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{getTranslated(insignia, 'nombre', language)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{obtenida ? 'Conseguida' : visual.ruleLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <article
      className={cn(
        'group relative flex min-h-[24rem] flex-col overflow-hidden rounded-[1.6rem] border bg-card p-4 transition-all duration-300',
        obtenida
          ? 'border-emerald-500/25 shadow-[0_18px_50px_-35px_rgba(6,78,59,0.7)] hover:-translate-y-1 hover:shadow-xl'
          : 'border-border/80 bg-muted/20',
      )}
      style={{
        backgroundImage: obtenida
          ? `radial-gradient(circle at 82% 8%, ${visual.glow}, transparent 32%), linear-gradient(145deg, rgba(255,255,255,.82), transparent 55%)`
          : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex max-w-[72%] items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
          style={{ backgroundColor: `${visual.primary}18`, color: visual.deep }}
        >
          <Compass className="h-3 w-3" />
          {visual.groupLabel}
        </span>
        <span className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold',
          obtenida ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        )}>
          {obtenida ? <CheckCircle2 className="h-3 w-3" /> : <LockKeyhole className="h-3 w-3" />}
          {obtenida ? 'Conseguida' : 'Por descubrir'}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center pt-3 text-center">
        <AchievementEmblem
          insignia={insignia}
          obtained={obtenida}
          size={118}
          className="motion-safe:group-hover:scale-105"
        />

        <div className="mt-2">
          {tierLabel && (
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: visual.primary }}>
              Nivel {insignia.tier} · {tierLabel}
            </p>
          )}
          <h3 className="text-balance font-heading text-lg font-black leading-tight">
            {getTranslated(insignia, 'nombre', language)}
          </h3>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {getTranslated(insignia, 'descripcion', language)}
          </p>
        </div>

        <div className="mt-auto w-full pt-4 text-left">
          <div className="rounded-2xl border bg-background/70 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
              {obtenida ? 'Cómo la conseguiste' : 'Cómo conseguirla'}
            </p>
            <p className="mt-1 text-xs font-semibold leading-snug text-foreground/80">{visual.ruleLabel}</p>
          </div>

          {threshold !== undefined && (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Tu progreso</span>
                <span>{Math.min(current, threshold)} / {threshold}</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={`Progreso para ${insignia.nombre}`}
                aria-valuemin={0}
                aria-valuemax={threshold}
                aria-valuenow={Math.min(current, threshold)}
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
    </article>
  );
}
