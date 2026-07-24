import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { Coins, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface WeeklyGoalRewardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coins: number;
    goalTitle: string;
}

// Entrega celebratoria del premio de una meta semanal: confeti, moneda que "aterriza"
// con rebote y conteo animado del botín. Pensado para que reclamar se sienta gratificante.
export const WeeklyGoalRewardModal: React.FC<WeeklyGoalRewardModalProps> = ({ open, onOpenChange, coins, goalTitle }) => {
    const [confetti, setConfetti] = useState(false);
    const [shown, setShown] = useState(0); // conteo animado de monedas

    useEffect(() => {
        if (!open) { setShown(0); return; }
        setConfetti(true);
        const stopConfetti = setTimeout(() => setConfetti(false), 4500);
        // Conteo animado 0 → coins en ~900ms.
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 900);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            setShown(Math.round(eased * coins));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => { clearTimeout(stopConfetti); cancelAnimationFrame(raf); };
    }, [open, coins]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[380px] overflow-hidden border-amber-300/40 p-0 text-center">
                {confetti && (
                    <div className="pointer-events-none absolute inset-0 z-50">
                        <ReactConfetti width={380} height={420} recycle={false} numberOfPieces={220} gravity={0.25} colors={['#f59e0b', '#fbbf24', '#f97316', '#10b981', '#facc15']} />
                    </div>
                )}

                <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 px-6 pb-8 pt-9 text-white">
                    <motion.div
                        initial={{ scale: 0, rotate: -25, y: -20 }}
                        animate={{ scale: 1, rotate: 0, y: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.05 }}
                        className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-lg ring-4 ring-white/40"
                    >
                        <Sparkles className="absolute -right-1 -top-1 h-6 w-6 text-white animate-pulse" />
                        <Sparkles className="absolute -bottom-2 -left-2 h-5 w-5 text-white/80 animate-pulse [animation-delay:120ms]" />
                        <Coins className="h-12 w-12 text-white drop-shadow" />
                    </motion.div>

                    <DialogTitle className="mt-5 text-2xl font-black tracking-tight text-white">¡Meta cumplida!</DialogTitle>
                    <p className="mt-1 text-sm font-medium text-white/90">{goalTitle}</p>

                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 16 }}
                        className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2 shadow-md"
                    >
                        <Coins className="h-6 w-6 text-amber-500" />
                        <span className="text-2xl font-black text-amber-600">+{shown}</span>
                        <span className="text-sm font-bold text-amber-700/80">monedas</span>
                    </motion.div>
                </div>

                <div className="px-6 pb-6 pt-5">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-white hover:from-amber-600 hover:to-orange-700"
                    >
                        ¡Genial!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
