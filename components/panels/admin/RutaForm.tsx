import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { Ruta, RecomendacionRuta } from '../../../types';
import { routesService } from '../../../services/routes.service';
import { sitesService } from '../../../services/sites.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { ImageWithPositionField } from '../../shared/ImageWithPositionField';

interface RutaFormProps {
    routeId?: string | null;
    onClose: () => void;
    onSaved: () => void;
}

export const RutaForm: React.FC<RutaFormProps> = ({ routeId, onClose, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [sites, setSites] = useState<{id: string, nombre: string}[]>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    
    const [formData, setFormData] = useState<Partial<Ruta>>({
        nombre: '',
        descripcion: '',
        duracionMin: 60,
        gamification_level: 'none',
        puntos: [],
        publico: false, // In types it might be publico
        intro_story: '',
        justificaciones: {},
        recomendaciones: [],
        mensajeCierre: '',
        reward_badge_id: '',
        requires_registration: false,
        max_capacity: 0,
        registration_status: 'open'
    });

    useEffect(() => {
        loadDependencies();
        if (routeId) {
            loadRoute(routeId);
        }
    }, [routeId]);

    const loadDependencies = async () => {
        const allSites = await sitesService.getAllAdmin();
        setSites(allSites.map(s => ({ id: s.id, nombre: s.nombre })));
    };

    const loadRoute = async (id: string) => {
        setLoading(true);
        const all = await routesService.getAllAdmin();
        const data = all.find(r => r.id === id);
        if (data) {
            setFormData({
                ...data,
                justificaciones: data.justificaciones || {},
                recomendaciones: data.recomendaciones || []
            });
            setSelectedSites(data.puntos || []);
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const toggleSite = (siteId: string) => {
        setSelectedSites(prev => {
            if (prev.includes(siteId)) return prev.filter(id => id !== siteId);
            return [...prev, siteId];
        });
    };

    const handleJustificationChange = (siteId: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            justificaciones: {
                ...(prev.justificaciones as Record<string, string> || {}),
                [siteId]: value
            }
        }));
    };

    const addRecommendation = () => {
        setFormData(prev => ({
            ...prev,
            recomendaciones: [
                ...(prev.recomendaciones || []),
                { tipo: 'Experiencia', titulo: '', descripcion: '' }
            ]
        }));
    };

    const updateRecommendation = (index: number, field: keyof RecomendacionRuta, value: string) => {
        setFormData(prev => {
            const newRecs = [...(prev.recomendaciones || [])];
            newRecs[index] = { ...newRecs[index], [field]: value };
            return { ...prev, recomendaciones: newRecs };
        });
    };

    const removeRecommendation = (index: number) => {
        setFormData(prev => {
            const newRecs = [...(prev.recomendaciones || [])];
            newRecs.splice(index, 1);
            return { ...prev, recomendaciones: newRecs };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalData = { ...formData, puntos: selectedSites };
            if (routeId) {
                await routesService.updateRoute({ ...finalData, id: routeId } as any);
            } else {
                await routesService.createRoute({
                    ...finalData,
                    id: crypto.randomUUID(),
                    points: 0,
                    reviewsCount: 0
                } as any, 'admin');
            }
            onSaved();
        } catch (error) {
            console.error("Error saving route:", error);
            toast.error("Error al guardar la ruta.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && routeId) {
        return <div className="p-10 text-center text-muted-foreground">Cargando ruta...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b pb-4 sm:mb-6 sm:gap-4 sm:pb-6">
                <Button type="button" variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-xl font-bold sm:text-2xl">{routeId ? 'Editar Ruta' : 'Nueva Ruta'}</h2>
                    <p className="hidden text-sm text-muted-foreground min-[390px]:block">Crea recorridos guiados seleccionando puntos de interés.</p>
                </div>
                <div className="shrink-0">
                    <Button type="submit" disabled={loading} aria-label={loading ? 'Guardando ruta' : 'Guardar ruta'} className="h-10 w-10 px-0 sm:w-auto sm:px-4">
                        <Save className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{loading ? 'Guardando...' : 'Guardar'}</span>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1 scrollbar-none">
                    <TabsTrigger value="basic" className="min-w-max flex-none">Básico</TabsTrigger>
                    <TabsTrigger value="points" className="min-w-max flex-none">Puntos & Historia</TabsTrigger>
                    <TabsTrigger value="gamification" className="min-w-max flex-none">Gamificación</TabsTrigger>
                    <TabsTrigger value="registration" className="min-w-max flex-none">Inscripciones</TabsTrigger>
                    <TabsTrigger value="recommendations" className="min-w-max flex-none">Recomendaciones</TabsTrigger>
                </TabsList>

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Nombre de la Ruta *</label>
                            <Input required name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Ej: Ruta del Sabor" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Duración (minutos) *</label>
                            <Input required type="number" name="duracionMin" value={formData.duracionMin || ''} onChange={handleNumberChange} />
                        </div>
                        <div className="md:col-span-2">
                            <ImageWithPositionField
                                label="URL de la Imagen"
                                url={formData.image_url || ''}
                                onUrlChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                                position={formData.image_position ?? null}
                                onPositionChange={(pos) => setFormData(prev => ({ ...prev, image_position: pos }))}
                                placeholder="Ej: /images/rutas/mi_ruta.png o https://..."
                                aspectClassName="aspect-[16/9]"
                                helpText="El encuadre se usa en la ficha de la ruta y sus tarjetas."
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Descripción Corta *</label>
                            <Textarea required name="descripcion" value={formData.descripcion || ''} onChange={handleChange} rows={2} placeholder="Descripción breve de la ruta..." />
                        </div>
                        <div className="space-y-2 md:col-span-2 flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="publico"
                                name="publico"
                                checked={!!(formData as any).publico} 
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="publico" className="text-sm font-semibold cursor-pointer">
                                Hacer esta ruta pública para todos los usuarios
                            </label>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Estado Editorial</label>
                            <select 
                                name="status" 
                                value={formData.status || 'draft'} 
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                                <option value="archived">Archivado</option>
                            </select>
                        </div>
                    </div>
                </TabsContent>

                {/* POINTS & HISTORY */}
                <TabsContent value="points" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Historia Introductoria (Narrativa)</label>
                        <Textarea name="intro_story" value={formData.intro_story || ''} onChange={handleChange} rows={2} placeholder="Érase una vez en Cali..." />
                    </div>

                    <div className="space-y-3 mt-4 border-t pt-4">
                        <label className="text-sm font-semibold block">Seleccionar Sitios de la Ruta</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md bg-muted/10">
                            {sites.map(s => (
                                <label key={s.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer border bg-card">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedSites.includes(s.id)}
                                        onChange={() => toggleSite(s.id)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm truncate" title={s.nombre}>{s.nombre}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground text-right">{selectedSites.length} sitios seleccionados</p>
                    </div>

                    {selectedSites.length > 0 && (
                        <div className="space-y-3 mt-4 border-t pt-4">
                            <label className="text-sm font-semibold block">Justificaciones Narrativas (Por qué ir a cada sitio)</label>
                            {selectedSites.map(siteId => {
                                const site = sites.find(s => s.id === siteId);
                                return (
                                    <div key={siteId} className="space-y-1 bg-muted/30 p-3 rounded-lg border">
                                        <label className="text-xs font-semibold">{site?.nombre}</label>
                                        <Textarea 
                                            rows={2}
                                            value={(formData.justificaciones as any)?.[siteId] || ''}
                                            onChange={(e) => handleJustificationChange(siteId, e.target.value)}
                                            placeholder="Por qué este sitio es parte de la ruta..."
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                {/* GAMIFICATION */}
                <TabsContent value="gamification" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Nivel de Gamificación</label>
                            <select 
                                name="gamification_level" 
                                value={formData.gamification_level || 'none'} 
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="none">Sin juegos</option>
                                <option value="light">Ligera (Preguntas simples)</option>
                                <option value="medium">Media</option>
                                <option value="full">Completa (Misiones completas)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">ID Insignia de Recompensa (Opcional)</label>
                            <Input name="reward_badge_id" value={formData.reward_badge_id || ''} onChange={handleChange} placeholder="Ej: badge_salsa_expert" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Mensaje de Cierre / Felicitaciones</label>
                            <Textarea name="mensajeCierre" value={formData.mensajeCierre || ''} onChange={handleChange} rows={2} placeholder="¡Felicidades por completar la ruta!" />
                        </div>
                    </div>
                </TabsContent>

                {/* REGISTRATION */}
                <TabsContent value="registration" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2 flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="requires_registration"
                                name="requires_registration"
                                checked={!!formData.requires_registration} 
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="requires_registration" className="text-sm font-semibold cursor-pointer">
                                Esta ruta requiere inscripción previa
                            </label>
                        </div>
                        {formData.requires_registration && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Cupo Máximo (0 = Ilimitado)</label>
                                    <Input type="number" name="max_capacity" value={formData.max_capacity || 0} onChange={handleNumberChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Estado de Inscripciones</label>
                                    <select 
                                        name="registration_status" 
                                        value={formData.registration_status || 'open'} 
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="open">Abierto al público</option>
                                        <option value="closed">Cerrado (Solo ver lista)</option>
                                        <option value="invite_only">Por Invitación (Administrador inscribe)</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </TabsContent>

                {/* RECOMMENDATIONS */}
                <TabsContent value="recommendations" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold">Recomendaciones Útiles para la Ruta</label>
                        <Button type="button" size="sm" variant="outline" onClick={addRecommendation}>
                            <Plus className="w-4 h-4 mr-2" /> Añadir Recomendación
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {(!formData.recomendaciones || formData.recomendaciones.length === 0) ? (
                            <div className="text-center p-6 border border-dashed rounded-lg text-muted-foreground text-sm">
                                No hay recomendaciones añadidas.
                            </div>
                        ) : (
                            formData.recomendaciones.map((rec, index) => (
                                <div key={index} className="flex gap-4 p-4 border rounded-lg bg-muted/10 relative">
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold">Tipo</label>
                                                <select 
                                                    value={rec.tipo} 
                                                    onChange={(e) => updateRecommendation(index, 'tipo', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none"
                                                >
                                                    <option value="Música">Música</option>
                                                    <option value="Sabores">Sabores</option>
                                                    <option value="Experiencia">Experiencia</option>
                                                    <option value="Vestuario">Vestuario</option>
                                                    <option value="Seguridad">Seguridad</option>
                                                    <option value="Transporte">Transporte</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold">Título Breve</label>
                                                <Input 
                                                    value={rec.titulo} 
                                                    onChange={(e) => updateRecommendation(index, 'titulo', e.target.value)} 
                                                    placeholder="Ej: Ropa Cómoda" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold">Descripción</label>
                                            <Textarea 
                                                rows={2}
                                                value={rec.descripcion} 
                                                onChange={(e) => updateRecommendation(index, 'descripcion', e.target.value)} 
                                                placeholder="Lleva zapatos cómodos porque caminaremos bastante..." 
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeRecommendation(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
};
