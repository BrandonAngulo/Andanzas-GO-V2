import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Share2, Search, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Ruta, Site } from '../../types';
import { SITES, RUTAS_TEMATICAS } from '../../constants';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';

interface RutasPanelProps {
    rutas: Ruta[];
    newPoints: Site[];
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

const RutasPanel: React.FC<RutasPanelProps> = ({ rutas, newPoints, query, onAddPoint, onRemovePoint, onSave, onOpenDetail, onTogglePrivacy, onDelete, onUpdateDetails, onStartRoute, onCompleteRoute, routesInProgress, routesCompleted }) => {
    const { t, language } = useI18n();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [activeTab, setActiveTab] = useState<'sugeridas' | 'mis-rutas' | 'crear'>('sugeridas');
    const [searchQuery, setSearchQuery] = useState(''); // Local search for adding points
    const [routeToDelete, setRouteToDelete] = useState<Ruta | null>(null);
    const [editingRoute, setEditingRoute] = useState<Ruta | null>(null);

    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    // Filter routes based on global query
    const misRutas = useMemo(() => {
        let r = rutas.filter(r => !RUTAS_TEMATICAS.some(tr => tr.id === r.id));
        if (query) {
            const lowerQuery = query.toLowerCase();
            r = r.filter(route =>
                (getTranslated(route, 'nombre', language) as string).toLowerCase().includes(lowerQuery) ||
                (getTranslated(route, 'descripcion', language) as string).toLowerCase().includes(lowerQuery)
            );
        }
        return r;
    }, [rutas, query, language]);

    const rutasSugeridas = useMemo(() => {
        let r = RUTAS_TEMATICAS;
        if (query) {
            const lowerQuery = query.toLowerCase();
            r = r.filter(route =>
                (getTranslated(route, 'nombre', language) as string).toLowerCase().includes(lowerQuery) ||
                (getTranslated(route, 'descripcion', language) as string).toLowerCase().includes(lowerQuery)
            );
        }
        return r;
    }, [query, language]);

    useEffect(() => {
        if (editingRoute) {
            setEditedName(getTranslated(editingRoute, 'nombre', language) as string);
            setEditedDescription(getTranslated(editingRoute, 'descripcion', language) as string);
        }
    }, [editingRoute, language]);

    const filteredSites = useMemo(() => {
        if (!searchQuery) return SITES;
        return SITES.filter(site =>
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
            return <Button size="sm" disabled><CheckCircle className="h-4 w-4 mr-1" /> {t('routes.completed')}</Button>;
        }
        if (isInProgress) {
            return <Button size="sm" variant="destructive" onClick={() => onCompleteRoute(route.id)}>{t('fullView.completeRoute')}</Button>;
        }
        return <Button size="sm" onClick={() => onStartRoute(route)}>{t('routes.start')}</Button>;
    };


    return (
        <ScrollArea className="h-[72vh]">
            <div className="p-3">
                <div className="flex items-center gap-2 mb-3 p-1 bg-muted rounded-lg">
                    <Button size="sm" variant={activeTab === 'sugeridas' ? 'default' : 'ghost'} className="flex-1" onClick={() => setActiveTab('sugeridas')}>{t('routes.suggestedRoutes')}</Button>
                    <Button size="sm" variant={activeTab === 'mis-rutas' ? 'default' : 'ghost'} className="flex-1" onClick={() => setActiveTab('mis-rutas')}>{t('routes.myRoutes')}</Button>
                    <Button size="sm" variant={activeTab === 'crear' ? 'default' : 'ghost'} className="flex-1" onClick={() => setActiveTab('crear')}>{t('routes.createOwnRoute')}</Button>
                </div>

                <div>
                    {activeTab === 'sugeridas' && (
                        <div className="grid gap-3">
                            {rutasSugeridas.length === 0 && query && <p className="text-sm text-muted-foreground text-center p-4">No se encontraron rutas sugeridas para "{query}"</p>}
                            {rutasSugeridas.map((r) => (
                                <Card key={r.id}>
                                    <CardContent className="p-3 flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold">{getTranslated(r, 'nombre', language)}</div>
                                            <div className="text-xs text-muted-foreground">{r.puntos.length} {t('routes.points')} · {r.duracionMin} {t('routes.minutes')}</div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button size="sm" variant="outline" onClick={() => onOpenDetail(r)}>{t('seeMore')}</Button>
                                            <ActionButton route={r} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    {activeTab === 'mis-rutas' && (
                        <div className="grid gap-3">
                            {misRutas.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">{query ? `No se encontraron rutas para "${query}"` : t('routes.emptyMyRoutes')}</p>}
                            {misRutas.map((r) => (
                                <Card key={r.id}>
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold">{getTranslated(r, 'nombre', language)}</div>
                                                <div className="text-xs text-muted-foreground">{r.puntos.length} {t('routes.points')} · {r.duracionMin} {t('routes.minutes')}</div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button size="sm" variant="outline" onClick={() => onOpenDetail(r)}>{t('seeMore')}</Button>
                                                <ActionButton route={r} />
                                            </div>
                                        </div>
                                        <div className="border-t my-3"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Switch id={`privacy-${r.id}`} checked={r.publico} onChange={() => onTogglePrivacy(r.id)} />
                                                <label htmlFor={`privacy-${r.id}`} className="text-sm">{r.publico ? t('routes.public') : t('routes.private')}</label>
                                            </div>
                                            <div className="flex items-center">
                                                <Button size="icon" variant="ghost" className="text-muted-foreground h-8 w-8" onClick={() => setEditingRoute(r)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => setRouteToDelete(r)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    {activeTab === 'crear' && (
                        <Card>
                            <CardHeader><CardTitle className="text-base">{t('routes.newCustomRoute')}</CardTitle></CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="text-sm text-muted-foreground">{t('routes.newRouteDescription')}</div>

                                <div>
                                    <div className="relative mb-2">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={t('routes.searchPlaceholder')}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                    <ScrollArea className="h-48 border rounded-md">
                                        <div className="p-1 space-y-1">
                                            {filteredSites.length > 0 ? (
                                                filteredSites.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        className="w-full flex items-center text-left p-2 rounded-md hover:bg-muted text-sm transition-colors"
                                                        onClick={() => onAddPoint(s)}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                                                        <span>{getTranslated(s, 'nombre', language)}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="p-4 text-center text-sm text-muted-foreground">{t('routes.noSitesFound')}</p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>

                                <div className="grid gap-2">
                                    <h4 className="font-medium text-sm">{t('routes.addedPoints', { count: newPoints.length })}</h4>
                                    {newPoints.length === 0 && <p className="text-xs text-muted-foreground">{t('routes.noPointsAdded')}</p>}
                                    {newPoints.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                            <div className="text-sm font-medium">{getTranslated(p, 'nombre', language)}</div>
                                            <Button size="sm" variant="ghost" onClick={() => onRemovePoint(p.id)}>{t('routes.remove')}</Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">{t('routes.routeName')}</label>
                                        <Input placeholder={t('routes.routeNamePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">{t('routes.routeDescription')}</label>
                                        <Textarea
                                            placeholder={t('routes.routeDescriptionPlaceholder')}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            maxLength={600}
                                        />
                                    </div>
                                    <Button onClick={() => { onSave(name, description); setName(""); setDescription(""); setSearchQuery(''); setActiveTab('mis-rutas'); }}>{t('routes.saveRoute')}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
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