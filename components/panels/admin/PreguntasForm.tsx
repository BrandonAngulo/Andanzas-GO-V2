import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { GameQuestion, gamesService } from '../../../services/games.service';
import { learningService } from '../../../services/learning.service';
import { LearnEntry } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Save, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { ConfirmDialog } from '../../ui/confirm-dialog';

export const PreguntasForm = ({ gameId }: { gameId: string }) => {
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingQuestion, setEditingQuestion] = useState<Partial<GameQuestion> | null>(null);
    const [learnEntries, setLearnEntries] = useState<LearnEntry[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);

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

    // Estructura por defecto de 'options'/'correct_answer' para cada tipo de pregunta.
    // Ver services/games.service.ts para la documentación completa de cada forma.
    const defaultsForType = (type: string) => {
        switch (type) {
            case 'multi_select':
                return { options: ['', '', '', ''], correct_answer: [] as string[] };
            case 'ordering':
                return { options: ['', '', ''], correct_answer: undefined }; // correct_answer se deriva del orden de las opciones
            case 'matching':
                return { options: { left: ['', ''], right: ['', ''] }, correct_answer: {} as Record<string, string> };
            case 'image_choice':
                return { options: [{ label: '', image_url: '' }, { label: '', image_url: '' }], correct_answer: '' };
            case 'multiple_choice':
            default:
                return { options: ['', '', '', ''], correct_answer: '' };
        }
    };

    const handleAddNew = () => {
        setEditingQuestion({
            game_id: gameId,
            question_text: '',
            question_type: 'multiple_choice',
            question_format: 'standard',
            level: 1,
            ...defaultsForType('multiple_choice'),
            points_reward: 100,
            time_limit_sec: 30,
            status: 'draft',
            version: 1
        });
    };

    const handleTypeChange = (newType: string) => {
        if (!editingQuestion) return;
        setEditingQuestion({
            ...editingQuestion,
            question_type: newType as any,
            question_format: newType === 'multiple_choice' ? (editingQuestion.question_format || 'standard') : undefined,
            ...defaultsForType(newType)
        });
    };

    const handleEdit = (q: GameQuestion) => {
        setEditingQuestion(q);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await gamesService.deleteQuestion(deleteId);
            loadQuestions();
            setDeleteId(null);
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
            toast.error("Error al guardar la pregunta.");
        }
    };

    const updateOption = (index: number, val: string) => {
        if (!editingQuestion || !editingQuestion.options) return;
        const newOptions = [...editingQuestion.options];
        newOptions[index] = val;
        // Si la pregunta es de ordenamiento, el orden de captura ES el orden correcto.
        if (editingQuestion.question_type === 'ordering') {
            setEditingQuestion({ ...editingQuestion, options: newOptions, correct_answer: newOptions });
        } else {
            setEditingQuestion({ ...editingQuestion, options: newOptions });
        }
    };

    const addOptionRow = () => {
        if (!editingQuestion) return;
        if (editingQuestion.question_type === 'matching') {
            const opts = editingQuestion.options || { left: [], right: [] };
            setEditingQuestion({ ...editingQuestion, options: { left: [...opts.left, ''], right: [...opts.right, ''] } });
        } else if (editingQuestion.question_type === 'image_choice') {
            setEditingQuestion({ ...editingQuestion, options: [...(editingQuestion.options || []), { label: '', image_url: '' }] });
        } else {
            const newOptions = [...(editingQuestion.options || []), ''];
            if (editingQuestion.question_type === 'ordering') {
                setEditingQuestion({ ...editingQuestion, options: newOptions, correct_answer: newOptions });
            } else {
                setEditingQuestion({ ...editingQuestion, options: newOptions });
            }
        }
    };

    const removeOptionRow = (idx: number) => {
        if (!editingQuestion) return;
        if (editingQuestion.question_type === 'matching') {
            const opts = editingQuestion.options || { left: [], right: [] };
            setEditingQuestion({ ...editingQuestion, options: { left: opts.left.filter((_: string, i: number) => i !== idx), right: opts.right.filter((_: string, i: number) => i !== idx) } });
        } else if (editingQuestion.question_type === 'image_choice') {
            setEditingQuestion({ ...editingQuestion, options: (editingQuestion.options || []).filter((_: any, i: number) => i !== idx) });
        } else {
            const newOptions = (editingQuestion.options || []).filter((_: string, i: number) => i !== idx);
            if (editingQuestion.question_type === 'ordering') {
                setEditingQuestion({ ...editingQuestion, options: newOptions, correct_answer: newOptions });
            } else {
                setEditingQuestion({ ...editingQuestion, options: newOptions });
            }
        }
    };

    const updateMatchingPair = (idx: number, side: 'left' | 'right', val: string) => {
        if (!editingQuestion) return;
        const opts = editingQuestion.options || { left: [], right: [] };
        const newSide = [...opts[side]];
        newSide[idx] = val;
        const newOptions = { ...opts, [side]: newSide };
        // El mapa correcto se deriva automáticamente: cada fila empareja left[i] con right[i]
        const correctMap: Record<string, string> = {};
        newOptions.left.forEach((l: string, i: number) => { if (l && newOptions.right[i]) correctMap[l] = newOptions.right[i]; });
        setEditingQuestion({ ...editingQuestion, options: newOptions, correct_answer: correctMap });
    };

    const updateImageOption = (idx: number, field: 'label' | 'image_url', val: string) => {
        if (!editingQuestion) return;
        const opts = [...(editingQuestion.options || [])];
        opts[idx] = { ...opts[idx], [field]: val };
        setEditingQuestion({ ...editingQuestion, options: opts });
    };

    const toggleMultiSelectCorrect = (opt: string) => {
        if (!editingQuestion) return;
        const current: string[] = Array.isArray(editingQuestion.correct_answer) ? editingQuestion.correct_answer : [];
        const next = current.includes(opt) ? current.filter(o => o !== opt) : [...current, opt];
        setEditingQuestion({ ...editingQuestion, correct_answer: next });
    };

    if (loading) return <div className="text-sm text-muted-foreground">Cargando preguntas...</div>;

    return (
        <div className="space-y-4">
            <ConfirmDialog 
                open={!!deleteId} 
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Estás seguro de eliminar esta pregunta?"
                description="Esta acción no se puede deshacer."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />
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
                                    <span className="ml-2 text-[10px] uppercase tracking-wide font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                        {({ multiple_choice: 'Opción múltiple', multi_select: 'Selección múltiple', ordering: 'Ordenar', matching: 'Relacionar', image_choice: 'Imagen' } as Record<string, string>)[q.question_type] || q.question_type}
                                    </span>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground">Tipo de pregunta</label>
                            <Select value={editingQuestion.question_type || 'multiple_choice'} onValueChange={handleTypeChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="multiple_choice">Opción múltiple</SelectItem>
                                    <SelectItem value="multi_select">Selección múltiple (varias correctas)</SelectItem>
                                    <SelectItem value="ordering">Ordenar</SelectItem>
                                    <SelectItem value="matching">Relacionar / emparejar</SelectItem>
                                    <SelectItem value="image_choice">Identificar en imagen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {editingQuestion.question_type === 'multiple_choice' && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-foreground">Variante (solo cambia el encabezado)</label>
                                <Select
                                    value={editingQuestion.question_format || 'standard'}
                                    onValueChange={(val) => setEditingQuestion({ ...editingQuestion, question_format: val as any })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Estándar</SelectItem>
                                        <SelectItem value="true_false">Verdadero o falso</SelectItem>
                                        <SelectItem value="fill_blank">Completar la frase</SelectItem>
                                        <SelectItem value="elimination">¿Cuál no pertenece?</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* --- Opción múltiple --- */}
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
                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeOptionRow(idx)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addOptionRow}><Plus className="w-4 h-4 mr-1" /> Añadir opción</Button>
                        </div>
                    )}

                    {/* --- Selección múltiple (varias correctas) --- */}
                    {editingQuestion.question_type === 'multi_select' && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Opciones (marca todas las correctas)</label>
                            {editingQuestion.options && Array.isArray(editingQuestion.options) && editingQuestion.options.map((opt: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={Array.isArray(editingQuestion.correct_answer) && editingQuestion.correct_answer.includes(opt) && opt !== ''}
                                        onChange={() => toggleMultiSelectCorrect(opt)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <Input 
                                        value={opt} 
                                        onChange={e => updateOption(idx, e.target.value)} 
                                        placeholder={`Opción ${idx + 1}`} 
                                    />
                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeOptionRow(idx)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addOptionRow}><Plus className="w-4 h-4 mr-1" /> Añadir opción</Button>
                        </div>
                    )}

                    {/* --- Ordenar --- */}
                    {editingQuestion.question_type === 'ordering' && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Elementos, en el orden correcto (así se guarda la respuesta correcta)</label>
                            {editingQuestion.options && Array.isArray(editingQuestion.options) && editingQuestion.options.map((opt: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-muted-foreground w-5">{idx + 1}.</span>
                                    <Input 
                                        value={opt} 
                                        onChange={e => updateOption(idx, e.target.value)} 
                                        placeholder={`Elemento ${idx + 1}`} 
                                    />
                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeOptionRow(idx)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addOptionRow}><Plus className="w-4 h-4 mr-1" /> Añadir elemento</Button>
                            <p className="text-xs text-muted-foreground">Los elementos se le mostrarán al jugador en un orden aleatorio; debe reconstruir el orden que capturaste aquí.</p>
                        </div>
                    )}

                    {/* --- Relacionar / emparejar --- */}
                    {editingQuestion.question_type === 'matching' && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Parejas correctas (columna izquierda ↔ columna derecha)</label>
                            {editingQuestion.options?.left?.map((_: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <Input 
                                        value={editingQuestion.options.left[idx]} 
                                        onChange={e => updateMatchingPair(idx, 'left', e.target.value)} 
                                        placeholder={`Elemento izquierdo ${idx + 1}`} 
                                    />
                                    <span className="text-muted-foreground">↔</span>
                                    <Input 
                                        value={editingQuestion.options.right[idx]} 
                                        onChange={e => updateMatchingPair(idx, 'right', e.target.value)} 
                                        placeholder={`Pareja correcta ${idx + 1}`} 
                                    />
                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeOptionRow(idx)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addOptionRow}><Plus className="w-4 h-4 mr-1" /> Añadir pareja</Button>
                            <p className="text-xs text-muted-foreground">Al jugador se le mezcla el orden de la columna derecha; debe emparejar cada elemento con el correcto.</p>
                        </div>
                    )}

                    {/* --- Identificar en imagen --- */}
                    {editingQuestion.question_type === 'image_choice' && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Opciones con imagen (selecciona la correcta)</label>
                            {editingQuestion.options?.map((opt: { label: string; image_url: string }, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="correctImageAnswer" 
                                        checked={editingQuestion.correct_answer === opt.label && opt.label !== ''}
                                        onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: opt.label })}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <Input 
                                        value={opt.label} 
                                        onChange={e => updateImageOption(idx, 'label', e.target.value)} 
                                        placeholder={`Nombre ${idx + 1}`} 
                                        className="flex-1"
                                    />
                                    <Input 
                                        value={opt.image_url} 
                                        onChange={e => updateImageOption(idx, 'image_url', e.target.value)} 
                                        placeholder="URL de la imagen" 
                                        className="flex-[2]"
                                    />
                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeOptionRow(idx)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addOptionRow}><Plus className="w-4 h-4 mr-1" /> Añadir opción</Button>
                            <p className="text-xs text-muted-foreground">Usa imágenes diseñadas específicamente para que la opción correcta sea inequívoca (no fotos ambiguas o genéricas).</p>
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
