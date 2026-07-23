import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Check, Sparkles, Building2, Trees, Music, Utensils, Theater, Camera, Map, Heart, Compass } from 'lucide-react';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';

import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing?: boolean;
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

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, isEditing = false }) => {
    const { t, language } = useI18n();
    const { user } = useAuth();
    // Start at 0 for new users (Welcome), 1 for editing
    const [step, setStep] = useState(isEditing ? 1 : 0);
    const totalSteps = 4;

    const [isLocal, setIsLocal] = useState<boolean>(true);

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [travelStyle, setTravelStyle] = useState<string | null>(null);
    const [accessibility, setAccessibility] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial load of preferences
    React.useEffect(() => {
        if (isOpen && user) {
            userService.getProfile(user.id).then(profile => {
                if (profile) {
                    if (profile.interests) setSelectedInterests(profile.interests);
                    if (profile.travel_style) setTravelStyle(profile.travel_style);
                    if (profile.accessibility_needs) setAccessibility(profile.accessibility_needs);
                }
            });
        }
        // Reset step when reopening if not editing
        if (isOpen && !isEditing) {
            setStep(0);
        }
    }, [isOpen, user, isEditing]);

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
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

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
            case 0:
                return (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative overflow-hidden rounded-[28px] border border-emerald-200/70 bg-gradient-to-br from-[#075f54] via-[#087a65] to-[#13a86b] px-6 pb-6 pt-7 text-white shadow-[0_24px_70px_-32px_rgba(5,95,84,0.85)] sm:px-8">
                            <div className="absolute -left-16 top-14 h-40 w-40 rounded-full border border-white/10" />
                            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-300/15 blur-2xl" />
                            <div className="relative grid items-center gap-5 sm:grid-cols-[1fr_190px]">
                                <div className="order-2 space-y-3 text-center sm:order-1 sm:text-left">
                                    <Badge className="border-amber-300/40 bg-amber-300/15 text-[11px] font-black tracking-[0.18em] text-amber-200 hover:bg-amber-300/15">
                                        {language === 'es' ? 'TU COMPAÑERO DE VIAJE' : 'YOUR TRAVEL COMPANION'}
                                    </Badge>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-100">
                                            {language === 'es' ? 'Hola, soy Andi' : "Hi, I'm Andi"}
                                        </p>
                                        <h3 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">
                                            {language === 'es' ? '¡Te doy la bienvenida a Andanzas GO!' : 'Welcome to Andanzas GO!'}
                                        </h3>
                                    </div>
                                    <p className="text-sm leading-relaxed text-emerald-50 sm:text-base">
                                        {language === 'es'
                                            ? 'Voy a acompañarte a descubrir lugares, historias y experiencias que hacen única cada ciudad.'
                                            : 'I will join you as you discover the places, stories and experiences that make every city unique.'}
                                    </p>
                                </div>
                                <div className="order-1 mx-auto flex h-44 w-44 items-end justify-center rounded-full border border-white/20 bg-white/10 shadow-inner sm:order-2">
                                    <img
                                        src="/brand/andi/andi-frontal-512-transparent-v2.png"
                                        alt={language === 'es' ? 'Andi, compañero de viaje de Andanzas GO.' : 'Andi, the Andanzas GO travel companion.'}
                                        className="h-[168px] w-auto object-contain object-bottom drop-shadow-[0_14px_20px_rgba(0,0,0,0.28)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {[
                                { icon: Map, title: language === 'es' ? 'Explora' : 'Explore', text: language === 'es' ? 'Rutas y lugares con identidad.' : 'Routes and places with identity.' },
                                { icon: Compass, title: language === 'es' ? 'Descubre' : 'Discover', text: language === 'es' ? 'Historias y saberes inesperados.' : 'Unexpected stories and knowledge.' },
                                { icon: Heart, title: language === 'es' ? 'Hazlo tuyo' : 'Make it yours', text: language === 'es' ? 'Recomendaciones según tus gustos.' : 'Recommendations based on your interests.' },
                            ].map(({ icon: Icon, title, text }) => (
                                <div key={title} className="rounded-2xl border bg-card/90 p-3.5 shadow-sm">
                                    <Icon className="mb-2 h-5 w-5 text-primary" />
                                    <p className="text-sm font-bold">{title}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
                            {language === 'es'
                                ? 'Cuéntanos un poco de ti para personalizar tus próximas andanzas.'
                                : 'Tell us a little about yourself so we can personalize your next adventures.'}
                        </p>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center space-y-2 mb-6">
                            <h3 className="text-xl font-bold text-primary">Recomendaciones para tu andanza</h3>
                            <p className="text-sm text-muted-foreground">Andar una ciudad también es un arte. Aquí te dejamos algunas claves para que tus andanzas sean más ricas y seguras:</p>
                        </div>
                        
                        <div className="flex bg-muted p-1 rounded-lg mb-4">
                            <button className={cn("flex-1 py-2 text-sm font-bold rounded-md transition-all", isLocal ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")} onClick={() => setIsLocal(true)}>Soy local</button>
                            <button className={cn("flex-1 py-2 text-sm font-bold rounded-md transition-all", !isLocal ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")} onClick={() => setIsLocal(false)}>Estoy de visita</button>
                        </div>

                        <div className="space-y-3 px-2">
                            {isLocal ? (
                                <>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Redescubre tu ciudad con ojos de turista: siempre hay algo nuevo en la esquina de siempre.</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Cuida el espacio público, la ciudad es la casa de todos.</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Camina alerta pero con curiosidad, sin dar papaya pero sin miedo a explorar.</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Apoya el comercio y arte local en tus andanzas.</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Comparte tus rutas favoritas con otros andantes.</p></div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Pregunta a los locales si tienes dudas, ¡la hospitalidad es nuestro fuerte!</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Mantén tus pertenencias a la vista en zonas concurridas.</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Prueba la gastronomía típica en lugares recomendados.</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Respeta las dinámicas de los barrios y pide permiso para tomar fotos a personas.</p></div>
                                    <div className="flex gap-3 items-start"><Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><p className="text-sm">Lleva zapatos cómodos, protector solar y agua para tus recorridos.</p></div>
                                </>
                            )}
                        </div>
                    </div>
                );
            case 2:
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
            case 3:
                // ... (Existing Step 2 content)
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
            case 4:
                // ... (Existing Step 3 content)
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
            <DialogContent className="flex h-[96dvh] max-h-[96dvh] max-w-2xl flex-col overflow-hidden rounded-t-[26px] border border-primary/10 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:h-auto sm:max-h-[88dvh] sm:rounded-[30px] sm:p-6">
                <DialogHeader className={cn("text-center pb-2 border-b", step === 0 && "hidden")}>
                    {step > 0 && (
                        <div className="mx-auto bg-primary/10 p-2.5 rounded-full mb-2 w-fit">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                    )}
                    <DialogTitle className="text-xl font-bold">
                        {step === 0
                            ? null
                            : (isEditing
                                ? (language === 'es' ? 'Editar Preferencias' : 'Edit Preferences')
                                : (language === 'es' ? 'Personaliza tu experiencia' : 'Customize your experience'))
                        }
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {language === 'es'
                            ? 'Personaliza tus intereses, estilo de viaje y necesidades de accesibilidad.'
                            : 'Customize your interests, travel style, and accessibility needs.'}
                    </DialogDescription>
                    {step > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className={cn("h-1.5 rounded-full transition-all duration-300", s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/50" : "w-2 bg-muted")} />
                            ))}
                        </div>
                    )}
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3 custom-scrollbar sm:py-4">
                    {renderStepContent()}
                </div>

                <DialogFooter className="mt-auto flex flex-col items-stretch gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-4">
                    {step === 0 ? (
                        <>
                            <Button variant="ghost" onClick={onClose}>
                                {language === 'es' ? 'Omitir' : 'Skip'}
                            </Button>
                            <Button onClick={handleNext} className="w-full sm:w-auto min-w-[140px] text-lg py-6 shadow-md hover:shadow-lg transition-all animate-in zoom-in spin-in-1">
                                {language === 'es' ? '¡Vamos!' : "Let's Go!"} <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={step === 1 ? (isEditing ? onClose : handleBack) : handleBack} disabled={isSubmitting}>
                                {step === 1
                                    ? (isEditing
                                        ? (language === 'es' ? 'Cancelar' : 'Cancel')
                                        : (language === 'es' ? 'Atrás' : 'Back'))
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
                                    isEditing ? (language === 'es' ? 'Guardar Cambios' : 'Save Changes') : (language === 'es' ? 'Finalizar' : 'Finish')
                                ) : (
                                    <>
                                        {language === 'es' ? 'Siguiente' : 'Next'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OnboardingModal;
