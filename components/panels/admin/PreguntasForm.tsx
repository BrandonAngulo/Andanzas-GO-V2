import { toast } from "sonner";
import React, { useState, useEffect, useMemo } from 'react';
import { GameQuestion, QuestionEditorialCheck, gamesService } from '../../../services/games.service';
import { learningService } from '../../../services/learning.service';
import { LearnEntry } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Save, X, Plus, Trash2, Edit2, Search, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { ConfirmDialog } from '../../ui/confirm-dialog';

export const PreguntasForm = ({ gameId }: { gameId: string }) => {
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingQuestion, setEditingQuestion] = useState<Partial<GameQuestion> | null>(null);
    const [learnEntries, setLearnEntries] = useState<LearnEntry[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [statusFilter, setStatusFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [bulkStatus, setBulkStatus] = useState<GameQuestion['status']>('review');
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [editorialChecks, setEditorialChecks] = useState<Record<string, QuestionEditorialCheck>>({});

    const pageSize = 50;

    const statusLabels: Record<GameQuestion['status'], string> = {
        draft: 'Borrador',
        review: 'En revisión',
        published: 'Publicada',
        archived: 'Archivada'
    };

    const statusClasses: Record<GameQuestion['status'], string> = {
        draft: 'bg-slate-100 text-slate-700',
        review: 'bg-amber-100 text-amber-800',
        published: 'bg-emerald-100 text-emerald-800',
        archived: 'bg-zinc-200 text-zinc-700'
    };

    const categories = useMemo(() => Array.from(new Set(questions.map(q => q.category).filter(Boolean) as string[])).sort(), [questions]);
    const statusCounts = useMemo(() => questions.reduce<Record<string, number>>((acc, q) => {
        acc[q.status] = (acc[q.status] || 0) + 1;
        return acc;
    }, {}), [questions]);
    const filteredQuestions = useMemo(() => {
        const query = searchQuery.trim().toLocaleLowerCase('es');
        return questions.filter(q =>
            (statusFilter === 'all' || q.status === statusFilter) &&
            (levelFilter === 'all' || q.level === Number(levelFilter)) &&
            (categoryFilter === 'all' || q.category === categoryFilter) &&
            (!query || q.question_text.toLocaleLowerCase('es').includes(query) || q.explanation?.toLocaleLowerCase('es').includes(query))
        );
    }, [questions, statusFilter, levelFilter, categoryFilter, searchQuery]);
    const pageCount = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
    const pageQuestions = filteredQuestions.slice((page - 1) * pageSize, page * pageSize);
    const allPageSelected = pageQuestions.length > 0 && pageQuestions.every(q => selectedIds.has(q.id));

    useEffect(() => {
        setPage(1);
        setSelectedIds(new Set());
    }, [gameId, statusFilter, levelFilter, categoryFilter, searchQuery]);

    useEffect(() => {
        if (page > pageCount) setPage(pageCount);
    }, [page, pageCount]);

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
        try {
            const checks = await gamesService.getQuestionEditorialChecks(data.map(q => q.id));
            setEditorialChecks(Object.fromEntries(checks.map(check => [check.question_id, check])));
        } catch (error) {
            console.error('No se pudieron cargar las validaciones editoriales:', error);
        }
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
            try {
                await gamesService.deleteQuestion(deleteId);
                toast.success('Pregunta eliminada.');
                await loadQuestions();
                setDeleteId(null);
            } catch (error) {
                console.error(error);
                toast.error('No se pudo eliminar la pregunta.');
            }
        }
    };

    const toggleSelected = (id: string) => {
        setSelectedIds(current => {
            const next = new Set(current);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleCurrentPage = () => {
        setSelectedIds(current => {
            const next = new Set(current);
            if (allPageSelected) pageQuestions.forEach(q => next.delete(q.id));
            else pageQuestions.forEach(q => next.add(q.id));
            return next;
        });
    };

    const handleBulkStatus = async () => {
        const ids = Array.from(selectedIds);
        if (!ids.length) return;
        if (bulkStatus === 'published' && ids.some(id => (editorialChecks[id]?.issues?.length || 0) > 0)) {
            toast.error('La selección contiene preguntas con errores editoriales. Corrígelas antes de publicar.');
            return;
        }
        setActionLoading(true);
        try {
            const updated = await gamesService.updateQuestionsStatus(ids, bulkStatus);
            toast.success(`${updated} pregunta${updated === 1 ? '' : 's'} actualizada${updated === 1 ? '' : 's'} a ${statusLabels[bulkStatus].toLowerCase()}.`);
            setSelectedIds(new Set());
            await loadQuestions();
        } catch (error) {
            console.error(error);
            toast.error('No se pudo aplicar el cambio de estado.');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmBulkDelete = async () => {
        const ids = Array.from(selectedIds);
        setActionLoading(true);
        try {
            const deleted = await gamesService.deleteQuestions(ids);
            toast.success(`${deleted} pregunta${deleted === 1 ? '' : 's'} eliminada${deleted === 1 ? '' : 's'}.`);
            setSelectedIds(new Set());
            setBulkDeleteOpen(false);
            await loadQuestions();
        } catch (error) {
            console.error(error);
            toast.error('No se pudieron eliminar las preguntas seleccionadas.');
        } finally {
            setActionLoading(false);
        }
    };

    const changeSingleStatus = async (question: GameQuestion, status: GameQuestion['status']) => {
        if (question.status === status) return;
        if (status === 'published' && (editorialChecks[question.id]?.issues?.length || 0) > 0) {
            toast.error('Esta pregunta tiene errores editoriales que deben corregirse antes de publicarla.');
            return;
        }
        try {
            await gamesService.updateQuestion(question.id, { status, updated_at: new Date().toISOString() } as Partial<GameQuestion>);
            setQuestions(current => current.map(q => q.id === question.id ? { ...q, status } : q));
            toast.success(`Pregunta actualizada a ${statusLabels[status].toLowerCase()}.`);
        } catch (error) {
            console.error(error);
            toast.error('No se pudo cambiar el estado de publicación.');
        }
    };

    const runEditorialChecks = async () => {
        setActionLoading(true);
        try {
            const checked = await gamesService.refreshQuestionEditorialChecks(gameId);
            toast.success(`${checked} preguntas validadas.`);
            await loadQuestions();
        } catch (error) {
            console.error(error);
            toast.error('No se pudieron ejecutar las validaciones editoriales.');
        } finally {
            setActionLoading(false);
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
            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={setBulkDeleteOpen}
                title={`¿Eliminar ${selectedIds.size} preguntas?`}
                description="La eliminación por bloque no se puede deshacer. Si solo quieres retirarlas de la aplicación, usa el estado Archivada."
                onConfirm={confirmBulkDelete}
                destructive={true}
                confirmText="Eliminar seleccionadas"
            />
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-foreground">Preguntas del Juego</h4>
                {!editingQuestion && (
                    <div className="flex gap-2">
                    <Button onClick={runEditorialChecks} size="sm" variant="outline" disabled={actionLoading}><ShieldCheck className="w-4 h-4 mr-2" /> Validar banco</Button>
                    <Button onClick={handleAddNew} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" /> Añadir Pregunta
                    </Button>
                    </div>
                )}
            </div>

            {/* Editorial question inbox */}
            {!editingQuestion && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <button type="button" onClick={() => setStatusFilter('all')} className={`text-left rounded-lg border p-3 ${statusFilter === 'all' ? 'border-primary bg-primary/5' : 'border-border'}`}><span className="block text-xs text-muted-foreground">Total</span><strong>{questions.length}</strong></button>
                        {(['draft', 'review', 'published', 'archived'] as GameQuestion['status'][]).map(status => <button key={status} type="button" onClick={() => setStatusFilter(status)} className={`text-left rounded-lg border p-3 ${statusFilter === status ? 'border-primary bg-primary/5' : 'border-border'}`}><span className="block text-xs text-muted-foreground">{statusLabels[status]}</span><strong>{statusCounts[status] || 0}</strong></button>)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,1fr)_180px_180px_180px] gap-2">
                        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar pregunta o explicación" className="pl-9" /></div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger aria-label="Filtrar por estado"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los estados</SelectItem>{(['draft', 'review', 'published', 'archived'] as GameQuestion['status'][]).map(s => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}</SelectContent></Select>
                        <Select value={levelFilter} onValueChange={setLevelFilter}><SelectTrigger aria-label="Filtrar por nivel"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los niveles</SelectItem>{[1,2,3,4,5].map(l => <SelectItem key={l} value={String(l)}>Nivel {l}</SelectItem>)}</SelectContent></Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger aria-label="Filtrar por categoría"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas las categorías</SelectItem>{categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3">
                        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={allPageSelected} onChange={toggleCurrentPage} aria-label="Seleccionar preguntas de esta página" />{selectedIds.size ? `${selectedIds.size} seleccionadas` : `Seleccionar esta página (${pageQuestions.length})`}</label>
                        <div className="flex flex-wrap items-center gap-2"><Select value={bulkStatus} onValueChange={value => setBulkStatus(value as GameQuestion['status'])}><SelectTrigger className="w-[170px]" aria-label="Nuevo estado para la selección"><SelectValue /></SelectTrigger><SelectContent>{(['draft', 'review', 'published', 'archived'] as GameQuestion['status'][]).map(s => <SelectItem key={s} value={s}>Marcar: {statusLabels[s]}</SelectItem>)}</SelectContent></Select><Button size="sm" onClick={handleBulkStatus} disabled={!selectedIds.size || actionLoading}>Aplicar estado</Button><Button size="sm" variant="outline" className="text-red-600" onClick={() => setBulkDeleteOpen(true)} disabled={!selectedIds.size || actionLoading}><Trash2 className="w-4 h-4 mr-1" /> Eliminar</Button></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Mostrando {pageQuestions.length} de {filteredQuestions.length} preguntas filtradas. Solo las publicadas están activas para el juego.</p>
                    {questions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No hay preguntas configuradas.</p> : filteredQuestions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No hay preguntas que coincidan con los filtros.</p> : pageQuestions.map((q, i) => (
                        <div key={q.id} className={`flex flex-col md:flex-row md:justify-between md:items-center gap-3 p-3 border rounded-lg bg-background ${selectedIds.has(q.id) ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
                            <div className="flex items-start gap-3 min-w-0"><input type="checkbox" className="mt-1" checked={selectedIds.has(q.id)} onChange={() => toggleSelected(q.id)} aria-label={`Seleccionar pregunta: ${q.question_text}`} /><div className="min-w-0"><span className="font-medium text-sm mr-2">{(page - 1) * pageSize + i + 1}.</span><span className="text-sm">{q.question_text}</span><div className="flex flex-wrap gap-1.5 mt-2"><span className={`text-[10px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded ${statusClasses[q.status]}`}>{statusLabels[q.status]}</span>{editorialChecks[q.id] && <span title={[...(editorialChecks[q.id].issues || []), ...(editorialChecks[q.id].warnings || [])].join(' · ')} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${editorialChecks[q.id].issues?.length ? 'bg-red-100 text-red-800' : editorialChecks[q.id].warnings?.length ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>Calidad {editorialChecks[q.id].score}/100</span>}<span className="text-[10px] uppercase tracking-wide font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{({ multiple_choice: 'Opción múltiple', multi_select: 'Selección múltiple', ordering: 'Ordenar', matching: 'Relacionar', image_choice: 'Imagen' } as Record<string, string>)[q.question_type] || q.question_type}</span><span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Nivel {q.level}</span>{q.category && <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{q.category}</span>}</div></div></div>
                            <div className="flex items-center gap-2 shrink-0"><Select value={q.status} onValueChange={value => changeSingleStatus(q, value as GameQuestion['status'])}><SelectTrigger className="w-[135px] h-8" aria-label={`Estado de ${q.question_text}`}><SelectValue /></SelectTrigger><SelectContent>{(['draft', 'review', 'published', 'archived'] as GameQuestion['status'][]).map(s => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}</SelectContent></Select><Button size="icon" variant="ghost" onClick={() => handleEdit(q)} aria-label="Editar pregunta"><Edit2 className="w-4 h-4" /></Button><Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(q.id)} aria-label="Eliminar pregunta"><Trash2 className="w-4 h-4" /></Button></div>
                        </div>
                    ))}
                    {filteredQuestions.length > pageSize && <div className="flex items-center justify-center gap-3 pt-2"><Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button><span className="text-sm text-muted-foreground">Página {page} de {pageCount}</span><Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Siguiente <ChevronRight className="w-4 h-4 ml-1" /></Button></div>}
                </div>
            )}

            {/* Legacy list retained temporarily for rollback reference, never rendered. */}
            {false && !editingQuestion && (
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
                            <label className="text-xs font-medium text-foreground">Estado editorial</label>
                            <Select value={editingQuestion.status || 'draft'} onValueChange={value => setEditingQuestion({ ...editingQuestion, status: value as GameQuestion['status'] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {(['draft', 'review', 'published', 'archived'] as GameQuestion['status'][]).map(status => <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Solo Publicada estará disponible en la aplicación.</p>
                        </div>
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
