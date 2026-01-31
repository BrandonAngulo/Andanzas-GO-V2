import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, MapPin, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { Site, Ruta } from '../../types';

interface ActiveRouteBannerProps {
    route: Ruta;
    currentStep: number;
    sites: Site[];
    onResume: () => void;
    onCancel: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const ActiveRouteBanner: React.FC<ActiveRouteBannerProps> = ({
    route,
    currentStep,
    sites,
    onResume,
    onCancel,
    onNext,
    onPrev
}) => {
    const { t, language } = useI18n();
    const currentPointId = route.puntos[currentStep];
    const currentPoint = sites.find(s => s.id === currentPointId);

    if (!route || !currentPoint) return null;

    const isFirst = currentStep === 0;
    const isLast = currentStep === route.puntos.length - 1;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[900] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
            <Card className="bg-background/95 backdrop-blur-md shadow-xl border-primary/20 ring-1 ring-primary/5">
                <CardContent className="p-3">
                    {/* Header Row: Badge, Nav, Close */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary border-primary/20 uppercase tracking-wider font-semibold" onClick={onResume}>
                                {t('guidedRoute.activeRoute') || "En Ruta"}
                            </Badge>

                            {/* Navigation Controls */}
                            <div className="flex items-center bg-muted/50 rounded-full border border-border/50 h-5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-full w-5 rounded-l-full hover:bg-muted text-muted-foreground"
                                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                                    disabled={isFirst}
                                >
                                    <ChevronLeft className="h-3 w-3" />
                                </Button>
                                <span className="text-[9px] font-mono font-medium min-w-[24px] text-center text-foreground/80 leading-none pt-0.5">
                                    {currentStep + 1}/{route.puntos.length}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-full w-5 rounded-r-full hover:bg-muted text-muted-foreground"
                                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                                    disabled={isLast}
                                >
                                    <ChevronRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 -mr-1"
                            onClick={(e) => { e.stopPropagation(); onCancel(); }}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    {/* Main Content: Info & Action */}
                    <div className="flex items-end justify-between gap-3">
                        <div className="flex-1 min-w-0 cursor-pointer pb-0.5" onClick={onResume}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <MapPin className="h-3 w-3 text-primary" />
                                <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wide leading-none">
                                    {isFirst ? (language === 'es' ? "Punto de partida" : "Starting Point") : (language === 'es' ? "Siguiente objetivo" : "Next Objective")}
                                </span>
                            </div>
                            <h4 className="font-bold text-base leading-tight truncate text-foreground">
                                {getTranslated(currentPoint, 'nombre', language)}
                            </h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const url = `https://www.google.com/maps/search/?api=1&query=${currentPoint.lat},${currentPoint.lng}`;
                                    window.open(url, '_blank');
                                }}
                                className="h-8 px-3 rounded-lg border-primary/20 text-primary hover:bg-primary/10 bg-background/50 shadow-sm"
                                title={language === 'es' ? "Cómo llegar" : "Directions"}
                            >
                                <Navigation className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">{language === 'es' ? "Cómo llegar" : "Directions"}</span>
                            </Button>
                            <Button
                                size="sm"
                                onClick={onResume}
                                className="rounded-lg shadow-sm bg-primary hover:bg-primary/90 h-8 px-4 text-xs font-semibold"
                            >
                                {t('mission.imHere')}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActiveRouteBanner;
