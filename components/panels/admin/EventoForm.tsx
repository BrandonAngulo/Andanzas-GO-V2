import React, { useState, useEffect } from 'react';
import { Evento } from '../../../types';
import { eventsService } from '../../../services/events.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Save, ArrowLeft } from 'lucide-react';

interface EventoFormProps {
    eventId?: string | null;
    onClose: () => void;
    onSaved: () => void;
}

export const EventoForm: React.FC<EventoFormProps> = ({ eventId, onClose, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Evento>>({
        titulo: '',
        fecha: new Date().toISOString().slice(0, 16),
        lugar: '',
        resumen: '',
        descripcion: '',
        img: '',
        status: 'draft',
        quienes_lideran: '',
        que_permiten: ''
    });

    useEffect(() => {
        if (eventId) {
            loadEvent(eventId);
        }
    }, [eventId]);

    const loadEvent = async (id: string) => {
        setLoading(true);
        const data = await eventsService.getById(id);
        if (data) setFormData(data);
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (eventId) {
                await eventsService.update(eventId, formData);
            } else {
                await eventsService.create({
                    ...formData,
                    id: crypto.randomUUID(),
                } as Evento);
            }
            onSaved();
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Error al guardar el evento.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && eventId) {
        return <div className="p-10 text-center text-muted-foreground">Cargando evento...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{eventId ? 'Editar Evento' : 'Nuevo Evento'}</h2>
                    <p className="text-muted-foreground text-sm">Gestiona la información de este evento cultural.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Título *</label>
                    <Input required name="titulo" value={formData.titulo || ''} onChange={handleChange} placeholder="Ej: Salsa al Parque" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Fecha y Hora *</label>
                    <Input required type="datetime-local" name="fecha" value={formData.fecha || ''} onChange={handleChange} />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Lugar *</label>
                    <Input required name="lugar" value={formData.lugar || ''} onChange={handleChange} placeholder="Ej: Teatro Municipal" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Resumen *</label>
                    <Input required name="resumen" value={formData.resumen || ''} onChange={handleChange} placeholder="Descripción muy breve..." />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Descripción Completa *</label>
                    <Textarea required name="descripcion" value={formData.descripcion || ''} onChange={handleChange} rows={4} placeholder="Toda la información del evento..." />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">URL de la Imagen *</label>
                    <Input required name="img" value={formData.img || ''} onChange={handleChange} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">¿Quiénes lideran?</label>
                    <Input name="quienes_lideran" value={formData.quienes_lideran || ''} onChange={handleChange} placeholder="Organizadores, artistas..." />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">¿Qué permiten?</label>
                    <Input name="que_permiten" value={formData.que_permiten || ''} onChange={handleChange} placeholder="Impacto cultural..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Estado</label>
                    <select 
                        name="status" 
                        value={formData.status || 'draft'} 
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="draft">Borrador (Oculto)</option>
                        <option value="published">Publicado</option>
                        <option value="archived">Archivado</option>
                    </select>
                </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Guardando...' : 'Guardar Evento'}
                </Button>
            </div>
        </form>
    );
};
