import React, { useId } from 'react';
import { cn } from '../../lib/utils';

// Medalla ilustrada a mano en SVG para las insignias progresivas (favoritos, reseñas,
// rutas creadas, rutas completadas): un escudo/medalla con degradado metálico según el
// tier (bronce/plata/oro) y cinta inferior, con el ícono de la familia centrado encima.
// Mismo espíritu de diseño que components/views/GameMascot.tsx (glifo propio, sin
// depender de arte externo), aplicado aquí a un lenguaje de "medalla" en vez de mascota.

export type MedalTier = 1 | 2 | 3;

const TIER_STYLES: Record<MedalTier, { light: string; mid: string; dark: string; iconColor: string; label: string }> = {
    1: { light: '#E3A876', mid: '#B87333', dark: '#7A4A21', iconColor: '#4A2E0A', label: 'Bronce' },
    2: { light: '#F4F4F5', mid: '#C4C8CC', dark: '#8A8F96', iconColor: '#3F3F46', label: 'Plata' },
    3: { light: '#FFEEA8', mid: '#FFC93C', dark: '#B8860B', iconColor: '#5C3D00', label: 'Oro' },
};

interface TierMedalProps {
    icon: React.ElementType;
    tier: MedalTier;
    size?: number;
    locked?: boolean;
    className?: string;
}

export const TierMedal: React.FC<TierMedalProps> = ({ icon: Icon, tier, size = 64, locked = false, className }) => {
    const style = TIER_STYLES[tier];
    const gradId = useId();

    return (
        <div
            className={cn("relative inline-flex items-center justify-center flex-shrink-0", locked && "grayscale opacity-60", className)}
            style={{ width: size, height: size * 1.1 }}
        >
            <svg viewBox="0 0 100 110" width={size} height={size * 1.1} className="absolute inset-0 drop-shadow-md">
                <defs>
                    <radialGradient id={`medalGrad-${gradId}`} cx="35%" cy="28%" r="75%">
                        <stop offset="0%" stopColor={style.light} />
                        <stop offset="55%" stopColor={style.mid} />
                        <stop offset="100%" stopColor={style.dark} />
                    </radialGradient>
                </defs>
                {/* Cinta */}
                <path d="M38 60 L26 100 L50 88 L74 100 L62 60 Z" fill={style.dark} opacity="0.9" />
                <path d="M38 60 L30 92 L50 82 Z" fill={style.mid} opacity="0.5" />
                {/* Cuerpo de la medalla */}
                <circle cx="50" cy="42" r="36" fill={`url(#medalGrad-${gradId})`} stroke={style.dark} strokeWidth="2" />
                <circle cx="50" cy="42" r="28" fill="none" stroke={style.light} strokeWidth="1.5" opacity="0.7" />
                <circle cx="38" cy="28" r="10" fill="white" opacity="0.18" />
            </svg>
            <Icon
                className="relative z-10"
                style={{ width: size * 0.32, height: size * 0.32, marginBottom: size * 0.22 }}
                color={style.iconColor}
                strokeWidth={2.5}
            />
        </div>
    );
};

export const tierLabel = (tier: MedalTier): string => TIER_STYLES[tier].label;
