import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LogIn, Sparkles, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getAuthErrorMessage } from '../../services/auth.service';

interface AuthRequiredDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: (email: string, pass: string, isSignUp: boolean) => Promise<unknown>;
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [ageConfirmed, setAgeConfirmed] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authNotice, setAuthNotice] = useState('');

    const defaultTitle = language === 'es' ? 'Descubre más' : 'Discover more';
    const defaultDesc = language === 'es'
        ? 'Inicia sesión para guardar tus rutas favoritas, dejar reseñas y acceder a funciones exclusivas. ¡Es gratis!'
        : 'Log in to save your favorite routes, leave reviews, and access exclusive features. It\'s free!';

    const handleSubmit = async () => {
        if (!email || !password || (isSignUp && (!ageConfirmed || !termsAccepted))) return;

        setSubmitting(true);
        setAuthError('');
        setAuthNotice('');
        try {
            const result = await onLogin(email, password, isSignUp) as { session?: unknown } | undefined;
            if (isSignUp && !result?.session) {
                setAuthNotice('Cuenta creada. Revisa tu correo y confirma el enlace para entrar a Andanzas GO.');
            }
        } catch (error: unknown) {
            setAuthError(getAuthErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

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

                    <div className="flex flex-col gap-3 mt-4">
                        <Input 
                            placeholder="Correo electrónico" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <Input 
                            placeholder="Contraseña" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />

                        {isSignUp && (
                            <div className="mt-2 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] to-emerald-500/[0.03]">
                                <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3">
                                    <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{language === 'es' ? 'Registro claro y seguro' : 'Clear and secure registration'}</p>
                                        <p className="text-xs text-muted-foreground">{language === 'es' ? 'Revisa y confirma antes de continuar.' : 'Review and confirm before continuing.'}</p>
                                    </div>
                                </div>
                                <label className="flex cursor-pointer items-start gap-3 px-4 py-3 text-sm">
                                    <input 
                                        type="checkbox" 
                                        className="mt-0.5 h-4 w-4 accent-primary"
                                        checked={ageConfirmed} 
                                        onChange={(e) => setAgeConfirmed(e.target.checked)} 
                                    />
                                    <span className="text-muted-foreground leading-tight">
                                        {language === 'es' ? 'Confirmo que tengo 14 años o más.' : 'I confirm that I am 14 years or older.'}
                                    </span>
                                </label>
                                <div className="mx-4 border-t border-border/60" />
                                <label className="flex cursor-pointer items-start gap-3 px-4 py-3 text-sm">
                                    <input 
                                        type="checkbox" 
                                        className="mt-0.5 h-4 w-4 accent-primary"
                                        checked={termsAccepted} 
                                        onChange={(e) => setTermsAccepted(e.target.checked)} 
                                    />
                                    <span className="text-muted-foreground leading-relaxed">
                                        {language === 'es' ? 'Acepto los ' : 'I accept the '}
                                        <a
                                            href="/terms"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-primary underline-offset-2 hover:underline"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            {language === 'es' ? 'Términos de servicio' : 'Terms of Service'}
                                        </a>
                                        {language === 'es' ? ' y la ' : ' and the '}
                                        <a
                                            href="/privacy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-primary underline-offset-2 hover:underline"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            {language === 'es' ? 'Política de privacidad' : 'Privacy Policy'}
                                        </a>
                                        .
                                    </span>
                                </label>
                            </div>
                        )}

                        {authError && (
                            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm leading-snug text-red-700">
                                {authError}
                            </p>
                        )}
                        {authNotice && (
                            <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm leading-snug text-emerald-800">
                                {authNotice}
                            </p>
                        )}

                        <Button
                            disabled={submitting || !email || !password || (isSignUp && (!ageConfirmed || !termsAccepted))}
                            onClick={() => void handleSubmit()}
                            className="w-full h-12 mt-2 rounded-xl text-base font-medium shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-emerald-600 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            {submitting ? 'Un momento…' : isSignUp ? (language === 'es' ? 'Crear Cuenta' : 'Sign Up') : (language === 'es' ? 'Iniciar Sesión' : 'Login')}
                        </Button>
                        <Button
                            variant="link"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setAuthError('');
                                setAuthNotice('');
                            }}
                            className="w-full h-8 text-sm text-primary hover:text-primary/80"
                        >
                            {isSignUp ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
