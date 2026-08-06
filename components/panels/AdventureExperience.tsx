import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Check, ChevronRight, HelpCircle, Lock, MapPinned, Play, Sparkles, Star, Trophy, X } from 'lucide-react';
import { toast } from 'sonner';
import { adventureService, AdventureMap, AdventureMapLevel, AdventureResult, AdventureRun, GameChapter } from '../../services/adventure.service';
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
        if (selectedChapter) await loadMap(selectedChapter);
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
            {!loading && map && !activeLevel && !introLevel && <MapView map={map} chapter={selectedChapter} nextChapter={nextChapter} onLevel={setIntroLevel} onNextChapter={loadMap} />}
            {!loading && map && introLevel && !activeLevel && <LevelIntro level={introLevel} chapterTitle={map.chapter.title} questionsPerLevel={map.chapter.questions_per_level} onStart={() => beginLevel(introLevel)} />}
            {!loading && activeLevel && playableQuestion && !result && <section className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#073c43] text-white shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-game-map-v4.webp')] bg-cover bg-center opacity-20" />
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
    <div className="absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-game-map-v4.webp')] bg-cover bg-top opacity-45" />
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

const MapView = ({ map, chapter, nextChapter, onLevel, onNextChapter }: { map: AdventureMap; chapter: GameChapter | null; nextChapter: GameChapter | null; onLevel: (level: AdventureMapLevel) => void; onNextChapter: (chapter: GameChapter) => void }) => <section className="relative -mx-3 -mt-3 min-h-screen overflow-hidden px-3 pb-14 pt-3 sm:-mx-4 sm:-mt-4 sm:px-4 sm:pt-4">
    <div className="pointer-events-none absolute inset-0 bg-[#075b56]" />
    <div className="relative mx-auto max-w-[900px]">
        <div className="relative mx-auto aspect-[2/3] w-full overflow-hidden rounded-[1.5rem] bg-[url('/images/games/trivia-go/aventura-sabores-cali-game-map-v4.webp')] bg-cover bg-top shadow-[0_16px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/20 sm:rounded-[1.75rem]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#073c43]/10" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b from-[#073c43]/80 via-[#075b65]/45 to-transparent" />
            {chapter?.status === 'draft' && <span className="absolute left-1/2 top-[1.2%] z-20 -translate-x-1/2 rounded-full border border-amber-100/50 bg-amber-300/95 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-amber-950 shadow sm:text-[8px]">Aventura en preparación</span>}
            <div className="absolute left-[4%] top-[4.5%] z-10 w-[43%] text-white [text-shadow:0_2px_8px_rgba(7,35,43,0.9)]">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-200 sm:text-[10px]">{map.progress.levels_completed > 0 ? 'Continúa tu expedición' : 'Nueva expedición'}</p>
                <h1 className="mt-0.5 text-lg font-black leading-none sm:text-3xl">{map.chapter.title}</h1>
                <p className="mt-1 line-clamp-2 text-[9px] font-medium leading-tight text-white/95 sm:text-sm">{map.chapter.subtitle || map.chapter.description}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#073c43]/50 px-2 py-1 text-[8px] font-bold backdrop-blur-sm sm:text-[10px]"><MapPinned className="h-3 w-3 text-amber-300" /> {map.chapter.levels_count} paradas por descubrir</div>
            </div>
            <img src="/images/games/trivia-go/andi-adventure-guide-v1.png" alt="Andi señala el comienzo de la aventura" className="absolute left-[50%] top-[2.4%] z-10 h-auto w-[19%] object-contain drop-shadow-[0_8px_14px_rgba(7,35,43,0.55)]" />
            <MapQuestHud map={map} />
            <MapRules map={map} />
            {map.levels.slice(0, 10).map((level, index) => {
                const position = levelPositions[index];
                const labelOnRight = position.x < 50;
                const questionsPerRun = level.questions_per_run || map.chapter.questions_per_level;
                const isFinalLevel = level.level_number === map.chapter.levels_count;
                const statusText = level.completed
                    ? `Mejor resultado: ${level.best_score}/${questionsPerRun}`
                    : level.available ? `${questionsPerRun} retos · listo para jugar` : 'Completa la parada anterior';
                return <button key={level.id} aria-label={`${isFinalLevel ? 'Final de campaña' : `Parada ${level.level_number}`}: ${level.title}. ${statusText}${isFinalLevel ? (map.progress.unlocked ? `. Personaje desbloqueado: ${map.chapter.character?.name || 'nuevo amigo'}` : '. Descubre un nuevo personaje') : ''}`} disabled={!level.available} onClick={() => onLevel(level)} style={{ left: `${position.x}%`, top: `${position.y}%` }} className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 transition enabled:hover:z-20 enabled:hover:scale-110 ${!level.available ? 'opacity-90' : ''}`}>
                    <span className={`relative flex items-center justify-center rounded-full font-black ${isFinalLevel ? 'h-[clamp(2.5rem,8.5vw,5rem)] w-[clamp(2.5rem,8.5vw,5rem)]' : 'h-[clamp(2.15rem,7.4vw,4.25rem)] w-[clamp(2.15rem,7.4vw,4.25rem)]'} ${level.completed ? 'text-[#075b56] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]' : level.available ? 'text-base text-[#68370c] drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] sm:text-xl' : 'text-white drop-shadow-[0_2px_3px_rgba(45,25,10,0.95)]'}`}>{isFinalLevel && <><span className="absolute -inset-1 -z-20 rounded-full bg-orange-300/25 blur-md sm:-inset-2" /><span className="absolute -inset-0.5 -z-10 rounded-full ring-2 ring-amber-200/80 sm:-inset-1" /></>}{level.completed ? (isFinalLevel ? <Trophy className="h-6 w-6 stroke-[2.7] sm:h-8 sm:w-8" /> : <Check className="h-5 w-5 stroke-[3] sm:h-7 sm:w-7" />) : level.available ? level.level_number : <Lock className="h-4 w-4 translate-y-px stroke-[2.5] sm:h-5 sm:w-5 sm:translate-y-0.5" />}{level.available && <><span className="absolute inset-[1%] -z-10 animate-pulse rounded-full ring-[3px] ring-amber-200/90" /><span className="absolute inset-[6%] -z-10 rounded-full ring-2 ring-white/80 transition group-hover:ring-4 group-hover:ring-white" /></>}</span>
                    <span className={`absolute top-1/2 hidden w-max max-w-[14rem] -translate-y-1/2 rounded-xl border px-3 py-2 text-left text-white shadow-[0_5px_18px_rgba(0,0,0,0.45)] sm:block ${isFinalLevel ? 'border-amber-200/80 bg-gradient-to-br from-[#713208] to-[#062f35] ring-1 ring-amber-300/60' : level.available ? 'border-emerald-100/35 bg-[#075b56]/95' : 'border-white/25 bg-[#062f35]/95'} ${labelOnRight ? 'left-[calc(100%+0.65rem)]' : 'right-[calc(100%+0.65rem)] text-right'}`}><span className="block text-[8px] font-black uppercase tracking-[0.16em] text-amber-300">{isFinalLevel ? 'Final de campaña' : `Parada ${level.level_number}`}</span><span className="block max-w-[12rem] truncate text-sm font-black [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">{level.title}</span><span className="block text-[9px] font-medium text-white/85">{statusText}</span>{isFinalLevel && <span className="mt-1.5 flex items-center gap-1.5 rounded-full bg-amber-300/15 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-amber-100"><MysteryCharacter character={map.chapter.character} revealed={map.progress.unlocked} compact /> {map.progress.unlocked ? `Amigo: ${map.chapter.character?.name || 'nuevo personaje'}` : 'Descubre un nuevo personaje'}</span>}</span>
                </button>;
            })}
            <CampaignGatewayHotspot map={map} nextChapter={nextChapter} onNextChapter={onNextChapter} />
        </div>
    </div>
</section>;

const PANDEBONO_REWARD_IMAGE = '/images/games/trivia-go/characters/pandebono-reward-v1.png';

const characterImage = (character?: { image_url?: string | null } | null) => character?.image_url || PANDEBONO_REWARD_IMAGE;

const MapQuestHud = ({ map }: { map: AdventureMap }) => {
    const nextLevel = map.levels.find(level => level.available && !level.completed)
        || map.levels.find(level => level.available)
        || null;
    const levelGoal = Math.max(1, map.chapter.unlock_min_levels);
    const correctGoal = Math.max(1, map.chapter.unlock_min_correct);
    const levelPercent = Math.min(100, Math.round((map.progress.levels_completed / levelGoal) * 100));
    const correctPercent = Math.min(100, Math.round((map.progress.unique_correct / correctGoal) * 100));

    return <section aria-label="Progreso de la aventura" className="absolute right-[3%] top-[4.1%] z-10 w-[29%] overflow-hidden rounded-xl border border-white/25 bg-[#073c43]/68 text-white shadow-xl backdrop-blur-md">
        <div className="border-b border-white/15 px-2.5 py-2 sm:px-3 sm:py-2.5">
            <p className="text-[6px] font-black uppercase tracking-[0.16em] text-amber-200 sm:text-[8px]">Siguiente parada</p>
            <p className="truncate text-[9px] font-black leading-tight sm:text-sm">{nextLevel?.title || 'Ruta completada'}</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-white/15 border-b border-white/15">
            <MapProgress value={`${map.progress.levels_completed}/${levelGoal}`} label="paradas" percent={levelPercent} />
            <MapProgress value={`${map.progress.unique_correct}/${correctGoal}`} label="aciertos" percent={correctPercent} />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 sm:gap-2 sm:px-2.5 sm:py-2">
            <MysteryCharacter character={map.chapter.character} revealed={map.progress.unlocked} />
            <span className="min-w-0"><span className="block text-[6px] font-black uppercase tracking-wide text-amber-200 sm:text-[8px]">Premio de campaña</span><strong className="block truncate text-[8px] leading-tight sm:text-[11px]">{map.progress.unlocked ? map.chapter.character?.name || 'Nuevo amigo' : 'Desbloquea un personaje'}</strong></span>
        </div>
    </section>;
};

const MysteryCharacter = ({ character, revealed, compact = false }: { character?: AdventureMap['chapter']['character']; revealed: boolean; compact?: boolean }) => <span aria-hidden="true" className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-200/50 bg-gradient-to-br from-amber-200/25 to-emerald-950/55 shadow-inner ${compact ? 'h-5 w-5' : 'h-7 w-7 sm:h-10 sm:w-10'}`}>
    <img src={characterImage(character)} alt="" className={`h-[115%] w-[115%] object-contain transition ${revealed ? 'drop-shadow' : 'brightness-0 opacity-65'}`} />
    {!revealed && <span className={`absolute inset-0 flex items-center justify-center font-black text-amber-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] ${compact ? 'text-[10px]' : 'text-sm sm:text-lg'}`}>?</span>}
</span>;

const MapProgress = ({ value, label, percent }: { value: string; label: string; percent: number }) => <div className="px-2 py-1.5 sm:px-2.5 sm:py-2"><strong className="block text-[9px] leading-none text-amber-200 sm:text-xs">{value}</strong><span className="mt-0.5 block text-[6px] font-black uppercase tracking-wide text-white/70 sm:text-[7px]">{label}</span><span className="mt-1 block h-1 overflow-hidden rounded-full bg-black/25"><span className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400" style={{ width: `${percent}%` }} /></span></div>;

const MapRules = ({ map }: { map: AdventureMap }) => <details className="group absolute right-[3%] top-[21.5%] z-30 text-[#073c43]">
    <summary className="ml-auto flex w-max cursor-pointer list-none items-center gap-1 rounded-full border border-white/25 bg-white/92 px-2 py-1 text-[7px] font-black uppercase tracking-wide shadow-lg backdrop-blur sm:px-2.5 sm:text-[9px]"><HelpCircle className="h-3 w-3 text-emerald-600" /> Cómo jugar <ChevronRight className="h-3 w-3 text-emerald-600 transition-transform group-open:rotate-90" /></summary>
    <div className="mt-1.5 w-48 rounded-xl border border-white/30 bg-white/95 p-2.5 text-[8px] font-semibold leading-relaxed shadow-xl backdrop-blur sm:w-60 sm:p-3 sm:text-[10px]">
        <p><strong className="text-emerald-700">1.</strong> Toca la parada disponible.</p>
        <p className="mt-1"><strong className="text-emerald-700">2.</strong> Responde {map.chapter.questions_per_level} retos sin reloj.</p>
        <p className="mt-1"><strong className="text-emerald-700">3.</strong> Termínala para abrir el siguiente tramo.</p>
        <p className="mt-2 border-t border-slate-200 pt-2 text-slate-500">Puedes repetir paradas. Esta aventura no consume monedas, gemas ni vidas.</p>
    </div>
</details>;

const CampaignGatewayHotspot = ({ map, nextChapter, onNextChapter }: { map: AdventureMap; nextChapter: GameChapter | null; onNextChapter: (chapter: GameChapter) => void }) => {
    const canContinue = map.progress.unlocked && Boolean(nextChapter);
    const doorTitle = canContinue ? 'Siguiente campaña' : 'Próxima aventura';
    const doorStatus = canContinue
        ? `Entrar a ${nextChapter?.title}`
        : map.progress.unlocked ? 'Por descubrir' : 'Completa esta ruta';
    const doorLabel = `${doorTitle}. ${doorStatus}`;

    return <button type="button" disabled={!canContinue} onClick={() => nextChapter && onNextChapter(nextChapter)} aria-label={doorLabel} title={doorLabel} style={{ left: '50%', top: '90.2%' }} className="group absolute z-20 flex h-[7.5%] w-[24%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[45%] disabled:cursor-default">
        <span className={`absolute inset-[22%] rounded-full blur-lg transition ${canContinue ? 'animate-pulse bg-amber-300/40 group-hover:bg-amber-200/65' : 'bg-[#062f35]/12'}`} />
        <span className={`relative flex h-7 w-7 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm transition sm:h-9 sm:w-9 ${canContinue ? 'border-amber-100/80 bg-amber-300 text-amber-950 group-hover:scale-110' : 'border-white/45 bg-[#062f35]/92 text-white'}`}>{canContinue ? <ChevronRight className="h-4 w-4 stroke-[3] sm:h-5 sm:w-5" /> : <Lock className="h-3.5 w-3.5 translate-y-px sm:h-4 sm:w-4" />}</span>
    </button>;
};

const levelPositions = [
    { x: 40.0, y: 33.6 },
    { x: 47.6, y: 37.7 },
    { x: 37.7, y: 41.6 },
    { x: 48.2, y: 45.9 },
    { x: 56.0, y: 52.0 },
    { x: 48.8, y: 57.9 },
    { x: 59.7, y: 64.8 },
    { x: 48.8, y: 70.8 },
    { x: 48.0, y: 75.9 },
    { x: 50.1, y: 81.3 },
];

const ResultView = ({ result, level, onContinue }: { result: AdventureResult; level: AdventureMapLevel; onContinue: () => void }) => {
    const levelsPercent = Math.min(100, (result.levels_completed / Math.max(1, result.unlock_min_levels)) * 100);
    const correctPercent = Math.min(100, (result.unique_correct / Math.max(1, result.unlock_min_correct)) * 100);
    const levelsLeft = Math.max(0, result.unlock_min_levels - result.levels_completed);
    const correctLeft = Math.max(0, result.unlock_min_correct - result.unique_correct);
    return <section className="relative mx-auto min-h-[calc(100vh-5rem)] max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#073c43] text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/games/trivia-go/aventura-sabores-cali-game-map-v4.webp')] bg-cover bg-bottom opacity-35" />
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
