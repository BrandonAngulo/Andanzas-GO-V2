import React, { useState } from 'react';
import { CuriousFact } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Save, X } from 'lucide-react';

interface CuriousFactFormProps {
    fact?: CuriousFact;
    onSave: (data: Partial<CuriousFact>) => void;
    onCancel: () => void;
}

export const CuriousFactForm: React.FC<CuriousFactFormProps> = ({ fact, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<CuriousFact>>(fact || {
        status: 'draft',
        city: 'Cali',
        category: 'Historia',
        show_in_home: false,
        show_in_pa_que_sepas: false,
        show_as_notification: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-bold">{fact ? 'Editar Dato Curioso' : 'Crear Dato Curioso'}</h3>
                <Button variant="ghost" size="sm" onClick={onCancel} type="button">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Título (Opcional)</label>
                        <Input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Ej. El fantasma de la ermita" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Texto del dato <span className="text-red-500">*</span></label>
                        <Textarea 
                            name="text" 
                            value={formData.text || ''} 
                            onChange={handleChange} 
                            required 
                            rows={4}
                            placeholder="¿Sabías que...?"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Ciudad</label>
                            <Input name="city" value={formData.city || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Categoría</label>
                            <select 
                                name="category" 
                                value={formData.category || 'Historia'} 
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Historia">Historia</option>
                                <option value="Cultura">Cultura</option>
                                <option value="Arte Urbano">Arte Urbano</option>
                                <option value="Gastronomía">Gastronomía</option>
                                <option value="Naturaleza">Naturaleza</option>
                                <option value="Mitos y Leyendas">Mitos y Leyendas</option>
                                <option value="Cine">Cine</option>
                                <option value="Tradiciones">Tradiciones</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">Configuración Editorial</h4>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Estado Editorial</label>
                        <select 
                            name="status" 
                            value={formData.status || 'draft'} 
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="draft">Borrador (Draft)</option>
                            <option value="review">En revisión (Review)</option>
                            <option value="ready">Listo (Ready)</option>
                            <option value="scheduled">Programado (Scheduled)</option>
                            <option value="published">Publicado (Published)</option>
                            <option value="archived">Archivado (Archived)</option>
                        </select>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="show_in_home" checked={formData.show_in_home || false} onChange={handleChange} className="rounded border-gray-300" />
                            <span className="text-sm">Mostrar en el Home (Inicio)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="show_in_pa_que_sepas" checked={formData.show_in_pa_que_sepas || false} onChange={handleChange} className="rounded border-gray-300" />
                            <span className="text-sm">Vincular sección "Pa' que sepás"</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="show_as_notification" checked={formData.show_as_notification || false} onChange={handleChange} className="rounded border-gray-300" />
                            <span className="text-sm">Generar Notificación Push / Novedad</span>
                        </label>
                    </div>

                    {formData.show_as_notification && (
                        <div className="pt-2 space-y-2 border-t mt-2">
                            <div>
                                <label className="block text-xs font-medium mb-1">Título de la Notificación</label>
                                <Input name="notification_title" value={formData.notification_title || ''} onChange={handleChange} placeholder="Ej. Pa' que sepás: Una historia breve" className="h-8 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Cuerpo de la Notificación</label>
                                <Input name="notification_body" value={formData.notification_body || ''} onChange={handleChange} placeholder="Ej. Hoy la ciudad tiene algo para contarte." className="h-8 text-sm" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Vinculaciones Avanzadas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1">ID Entrada Pa' que sepás</label>
                        <Input name="related_entry_id" value={formData.related_entry_id || ''} onChange={handleChange} placeholder="UUID..." className="text-xs" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">ID Pregunta Trivia / Juego</label>
                        <Input name="related_game_id" value={formData.related_game_id || ''} onChange={handleChange} placeholder="UUID..." className="text-xs" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">ID Ruta relacionada</label>
                        <Input name="related_route_id" value={formData.related_route_id || ''} onChange={handleChange} placeholder="String ID..." className="text-xs" />
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Pega los IDs correspondientes para vincular este dato curioso directamente a otros módulos de la app. Más adelante agregaremos selectores visuales.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    {fact ? 'Guardar Cambios' : 'Crear Dato Curioso'}
                </Button>
            </div>
        </form>
    );
};
