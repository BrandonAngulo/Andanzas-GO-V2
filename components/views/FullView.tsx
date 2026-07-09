import React from 'react';
import { X, Heart, MapPin, Star, Route, Landmark, Award, ScrollText, Lightbulb, Music, UtensilsCrossed, Sparkles, CheckCircle, Shirt, Coffee, Sun, Cookie, ShieldCheck, Camera, Footprints, Activity, Clock, Calendar, ChevronLeft, Users, HelpCircle, Target, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Site, Evento, Ruta, RecomendacionRuta, RecomendacionTipo } from '../../types';
import ExpandableText from '../shared/ExpandableText';
import AddReviewInline from '../shared/AddReviewInline';
import { getTranslated, getMacroCategory, getCategoryIcon, getCategoryColor, cn, formatDuration } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { LazyImage } from '../ui/lazy-image';

interface FullViewProps {
    view: { type: string; data: any };
    onClose: () => void;
    isFav: (id: string) => boolean;
    toggleFav: (id: string) => void;
    addReview: (siteId: string, text: string, rating: number, fotos: File[]) => void;
    addToRoute: (site: Site) => void;
    goToPlaceInMap: (placeName: string) => void;
    onStartRoute: (route: Ruta) => void;
    onCompleteRoute: (id: string) => void;
    routesInProgress: string[];
    routesCompleted: string[];
    sites: Site[];
    activeRoute?: Ruta | null;
    visitedPoints?: string[];
    onVisitPoint?: () => void;
    onAuthRequired: () => void;
    onNavigateToAprende?: () => void;
}

const FullView: React.FC<FullViewProps> = ({ view, onClose, isFav, toggleFav, addReview, addToRoute, goToPlaceInMap, onStartRoute, onCompleteRoute, routesInProgress, routesCompleted, sites, activeRoute, visitedPoints, onVisitPoint, onAuthRequired, onNavigateToAprende }) => {
    const { t, language } = useI18n();
    const { user } = useAuth();
    const { type, data } = view;

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!data) return null;

    const viewTitle = getTranslated(data, type === 'event' ? 'titulo' : 'nombre', language);

    const handleAuthAction = (action: () => void) => {
        if (!user) {
            onAuthRequired();
            return;
        }
        action();
    };

    return (
        <div className="fixed inset-0 z-[1100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200" onClick={onClose}>
            <div className="min-h-full w-full" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 border-b bg-background/90 px-3 py-2 flex items-center gap-2 z-10 backdrop-blur-md">
                    <Button variant="ghost" size="sm" onClick={onClose} aria-label="Atrás" className="flex items-center gap-1 rounded-full pr-4 text-primary hover:bg-primary/10 transition-colors shrink-0">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-semibold text-sm hidden sm:inline-block">
                            {type === 'site' && (language === 'es' ? 'Volver a explorar' : 'Back to explore')}
                            {type === 'route' && (language === 'es' ? 'Volver a rutas' : 'Back to routes')}
                            {type === 'event' && (language === 'es' ? 'Volver a eventos' : 'Back to events')}
                            {type === 'challenge_lobby' && (language === 'es' ? 'Volver' : 'Back')}
                            {type === 'challenge_verdict' && (language === 'es' ? 'Volver a historias' : 'Back to stories')}
                        </span>
                        <span className="font-semibold text-sm sm:hidden">
                            {language === 'es' ? 'Atrás' : 'Back'}
                        </span>
                    </Button>
                    <div className="font-bold truncate flex-1 text-center">
                        {viewTitle}
                    </div>
                    {type === 'site' ? (
                        <Button variant="ghost" size="sm" className="rounded-full px-3 shrink-0" onClick={() => handleAuthAction(() => toggleFav(data.id))}>
                            <Heart className={cn("h-4 w-4", isFav(data.id) ? "fill-red-500 text-red-500" : "")} />
                        </Button>
                    ) : (
                        <div className="w-[52px]" /> /* Spacer to keep title centered if no favorite button */
                    )}
                </div>

                <div className="mx-auto max-w-5xl p-3 grid gap-3 pb-safe">
                    {(data.img || data.logoUrl) && (
                        <div className="relative w-full h-[36vh] md:h-[44vh] overflow-hidden rounded-2xl group">
                            <LazyImage
                                src={data.img || data.logoUrl}
                                alt={viewTitle as string}
                                textFallback={viewTitle as string}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                            {(data.image_credit) && (
                                <div className="absolute bottom-2 right-3 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    📷 {data.image_credit}
                                </div>
                            )}
                        </div>
                    )}

                    {type === 'site' && <SiteDetail data={data} sites={sites} addReview={(id: string, txt: string, rat: number, fotos: File[]) => handleAuthAction(() => addReview(id, txt, rat, fotos))} addToRoute={(s: Site) => handleAuthAction(() => addToRoute(s))} goToPlaceInMap={goToPlaceInMap} activeRoute={activeRoute} visitedPoints={visitedPoints} onVisitPoint={onVisitPoint ? () => handleAuthAction(onVisitPoint) : undefined} onClose={onClose} onNavigateToAprende={onNavigateToAprende} />}
                    {type === 'event' && <EventDetail data={data} sites={sites} addToRoute={(s: Site) => handleAuthAction(() => addToRoute(s))} goToPlaceInMap={goToPlaceInMap} />}
                    {type === 'route' && <RouteDetail data={data} goToPlaceInMap={goToPlaceInMap} onStartRoute={onStartRoute} onCompleteRoute={onCompleteRoute} routesInProgress={routesInProgress} routesCompleted={routesCompleted} sites={sites} />}

                    <div className="h-8" />
                </div>
            </div>
        </div>
    );
};


// --- Helper Components for Rich Content Sections ---

const InfoSection: React.FC<{ icon: React.ElementType, title: string, content?: string }> = ({ icon: Icon, title, content }) => {
    if (!content) return null;
    return (
        <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-primary" />
                <span>{title}</span>
            </h3>
            <p className="text-muted-foreground text-[15px] leading-relaxed pl-7">{content}</p>
        </div>
    );
};

const ListInfoSection: React.FC<{ icon: React.ElementType, title: string, items?: string[] }> = ({ icon: Icon, title, items }) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Icon className="h-5 w-5 text-primary" />
                <span>{title}</span>
            </h3>
            <ul className="space-y-2 pl-7">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground text-[15px]">
                        <Icon className="h-4 w-4 mt-1 text-primary/80 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const RecomendacionCard: React.FC<{ recomendacion: RecomendacionRuta }> = ({ recomendacion }) => {
    const { language } = useI18n();
    const icons: Record<RecomendacionTipo, React.ReactNode> = {
        'Música': <Music className="h-6 w-6 text-primary" />,
        'Sabores': <UtensilsCrossed className="h-6 w-6 text-primary" />,
        'Experiencia': <Sparkles className="h-6 w-6 text-primary" />,
        'Vestuario': <Shirt className="h-6 w-6 text-primary" />,
        'Bebida': <Coffee className="h-6 w-6 text-primary" />,
        'Mejor Hora': <Sun className="h-6 w-6 text-primary" />,
        'Snack': <Cookie className="h-6 w-6 text-primary" />,
        'Seguridad': <ShieldCheck className="h-6 w-6 text-primary" />,
        'Sabor': <UtensilsCrossed className="h-6 w-6 text-primary" />,
        'Foto': <Camera className="h-6 w-6 text-primary" />,
        'Transporte': <Footprints className="h-6 w-6 text-primary" />,
        'Salud': <Activity className="h-6 w-6 text-primary" />,
        'Horario': <Clock className="h-6 w-6 text-primary" />,
        'Planificación': <Calendar className="h-6 w-6 text-primary" />,
        'Ubicación': <MapPin className="h-6 w-6 text-primary" />,
    };

    return (
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 mt-1">{icons[recomendacion.tipo]}</div>
            <div>
                <h4 className="font-semibold">{getTranslated(recomendacion, 'titulo', language)}</h4>
                <p className="text-sm text-muted-foreground">{getTranslated(recomendacion, 'descripcion', language)}</p>
            </div>
        </div>
    );
};


// Site Detail Component
const SiteDetail: React.FC<{ data: Site, sites: Site[], addReview: any, addToRoute: any, goToPlaceInMap: any, activeRoute?: Ruta | null, visitedPoints?: string[], onVisitPoint?: () => void, onClose: () => void, onNavigateToAprende?: () => void }> = ({ data, sites, addReview, addToRoute, goToPlaceInMap, activeRoute, visitedPoints, onVisitPoint, onClose, onNavigateToAprende }) => {
    const { t, language } = useI18n();
    const isInRoute = activeRoute?.puntos.includes(data.id);
    const isVisited = visitedPoints?.includes(data.id);

    return (
        <div className="grid gap-4">
            {isInRoute && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wide opacity-80">{t('guidedRoute.activeRoute') || "Ruta Activa"}</span>
                        <span className="font-bold text-lg">{isVisited ? (t('visitCompleted') || "¡Sitio Visitado!") : (t('visitPending') || "¿Estás aquí?")}</span>
                    </div>
                    {!isVisited && onVisitPoint && (
                        <Button onClick={onVisitPoint} size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 animate-pulse hover:animate-none">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {t('checkIn') || "Registrar Visita"}
                        </Button>
                    )}
                    {isVisited && (
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold leading-tight">{getTranslated(data, 'nombre', language)}</h2>
                    <div className="text-sm text-muted-foreground -mt-1">{getMacroCategory(getTranslated(data, 'tipo', language) as string, language)}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary"><MapPin className="h-3 w-3 mr-1" /> Cali</Badge>
                    <Badge><Star className="h-3 w-3 mr-1" /> {data.rating}</Badge>
                </div>
            </div>

            {/* Capa Breve de Decisión */}
            {data.gancho_emocional && (
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg my-4">
                    <p className="text-lg font-medium italic text-foreground/90">
                        "{getTranslated(data, 'gancho_emocional', language)}"
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {(data.por_que_ir && data.por_que_ir.length > 0) && (
                    <div className="bg-muted/30 p-4 rounded-xl border">
                        <h4 className="font-semibold text-primary flex items-center gap-2 mb-2"><Heart className="w-4 h-4" /> Por qué ir</h4>
                        <ul className="space-y-1">
                            {(getTranslated(data, 'por_que_ir', language) as string[]).map((razon: string, i: number) => (
                                <li key={i} className="text-sm flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 mt-0.5 text-green-500 shrink-0" /> <span>{razon}</span></li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {data.que_hacer && (
                    <div className="bg-muted/30 p-4 rounded-xl border">
                        <h4 className="font-semibold text-primary flex items-center gap-2 mb-2"><Activity className="w-4 h-4" /> Qué hacer allí</h4>
                        <p className="text-sm text-muted-foreground">{getTranslated(data, 'que_hacer', language)}</p>
                    </div>
                )}

                {(data.mejor_momento || data.ideal_para || data.duracion_sugerida) && (
                    <div className="bg-muted/30 p-4 rounded-xl border sm:col-span-2 flex flex-wrap gap-4 text-sm justify-between">
                        {data.mejor_momento && (
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> <b>Cuándo ir:</b> <span className="text-muted-foreground">{getTranslated(data, 'mejor_momento', language)}</span></div>
                        )}
                        {data.duracion_sugerida && (
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> <b>Tiempo:</b> <span className="text-muted-foreground">{getTranslated(data, 'duracion_sugerida', language)}</span></div>
                        )}
                        {data.ideal_para && data.ideal_para.length > 0 && (
                            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> <b>Ideal para:</b> <span className="text-muted-foreground">{(getTranslated(data, 'ideal_para', language) as string[]).join(', ')}</span></div>
                        )}
                    </div>
                )}

                {data.micro_reto && (
                    <div className="bg-orange-500/10 border border-orange-200 p-4 rounded-xl sm:col-span-2 flex items-start gap-3">
                        <div className="bg-orange-500 text-white p-2 rounded-full shrink-0"><Target className="w-5 h-5" /></div>
                        <div>
                            <h4 className="font-bold text-orange-700 dark:text-orange-400">Micro-Reto</h4>
                            <p className="text-sm text-orange-800/80 dark:text-orange-200/80">{getTranslated(data, 'micro_reto', language)}</p>
                        </div>
                    </div>
                )}
            </div>

            <ExpandableText text={getTranslated(data, 'descripcion', language) as string} sites={sites} currentSiteId={data.id} currentSiteName={getTranslated(data, 'nombre', language) as string} />

            {/* Pa que sepas link */}
            {onNavigateToAprende && (
                <div 
                    className="my-6 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => { onClose(); onNavigateToAprende(); }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-primary">Conoce más en Pa' que sepás</h4>
                            <p className="text-xs text-muted-foreground">Historias y datos curiosos de la ciudad</p>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2 border-b pb-4">
                <Button size="sm" onClick={() => goToPlaceInMap(data.nombre)}>{t('fullView.viewOnMap')}</Button>
                <Button variant="outline" size="sm" onClick={() => addToRoute(data)}><Route className="h-4 w-4 mr-1" /> {t('fullView.addToRoute')}</Button>
                <AddReviewInline site={data} onSubmit={addReview} />
            </div>
            {/* Información Práctica */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-sm shadow-sm">
                <div className="flex items-start gap-3.5 bg-muted/20 p-3 rounded-xl border border-border/30">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground block mb-0.5">{language === 'es' ? 'Dirección' : 'Address'}</span>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.nombre + ', Cali')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs font-bold flex items-center gap-1 mt-1"
                        >
                            {language === 'es' ? 'Ver en Google Maps' : 'View on Google Maps'} ↗
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-3.5 bg-muted/20 p-3 rounded-xl border border-border/30">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground block mb-0.5">{language === 'es' ? 'Horario' : 'Schedule'}</span>
                        <span className="text-foreground font-semibold text-xs leading-relaxed">
                            {getTranslated(data, 'horario', language) || (language === 'es' ? 'No disponible' : 'Not available')}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-3.5 bg-muted/20 p-3 rounded-xl border border-border/30">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground block mb-0.5">{language === 'es' ? 'Tarifa' : 'Admission'}</span>
                        <span className="text-foreground font-semibold text-xs leading-relaxed">
                            {getTranslated(data, 'tarifa', language) || (language === 'es' ? 'No disponible' : 'Not available')}
                        </span>
                    </div>
                </div>

                {data.accessibility_features && data.accessibility_features.length > 0 && (
                    <div className="flex items-start gap-3.5 sm:col-span-2 lg:col-span-3 border-t border-dashed pt-4 mt-1">
                        <Activity className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground block mb-2">{language === 'es' ? 'Accesibilidad' : 'Accessibility'}</span>
                            <div className="flex flex-wrap gap-1.5">
                                {data.accessibility_features.map((feature, idx) => (
                                    <Badge key={idx} variant="outline" className="text-[10px] py-0.5 px-2 bg-primary/5 border-primary/20 text-primary font-bold rounded-md">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-6 pt-2">
                <InfoSection icon={Landmark} title={t('fullView.culturalImportance')} content={getTranslated(data, 'importancia', language) as string} />
                <ListInfoSection icon={Award} title={t('fullView.recognitions')} items={getTranslated(data, 'reconocimientos', language) as string[]} />
                <InfoSection icon={ScrollText} title={t('fullView.historicalFacts')} content={getTranslated(data, 'datosHistoricos', language) as string} />
                <ListInfoSection icon={Lightbulb} title={t('fullView.funFacts')} items={getTranslated(data, 'datosCuriosos', language) as string[]} />
            </div>
        </div>
    );
};

const EventDetail: React.FC<{ data: Evento, addToRoute: (site: Site) => void, goToPlaceInMap: (placeName: string) => void, sites: Site[] }> = ({ data, addToRoute, goToPlaceInMap, sites }) => {
    const { t, language } = useI18n();
    const siteForRoute = sites.find(s => s.id === data.siteId) || sites.find(s => s.nombre === data.lugar || s.nombre_en === data.lugar_en);
    return (
        <div className="grid gap-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold leading-tight">{getTranslated(data, 'titulo', language)}</h2>
                    <div className="text-sm text-muted-foreground -mt-1">{new Date(data.fecha).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <Badge variant="secondary"><MapPin className="h-3 w-3 mr-1" /> {getTranslated(data, 'lugar', language)}</Badge>
            </div>
            <ExpandableText text={getTranslated(data, 'descripcion', language) as string} sites={sites} />

            <div className="grid gap-4 pt-2 pb-2">
                <InfoSection icon={Users} title={language === 'es' ? 'Quiénes lo lideran' : 'Led by'} content={getTranslated(data, 'quienes_lideran', language) as string} />
                <InfoSection icon={CheckCircle} title={language === 'es' ? 'Qué permiten' : 'What is allowed'} content={getTranslated(data, 'que_permiten', language) as string} />
                <InfoSection icon={HelpCircle} title={language === 'es' ? 'Cómo participar' : 'How to participate'} content={getTranslated(data, 'como_participar', language) as string} />
                <InfoSection icon={Lightbulb} title={language === 'es' ? 'Curiosidades' : 'Fun facts'} content={getTranslated(data, 'curiosidades', language) as string} />
            </div>

            <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-xs text-muted-foreground">
                <span className="font-semibold block mb-1">{language === 'es' ? 'Aviso Legal' : 'Legal Notice'}:</span>
                {language === 'es'
                    ? "Esta es una lista de eventos del calendario cultural de la ciudad (Cali) rastreada por Andanzas GO a través de fuentes oficiales, sitios mapeados y aliados. Estos eventos no son ofertados ni gestionados por Andanzas GO."
                    : "This is a list of events from the cultural calendar of the city (Cali) tracked by Andanzas GO through official sources, mapped sites, and partners. These events are not offered or managed by Andanzas GO."
                }
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b pb-4">
                <Button size="sm" onClick={() => goToPlaceInMap(getTranslated(data, 'lugar', language) as string)}>{t('fullView.viewOnMap')}</Button>
                {siteForRoute && <Button variant="outline" size="sm" onClick={() => addToRoute(siteForRoute)}><Route className="h-4 w-4 mr-1" /> {t('fullView.addToRoute')}</Button>}
            </div>
        </div>
    );
};

const RouteDetail: React.FC<{ data: Ruta, goToPlaceInMap: (placeName: string) => void, onStartRoute: (route: Ruta) => void, onCompleteRoute: (id: string) => void, routesInProgress: string[], routesCompleted: string[], sites: Site[] }> = ({ data, goToPlaceInMap, onStartRoute, onCompleteRoute, routesInProgress, routesCompleted, sites }) => {
    const { t, language } = useI18n();
    const points = data.puntos.map(pId => sites.find(s => s.id === pId)).filter(Boolean) as Site[];

    const isCompleted = routesCompleted.includes(data.id);
    const isInProgress = routesInProgress.includes(data.id);

    const ActionButton: React.FC = () => {
        if (isCompleted) {
            return <Button size="lg" disabled className="bg-green-600 text-white"><CheckCircle className="h-5 w-5 mr-2" /> {t('fullView.routeCompleted')}</Button>;
        }
        if (isInProgress) {
            return (
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button size="lg" onClick={() => onStartRoute(data)} className="flex-1 sm:flex-none">
                        <Route className="h-5 w-5 mr-2" />
                        {t('route.continue') || (language === 'es' ? "Continuar Ruta" : "Continue Route")}
                    </Button>
                    <Button size="lg" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => {
                        if (window.confirm(language === 'es' ? "¿Seguro quieres salir de la ruta?" : "Are you sure you want to exit the route?")) {
                            onCompleteRoute(data.id); // Reusing complete to just remove from active
                        }
                    }}>
                        {t('mission.cancel')}
                    </Button>
                </div>
            );
        }
        if (data.content_only || !data.puntos || data.puntos.length === 0) {
            return (
                <Button size="lg" disabled className="bg-muted text-muted-foreground border-border">
                    <Lock className="h-5 w-5 mr-2" />
                    {language === 'es' ? 'En Construcción (Solo Lectura)' : 'Under Construction (Read Only)'}
                </Button>
            );
        }
        return <Button size="lg" onClick={() => onStartRoute(data)}>{t('fullView.startRoute')}</Button>;
    };

    const justificaciones = getTranslated(data, 'justificaciones', language) as string[];

    return (
        <div className="grid gap-8">
            {/* Header with Title and Duration */}
            <div>
                <h2 className="text-3xl font-bold leading-tight">{getTranslated(data, 'nombre', language)}</h2>
                <p className="text-muted-foreground mt-1">
                    {language === 'es' ? 'Duración estimada: ' : 'Estimated duration: '}
                    {formatDuration(data.duracionMin, language as 'es' | 'en')}
                </p>
            </div>

            {/* Route Description */}
            <p className="text-foreground/90 text-base border-t pt-6">{getTranslated(data, 'descripcion', language)}</p>

            {/* Points Section */}
            <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">{t('fullView.routePoints')}</h3>
                <div className="space-y-6">
                    {points.map((p, index) => (
                        <div key={p.id} className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold text-base mt-1">{index + 1}</div>
                            <div className="flex-1">
                                <div className="font-semibold text-lg">{getTranslated(p, 'nombre', language)}</div>
                                <div className="text-sm text-muted-foreground mb-2">{getMacroCategory(getTranslated(p, 'tipo', language) as string, language)}</div>
                                <p className="text-sm text-foreground/80 leading-relaxed">{justificaciones[index]}</p>
                            </div>
                            <Button className="self-center flex-shrink-0" size="sm" variant="outline" onClick={() => goToPlaceInMap(getTranslated(p, 'nombre', language) as string)}>{t('fullView.viewOnMap')}</Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations Section */}
            {data.recomendaciones && data.recomendaciones.length > 0 && (
                <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">{t('fullView.mustSeeRecommendations')}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.recomendaciones.map((rec, index) => (
                            <RecomendacionCard key={index} recomendacion={rec} />
                        ))}
                    </div>
                </div>
            )}


            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 border-t pt-6 mt-2">
                <ActionButton />
                <Button variant="outline" size="lg" onClick={() => onStartRoute(data)}>{t('fullView.viewRouteOnMap')}</Button>
            </div>
        </div>
    );
};

export default FullView;
