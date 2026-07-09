import React, { useEffect, useState } from 'react';
import { X, PlayCircle, Clock, MapPin, Award } from 'lucide-react';
import { Ruta, Site } from '../../types';
import { Button } from '../ui/button';
import { LazyImage } from '../ui/lazy-image';
import { ScrollArea } from '../ui/scroll-area';
import { cn, getTranslated, formatDuration } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { BADGES } from '../../data/badges';
import { useAuth } from '../../contexts/AuthContext';
import { routesService } from '../../services/routes.service';

interface RouteIntroModalProps {
    route: Ruta;
    sites: Site[];
    onStart: () => void;
    onClose: () => void;
    onAuthRequired?: () => void;
}

const RouteIntroModal: React.FC<RouteIntroModalProps> = ({ route, sites, onStart, onClose, onAuthRequired }) => {
    const { t, language } = useI18n();
    const { isAuthenticated, user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        if (isAuthenticated && user && route.requires_registration) {
            routesService.getRegistrations(route.id).then(regs => {
                if (regs.some(r => r.profiles?.id === user.id || r.user_id === user.id)) {
                    setIsRegistered(true);
                }
            });
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAuthenticated, user, route.id, route.requires_registration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleStart = () => {
        setIsVisible(false);
        setTimeout(onStart, 300);
    };

    const handleRegister = async () => {
        if (!isAuthenticated || !user) {
            if (onAuthRequired) onAuthRequired();
            return;
        }
        setIsRegistering(true);
        const success = await routesService.registerForRoute(route.id, user.id);
        setIsRegistering(false);
        if (success) {
            setIsRegistered(true);
        } else {
            alert('Error al inscribirse a la ruta.');
        }
    };

    const firstPoint = sites.find(s => s.id === route.puntos[0]);
    const badge = BADGES.find(b => b.id === route.reward_badge_id);
    const BadgeIcon = badge?.icono || Award;

    return (
        <div 
            className={cn(
                "fixed inset-0 z-[1100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={handleClose}
        >
            <div 
                className={cn(
                    "w-full h-full md:w-[90vw] md:h-[80vh] md:max-h-[800px] md:max-w-5xl md:rounded-2xl relative overflow-hidden bg-background text-foreground shadow-2xl transition-transform duration-300 transform",
                    isVisible ? "scale-100" : "scale-95"
                )}
                onClick={(e) => e.stopPropagation()}
            >
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
                        <div className="w-full h-full bg-muted" />
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md transition-colors border border-border/50"
                >
                    <X className="w-6 h-6 text-foreground" />
                </button>

                {/* Content Layer */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
                    {/* Left Column: Narrative */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-end md:justify-center">
                        <div className="space-y-6 animate-slide-up-fade">
                            {/* Header Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                <BadgeIcon className="w-3 h-3" />
                                {badge?.nombre.toUpperCase() || (language === 'es' ? "RUTA RECOMENDADA" : "RECOMMENDED ROUTE")}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">
                                {getTranslated(route, 'nombre', language)}
                            </h1>

                            {/* Power Phrase */}
                            <div className="pl-4 border-l-4 border-primary">
                                <p className="text-xl md:text-2xl font-medium italic text-foreground/80">
                                    "{getTranslated(route, 'intro_story', language) || "Explora lo desconocido."}"
                                </p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium pt-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {formatDuration(route.duracionMin, language as 'es' | 'en')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {route.puntos.length} {t('routes.points')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Justification & Call to Action (Desktop) / Bottom Sheet (Mobile) */}
                    <div className="md:w-96 bg-background/80 md:bg-background/60 backdrop-blur-xl border-t md:border-l border-border/50 p-6 md:p-10 flex flex-col">
                        <ScrollArea className="flex-1 -mr-4 pr-4 mb-6">
                            <div className="space-y-6 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                        {language === 'es' ? 'Historia de la Ruta' : 'Route Story'}
                                    </h3>
                                    <p className="text-foreground/90 leading-relaxed">
                                        {getTranslated(route, 'descripcion', language)}
                                    </p>
                                </div>

                                {route.justificaciones && Array.isArray(route.justificaciones) && route.justificaciones.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                            ¿Por qué esta ruta?
                                        </h3>
                                        <ul className="space-y-3">
                                            {route.justificaciones.map((just: string, idx: number) => (
                                                <li key={idx} className="flex gap-3 text-sm text-foreground/80">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                    {just}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {route.puntos && route.puntos.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-border/50">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                        Sitios a visitar
                                    </h3>
                                    <div className="space-y-2">
                                        {route.puntos.map((puntoId, idx) => {
                                            const site = sites.find(s => s.id === puntoId);
                                            if (!site) return null;
                                            return (
                                                <div key={idx} className="flex items-center gap-3 bg-foreground/5 p-2 rounded-lg border border-border/20">
                                                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-sm text-foreground/90 truncate">
                                                        {getTranslated(site, 'nombre', language)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </ScrollArea>

                        <div className="mt-auto pt-6 border-t border-border/50 animate-slide-up-fade" style={{ animationDelay: '200ms' }}>
                            {route.requires_registration && !isRegistered ? (
                                <Button
                                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all transform hover:-translate-y-1"
                                    onClick={handleRegister}
                                    disabled={isRegistering || Boolean(route.max_capacity && route.current_registrations !== undefined && route.current_registrations >= route.max_capacity)}
                                >
                                    {isRegistering ? 'Procesando...' : 
                                    (route.max_capacity && route.current_registrations !== undefined && route.current_registrations >= route.max_capacity) 
                                        ? 'Cupos Llenos' 
                                        : 'Inscribirse a esta ruta'}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all transform hover:-translate-y-1"
                                        onClick={handleStart}
                                    >
                                        <PlayCircle className="w-6 h-6 mr-2" />
                                        {language === 'es' ? 'Iniciar Ruta' : 'Start Route'}
                                    </Button>
                                    <p className="text-center text-xs text-muted-foreground mt-3">
                                        {language === 'es' ? 'Esta función utiliza tu ubicación en el mapa para guiarte durante el recorrido.' : 'This feature uses your location on the map to guide you during the route.'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default RouteIntroModal;
