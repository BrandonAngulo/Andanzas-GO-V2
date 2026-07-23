import React, { useState, useMemo, useEffect } from 'react';
import { Bookmark, Plus, Search, Trash2, Compass, PenTool, ChevronUp, ChevronDown, Clock3, Gamepad2, Map } from 'lucide-react';
import { Ruta, Site } from '../../types';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent } from '../ui/tabs';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { settingsService } from '../../services/settings.service';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import { RequestCustomRouteModal } from './RequestCustomRouteModal';
import { toast } from 'sonner';
import { RouteDiscoveryCard } from '../routes/RouteDiscoveryCard';
import { RoutesEmptyState } from '../routes/RoutesEmptyState';
import { RoutesHero } from '../routes/RoutesHero';
import { UserRouteCard } from '../routes/UserRouteCard';

interface RutasPanelProps {
    rutas: Ruta[];
    suggestedRoutes: Ruta[];
    newPoints: Site[];
    allSites: Site[];
    query?: string;
    onAddPoint: (point: Site) => void;
    onRemovePoint: (id: string) => void;
    onSave: (name: string, description: string, emoji?: string) => void;
    onOpenDetail: (route: Ruta) => void;
    onTogglePrivacy: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateDetails: (id: string, newName: string, newDescription: string, newPoints?: string[], emoji?: string) => void;
    onStartRoute: (route: Ruta) => void;
    onCompleteRoute: (id: string) => void;
    routesInProgress: string[];
    routesCompleted: string[];
    onReorderPoints?: (points: Site[]) => void;
}

const ROUTE_EMOJIS = ["🗺️", "🧭", "👣", "🚶", "🥾", "🚲", "🛴", "🚗", "🚌", "🚆", "⛵", "🏞️", "🌿", "🌳", "🌻", "🌊", "⛰️", "🏛️", "🏘️", "🌉", "⛪", "🎨", "🧱", "🎭", "🎵", "💃", "📚", "✍️", "🍲", "🍔", "☕", "🥭", "📸", "🛍️", "⚽", "🌆", "🌃", "🎡", "✨", "💡", "❤️", "⭐"];

const RutasPanel: React.FC<RutasPanelProps> = ({ rutas, suggestedRoutes, newPoints, allSites, query, onAddPoint, onRemovePoint, onSave, onOpenDetail, onTogglePrivacy, onDelete, onUpdateDetails, onStartRoute, onCompleteRoute, routesInProgress, routesCompleted, onReorderPoints }) => {
    const { t, language } = useI18n();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedEmoji, setSelectedEmoji] = useState("🗺️");
    const [searchQuery, setSearchQuery] = useState('');
    const [editSearchQuery, setEditSearchQuery] = useState('');
    const [routeToDelete, setRouteToDelete] = useState<Ruta | null>(null);
    const [editingRoute, setEditingRoute] = useState<Ruta | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedPoints, setEditedPoints] = useState<Site[]>([]);
    const [activeTab, setActiveTab] = useState("sugeridas");
    const [routeFilter, setRouteFilter] = useState<'all' | 'short' | 'challenges'>('all');
    
    const [enableCustomRouteRequest, setEnableCustomRouteRequest] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const { user } = useAuth();
    const [savedRouteIds, setSavedRouteIds] = useState<string[]>([]);
    const [savingRoute, setSavingRoute] = useState(false);

    useEffect(() => {
        const fetchSettingsAndProfile = async () => {
            const val = await settingsService.getSetting('enable_custom_route_requests');
            if (val === 'true') {
                setEnableCustomRouteRequest(true);
            }
            if (user) {
                const profile = await userService.getProfile(user.id);
                if (profile?.saved_routes) {
                    setSavedRouteIds(profile.saved_routes);
                }
            }
        };
        fetchSettingsAndProfile();
    }, [user]);

    const handleToggleSaveRoute = async (routeId: string) => {
        if (!user) {
            toast.error("Debes iniciar sesión para guardar rutas.");
            return;
        }
        setSavingRoute(true);
        try {
            const isSaved = savedRouteIds.includes(routeId);
            if (isSaved) {
                const removed = await userService.unsaveRoute(user.id, routeId);
                if (!removed) throw new Error('No se pudo eliminar la ruta guardada');
                setSavedRouteIds(prev => prev.filter(id => id !== routeId));
                toast.success("Ruta eliminada de 'Por Andar'");
            } else {
                const saved = await userService.saveRoute(user.id, routeId);
                if (!saved) throw new Error('No se pudo guardar la ruta');
                setSavedRouteIds(prev => [...prev, routeId]);
                toast.success("✅ Ruta guardada en 'Por Andar'");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar la ruta. Intenta de nuevo.");
        } finally {
            setSavingRoute(false);
        }
    };

    const moveUp = (index: number) => {
        if (!onReorderPoints || index === 0) return;
        const items = [...newPoints];
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
        onReorderPoints(items);
    };

    const moveDown = (index: number) => {
        if (!onReorderPoints || index === newPoints.length - 1) return;
        const items = [...newPoints];
        [items[index + 1], items[index]] = [items[index], items[index + 1]];
        onReorderPoints(items);
    };

    const misRutas = useMemo(() => {
        let r = rutas.filter(r => !suggestedRoutes.some(tr => tr.id === r.id));
        if (query) {
            const lowerQuery = query.toLowerCase();
            r = r.filter(route =>
                (getTranslated(route, 'nombre', language) as string).toLowerCase().includes(lowerQuery) ||
                (getTranslated(route, 'descripcion', language) as string).toLowerCase().includes(lowerQuery)
            );
        }
        return r;
    }, [rutas, suggestedRoutes, query, language]);

    const rutasSugeridas = useMemo(() => {
        let r = suggestedRoutes;
        if (query) {
            const lowerQuery = query.toLowerCase();
            r = r.filter(route =>
                (getTranslated(route, 'nombre', language) as string).toLowerCase().includes(lowerQuery) ||
                (getTranslated(route, 'descripcion', language) as string).toLowerCase().includes(lowerQuery)
            );
        }
        return r;
    }, [suggestedRoutes, query, language]);

    const discoveryRoutes = useMemo(() => {
        if (routeFilter === 'short') {
            return rutasSugeridas.filter(route => route.duracionMin <= 90);
        }
        if (routeFilter === 'challenges') {
            return rutasSugeridas.filter(route => (route.gamificacion?.length || 0) > 0);
        }
        return rutasSugeridas;
    }, [routeFilter, rutasSugeridas]);

    const savedSuggestedRoutes = useMemo(
        () => rutasSugeridas.filter(route => savedRouteIds.includes(route.id)),
        [rutasSugeridas, savedRouteIds],
    );

    const discoveryStopCount = useMemo(
        () => new Set(suggestedRoutes.flatMap(route => route.puntos || [])).size,
        [suggestedRoutes],
    );

    useEffect(() => {
        if (editingRoute) {
            setEditedName(getTranslated(editingRoute, 'nombre', language) as string);
            setEditedDescription(getTranslated(editingRoute, 'descripcion', language) as string);
            const points = editingRoute.puntos.map(pid => allSites.find(s => s.id === pid)).filter(Boolean) as Site[];
            setEditedPoints(points);
            setSelectedEmoji(editingRoute.emoji || "🗺️");
        }
    }, [editingRoute, language, allSites]);

    const filteredSites = useMemo(() => {
        if (!searchQuery) return allSites;
        return allSites.filter(site =>
            (getTranslated(site, 'nombre', language) as string).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, language, allSites]);

    const filteredEditSites = useMemo(() => {
        if (!editSearchQuery) return allSites;
        return allSites.filter(site =>
            (getTranslated(site, 'nombre', language) as string).toLowerCase().includes(editSearchQuery.toLowerCase())
        );
    }, [editSearchQuery, language, allSites]);

    const handleDeleteConfirm = () => {
        if (routeToDelete) {
            onDelete(routeToDelete.id);
            setRouteToDelete(null);
        }
    };

    const handleEditSave = () => {
        if (editingRoute) {
            onUpdateDetails(editingRoute.id, editedName, editedDescription, editedPoints.map(p => p.id), selectedEmoji);
            setEditingRoute(null);
        }
    };

    const openRoutePresentation = (route: Ruta) => {
        if (route.content_only || !route.puntos || route.puntos.length === 0) {
            onOpenDetail(route);
            return;
        }
        onStartRoute(route);
    };

    return (
        <div className="h-full overflow-y-auto overscroll-contain">
            <div className="mx-auto max-w-6xl px-3 pb-28 pt-3 sm:px-5 sm:pb-8">
                <RoutesHero
                    language={language}
                    routeCount={suggestedRoutes.length}
                    stopCount={discoveryStopCount}
                />

                <div id="route-discovery" className="sticky top-0 z-30 mb-5 -mx-1 scroll-mt-2 rounded-2xl border border-border/60 bg-background/92 p-1.5 shadow-sm backdrop-blur-xl">
                    <div className="flex gap-1 overflow-x-auto scrollbar-none">
                        <Button 
                            variant="ghost"
                            size="sm" 
                            className={cn(
                                "h-10 shrink-0 rounded-xl px-4 text-xs font-bold transition-all",
                                activeTab === "sugeridas" ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-600 hover:text-white" : "text-muted-foreground"
                            )}
                            onClick={() => setActiveTab("sugeridas")}
                        >
                            <Compass className="h-4 w-4" />
                            Descubrir
                            <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] dark:bg-white/10">{rutasSugeridas.length}</span>
                        </Button>
                        <Button 
                            variant="ghost"
                            size="sm" 
                            className={cn(
                                "h-10 shrink-0 rounded-xl px-4 text-xs font-bold transition-all",
                                activeTab === "por-andar" ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-600 hover:text-white" : "text-muted-foreground"
                            )}
                            onClick={() => setActiveTab("por-andar")}
                        >
                            <Bookmark className="h-4 w-4" />
                            Por Andar
                            <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] dark:bg-white/10">{savedSuggestedRoutes.length}</span>
                        </Button>
                        <Button 
                            variant="ghost"
                            size="sm" 
                            className={cn(
                                "h-10 shrink-0 rounded-xl px-4 text-xs font-bold transition-all",
                                activeTab === "mis-rutas" ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-600 hover:text-white" : "text-muted-foreground"
                            )}
                            onClick={() => setActiveTab("mis-rutas")}
                        >
                            <PenTool className="h-4 w-4" />
                            Mis Rutas
                            <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] dark:bg-white/10">{misRutas.length}</span>
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="sugeridas" className="w-full">
                    <TabsContent value="sugeridas" className="mt-0 animate-in fade-in duration-300">
                        <div className="mb-4">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                                {language === 'es' ? 'Encuentra tu próxima andanza' : 'Find your next journey'}
                            </p>
                            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {([
                                    { id: 'all', label: language === 'es' ? 'Todas' : 'All', icon: Compass },
                                    { id: 'short', label: language === 'es' ? 'Hasta 90 min' : 'Up to 90 min', icon: Clock3 },
                                    { id: 'challenges', label: language === 'es' ? 'Con retos' : 'With challenges', icon: Gamepad2 },
                                ] as const).map(filter => {
                                    const FilterIcon = filter.icon;
                                    return (
                                        <button
                                            key={filter.id}
                                            type="button"
                                            onClick={() => setRouteFilter(filter.id)}
                                            className={cn(
                                                'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-colors',
                                                routeFilter === filter.id
                                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                                    : 'border-border bg-card text-muted-foreground hover:border-emerald-500/50 hover:text-foreground',
                                            )}
                                        >
                                            <FilterIcon className="h-3.5 w-3.5" />
                                            {filter.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {discoveryRoutes.map((route, index) => (
                                <div key={route.id} className={cn(index === 0 && discoveryRoutes.length > 1 ? 'md:col-span-2 lg:col-span-2' : '')}>
                                    <RouteDiscoveryCard
                                        route={route}
                                        sites={allSites}
                                        language={language}
                                        saved={savedRouteIds.includes(route.id)}
                                        completed={routesCompleted.includes(route.id)}
                                        inProgress={routesInProgress.includes(route.id)}
                                        featured={index === 0 && discoveryRoutes.length > 1}
                                        saving={savingRoute}
                                        onOpen={() => openRoutePresentation(route)}
                                        onToggleSave={() => void handleToggleSaveRoute(route.id)}
                                    />
                                </div>
                            ))}
                        </div>
                        {discoveryRoutes.length === 0 && (
                            <RoutesEmptyState
                                language={language}
                                mode={routeFilter === 'all' ? 'catalog' : 'filtered'}
                                onReset={() => setRouteFilter('all')}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="por-andar" className="mt-0 animate-in fade-in duration-300">
                        <div className="mb-4">
                            <h3 className="font-bold flex items-center gap-2"><Bookmark className="w-5 h-5 text-primary" /> Rutas Guardadas</h3>
                            <p className="text-sm text-muted-foreground">Tus rutas pendientes para explorar Cali a tu propio ritmo. Elegí una, revisá sus paradas y convertí ese guardado en tu próxima salida.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {savedSuggestedRoutes.map((route) => (
                                <RouteDiscoveryCard
                                    key={route.id}
                                    route={route}
                                    sites={allSites}
                                    language={language}
                                    saved
                                    completed={routesCompleted.includes(route.id)}
                                    inProgress={routesInProgress.includes(route.id)}
                                    saving={savingRoute}
                                    onOpen={() => openRoutePresentation(route)}
                                    onToggleSave={() => void handleToggleSaveRoute(route.id)}
                                />
                            ))}
                        </div>
                        {savedSuggestedRoutes.length === 0 && (
                            <div>
                                <RoutesEmptyState language={language} mode="saved" />
                                <Button variant="outline" className="mx-auto mt-4 flex rounded-full" onClick={() => setActiveTab("sugeridas")}>Explorar Rutas</Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="mis-rutas" className="mt-0 animate-in fade-in duration-300">
                        {enableCustomRouteRequest && (
                            <div className="mb-6 relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
                                <div className="relative max-w-xl">
                                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-1">Experiencia acompañada y a la medida</p>
                                    <h3 className="font-black text-2xl">¿Necesitas una ruta exclusiva?</h3>
                                    <p className="text-sm text-emerald-50 mt-2">Diseñamos el recorrido según tu grupo, edades, tiempo, dificultad, movilidad e intereses.</p>
                                    <div className="flex flex-wrap gap-2 mt-3 text-xs"><span className="rounded-full bg-white/15 px-3 py-1">Solicitud mínima: 7 días antes</span><span className="rounded-full bg-white/15 px-3 py-1">Sujeta a disponibilidad y cotización</span></div>
                                </div>
                                <Button className="relative shrink-0 rounded-full !bg-white !text-emerald-900 hover:!bg-emerald-50 shadow-lg" onClick={() => setShowRequestModal(true)}>
                                    <Compass className="w-4 h-4 mr-2" /> Solicitar ruta guiada
                                </Button>
                            </div>
                        )}

                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="font-bold">Mis Creaciones</h3>
                            <Button size="sm" variant="outline" className="border-indigo-500 text-indigo-700 hover:bg-indigo-500/10" onClick={() => setActiveTab("crear")}>
                                <Plus className="w-4 h-4 mr-2" /> Crear mi propia ruta
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {misRutas.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                    <PenTool className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                                    <p className="text-muted-foreground">No has creado rutas propias.</p>
                                </div>
                            ) : (
                                misRutas.map(route => (
                                    <UserRouteCard
                                        key={route.id}
                                        route={route}
                                        language={language}
                                        onOpen={() => onOpenDetail(route)}
                                        onStart={() => onStartRoute(route)}
                                        onEdit={() => setEditingRoute(route)}
                                        onDelete={() => setRouteToDelete(route)}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="crear" className="mt-0">
                        {/* Reuse existing logic for Create Form */}
                        <Card className="border-none shadow-sm bg-gradient-to-b from-background to-muted/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PenTool className="h-5 w-5 text-primary" />
                                    {t('routes.newCustomRoute')}
                                </CardTitle>
                                <CardDescription>{t('routes.newRouteDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Search Section */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Search className="h-4 w-4" /> Buscar sitios para añadir
                                    </label>
                                    <div className="relative">
                                        <Input
                                            placeholder={t('routes.searchPlaceholder')}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-4 rounded-xl border-muted-foreground/20 focus:border-primary/50"
                                        />
                                    </div>
                                    <ScrollArea className="h-40 border rounded-xl bg-background/50">
                                        <div className="p-2 space-y-1">
                                            {filteredSites.length > 0 ? (
                                                filteredSites.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-primary/5 hover:text-primary text-sm transition-all group"
                                                        onClick={() => onAddPoint(s)}
                                                    >
                                                        <span className="font-medium">{getTranslated(s, 'nombre', language)}</span>
                                                        <Plus className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="h-full flex items-center justify-center p-4 text-sm text-muted-foreground">
                                                    {t('routes.noSitesFound')}
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Added Points Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            <Map className="h-4 w-4" />
                                            {t('routes.addedPoints', { count: newPoints.length })}
                                        </h4>
                                        {newPoints.length > 0 && <span className="text-xs text-muted-foreground font-mono">Total est: {newPoints.length * 20} min</span>}
                                    </div>

                                    {newPoints.length === 0 ? (
                                        <div className="border border-dashed border-muted-foreground/20 rounded-xl p-8 text-center text-xs text-muted-foreground bg-muted/5">
                                            {t('routes.noPointsAdded')}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {newPoints.map((p, index) => (
                                                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50 shadow-sm animate-in slide-in-from-left-2 fade-in duration-300">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-sm font-medium truncate">{getTranslated(p, 'nombre', language)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        {onReorderPoints && (
                                                            <div className="flex flex-col gap-0.5">
                                                                <Button size="icon" variant="ghost" className="h-5 w-5 hover:bg-muted" onClick={() => moveUp(index)} disabled={index === 0}>
                                                                    <ChevronUp className="h-3 w-3" />
                                                                </Button>
                                                                <Button size="icon" variant="ghost" className="h-5 w-5 hover:bg-muted" onClick={() => moveDown(index)} disabled={index === newPoints.length - 1}>
                                                                    <ChevronDown className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => onRemovePoint(p.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Form Details */}
                                <div className="grid gap-4 pt-4 border-t">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">{t('routes.routeName')}</label>
                                        <Input
                                            placeholder={t('routes.routeNamePlaceholder')}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="rounded-lg"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">{t('routes.routeDescription')}</label>
                                        <Textarea
                                            placeholder={t('routes.routeDescriptionPlaceholder')}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            maxLength={600}
                                            className="rounded-lg resize-none"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <span>Personalidad visual de la ruta</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-xl border">
                                            {ROUTE_EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => setSelectedEmoji(emoji)}
                                                    className={cn(
                                                        "w-8 h-8 flex items-center justify-center text-lg rounded-lg transition-transform hover:scale-110",
                                                        selectedEmoji === emoji ? "bg-primary text-primary-foreground shadow-md scale-110" : "hover:bg-muted"
                                                    )}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full font-bold shadow-lg shadow-primary/20"
                                        size="lg"
                                        onClick={() => { onSave(name, description, selectedEmoji); setName(""); setDescription(""); setSearchQuery(''); setSelectedEmoji("🗺️"); }}
                                        disabled={!name || newPoints.length === 0}
                                    >
                                        {t('routes.saveRoute')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal Components Reuse */}
            <Dialog open={!!routeToDelete} onOpenChange={() => setRouteToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('routes.deleteConfirmTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('routes.deleteConfirmDescription', { routeName: getTranslated(routeToDelete, 'nombre', language) })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRouteToDelete(null)}>{t('cancel')}</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>{t('delete')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingRoute} onOpenChange={() => setEditingRoute(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('routes.editRouteTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('routes.editRouteDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <ScrollArea className="h-[60vh]">
                            <div className="grid gap-4 py-4 px-1">
                                <div className="grid gap-2">
                                    <label htmlFor="routeName" className="text-sm font-medium">{t('routes.routeName')}</label>
                                    <Input id="routeName" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="routeDesc" className="text-sm font-medium">{t('routes.routeDescription')}</label>
                                    <Textarea
                                        id="routeDesc"
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        maxLength={600}
                                    />
                                </div>
                                <div className="grid gap-2 mt-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <span>Personalidad visual de la ruta</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-xl border">
                                        {ROUTE_EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setSelectedEmoji(emoji)}
                                                className={cn(
                                                    "w-8 h-8 flex items-center justify-center text-lg rounded-lg transition-transform hover:scale-110",
                                                    selectedEmoji === emoji ? "bg-primary text-primary-foreground shadow-md scale-110" : "hover:bg-muted"
                                                )}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t my-2" />
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <Map className="h-4 w-4" />
                                        Gestionar Puntos de la Ruta
                                    </h4>
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground flex items-center gap-2">
                                            <Search className="h-3 w-3" /> Añadir nuevos puntos
                                        </label>
                                        <Input
                                            placeholder="Buscar sitios..."
                                            value={editSearchQuery}
                                            onChange={(e) => setEditSearchQuery(e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                        {editSearchQuery && (
                                            <ScrollArea className="h-32 border rounded-md bg-background/50">
                                                <div className="p-2 space-y-1">
                                                    {filteredEditSites.map((s) => (
                                                        <button
                                                            key={s.id}
                                                            className="w-full flex items-center justify-between p-2 rounded hover:bg-primary/10 text-xs transition-colors text-left"
                                                            onClick={() => {
                                                                if (!editedPoints.some(ep => ep.id === s.id)) {
                                                                    setEditedPoints(prev => [...prev, s]);
                                                                    setEditSearchQuery('');
                                                                } else {
                                                                    setEditedPoints(prev => [...prev, s]);
                                                                    setEditSearchQuery('');
                                                                }
                                                            }}
                                                        >
                                                            <span className="truncate pr-2">{getTranslated(s, 'nombre', language)}</span>
                                                            <Plus className="h-3 w-3 shrink-0" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        )}
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <label className="text-xs text-muted-foreground">Puntos actuales ({editedPoints.length})</label>
                                        <div className="space-y-2">
                                            {editedPoints.map((p, index) => (
                                                <div key={`${p.id}-${index}`} className="flex items-center justify-between p-2 rounded-md bg-muted/40 border text-sm">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span className="truncate">{getTranslated(p, 'nombre', language)}</span>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => {
                                                        setEditedPoints(prev => prev.filter((_, i) => i !== index));
                                                    }}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        {editedPoints.length === 0 && (
                                            <p className="text-xs text-center text-muted-foreground italic py-2">Sin puntos seleccionados</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingRoute(null)}>{t('cancel')}</Button>
                        <Button onClick={handleEditSave}>{t('routes.saveChanges')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <RequestCustomRouteModal 
                open={showRequestModal} 
                onOpenChange={setShowRequestModal} 
            />
        </div>
    );
};

export default RutasPanel;
