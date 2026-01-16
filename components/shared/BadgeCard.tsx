import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Insignia } from '../../types';
import { cn, getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
    insignia: Insignia;
    obtenida: boolean;
    compact?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ insignia, obtenida, compact = false }) => {
    const { language, t } = useI18n();
    const [showHint, setShowHint] = useState(false);

    // Icon can be a component or string, handling both if needed, but assuming component here as per previous code
    const Icon = insignia.icono;

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300 group cursor-pointer h-full flex flex-col items-center justify-center",
                obtenida
                    ? "border-yellow-500/50 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 hover:scale-[1.02] hover:shadow-md"
                    : "border-muted bg-muted/20 opacity-80 hover:opacity-100",
                compact ? "p-3" : "p-4"
            )}
            onClick={() => !obtenida && setShowHint(!showHint)}
        >
            {/* Background Glow Effect for Earned */}
            {obtenida && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-all" />
            )}

            <div className={cn(
                "relative rounded-full transition-transform duration-500 group-hover:rotate-12 flex-shrink-0 flex items-center justify-center",
                obtenida ? "bg-white dark:bg-background shadow-sm text-yellow-600 dark:text-yellow-400" : "bg-muted text-muted-foreground",
                compact ? "w-12 h-12 p-3" : "w-16 h-16 p-4 mb-3"
            )}>
                <Icon className={cn("w-full h-full", !obtenida && "opacity-50")} />
                {!obtenida && (
                    <div className="absolute inset-0 grid place-items-center">
                        <Lock className="w-1/2 h-1/2 text-foreground/50" />
                    </div>
                )}
            </div>

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
                </div>
            )}
        </Card>
    );
};
