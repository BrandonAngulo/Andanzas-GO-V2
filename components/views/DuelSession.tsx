import React, { useState } from 'react';
import { useDuelEngine } from '../../hooks/useDuelEngine';
import { challengeService, DuelPlay, DuelRunResult } from '../../services/challenge.service';
import { Button } from '../ui/button';
import { Swords, Clock, Timer, Check, X, Share2, Trophy, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    play: DuelPlay;
    role: 'challenger' | 'rival';
    onExit: (submitted: boolean, result?: DuelRunResult | null) => void;
}

// Valor comparable de una opción (multiple_choice = string; image_choice = objeto con label).
const optionValue = (opt: any): string => (typeof opt === 'string' ? opt : (opt?.label ?? String(opt)));
const asText = (v: any): string => (v == null ? '' : (typeof v === 'string' ? v : String(v)));
const fmtSecs = (ms: number) => `${Math.round((ms || 0) / 1000)}s`;

export const DuelSession: React.FC<Props> = ({ play, role, onExit }) => {
    const eng = useDuelEngine(play);
    const [confirmExit, setConfirmExit] = useState(false);

    const options: any[] = Array.isArray(eng.question?.options) ? eng.question!.options : [];
    const perQSecs = Math.ceil(eng.perQMs / 1000);
    const matchSecs = Math.ceil(eng.matchMs / 1000);
    const matchPct = Math.max(0, Math.min(100, (eng.matchMs / eng.matchTotal) * 100));
    const perQPct = Math.max(0, Math.min(100, (eng.perQMs / eng.perQTotal) * 100));

    const shareLink = `${window.location.origin}/#/challenge/${play.challenge_id}`;

    const doAbandon = async () => {
        if (role === 'challenger') { try { await challengeService.cancelDuel(play.challenge_id); } catch { /* noop */ } }
        onExit(false, null);
    };

    // ---- Cierre / review ----
    if (eng.phase === 'review') {
        const r = eng.review;
        const resolved = !!eng.result?.resolved;
        return (
            <div className="fixed inset-0 z-[100] flex flex-col bg-background overflow-y-auto">
                <div className="max-w-xl mx-auto w-full p-4 sm:p-8 space-y-6">
                    <div className="text-center pt-4">
                        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Trophy className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-2xl font-extrabold">¡Terminaste tu duelo!</h1>
                        <p className="text-muted-foreground mt-2">
                            {r ? <>Acertaste <b>{r.correct}/{r.total}</b> · {r.score} pts · {fmtSecs(r.time_ms)}</> : 'Resultado enviado.'}
                        </p>
                    </div>

                    {role === 'challenger' && (
                        <div className="bg-muted/40 border border-border rounded-2xl p-4 text-center space-y-3">
                            {resolved ? (
                                <p className="text-sm">Tu rival ya había jugado. <button className="text-primary font-semibold underline" onClick={() => { window.location.hash = `#/challenge/${play.challenge_id}/verdict`; }}>Ver resultado</button></p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium">¡Enlace listo! Compártelo con tu rival para que juegue el mismo set.</p>
                                    <Button className="w-full rounded-xl" onClick={async () => { try { await navigator.clipboard.writeText(shareLink); toast.success('Enlace copiado'); } catch { toast.error('No se pudo copiar'); } }}>
                                        <Share2 className="w-4 h-4 mr-2" /> Copiar enlace del reto
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    {role === 'rival' && resolved && (
                        <Button className="w-full rounded-xl h-12 font-bold" onClick={() => { window.location.hash = `#/challenge/${play.challenge_id}/verdict`; }}>
                            <Trophy className="w-4 h-4 mr-2" /> Ver resultado del duelo
                        </Button>
                    )}

                    {r && r.review?.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="font-bold text-lg">Repaso</h2>
                            {r.review.map((item, i) => (
                                <div key={item.question_id} className={`rounded-2xl border p-4 ${item.is_correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                    <div className="flex items-start gap-2">
                                        {item.is_correct ? <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> : <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{i + 1}. {item.question_text}</p>
                                            {!item.is_correct && (
                                                <p className="text-xs text-muted-foreground mt-1">Tu respuesta: {item.selected ? asText(item.selected) : '—'}</p>
                                            )}
                                            <p className="text-xs mt-1"><span className="text-muted-foreground">Correcta:</span> <b>{asText(item.correct_answer)}</b></p>
                                            {item.explanation && <p className="text-xs text-muted-foreground mt-2 italic">{item.explanation}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button variant="outline" className="w-full rounded-xl h-12" onClick={() => onExit(true, eng.result)}>Volver a Juegos</Button>
                </div>
            </div>
        );
    }

    if (eng.phase === 'submitting') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-medium">Enviando tu duelo…</p>
                </div>
            </div>
        );
    }

    if (eng.phase === 'error') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
                <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
                    <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto" />
                    <p className="font-medium">{eng.error}</p>
                    <div className="flex gap-2">
                        <Button className="flex-1 rounded-xl" onClick={() => eng.retrySubmit()}>Reintentar</Button>
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onExit(false, null)}>Salir</Button>
                    </div>
                </div>
            </div>
        );
    }

    // ---- Jugando ----
    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background">
            {/* Encabezado con relojes */}
            <div className="p-4 border-b border-border space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold"><Swords className="w-5 h-5 text-primary" /> Duelo</div>
                    <div className="text-sm text-muted-foreground">{eng.index + 1} / {eng.total}</div>
                    <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setConfirmExit(true)}>Salir</button>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3.5 h-3.5" /> Partida</span>
                        <span className={matchSecs <= 20 ? 'text-red-500 font-bold' : 'font-medium'}>{matchSecs}s</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary transition-[width] duration-200" style={{ width: `${matchPct}%` }} /></div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground"><Timer className="w-3.5 h-3.5" /> Pregunta</span>
                        <span className={perQSecs <= 5 ? 'text-red-500 font-bold' : 'font-medium'}>{perQSecs}s</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full transition-[width] duration-200 ${perQSecs <= 5 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${perQPct}%` }} /></div>
                </div>
            </div>

            {/* Pregunta + opciones */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-lg mx-auto">
                    {eng.question?.category && <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">{eng.question.category}</div>}
                    <h2 className="text-xl font-bold mb-6">{eng.question?.question_text}</h2>
                    <div className="space-y-3">
                        {options.map((opt, idx) => {
                            const val = optionValue(opt);
                            const isPicked = eng.locked && eng.selected === val;
                            const imageUrl = typeof opt === 'object' && opt?.image_url ? opt.image_url : null;
                            return (
                                <button
                                    key={idx}
                                    disabled={eng.locked}
                                    onClick={() => eng.selectAnswer(val)}
                                    className={`w-full text-left rounded-2xl border-2 p-4 transition-colors flex items-center gap-3 disabled:opacity-70 ${isPicked ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted/40'}`}
                                >
                                    {imageUrl && <img src={imageUrl} alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0" />}
                                    <span className="font-medium">{val}</span>
                                </button>
                            );
                        })}
                    </div>
                    {eng.locked && <p className="text-center text-sm text-muted-foreground mt-6">Respuesta registrada…</p>}
                </div>
            </div>

            {confirmExit && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmExit(false)}>
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
                        <p className="font-semibold">¿Abandonar el duelo?</p>
                        <p className="text-sm text-muted-foreground">Si sales ahora, el duelo termina y no cuenta como jugado.</p>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setConfirmExit(false)}>Seguir jugando</Button>
                            <Button className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white" onClick={doAbandon}>Abandonar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
