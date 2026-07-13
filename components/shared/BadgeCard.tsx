import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Insignia } from '../../types';
import { cn, getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { Lock } from 'lucide-react';
import { TierMedal, MedalTier } from './TierMedal';
import { FAMILY_TIER_THRESHOLDS } from '../../services/gamification.service';

interface BadgeCardProps {
    insignia: Insignia;
    obtenida: boolean;
    compact?: boolean;
    // Conteo actual del usuario en la familia de esta insignia (favoritos/reseñas/rutas...),
    // solo relevante para insignias progresivas (con family_key), para mostrar el avance
    // hacia el siguiente tier.
    progress?: number;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ insignia, obtenida, compact = false, progress }) => {
    const { language, t } = useI18n();
    const [showHint, setShowHint] = useState(false);

    // Icon can be a component or string, handling both if needed, but assuming component here as per previous code
    const Icon = insignia.icono;

    const threshold = insignia.family_key && insignia.tier
        ? FAMILY_TIER_THRESHOLDS[insignia.family_key]?.[insignia.tier - 1]
        : undefined;
    const showProgressBar = !obtenida && threshold !== undefined && typeof progress === 'number';

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300 group cursor-pointer h-full flex flex-col items-center justify-center",
                obtenida
                    ? "border-yellow-500/50 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 hover:scale-[1.02] hover:shadow-md"
                    : "border-dashed border-muted-foreground/20 bg-muted/10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100",
                compact ? "p-3" : "p-4"
            )}
            onClick={() => !obtenida && setShowHint(!showHint)}
        >
            {/* Background Glow Effect for Earned */}
            {obtenida && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-all" />
            )}

            {insignia.family_key && insignia.tier ? (
                <div className={compact ? "" : "mb-3"}>
                    <TierMedal icon={Icon} tier={insignia.tier as MedalTier} locked={!obtenida} size={compact ? 56 : 80} />
                </div>
            ) : insignia.image_url ? (
                <div className={cn(
                    "relative rounded-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105 flex-shrink-0",
                    obtenida ? "shadow-md ring-2 ring-yellow-400/60" : "grayscale opacity-60",
                    compact ? "w-16 h-16" : "w-24 h-24 mb-3"
                )}>
                    <img src={insignia.image_url} alt={getTranslated(insignia, 'nombre', language) as string} className="w-full h-full object-cover" />
                    {!obtenida && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-background/90 rounded-full p-1.5 shadow-sm">
                                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className={cn(
                    "relative rounded-full transition-transform duration-500 group-hover:rotate-12 flex-shrink-0 flex items-center justify-center",
                    obtenida ? "bg-white dark:bg-background shadow-sm text-yellow-600 dark:text-yellow-400" : "bg-muted text-muted-foreground/60 shadow-inner",
                    compact ? "w-12 h-12 p-2" : "w-16 h-16 p-3 mb-3"
                )}>
                    <Icon className="w-full h-full" strokeWidth={obtenida ? 2 : 1.5} />
                    {!obtenida && (
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm border border-border">
                            <Lock className="w-3 h-3 text-muted-foreground" />
                        </div>
                    )}
                </div>
            )}

            {!compact && (
                <div className="w-full flex flex-col items-center mt-2">
                    <h4 className={cn(
                        "font-bold text-sm mb-1 leading-tight text-balance text-center",
                        obtenida ? "text-foreground" : "text-muted-foreground"
                    )}>
                        {getTranslated(insignia, 'nombre', language)}
                    </h4>

                    <div className="text-xs text-muted-foreground mt-1 w-full text-center">
                        {obtenida ? (
                            <span>{getTranslated(insignia, 'descripcion', language)}</span>
                        ) : (
                            showHint ? (
                                <span className="text-primary font-medium animate-in fade-in slide-in-from-bottom-1">
                                    {getTranslated(insignia, 'descripcion', language)}
                                </span>
                            ) : (
                                <span className="italic text-[10px] opacity-70">{t('insignias.locked') || "Bloqueada"}</span>
                            )
                        )}
                    </div>

                    {showProgressBar && (
                        <div className="w-full mt-2">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, ((progress || 0) / threshold!) * 100)}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 block text-center">
                                {Math.min(progress || 0, threshold!)} / {threshold}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};
