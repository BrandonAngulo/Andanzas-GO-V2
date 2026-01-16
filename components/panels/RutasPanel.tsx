import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Share2, Search, Trash2, Edit, CheckCircle, Map, Compass, PenTool } from 'lucide-react';
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
    onUpdateDetails: (id: string, newName: string, newDescription: string) => void;
    onStartRoute: (route: Ruta) => void;
    onCompleteRoute: (id: string) => void;
    routesInProgress: string[];
    routesCompleted: string[];
}

const RutasPanel: React.FC<RutasPanelProps> = ({ rutas, suggestedRoutes, newPoints, allSites, query, onAddPoint, onRemovePoint, onSave, onOpenDetail, onTogglePrivacy, onDelete, onUpdateDetails, onStartRoute, onCompleteRoute, routesInProgress, routesCompleted }) => {
    const { t, language } = useI18n();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [searchQuery, setSearchQuery] = useState(''); // Local search for adding points
    const [routeToDelete, setRouteToDelete] = useState<Ruta | null>(null);
    const [editingRoute, setEditingRoute] = useState<Ruta | null>(null);

    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    // Filter routes based on global query
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
        }
    }, [editingRoute, language]);

    const filteredSites = useMemo(() => {
        if (!searchQuery) return allSites;
        return allSites.filter(site =>
            (getTranslated(site, 'nombre', language) as string).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, language]);

    const handleDeleteConfirm = () => {
        if (routeToDelete) {
            onDelete(routeToDelete.id);
            setRouteToDelete(null);
        }
    };

    const handleEditSave = () => {
        if (editingRoute) {
            onUpdateDetails(editingRoute.id, editedName, editedDescription);
            setEditingRoute(null);
        }
    };

    const ActionButton: React.FC<{ route: Ruta }> = ({ route }) => {
        const isCompleted = routesCompleted.includes(route.id);
        const isInProgress = routesInProgress.includes(route.id);

        if (isCompleted) {
            return <Button size="sm" disabled className="w-full sm:w-auto bg-green-500/10 text-green-600 dark:text-green-400 border-none font-medium hover:bg-green-500/20"><CheckCircle className="h-4 w-4 mr-1" /> {t('routes.completed')}</Button>;
        }
        if (isInProgress) {
            return <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => onCompleteRoute(route.id)}>{t('fullView.completeRoute')}</Button>;
        }
        return <Button size="sm" className="w-full sm:w-auto bg-primary/90 hover:bg-primary shadow-sm" onClick={() => onStartRoute(route)}>{t('routes.start')}</Button>;
    };

    const RouteCard = ({ route, actions, isCustom = false }: { route: Ruta, actions?: React.ReactNode, isCustom?: boolean }) => (
        <Card className="group overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/30 dark:from-background dark:to-muted/10 hover:shadow-md hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6 pt-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Icon / Avatar placeholder */}
                    <div className="hidden sm:flex shrink-0 w-12 h-12 mt-1 rounded-full bg-primary/10 items-center justify-center text-primary">
                        {isCustom ? <Compass className="w-6 h-6" /> : <Map className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-bold text-lg leading-tight truncate pr-2">{getTranslated(route, 'nombre', language)}</h3>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                                        {route.puntos.length} {t('routes.points')}
                                    </span>
                                    <span>•</span>
                                    <span>{route.duracionMin} {t('routes.minutes')}</span>
                                </div>
                            </div>
                            {isCustom && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setEditingRoute(route)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setRouteToDelete(route)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Description truncated */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {getTranslated(route, 'descripcion', language) || "Sin descripción"}
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-between mt-auto">
                            {isCustom && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto justify-start">
                                    <Switch id={`privacy-${route.id}`} checked={route.publico} onChange={() => onTogglePrivacy(route.id)} className="scale-75 origin-left" />
                                    <label htmlFor={`privacy-${route.id}`} className="cursor-pointer select-none">
                                        {route.publico ? t('routes.public') : t('routes.private')}
                                    </label>
                                </div>
                            )}

                            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                                <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-primary/20 hover:bg-primary/5 hover:text-primary" onClick={() => onOpenDetail(route)}>{t('seeMore')}</Button>
                                <div className="flex-1 sm:flex-none">
                                    <ActionButton route={route} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <ScrollArea className="h-[72vh]">
            <div className="p-4 max-w-4xl mx-auto">
                <Tabs defaultValue="sugeridas" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1">
                        <TabsTrigger value="sugeridas" className="rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium">{t('routes.suggestedRoutes')}</TabsTrigger>
                        <TabsTrigger value="mis-rutas" className="rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium">{t('routes.myRoutes')}</TabsTrigger>
                        <TabsTrigger value="crear" className="rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium">{t('routes.createOwnRoute')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sugeridas" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {rutasSugeridas.length === 0 && query && (
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-muted">
                                <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>No se encontraron rutas sugeridas para "{query}"</p>
                            </div>
                        )}
                        <div className="grid gap-4">
                            {rutasSugeridas.map((r) => (
                                <RouteCard key={r.id} route={r} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="mis-rutas" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {misRutas.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-muted">
                                <Compass className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>{query ? `No se encontraron rutas para "${query}"` : t('routes.emptyMyRoutes')}</p>
                                {!query && (
                                    <Button variant="link" className="mt-2 text-primary" onClick={() => document.getElementById('tab-crear')?.click()}>
                                        ¡Crea tu primera ruta!
                                    </Button>
                                )}
                            </div>
                        )}
                        <div className="grid gap-4">
                            {misRutas.map((r) => (
                                <RouteCard key={r.id} route={r} isCustom={true} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="crear" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => onRemovePoint(p.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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

            {/* Delete Confirmation Dialog */}
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

            {/* Edit Route Dialog */}
            <Dialog open={!!editingRoute} onOpenChange={() => setEditingRoute(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('routes.editRouteTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('routes.editRouteDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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