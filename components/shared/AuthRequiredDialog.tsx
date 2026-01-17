import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { LogIn, Sparkles, LockKeyhole } from 'lucide-react';
import { useI18n } from '../../i18n';

interface AuthRequiredDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: () => void;
    title?: string;
    description?: string;
}

const AuthRequiredDialog: React.FC<AuthRequiredDialogProps> = ({
    open,
    onOpenChange,
    onLogin,
    title,
    description
}) => {
    const { t, language } = useI18n();

    const defaultTitle = language === 'es' ? 'Descubre más' : 'Discover more';
    const defaultDesc = language === 'es'
        ? 'Inicia sesión para guardar tus rutas favoritas, dejar reseñas y acceder a funciones exclusivas. ¡Es gratis!'
        : 'Log in to save your favorite routes, leave reviews, and access exclusive features. It\'s free!';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-0 bg-background/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden rounded-3xl">
                {/* Visual Header with Gradient */}
                <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    {/* Decorative circles */}
                    <div className="absolute top-[-20%] left-[-10%] w-24 h-24 rounded-full bg-primary/20 blur-2xl"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 rounded-full bg-orange-500/10 blur-3xl"></div>

                    {/* Main Icon */}
                    <div className="relative z-10 w-20 h-20 bg-background rounded-full shadow-lg flex items-center justify-center p-1 border-4 border-white/20 dark:border-white/5 ring-4 ring-primary/10">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white">
                            <LockKeyhole className="w-8 h-8" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1.5 shadow-md border border-border">
                            <Sparkles className="w-4 h-4 text-orange-400 fill-orange-400" />
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-6">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                            {title || defaultTitle}
                        </DialogTitle>
                        <DialogDescription className="text-center pt-3 text-base text-muted-foreground/90 leading-relaxed">
                            {description || defaultDesc}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 mt-8">
                        <Button
                            onClick={() => { onOpenChange(false); onLogin(); }}
                            className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-emerald-600 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            {language === 'es' ? 'Iniciar Sesión / Registrarse' : 'Login / Sign Up'}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            {language === 'es' ? 'Quizás más tarde' : 'Maybe later'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthRequiredDialog;
