import React, { useState, useEffect } from 'react';
import { GameQuestion, gamesService } from '../../../services/games.service';
import { learningService } from '../../../services/learning.service';
import { LearnEntry } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Save, X, Plus, Trash2, Edit2 } from 'lucide-react';

export const PreguntasForm = ({ gameId }: { gameId: string }) => {
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingQuestion, setEditingQuestion] = useState<Partial<GameQuestion> | null>(null);
    const [learnEntries, setLearnEntries] = useState<LearnEntry[]>([]);

    useEffect(() => {
        loadQuestions();
        loadLearnEntries();
    }, [gameId]);

    const loadLearnEntries = async () => {
        const entries = await learningService.getAll();
        setLearnEntries(entries);
    };

    const loadQuestions = async () => {
        setLoading(true);
        const data = await gamesService.getQuestionsByGame(gameId);
        setQuestions(data);
        setLoading(false);
    };

    const handleAddNew = () => {
        setEditingQuestion({
            game_id: gameId,
            question_text: '',
            question_type: 'multiple_choice',
            level: 1,
            options: ['', '', '', ''],
            correct_answer: '',
            points_reward: 100,
            time_limit_sec: 30,
            status: 'draft',
            version: 1
        });
    };

    const handleEdit = (q: GameQuestion) => {
        setEditingQuestion(q);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar esta pregunta?")) {
            await gamesService.deleteQuestion(id);
            loadQuestions();
        }
    };

    const handleSave = async () => {
        if (!editingQuestion) return;
        
        try {
            if (editingQuestion.id) {
                await gamesService.updateQuestion(editingQuestion.id, editingQuestion);
            } else {
                await gamesService.createQuestion(editingQuestion);
            }
            setEditingQuestion(null);
            loadQuestions();
        } catch (error) {
            console.error(error);
            alert("Error al guardar la pregunta.");
        }
    };

    const updateOption = (index: number, val: string) => {
        if (!editingQuestion || !editingQuestion.options) return;
        const newOptions = [...editingQuestion.options];
        newOptions[index] = val;
        setEditingQuestion({ ...editingQuestion, options: newOptions });
    };

    if (loading) return <div className="text-sm text-muted-foreground">Cargando preguntas...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-foreground">Preguntas del Juego</h4>
                {!editingQuestion && (
                    <Button onClick={handleAddNew} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" /> Añadir Pregunta
                    </Button>
                )}
            </div>

            {/* List of existing questions */}
            {!editingQuestion && (
                <div className="space-y-3">
                    {questions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No hay preguntas configuradas.</p>
                    ) : (
                        questions.map((q, i) => (
                            <div key={q.id} className="flex justify-between items-center p-3 border border-border rounded-lg bg-background">
                                <div>
                                    <span className="font-medium text-sm mr-2">{i + 1}.</span>
                                    <span className="text-sm">{q.question_text}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(q)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(q.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Edit / Create Form */}
            {editingQuestion && (
                <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-4">
                    <div className="flex justify-between items-center">
                        <h5 className="font-medium">{editingQuestion.id ? 'Editar Pregunta' : 'Nueva Pregunta'}</h5>
                        <Button variant="ghost" size="icon" onClick={() => setEditingQuestion(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Pregunta</label>
                        <Textarea 
                            value={editingQuestion.question_text || ''} 
                            onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                            placeholder="Escribe la pregunta..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg border border-border/50">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground">Categoría</label>
                            <Input 
                                value={editingQuestion.category || ''} 
                                onChange={e => setEditingQuestion({ ...editingQuestion, category: e.target.value })} 
                                placeholder="Ej: Historia"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground">Nivel Dificultad (1-5)</label>
                            <Select 
                                value={editingQuestion.level?.toString() || "1"} 
                                onValueChange={(val) => setEditingQuestion({ ...editingQuestion, level: parseInt(val) })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {[1,2,3,4,5].map(l => <SelectItem key={l} value={l.toString()}>Nivel {l}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground">Tiempo (seg)</label>
                            <Input 
                                type="number"
                                value={editingQuestion.time_limit_sec || 30} 
                                onChange={e => setEditingQuestion({ ...editingQuestion, time_limit_sec: parseInt(e.target.value) || 30 })} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground">Puntos</label>
                            <Input 
                                type="number"
                                value={editingQuestion.points_reward || 10} 
                                onChange={e => setEditingQuestion({ ...editingQuestion, points_reward: parseInt(e.target.value) || 10 })} 
                            />
                        </div>
                    </div>

                    {editingQuestion.question_type === 'multiple_choice' && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Opciones (Selecciona la correcta)</label>
                            {editingQuestion.options && Array.isArray(editingQuestion.options) && editingQuestion.options.map((opt: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="correctAnswer" 
                                        checked={editingQuestion.correct_answer === opt && opt !== ''}
                                        onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: opt })}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <Input 
                                        value={opt} 
                                        onChange={e => updateOption(idx, e.target.value)} 
                                        placeholder={`Opción ${idx + 1}`} 
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Explicación (Dato curioso o Feedback)</label>
                        <Textarea 
                            value={editingQuestion.explanation || ''} 
                            onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                            placeholder="Aparecerá después de responder..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Contenido Relacionado (Opcional)</label>
                        <Select 
                            value={editingQuestion.related_learn_id || "none"} 
                            onValueChange={(val) => setEditingQuestion({ ...editingQuestion, related_learn_id: val === "none" ? undefined : val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una entrada de Pa' que sepás" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguno</SelectItem>
                                {learnEntries.map(entry => (
                                    <SelectItem key={entry.id} value={entry.id}>{entry.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Save className="w-4 h-4 mr-2" /> Guardar Pregunta
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
