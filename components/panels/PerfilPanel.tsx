
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Heart, MessageSquare, Route as RouteIcon, Flag, Trophy, Award, LogIn, UserCircle, UserPlus, Loader2, Chrome } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import OnboardingModal from '../panels/OnboardingModal';
import { UserProfile } from '../../types';

interface PerfilPanelProps {
    favCount: number;
    reviewsCount: number;
    rutasCount: number;
    insigniasCount: number;
    onOpenInsigniasModal: () => void;
    routesInProgressCount: number;
    routesCompletedCount: number;
}

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number | string }) => (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <Icon className="h-6 w-6 text-primary flex-shrink-0" />
        <div>
            <div className="text-lg font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    </div>
);

const PerfilPanel: React.FC<PerfilPanelProps> = ({ favCount, reviewsCount, rutasCount, insigniasCount, onOpenInsigniasModal, routesInProgressCount, routesCompletedCount }) => {
    const { t, language } = useI18n();
    const { user, signIn, signUp, logout, isAuthenticated, resetPassword, signInWithGoogle } = useAuth();

    const [isRegistering, setIsRegistering] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showInterestsModal, setShowInterestsModal] = useState(false);

    React.useEffect(() => {
        if (user) {
            userService.getProfile(user.id).then(setUserProfile);
        }
    }, [user, showInterestsModal]); // Refresh when modal closes (interests might change)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (isResetting) {
                await resetPassword(formEmail);
                setSuccessMsg("Si el correo existe, recibirás un enlace de recuperación.");
            } else if (isRegistering) {
                await signUp(formEmail, formPassword, formName);
                setSuccessMsg("Cuenta creada. Por favor verifica tu correo electrónico.");
            } else {
                await signIn(formEmail, formPassword);
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Error de autenticación");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Google login error:", error);
            setErrorMsg("Error al iniciar con Google");
        }
    };

    if (!isAuthenticated) {
        return (
            <ScrollArea className="h-[72vh]">
                <div className="p-6 grid place-items-center h-full">
                    <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                        <CardHeader className="text-center pb-2">
                            <UserCircle className="w-16 h-16 mx-auto text-primary mb-4" />
                            <CardTitle className="text-2xl">
                                {isResetting ? 'Recuperar Contraseña' : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión')}
                            </CardTitle>
                            <p className="text-muted-foreground mt-2 text-sm">
                                {isResetting ? 'Ingresa tu email para recibir un enlace de recuperación.' : (isRegistering ? 'Únete a la comunidad de exploradores.' : 'Accede a tus rutas y progresos.')}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {errorMsg && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <span>⚠️</span> {errorMsg}
                                </div>
                            )}
                            {successMsg && (
                                <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <span>✅</span> {successMsg}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isRegistering && !isResetting && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nombre</label>
                                        <Input
                                            placeholder="Tu nombre"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="hola@ejemplo.com"
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {!isResetting && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">Contraseña</label>
                                            {!isRegistering && <button type="button" onClick={() => { setIsResetting(true); setErrorMsg(''); setSuccessMsg(''); }} className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</button>}
                                        </div>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formPassword}
                                            onChange={(e) => setFormPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                )}
                                <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isResetting ? 'Enviar Enlace' : (isRegistering ? 'Registrarse' : 'Entrar')}
                                </Button>
                            </form>

                            {!isResetting && (
                                <>
                                    <div className="relative my-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
                                        <Chrome className="mr-2 h-4 w-4" />
                                        Google
                                    </Button>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col gap-3 pt-0">
                            <div className="text-sm text-center">
                                {isResetting ? (
                                    <button
                                        type="button"
                                        className="text-primary font-medium hover:underline"
                                        onClick={() => { setIsResetting(false); setErrorMsg(''); setSuccessMsg(''); }}
                                    >
                                        Volver al inicio de sesión
                                    </button>
                                ) : (
                                    <>
                                        <span className="text-muted-foreground">{isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}</span>{' '}
                                        <button
                                            type="button"
                                            className="text-primary font-medium hover:underline"
                                            onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); setSuccessMsg(''); }}
                                        >
                                            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="text-center px-4 space-y-2 border-t pt-3 w-full">
                                <p className="text-xs text-muted-foreground">
                                    Al continuar, aceptas nuestros <a href="/terms" className="underline hover:text-foreground">Términos de Servicio</a> y <a href="/privacy" className="underline hover:text-foreground">Política de Privacidad</a>.
                                </p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </ScrollArea>
        );
    }

    // Get name from user metadata if available
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Explorador";

    const getLevelTitle = (lvl: number) => {
        if (!lvl || lvl < 3) return language === 'es' ? 'Explorador Novato' : 'Novice Explorer';
        if (lvl < 6) return language === 'es' ? 'Caminante Urbano' : 'Urban Trekker';
        if (lvl < 10) return language === 'es' ? 'Maestro Cultural' : 'Culture Master';
        return language === 'es' ? 'Leyenda de Cali' : 'Legend of Cali';
    };

    return (
        <ScrollArea className="h-[72vh]">
            <div className="p-3 space-y-6">

                {/* Main Header Section */}
                <div className="flex flex-col sm:flex-row gap-4 items-start justify-between bg-card p-4 rounded-xl border shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold">{displayName}</h2>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-orange-500" />
                            {t('profile.level')}: <span className="font-semibold text-foreground">{getLevelTitle(userProfile?.level || 1)} (Lvl {userProfile?.level || 1})</span>
                        </p>
                        <p className="text-xs text-muted-foreground bg-muted inline-block px-2 py-0.5 rounded-full">{user?.email}</p>
                    </div>
                    <Card className="w-full sm:w-auto sm:min-w-[140px] shadow-none border-none bg-primary/5">
                        <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('profile.culturePoints')}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <p className="text-3xl font-black text-primary">{userProfile?.points || 0}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistics Card */}
                <Card className="border-none shadow-none ring-1 ring-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4" /> {t('profile.myStats')}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <StatItem icon={Heart} label={t('profile.favorites')} value={favCount} />
                        <StatItem icon={MessageSquare} label={t('profile.reviews')} value={reviewsCount} />
                        <StatItem icon={RouteIcon} label={t('profile.routesCreated')} value={rutasCount} />
                        <StatItem icon={Flag} label={t('profile.routesInProgress')} value={routesInProgressCount} />
                        <StatItem icon={Trophy} label={t('profile.routesCompleted')} value={routesCompletedCount} />
                        <StatItem icon={Award} label={t('profile.badges')} value={insigniasCount} />
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button onClick={onOpenInsigniasModal} variant="outline" className="w-full border-primary/20 hover:bg-primary/5 group">
                            <Award className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                            {t('profile.viewBadgeCollection')}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Settings Card */}
                <Card className="border-none shadow-none ring-1 ring-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">{t('profile.accountSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                            <div>
                                <h4 className="text-sm font-medium">{language === 'es' ? 'Preferencias y Accesibilidad' : 'Preferences & Accessibility'}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {userProfile?.interests && userProfile.interests.length > 0
                                        ? `${userProfile.interests.length} intereses, ${userProfile.accessibility_needs?.length || 0} necesidades`
                                        : (language === 'es' ? 'Configura tu perfil de viajero' : 'Setup your travel profile')}
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setShowInterestsModal(true)}>
                                {t('edit')}
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                            <label htmlFor="notifications-switch" className="text-sm font-medium">{t('profile.enableNotifications')}</label>
                            <Switch defaultChecked id="notifications-switch" />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button variant="ghost" onClick={() => logout()} className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <LogIn className="h-4 w-4 mr-2 rotate-180" />
                            {t('logOutButton')}
                        </Button>
                    </CardFooter>
                </Card>

            </div>
            <OnboardingModal isOpen={showInterestsModal} onClose={() => setShowInterestsModal(false)} isEditing={true} />
        </ScrollArea>
    );
};

export default PerfilPanel;