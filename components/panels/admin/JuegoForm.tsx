import React, { useState, useEffect } from 'react';
import { Game } from '../../../services/games.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Save, X } from 'lucide-react';
import { PreguntasForm } from './PreguntasForm';

interface JuegoFormProps {
    game?: Game;
    onSave: (game: Partial<Game>) => Promise<void>;
    onCancel: () => void;
}

export const JuegoForm: React.FC<JuegoFormProps> = ({ game, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Game>>({
        title: '',
        title_en: '',
        slug: '',
        description: '',
        type: 'trivia',
        difficulty_level: 'easy',
        status: 'draft',
        base_points_reward: 100,
        allow_retries: false,
        show_feedback: true,
        leaderboard_enabled: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (game) {
            setFormData({ ...game });
        }
    }, [game]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Auto-generate slug if not present
            const finalData = { ...formData };
            if (!finalData.slug && finalData.title) {
                finalData.slug = finalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            await onSave(finalData);
        } catch (error) {
            console.error("Error saving game:", error);
            alert("Error al guardar el juego.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{game ? 'Editar Juego' : 'Nuevo Juego'}</h3>
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Título del Juego</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="Ej: Trivia de la Salsa" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Tipo de Juego</label>
                        <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="trivia">Trivia / Quiz</SelectItem>
                                <SelectItem value="guess">Adivinanza</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-foreground">Descripción (Briefing)</label>
                    <Textarea 
                        name="description" 
                        value={formData.description || ''} 
                        onChange={handleChange} 
                        required 
                        placeholder="Describe de qué trata este juego..."
                        className="min-h-[80px]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Dificultad</label>
                        <Select value={formData.difficulty_level} onValueChange={(val) => handleSelectChange('difficulty_level', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Fácil</SelectItem>
                                <SelectItem value="medium">Media</SelectItem>
                                <SelectItem value="hard">Difícil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Puntos Base</label>
                        <Input type="number" name="base_points_reward" value={formData.base_points_reward} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Estado Editorial</label>
                        <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Borrador</SelectItem>
                                <SelectItem value="published">Publicado</SelectItem>
                                <SelectItem value="archived">Archivado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
                    <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Guardando...' : (game ? 'Actualizar Datos Base' : 'Crear Juego')}
                    </Button>
                </div>
            </form>

            {/* Render Questions form only if game already exists (we have an ID) */}
            {game?.id && (
                <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm mt-6">
                    <PreguntasForm gameId={game.id} />
                </div>
            )}
        </div>
    );
};
