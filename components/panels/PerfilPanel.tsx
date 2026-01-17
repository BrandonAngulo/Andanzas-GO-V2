
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Heart, MessageSquare, Route as RouteIcon, Flag, Trophy, Award, LogIn, UserCircle, UserPlus, Loader2, Chrome, Settings, MapPin, Share2, Map, Star, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { BadgeCard } from '../shared/BadgeCard';
import { gamificationService } from '../../services/gamification.service';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import OnboardingModal from '../panels/OnboardingModal';
import { UserProfile, Insignia, Review, Site } from '../../types';
import { reviewsService } from '../../services/reviews.service';

import { getTranslated } from '../../lib/utils'; // Ensure getTranslated is imported if not already, checked file content, it is.

interface PerfilPanelProps {
    favCount: number;
    reviewsCount: number;
    rutasCount: number;
    insigniasCount: number;
    onOpenInsigniasModal: () => void;
    routesInProgressCount: number;
    routesCompletedCount: number;
    // New props for management
    favoriteSiteIds: string[];
    sites: Site[];
    toggleFav: (id: string) => void;
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

const PerfilPanel: React.FC<PerfilPanelProps> = ({ favCount, reviewsCount, rutasCount, insigniasCount, onOpenInsigniasModal, routesInProgressCount, routesCompletedCount, favoriteSiteIds, sites, toggleFav }) => {
    const { t, language } = useI18n();
    const { user, signIn, signUp, logout, isAuthenticated, resetPassword, signInWithGoogle } = useAuth();

    const [isRegistering, setIsRegistering] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');

    const [formPassword, setFormPassword] = useState('');
    const [formCity, setFormCity] = useState('');
    const [formTravelStyle, setFormTravelStyle] = useState('explorador');
    const [formBirthDate, setFormBirthDate] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [allBadges, setAllBadges] = useState<Insignia[]>([]);
    const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState("overview");

    React.useEffect(() => {
        if (user) {
            userService.getProfile(user.id).then(setUserProfile);

            // Load badges
            const loadBadges = async () => {
                try {
                    const all = await gamificationService.getAllBadges();
                    setAllBadges(all);
                    const earnedIds = await gamificationService.getUserBadgeIds(user.id);
                    setEarnedBadgeIds(earnedIds);
                    const reviews = await reviewsService.getByUserId(user.id);
                    setMyReviews(reviews);
                } catch (err) {
                    console.error("Error loading profile data", err);
                }
            };
            loadBadges();
        }
    }, [user, showInterestsModal]); // Refresh when modal closes (interests might change)

    const handleDeleteReview = async (reviewId: string) => {
        toast((t('deleteConfirm') || "¿Estás seguro de eliminar esta reseña?"), {
            action: {
                label: (t('delete') || 'Eliminar'),
                onClick: async () => {
                    const success = await reviewsService.deleteReview(reviewId);
                    if (success) {
                        setMyReviews(prev => prev.filter(r => r.id !== reviewId));
                        toast.success("Reseña eliminada");
                    }
                }
            },

        });
    };

    const myFavorites = sites.filter(s => favoriteSiteIds.includes(s.id));

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
                await signUp(formEmail, formPassword, formName, {
                    city: formCity,
                    travel_style: formTravelStyle,
                    birth_date: formBirthDate
                });
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
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nombre</label>
                                            <Input
                                                placeholder="Tu nombre"
                                                value={formName}
                                                onChange={(e) => setFormName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Ciudad / País</label>
                                            <Input
                                                placeholder="Ej: Cali, Colombia"
                                                value={formCity}
                                                onChange={(e) => setFormCity(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Fecha de Nacimiento</label>
                                            <Input
                                                type="date"
                                                value={formBirthDate}
                                                onChange={(e) => setFormBirthDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Estilo de Viaje</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formTravelStyle}
                                                onChange={(e) => setFormTravelStyle(e.target.value)}
                                            >
                                                <option value="explorador">Explorador (Me gusta ver de todo)</option>
                                                <option value="gastronomico">Gastronómico (Amante de la comida)</option>
                                                <option value="cultural">Cultural (Museos e historia)</option>
                                                <option value="aventura">Aventura (Naturaleza y caminatas)</option>
                                                <option value="fiesta">Fiesta (Salsa y vida nocturna)</option>
                                            </select>
                                        </div>
                                    </>
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
            </ScrollArea >
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

                {/* Header Profile Section */}
                <div className="relative rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50" />

                    <div className="relative p-6 flex flex-col items-center text-center z-10">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-orange-400 p-[3px] shadow-xl shadow-primary/20">
                                <div className="w-full h-full rounded-full bg-background border-4 border-background overflow-hidden grid place-items-center">
                                    {user?.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-primary">
                                            {displayName.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 transform left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-full border border-background shadow-sm whitespace-nowrap">
                                Lvl {userProfile?.level || 1}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
                            <MapPin className="h-3 w-3" /> Cali, Colombia
                        </p>

                        <div className="flex gap-4 w-full max-w-sm justify-center">
                            <div className="flex flex-col items-center p-3 bg-background/50 rounded-xl flex-1 backdrop-blur-sm border shadow-sm">
                                <span className="text-xl font-bold text-primary">{userProfile?.points || 0}</span>
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">{t('profile.culturePoints')}</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-background/50 rounded-xl flex-1 backdrop-blur-sm border shadow-sm">
                                <span className="text-xl font-bold text-foreground">{insigniasCount}</span>
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">{t('profile.badges')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-12 rounded-xl bg-muted/50 p-1 mb-6">
                        <TabsTrigger value="overview" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
                        <TabsTrigger value="badges" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Insignias</TabsTrigger>
                        <TabsTrigger value="activity" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Actividad</TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Perfil</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 mt-0">
                        {/* Stats Grid */}
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-sm">
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <Map className="h-5 w-5 text-blue-500" />
                                    <span className="text-2xl font-bold">{routesCompletedCount}</span>
                                    <span className="text-xs opacity-70">Rutas Completadas</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-none shadow-sm cursor-pointer hover:bg-yellow-500/20 transition-colors" onClick={() => setActiveTab('badges')}>
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <Award className="h-5 w-5 text-yellow-600" />
                                    <span className="text-2xl font-bold">{insigniasCount}</span>
                                    <span className="text-xs opacity-70">Insignias Ganadas</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity Placeholder */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Share2 className="h-4 w-4" /> Actividad Reciente
                            </h3>
                            <Card className="border-dashed shadow-none bg-muted/30">
                                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                                    Aún no hay actividad reciente para mostrar.
                                    <br />
                                    <span className="text-xs opacity-70">¡Empieza una ruta para llenar tu historial!</span>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="badges" className="mt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {allBadges.length > 0 ? (
                                allBadges.map(badge => (
                                    <BadgeCard
                                        key={badge.id}
                                        insignia={badge}
                                        obtenida={earnedBadgeIds.includes(String(badge.id))}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Cargando insignias...
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-0 space-y-6">
                        {/* Favorites Section */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Heart className="h-4 w-4 text-primary" /> {t('profile.favorites')} ({myFavorites.length})
                            </h3>
                            {myFavorites.length > 0 ? (
                                <div className="grid gap-2">
                                    {myFavorites.map(site => (
                                        <Card key={site.id} className="group overflow-hidden border-none shadow-sm bg-muted/20 hover:bg-muted/40 transition-colors">
                                            <div className="flex p-3 gap-3">
                                                <div className="h-16 w-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                                                    <img src={site.logoUrl} alt={site.nombre} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-semibold truncate">{getTranslated(site, 'nombre', language)}</h4>
                                                    <p className="text-xs text-muted-foreground truncate">{getTranslated(site, 'tipo', language)}</p>
                                                </div>
                                                <div className="flex flex-col justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={() => toggleFav(site.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg">No tienes favoritos aún.</p>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-orange-500" /> {t('profile.reviews')} ({myReviews.length})
                            </h3>
                            {myReviews.length > 0 ? (
                                <div className="grid gap-2">
                                    {myReviews.map(review => {
                                        const site = sites.find(s => s.id === review.siteId);
                                        return (
                                            <Card key={review.id} className="border-none shadow-sm bg-muted/20">
                                                <div className="p-3 space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold text-sm">
                                                                {site ? getTranslated(site, 'nombre', language) : 'Sitio desconocido'}
                                                            </h4>
                                                            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                                <Star className="h-3 w-3 fill-current" />
                                                                <span>{review.rating}/5</span>
                                                                <span className="text-muted-foreground mx-1">•</span>
                                                                <span className="text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                                                            onClick={() => handleDeleteReview(review.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    {review.text && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">"{review.text}"</p>
                                                    )}
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg">No has escrito reseñas aún.</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0 space-y-4">
                        <Card className="border border-border/50 shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                    <div>
                                        <h4 className="text-sm font-medium">{language === 'es' ? 'Preferencias y Accesibilidad' : 'Preferences & Accessibility'}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {userProfile?.interests && userProfile.interests.length > 0
                                                ? `${userProfile.interests.length} intereses, ${userProfile.accessibility_needs?.length || 0} necesidades`
                                                : (language === 'es' ? 'Configura tu perfil' : 'Setup your profile')}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setShowInterestsModal(true)}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        {t('edit')}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                    <label htmlFor="notifications-switch" className="text-sm font-medium">{t('profile.enableNotifications')}</label>
                                    <Switch defaultChecked id="notifications-switch" />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/20 p-4 border-t">
                                <Button variant="ghost" onClick={() => logout()} className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                                    <LogIn className="h-4 w-4 mr-2 rotate-180" />
                                    {t('logOutButton')}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
            <OnboardingModal isOpen={showInterestsModal} onClose={() => setShowInterestsModal(false)} isEditing={true} />
        </ScrollArea>
    );
};

export default PerfilPanel;