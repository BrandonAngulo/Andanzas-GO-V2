import React, { useState, useEffect } from 'react';
import { LearnEntry } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Save, X } from 'lucide-react';

interface CuriosidadFormProps {
    entry?: LearnEntry;
    onSave: (entry: Partial<LearnEntry>) => Promise<void>;
    onCancel: () => void;
}

export const CuriosidadForm: React.FC<CuriosidadFormProps> = ({ entry, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<LearnEntry>>({
        title: '',
        city: 'Cali', // Default
        content_simple: '',
        content_deep: '',
        image_url: '',
        status: 'draft',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (entry) {
            setFormData({ ...entry });
        }
    }, [entry]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error("Error saving entry:", error);
            alert("Error al guardar la curiosidad.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border/50 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{entry ? 'Editar Curiosidad' : 'Nueva Curiosidad'}</h3>
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Título Corto</label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="Ej: La historia del chontaduro" />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ciudad</label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Ej: Cali" />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="content_simple" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contenido Breve (Fácil de leer)</label>
                <Textarea 
                    id="content_simple" 
                    name="content_simple" 
                    value={formData.content_simple || formData.curiosity || ''} 
                    onChange={handleChange} 
                    required 
                    placeholder="Escribe aquí el dato curioso principal en un párrafo corto..."
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content_deep" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Profundizar (Opcional - Formato Markdown)</label>
                <Textarea 
                    id="content_deep" 
                    name="content_deep" 
                    value={formData.content_deep || ''} 
                    onChange={handleChange} 
                    placeholder="Si el usuario quiere saber más, este texto largo aparecerá. Puedes usar párrafos largos."
                    className="min-h-[150px]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="image_url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">URL de Imagen (Opcional)</label>
                    <Input id="image_url" name="image_url" value={formData.image_url || ''} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Estado</label>
                    <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Guardando...' : (entry ? 'Actualizar' : 'Crear Curiosidad')}
                </Button>
            </div>
        </form>
    );
};
