import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Check, X, Sparkles, Building2, Trees, Music, Utensils, Theater, Camera } from 'lucide-react';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';

import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';

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

const TRAVEL_STYLES = [
    { id: 'solo', label: 'Viajero Solitario', label_en: 'Solo Traveler', description: 'Aventura a mi propio ritmo', description_en: 'Adventure at my own pace' },
    { id: 'couple', label: 'En Pareja', label_en: 'Couple', description: 'Escapadas románticas', description_en: 'Romantic getaways' },
    { id: 'family', label: 'Familia', label_en: 'Family', description: 'Diversión para todos', description_en: 'Fun for everyone' },
    { id: 'group', label: 'Amigos', label_en: 'Friends', description: 'Experiencias compartidas', description_en: 'Shared experiences' },
];

const ACCESSIBILITY_NEEDS = [
    { id: 'mobility', label: 'Movilidad Reducida', label_en: 'Reduced Mobility' },
    { id: 'visual', label: 'Discapacidad Visual', label_en: 'Visual Impairment' },
    { id: 'hearing', label: 'Discapacidad Auditiva', label_en: 'Hearing Impairment' },
    { id: 'none', label: 'Ninguna', label_en: 'None' },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const { t, language } = useI18n();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [travelStyle, setTravelStyle] = useState<string | null>(null);
    const [accessibility, setAccessibility] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAccessibility = (id: string) => {
        if (id === 'none') {
            setAccessibility(['none']);
            return;
        }
        setAccessibility(prev => {
            const newPrev = prev.filter(i => i !== 'none');
            return newPrev.includes(id) ? newPrev.filter(i => i !== id) : [...newPrev, id];
        });
    };

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSave = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await userService.updateProfileData(user.id, {
                interests: selectedInterests,
                travel_style: travelStyle,
                accessibility_needs: accessibility
            });
            onClose();
        } catch (error) {
            console.error("Failed to save preferences", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center space-y-2 mb-6">
                            <h3 className="text-lg font-medium">{language === 'es' ? '¿Qué te apasiona?' : 'What are you passionate about?'}</h3>
                            <p className="text-sm text-muted-foreground">{language === 'es' ? 'Selecciona tus temas favoritos para recomendarte lo mejor.' : 'Select your favorite topics for better recommendations.'}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {INTERESTS.map(({ id, label, label_en, icon: Icon }) => {
                                const isSelected = selectedInterests.includes(id);
                                return (
                                    <div
                                        key={id}
                                        className={cn(
                                            "cursor-pointer group relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-sm scale-100"
                                                : "border-muted bg-card hover:border-primary/50 hover:bg-accent/50 scale-95 hover:scale-100"
                                        )}
                                        onClick={() => toggleInterest(id)}
                                    >
                                        <div className={cn("p-2 rounded-full transition-colors", isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary")}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className={cn("text-sm font-medium text-center", isSelected ? "text-primary" : "text-foreground")}>
                                            {language === 'es' ? label : label_en}
                                        </span>
                                        {isSelected && <div className="absolute top-2 right-2"><Check className="w-4 h-4 text-primary bg-background rounded-full border border-primary p-0.5" /></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center space-y-2 mb-6">
                            <h3 className="text-lg font-medium">{language === 'es' ? '¿Cómo sueles viajar?' : 'How do you usually travel?'}</h3>
                            <p className="text-sm text-muted-foreground">{language === 'es' ? 'Entender tu estilo nos ayuda a sugerir rutas ideales.' : 'Understanding your style helps us suggest ideal routes.'}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {TRAVEL_STYLES.map(({ id, label, label_en, description, description_en }) => {
                                const isSelected = travelStyle === id;
                                return (
                                    <div
                                        key={id}
                                        className={cn(
                                            "cursor-pointer relative flex flex-col p-4 rounded-xl border-2 transition-all text-left",
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-muted bg-card hover:border-primary/50 hover:bg-accent/50"
                                        )}
                                        onClick={() => setTravelStyle(id)}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn("font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                                                {language === 'es' ? label : label_en}
                                            </span>
                                            {isSelected && <Check className="w-4 h-4 text-primary" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {language === 'es' ? description : description_en}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center space-y-2 mb-6">
                            <h3 className="text-lg font-medium">{language === 'es' ? '¿Tienes alguna necesidad especial?' : 'Do you have any special needs?'}</h3>
                            <p className="text-sm text-muted-foreground">{language === 'es' ? 'Queremos que Andanzas GO sea accesible para todos.' : 'We want Andanzas GO to be accessible to everyone.'}</p>
                        </div>
                        <div className="space-y-2">
                            {ACCESSIBILITY_NEEDS.map(({ id, label, label_en }) => {
                                const isSelected = accessibility.includes(id);
                                return (
                                    <div
                                        key={id}
                                        className={cn(
                                            "cursor-pointer flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-muted bg-card hover:bg-accent/50"
                                        )}
                                        onClick={() => toggleAccessibility(id)}
                                    >
                                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", isSelected ? "bg-primary border-primary" : "border-muted-foreground")}>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                        </div>
                                        <span className={cn("text-sm font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                                            {language === 'es' ? label : label_en}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl sm:max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="text-center pb-2 border-b">
                    <div className="mx-auto bg-primary/10 p-2.5 rounded-full mb-2 w-fit">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        {language === 'es' ? '¡Bienvenido a Andanzas GO!' : 'Welcome to Andanzas GO!'}
                    </DialogTitle>
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={cn("h-1.5 rounded-full transition-all duration-300", s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/50" : "w-2 bg-muted")} />
                        ))}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1 custom-scrollbar">
                    {renderStepContent()}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between items-center pt-4 border-t mt-auto">
                    <Button variant="ghost" onClick={step === 1 ? onClose : handleBack} disabled={isSubmitting}>
                        {step === 1
                            ? (language === 'es' ? 'Saltar por ahora' : 'Skip for now')
                            : (language === 'es' ? 'Atrás' : 'Back')
                        }
                    </Button>
                    <Button
                        onClick={step === totalSteps ? handleSave : handleNext}
                        disabled={isSubmitting || (step === 1 && selectedInterests.length === 0)}
                        className="w-full sm:w-auto min-w-[140px]"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Saving...</span>
                        ) : step === totalSteps ? (
                            language === 'es' ? 'Finalizar' : 'Finish'
                        ) : (
                            <>
                                {language === 'es' ? 'Siguiente' : 'Next'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OnboardingModal;
