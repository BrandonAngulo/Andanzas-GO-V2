import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { Site } from '../../../types';
import { sitesService } from '../../../services/sites.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Save, ArrowLeft } from 'lucide-react';

interface SitioFormProps {
    siteId?: string | null;
    onClose: () => void;
    onSaved: () => void;
}

export const SitioForm: React.FC<SitioFormProps> = ({ siteId, onClose, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Site>>({
        nombre: '',
        tipo: '',
        descripcion: '',
        lat: 3.4516,
        lng: -76.5320, // Default to Cali
        logoUrl: '',
        status: 'draft',
        rating: 0,
        visitas: 0,
        importancia: '',
        datosHistoricos: '',
        gancho_emocional: '',
        por_que_ir: [],
        que_hacer: '',
        mejor_momento: '',
        ideal_para: [],
        duracion_sugerida: '',
        micro_reto: '',
        horario: '',
        tarifa: '',
        direccion: '',
        fotos: []
    });

    useEffect(() => {
        if (siteId) {
            loadSite(siteId);
        }
    }, [siteId]);

    const loadSite = async (id: string) => {
        setLoading(true);
        const data = await sitesService.getById(id);
        if (data) setFormData(data);
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleArrayChange = (name: string, value: string) => {
        const arr = value.split(',').map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [name]: arr }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (siteId) {
                await sitesService.update(siteId, formData);
            } else {
                await sitesService.create({
                    ...formData,
                    id: crypto.randomUUID(),
                    // other default fields if necessary
                } as Site);
            }
            onSaved();
        } catch (error) {
            console.error("Error saving site:", error);
            toast.error("Error al guardar el sitio.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && siteId) {
        return <div className="p-10 text-center text-muted-foreground">Cargando sitio...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{siteId ? 'Editar Sitio' : 'Nuevo Sitio'}</h2>
                    <p className="text-muted-foreground text-sm">Gestiona la información del punto de interés.</p>
                </div>
                <div className="ml-auto">
                    <Button type="submit" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="details">Detalles e Historia</TabsTrigger>
                    <TabsTrigger value="experience">Activación & UX</TabsTrigger>
                    <TabsTrigger value="media">Media & Estado</TabsTrigger>
                </TabsList>

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Nombre del Sitio *</label>
                            <Input required name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Ej: Cristo Rey" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Tipo / Categoría *</label>
                            <Input required name="tipo" value={formData.tipo || ''} onChange={handleChange} placeholder="Ej: Monumento, Museo..." />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Descripción Principal *</label>
                            <Textarea required name="descripcion" value={formData.descripcion || ''} onChange={handleChange} rows={3} placeholder="Breve descripción del sitio..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Latitud *</label>
                            <Input required type="number" step="any" name="lat" value={formData.lat || ''} onChange={handleNumberChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Longitud *</label>
                            <Input required type="number" step="any" name="lng" value={formData.lng || ''} onChange={handleNumberChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Dirección</label>
                            <Input name="direccion" value={formData.direccion || ''} onChange={handleChange} placeholder="Dirección física" />
                        </div>
                    </div>
                </TabsContent>

                {/* DETAILS & HISTORY */}
                <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Importancia Cultural</label>
                            <Textarea name="importancia" value={formData.importancia || ''} onChange={handleChange} rows={2} placeholder="¿Por qué es importante?" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Datos Históricos</label>
                            <Textarea name="datosHistoricos" value={formData.datosHistoricos || ''} onChange={handleChange} rows={3} placeholder="Historia relevante..." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Horario</label>
                                <Input name="horario" value={formData.horario || ''} onChange={handleChange} placeholder="Ej: Lunes a Viernes, 8am - 5pm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Tarifa / Costo</label>
                                <Input name="tarifa" value={formData.tarifa || ''} onChange={handleChange} placeholder="Ej: Entrada libre, o $10.000 COP" />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* EXPERIENCE & ACTIVATION */}
                <TabsContent value="experience" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-primary">Gancho Emocional</label>
                            <Input name="gancho_emocional" value={formData.gancho_emocional || ''} onChange={handleChange} placeholder="Frase corta de impacto para atraer la visita..." />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">¿Qué hacer aquí?</label>
                            <Textarea name="que_hacer" value={formData.que_hacer || ''} onChange={handleChange} rows={2} placeholder="Actividades sugeridas en el sitio..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Micro-Reto Gamificado</label>
                            <Input name="micro_reto" value={formData.micro_reto || ''} onChange={handleChange} placeholder="Ej: Tómate una foto con la estatua" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Duración Sugerida</label>
                            <Input name="duracion_sugerida" value={formData.duracion_sugerida || ''} onChange={handleChange} placeholder="Ej: 1-2 horas" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Mejor Momento para ir</label>
                            <Input name="mejor_momento" value={formData.mejor_momento || ''} onChange={handleChange} placeholder="Ej: Al atardecer" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Por qué ir (separado por comas)</label>
                            <Input value={(formData.por_que_ir || []).join(', ')} onChange={e => handleArrayChange('por_que_ir', e.target.value)} placeholder="Ej: Vistas, Historia, Naturaleza" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Ideal Para (separado por comas)</label>
                            <Input value={(formData.ideal_para || []).join(', ')} onChange={e => handleArrayChange('ideal_para', e.target.value)} placeholder="Ej: Familia, Parejas, Fotografía" />
                        </div>
                    </div>
                </TabsContent>

                {/* MEDIA & STATUS */}
                <TabsContent value="media" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">URL de la Imagen Principal *</label>
                            <Input required name="logoUrl" value={formData.logoUrl || ''} onChange={handleChange} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Fotos de Galería (URLs separadas por coma)</label>
                            <Textarea 
                                value={(formData.fotos || []).join(',\n')} 
                                onChange={e => handleArrayChange('fotos', e.target.value)} 
                                rows={3} 
                                placeholder="https://foto1.jpg,&#10;https://foto2.jpg" 
                            />
                        </div>
                        <div className="space-y-2 max-w-xs">
                            <label className="text-sm font-semibold">Estado Editorial</label>
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
                </TabsContent>
            </Tabs>
        </form>
    );
};
