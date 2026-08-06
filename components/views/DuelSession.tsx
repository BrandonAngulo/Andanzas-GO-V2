import React, { useState } from 'react';
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    Clock,
    TimerOff,
    Loader2,
    Share2,
    Swords,
    Timer,
    Trophy,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDuelEngine } from '../../hooks/useDuelEngine';
import { challengeService, type DuelPlay, type DuelRunResult } from '../../services/challenge.service';
import { Button } from '../ui/button';

interface Props {
    play: DuelPlay;
    role: 'challenger' | 'rival';
    onExit: (submitted: boolean, result?: DuelRunResult | null) => void;
}

const optionValue = (option: any): string => typeof option === 'string' ? option : (option?.label ?? String(option));
const asText = (value: any): string => value == null ? '' : (typeof value === 'string' ? value : String(value));
const fmtSecs = (ms: number) => `${Math.round((ms || 0) / 1000)}s`;

export const DuelSession: React.FC<Props> = ({ play, role, onExit }) => {
    const engine = useDuelEngine(play);
    const [confirmExit, setConfirmExit] = useState(false);

    const options: any[] = Array.isArray(engine.question?.options) ? engine.question.options : [];
    const perQSecs = Math.ceil(engine.perQMs / 1000);
    const matchSecs = Math.ceil(engine.matchMs / 1000);
    const matchPct = Math.max(0, Math.min(100, (engine.matchMs / engine.matchTotal) * 100));
    const perQPct = Math.max(0, Math.min(100, (engine.perQMs / engine.perQTotal) * 100));
    const shareLink = `${window.location.origin}/#/challenge/${play.challenge_id}`;
    const timedOut = engine.endReason === 'question_timeout' || engine.endReason === 'round_timeout';

    const doAbandon = async () => {
        setConfirmExit(false);
        if (role === 'challenger') {
            try { await challengeService.cancelDuel(play.challenge_id); } catch { /* el cierre local sigue disponible */ }
            onExit(false, null);
            return;
        }
        engine.forfeit();
    };

    if (engine.phase === 'review') {
        const review = engine.review;
        const resolved = !!engine.result?.resolved;
        const abandoned = engine.endReason === 'abandoned';
        return <div className="fixed inset-0 z-[10050] overflow-y-auto bg-gradient-to-b from-violet-50 to-white text-slate-900" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="mx-auto w-full max-w-xl space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between"><button type="button" onClick={() => onExit(true, engine.result)} className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow" aria-label="Volver a Juegos"><ArrowLeft className="h-5 w-5" /></button><span className="text-[9px] font-black uppercase tracking-[0.18em] text-violet-700">Resultado del duelo</span><button type="button" onClick={() => onExit(true, engine.result)} className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow" aria-label="Cerrar resultado"><X className="h-5 w-5" /></button></div>
                <div className="text-center">
                    <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${timedOut || abandoned ? 'bg-red-100 text-red-600' : 'bg-violet-100 text-violet-700'}`}>{timedOut || abandoned ? <TimerOff className="h-8 w-8" /> : <Trophy className="h-8 w-8" />}</div>
                    <h1 className="text-2xl font-extrabold">{abandoned ? 'Abandonaste el duelo' : timedOut ? 'Se agotó el tiempo' : '¡Terminaste tu duelo!'}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{timedOut ? 'No responder a tiempo termina tu ronda y queda registrado como derrota por tiempo.' : abandoned ? 'Tu salida quedó registrada como abandono.' : review ? <>Acertaste <b>{review.correct}/{review.total}</b> · {review.score} pts · {fmtSecs(review.time_ms)}</> : 'Resultado enviado.'}</p>
                    {(timedOut || abandoned) && review ? <p className="mt-1 text-xs font-semibold text-slate-600">Antes de terminar: {review.correct}/{review.total} aciertos · {review.score} pts</p> : null}
                </div>

                {role === 'challenger' ? <div className="space-y-2 rounded-2xl border bg-white p-3 text-center shadow-sm">
                    {resolved ? <p className="text-sm">Tu rival ya jugó. <button className="font-semibold text-violet-700 underline" onClick={() => { window.location.hash = `#/challenge/${play.challenge_id}/verdict`; }}>Ver resultado</button></p> : <><p className="text-sm font-medium">Comparte el enlace para que tu rival juegue el mismo conjunto.</p><Button className="h-10 w-full rounded-xl bg-violet-600 hover:bg-violet-500" onClick={async () => { try { await navigator.clipboard.writeText(shareLink); toast.success('Enlace copiado'); } catch { toast.error('No se pudo copiar'); } }}><Share2 className="mr-2 h-4 w-4" /> Copiar enlace del reto</Button></>}
                </div> : null}

                {role === 'rival' && resolved ? <Button className="h-11 w-full rounded-xl bg-violet-600 font-bold hover:bg-violet-500" onClick={() => { window.location.hash = `#/challenge/${play.challenge_id}/verdict`; }}><Trophy className="mr-2 h-4 w-4" /> Ver resultado del duelo</Button> : null}

                {review?.review?.length ? <div className="space-y-2"><h2 className="font-bold">Repaso</h2>{review.review.map((item, index) => <div key={item.question_id} className={`rounded-xl border p-3 ${item.is_correct ? 'border-green-500/30 bg-green-50' : 'border-red-500/30 bg-red-50'}`}><div className="flex items-start gap-2">{item.is_correct ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}<div className="min-w-0 flex-1"><p className="text-sm font-semibold">{index + 1}. {item.question_text}</p>{!item.is_correct ? <p className="mt-1 text-xs text-muted-foreground">Tu respuesta: {item.selected ? asText(item.selected) : 'Sin respuesta'}</p> : null}<p className="mt-1 text-xs"><span className="text-muted-foreground">Correcta:</span> <b>{asText(item.correct_answer)}</b></p>{item.explanation ? <p className="mt-1.5 text-xs italic text-muted-foreground">{item.explanation}</p> : null}</div></div></div>)}</div> : null}

                <Button variant="outline" className="h-11 w-full rounded-xl" onClick={() => onExit(true, engine.result)}>Volver a Juegos</Button>
            </div>
        </div>;
    }

    if (engine.phase === 'submitting') {
        return <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-white"><div className="flex flex-col items-center gap-3 text-muted-foreground"><Loader2 className="h-10 w-10 animate-spin text-violet-600" /><p className="font-medium">Registrando tu resultado…</p></div></div>;
    }

    if (engine.phase === 'error') {
        return <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-white p-4"><div className="w-full max-w-sm space-y-4 rounded-2xl border bg-card p-6 text-center shadow-xl"><AlertTriangle className="mx-auto h-10 w-10 text-orange-500" /><p className="font-medium">{engine.error}</p><div className="flex gap-2"><Button className="flex-1 rounded-xl" onClick={() => engine.retrySubmit()}>Reintentar</Button><Button variant="outline" className="flex-1 rounded-xl" onClick={() => onExit(false, null)}>Salir</Button></div></div></div>;
    }

    return <div className="fixed inset-0 z-[10050] flex flex-col overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(124,58,237,0.1),transparent_30%),linear-gradient(to_bottom,#f8fafc,#ffffff)] text-slate-900">
        <header className="relative z-30 shrink-0 border-b bg-white/95 px-3 pb-2 shadow-sm backdrop-blur" style={{ paddingTop: 'max(env(safe-area-inset-top), 0.5rem)' }}>
            <div className="mx-auto max-w-3xl">
                <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
                    <button type="button" onClick={() => setConfirmExit(true)} className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm" aria-label="Volver y salir del duelo"><ArrowLeft className="h-5 w-5" /></button>
                    <div className="text-center"><p className="text-[8px] font-black uppercase tracking-[0.18em] text-violet-700">TRIVIA GO · Duelo</p><p className="text-sm font-black">Pregunta {engine.index + 1} de {engine.total}</p></div>
                    <button type="button" onClick={() => setConfirmExit(true)} className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm" aria-label="Cerrar duelo"><X className="h-5 w-5" /></button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <TimerBar icon={<Clock />} label="Partida" seconds={matchSecs} percent={matchPct} critical={matchSecs <= 20} color="violet" />
                    <TimerBar icon={<Timer />} label="Pregunta" seconds={perQSecs} percent={perQPct} critical={perQSecs <= 5} color="amber" />
                </div>
            </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
            <div className="mx-auto max-w-3xl">
                <div className="mb-2 flex items-center justify-between gap-2">{engine.question?.category ? <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-violet-700">{engine.question.category}</span> : <span />}{engine.locked && !engine.endReason ? <span className="text-[10px] font-semibold text-emerald-600">Respuesta registrada</span> : null}</div>
                <h2 className="mb-4 text-lg font-black leading-snug sm:text-2xl">{engine.question?.question_text}</h2>
                <div className="grid gap-2 sm:grid-cols-2">{options.map((option, index) => {
                    const value = optionValue(option);
                    const picked = engine.locked && engine.selected === value;
                    const imageUrl = typeof option === 'object' && option?.image_url ? option.image_url : null;
                    return <button key={index} type="button" disabled={engine.locked} onClick={() => engine.selectAnswer(value)} className={`flex min-h-[4rem] w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all disabled:opacity-70 ${picked ? 'border-violet-500 bg-violet-50 shadow-md' : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm'}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-700">{String.fromCharCode(65 + index)}</span>{imageUrl ? <img src={imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" /> : null}<span className="font-medium">{value}</span></button>;
                })}</div>
                {engine.endReason ? <div role="alert" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600"><TimerOff className="h-5 w-5" /> {engine.endReason === 'abandoned' ? 'Abandonaste la ronda.' : 'Tiempo agotado. El duelo termina aquí.'}</div> : null}
            </div>
        </main>

        {confirmExit ? <div className="fixed inset-0 z-[10060] flex items-center justify-center bg-black/55 p-4" onClick={() => setConfirmExit(false)}><div role="dialog" aria-modal="true" aria-labelledby="duel-exit-title" className="w-full max-w-sm space-y-4 rounded-2xl border bg-white p-5 text-center shadow-2xl" onClick={event => event.stopPropagation()}><AlertTriangle className="mx-auto h-9 w-9 text-orange-500" /><div><p id="duel-exit-title" className="font-bold">¿Salir del duelo?</p><p className="mt-1 text-sm text-muted-foreground">{role === 'challenger' ? 'El reto se cancelará y no contará como jugado.' : 'Salir ahora cuenta como abandono y perderás esta ronda.'}</p></div><div className="flex gap-2"><Button variant="outline" className="flex-1 rounded-xl" onClick={() => setConfirmExit(false)}>Seguir jugando</Button><Button className="flex-1 rounded-xl bg-red-500 text-white hover:bg-red-600" onClick={doAbandon}>{role === 'challenger' ? 'Cancelar reto' : 'Salir y perder'}</Button></div></div></div> : null}
    </div>;
};

const TimerBar = ({ icon, label, seconds, percent, critical, color }: { icon: React.ReactNode; label: string; seconds: number; percent: number; critical: boolean; color: 'violet' | 'amber' }) => <div className="rounded-xl border bg-slate-50 px-2.5 py-2"><div className="flex items-center justify-between text-[9px]"><span className="flex items-center gap-1 font-bold text-slate-500 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}{label}</span><strong aria-live="off" className={critical ? 'text-red-600' : 'text-slate-800'}>{seconds}s</strong></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className={`h-full transition-[width] duration-200 ${critical ? 'bg-red-500' : color === 'violet' ? 'bg-violet-600' : 'bg-amber-500'}`} style={{ width: `${percent}%` }} /></div></div>;
