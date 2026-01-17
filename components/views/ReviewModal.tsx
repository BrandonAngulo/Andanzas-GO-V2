import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Star } from 'lucide-react';
import StarRating from '../shared/StarRating';
import { Site } from '../../types';
import { useI18n } from '../../i18n';
import { getTranslated, cn } from '../../lib/utils';

interface ReviewModalProps {
    site: Site | undefined;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (siteId: string, text: string, rating: number, files: File[]) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ site, isOpen, onClose, onSubmit }) => {
    const { t, language } = useI18n();
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [files, setFiles] = useState<File[]>([]);

    if (!site) return null;

    const handleSubmit = () => {
        onSubmit(site.id, text, rating, files);
        setText("");
        setRating(0);
        setFiles([]);
        onClose();
    };

    const handleSkip = () => {
        setText("");
        setRating(0);
        setFiles([]);
        onClose();
    };

    const siteName = getTranslated(site, 'nombre', language);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
            <DialogContent className="sm:max-w-lg border-none shadow-2xl bg-card/95 backdrop-blur-xl">
                <DialogHeader className="items-center text-center pb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary animate-in zoom-in spin-in-12 duration-500">
                        <Star className="w-6 h-6 fill-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                        {siteName}
                    </DialogTitle>
                    <DialogDescription className="text-base font-medium text-muted-foreground mt-2 max-w-sm mx-auto">
                        {t('guidedRoute.reviewPrompt') || "¿Qué te pareció este lugar? Comparte tu aventura."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Rating Section */}
                    <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('addReview.rating')}</span>
                        <div className="scale-125">
                            <StarRating value={rating} onChange={setRating} size="lg" />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                            {rating === 0 ? "Selecciona una calificación" :
                                rating === 5 ? "¡Excelente! 🤩" :
                                    rating >= 4 ? "Muy bueno 😄" :
                                        rating >= 3 ? "Estuvo bien 🙂" :
                                            "Puede mejorar 😐"}
                        </span>
                    </div>

                    {/* Review Text Section */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-semibold ml-1 flex justify-between">
                            {t('addReview.yourExperience')}
                            <span className={cn("text-xs font-normal", text.length > 550 ? "text-destructive" : "text-muted-foreground")}>
                                {text.length}/600
                            </span>
                        </label>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={600}
                            placeholder={t('addReview.placeholder') || "Cuenta a otros viajeros sobre lo mejor de tu visita..."}
                            className="min-h-[120px] resize-none rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all shadow-sm focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <DialogFooter className="flex-col-reverse sm:flex-row gap-3 sm:gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="w-full sm:w-auto rounded-full border-border/50 hover:bg-muted/50"
                    >
                        {t('cancel') || "Cancelar"}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className={cn(
                            "w-full sm:w-auto rounded-full shadow-lg transition-all duration-300",
                            rating > 0
                                ? "bg-gradient-to-r from-primary to-teal-500 hover:shadow-primary/25 hover:scale-[1.02]"
                                : "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {t('send')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;
