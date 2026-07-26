import { useId, useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import type { Insignia } from '../../types';
import { cn } from '../../lib/utils';
import { getBadgeIllustrationPath, getBadgeVisual } from '../../lib/badge-system';

interface AchievementEmblemProps {
  insignia: Insignia;
  obtained?: boolean;
  size?: number;
  className?: string;
}

export function AchievementEmblem({
  insignia,
  obtained = true,
  size = 104,
  className,
}: AchievementEmblemProps): JSX.Element {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const visual = getBadgeVisual(insignia);
  const illustrationPath = getBadgeIllustrationPath(insignia);
  const [failedIllustrationPath, setFailedIllustrationPath] = useState<string | null>(null);
  const illustrationFailed = failedIllustrationPath === illustrationPath;
  const Icon = insignia.icono;
  const tier = Math.max(0, Math.min(insignia.tier || 0, 3));

  return (
    <div
      className={cn(
        'relative isolate grid shrink-0 place-items-center transition-transform duration-500',
        obtained ? 'drop-shadow-[0_16px_18px_rgba(6,78,59,0.2)]' : 'grayscale',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {illustrationPath && !illustrationFailed ? (
        <img
          src={illustrationPath}
          alt=""
          draggable={false}
          className={cn(
            'absolute inset-0 h-full w-full select-none object-contain',
            obtained ? 'opacity-100' : 'opacity-55',
          )}
          onError={() => setFailedIllustrationPath(illustrationPath)}
        />
      ) : (
        <>
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`outer-${id}`} x1="18" y1="12" x2="102" y2="108" gradientUnits="userSpaceOnUse">
            <stop stopColor={obtained ? visual.secondary : '#D1D5DB'} />
            <stop offset="0.42" stopColor={obtained ? visual.primary : '#9CA3AF'} />
            <stop offset="1" stopColor={obtained ? visual.deep : '#4B5563'} />
          </linearGradient>
          <radialGradient id={`core-${id}`} cx="38%" cy="28%" r="78%">
            <stop stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="0.55" stopColor={obtained ? visual.glow : '#E5E7EB'} />
            <stop offset="1" stopColor={obtained ? visual.secondary : '#9CA3AF'} stopOpacity="0.86" />
          </radialGradient>
          <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor={visual.deep} floodOpacity={obtained ? '0.34' : '0.18'} />
          </filter>
        </defs>

        <path
          d="M60 4 87 13 105 35 101 72 82 99 60 114 38 99 19 72 15 35 33 13Z"
          fill={`url(#outer-${id})`}
          stroke={obtained ? visual.deep : '#6B7280'}
          strokeWidth="2.5"
          filter={`url(#shadow-${id})`}
        />
        <path
          d="M60 12 83 20 96 39 93 68 77 91 60 103 43 91 27 68 24 39 37 20Z"
          fill={obtained ? visual.deep : '#374151'}
          fillOpacity="0.92"
          stroke="white"
          strokeOpacity="0.34"
          strokeWidth="1.5"
        />
        <path
          d="M60 18 68 34 86 30 77 47 92 57 73 60 76 79 60 69 44 79 47 60 28 57 43 47 34 30 52 34Z"
          fill={obtained ? visual.primary : '#6B7280'}
          fillOpacity="0.68"
        />
        <circle cx="60" cy="54" r="27" fill={`url(#core-${id})`} stroke="white" strokeOpacity="0.76" strokeWidth="2" />
        <circle cx="60" cy="54" r="22" fill="none" stroke={obtained ? visual.primary : '#6B7280'} strokeOpacity="0.45" strokeWidth="1.5" />
        <circle cx="38" cy="81" r="3.2" fill={obtained ? '#FFB020' : '#9CA3AF'} stroke="white" strokeWidth="1" />
        <circle cx="46" cy="84" r="2.3" fill={obtained ? '#D9F6EA' : '#D1D5DB'} stroke="white" strokeWidth="0.8" />
        <path d="M36 21c11-8 31-11 46-3" fill="none" stroke="white" strokeOpacity="0.45" strokeLinecap="round" strokeWidth="3" />

        {tier > 0 && (
          <g transform="translate(82 82)">
            <path d="M0 4 12 0 22 8 20 22 8 25-2 16Z" fill={visual.secondary} stroke="white" strokeWidth="1.5" />
            {[0, 1, 2].slice(0, tier).map((index) => (
              <circle key={index} cx={4 + index * 6} cy="12" r="2.2" fill={visual.deep} />
            ))}
          </g>
        )}
          </svg>

          <span
            className="relative z-10 grid place-items-center rounded-full"
            style={{
              width: size * 0.38,
              height: size * 0.38,
              color: obtained ? visual.deep : '#4B5563',
              transform: `translateY(${-size * 0.05}px)`,
            }}
          >
            <Icon style={{ width: size * 0.27, height: size * 0.27 }} strokeWidth={2.35} />
          </span>
        </>
      )}

      {obtained && (!illustrationPath || illustrationFailed) ? (
        <Sparkles
          className="absolute right-[8%] top-[8%] z-20 animate-pulse"
          style={{ width: size * 0.18, height: size * 0.18, color: visual.secondary }}
        />
      ) : !obtained ? (
        <span className="absolute bottom-[10%] right-[8%] z-20 grid rounded-full border border-white/70 bg-slate-800 p-1.5 text-white shadow-lg">
          <Lock style={{ width: size * 0.13, height: size * 0.13 }} />
        </span>
      ) : null}
    </div>
  );
}
