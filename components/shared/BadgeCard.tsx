import type { Insignia } from '../../types';
import { cn, getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { CheckCircle2, ChevronRight, Compass, LockKeyhole } from 'lucide-react';
import { AchievementEmblem } from './AchievementEmblem';
import { getBadgeTierLabel, getBadgeVisual } from '../../lib/badge-system';

interface BadgeCardProps {
  insignia: Insignia;
  obtenida: boolean;
  compact?: boolean;
  onSelect?: (insignia: Insignia) => void;
}

export function BadgeCard({
  insignia,
  obtenida,
  compact = false,
  onSelect,
}: BadgeCardProps): JSX.Element {
  const { language } = useI18n();
  const visual = getBadgeVisual(insignia);
  const tierLabel = getBadgeTierLabel(insignia.tier);
  const name = getTranslated(insignia, 'nombre', language);

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border bg-card p-3">
        <AchievementEmblem insignia={insignia} obtained={obtenida} size={64} />
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{obtenida ? 'Conseguida' : visual.ruleLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(insignia)}
      aria-label={`Ver detalles de la insignia ${name}`}
      className={cn(
        'group relative flex min-h-[16.5rem] w-full flex-col items-center overflow-hidden rounded-[1.7rem] border p-3 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        obtenida
          ? 'border-amber-300/60 shadow-[0_18px_42px_-30px_rgba(6,78,59,0.8)] hover:-translate-y-1.5 hover:border-amber-300 hover:shadow-xl'
          : 'border-border/80 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.5)] hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg',
      )}
      style={{
        background: obtenida
          ? `radial-gradient(circle at 50% 42%, ${visual.glow} 0%, rgba(255,255,255,.9) 52%, ${visual.primary}12 100%)`
          : 'radial-gradient(circle at 50% 42%, rgba(226,232,240,.72), rgba(255,255,255,.94) 56%, rgba(241,245,249,.9))',
      }}
    >
      <span className={cn(
        'absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full border shadow-sm',
        obtenida
          ? 'border-emerald-500/30 bg-emerald-600 text-white'
          : 'border-slate-300 bg-white/90 text-slate-500',
      )}>
        <span className="sr-only">{obtenida ? 'Conseguida' : 'Por descubrir'}</span>
        {obtenida ? <CheckCircle2 className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
      </span>

      <span
        className="relative z-10 inline-flex max-w-[78%] items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.13em]"
        style={{ backgroundColor: `${visual.primary}16`, color: visual.deep }}
      >
        <Compass className="h-3 w-3" />
        {visual.groupLabel}
      </span>

      <div className="relative z-10 mt-1.5 flex flex-1 items-center justify-center">
        <div
          className="absolute h-32 w-32 rounded-full opacity-50 blur-2xl transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundColor: visual.glow }}
        />
        <AchievementEmblem
          insignia={insignia}
          obtained={obtenida}
          size={148}
          className="relative motion-safe:group-hover:scale-[1.08]"
        />
      </div>

      <div className="relative z-10 w-full pb-1">
        {tierLabel && (
          <p className="mb-0.5 text-[9px] font-black uppercase tracking-[0.16em]" style={{ color: visual.primary }}>
            Nivel {insignia.tier} · {tierLabel}
          </p>
        )}
        <h3 className="line-clamp-2 text-balance font-heading text-base font-black leading-tight text-foreground">
          {name}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground transition-colors group-hover:text-foreground">
          Ver insignia
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <span
        className="pointer-events-none absolute inset-x-5 bottom-0 h-px opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${visual.secondary}, transparent)` }}
      />
    </button>
  );
}
