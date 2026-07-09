import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Heart, Share2, Coffee, Star, CreditCard, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface SupportUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SupportUsModal({ isOpen, onClose }: SupportUsModalProps) {
    const [copiedDaviplata, setCopiedDaviplata] = useState(false);
    const [copiedNequi, setCopiedNequi] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Andanzas GO',
                    text: '¡Descubre y enamórate de Cali con Andanzas GO! Explora lugares, gana insignias y vive la ciudad.',
                    url: window.location.origin
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            toast.error("Tu navegador no soporta la función de compartir nativa.");
        }
    };

    const copyToClipboard = (text: string, type: 'nequi' | 'daviplata') => {
        navigator.clipboard.writeText(text);
        if (type === 'nequi') {
            setCopiedNequi(true);
            setTimeout(() => setCopiedNequi(false), 2000);
        } else {
            setCopiedDaviplata(true);
            setTimeout(() => setCopiedDaviplata(false), 2000);
        }
        toast.success("Número copiado al portapapeles");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
                
                {/* Header Decoration */}
                <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 h-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 [mask-image:linear-gradient(0deg,transparent,white)]" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-background rounded-full flex items-center justify-center p-2 shadow-lg">
                        <div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-10 pb-6 text-center space-y-2">
                    <DialogTitle className="text-2xl font-bold">¡Apoya a Andanzas GO!</DialogTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Andanzas GO es un proyecto en crecimiento. Tu apoyo nos permite mantener los servidores, mejorar los mapas y crear nuevas experiencias para descubrir la ciudad.
                    </p>
                </div>

                <ScrollArea className="max-h-[50vh] px-6 pb-6">
                    <div className="space-y-4">
                        
                        {/* Aporte Económico */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">1. Aporte Económico ☕</h4>
                            
                            <div className="grid gap-2">
                                <Button 
                                    variant="outline" 
                                    className="w-full h-14 justify-between border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors group"
                                    onClick={() => copyToClipboard('3000000000', 'nequi')} // Placeholder number
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#390050] flex items-center justify-center text-white font-bold text-xs">N</div>
                                        <div className="text-left flex flex-col">
                                            <span className="font-semibold text-foreground">Nequi</span>
                                            <span className="text-xs text-muted-foreground group-hover:text-purple-600 transition-colors">Toca para copiar número</span>
                                        </div>
                                    </div>
                                    {copiedNequi ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-purple-600" />}
                                </Button>

                                <Button 
                                    variant="outline" 
                                    className="w-full h-14 justify-between border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
                                    onClick={() => copyToClipboard('3000000000', 'daviplata')} // Placeholder number
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">D</div>
                                        <div className="text-left flex flex-col">
                                            <span className="font-semibold text-foreground">Daviplata</span>
                                            <span className="text-xs text-muted-foreground group-hover:text-red-600 transition-colors">Toca para copiar número</span>
                                        </div>
                                    </div>
                                    {copiedDaviplata ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-red-600" />}
                                </Button>
                            </div>
                        </div>

                        {/* Apoyo Social */}
                        <div className="space-y-3 pt-4 border-t">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">2. Difusión 📣</h4>
                            <Button onClick={handleShare} variant="secondary" className="w-full h-12 shadow-sm rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                <Share2 className="w-4 h-4 mr-2" /> Compartir con Amigos
                            </Button>
                        </div>

                        {/* Apoyo Comunitario */}
                        <div className="space-y-3 pt-4 border-t">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">3. Comunidad 🌟</h4>
                            <div className="p-4 rounded-2xl bg-muted/50 flex gap-4 items-center">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                                    <Star className="w-6 h-6" />
                                </div>
                                <div className="flex-1 text-sm">
                                    <span className="font-semibold block mb-1">¡Deja reseñas y fotos!</span>
                                    <span className="text-muted-foreground leading-tight">Cada vez que enriqueces el mapa con tus vivencias, ayudas a que la plataforma sea mejor para todos.</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
