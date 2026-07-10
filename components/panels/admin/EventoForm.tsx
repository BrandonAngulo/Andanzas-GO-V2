import React, { useState, useEffect } from 'react';
import { Evento } from '../../../types';
import { eventsService } from '../../../services/events.service';
import { sitesService } from '../../../services/sites.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { toast } from 'sonner';

interface EventoFormProps {
    eventId?: string | null;
    onClose: () => void;
    onSaved: () => void;
}

export const EventoForm: React.FC<EventoFormProps> = ({ eventId, onClose, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [sites, setSites] = useState<{id: string, nombre: string}[]>([]);
    const [formData, setFormData] = useState<Partial<Evento>>({
        titulo: '',
        fecha: new Date().toISOString().slice(0, 16),
        lugar: '',
        resumen: '',
        descripcion: '',
        img: '',
        status: 'draft',
        quienes_lideran: '',
        que_permiten: '',
        curiosidades: '',
        como_participar: '',
        siteId: '',
        organizer: 'Andanzas GO'
    });

    useEffect(() => {
        loadDependencies();
        if (eventId) {
            loadEvent(eventId);
        }
    }, [eventId]);

    const loadDependencies = async () => {
        const allSites = await sitesService.getAllAdmin();
        setSites(allSites.map(s => ({ id: s.id, nombre: s.nombre })));
    };

    const loadEvent = async (id: string) => {
        setLoading(true);
        const data = await eventsService.getById(id);
        if (data) {
            // Format date for datetime-local input
            let formattedDate = data.fecha;
            if (formattedDate) {
                try {
                    const d = new Date(formattedDate);
                    formattedDate = d.toISOString().slice(0, 16);
                } catch(e) {}
            }
            setFormData({...data, fecha: formattedDate});
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `evento_${Date.now()}.${fileExt}`;
            const filePath = `events/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, img: publicUrl }));
            toast.success("Imagen subida exitosamente");
        } catch (error: any) {
            console.error(error);
            toast.error("Error al subir imagen: " + error.message);
        } finally {
            setUploadingImage(false);
        }
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
                <div className="ml-auto">
                    <Button type="submit" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Información Básica</TabsTrigger>
                    <TabsTrigger value="details">Detalles y Logística</TabsTrigger>
                </TabsList>

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-4 pt-4">
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
                            <label className="text-sm font-semibold">Lugar (Texto) *</label>
                            <Input required name="lugar" value={formData.lugar || ''} onChange={handleChange} placeholder="Ej: Teatro Municipal" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Vincular a Sitio Turístico (Opcional)</label>
                            <select 
                                name="siteId" 
                                value={formData.siteId || ''} 
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                            >
                                <option value="">Ninguno</option>
                                {sites.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Resumen *</label>
                            <Input required name="resumen" value={formData.resumen || ''} onChange={handleChange} placeholder="Descripción muy breve..." />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Descripción Completa *</label>
                            <Textarea required name="descripcion" value={formData.descripcion || ''} onChange={handleChange} rows={4} placeholder="Toda la información del evento..." />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Imagen del Evento (Banner) *</label>
                            <div className="flex gap-4 items-center">
                                {formData.img && (
                                    <div className="w-32 h-20 rounded-md overflow-hidden border">
                                        <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploadingImage}
                                            className="cursor-pointer"
                                        />
                                        {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                                    </div>
                                    <Input required name="img" value={formData.img || ''} onChange={handleChange} placeholder="O ingresa la URL directamente..." />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Estado Editorial</label>
                            <select 
                                name="status" 
                                value={formData.status || 'draft'} 
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                            >
                                <option value="draft">Borrador (Oculto)</option>
                                <option value="published">Publicado</option>
                                <option value="archived">Archivado</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Organizador del Evento</label>
                            <select 
                                name="organizer" 
                                value={formData.organizer || 'Andanzas GO'} 
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                            >
                                <option value="Andanzas GO">Andanzas GO (Predeterminado)</option>
                                <option value="Andanzas Centro Cultural">Andanzas Centro Cultural</option>
                            </select>
                        </div>
                    </div>
                </TabsContent>

                {/* DETAILS & LOGISTICS */}
                <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">¿Quiénes lideran?</label>
                            <Input name="quienes_lideran" value={formData.quienes_lideran || ''} onChange={handleChange} placeholder="Organizadores, artistas..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">¿Qué permiten?</label>
                            <Input name="que_permiten" value={formData.que_permiten || ''} onChange={handleChange} placeholder="Impacto cultural..." />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">¿Cómo Participar?</label>
                            <Textarea name="como_participar" value={formData.como_participar || ''} onChange={handleChange} rows={2} placeholder="Links, registro, costo de entrada..." />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Curiosidades</label>
                            <Textarea name="curiosidades" value={formData.curiosidades || ''} onChange={handleChange} rows={2} placeholder="Datos curiosos sobre el evento..." />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
};
