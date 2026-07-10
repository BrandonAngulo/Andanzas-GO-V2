import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Trophy, Sparkles, ImageIcon, ArrowRight } from 'lucide-react';
import ReactConfetti from 'react-confetti';

interface RewardUnlockModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rewardType: 'banner' | 'badge';
    rewardName: string;
    description: string;
    onActionClick?: () => void;
}

export const RewardUnlockModal: React.FC<RewardUnlockModalProps> = ({ 
    open, 
    onOpenChange, 
    rewardType, 
    rewardName, 
    description,
    onActionClick
}) => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (open) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] text-center overflow-hidden">
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <ReactConfetti width={450} height={450} recycle={false} numberOfPieces={200} />
                    </div>
                )}
                
                <DialogHeader className="flex flex-col items-center pt-6 pb-2">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 relative">
                        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-500 animate-pulse" />
                        <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-amber-400 animate-pulse delay-75" />
                        {rewardType === 'banner' ? (
                            <ImageIcon className="w-10 h-10 text-amber-600" />
                        ) : (
                            <Trophy className="w-10 h-10 text-amber-600" />
                        )}
                    </div>
                    <DialogTitle className="text-2xl font-black text-primary">¡Reconocimiento Desbloqueado!</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <h4 className="text-xl font-bold">{rewardName}</h4>
                    <p className="text-muted-foreground">{description}</p>
                    
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-sm text-left mt-6">
                        <p className="font-semibold mb-2">¿Cómo seguir ganando?</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Guarda rutas en "Por Andar"</li>
                            <li>Deja reseñas en tus sitios favoritos</li>
                            <li>Completa rutas y desafíos</li>
                            <li>Gana puntos para subir de nivel</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                    <Button variant="outline" className="w-full sm:w-1/2" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                    <Button 
                        className="w-full sm:w-1/2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-0" 
                        onClick={() => {
                            onOpenChange(false);
                            if (onActionClick) setTimeout(onActionClick, 300);
                        }}
                    >
                        Ver mi premio <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
