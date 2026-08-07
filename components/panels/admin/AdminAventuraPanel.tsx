import React, { useEffect, useMemo, useState } from 'react';
import { Check, Image as ImageIcon, Loader2, Map, Save, Search, UserRound, X } from 'lucide-react';
import { toast } from 'sonner';
import { adventureService, ChapterLevel, GameChapter, GameCharacter } from '../../../services/adventure.service';
import type { GameQuestion } from '../../../services/games.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

export const AdminAventuraPanel: React.FC<{ gameId: string }> = ({ gameId }) => {
    const [chapters, setChapters] = useState<GameChapter[]>([]);
    const [characters, setCharacters] = useState<GameCharacter[]>([]);
    const [levels, setLevels] = useState<ChapterLevel[]>([]);
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [chapter, setChapter] = useState<GameChapter | null>(null);
    const [level, setLevel] = useState<ChapterLevel | null>(null);
    const [assigned, setAssigned] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const reloadLevels = async (chapterId: string, preferredLevelId?: string) => {
        const next = await adventureService.getLevels(chapterId);
        setLevels(next);
        const selected = next.find(item => item.id === preferredLevelId) || next[0] || null;
        setLevel(selected);
        setAssigned(new Set(selected ? await adventureService.getAssignedQuestionIds(selected.id) : []));
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const [chapterRows, characterRows, questionRows] = await Promise.all([
                    adventureService.getChapters(gameId), adventureService.getCharacters(), adventureService.getPublishedQuestions(gameId),
                ]);
                if (cancelled) return;
                setChapters(chapterRows); setCharacters(characterRows); setQuestions(questionRows);
                const first = chapterRows[0] || null;
                setChapter(first);
                if (first) await reloadLevels(first.id);
            } catch (error) {
                console.error(error); toast.error('No se pudo cargar la configuración de Aventura.');
            } finally { if (!cancelled) setLoading(false); }
        })();
        return () => { cancelled = true; };
    }, [gameId]);

    const categories = useMemo(() => Array.from(new Set(questions.map(item => item.category).filter(Boolean) as string[])).sort(), [questions]);
    const visibleQuestions = useMemo(() => questions.filter(item =>
        (category === 'all' || item.category === category) &&
        (!query.trim() || item.question_text.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')))
    ).slice(0, 80), [questions, category, query]);
    const coverage = levels.reduce((sum, item) => sum + (item.assigned_count || 0), 0);

    const selectLevel = async (next: ChapterLevel) => {
        setLevel(next); setAssigned(new Set(await adventureService.getAssignedQuestionIds(next.id)));
    };

    const saveChapter = async () => {
        if (!chapter) return;
        setSaving(true);
        try {
            await adventureService.updateChapter(chapter.id, {
                title: chapter.title, subtitle: chapter.subtitle, description: chapter.description,
                cover_image_url: chapter.cover_image_url, reward_character_id: chapter.reward_character_id,
                unlock_min_levels: chapter.unlock_min_levels, unlock_min_correct: chapter.unlock_min_correct,
                status: chapter.status,
            });
            toast.success('Capítulo actualizado.');
        } catch (error) { console.error(error); toast.error('No se pudo guardar el capítulo.'); }
        finally { setSaving(false); }
    };

    const saveLevel = async () => {
        if (!level || !chapter) return;
        setSaving(true);
        try {
            await adventureService.updateLevel(level.id, {
                title: level.title, narrative: level.narrative, purpose: level.purpose,
                questions_per_run: level.questions_per_run,
            });
            await reloadLevels(chapter.id, level.id);
            toast.success(`Nivel ${level.level_number} actualizado.`);
        } catch (error) { console.error(error); toast.error('No se pudo guardar el nivel.'); }
        finally { setSaving(false); }
    };

    const toggleQuestion = async (questionId: string) => {
        if (!level || !chapter) return;
        try {
            if (assigned.has(questionId)) await adventureService.removeQuestion(level.id, questionId);
            else await adventureService.assignQuestion(level.id, questionId);
            await reloadLevels(chapter.id, level.id);
        } catch (error) { console.error(error); toast.error('No se pudo cambiar la asignación.'); }
    };

    if (loading) return <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Cargando Aventura…</div>;
    if (!chapter) return <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Este juego todavía no tiene capítulos configurados.</div>;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div><div className="flex items-center gap-2"><Map className="h-5 w-5 text-emerald-600" /><h4 className="font-bold">Aventura · capítulos y niveles</h4></div><p className="mt-1 text-sm text-muted-foreground">Configuración integrada al juego. Los cambios permanecen en borrador hasta publicar el capítulo.</p></div>
                <div className="rounded-xl bg-muted px-3 py-2 text-right text-xs"><strong className="block text-base">{coverage}/200</strong>asignadas · meta incluye 50 visuales</div>
            </div>

            {chapters.length > 1 && <select className="h-10 rounded-md border bg-background px-3 text-sm" value={chapter.id} onChange={async e => { const next = chapters.find(item => item.id === e.target.value)!; setChapter(next); await reloadLevels(next.id); }}>{chapters.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select>}

            <div className="grid gap-4 rounded-xl border bg-muted/15 p-4 md:grid-cols-2">
                <div className="space-y-3">
                    <label className="text-xs font-semibold">Título<Input className="mt-1" value={chapter.title} onChange={e => setChapter({ ...chapter, title: e.target.value })} /></label>
                    <label className="text-xs font-semibold">Subtítulo<Input className="mt-1" value={chapter.subtitle || ''} onChange={e => setChapter({ ...chapter, subtitle: e.target.value })} /></label>
                    <label className="text-xs font-semibold">Descripción<Textarea className="mt-1 min-h-20" value={chapter.description || ''} onChange={e => setChapter({ ...chapter, description: e.target.value })} /></label>
                    <label className="text-xs font-semibold">Portada del capítulo<div className="mt-1 flex items-center gap-2"><ImageIcon className="h-4 w-4 text-muted-foreground" /><Input value={chapter.cover_image_url || ''} onChange={e => setChapter({ ...chapter, cover_image_url: e.target.value })} placeholder="URL del recurso multimedia" /></div></label>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-semibold">Personaje recompensa<div className="mt-1 flex items-center gap-2"><UserRound className="h-4 w-4 text-muted-foreground" /><select className="h-10 flex-1 rounded-md border bg-background px-3 text-sm" value={chapter.reward_character_id || ''} onChange={e => setChapter({ ...chapter, reward_character_id: e.target.value || null })}><option value="">Sin personaje</option>{characters.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></label>
                    <div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold">Niveles requeridos<Input className="mt-1" type="number" min={1} max={10} value={chapter.unlock_min_levels} onChange={e => setChapter({ ...chapter, unlock_min_levels: Number(e.target.value) })} /></label><label className="text-xs font-semibold">Correctas únicas<Input className="mt-1" type="number" min={1} value={chapter.unlock_min_correct} onChange={e => setChapter({ ...chapter, unlock_min_correct: Number(e.target.value) })} /></label></div>
                    <label className="text-xs font-semibold">Estado<select className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm" value={chapter.status} onChange={e => setChapter({ ...chapter, status: e.target.value as GameChapter['status'] })}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
                    <Button type="button" onClick={saveChapter} disabled={saving}><Save className="mr-2 h-4 w-4" />Guardar capítulo</Button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
                <div className="space-y-2">{levels.map(item => <button type="button" key={item.id} onClick={() => void selectLevel(item)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${level?.id === item.id ? 'border-emerald-500 bg-emerald-500/10' : 'hover:bg-muted/50'}`}><span><span className="block text-xs font-black uppercase text-muted-foreground">Nivel {item.level_number}</span><span className="font-semibold">{item.title}</span></span><span className={`rounded-full px-2 py-1 text-xs font-bold ${(item.assigned_count || 0) >= 20 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{item.assigned_count || 0}/20</span></button>)}</div>
                {level && <div className="space-y-4 rounded-xl border p-4">
                    <div className="grid gap-3 md:grid-cols-2"><label className="text-xs font-semibold">Título del nivel<Input className="mt-1" value={level.title} onChange={e => setLevel({ ...level, title: e.target.value })} /></label><label className="text-xs font-semibold">Preguntas por recorrido<Input className="mt-1" type="number" min={1} max={15} value={level.questions_per_run || chapter.questions_per_level} onChange={e => setLevel({ ...level, questions_per_run: Number(e.target.value) })} /></label></div>
                    <label className="block text-xs font-semibold">Propósito<Input className="mt-1" value={level.purpose || ''} onChange={e => setLevel({ ...level, purpose: e.target.value })} /></label>
                    <label className="block text-xs font-semibold">Narrativa<Textarea className="mt-1 min-h-20" value={level.narrative || ''} onChange={e => setLevel({ ...level, narrative: e.target.value })} /></label>
                    <Button type="button" variant="outline" onClick={saveLevel} disabled={saving}><Save className="mr-2 h-4 w-4" />Guardar nivel</Button>

                    <div className="border-t pt-4"><div className="mb-3 flex flex-wrap gap-2"><div className="relative min-w-52 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Buscar pregunta…" value={query} onChange={e => setQuery(e.target.value)} /></div><select className="h-10 rounded-md border bg-background px-3 text-sm" value={category} onChange={e => setCategory(e.target.value)}><option value="all">Todas las categorías</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
                        <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">{visibleQuestions.map(question => { const active = assigned.has(question.id); return <button type="button" key={question.id} onClick={() => void toggleQuestion(question.id)} className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left ${active ? 'border-emerald-400 bg-emerald-500/10' : 'hover:bg-muted/40'}`}><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-emerald-600 bg-emerald-600 text-white' : ''}`}>{active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-30" />}</span><span className="min-w-0"><span className="block text-sm font-medium">{question.question_text}</span><span className="mt-1 block text-[11px] text-muted-foreground">{question.category || 'General'} · dificultad {question.level} · {question.question_type}{question.prompt_image_url ? ' · con imagen' : ''}</span></span></button>; })}</div>
                    </div>
                </div>}
            </div>
        </div>
    );
};
