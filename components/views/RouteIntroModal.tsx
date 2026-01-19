import React, { useEffect, useState } from 'react';
import { X, PlayCircle, Clock, MapPin, Award } from 'lucide-react';
import { Ruta, Site } from '../../types';
import { Button } from '../ui/button';
import { LazyImage } from '../ui/lazy-image';
import { ScrollArea } from '../ui/scroll-area';
import { cn, getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { BADGES } from '../../data/badges';

interface RouteIntroModalProps {
    route: Ruta;
    sites: Site[];
    onStart: () => void;
    onClose: () => void;
}

const RouteIntroModal: React.FC<RouteIntroModalProps> = ({ route, sites, onStart, onClose }) => {
    const { t, language } = useI18n();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleStart = () => {
        setIsVisible(false);
        setTimeout(onStart, 300);
    };

    const firstPoint = sites.find(s => s.id === route.puntos[0]);
    const badge = BADGES.find(b => b.id === route.reward_badge_id);
    const BadgeIcon = badge?.icono || Award;

    return (
        <div className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <div className={cn(
                "w-full h-full md:w-[90vw] md:h-[80vh] md:max-h-[800px] md:max-w-5xl md:rounded-2xl relative overflow-hidden bg-black text-white shadow-2xl transition-transform duration-300 transform",
                isVisible ? "scale-100" : "scale-95"
            )}>
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    {firstPoint?.logoUrl ? (
                        <div className="w-full h-full animate-zoom-slow">
                            <LazyImage
                                src={firstPoint.logoUrl}
                                className="w-full h-full object-cover opacity-60"
                                alt="Route background"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-zinc-900" />
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/10"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Content Layer */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
                    {/* Left Column: Narrative */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-end md:justify-center">
                        <div className="space-y-6 animate-slide-up-fade">
                            {/* Header Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                <BadgeIcon className="w-3 h-3" />
                                {badge?.nombre.toUpperCase() || "MISIÓN ESPECIAL"}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                                {getTranslated(route, 'nombre', language)}
                            </h1>

                            {/* Power Phrase */}
                            <div className="pl-4 border-l-4 border-primary">
                                <p className="text-xl md:text-2xl font-medium italic text-gray-200">
                                    "{getTranslated(route, 'intro_story', language) || "Explora lo desconocido."}"
                                </p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-6 text-sm text-gray-300 font-medium pt-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {route.duracionMin} min
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {route.puntos.length} {t('routes.points')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Justification & Call to Action (Desktop) / Bottom Sheet (Mobile) */}
                    <div className="md:w-96 bg-black/60 md:bg-black/40 backdrop-blur-xl border-t md:border-l border-white/10 p-6 md:p-10 flex flex-col">
                        <ScrollArea className="flex-1 -mr-4 pr-4 mb-6">
                            <div className="space-y-6 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                                        {language === 'es' ? 'Historia de la Ruta' : 'Route Story'}
                                    </h3>
                                    <p className="text-gray-200 leading-relaxed">
                                        {getTranslated(route, 'descripcion', language)}
                                    </p>
                                </div>

                                {route.justificaciones && route.justificaciones.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                                            ¿Por qué esta ruta?
                                        </h3>
                                        <ul className="space-y-3">
                                            {route.justificaciones.map((just, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm text-gray-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                    {just}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {route.puntos && route.puntos.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                                        Sitios a visitar
                                    </h3>
                                    <div className="space-y-2">
                                        {route.puntos.map((puntoId, idx) => {
                                            const site = sites.find(s => s.id === puntoId);
                                            if (!site) return null;
                                            return (
                                                <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                                                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-sm text-gray-300 truncate">
                                                        {getTranslated(site, 'nombre', language)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </ScrollArea>

                        <div className="mt-auto pt-6 border-t border-white/10 animate-slide-up-fade" style={{ animationDelay: '200ms' }}>
                            <Button
                                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all transform hover:-translate-y-1"
                                onClick={handleStart}
                            >
                                <PlayCircle className="w-6 h-6 mr-2" />
                                {language === 'es' ? 'Aceptar Misión' : 'Accept Mission'}
                            </Button>
                            <p className="text-center text-xs text-gray-500 mt-3">
                                Al aceptar, inicias el rastreo de GPS y la búsqueda de insignias.
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default RouteIntroModal;
