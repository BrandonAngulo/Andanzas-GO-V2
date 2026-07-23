import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { LazyImage } from '../ui/lazy-image';
import { Check, X as XIcon, ArrowRight } from 'lucide-react';
import { GameQuestion } from '../../services/games.service';
import { deriveOptionPalette } from './colorUtils';

// Cada opción se identifica por una forma + color fija (no solo una letra), para que el jugador
// la reconozca de un vistazo, al estilo de los mejores juegos de trivia — sin copiar ninguno en particular.
const ShapeIcon: React.FC<{ shapeIndex: number; color: string; size?: number }> = ({ shapeIndex, color, size = 20 }) => {
    const shapes = [
        <circle cx="12" cy="12" r="9" />,
        <polygon points="12,3 21,19 3,19" />,
        <rect x="4" y="4" width="16" height="16" rx="3" />,
        <polygon points="12,2 21,7.5 21,16.5 12,22 3,16.5 3,7.5" />,
    ];
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            {shapes[shapeIndex % shapes.length]}
        </svg>
    );
};

interface QuestionRendererProps {
    question: GameQuestion;
    gameType?: string; // 'quiz' no tiene respuesta correcta/incorrecta
    isChecking: boolean;      // true una vez el usuario ya respondió (o hubo timeout)
    hasTimedOut: boolean;
    selectedAnswer: any;      // la respuesta que efectivamente se envió al motor (null mientras no se ha respondido)
    onSubmit: (answer: any) => void; // dispara la respuesta hacia el motor de juego
    accent?: string; // color de acento del tema del juego, en hex (ej. "#E85D2A")
}

// Etiqueta de encabezado según la variante cosmética (question_format) de una pregunta multiple_choice.
const formatLabel = (q: GameQuestion): string | null => {
    switch (q.question_format) {
        case 'true_false': return 'Verdadero o falso';
        case 'fill_blank': return 'Completa la frase';
        case 'elimination': return '¿Cuál no pertenece?';
        default: return null;
    }
};

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, gameType, isChecking, hasTimedOut, selectedAnswer, onSubmit, accent }) => {
    // Estado local de "borrador" para los tipos que requieren construir la respuesta antes de confirmarla
    const [draftMulti, setDraftMulti] = useState<string[]>([]);
    const [draftOrder, setDraftOrder] = useState<string[]>([]);
    const [draftMatch, setDraftMatch] = useState<Record<string, string>>({});
    const [activeLeft, setActiveLeft] = useState<string | null>(null);

    // Reinicia el borrador cada vez que cambia la pregunta
    useEffect(() => {
        setDraftMulti([]);
        setDraftOrder([]);
        setDraftMatch({});
        setActiveLeft(null);
    }, [question?.id]);

    const label = formatLabel(question);

    const stateClassFor = (isThisCorrect: boolean, isThisSelected: boolean) => {
        if (!isChecking || hasTimedOut) {
            if (hasTimedOut && isChecking && isThisCorrect) return "bg-emerald-500/20 border-emerald-500 text-emerald-400";
            return isThisSelected
                ? "bg-white/10 border-white/30 text-white"
                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90";
        }
        if (gameType === 'quiz') {
            return isThisSelected ? "bg-primary/20 border-primary text-primary" : "opacity-30 border-white/5 text-white/90";
        }
        if (isThisCorrect) return "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
        if (isThisSelected) return "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
        return "opacity-30 border-white/5 text-white/90";
    };

    // ---------- multiple_choice (incluye true_false / fill_blank / elimination, que son solo variantes de copy) ----------
    if (question.question_type === 'multiple_choice') {
        const palette = deriveOptionPalette(accent);
        return (
            <div className="w-full">
                {label && <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-widest text-white/40">{label}</p>}
                <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                    {question.options.map((opt: string, idx: number) => (
                        <Button
                            key={idx}
                            variant="outline"
                            className={`h-auto w-full justify-start rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-300 ${stateClassFor(opt === question.correct_answer, opt === selectedAnswer)} ${!isChecking ? 'hover:scale-[1.01]' : ''}`}
                            onClick={() => !isChecking && onSubmit(opt)}
                            disabled={isChecking}
                        >
                            <span className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                                <ShapeIcon shapeIndex={idx} color={palette[idx % palette.length]} size={18} />
                            </span>
                            <span className="whitespace-normal text-sm font-semibold sm:text-base">{opt}</span>
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    // ---------- image_choice ----------
    if (question.question_type === 'image_choice') {
        const opts: { label: string; image_url: string }[] = question.options || [];
        return (
            <div className="w-full">
                <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-4 lg:gap-5">
                    {opts.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => !isChecking && onSubmit(opt.label)}
                            disabled={isChecking}
                            className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 aspect-square ${stateClassFor(opt.label === question.correct_answer, opt.label === selectedAnswer)} ${!isChecking ? 'hover:scale-[1.02]' : ''}`}
                        >
                            <LazyImage src={opt.image_url} alt={opt.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-2 py-1.5 backdrop-blur-sm sm:px-3 sm:py-2">
                                <span className="text-xs font-bold text-white sm:text-sm">{opt.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ---------- multi_select ----------
    if (question.question_type === 'multi_select') {
        const opts: string[] = question.options || [];
        const correctSet: string[] = Array.isArray(question.correct_answer) ? question.correct_answer : [];
        const submittedSet: string[] = Array.isArray(selectedAnswer) ? selectedAnswer : [];
        const palette = deriveOptionPalette(accent);

        const toggle = (opt: string) => {
            if (isChecking) return;
            setDraftMulti(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
        };

        return (
            <div className="w-full">
                <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-widest text-white/40">Selecciona todas las que correspondan</p>
                <div className="mb-4 grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                    {opts.map((opt, idx) => {
                        const isSelected = isChecking ? submittedSet.includes(opt) : draftMulti.includes(opt);
                        return (
                            <Button
                                key={idx}
                                variant="outline"
                                className={`h-auto w-full justify-start rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-300 ${stateClassFor(correctSet.includes(opt), isSelected)}`}
                                onClick={() => toggle(opt)}
                                disabled={isChecking}
                            >
                                <span className="relative mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                                    <ShapeIcon shapeIndex={idx} color={palette[idx % palette.length]} size={18} />
                                    {isSelected && (
                                        <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                                            <Check className="w-3 h-3 text-slate-900" />
                                        </span>
                                    )}
                                </span>
                                <span className="whitespace-normal text-sm font-semibold sm:text-base">{opt}</span>
                            </Button>
                        );
                    })}
                </div>
                {!isChecking && (
                    <Button
                        className="h-11 w-full rounded-xl border-none bg-white font-bold text-slate-900 shadow-lg hover:bg-white/90"
                        disabled={draftMulti.length === 0}
                        onClick={() => onSubmit(draftMulti)}
                    >
                        Confirmar respuesta
                    </Button>
                )}
            </div>
        );
    }

    // ---------- ordering ----------
    if (question.question_type === 'ordering') {
        const pool: string[] = question.options || [];
        const correctOrder: string[] = Array.isArray(question.correct_answer) ? question.correct_answer : [];
        const submittedOrder: string[] = Array.isArray(selectedAnswer) ? selectedAnswer : [];
        const remaining = pool.filter(item => !draftOrder.includes(item));
        const displayOrder = isChecking ? submittedOrder : draftOrder;

        const addToOrder = (item: string) => {
            if (isChecking) return;
            setDraftOrder(prev => [...prev, item]);
        };
        const removeFromOrder = (idx: number) => {
            if (isChecking) return;
            setDraftOrder(prev => prev.filter((_, i) => i !== idx));
        };

        return (
            <div className="w-full">
                <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-4">Tocá los elementos en el orden correcto</p>

                <div className="w-full min-h-[64px] rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-3 mb-4 flex flex-wrap gap-2">
                    {displayOrder.length === 0 && <span className="text-white/30 text-sm px-2 py-2">Tu orden aparecerá aquí…</span>}
                    {displayOrder.map((item, idx) => {
                        const isRight = isChecking && correctOrder[idx] === item;
                        const isWrong = isChecking && correctOrder[idx] !== item;
                        return (
                            <button
                                key={`${item}-${idx}`}
                                onClick={() => removeFromOrder(idx)}
                                disabled={isChecking}
                                className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm flex items-center gap-2 ${isRight ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : isWrong ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/10 border-white/20 text-white'}`}
                            >
                                <span className="opacity-60">{idx + 1}.</span> {item}
                            </button>
                        );
                    })}
                </div>

                {!isChecking && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {remaining.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => addToOrder(item)}
                                className="px-4 py-2 rounded-xl border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white/90 font-semibold text-sm transition-all"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}

                {!isChecking && (
                    <Button
                        className="h-11 w-full rounded-xl border-none bg-white font-bold text-slate-900 shadow-lg hover:bg-white/90"
                        disabled={remaining.length > 0}
                        onClick={() => onSubmit(draftOrder)}
                    >
                        Confirmar orden
                    </Button>
                )}
            </div>
        );
    }

    // ---------- matching ----------
    if (question.question_type === 'matching') {
        const left: string[] = question.options?.left || [];
        const right: string[] = question.options?.right || [];
        const correctMap: Record<string, string> = (question.correct_answer && typeof question.correct_answer === 'object') ? question.correct_answer : {};
        const submittedMap: Record<string, string> = (selectedAnswer && typeof selectedAnswer === 'object') ? selectedAnswer : {};
        const activeMap = isChecking ? submittedMap : draftMatch;
        const pairedRightValues = Object.values(activeMap);

        const handleLeftTap = (item: string) => {
            if (isChecking) return;
            setActiveLeft(item);
        };
        const handleRightTap = (item: string) => {
            if (isChecking || !activeLeft) return;
            setDraftMatch(prev => ({ ...prev, [activeLeft]: item }));
            setActiveLeft(null);
        };
        const clearPair = (item: string) => {
            if (isChecking) return;
            setDraftMatch(prev => {
                const next = { ...prev };
                delete next[item];
                return next;
            });
        };

        return (
            <div className="w-full">
                <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-4">
                    {activeLeft ? `Ahora tocá la pareja de "${activeLeft}"` : 'Tocá un elemento de la izquierda y luego su pareja'}
                </p>
                <div className="mb-5 grid w-full grid-cols-2 gap-2 sm:mb-6 sm:gap-4">
                    <div className="space-y-2">
                        {left.map((item, idx) => {
                            const paired = activeMap[item];
                            const isRight = isChecking && correctMap[item] === paired;
                            const isWrong = isChecking && paired && correctMap[item] !== paired;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => paired ? clearPair(item) : handleLeftTap(item)}
                                    disabled={isChecking}
                                    className={`w-full rounded-xl border-2 px-2.5 py-3 text-left text-xs font-semibold transition-all sm:px-4 sm:text-sm ${activeLeft === item ? 'bg-primary/20 border-primary text-primary' : isRight ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : isWrong ? 'bg-red-500/20 border-red-500 text-red-400' : paired ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}
                                >
                                    {item}
                                    {paired && <span className="block text-xs opacity-60 mt-1">→ {paired}</span>}
                                </button>
                            );
                        })}
                    </div>
                    <div className="space-y-2">
                        {right.map((item, idx) => {
                            const isUsed = pairedRightValues.includes(item);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleRightTap(item)}
                                    disabled={isChecking || isUsed || !activeLeft}
                                    className={`w-full rounded-xl border-2 px-2.5 py-3 text-left text-xs font-semibold transition-all sm:px-4 sm:text-sm ${isUsed ? 'opacity-40 bg-white/5 border-white/10 text-white/60' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {!isChecking && (
                    <Button
                        className="h-11 w-full rounded-xl border-none bg-white font-bold text-slate-900 shadow-lg hover:bg-white/90"
                        disabled={Object.keys(draftMatch).length < left.length}
                        onClick={() => onSubmit(draftMatch)}
                    >
                        Confirmar parejas
                    </Button>
                )}
            </div>
        );
    }

    return null;
};
