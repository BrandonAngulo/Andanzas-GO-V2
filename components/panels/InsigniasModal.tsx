
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Insignia } from '../../types';
import { cn, getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { Lock, Award } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface InsigniasModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    earnedInsigniaIds: string[];
    allInsignias: Insignia[];
}

const InsigniaCard: React.FC<{ insignia: Insignia, obtenida: boolean }> = ({ insignia, obtenida }) => {
    const { language, t } = useI18n();
    const [showHint, setShowHint] = useState(false);
    const Icon = insignia.icono;

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300 group cursor-pointer h-full flex flex-col",
                obtenida
                    ? "border-yellow-500/50 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 hover:scale-[1.02] hover:shadow-md"
                    : "border-muted bg-muted/20 opacity-80 hover:opacity-100"
            )}
            onClick={() => !obtenida && setShowHint(!showHint)}
        >
            {/* Background Glow Effect for Earned */}
            {obtenida && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-all" />
            )}

            <div className="p-4 flex flex-col items-center text-center gap-3 relative z-10 flex-1">
                <div className={cn(
                    "relative p-4 rounded-full transition-transform duration-500 group-hover:rotate-12 flex-shrink-0",
                    obtenida ? "bg-white dark:bg-background shadow-sm text-yellow-600 dark:text-yellow-400" : "bg-muted text-muted-foreground"
                )}>
                    <Icon className={cn("h-10 w-10", !obtenida && "opacity-50")} />
                    {!obtenida && (
                        <div className="absolute inset-0 grid place-items-center">
                            <Lock className="h-6 w-6 text-foreground/50" />
                        </div>
                    )}
                </div>

                <div className="w-full flex flex-col items-center">
                    <h4 className={cn(
                        "font-bold text-sm mb-2 leading-tight text-balance",
                        obtenida ? "text-foreground" : "text-muted-foreground"
                    )}>
                        {getTranslated(insignia, 'nombre', language)}
                    </h4>
                    {obtenida && (
                        <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300 mb-2">
                            {t('insignias.congrats')}
                        </span>
                    )}
                </div>

                {/* Description logic */}
                <div className="text-xs text-muted-foreground mt-auto flex items-center justify-center w-full">
                    {obtenida ? (
                        <span className="text-center">{getTranslated(insignia, 'descripcion', language)}</span>
                    ) : (
                        showHint ? (
                            <span className="text-primary font-medium animate-in fade-in slide-in-from-bottom-1 text-center">
                                {t('insignias.howToEarn')}: {getTranslated(insignia, 'descripcion', language)}
                            </span>
                        ) : (
                            <span className="italic text-[10px] opacity-70">{t('insignias.locked')}</span>
                        )
                    )}
                </div>
            </div>
        </Card>
    );
};

const InsigniasModal: React.FC<InsigniasModalProps> = ({ open, onOpenChange, earnedInsigniaIds, allInsignias }) => {
    const { t, language } = useI18n();
    const earnedCount = earnedInsigniaIds.length;
    const totalCount = allInsignias.length;
    const progress = Math.round((earnedCount / totalCount) * 100);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background">
                <DialogHeader className="p-6 pb-4 shrink-0 border-b">
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Award className="h-7 w-7 text-yellow-500 fill-yellow-500/20" />
                        {t('insignias.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('insignias.description')}
                    </DialogDescription>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-2">
                        <div className="flex justify-between text-sm mb-1.5 font-medium text-muted-foreground">
                            <span>{t('insignias.progress')}</span>
                            <span className="text-foreground">{earnedCount} / {totalCount}</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-teal-400 transition-all duration-1000 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 w-full min-h-0 bg-muted/20">
                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {allInsignias.map(insignia => (
                            <InsigniaCard
                                key={insignia.id}
                                insignia={insignia}
                                obtenida={earnedInsigniaIds.includes(insignia.id)}
                            />
                        ))}
                    </div>
                </ScrollArea>
                <div className="pt-4 border-t mt-2">
                    <Button onClick={() => onOpenChange(false)} className="w-full">
                        {language === 'es' ? 'Cerrar' : 'Close'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InsigniasModal;
