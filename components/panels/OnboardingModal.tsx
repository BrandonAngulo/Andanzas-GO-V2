import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Check, X, Sparkles, Building2, Trees, Music, Utensils, Theater, Camera } from 'lucide-react';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const INTERESTS = [
    { id: 'museums', label: 'Museos e Historia', label_en: 'Museums & History', icon: Building2 },
    { id: 'nature', label: 'Naturaleza y Parques', label_en: 'Nature & Parks', icon: Trees },
    { id: 'nightlife', label: 'Vida Nocturna y Salsa', label_en: 'Nightlife & Salsa', icon: Music },
    { id: 'gastronomy', label: 'Gastronomía Local', label_en: 'Local Gastronomy', icon: Utensils },
    { id: 'culture', label: 'Arte y Cultura', label_en: 'Art & Culture', icon: Theater },
    { id: 'photography', label: 'Fotografía y Vistas', label_en: 'Photography & Views', icon: Camera },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const { t, language } = useI18n();
    const { user } = useAuth();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await userService.updateInterests(user.id, selectedInterests);
            onClose();
        } catch (error) {
            console.error("Failed to save interests", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        {language === 'es' ? '¡Bienvenido a Andanzas GO!' : 'Welcome to Andanzas GO!'}
                    </DialogTitle>
                    <DialogDescription className="text-lg">
                        {language === 'es'
                            ? 'Queremos personalizar tu experiencia. ¿Qué tipo de planes te interesan?'
                            : 'We want to personalize your experience. What kind of plans are you interested in?'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
                    {INTERESTS.map(({ id, label, label_en, icon: Icon }) => {
                        const isSelected = selectedInterests.includes(id);
                        return (
                            <Card
                                key={id}
                                className={cn(
                                    "cursor-pointer transition-all hover:scale-105 border-2",
                                    isSelected ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-secondary/50 hover:bg-secondary"
                                )}
                                onClick={() => toggleInterest(id)}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full gap-3">
                                    <Icon className={cn("h-8 w-8", isSelected ? "text-primary" : "text-muted-foreground")} />
                                    <span className={cn("font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                                        {language === 'es' ? label : label_en}
                                    </span>
                                    {isSelected && <div className="absolute top-2 right-2 ring-1 ring-primary rounded-full p-0.5"><Check className="w-3 h-3 text-primary" /></div>}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center w-full">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        {language === 'es' ? 'Saltar por ahora' : 'Skip for now'}
                    </Button>
                    <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={isSubmitting || selectedInterests.length === 0} className="w-full sm:w-auto">
                            {isSubmitting ? (
                                <span className="animate-pulse">Saving...</span>
                            ) : (
                                language === 'es' ? 'Guardar Preferencias' : 'Save Preferences'
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OnboardingModal;
