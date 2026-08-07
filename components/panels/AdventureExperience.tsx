import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Check, ChevronRight, Coins, Gem, Heart, HelpCircle, Lock, MapPinned, Play, Sparkles, Star, Trophy, X } from 'lucide-react';
import { toast } from 'sonner';
import { adventureService, AdventureMap, AdventureMapLevel, AdventureResult, AdventureRun, GameChapter } from '../../services/adventure.service';
import { gamificationService, type EconomySummary } from '../../services/gamification.service';
import type { GameQuestion } from '../../services/games.service';
import { QuestionRenderer } from '../views/QuestionRenderer';
import { Button } from '../ui/button';
import { LazyImage } from '../ui/lazy-image';

interface Props { gameId: string; onClose: () => void }
type RunQuestion = AdventureRun['questions'][number];
type Answer = { question_id: string; selected: unknown };

export const AdventureExperience: React.FC<Props> = ({ gameId, onClose }) => {
    const [chapters, setChapters] = useState<GameChapter[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<GameChapter | null>(null);
    const [map, setMap] = useState<AdventureMap | null>(null);
    const [introLevel, setIntroLevel] = useState<AdventureMapLevel | null>(null);
    const [activeLevel, setActiveLevel] = useState<AdventureMapLevel | null>(null);
    const [questions, setQuestions] = useState<RunQuestion[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [result, setResult] = useState<AdventureResult | null>(null);
    const [economy, setEconomy] = useState<EconomySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadMap = async (chapter: GameChapter) => {
        setLoading(true);
        try {
            setSelectedChapter(chapter);
            setMap(await adventureService.getChapterMap(chapter.id));
        } catch (error: any) { toast.error(error?.message || 'No fue posible cargar el mapa.'); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        let mounted = true;
        void gamificationService.getEconomySummary().then(value => { if (mounted) setEconomy(value); });
        adventureService.getChapters(gameId).then(async data => {
            if (!mounted) return;
            setChapters(data);
            if (data.length === 1) await loadMap(data[0]);
        }).catch((error: any) => toast.error(error?.message || 'No fue posible cargar Aventura.'))
          .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [gameId]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, []);

    const beginLevel = async (level: AdventureMapLevel) => {
        setLoading(true);
        try {
            const run = await adventureService.startChapterLevel(level.id);
            setIntroLevel(null); setActiveLevel(level); setQuestions(run.questions); setAnswers([]); setQuestionIndex(0); setResult(null);
        } catch (error: any) {
            toast.error(error?.message?.includes('NO_QUESTIONS') ? 'Esta parada todavía no está lista para jugar.' : (error?.message || 'No fue posible iniciar el nivel.'));
        } finally { setLoading(false); }
    };

    const answerQuestion = async (selected: unknown) => {
        if (submitting) return;
        const question = questions[questionIndex];
        const next = [...answers, { question_id: question.id, selected }];
        setAnswers(next);
        if (questionIndex < questions.length - 1) { setQuestionIndex(i => i + 1); return; }
        if (!activeLevel) return;
        setSubmitting(true);
        try { setResult(await adventureService.submitChapterLevel(activeLevel.id, next)); }
        catch (error: any) { toast.error(error?.message || 'No fue posible guardar el resultado.'); }
        finally { setSubmitting(false); }
    };

    const returnToMap = async () => {
        setIntroLevel(null); setActiveLevel(null); setResult(null); setQuestions([]);
        const refreshedEconomy = gamificationService.getEconomySummary().then(setEconomy);
        if (selectedChapter) await Promise.all([loadMap(selectedChapter), refreshedEconomy]);
        else await refreshedEconomy;
    };

    const currentQuestion = questions[questionIndex];
    const playableQuestion = currentQuestion ? ({ ...currentQuestion, correct_answer: null, points_reward: 0, time_limit_sec: 0, status: 'published', version: 1 } as GameQuestion) : null;
    const nextChapter = selectedChapter
        ? chapters.find(item => item.order_index > selectedChapter.order_index) || null
        : null;

    return createPortal(<div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#f7efe2] text-[#073c43] isolation-isolate">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(245,178,50,0.18),transparent_26%),radial-gradient(circle_at_88%_78%,rgba(16,154,119,0.16),transparent_28%)]" />
        <header className="sticky top-0 z-20 border-b border-[#073c43]/10 bg-[#f7efe2]/90 px-3 py-2 backdrop-blur-xl">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                <button onClick={(activeLevel || introLevel) ? returnToMap : onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm" aria-label="Volver">{(activeLevel || introLevel) ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}</button>
                <div className="text-center leading-tight"><div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#e46d32]">Trivia Go · Aventura</div>{activeLevel && <div className="text-sm font-black sm:text-base">{activeLevel.title}</div>}</div>
                <span className="h-9 w-9" aria-hidden="true" />
            </div>
        </header>
        <main className="relative z-10 mx-auto max-w-6xl p-3 pb-12 sm:p-4 sm:pb-14">
            {loading && <div className="flex min-h-[60vh] items-center justify-center font-bold text-[#109a77] animate-pulse">Preparando tu aventura…</div>}
            {!loading && !selectedChapter && chapters.length === 0 && <EmptyState onClose={onClose} />}
            {!loading && !selectedChapter && chapters.length > 1 && <section><h1 className="text-3xl font-black">Elige tu aventura</h1><div className="mt-5 grid gap-4 sm:grid-cols-2">{chapters.map(item => <button key={item.id} onClick={() => loadMap(item)} className="overflow-hidden rounded-3xl bg-white text-left shadow-lg transition hover:-translate-y-1">{item.cover_image_url && <LazyImage src={item.cover_image_url} alt="" className="h-40 w-full object-cover" />}<div className="p-5"><h2 className="text-xl font-black">{item.title}</h2><p className="mt-1 text-sm text-slate-600">{item.subtitle}</p></div></button>)}</div></section>}
            {!loading && map && !activeLevel && !introLevel && <MapView map={map} chapter={selectedChapter} nextChapter={nextChapter} economy={economy} onLevel={setIntroLevel} onNextChapter={loadMap} />}
            {!loading && map && introLevel && !activeLevel && <LevelIntro level={introLevel} chapterTitle={map.chapter.title} questionsPerLevel={map.chapter.questions_per_level} onStart={() => beginLevel(introLevel)} />}
            {!loading && activeLevel && playableQuestion && !result && <section className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#073c43] text-white shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover bg-center opacity-20" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#073c43]/95 via-[#075b56]/92 to-[#0d7766]/82" />
                <div className="relative z-10 p-4 sm:p-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-amber-200/60 bg-amber-300 font-black text-amber-950 shadow">{activeLevel.level_number}</div>
                        <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/65"><span className="truncate">{activeLevel.title}</span><span>{questionIndex + 1} / {questions.length}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-500" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></div>
                        <img src="/brand/andi/andi-app-mark-512.png" alt="Andi acompaña la pregunta" className="h-11 w-11 rounded-full object-cover ring-2 ring-white/30" />
                    </div>
                    <div className={`mt-5 grid gap-5 ${playableQuestion.prompt_image_url ? 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]' : ''}`}>
                        {playableQuestion.prompt_image_url && <div className="relative min-h-52 overflow-hidden rounded-2xl border border-white/20 bg-black/20 shadow-xl"><LazyImage src={playableQuestion.prompt_image_url} alt="Referencia visual de la pregunta" className="absolute inset-0 h-full w-full object-cover" /><span className="absolute bottom-2 left-2 rounded-full bg-[#073c43]/80 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider backdrop-blur">Observa la imagen</span></div>}
                        <div className="rounded-[1.5rem] border border-white/15 bg-black/15 p-4 backdrop-blur-sm sm:p-6">
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">{playableQuestion.category || 'Pregunta de aventura'}</p>
                            <h2 className="mt-2 text-xl font-black leading-tight sm:text-3xl">{playableQuestion.question_text}</h2>
                            <div className="mt-5"><QuestionRenderer question={playableQuestion} isChecking={submitting} hasTimedOut={false} selectedAnswer={null} onSubmit={answerQuestion} accent="#f5b232" /></div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-semibold text-white/55"><Sparkles className="h-3.5 w-3.5 text-amber-300" /> Tus respuestas se revisan al terminar esta parada</div>
                </div>
            </section>}
            {!loading && activeLevel && result && <ResultView result={result} level={activeLevel} onContinue={returnToMap} />}
        </main>
    </div>, document.body);
};

const EmptyState = ({ onClose }: { onClose: () => void }) => <div className="mx-auto mt-16 max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-xl"><MapPinned className="mx-auto h-12 w-12 text-[#109a77]" /><h2 className="mt-4 text-2xl font-black">La primera aventura está en preparación</h2><p className="mt-2 text-sm text-slate-600">Pronto podrás recorrer capítulos, dominar categorías y sumar nuevos amigos para Andi.</p><Button onClick={onClose} className="mt-6 bg-[#08705d]">Volver a los modos</Button></div>;

const LevelIntro = ({ level, chapterTitle, questionsPerLevel, onStart }: { level: AdventureMapLevel; chapterTitle: string; questionsPerLevel: number; onStart: () => void }) => <section className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#073c43] text-white shadow-2xl">
    <div className="absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover bg-top opacity-45" />
    <div className="absolute inset-0 bg-gradient-to-br from-[#073c43]/95 via-[#075b56]/80 to-[#073c43]/45" />
    <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-between p-5 sm:p-9">
        <div>
            <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-amber-200/40 bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-950">Nivel {level.level_number}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/60">{chapterTitle}</span>
            </div>
            <div className="mt-8 max-w-xl sm:mt-12">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Tu próxima parada</p>
                <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">{level.title}</h1>
                <p className="mt-4 text-base font-semibold leading-relaxed text-white/90 sm:text-lg">{level.narrative || `Andi te invita a descubrir las historias y sabores que hacen especial esta parada de ${chapterTitle}.`}</p>
            </div>
        </div>
        <div className="mt-10 grid items-end gap-5 sm:grid-cols-[1fr_15rem]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-start gap-3"><span className="rounded-xl bg-amber-300 p-2 text-amber-950"><Star className="h-5 w-5" /></span><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-200">Objetivo de la parada</p><p className="mt-1 text-sm font-semibold leading-relaxed text-white/85">{level.purpose || 'Responde, aprende algo nuevo y abre el siguiente tramo del recorrido.'}</p></div></div>
                <div className="mt-3 flex gap-2 text-[10px] font-bold text-white/70"><span className="rounded-full bg-black/20 px-2.5 py-1">{level.questions_per_run || questionsPerLevel} preguntas</span><span className="rounded-full bg-black/20 px-2.5 py-1">Sin límite de tiempo</span></div>
            </div>
            <div className="relative min-h-[11rem] sm:min-h-[14rem]"><img src="/images/games/trivia-go/andi-adventure-guide-v1.png" alt="Andi te invita a comenzar el nivel" className="absolute bottom-12 right-1/2 h-44 w-44 translate-x-1/2 object-contain drop-shadow-2xl sm:bottom-14 sm:h-56 sm:w-56" /><Button onClick={onStart} className="absolute inset-x-0 bottom-0 h-12 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 font-black text-amber-950 shadow-lg hover:from-amber-200 hover:to-orange-300">Comenzar nivel <Play className="ml-2 h-4 w-4 fill-current" /></Button></div>
        </div>
    </div>
</section>;

const MapView = ({ map, chapter, nextChapter, economy, onLevel, onNextChapter }: { map: AdventureMap; chapter: GameChapter | null; nextChapter: GameChapter | null; economy: EconomySummary | null; onLevel: (level: AdventureMapLevel) => void; onNextChapter: (chapter: GameChapter) => void }) => {
    const levels = map.levels.slice(0, 10);
    const currentLevel = levels.find(level => level.available && !level.completed)
        || [...levels].reverse().find(level => level.completed)
        || levels.find(level => level.available)
        || levels[0]
        || null;
    const currentAnchorRef = useRef<HTMLDivElement>(null);
    const currentLevelId = currentLevel?.id;
    const completedPercent = Math.min(100, Math.round((map.progress.levels_completed / Math.max(1, map.chapter.levels_count)) * 100));

    const focusCurrentLevel = (behavior: ScrollBehavior = 'smooth') => {
        currentAnchorRef.current?.scrollIntoView({ behavior, block: 'start' });
    };

    useEffect(() => {
        if (!currentLevelId) return;
        const frame = window.requestAnimationFrame(() => currentAnchorRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' }));
        return () => window.cancelAnimationFrame(frame);
    }, [map.chapter.id, currentLevelId]);

    return <section className="relative -mx-3 -mt-3 min-h-screen overflow-clip bg-[#064f4d] pb-5 sm:-mx-4 sm:-mt-4">
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover bg-center opacity-[0.22]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#063f43]/88 via-[#075b56]/82 to-[#032f36]/95" />

        <RouteHeader map={map} chapter={chapter} currentLevel={currentLevel} completedPercent={completedPercent} economy={economy} />

        <div className="relative mx-auto max-w-[900px] px-3 pb-28 pt-4 sm:px-5 sm:pt-5">
            <section className="relative mb-7 overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#073c43] text-white shadow-2xl sm:mb-9 sm:rounded-[2rem]">
                <div className="absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover bg-top opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#073c43]/96 via-[#075b56]/82 to-[#075b56]/28" />
                <div className="relative z-10 flex min-h-40 items-center justify-between gap-3 p-5 sm:min-h-52 sm:p-7">
                    <div className="max-w-lg">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">{map.progress.levels_completed > 0 ? 'Continúa tu expedición' : 'Nueva expedición'}</p>
                        <h1 className="mt-1 text-2xl font-black sm:text-4xl">{map.chapter.title}</h1>
                        <p className="mt-2 max-w-md text-xs font-semibold leading-relaxed text-white/80 sm:text-sm">{map.chapter.subtitle || map.chapter.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-amber-100"><MapPinned className="h-3.5 w-3.5 text-amber-300" /> Desliza para recorrer la ruta</span>
                    </div>
                    <img src="/images/games/trivia-go/andi-adventure-guide-v1.png" alt="Andi guía la expedición" className="h-28 w-28 shrink-0 object-contain drop-shadow-2xl sm:h-44 sm:w-44" />
                </div>
            </section>

            <div className="relative mx-auto max-w-2xl pb-7">
                <div className="pointer-events-none absolute bottom-4 left-[1.72rem] top-3 w-1 overflow-hidden rounded-full bg-white/15 sm:left-[2.22rem]">
                    <div className="w-full rounded-full bg-gradient-to-b from-amber-300 via-orange-400 to-emerald-400 transition-all duration-700" style={{ height: `${completedPercent}%` }} />
                </div>
                <div className="space-y-4 sm:space-y-5">
                    {levels.map((level, index) => <AdventureRouteLevel key={level.id} level={level} map={map} index={index} isCurrent={level.id === currentLevelId} currentAnchorRef={currentAnchorRef} onLevel={onLevel} />)}
                </div>
            </div>

            <CampaignGatewayCard map={map} nextChapter={nextChapter} onNextChapter={onNextChapter} />
        </div>

        {currentLevel && <div className="fixed bottom-3 left-1/2 z-40 w-full max-w-xl -translate-x-1/2 px-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-[#062f35]/95 p-2 text-white shadow-[0_12px_35px_rgba(0,0,0,0.38)] backdrop-blur-xl">
                <button type="button" onClick={() => focusCurrentLevel()} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2.5 py-2 text-left transition hover:bg-white/10" aria-label={`Volver a la parada actual: ${currentLevel.title}`}><MapPinned className="h-4 w-4 shrink-0 text-amber-300" /><span className="min-w-0"><span className="block text-[7px] font-black uppercase tracking-[0.14em] text-white/55">Parada actual</span><strong className="block truncate text-xs">{currentLevel.title}</strong></span></button>
                <Button onClick={() => onLevel(currentLevel)} className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-4 font-black text-amber-950 shadow hover:from-amber-200 hover:to-orange-300">Jugar <Play className="ml-1.5 h-3.5 w-3.5 fill-current" /></Button>
            </div>
        </div>}
    </section>;
};

const RouteHeader = ({ map, chapter, currentLevel, completedPercent, economy }: { map: AdventureMap; chapter: GameChapter | null; currentLevel: AdventureMapLevel | null; completedPercent: number; economy: EconomySummary | null }) => <header className="sticky top-[3.65rem] z-30 px-3 pt-2 text-white sm:px-5 sm:pt-3">
    <div className="relative mx-auto max-w-[860px] overflow-visible rounded-2xl border border-white/20 bg-[#063c40]/80 shadow-[0_14px_40px_rgba(1,34,38,0.32)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"><div className="absolute -right-12 -top-20 h-40 w-40 rounded-full bg-amber-300/10 blur-2xl" /><div className="absolute -bottom-16 left-1/3 h-32 w-56 rounded-full bg-emerald-300/10 blur-2xl" /></div>
        <div className="relative flex min-h-[3.55rem] items-center gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-3">
            <div className="min-w-0 flex-1 border-r border-white/10 pr-2 sm:pr-3">
                <div className="flex items-center gap-1.5"><p className="truncate text-[7px] font-black uppercase tracking-[0.18em] text-amber-300">{map.chapter.title}</p>{chapter?.status === 'draft' && <span className="hidden rounded-full bg-amber-300 px-1.5 py-0.5 text-[6px] font-black uppercase text-amber-950 sm:inline-flex">En preparación</span>}</div>
                <p className="mt-0.5 truncate text-[11px] font-black sm:text-sm">{currentLevel ? `Parada ${currentLevel.level_number} · ${currentLevel.title}` : 'Ruta completada'}</p>
            </div>
            <RouteMetric value={`${map.progress.levels_completed}/${map.chapter.levels_count}`} label="paradas" />
            <RouteMetric value={`${map.progress.unique_correct}/${map.chapter.unlock_min_correct}`} label="aciertos" />
            <AdventureResources economy={economy} />
            <RouteRules map={map} />
        </div>
        <div className="mx-3 h-1 overflow-hidden rounded-full bg-black/25"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-emerald-400 transition-all duration-700" style={{ width: `${completedPercent}%` }} /></div>
        <div className="h-1.5" />
    </div>
</header>;

const RouteMetric = ({ value, label }: { value: string; label: string }) => <div className="min-w-[3.25rem] rounded-xl border border-white/10 bg-white/10 px-1.5 py-1 text-center sm:min-w-[4rem] sm:px-2"><strong className="block text-[10px] leading-none text-amber-200 sm:text-xs">{value}</strong><span className="mt-0.5 block text-[5px] font-black uppercase tracking-wider text-white/60 sm:text-[6px]">{label}</span></div>;

const AdventureResources = ({ economy }: { economy: EconomySummary | null }) => {
    const levelStart = economy?.level_start_xp ?? 0;
    const levelEnd = economy?.next_level_xp ?? Math.max(1, levelStart + 1);
    const xpPercent = economy ? Math.min(100, Math.max(0, ((economy.experience_points - levelStart) / Math.max(1, levelEnd - levelStart)) * 100)) : 0;
    return <details className="group relative">
        <summary className="flex h-9 cursor-pointer list-none items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2 transition hover:bg-white/20 sm:gap-1.5 sm:px-2.5" aria-label="Ver tus recursos de TRIVIA GO">
            <Trophy className="h-3.5 w-3.5 text-amber-300" /><strong className="text-[9px]">Nv. {economy?.level ?? '—'}</strong>
            <span className="hidden items-center gap-1 border-l border-white/15 pl-2 md:flex"><Coins className="h-3.5 w-3.5 text-amber-300" /><strong className="text-[9px]">{economy?.coins ?? '—'}</strong><Gem className="ml-1 h-3.5 w-3.5 text-cyan-300" /><strong className="text-[9px]">{economy?.gems ?? '—'}</strong><Heart className="ml-1 h-3.5 w-3.5 text-rose-300" /><strong className="text-[9px]">{economy ? `${economy.lives}/${economy.max_lives}` : '—'}</strong></span>
            <ChevronRight className="h-3 w-3 text-white/60 transition-transform group-open:rotate-90" />
        </summary>
        <div className="absolute right-0 top-[calc(100%+0.65rem)] w-72 rounded-2xl border border-slate-200 bg-white p-4 text-[#073c43] shadow-2xl">
            <div className="flex items-center justify-between"><div><p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700">Tu progreso y recursos</p><h3 className="text-sm font-black">Nivel {economy?.level ?? '—'} de Andanzas</h3></div><Trophy className="h-5 w-5 text-amber-500" /></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${xpPercent}%` }} /></div>
            <p className="mt-1 text-[8px] font-semibold text-slate-500">{economy ? `${economy.experience_points.toLocaleString('es-CO')} XP acumulada` : 'Cargando tu progreso…'}</p>
            <div className="mt-3 grid grid-cols-3 gap-2"><ResourceBalance icon={<Coins />} value={economy?.coins} label="monedas" tone="amber" /><ResourceBalance icon={<Gem />} value={economy?.gems} label="gemas" tone="cyan" /><ResourceBalance icon={<Heart />} value={economy ? `${economy.lives}/${economy.max_lives}` : undefined} label="vidas" tone="rose" /></div>
            <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-[9px] font-semibold leading-relaxed text-emerald-900/75">Aventura comparte tu saldo general de TRIVIA GO. Recorrer esta campaña no descuenta estos recursos.</p>
        </div>
    </details>;
};

const RESOURCE_TONES = { amber: 'bg-amber-100 text-amber-700', cyan: 'bg-cyan-100 text-cyan-700', rose: 'bg-rose-100 text-rose-700' } as const;
const ResourceBalance = ({ icon, value, label, tone }: { icon: React.ReactNode; value?: number | string; label: string; tone: keyof typeof RESOURCE_TONES }) => <span className="rounded-xl bg-slate-50 p-2 text-center"><span className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4 ${RESOURCE_TONES[tone]}`}>{icon}</span><strong className="mt-1 block text-xs">{value ?? '—'}</strong><span className="block text-[7px] font-black uppercase text-slate-500">{label}</span></span>;

const RouteRules = ({ map }: { map: AdventureMap }) => <details className="group relative">
    <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white/20" aria-label="Cómo se juega"><HelpCircle className="h-4 w-4 text-amber-200" /></summary>
    <div className="absolute right-0 top-[calc(100%+0.65rem)] w-64 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-semibold leading-relaxed text-slate-600 shadow-2xl">
        <p className="font-black text-[#073c43]">Cómo recorrer esta aventura</p>
        <p className="mt-2"><strong className="text-emerald-700">1.</strong> Juega la parada marcada como actual.</p>
        <p className="mt-1"><strong className="text-emerald-700">2.</strong> Responde {map.chapter.questions_per_level} retos sin reloj.</p>
        <p className="mt-1"><strong className="text-emerald-700">3.</strong> Completa la ronda para abrir la siguiente parada.</p>
        <p className="mt-2 border-t border-slate-200 pt-2 text-[10px] text-slate-500">Puedes volver a las paradas anteriores cuando quieras.</p>
    </div>
</details>;

const AdventureRouteLevel = ({ level, map, index, isCurrent, currentAnchorRef, onLevel }: { level: AdventureMapLevel; map: AdventureMap; index: number; isCurrent: boolean; currentAnchorRef: React.RefObject<HTMLDivElement>; onLevel: (level: AdventureMapLevel) => void }) => {
    const questionsPerRun = level.questions_per_run || map.chapter.questions_per_level;
    const isFinal = level.level_number === map.chapter.levels_count;
    const status = level.completed ? `Mejor resultado ${level.best_score}/${questionsPerRun}` : isCurrent ? 'Lista para jugar' : level.available ? 'Disponible' : 'Completa la parada anterior';

    return <div ref={isCurrent ? currentAnchorRef : undefined} aria-current={isCurrent ? 'step' : undefined} className="relative grid scroll-mt-28 grid-cols-[3.5rem_1fr] items-center gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-4">
        <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-[3px] font-black shadow-xl sm:h-[4.5rem] sm:w-[4.5rem] ${isFinal ? 'border-amber-100 bg-gradient-to-br from-orange-400 to-amber-300 text-amber-950 ring-4 ring-amber-300/25' : level.completed ? 'border-emerald-100 bg-emerald-500 text-white' : isCurrent ? 'border-amber-100 bg-amber-300 text-amber-950 ring-4 ring-amber-300/25' : 'border-white/30 bg-[#073c43] text-white/80'}`}>
            {isFinal && level.completed ? <Trophy className="h-6 w-6" /> : level.completed ? <Check className="h-6 w-6 stroke-[3]" /> : level.available ? <span className="text-lg sm:text-xl">{level.level_number}</span> : <Lock className="h-5 w-5" />}
            {isCurrent && <span className="absolute -inset-2 -z-10 animate-pulse rounded-full border-2 border-amber-200/65" />}
        </div>

        <article className={`group relative overflow-hidden rounded-[1.35rem] border text-white shadow-xl transition sm:rounded-[1.6rem] ${isFinal ? 'border-amber-200/70 bg-gradient-to-br from-[#713208] via-[#7b4010] to-[#063c40]' : isCurrent ? 'border-amber-200/65 bg-[#075b56]' : level.completed ? 'border-emerald-200/30 bg-[#07544f]' : 'border-white/15 bg-[#063c40]/92'}`}>
            <div className="pointer-events-none absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover opacity-[0.18]" style={{ backgroundPosition: `${index % 2 === 0 ? 18 : 82}% ${10 + index * 8.5}%` }} />
            <div className="relative flex min-h-[6.1rem] items-center gap-3 p-3.5 sm:min-h-[6.75rem] sm:p-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5"><span className="text-[8px] font-black uppercase tracking-[0.18em] text-amber-300">{isFinal ? 'Final de campaña' : `Parada ${level.level_number}`}</span>{isCurrent && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[7px] font-black uppercase text-amber-950">Estás aquí</span>}</div>
                    <h2 className="mt-0.5 text-base font-black leading-tight sm:text-lg">{level.title}</h2>
                    <p className="mt-0.5 text-[10px] font-semibold text-white/70 sm:text-xs">{status}</p>
                    {isCurrent && <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-white/80 sm:text-xs">{level.purpose || 'Supera esta ronda para abrir el siguiente tramo de la expedición.'}</p>}
                    {isFinal && <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-black/20 px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-amber-100"><MysteryCharacter character={map.chapter.character} revealed={map.progress.unlocked} compact />{map.progress.unlocked ? `${map.chapter.character?.name || 'Nuevo personaje'} se unió a Andi` : 'Descubre un nuevo personaje'}</div>}
                </div>
                {level.available ? <Button onClick={() => onLevel(level)} className={`h-10 shrink-0 rounded-xl px-3 font-black sm:px-4 ${isCurrent || isFinal ? 'bg-amber-300 text-amber-950 hover:bg-amber-200' : 'bg-white/15 text-white hover:bg-white/25'}`} aria-label={`${level.completed ? 'Repetir' : 'Jugar'} ${level.title}`}>{level.completed ? 'Repetir' : 'Jugar'}<ChevronRight className="ml-1 h-4 w-4" /></Button> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/15 text-white/45"><Lock className="h-4 w-4" /></span>}
            </div>
        </article>
    </div>;
};

const CampaignGatewayCard = ({ map, nextChapter, onNextChapter }: { map: AdventureMap; nextChapter: GameChapter | null; onNextChapter: (chapter: GameChapter) => void }) => {
    const canContinue = map.progress.unlocked && Boolean(nextChapter);
    return <section className="relative mx-auto mt-3 max-w-2xl overflow-hidden rounded-[1.75rem] border border-amber-200/35 bg-[#063c40] text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover bg-bottom opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#063c40]/98 via-[#063c40]/88 to-[#075b56]/55" />
        <div className="relative flex min-h-40 items-center gap-4 p-5 sm:p-6">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] border shadow-xl ${canContinue ? 'border-amber-100 bg-amber-300 text-amber-950' : 'border-white/20 bg-black/25 text-white/60'}`}>{canContinue ? <ChevronRight className="h-7 w-7 stroke-[3]" /> : <Lock className="h-6 w-6" />}</div>
            <div className="min-w-0 flex-1"><p className="text-[8px] font-black uppercase tracking-[0.18em] text-amber-300">Próxima aventura</p><h2 className="mt-1 text-xl font-black">{canContinue ? nextChapter?.title : 'Una nueva ruta te espera'}</h2><p className="mt-1 text-xs font-semibold leading-relaxed text-white/70">{canContinue ? 'La entrada está abierta. Continúa la expedición cuando quieras.' : map.progress.unlocked ? 'Esta aventura aparecerá cuando esté lista.' : 'Completa la campaña para abrir el camino.'}</p></div>
            {canContinue && <Button onClick={() => nextChapter && onNextChapter(nextChapter)} className="h-10 shrink-0 rounded-xl bg-amber-300 px-4 font-black text-amber-950 hover:bg-amber-200">Entrar <ChevronRight className="ml-1 h-4 w-4" /></Button>}
        </div>
    </section>;
};

const PANDEBONO_REWARD_IMAGE = '/images/games/trivia-go/characters/pandebono-reward-v1.png';

const characterImage = (character?: { image_url?: string | null } | null) => character?.image_url || PANDEBONO_REWARD_IMAGE;

const MysteryCharacter = ({ character, revealed, compact = false }: { character?: AdventureMap['chapter']['character']; revealed: boolean; compact?: boolean }) => <span aria-hidden="true" className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-200/50 bg-gradient-to-br from-amber-200/25 to-emerald-950/55 shadow-inner ${compact ? 'h-5 w-5' : 'h-7 w-7 sm:h-10 sm:w-10'}`}>
    <img src={characterImage(character)} alt="" className={`h-[115%] w-[115%] object-contain transition ${revealed ? 'drop-shadow' : 'brightness-0 opacity-65'}`} />
    {!revealed && <span className={`absolute inset-0 flex items-center justify-center font-black text-amber-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] ${compact ? 'text-[10px]' : 'text-sm sm:text-lg'}`}>?</span>}
</span>;

const ResultView = ({ result, level, onContinue }: { result: AdventureResult; level: AdventureMapLevel; onContinue: () => void }) => {
    const levelsPercent = Math.min(100, (result.levels_completed / Math.max(1, result.unlock_min_levels)) * 100);
    const correctPercent = Math.min(100, (result.unique_correct / Math.max(1, result.unlock_min_correct)) * 100);
    const levelsLeft = Math.max(0, result.unlock_min_levels - result.levels_completed);
    const correctLeft = Math.max(0, result.unlock_min_correct - result.unique_correct);
    return <section className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#073c43] text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-scroll-background-v5.webp')] bg-cover bg-bottom opacity-35" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#073c43]/95 via-[#075b56]/86 to-[#0e9275]/72" />
        <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-between p-5 sm:p-9">
            <div className="text-center">
                <span className="inline-flex rounded-full border border-amber-200/40 bg-amber-300 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-amber-950">Parada completada · Nivel {level.level_number}</span>
                <div className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full border-[7px] border-amber-200 bg-gradient-to-br from-amber-300 to-orange-400 text-amber-950 shadow-[0_12px_35px_rgba(0,0,0,0.3)]"><div><strong className="block text-4xl font-black leading-none">{result.correct}</strong><span className="text-[10px] font-black uppercase">de {result.total}</span></div></div>
                <h1 className="mt-4 text-3xl font-black">{result.correct === result.total ? '¡Parada perfecta!' : result.correct >= Math.ceil(result.total / 2) ? '¡Buen recorrido!' : 'Cada intento te enseña'}</h1>
                <p className="mt-1 text-sm text-white/75">{level.title}</p>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_15rem]">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-200">{result.unlocked_now ? `Personaje desbloqueado: ${result.character?.name || 'nuevo amigo'}` : 'Camino hacia un nuevo personaje'}</p>
                    <ProgressRow label="Niveles recorridos" value={`${result.levels_completed}/${result.unlock_min_levels}`} percent={levelsPercent} />
                    <ProgressRow label="Respuestas correctas únicas" value={`${result.unique_correct}/${result.unlock_min_correct}`} percent={correctPercent} />
                    {!result.unlocked_now && <p className="mt-4 rounded-xl bg-black/20 px-3 py-2 text-xs font-semibold text-white/75">Próximo objetivo: {levelsLeft > 0 ? `${levelsLeft} ${levelsLeft === 1 ? 'nivel' : 'niveles'}` : ''}{levelsLeft > 0 && correctLeft > 0 ? ' y ' : ''}{correctLeft > 0 ? `${correctLeft} aciertos únicos` : ''}.</p>}
                </div>
                <div className="relative min-h-[13rem] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-amber-200/15 to-white/5 text-center backdrop-blur-md">
                    {result.unlocked_now ? <><Sparkles className="absolute left-3 top-3 h-5 w-5 text-amber-300" /><img src={characterImage(result.character)} alt={result.character?.name || 'Nuevo amigo desbloqueado'} className="mx-auto h-36 w-36 object-contain drop-shadow-2xl" /><p className="px-3 text-sm font-black">¡{result.character?.name || 'Un nuevo amigo'} se une a Andi!</p></> : <><img src="/brand/andi/andi-app-mark-512.png" alt="Andi celebra tu avance" className="mx-auto mt-2 h-36 w-36 rounded-full object-cover drop-shadow-2xl" /><p className="px-3 text-xs font-bold text-white/75">Andi ya está buscando la siguiente parada.</p></>}
                </div>
            </div>
            <Button onClick={onContinue} className="mt-5 h-12 w-full rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 font-black text-amber-950 shadow-lg hover:from-amber-200 hover:to-orange-300">Continuar por el mapa <ChevronRight className="ml-2 h-5 w-5" /></Button>
        </div>
    </section>;
};

const ProgressRow = ({ label, value, percent }: { label: string; value: string; percent: number }) => <div className="mt-4"><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-white/80">{label}</span><strong className="text-amber-200">{value}</strong></div><div className="h-2.5 overflow-hidden rounded-full bg-black/25"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-700" style={{ width: `${percent}%` }} /></div></div>;
