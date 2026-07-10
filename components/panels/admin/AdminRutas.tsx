import React, { useState, useEffect } from 'react';
import { Ruta } from '../../../types';
import { routesService } from '../../../services/routes.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Eye, EyeOff, Search, Edit, Plus, Users, Megaphone } from 'lucide-react';
import { RutaForm } from './RutaForm';
import { AdminRutaInscripciones } from './AdminRutaInscripciones';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { BroadcastModal } from './BroadcastModal';

export const AdminRutas = () => {
    const [routes, setRoutes] = useState<Ruta[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
    const [viewingRegistrationsRoute, setViewingRegistrationsRoute] = useState<Ruta | null>(null);
    const [routeToDelete, setRouteToDelete] = useState<Ruta | null>(null);
    const [broadcastOpen, setBroadcastOpen] = useState(false);

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        setLoading(true);
        const data = await routesService.getAllAdmin();
        setRoutes(data);
        setLoading(false);
    };

    const handleTogglePublish = async (route: Ruta) => {
        const newStatus = !route.publico;
        await routesService.updateRoute({ id: route.id, publico: newStatus });
        loadRoutes();
    };

    const handleDeleteRoute = (route: Ruta) => {
        setRouteToDelete(route);
    };

    const confirmDeleteRoute = async () => {
        if (routeToDelete) {
            const success = await routesService.deleteRoute(routeToDelete.id);
            if (success) {
                loadRoutes();
            } else {
                alert('Hubo un error al eliminar la ruta.');
            }
            setRouteToDelete(null);
        }
    };

    const filteredRoutes = routes.filter(r => r.nombre.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleOpenCreate = () => {
        setEditingRouteId(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (id: string) => {
        setEditingRouteId(id);
        setIsFormOpen(true);
    };

    const handleFormSaved = () => {
        setIsFormOpen(false);
        loadRoutes();
    };

    if (isFormOpen) {
        return <RutaForm routeId={editingRouteId} onClose={() => setIsFormOpen(false)} onSaved={handleFormSaved} />;
    }

    if (viewingRegistrationsRoute) {
        return <AdminRutaInscripciones rutaId={viewingRegistrationsRoute.id} rutaNombre={viewingRegistrationsRoute.nombre} onClose={() => setViewingRegistrationsRoute(null)} />;
    }

    return (
        <div className="space-y-6">
            <ConfirmDialog 
                open={!!routeToDelete} 
                onOpenChange={(open) => !open && setRouteToDelete(null)}
                title={`¿Estás seguro de eliminar la ruta "${routeToDelete?.nombre}"?`}
                description="Esta acción no se puede deshacer."
                onConfirm={confirmDeleteRoute}
                destructive={true}
                confirmText="Eliminar"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar ruta..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setBroadcastOpen(true)} className="shrink-0 text-blue-600 hover:text-blue-700">
                        <Megaphone className="w-4 h-4 mr-2" />
                        Notificar
                    </Button>
                    <Button onClick={handleOpenCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Ruta
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando rutas...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredRoutes.map(route => (
                        <Card key={route.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${route.publico ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {route.publico ? 'Pública' : 'Archivada / Privada'}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{route.puntos.length} puntos</span>
                                        </div>
                                        <h4 className="font-semibold text-base">{route.nombre}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{route.descripcion}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleTogglePublish(route)}
                                            className={route.publico ? 'text-green-600' : 'text-muted-foreground'}
                                            title={route.publico ? "Archivar / Hacer privada" : "Publicar globalmente"}
                                        >
                                            {route.publico ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </Button>
                                        {route.requires_registration && (
                                            <Button variant="outline" size="sm" onClick={() => setViewingRegistrationsRoute(route)} title="Ver inscripciones">
                                                <Users className="w-4 h-4 text-primary" />
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(route.id)} title="Editar ruta">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleDeleteRoute(route)} 
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            title="Eliminar ruta definitivamente"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredRoutes.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            No se encontraron rutas.
                        </div>
                    )}
                </div>
            )}
            
            <BroadcastModal open={broadcastOpen} onOpenChange={setBroadcastOpen} />
        </div>
    );
};
