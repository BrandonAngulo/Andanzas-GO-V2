import React, { useState, useEffect } from 'react';
import { LearnEntry } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Save, X, Plus, Trash2 } from 'lucide-react';

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
        sabias_que: [],
        tags: [],
        fuentes: '',
        cta: '',
        trivia: { question: '', options: ['', '', '', ''], correct_index: 0, feedback_fail: '' }
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (entry) {
            setFormData({
                ...entry,
                sabias_que: entry.sabias_que || [],
                tags: entry.tags || [],
                trivia: entry.trivia || { question: '', options: ['', '', '', ''], correct_index: 0, feedback_fail: '' }
            });
        }
    }, [entry]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (name: 'tags' | 'sabias_que', value: string) => {
        const arr = value.split('|').map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [name]: arr }));
    };

    const handleTriviaChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            trivia: {
                ...(prev.trivia as any),
                [field]: value
            }
        }));
    };

    const updateTriviaOption = (index: number, val: string) => {
        setFormData(prev => {
            const newOptions = [...(prev.trivia?.options || ['', '', '', ''])];
            newOptions[index] = val;
            return {
                ...prev,
                trivia: {
                    ...(prev.trivia as any),
                    options: newOptions
                }
            };
        });
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
                <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                        <X className="w-4 h-4" />
                    </Button>
                    <Button type="submit" disabled={saving} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Información Básica</TabsTrigger>
                    <TabsTrigger value="advanced">Contenido Rico & Trivia</TabsTrigger>
                </TabsList>

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Título Corto *</label>
                            <Input name="title" value={formData.title || ''} onChange={handleChange} required placeholder="Ej: La historia del chontaduro" />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ciudad *</label>
                            <Input name="city" value={formData.city || ''} onChange={handleChange} required placeholder="Ej: Cali" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contenido Breve (Fácil de leer) *</label>
                        <Textarea 
                            name="content_simple" 
                            value={formData.content_simple || formData.curiosity || ''} 
                            onChange={handleChange} 
                            required 
                            placeholder="Escribe aquí el dato curioso principal en un párrafo corto..."
                            className="min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Profundizar (Formato Markdown)</label>
                        <Textarea 
                            name="content_deep" 
                            value={formData.content_deep || ''} 
                            onChange={handleChange} 
                            placeholder="Si el usuario quiere saber más, este texto largo aparecerá. Puedes usar párrafos largos."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL de Imagen Principal</label>
                            <Input name="image_url" value={formData.image_url || ''} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado Editorial</label>
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
                </TabsContent>

                {/* ADVANCED CONTENT & TRIVIA */}
                <TabsContent value="advanced" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Puntos "¿Sabías que...?" (Separados por pipe '|' )</label>
                        <Textarea 
                            value={(formData.sabias_que || []).join(' | ')} 
                            onChange={e => handleArrayChange('sabias_que', e.target.value)} 
                            rows={2} 
                            placeholder="Dato 1 | Dato 2 | Dato 3" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags (Búsqueda, separados por '|')</label>
                            <Input 
                                value={(formData.tags || []).join(' | ')} 
                                onChange={e => handleArrayChange('tags', e.target.value)} 
                                placeholder="Historia | Comida | Cultura" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Call To Action Final (Texto botón)</label>
                            <Input name="cta" value={formData.cta || ''} onChange={handleChange} placeholder="Ej: Visita la Plaza de Mercado" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Fuentes / Referencias</label>
                            <Input name="fuentes" value={formData.fuentes || ''} onChange={handleChange} placeholder="Libro XYZ, www.ejemplo.com" />
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg border border-border mt-4">
                        <h4 className="font-semibold mb-4 text-sm">Mini-Trivia (Para validar lectura)</h4>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium">Pregunta</label>
                                <Input 
                                    value={formData.trivia?.question || ''} 
                                    onChange={e => handleTriviaChange('question', e.target.value)} 
                                    placeholder="¿Cuál es el ingrediente principal...?" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[0,1,2,3].map(i => (
                                    <div key={i} className="flex items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name="triviaCorrect" 
                                            checked={formData.trivia?.correct_index === i}
                                            onChange={() => handleTriviaChange('correct_index', i)}
                                            className="w-4 h-4 text-primary"
                                        />
                                        <Input 
                                            value={formData.trivia?.options?.[i] || ''} 
                                            onChange={e => updateTriviaOption(i, e.target.value)} 
                                            placeholder={`Opción ${i + 1}`} 
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-medium">Feedback al Fallar</label>
                                <Input 
                                    value={formData.trivia?.feedback_fail || ''} 
                                    onChange={e => handleTriviaChange('feedback_fail', e.target.value)} 
                                    placeholder="Recuerda que en el texto decía..." 
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
};
