import React, { useState, useEffect } from 'react';
import { Evento } from '../../../types';
import { eventsService } from '../../../services/events.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Eye, EyeOff, Search, Trash2 } from 'lucide-react';

export const AdminEventos = () => {
    const [events, setEvents] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este evento?')) {
            await eventsService.delete(id);
            loadEvents();
        }
    };

    const filteredEvents = events.filter(e => e.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || e.lugar.toLowerCase().includes(searchQuery.toLowerCase()));

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
            </div>

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando eventos...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredEvents.map(evento => (
                        <Card key={evento.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
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
        </div>
    );
};
