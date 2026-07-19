import React, { useEffect, useState } from 'react';
import { dailyService, DailyQuestionData, DailyAnswerResult } from '../../services/daily.service';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CalendarDays, Flame, Check, X, Share2, Loader2, AlertTriangle, Coins, Gem } from 'lucide-react';
import { toast } from 'sonner';

const optionValue = (opt: any): string => (typeof opt === 'string' ? opt : (opt?.label ?? String(opt)));
const asText = (v: any): string => (v == null ? '' : (typeof v === 'string' ? v : String(v)));

export const DailyQuestion: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [data, setData] = useState<DailyQuestionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answering, setAnswering] = useState(false);
    const [result, setResult] = useState<DailyAnswerResult | null>(null);
    const [picked, setPicked] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try { setData(await dailyService.getDaily()); }
            catch (e: any) {
                const m = String(e?.message || '');
                setError(m.includes('AUTH_REQUIRED') ? 'Inicia sesión para responder la pregunta del día.'
                    : m.includes('NO_QUESTIONS') ? 'Aún no hay pregunta del día disponible.'
                    : 'No se pudo cargar la pregunta del día.');
            }
            finally { setLoading(false); }
        })();
    }, []);

    const resolved = !!result || !!data?.answered;

    const answer = async (opt: string) => {
        if (answering || resolved) return;
        setPicked(opt); setAnswering(true);
        try { setResult(await dailyService.answerDaily(opt)); }
        catch { toast.error('No se pudo registrar tu respuesta.'); setPicked(null); }
        finally { setAnswering(false); }
    };

    const streak = result?.streak ?? data?.streak ?? 0;

    const share = async () => {
        const text = `Respondí la Pregunta del día en Andanzas GO 🎯 — racha de ${streak} día${streak === 1 ? '' : 's'} 🔥 ¡Jugá vos también!`;
        try {
            if (navigator.share) await navigator.share({ title: 'Andanzas GO', text, url: window.location.origin });
            else { await navigator.clipboard.writeText(`${text}\n\n${window.location.origin}`); toast.success('¡Copiado!'); }
        } catch { /* cancelado */ }
    };

    const review = result
        ? { selected: picked, correct_answer: result.correct_answer, is_correct: !!result.is_correct, explanation: result.explanation }
        : data?.review;
    const options: any[] = Array.isArray(data?.question?.options) ? data!.question.options : [];
    const correctVal = review ? asText(review.correct_answer) : null;

    return (
        <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
            <DialogContent className="sm:max-w-[520px] max-h-[88vh] overflow-y-auto rounded-3xl border border-primary/10 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-lg font-extrabold tracking-tight">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                            <CalendarDays className="h-5 w-5" />
                        </span>
                        Pregunta del día
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : error || !data ? (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                        <AlertTriangle className="h-10 w-10 text-orange-500" />
                        <p className="font-medium">{error || 'Sin datos.'}</p>
                        <Button className="rounded-xl" onClick={onClose}>Volver</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            {data.question?.category ? <span className="text-xs font-semibold uppercase tracking-wider text-primary">{data.question.category}</span> : <span />}
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-500"><Flame className="h-3.5 w-3.5" /> Racha {streak}</span>
                        </div>

                        <h2 className="text-lg font-bold leading-snug">{data.question?.question_text}</h2>

                        <div className="space-y-2.5">
                            {options.map((opt, idx) => {
                                const val = optionValue(opt);
                                const isCorrect = resolved && correctVal === val;
                                const isWrongPick = resolved && review?.selected === val && !review?.is_correct;
                                const imageUrl = typeof opt === 'object' && opt?.image_url ? opt.image_url : null;
                                return (
                                    <button
                                        key={idx}
                                        disabled={resolved || answering}
                                        onClick={() => answer(val)}
                                        className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors disabled:cursor-default ${
                                            isCorrect ? 'border-green-500 bg-green-500/10'
                                            : isWrongPick ? 'border-red-500 bg-red-500/10'
                                            : (answering && picked === val) ? 'border-primary bg-primary/10'
                                            : 'border-border bg-card hover:bg-muted/50 disabled:opacity-70'}`}
                                    >
                                        {imageUrl && <img src={imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" />}
                                        <span className="flex-1 text-sm font-medium">{val}</span>
                                        {isCorrect && <Check className="h-5 w-5 shrink-0 text-green-600" />}
                                        {isWrongPick && <X className="h-5 w-5 shrink-0 text-red-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        {resolved && (
                            <div className="space-y-3 pt-1">
                                <div className={`rounded-2xl p-3 text-center text-sm font-semibold ${review?.is_correct ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                                    {review?.is_correct ? '¡Correcto! 🎉' : 'Casi… la respuesta correcta está marcada.'}
                                </div>
                                {result?.reward && (
                                    <div className="flex items-center justify-center gap-5 font-bold">
                                        <span className="flex items-center gap-1.5 text-amber-500"><Coins className="h-5 w-5" /> +{result.reward.coins}</span>
                                        {result.reward.gems > 0 && <span className="flex items-center gap-1.5 text-fuchsia-500"><Gem className="h-5 w-5" /> +{result.reward.gems}</span>}
                                    </div>
                                )}
                                {result?.reward && result.reward.weekly_bonus > 0 && (
                                    <p className="text-center text-xs font-medium text-amber-600 dark:text-amber-400">🔥 ¡Bonus semanal! +{result.reward.weekly_bonus} monedas.</p>
                                )}
                                {review?.explanation && <p className="text-sm italic text-muted-foreground">{review.explanation}</p>}
                                <p className="text-center text-xs text-muted-foreground">Ya respondiste hoy. ¡Vuelve mañana para tu racha! 🔥</p>
                                <Button className="w-full rounded-xl" onClick={share}><Share2 className="mr-2 h-4 w-4" /> Compartir (sin spoiler)</Button>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
