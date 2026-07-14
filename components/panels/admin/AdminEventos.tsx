import React, { useState, useEffect } from 'react';
import { Evento } from '../../../types';
import { eventsService } from '../../../services/events.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Eye, EyeOff, Search, Trash2, Edit, Plus, Megaphone } from 'lucide-react';
import { EventoForm } from './EventoForm';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { BroadcastModal } from './BroadcastModal';
import { Checkbox } from '../../ui/checkbox';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import { BulkActionsBar } from './BulkActionsBar';

export const AdminEventos = () => {
    const [events, setEvents] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [broadcastOpen, setBroadcastOpen] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        const data = await eventsService.getAllAdmin();
        setEvents(data);
        setLoading(false);
    };

    const handleTogglePublish = async (evento: Evento) => {
        const newStatus = evento.status === 'published' ? 'draft' : 'published';
        await eventsService.update(evento.id, { status: newStatus });
        loadEvents();
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await eventsService.delete(deleteId);
            loadEvents();
            setDeleteId(null);
        }
    };

    const filteredEvents = events.filter(e => e.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || e.lugar.toLowerCase().includes(searchQuery.toLowerCase()));

    const sel = useBulkSelection(filteredEvents);
    const [bulkBusy, setBulkBusy] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const runBulk = async (fn: (id: string) => Promise<any>) => {
        setBulkBusy(true);
        try { await Promise.all(sel.selectedIds.map(fn)); await loadEvents(); sel.clear(); }
        finally { setBulkBusy(false); }
    };
    const bulkPublish = () => runBulk(id => eventsService.update(id, { status: 'published' }));
    const bulkUnpublish = () => runBulk(id => eventsService.update(id, { status: 'draft' }));
    const confirmBulkDelete = async () => { await runBulk(id => eventsService.delete(id)); setBulkDeleteOpen(false); };

    const handleOpenCreate = () => {
        setEditingEventId(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (id: string) => {
        setEditingEventId(id);
        setIsFormOpen(true);
    };

    const handleFormSaved = () => {
        setIsFormOpen(false);
        loadEvents();
    };

    if (isFormOpen) {
        return <EventoForm eventId={editingEventId} onClose={() => setIsFormOpen(false)} onSaved={handleFormSaved} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar evento por título o lugar..." 
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
                        Crear Evento
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Eliminar este evento?"
                description="Esta acción no se puede deshacer."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={(open) => !open && setBulkDeleteOpen(false)}
                title={`¿Eliminar ${sel.count} evento${sel.count === 1 ? '' : 's'}?`}
                description="Esta acción no se puede deshacer."
                onConfirm={confirmBulkDelete}
                destructive={true}
                confirmText="Eliminar"
            />

            {!loading && filteredEvents.length > 0 && (
                <BulkActionsBar count={sel.count} allSelected={sel.allSelected} onToggleAll={sel.toggleAll} onClear={sel.clear} busy={bulkBusy} onActivate={bulkPublish} onDeactivate={bulkUnpublish} activateLabel="Publicar" deactivateLabel="Ocultar" onDelete={() => setBulkDeleteOpen(true)} />
            )}

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando eventos...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredEvents.map(evento => (
                        <Card key={evento.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                    <Checkbox className="mt-1 self-start sm:mt-0 sm:self-center" checked={sel.isSelected(evento.id)} onChange={() => sel.toggle(evento.id)} aria-label={`Seleccionar ${evento.titulo}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${evento.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {evento.status === 'published' ? 'Publicado' : 'Oculto'}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{new Date(evento.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="font-semibold text-base">{evento.titulo}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{evento.resumen || evento.descripcion}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleTogglePublish(evento)}
                                            className={evento.status === 'published' ? 'text-green-600' : 'text-muted-foreground'}
                                            title={evento.status === 'published' ? "Ocultar evento" : "Publicar evento"}
                                        >
                                            {evento.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(evento.id)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(evento.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            No se encontraron eventos.
                        </div>
                    )}
                </div>
            )}
            
            <BroadcastModal open={broadcastOpen} onOpenChange={setBroadcastOpen} />
        </div>
    );
};
