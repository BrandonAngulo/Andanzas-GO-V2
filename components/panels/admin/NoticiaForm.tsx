import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { FeedItem } from '../../../types';
import { newsService } from '../../../services/news.service';
import { sitesService } from '../../../services/sites.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Save, ArrowLeft } from 'lucide-react';

interface NoticiaFormProps {
    itemId?: string | null;
    onClose: () => void;
    onSaved: () => void;
}

export const NoticiaForm: React.FC<NoticiaFormProps> = ({ itemId, onClose, onSaved }) => {
    const [loading, setLoading] = useState(false);
    const [sites, setSites] = useState<{id: string, nombre: string}[]>([]);
    
    const [formData, setFormData] = useState<Partial<FeedItem>>({
        type: 'anuncio',
        fecha: new Date().toISOString().slice(0, 16),
        titulo: '',
        contenido: '',
        status: 'draft',
        siteId: ''
    });

    useEffect(() => {
        loadDependencies();
        if (itemId) {
            loadItem(itemId);
        }
    }, [itemId]);

    const loadDependencies = async () => {
        const allSites = await sitesService.getAllAdmin();
        setSites(allSites.map(s => ({ id: s.id, nombre: s.nombre })));
    };

    const loadItem = async (id: string) => {
        setLoading(true);
        const data = await newsService.getById(id);
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
            if (itemId) {
                await newsService.update(itemId, formData);
            } else {
                await newsService.create({
                    ...formData,
                    id: crypto.randomUUID(),
                } as FeedItem);
            }
            onSaved();
        } catch (error) {
            console.error("Error saving feed item:", error);
            toast.error("Error al guardar la noticia.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && itemId) {
        return <div className="p-10 text-center text-muted-foreground">Cargando noticia...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{itemId ? 'Editar Noticia' : 'Nueva Noticia'}</h2>
                    <p className="text-muted-foreground text-sm">Gestiona anuncios y novedades en el feed.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Tipo de Noticia *</label>
                    <select 
                        name="type" 
                        value={formData.type || 'anuncio'} 
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="anuncio">Anuncio General</option>
                        <option value="publicacion_sitio">Novedad de un Sitio</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Fecha y Hora *</label>
                    <Input required type="datetime-local" name="fecha" value={formData.fecha || ''} onChange={handleChange} />
                </div>

                {formData.type === 'publicacion_sitio' && (
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Sitio Asociado *</label>
                        <select 
                            name="siteId" 
                            required
                            value={formData.siteId || ''} 
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Selecciona un sitio...</option>
                            {sites.map(s => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {formData.type === 'anuncio' && (
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Título *</label>
                        <Input required name="titulo" value={formData.titulo || ''} onChange={handleChange} placeholder="Ej: Nueva función disponible" />
                    </div>
                )}

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Contenido del Mensaje *</label>
                    <Textarea required name="contenido" value={formData.contenido || ''} onChange={handleChange} rows={4} placeholder="Escribe el cuerpo de la noticia..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Estado</label>
                    <select 
                        name="status" 
                        value={formData.status || 'draft'} 
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                    {loading ? 'Guardando...' : 'Guardar Noticia'}
                </Button>
            </div>
        </form>
    );
};
