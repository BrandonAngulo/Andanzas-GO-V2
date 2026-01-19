import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Check, X, Sparkles, Building2, Trees, Music, Utensils, Theater, Camera, Map, Compass, Filter, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../layout/Logo';

interface OnboardingStep {
    title: { es: string; en: string };
    description: { es: string; en: string };
    icon: React.ReactNode;
    image?: string;
}

const STEPS: OnboardingStep[] = [
    {
        title: { es: "¡Bienvenido a Andanzas GO!", en: "Welcome to Andanzas GO!" },
        description: {
            es: "Descubre el patrimonio cultural de Cali de una manera interactiva y divertida. Tu mapa vivo te espera.",
            en: "Discover Cali's cultural heritage in an interactive and fun way. Your live map awaits."
        },
        icon: <Map className="w-12 h-12 text-primary" />,
    },
    {
        title: { es: "Explora el Mapa Vivo", en: "Explore the Live Map" },
        description: {
            es: "Navega por el mapa e interactúa con los marcadores para ver información rápida de museos, teatros y parques.",
            en: "Navigate the map and interact with markers to see quick info about museums, theaters, and parks."
        },
        icon: <Compass className="w-12 h-12 text-blue-500" />,
    },
    {
        title: { es: "Filtra tus Intereses", en: "Filter Your Interests" },
        description: {
            es: "Usa el botón de filtros en el mapa para encontrar exactamente lo que buscas: salsa, arte, naturaleza y más.",
            en: "Use the filter button on the map to find exactly what you're looking for: salsa, art, nature, and more."
        },
        icon: <Filter className="w-12 h-12 text-orange-500" />,
    },
    {
        title: { es: "Completa Misiones", en: "Complete Missions" },
        description: {
            es: "¡No solo visites, juega! Inicia rutas guiadas, haz check-in en los sitios y gana puntos subiendo de nivel.",
            en: "Don't just visit, play! Start guided routes, check-in at sites, and earn points to level up."
        },
        icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    },
];

export function AppTutorialModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { language } = useI18n();

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenAppTutorial_v1');
        if (!hasSeenTutorial) {
            // Delay slightly to let app load
            const timer = setTimeout(() => setIsOpen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(curr => curr + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const handleClose = () => {
        localStorage.setItem('hasSeenAppTutorial_v1', 'true');
        setIsOpen(false);
    };

    const step = STEPS[currentStep];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl bg-transparent font-sans">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-xl z-0" />

                {/* Decorative gradients */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl z-0" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl z-0" />

                <div className="relative z-10 flex flex-col items-center p-8 text-center h-full">
                    {/* Icon Container with animation key for transition */}
                    <div key={currentStep + "-icon"} className="mb-6 animate-in zoom-in-50 fade-in duration-300">
                        {currentStep === 0 ? (
                            /* Logo Vivo Animation for Step 1 */
                            <div className="flex items-center justify-center p-4">
                                <Logo animated={true} />
                            </div>
                        ) : (
                            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center backdrop-blur-md relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 transform transition-transform group-hover:scale-110 duration-300">
                                    {step.icon}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content with animation */}
                    <div key={currentStep + "-text"} className="space-y-3 mb-8 animate-in fly-in-bottom-4 slide-in-from-bottom-4 fade-in duration-300 fill-mode-both">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                            {language === 'es' ? step.title.es : step.title.en}
                        </DialogTitle>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-[280px] mx-auto">
                            {language === 'es' ? step.description.es : step.description.en}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-8">
                        {STEPS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentStep(idx)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300 focus:outline-none",
                                    idx === currentStep ? 'w-8 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'w-2 bg-muted-foreground/30 hover:bg-primary/50'
                                )}
                                aria-label={`Go to step ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between w-full gap-4 pt-4 border-t border-white/10">
                        {/* Left Action (Skip/Nothing) */}
                        <div className="w-[80px] flex justify-start">
                            {currentStep < STEPS.length - 1 && (
                                <Button variant="ghost" onClick={handleClose} className="text-muted-foreground hover:text-foreground -ml-2 rounded-full">
                                    {language === 'es' ? 'Saltar' : 'Skip'}
                                </Button>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-3">
                            {currentStep > 0 && (
                                <Button variant="outline" onClick={handlePrev} size="icon" className="rounded-full h-10 w-10 border-white/10 bg-white/5 hover:bg-white/10">
                                    <span className="sr-only">{language === 'es' ? 'Atrás' : 'Back'}</span>
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-180"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </Button>
                            )}

                            <Button onClick={handleNext} className="rounded-full shadow-lg shadow-primary/25 min-w-[120px]">
                                {currentStep === STEPS.length - 1
                                    ? (language === 'es' ? '¡Comenzar!' : 'Get Started!')
                                    : (language === 'es' ? 'Siguiente' : 'Next')
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
