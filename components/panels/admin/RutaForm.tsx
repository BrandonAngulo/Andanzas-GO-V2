import React, { useState, useEffect } from 'react';
import { Ruta } from '../../../types';
import { routesService } from '../../../services/routes.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Save, ArrowLeft } from 'lucide-react';
import { sitesService } from '../../../services/sites.service';

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
        publico: false, // In types it might be publico, wait types.ts didn't list it directly but AdminRutas uses route.publico
        intro_story: ''
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
            setFormData(data);
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
            alert("Error al guardar la ruta.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && routeId) {
        return <div className="p-10 text-center text-muted-foreground">Cargando ruta...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{routeId ? 'Editar Ruta' : 'Nueva Ruta'}</h2>
                    <p className="text-muted-foreground text-sm">Crea recorridos guiados seleccionando puntos de interés.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Nombre de la Ruta *</label>
                    <Input required name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Ej: Ruta del Sabor" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Duración (minutos) *</label>
                    <Input required type="number" name="duracionMin" value={formData.duracionMin || ''} onChange={handleNumberChange} />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Descripción *</label>
                    <Textarea required name="descripcion" value={formData.descripcion || ''} onChange={handleChange} rows={2} placeholder="Descripción de la ruta..." />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Historia Introductoria (Narrativa)</label>
                    <Textarea name="intro_story" value={formData.intro_story || ''} onChange={handleChange} rows={2} placeholder="Érase una vez en Cali..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Nivel de Gamificación</label>
                    <select 
                        name="gamification_level" 
                        value={formData.gamification_level || 'none'} 
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="none">Sin juegos</option>
                        <option value="light">Ligera (Preguntas simples)</option>
                        <option value="medium">Media</option>
                        <option value="full">Completa (Misiones completas)</option>
                    </select>
                </div>
                
                <div className="space-y-2 flex items-center gap-2 pt-6">
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

                <div className="space-y-3 md:col-span-2 mt-4 border-t pt-4">
                    <label className="text-sm font-semibold block">Puntos de la Ruta (Sitios)</label>
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
            </div>

            <div className="pt-6 border-t flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Guardando...' : 'Guardar Ruta'}
                </Button>
            </div>
        </form>
    );
};
