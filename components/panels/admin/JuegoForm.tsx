import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { Game } from '../../../services/games.service';
import { learningService } from '../../../services/learning.service';
import { LearnEntry } from '../../../types';
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
        leaderboard_enabled: false,
        related_learn_ids: [],
        mechanic_type: 'safe_zones',
        lives_count: 3,
        questions_per_match: 15,
        instructions: '',
        level_distribution: { "1": 3, "2": 3, "3": 3, "4": 3, "5": 3 }
    });
    const [saving, setSaving] = useState(false);
    const [learnEntries, setLearnEntries] = useState<LearnEntry[]>([]);

    useEffect(() => {
        if (game) {
            setFormData({ ...game });
        }
        loadLearnEntries();
    }, [game]);

    const loadLearnEntries = async () => {
        const entries = await learningService.getAll();
        setLearnEntries(entries);
    };

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

    const handleLevelDistChange = (level: string, value: string) => {
        const val = parseInt(value) || 0;
        setFormData(prev => ({
            ...prev,
            level_distribution: {
                ...(prev.level_distribution || {}),
                [level]: val
            }
        }));
    };

    const handleRelatedLearnToggle = (id: string) => {
        setFormData(prev => {
            const current = prev.related_learn_ids || [];
            if (current.includes(id)) {
                return { ...prev, related_learn_ids: current.filter(x => x !== id) };
            } else {
                return { ...prev, related_learn_ids: [...current, id] };
            }
        });
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
            toast.error("Error al guardar el juego.");
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
                                <SelectItem value="coming_soon">Próximamente</SelectItem>
                                <SelectItem value="paused">Pausado</SelectItem>
                                <SelectItem value="archived">Archivado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Mecánica del Juego</label>
                        <Select value={formData.mechanic_type || 'safe_zones'} onValueChange={(val) => handleSelectChange('mechanic_type', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona mecánica" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="safe_zones">Clásico (Zonas Seguras)</SelectItem>
                                <SelectItem value="lives">Arcade (Vidas)</SelectItem>
                                <SelectItem value="multiplier">Multiplicador por Racha</SelectItem>
                                <SelectItem value="sudden_death">Muerte Súbita</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Instrucciones / Reglas Especiales</label>
                        <Input name="instructions" value={formData.instructions || ''} onChange={handleChange} placeholder="Ej: No puedes equivocarte ni una vez." />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border border-border/50">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground">Preguntas por Partida</label>
                            <Input type="number" name="questions_per_match" value={formData.questions_per_match || 15} onChange={handleChange} />
                            <p className="text-xs text-muted-foreground">Cantidad total de preguntas que responderá el usuario en una sesión.</p>
                        </div>
                        {formData.mechanic_type === 'lives' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Cantidad de Vidas</label>
                                <Input type="number" name="lives_count" value={formData.lives_count || 3} onChange={handleChange} />
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">Distribución de Preguntas (Niveles)</label>
                        <p className="text-xs text-muted-foreground mb-2">Cuántas preguntas sacar del banco para cada nivel.</p>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map(lvl => (
                                <div key={lvl} className="flex flex-col items-center">
                                    <label className="text-xs font-semibold mb-1">N{lvl}</label>
                                    <Input 
                                        type="number" 
                                        className="h-8 px-2 text-center" 
                                        value={formData.level_distribution?.[lvl.toString()] ?? 0} 
                                        onChange={(e) => handleLevelDistChange(lvl.toString(), e.target.value)} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium leading-none text-foreground">Contenido Relacionado (Pa' que sepás)</label>
                    <p className="text-xs text-muted-foreground">Selecciona las entradas que se relacionen transversalmente con este juego entero.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-border/50 rounded-lg">
                        {learnEntries.map(entry => (
                            <label key={entry.id} className="flex items-start space-x-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded">
                                <input 
                                    type="checkbox" 
                                    className="mt-1"
                                    checked={(formData.related_learn_ids || []).includes(entry.id)}
                                    onChange={() => handleRelatedLearnToggle(entry.id)}
                                />
                                <span className="line-clamp-2">{entry.title}</span>
                            </label>
                        ))}
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
