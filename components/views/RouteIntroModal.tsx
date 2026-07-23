import { toast } from "sonner";
import React, { useEffect, useState } from 'react';
import { X, PlayCircle, Clock, MapPin, Award, ChevronRight, Footprints, Navigation, Sparkles, Flag } from 'lucide-react';
import { Ruta, Site } from '../../types';
import { Button } from '../ui/button';
import { LazyImage } from '../ui/lazy-image';
import { ScrollArea } from '../ui/scroll-area';
import { cn, getTranslated, formatDuration } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { BADGES } from '../../data/badges';
import { useAuth } from '../../contexts/AuthContext';
import { routesService } from '../../services/routes.service';
import { imagePositionStyle } from '../shared/ImagePositioner';

interface RouteIntroModalProps {
    route: Ruta;
    sites: Site[];
    onStart: () => void;
    onClose: () => void;
    onAuthRequired?: () => void;
}

const RouteIntroModal: React.FC<RouteIntroModalProps> = ({ route, sites, onStart, onClose, onAuthRequired }) => {
    const { language } = useI18n();
    const { isAuthenticated, user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState<'confirmed' | 'waitlist' | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        if (isAuthenticated && user && route.requires_registration) {
            routesService.getRegistrations(route.id).then(regs => {
                const ownRegistration = regs.find(r => r.profiles?.id === user.id || r.user_id === user.id);
                setRegistrationStatus(ownRegistration?.status === 'waitlist' ? 'waitlist' : ownRegistration ? 'confirmed' : null);
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
        const result = await routesService.registerForRoute(route.id);
        setIsRegistering(false);
        if (result.success && result.status) {
            setRegistrationStatus(result.status);
            toast.success(result.status === 'confirmed' ? 'Inscripción confirmada.' : 'Te agregamos a la lista de espera.');
        } else {
            toast.error('Error al inscribirse a la ruta.');
        }
    };

    const handleCancelRegistration = async () => {
        setIsRegistering(true);
        const cancelled = await routesService.cancelRegistration(route.id);
        setIsRegistering(false);
        if (cancelled) {
            setRegistrationStatus(null);
            toast.success('Inscripción cancelada.');
        } else {
            toast.error('No fue posible cancelar la inscripción.');
        }
    };

    const firstPoint = sites.find(s => s.id === route.puntos[0]);
    const badge = BADGES.find(b => b.id === route.reward_badge_id);
    const BadgeIcon = badge?.icono || Award;
    const routePoints = route.puntos
        .map(pointId => sites.find(site => site.id === pointId))
        .filter(Boolean) as Site[];
    const routeImage = route.image_url || route.coverUrl || firstPoint?.fotos?.[0] || firstPoint?.logoUrl || '';

    return (
        <div
            className={cn(
                'fixed inset-0 z-[1100] flex items-end justify-center bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 md:items-center',
                isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={handleClose}
            role="presentation"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="route-intro-title"
                className={cn(
                    'relative flex h-[96dvh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-background text-foreground shadow-2xl transition-transform duration-300 md:h-[86vh] md:max-h-[860px] md:w-[92vw] md:max-w-6xl md:flex-row md:rounded-[2rem]',
                    isVisible ? 'translate-y-0 scale-100' : 'translate-y-6 scale-[0.98]',
                )}
                onClick={event => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/30 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/50"
                    aria-label={language === 'es' ? 'Cerrar presentación de la ruta' : 'Close route presentation'}
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="relative h-[39%] shrink-0 overflow-hidden bg-emerald-950 md:h-full md:w-[56%]">
                    <LazyImage
                        src={routeImage}
                        className="h-full w-full object-cover"
                        alt=""
                        style={imagePositionStyle(route.image_position)}
                        textFallback={getTranslated(route, 'nombre', language) as string}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#052f2b] via-black/10 to-black/15 md:bg-gradient-to-r md:from-black/5 md:via-black/10 md:to-[#052f2b]/55" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7 md:p-10">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/30 bg-orange-300/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-orange-950 shadow-sm">
                            <BadgeIcon className="h-3.5 w-3.5" />
                            {badge?.nombre || (language === 'es' ? 'Ruta recomendada' : 'Recommended route')}
                        </span>
                        <h1 id="route-intro-title" className="max-w-2xl font-heading text-3xl font-black leading-[1.02] sm:text-4xl md:text-6xl">
                            {getTranslated(route, 'nombre', language)}
                        </h1>
                        <p className="mt-2 line-clamp-2 max-w-xl text-sm font-medium text-white/82 md:text-lg">
                            {getTranslated(route, 'intro_story', language) || (language === 'es' ? 'Una historia para recorrer paso a paso.' : 'A story to explore one step at a time.')}
                        </p>

                        {routePoints.length > 0 && (
                            <div className="mt-5 hidden max-w-lg items-center md:flex">
                                {routePoints.slice(0, 6).map((site, index) => (
                                    <React.Fragment key={site.id}>
                                        <span className={cn(
                                            'grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-white text-xs font-black shadow-lg',
                                            index === 0 ? 'bg-orange-400 text-orange-950' : 'bg-emerald-600 text-white',
                                        )}>
                                            {index + 1}
                                        </span>
                                        {index < Math.min(routePoints.length, 6) - 1 && (
                                            <span className="h-px flex-1 border-t-2 border-dashed border-white/70" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col bg-background md:w-[44%]">
                    <ScrollArea className="min-h-0 flex-1">
                        <div className="space-y-6 p-5 pb-7 sm:p-7 md:p-9">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-950 dark:bg-emerald-950/45 dark:text-emerald-50">
                                    <Clock className="mb-2 h-4 w-4 text-emerald-600" />
                                    <p className="text-xs font-black">{formatDuration(route.duracionMin, language as 'es' | 'en')}</p>
                                    <p className="mt-0.5 text-[10px] opacity-65">{language === 'es' ? 'Duración' : 'Duration'}</p>
                                </div>
                                <div className="rounded-2xl bg-orange-50 p-3 text-orange-950 dark:bg-orange-950/30 dark:text-orange-50">
                                    <Footprints className="mb-2 h-4 w-4 text-orange-500" />
                                    <p className="text-xs font-black">{routePoints.length}</p>
                                    <p className="mt-0.5 text-[10px] opacity-65">{language === 'es' ? 'Paradas' : 'Stops'}</p>
                                </div>
                                <div className="rounded-2xl bg-sky-50 p-3 text-sky-950 dark:bg-sky-950/30 dark:text-sky-50">
                                    <Navigation className="mb-2 h-4 w-4 text-sky-500" />
                                    <p className="text-xs font-black">{language === 'es' ? 'Guiada' : 'Guided'}</p>
                                    <p className="mt-0.5 text-[10px] opacity-65">{language === 'es' ? 'Con mapa' : 'With map'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    {language === 'es' ? 'La experiencia' : 'The experience'}
                                </p>
                                <p className="text-sm leading-relaxed text-foreground/75">
                                    {getTranslated(route, 'descripcion', language)}
                                </p>
                                {getTranslated(route, 'narrative_question', language) && (
                                    <div className="mt-4 rounded-2xl border border-orange-300/55 bg-gradient-to-br from-orange-50 to-amber-50 p-4 text-orange-950 shadow-sm dark:border-orange-500/25 dark:from-orange-950/35 dark:to-amber-950/20 dark:text-orange-50">
                                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">
                                            <Flag className="h-3.5 w-3.5" />
                                            {language === 'es' ? 'Tu misión' : 'Your mission'}
                                        </p>
                                        <p className="mt-2 text-sm font-black leading-snug">
                                            {getTranslated(route, 'narrative_question', language)}
                                        </p>
                                        {getTranslated(route, 'intro_text', language) && (
                                            <p className="mt-1.5 text-xs font-semibold leading-relaxed text-orange-900/80 dark:text-orange-100/80">
                                                {getTranslated(route, 'intro_text', language)}
                                            </p>
                                        )}
                                        <p className="mt-1.5 text-xs leading-relaxed text-orange-900/70 dark:text-orange-100/70">
                                            {language === 'es'
                                                ? 'Cada parada revelará una pieza de la respuesta. Observa el lugar antes de responder.'
                                                : 'Every stop will reveal part of the answer. Observe the place before responding.'}
                                        </p>
                                    </div>
                                )}
                                <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-700/10 bg-emerald-50/80 px-3 py-2.5 dark:bg-emerald-950/30">
                                    <img
                                        src="/brand/andi/andi-frontal-512-transparent-v2.png"
                                        alt=""
                                        className="h-14 w-14 shrink-0 object-contain object-bottom"
                                        aria-hidden="true"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                                            {language === 'es' ? 'Andi va contigo' : 'Andi goes with you'}
                                        </p>
                                        <p className="mt-0.5 text-xs leading-relaxed text-foreground/70">
                                            {language === 'es'
                                                ? 'Te mostraré la siguiente parada y guardaré tu avance durante el recorrido.'
                                                : 'I will show you the next stop and keep track of your progress along the route.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {routePoints.length > 0 && (
                                <div>
                                    <h2 className="mb-3 text-sm font-black">
                                        {language === 'es' ? 'Así será tu recorrido' : 'Your route at a glance'}
                                    </h2>
                                    <ol className="space-y-0">
                                        {routePoints.map((site, index) => (
                                            <li key={site.id} className="relative flex gap-3 pb-4 last:pb-0">
                                                {index < routePoints.length - 1 && (
                                                    <span className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] border-l-2 border-dashed border-emerald-500/35" />
                                                )}
                                                <span className={cn(
                                                    'relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black',
                                                    index === 0 ? 'bg-orange-400 text-orange-950' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
                                                )}>
                                                    {index + 1}
                                                </span>
                                                <div className="min-w-0 flex-1 rounded-2xl border border-border/60 bg-card px-3 py-2.5">
                                                    <p className="truncate text-sm font-bold">{getTranslated(site, 'nombre', language)}</p>
                                                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {language === 'es' ? 'Parada cultural' : 'Cultural stop'}
                                                    </p>
                                                </div>
                                                <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-muted-foreground/50" />
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="shrink-0 border-t border-border/60 bg-background/96 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-18px_45px_-34px_rgba(15,23,42,0.6)] backdrop-blur-xl sm:px-7">
                        {route.requires_registration && !registrationStatus ? (
                            <Button className="h-14 w-full rounded-2xl text-base font-black" onClick={handleRegister} disabled={isRegistering}>
                                {isRegistering
                                    ? (language === 'es' ? 'Procesando...' : 'Processing...')
                                    : (route.max_capacity && route.current_registrations !== undefined && route.current_registrations >= route.max_capacity)
                                        ? (language === 'es' ? 'Unirme a la lista de espera' : 'Join waitlist')
                                        : (language === 'es' ? 'Inscribirme en esta ruta' : 'Register for this route')}
                            </Button>
                        ) : route.requires_registration && registrationStatus === 'waitlist' ? (
                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-3">
                                <div>
                                    <p className="text-sm font-black text-amber-700 dark:text-amber-300">{language === 'es' ? 'Estás en lista de espera' : 'You are on the waitlist'}</p>
                                    <p className="text-[11px] text-muted-foreground">{language === 'es' ? 'Te avisaremos cuando haya un cupo.' : 'We will notify you when a spot opens.'}</p>
                                </div>
                                <Button variant="ghost" size="sm" disabled={isRegistering} onClick={() => void handleCancelRegistration()}>
                                    {language === 'es' ? 'Salir' : 'Leave'}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button className="h-14 w-full rounded-2xl bg-emerald-600 text-base font-black text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-700" onClick={handleStart}>
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    {language === 'es' ? 'Comenzar recorrido' : 'Start route'}
                                </Button>
                                <p className="mt-2 text-center text-[10px] text-muted-foreground">
                                    {language === 'es' ? 'Usaremos tu ubicación solamente para guiarte y registrar tus paradas.' : 'We use your location only to guide you and register stops.'}
                                </p>
                                {route.requires_registration && registrationStatus === 'confirmed' && (
                                    <Button className="mt-1 w-full" variant="ghost" size="sm" disabled={isRegistering} onClick={() => void handleCancelRegistration()}>
                                        {language === 'es' ? 'Cancelar inscripción' : 'Cancel registration'}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RouteIntroModal;
