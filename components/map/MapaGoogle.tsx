import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { toast } from 'sonner';
import { Filter, Loader2, Navigation, MapPin, AlertTriangle, X, Info, Star } from 'lucide-react';
import { Site, Ruta } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { cn, getTranslated } from '../../lib/utils';
import { LazyImage } from '../ui/lazy-image';
import { Switch } from '../ui/switch';

// ... (Rest of imports and interfaces same as before)
interface MapaGoogleProps {
    sites: Site[];
    onSelect: (site: Site) => void;
    allCategories: string[];
    selectedCategories: string[];
    onCategoryChange: (category: string, checked: boolean) => void;
    onClearCategories: () => void;
    isFiltered: boolean;
    onResetFilter: () => void;
    isLoading?: boolean;
    activeRoute?: Ruta | null;
    minRating?: number;
    onRatingChange?: (rating: number) => void;
    showAccessibilityOnly?: boolean;
    onAccessibilityChange?: (val: boolean) => void;
    plannedRoutePoints?: Site[];
}

const DEFAULT_CENTER = { lat: 3.4516, lng: -76.5320 };
const DEFAULT_ZOOM = 13;

const getCategoryIcon = (category: string) => {
    const emojiMap: { [key: string]: string } = {
        "Museo": "🏛️", "Museum": "🏛️",
        "Teatro": "🎭", "Theater": "🎭",
        "Espacio público": "🌳", "Public Space": "🌳",
        "Espacio de Arte": "🎨", "Art Space": "🎨",
        "Monumento": "🗿", "Monument": "🗿",
        "Centro Cultural": "🏛️", "Cultural Center": "🏛️",
        "Centro Cultural Comunitario": "🏘️", "Community Cultural Center": "🏘️",
        "Música en Vivo": "🎵", "Live Music": "🎵",
        "Escultura": "🗿", "Sculpture": "🗿",
        "Gastronomía": "🍽️", "Gastronomy": "🍽️",
        "Biblioteca": "📚", "Library": "📚",
        "Artesanías": "🏺", "Crafts": "🏺",
        "Taller Artesanal": "🛠️", "Artisanal Workshop": "🛠️",
        "Muralismo": "🖌️", "Muralism": "🖌️",
        "Parque Natural": "🏞️", "Natural Park": "🏞️",
        "Parque Natural/Cultural": "🏞️", "Natural/Cultural Park": "🏞️",
        "Librería": "📖", "Bookstore": "📖",
        "Teatro Experimental": "🎭", "Experimental Theater": "🎭",
        "Teatro Comunitario": "🎭", "Community Theater": "🎭",
        "Parque Temático": "🎡", "Theme Park": "🎡",
        "Zona Gastronómica": "🍴", "Gastronomic Zone": "🍴",
        "Universidad": "🎓", "University": "🎓",
        "Estadio": "🏟️", "Stadium": "🏟️",
        "Iglesia": "⛪", "Church": "⛪",
        "Escuela de Salsa": "💃", "Salsa School": "💃",
        "Espectáculo de Salsa": "💃", "Salsa Show": "💃",
        "Danza": "🩰", "Dance": "🩰",
        "Casa Museo": "🏡", "House Museum": "🏡",
        "Jardín Botánico": "🌸", "Botanical Garden": "🌸",
        "Música": "🎶", "Music": "🎶",
        "Hacienda Histórica": "🏰", "Historic Estate": "🏰",
        "Museo de Arte": "🖼️", "Art Museum": "🖼️",
        "Museo de Ciencias": "🔬", "Science Museum": "🔬",
        "Café Cultural": "☕", "Cultural Café": "☕",
        "Archivo Cultural": "🎞️", "Cultural Archive": "🎞️",
        "Mirador": "🔭", "Viewpoint": "🔭",
    };
    return emojiMap[category] || "📍";
};

const getCategoryColor = (category: string): string => {
    const cat = category.toLowerCase();

    if (cat.includes('parque') || cat.includes('jardín') || cat.includes('natural') || cat.includes('botánico') || cat.includes('ecoparque')) return '#10B981'; // Emerald 500
    if (cat.includes('museo') || cat.includes('biblioteca') || cat.includes('centro cultural') || cat.includes('archivo') || cat.includes('casa')) return '#3B82F6'; // Blue 500
    if (cat.includes('teatro') || cat.includes('arte') || cat.includes('cultura')) return '#8B5CF6'; // Violet 500
    if (cat.includes('salsa') || cat.includes('baile') || cat.includes('danza') || cat.includes('música') || cat.includes('vivo') || cat.includes('discoteca') || cat.includes('bar')) return '#E11D48'; // Rose 600
    if (cat.includes('iglesia') || cat.includes('estadio') || cat.includes('monumento') || cat.includes('plaza')) return '#F59E0B'; // Amber 500
    if (cat.includes('gastronomía') || cat.includes('café') || cat.includes('restaurante')) return '#F97316'; // Orange 500

    return '#64748B'; // Slate 500 (Default)
};

const MapLegend = ({ language }: { language: 'es' | 'en' }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Simplificamos las categorías para la leyenda
    const categories = [
        { label: language === 'es' ? 'Parques y Naturaleza' : 'Parks & Nature', color: '#10B981', icon: '🌳' },
        { label: language === 'es' ? 'Museos y Cultura' : 'Museums & Culture', color: '#3B82F6', icon: '🏛️' },
        { label: language === 'es' ? 'Arte y Teatro' : 'Art & Theater', color: '#8B5CF6', icon: '🎨' },
        { label: language === 'es' ? 'Salsa y Música' : 'Salsa & Music', color: '#E11D48', icon: '💃' },
        { label: language === 'es' ? 'Gastronomía' : 'Gastronomy', color: '#F97316', icon: '🍽️' },
        { label: language === 'es' ? 'Sitios Históricos / Otros' : 'Historic / Other', color: '#F59E0B', icon: '⛪' },
    ];

    return (
        <div className="absolute bottom-6 left-3 z-[40] pointer-events-auto flex flex-col items-start gap-2">
            {isOpen && (
                <Card className="w-52 shadow-xl border-none bg-background/95 backdrop-blur animate-in slide-in-from-bottom-2 fade-in mb-2">
                    <CardHeader className="p-3 pb-2 border-b">
                        <CardTitle className="text-xs font-bold flex items-center justify-between">
                            {language === 'es' ? 'Leyenda del Mapa' : 'Map Legend'}
                            <Info className="h-3 w-3 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-2.5">
                        {categories.map((cat, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-xs">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    {cat.icon}
                                </div>
                                <div className="flex-1">
                                    <span className="font-medium block leading-none">{cat.label}</span>
                                    <div className="h-0.5 w-full mt-1 rounded-full opacity-60" style={{ backgroundColor: cat.color }}></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            <Button
                variant="secondary"
                size="sm"
                className={cn(
                    "shadow-lg text-xs font-semibold h-9 transition-all border border-muted",
                    isOpen ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background/90 hover:bg-background"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Info className="h-4 w-4 mr-1.5" />
                {isOpen ? (language === 'es' ? 'Ocultar Leyenda' : 'Hide Legend') : (language === 'es' ? 'Ver Leyenda' : 'Show Legend')}
            </Button>
        </div>
    );
};

const CustomPin = ({ color, icon, number }: { color: string, icon: string, number?: number }) => (
    <div className="relative group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 origin-bottom">
        <div className="absolute top-[34px] left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black/20 rounded-full blur-[1px]"></div>
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42.5 17 42.5C17 42.5 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill={color} />
            <circle cx="17" cy="17" r="13" fill="white" fillOpacity="0.2" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-[34px] flex items-center justify-center text-[18px] leading-none select-none pointer-events-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            {number ? <span className="font-bold text-white text-sm">{number}</span> : icon}
        </div>
    </div>
);

const UserLocationMarker = ({ position }: { position: google.maps.LatLngLiteral }) => {
    return (
        <AdvancedMarker position={position} zIndex={100} className="custom-marker-host">
            <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-[2px] border-white shadow-md z-10 box-border"></div>
                <div className="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
        </AdvancedMarker>
    );
};

const RoutePolyline = ({ points, color = "#FF0000", dashed = false }: { points: google.maps.LatLngLiteral[], color?: string, dashed?: boolean }) => {
    const map = useMap();
    const lineRef = useRef<google.maps.Polyline | null>(null);

    // Init
    useEffect(() => {
        if (!map) return;

        const line = new google.maps.Polyline({
            path: points,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: dashed ? 0 : 0.8,
            strokeWeight: 4,
            icons: dashed ? [{
                icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3, strokeColor: color },
                offset: '0',
                repeat: '15px'
            }] : undefined,
            map: map
        });
        lineRef.current = line;

        return () => {
            line.setMap(null);
        };
    }, [map, color, dashed]);

    // Update path
    useEffect(() => {
        if (lineRef.current) {
            lineRef.current.setPath(points);
        }
    }, [points]);

    return null;
};

const MapContent = ({
    sites,
    onSelect,
    userPos,
    language,
    activeRoute,
    plannedRoutePoints
}: {
    sites: Site[],
    onSelect: (s: Site) => void,
    userPos: google.maps.LatLngLiteral | null,
    language: 'es' | 'en',
    activeRoute?: Ruta | null,
    plannedRoutePoints?: Site[]
}) => {
    const map = useMap();
    const [previewSite, setPreviewSite] = useState<Site | null>(null);

    const activePath = React.useMemo(() => {
        if (!activeRoute) return [];
        // Sort sites by order in activeRoute.puntos
        return activeRoute.puntos
            .map(id => sites.find(s => s.id === id))
            .filter((s): s is Site => !!s)
            .map(s => ({ lat: s.lat, lng: s.lng }));
    }, [activeRoute, sites]);

    const plannedPath = React.useMemo(() => {
        if (!plannedRoutePoints) return [];
        return plannedRoutePoints.map(s => ({ lat: s.lat, lng: s.lng }));
    }, [plannedRoutePoints]);


    useEffect(() => {
        if (!map || sites.length === 0) return;

        // Auto-fit bounds logic
        const bounds = new google.maps.LatLngBounds();
        let hasPoints = false;
        sites.forEach(site => {
            if (site.lat && site.lng) {
                bounds.extend({ lat: site.lat, lng: site.lng });
                hasPoints = true;
            }
        });

        if (hasPoints && !bounds.isEmpty()) {
            map.fitBounds(bounds, 50);
        }
    }, [map, sites.length]); // Re-fit when list changes

    return (
        <>
            {sites.map((site) => {
                const type = getTranslated(site, 'tipo', language) as string;
                const icon = getCategoryIcon(type);
                const color = getCategoryColor(type);

                let number: number | undefined;
                if (activeRoute) {
                    const idx = activeRoute.puntos.indexOf(site.id);
                    if (idx !== -1) number = idx + 1;
                }

                return (
                    <AdvancedMarker
                        key={site.id}
                        position={{ lat: site.lat, lng: site.lng }}
                        onClick={() => setPreviewSite(site)}
                        title={site.nombre}
                        zIndex={20}
                        className="custom-marker-host"
                    >
                        <CustomPin color={color} icon={icon} number={number} />
                    </AdvancedMarker>
                );
            })}

            {userPos && <UserLocationMarker position={userPos} />}

            {previewSite && (
                <InfoWindow
                    position={{ lat: previewSite.lat, lng: previewSite.lng }}
                    onCloseClick={() => setPreviewSite(null)}
                    pixelOffset={[0, -42]}
                    headerContent={
                        <div className="font-bold text-sm text-foreground flex items-center pr-4">
                            {getTranslated(previewSite, 'nombre', language)}
                        </div>
                    }
                >
                    <div className="min-w-[200px] max-w-[240px] p-0 font-sans">
                        <div className="relative w-full h-24 mb-2 rounded-md overflow-hidden bg-muted">
                            <LazyImage
                                src={previewSite.logoUrl || previewSite.fotos?.[0] || ""}
                                alt={previewSite.nombre}
                                textFallback={previewSite.nombre}
                                className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-1 right-1 text-[10px] px-1.5 h-5 backdrop-blur-sm bg-black/50 text-white border-none">
                                ⭐ {previewSite.rating}
                            </Badge>
                        </div>
                        <p className="text-xs text-secondary-foreground line-clamp-2 mb-3 leading-relaxed">
                            {getTranslated(previewSite, 'descripcion', language)}
                        </p>
                        <Button
                            size="sm"
                            className="w-full h-8 text-xs font-semibold shadow-sm"
                            onClick={() => {
                                onSelect(previewSite);
                                setPreviewSite(null);
                            }}
                        >
                            {language === 'es' ? 'Ver Detalles Completos' : 'See Full Details'}
                        </Button>
                    </div>
                </InfoWindow>
            )}

            {activePath.length > 1 && <RoutePolyline points={activePath} color="#22c55e" />}
            {plannedPath.length > 1 && <RoutePolyline points={plannedPath} color="#3b82f6" dashed />}
        </>
    );
};

const MapWrapper = (props: MapaGoogleProps) => {
    const { t, language } = useI18n();
    const map = useMap();
    const [userPos, setUserPos] = useState<google.maps.LatLngLiteral | null>(null);
    const [locating, setLocating] = useState(false);
    const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const isFirstLocationUpdate = useRef(true);

    // Cleanup geolocation on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, []);

    const toggleLocation = () => {
        if (locating) {
            setLocating(false);
            setUserPos(null);
            setGpsAccuracy(null);
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by this browser.");
            return;
        }

        setLocating(true);
        isFirstLocationUpdate.current = true;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const newPos = { lat: latitude, lng: longitude };
                setUserPos(newPos);
                setGpsAccuracy(Math.round(accuracy));

                if (map) {
                    map.panTo(newPos);

                    if (isFirstLocationUpdate.current) {
                        isFirstLocationUpdate.current = false;

                        let targetZoom = 17;
                        if (accuracy > 2000) targetZoom = 12;
                        else if (accuracy > 1000) targetZoom = 13;
                        else if (accuracy > 500) targetZoom = 14;
                        else if (accuracy > 100) targetZoom = 15;

                        map.setZoom(targetZoom);
                    }
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocating(false);
                let msg = "No se pudo obtener la ubicación.";
                if (error.code === 1) msg = "Permiso de ubicación denegado. Actívalo en tu navegador.";
                if (error.code === 2) msg = "Ubicación no disponible. Verifica tu GPS.";
                if (error.code === 3) msg = "Tiempo de espera agotado.";
                toast.error(msg);
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
        );
    };

    return (
        <div className="relative h-[66vh] md:h-[72vh] rounded-b-xl overflow-hidden group font-sans">
            {props.isLoading && (
                <div className="absolute inset-0 z-[500] bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-foreground">{t('loading') || 'Cargando mapa...'}</p>
                    </div>
                </div>
            )}

            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={DEFAULT_ZOOM}
                mapId="DEMO_MAP_ID"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                fullscreenControl={false}
                className="h-full w-full"
            >
                <MapContent
                    sites={props.sites}
                    onSelect={props.onSelect}
                    userPos={userPos}
                    language={language}
                    activeRoute={props.activeRoute}
                    plannedRoutePoints={props.plannedRoutePoints}
                />
            </Map>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-[10] pointer-events-none p-3">
                <div className="absolute top-3 left-3 pointer-events-auto flex flex-col gap-2 items-start">
                    <Badge variant="secondary" className="shadow-md bg-background/90 backdrop-blur border-none px-3 py-1.5 text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span className="hidden xs:inline">{t('mappedSites', { count: props.sites.length })}</span>
                        <span className="xs:hidden font-bold">{props.sites.length}</span>
                    </Badge>
                    {locating && gpsAccuracy !== null && (
                        <div className="flex flex-col gap-1 items-start animate-in slide-in-from-left-2">
                            <Badge variant={gpsAccuracy > 100 ? (gpsAccuracy > 1000 ? "destructive" : "secondary") : "default"} className="shadow-md backdrop-blur border-none px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                                <Navigation className="h-3 w-3" />
                                <span className="hidden xs:inline">GPS: ±{gpsAccuracy}m</span>
                            </Badge>
                            {gpsAccuracy > 1000 && (
                                <Badge variant="outline" className="bg-background/90 text-[10px] text-muted-foreground border-none shadow-sm px-2 py-0.5">
                                    {language === 'es' ? "Ubicación aprox." : "Approx location"}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end gap-2 pointer-events-auto">
                    {props.isFiltered && (
                        <Button onClick={props.onResetFilter} size="sm" variant="secondary" className="shadow-md h-10 w-auto px-3 rounded-full md:rounded-md bg-white/90 text-primary border border-primary/20">
                            <X className="h-4 w-4 mr-1" />
                            <span className="text-xs font-semibold">{t('showAll')}</span>
                        </Button>
                    )}

                    <Button
                        onClick={toggleLocation}
                        size="sm"
                        className={cn(
                            "shadow-md transition-all h-10 w-10 p-0 md:h-9 md:w-auto md:px-3 rounded-full md:rounded-md",
                            locating ? "bg-blue-600 animate-pulse text-white border-blue-500" : "bg-background/90 text-foreground hover:bg-background"
                        )}
                        variant={locating ? 'default' : 'outline'}
                    >
                        {locating ? <Loader2 className="h-5 w-5 md:h-4 md:w-4 animate-spin md:mr-2" /> : <Navigation className="h-5 w-5 md:h-4 md:w-4 md:mr-2" />}
                        <span className="hidden md:inline">{locating ? t('locating') : t('myLocation')}</span>
                    </Button>

                    <div className="relative">
                        <Button
                            variant={props.selectedCategories.length > 0 ? "default" : "outline"}
                            size="sm"
                            className={cn("bg-background/90 backdrop-blur shadow-md h-10 w-10 p-0 md:h-9 md:w-auto md:px-3 rounded-full md:rounded-md")}
                            onClick={() => setShowFilterPanel(s => !s)}
                        >
                            <Filter className="h-5 w-5 md:h-4 md:w-4 md:mr-2" />
                            <span className="hidden md:inline">{t('filter')}</span>
                            {props.selectedCategories.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground md:static md:ml-1 ring-2 ring-background md:ring-0">
                                    {props.selectedCategories.length}
                                </span>
                            )}
                        </Button>

                        {showFilterPanel && (
                            <Card className="absolute top-full right-0 mt-2 w-64 shadow-xl border-input z-[1000] animate-in fade-in zoom-in-95 origin-top-right">
                                <CardHeader className="p-3 border-b flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">{t('filterBy')}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFilterPanel(false)}><X className="h-3 w-3" /></Button>
                                </CardHeader>
                                <CardContent className="p-0 max-h-[300px]">
                                    <ScrollArea className="h-[250px] p-2">
                                        <div className="space-y-1">
                                            {props.allCategories.map(cat => (
                                                <label key={cat} className="flex items-center gap-2 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer text-sm">
                                                    <input type="checkbox" className="rounded border-gray-300" checked={props.selectedCategories.includes(cat)} onChange={(e) => props.onCategoryChange(cat, e.target.checked)} />
                                                    <span className="flex-1 truncate">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="p-3 border-t space-y-3 bg-muted/10">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                                                {language === 'es' ? 'Calificación Mínima' : 'Min Rating'}
                                                <span className="text-primary font-bold">{props.minRating && props.minRating > 0 ? props.minRating : ''}</span>
                                            </label>
                                            <div className="flex gap-1 justify-between px-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Button
                                                        key={star}
                                                        variant="ghost"
                                                        size="icon"
                                                        className={cn("h-6 w-6 hover:bg-transparent p-0", star <= (props.minRating || 0) ? "text-yellow-500" : "text-muted-foreground/30")}
                                                        onClick={() => props.onRatingChange?.(props.minRating === star ? 0 : star)}
                                                    >
                                                        <Star className={cn("h-5 w-5", star <= (props.minRating || 0) && "fill-current")} />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                                                {language === 'es' ? 'Solo Accesibles' : 'Accessible Only'}
                                            </label>
                                            <Switch
                                                checked={props.showAccessibilityOnly || false}
                                                onChange={(e) => props.onAccessibilityChange?.(e.target.checked)}
                                                className="scale-75 origin-right"
                                            />
                                        </div>
                                    </div>

                                    {(props.selectedCategories.length > 0 || (props.minRating && props.minRating > 0) || props.showAccessibilityOnly) && (
                                        <div className="p-2 border-t bg-muted/20">
                                            <Button variant="ghost" size="sm" className="w-full h-7 text-xs text-muted-foreground hover:text-destructive" onClick={props.onClearCategories}>{t('clearFilters')}</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Legend */}
            <MapLegend language={language} />

        </div>
    );
};

export default function MapaGoogle(props: MapaGoogleProps) {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // useEffect(() => {
    //      console.log("MapaGoogle mounted. API Key present:", !!API_KEY);
    // }, [API_KEY]);

    if (!API_KEY) {
        return (
            <div className="h-[66vh] md:h-[72vh] flex items-center justify-center bg-muted rounded-xl border-2 border-dashed">
                <div className="text-center p-6 space-y-4">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                    <h3 className="text-lg font-bold">Falta la API Key de Google Maps</h3>
                    <p className="text-sm text-center max-w-sm text-muted-foreground">
                        Para usar el modo Google Maps, debes agregar tu <code>VITE_GOOGLE_MAPS_API_KEY</code> en el archivo <code>.env</code> y <strong>reiniciar la terminal</strong>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <APIProvider apiKey={API_KEY}>
            <MapWrapper {...props} />
        </APIProvider>
    );
}
