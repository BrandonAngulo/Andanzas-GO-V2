import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Trash2, Edit, CheckCircle, Map, Compass, PenTool, ChevronUp, ChevronDown, Lock, Trophy } from 'lucide-react';
import { Ruta, Site } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';
import { BADGES } from '../../data/badges';
import { LazyImage } from '../ui/lazy-image';

interface RutasPanelProps {
    rutas: Ruta[];
    suggestedRoutes: Ruta[];
    newPoints: Site[];
    allSites: Site[];
    query?: string;
    onAddPoint: (point: Site) => void;
    onRemovePoint: (id: string) => void;
    onSave: (name: string, description: string) => void;
    onOpenDetail: (route: Ruta) => void;
    onTogglePrivacy: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateDetails: (id: string, newName: string, newDescription: string, newPoints?: string[]) => void;
    onStartRoute: (route: Ruta) => void;
    onCompleteRoute: (id: string) => void;
    routesInProgress: string[];
    routesCompleted: string[];
    onReorderPoints?: (points: Site[]) => void;
}

const RutasPanel: React.FC<RutasPanelProps> = ({ rutas, suggestedRoutes, newPoints, allSites, query, onAddPoint, onRemovePoint, onSave, onOpenDetail, onTogglePrivacy, onDelete, onUpdateDetails, onStartRoute, onCompleteRoute, routesInProgress, routesCompleted, onReorderPoints }) => {
    const { t, language } = useI18n();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [editSearchQuery, setEditSearchQuery] = useState('');
    const [routeToDelete, setRouteToDelete] = useState<Ruta | null>(null);
    const [editingRoute, setEditingRoute] = useState<Ruta | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedPoints, setEditedPoints] = useState<Site[]>([]);

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

    useEffect(() => {
        if (editingRoute) {
            setEditedName(getTranslated(editingRoute, 'nombre', language) as string);
            setEditedDescription(getTranslated(editingRoute, 'descripcion', language) as string);
            const points = editingRoute.puntos.map(pid => allSites.find(s => s.id === pid)).filter(Boolean) as Site[];
            setEditedPoints(points);
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
            onUpdateDetails(editingRoute.id, editedName, editedDescription, editedPoints.map(p => p.id));
            setEditingRoute(null);
        }
    };

    // --- PASSPORT CARD ---
    const PassportCard = ({ route }: { route: Ruta }) => {
        const isCompleted = routesCompleted.includes(route.id);
        const isInProgress = routesInProgress.includes(route.id);
        const badge = BADGES.find(b => b.id === route.reward_badge_id);
        const firstPoint = allSites.find(s => s.id === route.puntos[0]);
        const BadgeIcon = badge?.icono || Trophy;

        return (
            <div
                className={cn(
                    "group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 border",
                    isCompleted
                        ? "border-yellow-500/50 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-500/10 to-transparent"
                        : "border-border hover:border-primary/50 hover:shadow-lg bg-card"
                )}
                onClick={() => onStartRoute(route)}
            >
                {/* Background Image Area */}
                <div className="h-32 w-full relative overflow-hidden bg-muted">
                    {firstPoint?.logoUrl ? (
                        <div className="w-full h-full relative">
                            <LazyImage
                                src={firstPoint.logoUrl}
                                className={cn("w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", isCompleted ? "grayscale-0" : "grayscale-[0.5] group-hover:grayscale-0")}
                                alt="Route cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                            <Compass className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                    )}

                    {/* Badge Overlay */}
                    <div className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm z-10">
                        <BadgeIcon className={cn("w-5 h-5", isCompleted ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")} />
                    </div>

                    {/* Status Label */}
                    {isCompleted && (
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1 uppercase tracking-wide">
                            <CheckCircle className="w-3 h-3" /> Conquistada
                        </div>
                    )}
                    {isInProgress && !isCompleted && (
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1 uppercase tracking-wide">
                            <Compass className="w-3 h-3 animate-spin duration-[3s]" /> En Progreso
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-4 relative">
                    <h3 className="font-bold text-base leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {getTranslated(route, 'nombre', language)}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {getTranslated(route, 'descripcion', language)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3 border-dashed">
                        <span className="flex items-center gap-1"><Map className="w-3 h-3" /> {route.puntos.length} puntos</span>
                        <span className="font-mono text-primary/80">{route.duracionMin} min</span>
                    </div>
                </div>

                {/* Hover Effect Reveal */}
                {!isCompleted && !isInProgress && (
                    <div className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white font-bold text-lg tracking-wider uppercase flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Compass className="w-6 h-6" /> Iniciar
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // Keep Custom Route Card simpler
    const RouteCard = ({ route }: { route: Ruta }) => (
        <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all cursor-pointer" onClick={() => onOpenDetail(route)}>
            <CardContent className="p-4 flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{getTranslated(route, 'nombre', language)}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{getTranslated(route, 'descripcion', language)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); onStartRoute(route); }}>
                            Iniciar
                        </Button>
                        <div className="ml-auto flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditingRoute(route); }}>
                                <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); setRouteToDelete(route); }}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <ScrollArea className="h-[72vh]">
            <div className="p-4 max-w-5xl mx-auto">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Compass className="w-6 h-6 text-primary" />
                            {language === 'es' ? 'Pasaporte de Rutas' : 'Route Passport'}
                        </h2>
                        <p className="text-muted-foreground text-sm">Colecciona las {rutasSugeridas.length} insignias doradas.</p>
                    </div>

                    <div className="flex bg-muted p-1 rounded-lg shrink-0">
                        <Button variant={query ? "secondary" : "ghost"} size="sm" className="h-8 rounded-md text-xs font-medium" onClick={() => document.getElementById('tab-sugeridas')?.click()}>
                            Descubrir
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 rounded-md text-xs font-medium" onClick={() => document.getElementById('tab-mis-rutas')?.click()}>
                            Mis Rutas
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="sugeridas" className="w-full">
                    {/* Hidden Tabs List for programmatic control if needed, using custom header buttons above */}
                    <TabsList className="hidden">
                        <TabsTrigger value="sugeridas" id="tab-sugeridas">Sugeridas</TabsTrigger>
                        <TabsTrigger value="mis-rutas" id="tab-mis-rutas">Mis Rutas</TabsTrigger>
                        <TabsTrigger value="crear" id="tab-crear">Crear</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sugeridas" className="mt-0 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rutasSugeridas.map((r) => (
                                <PassportCard key={r.id} route={r} />
                            ))}
                        </div>
                        {rutasSugeridas.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No se encontraron rutas de conquista.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="mis-rutas" className="mt-0 animate-in fade-in duration-300">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="font-bold">Rutas Personalizadas</h3>
                            <Button size="sm" onClick={() => document.getElementById('tab-crear')?.click()}>
                                <Plus className="w-4 h-4 mr-2" /> Crear Nueva
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {misRutas.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                    <PenTool className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                                    <p className="text-muted-foreground">No has creado rutas propias.</p>
                                </div>
                            ) : (
                                misRutas.map(r => <RouteCard key={r.id} route={r} />)
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
                                    <Button
                                        className="w-full font-bold shadow-lg shadow-primary/20"
                                        size="lg"
                                        onClick={() => { onSave(name, description); setName(""); setDescription(""); setSearchQuery(''); }}
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
        </ScrollArea>
    );
};

export default RutasPanel;