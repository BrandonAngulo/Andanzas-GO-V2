import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, MapPin } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { Site, Ruta } from '../../types';

interface ActiveRouteBannerProps {
    route: Ruta;
    currentStep: number;
    sites: Site[];
    onResume: () => void;
    onCancel: () => void;
}

const ActiveRouteBanner: React.FC<ActiveRouteBannerProps> = ({
    route,
    currentStep,
    sites,
    onResume,
    onCancel
}) => {
    const { t, language } = useI18n();
    const currentPointId = route.puntos[currentStep];
    const currentPoint = sites.find(s => s.id === currentPointId);

    if (!route || !currentPoint) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[900] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md animate-in slide-in-from-bottom-5">
            <Card className="bg-background/95 backdrop-blur shadow-2xl border-primary/20 ring-1 ring-primary/10">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={onResume}>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                                {t('guidedRoute.activeRoute') || "Ruta Activa"}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                                {currentStep + 1} / {route.puntos.length} • {getTranslated(currentPoint, 'nombre', language)}
                            </span>
                        </div>
                        <h4 className="font-semibold text-sm truncate flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {t('mission.imHere')}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={onResume} className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                            {t('mission.imHere')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={(e) => { e.stopPropagation(); onCancel(); }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActiveRouteBanner;
