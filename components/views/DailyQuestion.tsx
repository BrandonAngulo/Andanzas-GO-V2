import React, { useEffect, useState } from 'react';
import { dailyService, DailyQuestionData, DailyAnswerResult } from '../../services/daily.service';
import { Button } from '../ui/button';
import { CalendarDays, Flame, Check, X, Share2, Loader2, AlertTriangle } from 'lucide-react';
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
            catch (e: any) { setError(String(e?.message || '').includes('NO_QUESTIONS') ? 'Aún no hay pregunta del día disponible.' : 'No se pudo cargar la pregunta del día.'); }
            finally { setLoading(false); }
        })();
    }, []);

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

    if (loading) {
        return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }
    if (error || !data) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
                    <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto" />
                    <p className="font-medium">{error || 'Sin datos.'}</p>
                    <Button className="w-full rounded-xl" onClick={onClose}>Volver</Button>
                </div>
            </div>
        );
    }

    const resolved = !!result || !!data.answered;
    const review = result
        ? { selected: picked, correct_answer: result.correct_answer, is_correct: !!result.is_correct, explanation: result.explanation }
        : data.review;
    const options: any[] = Array.isArray(data.question?.options) ? data.question.options : [];
    const correctVal = review ? asText(review.correct_answer) : null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background overflow-y-auto">
            <div className="max-w-lg mx-auto w-full p-4 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold"><CalendarDays className="w-5 h-5 text-primary" /> Pregunta del día</div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-500"><Flame className="w-4 h-4" /> {streak}</div>
                </div>

                {data.question?.category && <div className="text-xs uppercase tracking-wider text-primary font-semibold">{data.question.category}</div>}
                <h2 className="text-xl font-bold">{data.question?.question_text}</h2>

                <div className="space-y-3">
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
                                className={`w-full text-left rounded-2xl border-2 p-4 transition-colors flex items-center gap-3 disabled:cursor-default ${
                                    isCorrect ? 'border-green-500 bg-green-500/10'
                                    : isWrongPick ? 'border-red-500 bg-red-500/10'
                                    : (answering && picked === val) ? 'border-primary bg-primary/10'
                                    : 'border-border bg-card hover:bg-muted/40 disabled:opacity-70'}`}
                            >
                                {imageUrl && <img src={imageUrl} alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0" />}
                                <span className="font-medium flex-1">{val}</span>
                                {isCorrect && <Check className="w-5 h-5 text-green-600" />}
                                {isWrongPick && <X className="w-5 h-5 text-red-500" />}
                            </button>
                        );
                    })}
                </div>

                {resolved && (
                    <div className="space-y-4">
                        <div className={`rounded-2xl p-4 text-center font-semibold ${review?.is_correct ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                            {review?.is_correct ? '¡Correcto! 🎉' : 'Casi… la respuesta correcta está marcada.'}
                        </div>
                        {review?.explanation && <p className="text-sm text-muted-foreground italic">{review.explanation}</p>}
                        <p className="text-center text-sm text-muted-foreground">Ya respondiste hoy. ¡Vuelve mañana para mantener tu racha! 🔥</p>
                        <Button className="w-full rounded-xl" onClick={share}><Share2 className="w-4 h-4 mr-2" /> Compartir (sin spoiler)</Button>
                        <Button variant="outline" className="w-full rounded-xl" onClick={onClose}>Cerrar</Button>
                    </div>
                )}

                {!resolved && (
                    <button className="text-sm text-muted-foreground hover:text-foreground w-full text-center pt-2" onClick={onClose}>Ahora no</button>
                )}
            </div>
        </div>
    );
};
