
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Heart, MessageSquare, Route as RouteIcon, Flag, Trophy, Award, LogIn, UserCircle, UserPlus, Loader2, Chrome, Settings, MapPin, Share2, Map, Star, Trash2, Camera, Edit2, Info, ImageIcon, Coins, Gem, Sparkles, Flame, Target, Gamepad2, Calendar, Gift, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { BadgeCard } from '../shared/BadgeCard';
import { GameMascot } from '../views/GameMascot';
import { UserAvatar } from '../shared/UserAvatar';
import { InfoHint } from '../shared/InfoHint';
import { useHelpContent } from '../../hooks/useHelpContent';
import { gamificationService } from '../../services/gamification.service';
import { useI18n } from '../../i18n';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import OnboardingModal from '../panels/OnboardingModal';
import { UserProfile, Insignia, Review, Site, PassportStamp, ActivePanelType } from '../../types';
import { reviewsService } from '../../services/reviews.service';
import { bannerService } from '../../services/banner.service';
import { BannerGalleryModal, AVAILABLE_BANNERS } from './BannerGalleryModal';
import { RewardUnlockModal } from './RewardUnlockModal';

import { InfoTooltip } from '../ui/tooltip';
import { getTranslated, getMacroCategory, cn } from '../../lib/utils';
import { COLOMBIAN_CITIES } from '../../lib/locations';

// Hardcoded avatars for immediate rendering in UI
const HARDCODED_AVATARS = [
    {
        id: 'gata_callejera',
        name: 'La Gata Callejera',
        personality_title: 'Independiente e intuitiva',
        phrase: 'Por aquí hay algo que no sale en los mapas.',
        image_url: '/images/avatars/gato.png'
    },
    {
        id: 'caleño_salsero',
        name: 'El Caleño Salsero',
        personality_title: 'Festivo y rítmico',
        phrase: 'Si escuchás bien, Cali también camina en clave.',
        image_url: '/images/avatars/salsero.png'
    },
    {
        id: 'ave_curiosa',
        name: 'El Ave Curiosa (Bichofué)',
        personality_title: 'Observadora y ligera',
        phrase: 'Mirá dos veces: la ciudad siempre deja pistas.',
        image_url: '/images/avatars/bichofue.png'
    },
    {
        id: 'barranquero',
        name: 'El Barranquero',
        personality_title: 'Misterioso y colorido',
        phrase: 'Entre la selva de cemento, mi canto es un secreto.',
        image_url: '/images/avatars/barranquero.png'
    },
    {
        id: 'maceta',
        name: 'La Dulce Maceta',
        personality_title: 'Tradicional y alegre',
        phrase: 'Endulzo cada paso que das por Cali.',
        image_url: '/images/avatars/maceta.png'
    },
    {
        id: 'exploradora',
        name: 'La Exploradora Urbana',
        personality_title: 'Curiosa y atenta',
        phrase: 'Cada callejón tiene una historia que contar.',
        image_url: '/images/avatars/exploradora.png'
    },
    {
        id: 'poeta',
        name: 'El Poeta del Barrio',
        personality_title: 'Reflexivo y profundo',
        phrase: 'Las paredes hablan si sabes leerlas.',
        image_url: '/images/avatars/poeta.png'
    },
    {
        id: 'estudiante',
        name: 'El Alma Joven',
        personality_title: 'Energético y neutro',
        phrase: 'La cultura se mueve y yo me muevo con ella.',
        image_url: '/images/avatars/estudiante.png'
    },
    {
        id: 'chontaduro',
        name: 'El Chontaduro Poderoso',
        personality_title: 'Enérgico y vital',
        phrase: 'Conmigo nunca te falta la energía.',
        image_url: '/images/avatars/chontaduro.png'
    }
];

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
    onOpenSite: (site: Site) => void;
    onNavigate: (panel: ActivePanelType) => void;
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

const ECONOMY_HELP = {
    points: { title: 'Puntos Andanzas', body: 'Son tu puntaje principal como explorador. Se ganan al recorrer, aprender, jugar y aportar, y con ellos podrás canjear beneficios y experiencias exclusivas.' },
    coins: { title: 'Monedas', body: 'Son la recompensa de uso frecuente. Podrás canjearlas por cosas dentro de la app, como recuperar vidas o acceder a ayudas y beneficios en los juegos.' },
    gems: { title: 'Gemas', body: 'Son recompensas poco frecuentes y de mayor valor. Una gema equivale a varias monedas y sirve para canjear beneficios especiales dentro de la app.' },
    lives: { title: 'Vidas', body: 'Permiten continuar en modos de juego que tienen riesgo. Tienes un máximo de 3; se recargan automáticamente o pueden recuperarse con monedas o gemas.' }
} as const;

// Metadatos visuales por recurso: icono, color y micro-animación (keyframes en index.css).
const ECONOMY_META = {
    points: { icon: Sparkles, color: 'text-emerald-500', ring: 'bg-emerald-500/10', hoverAnim: 'group-hover:animate-[sparkle_1.6s_ease-in-out_infinite] motion-reduce:animate-none', anim: 'animate-[sparkle_2.4s_ease-in-out_infinite] motion-reduce:animate-none' },
    coins: { icon: Coins, color: 'text-yellow-500', ring: 'bg-yellow-500/10', hoverAnim: 'group-hover:animate-[coinBob_1.4s_ease-in-out_infinite] motion-reduce:animate-none', anim: 'animate-[coinBob_1.8s_ease-in-out_infinite] motion-reduce:animate-none' },
    gems: { icon: Gem, color: 'text-cyan-500', ring: 'bg-cyan-500/10', hoverAnim: 'group-hover:animate-[floaty_2.4s_ease-in-out_infinite] motion-reduce:animate-none', anim: 'animate-[floaty_3s_ease-in-out_infinite] motion-reduce:animate-none' },
    lives: { icon: Heart, color: 'text-red-500', ring: 'bg-red-500/10', hoverAnim: 'group-hover:animate-[heartbeat_1.4s_ease-in-out_infinite] motion-reduce:animate-none', anim: 'animate-[heartbeat_1.8s_ease-in-out_infinite] motion-reduce:animate-none' },
} as const;

function EconomyTile({ icon, value, label, help, animOnHover }: { icon: React.ReactNode; value: string | number; label: string; help: { title: string; body: string }; animOnHover?: string }) {
    return (
        <InfoTooltip title={help.title} body={help.body}>
            <button type="button" className="group flex w-full items-center gap-2 rounded-lg border bg-background/70 px-2 py-1.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${label}: ${value}. Ver explicación`}>
                <span className={cn('shrink-0', animOnHover)}>{icon}</span>
                <span className="min-w-0 leading-tight">
                    <strong className="block text-sm leading-none">{value}</strong>
                    <span className="block truncate text-[10px] text-muted-foreground">{label}</span>
                </span>
            </button>
        </InfoTooltip>
    );
}

// Guía animada de recursos usada dentro del diálogo "¿Cómo funcionan los puntos?".
function EconomyResourceCards() {
    return (
        <div className="grid gap-2.5 sm:grid-cols-2">
            {(Object.keys(ECONOMY_HELP) as (keyof typeof ECONOMY_HELP)[]).map(key => {
                const meta = ECONOMY_META[key];
                const item = ECONOMY_HELP[key];
                const Icon = meta.icon;
                return (
                    <div key={key} className="flex gap-3 rounded-2xl border bg-gradient-to-br from-muted/50 to-transparent p-3 shadow-sm">
                        <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', meta.ring)}>
                            <Icon className={cn('h-5 w-5', meta.color, meta.anim)} />
                        </span>
                        <div className="min-w-0">
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            <p className="mt-0.5 text-xs leading-snug">{item.body}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Formas de sumar puntos y recompensas (diálogo "Tu progreso en Andanzas").
const EARN_WAYS = [
    { icon: RouteIcon, label: 'Completar rutas guiadas' },
    { icon: Star, label: 'Dejar reseñas en los sitios' },
    { icon: Gamepad2, label: 'Jugar trivias y retos' },
    { icon: Calendar, label: 'Asistir a eventos culturales' },
    { icon: Heart, label: 'Guardar sitios en favoritos' },
    { icon: Share2, label: 'Compartir tus descubrimientos' },
] as const;

// Guía completa de progreso: reemplaza el bloque de texto denso por secciones claras.
function EconomyGuide() {
    return (
        <div className="space-y-4">
            <div className="flex gap-3 rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><TrendingUp className="h-5 w-5" /></span>
                <div className="min-w-0">
                    <h4 className="font-semibold text-foreground">Nivel y experiencia (XP)</h4>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">Cada actividad te da XP y te hace subir de nivel, desde <strong className="font-semibold text-foreground">Explorador Novato</strong> hasta <strong className="font-semibold text-foreground">Leyenda de Cali</strong>. Tu nivel acompaña siempre a tu avatar.</p>
                </div>
            </div>

            <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tus recursos</p>
                <EconomyResourceCards />
            </div>

            <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cómo sumar puntos y recompensas</p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                    {EARN_WAYS.map(w => {
                        const Icon = w.icon;
                        return (
                            <li key={w.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-2 text-xs font-medium">
                                <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span className="leading-tight">{w.label}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-snug">
                <Gamepad2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>En los juegos, las <strong className="font-semibold">vidas</strong> son intentos; las <strong className="font-semibold">monedas</strong> cubren compras frecuentes y las <strong className="font-semibold">gemas</strong>, beneficios de mayor valor. Tu máximo actual es de 3 vidas.</span>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 text-xs leading-snug">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span><strong className="font-semibold">Próximamente:</strong> vas a poder canjear tus <strong className="font-semibold">Puntos</strong> por beneficios y experiencias exclusivas, y usar tus <strong className="font-semibold">Monedas y Gemas</strong> para canjes dentro de la app.</span>
            </div>
        </div>
    );
}

// Qué guarda el perfil: contenido del diálogo "Tu memoria de ciudad".
const CITY_MEMORY_ITEMS = [
    { icon: MapPin, tone: 'text-primary bg-primary/10', title: 'Pasaporte y sellos', text: 'Los territorios que vas explorando quedan marcados, sello a sello.' },
    { icon: RouteIcon, tone: 'text-blue-500 bg-blue-500/10', title: 'Rutas y andanzas', text: 'Lo que ya caminaste, lo que está en progreso y lo que te espera.' },
    { icon: Award, tone: 'text-yellow-600 bg-yellow-500/10', title: 'Insignias y nivel', text: 'Reconocen tu curiosidad y tu constancia como explorador.' },
    { icon: Heart, tone: 'text-red-500 bg-red-500/10', title: 'Tus aportes', text: 'Reseñas, fotos y hallazgos que dejás para toda la comunidad.' },
    { icon: Sparkles, tone: 'text-emerald-500 bg-emerald-500/10', title: 'Tu avatar', text: 'Le pone rostro y personalidad a toda esta experiencia.' },
] as const;

function CityMemoryGuide() {
    return (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/90">
                No es una cuenta más: es la <strong className="font-semibold text-foreground">memoria de tu ciudad</strong>. Aquí queda viva la huella de lo que recorrés, descubrís y compartís en Cali.
            </p>
            <ul className="space-y-2">
                {CITY_MEMORY_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <li key={item.title} className="flex items-start gap-3">
                            <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', item.tone)}>
                                <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold leading-tight text-foreground">{item.title}</p>
                                <p className="text-xs leading-snug text-muted-foreground">{item.text}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <p className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-snug text-foreground/80">
                Cada cosa que hacés en Andanzas suma a esta memoria: mientras más recorrés, más rica se vuelve tu historia con la ciudad.
            </p>
        </div>
    );
}

const PerfilPanel: React.FC<PerfilPanelProps> = ({ favCount, reviewsCount, rutasCount, insigniasCount, onOpenInsigniasModal, routesInProgressCount, routesCompletedCount, favoriteSiteIds, sites, toggleFav, onOpenSite, onNavigate }) => {
    const { t, language } = useI18n();
    const { getHelp } = useHelpContent();
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
    const [economy, setEconomy] = useState<{ level: number; experience_points: number; level_start_xp: number; next_level_xp: number; app_points: number; coins: number; gems: number; lives: number; max_lives: number } | null>(null);
    const [gameSummary, setGameSummary] = useState({ sessions: 0, score: 0, questions: 0, correct: 0, accuracy: 0, bestStreak: 0 });
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [allBadges, setAllBadges] = useState<Insignia[]>([]);
    const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
    const [badgeProgress, setBadgeProgress] = useState<Record<string, number>>({});
    const [stamps, setStamps] = useState<PassportStamp[]>([]);
    const [dynamicBanners, setDynamicBanners] = useState(AVAILABLE_BANNERS);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const loadBanners = async () => {
            const dbBanners = await bannerService.getProfileBanners();
            if (dbBanners.length > 0) {
                const merged = AVAILABLE_BANNERS.map(b => {
                    const db = dbBanners.find(dbb => dbb.section_key === `profile_banner_${b.id}`);
                    if (db) {
                        return {
                            ...b,
                            image_url: db.image_url || b.image_url,
                            title: db.title || b.title,
                            unlock_condition: db.content_text || b.unlock_condition
                        };
                    }
                    return b;
                });
                setDynamicBanners(merged);
            }
        };
        loadBanners();
    }, []);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    
    // Gamification Modals
    const [showBannerGallery, setShowBannerGallery] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockData, setUnlockData] = useState({ type: 'banner' as 'banner' | 'badge', name: '', description: '' });

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState("");
    const [editCity, setEditCity] = useState("");

    const [availableAvatars, setAvailableAvatars] = useState<any[]>([]);

    React.useEffect(() => {
        if (user) {
            userService.getProfile(user.id).then((profile) => {
                setUserProfile(profile);
                if (profile) {
                    setEditName(profile.full_name || user.user_metadata?.full_name || "");
                    setEditCity(profile.city || user.user_metadata?.city || "");
                }
            });
            gamificationService.getEconomySummary().then(setEconomy);
            gamificationService.getUserGameSummary(user.id).then(setGameSummary).catch(error => console.error('Error loading game summary', error));

            // Load badges
            const loadBadges = async () => {
                try {
                    const all = await gamificationService.getAllBadges();
                    setAllBadges(all);
                    const earnedIds = await gamificationService.getUserBadgeIds(user.id);
                    setEarnedBadgeIds(earnedIds);
                    const progress = await gamificationService.getUserBadgeProgress(user.id);
                    setBadgeProgress(progress);
                    const userStamps = await gamificationService.getUserPassportStamps(user.id);
                    setStamps(userStamps);
                    const reviews = await reviewsService.getByUserId(user.id);
                    setMyReviews(reviews);
                } catch (err) {
                    console.error("Error loading profile data", err);
                }
            };
            const loadAvatars = async () => {
                const databaseAvatars = await userService.getAvatarPresets();
                setAvailableAvatars(databaseAvatars.length > 0 ? databaseAvatars : HARDCODED_AVATARS);
            };
            loadBadges();
            loadAvatars();
        }
    }, [user, showInterestsModal]); // Refresh when modal closes (interests might change)

    // Check for banner unlocks based on activity. Cada regla refleja la condición
    // que se muestra al usuario en la galería (BannerGalleryModal.AVAILABLE_BANNERS).
    React.useEffect(() => {
        if (!userProfile) return;

        const level = economy?.level || userProfile.level || 1;
        const savedRoutesCount = userProfile.saved_routes?.length || 0;

        const rules: { id: string; met: boolean; name: string; description: string }[] = [
            {
                id: 'banner_bulevar_rio',
                met: myReviews.length > 0,
                name: 'Banner: Bulevar del Río',
                description: '¡Por dejar tu primera reseña has desbloqueado una ilustración exclusiva para tu perfil!'
            },
            {
                id: 'banner_la_ermita',
                met: savedRoutesCount > 0,
                name: 'Banner: La Ermita',
                description: '¡Por guardar tu primera ruta has desbloqueado una ilustración exclusiva para tu perfil!'
            },
            {
                id: 'banner_tres_cruces',
                met: level >= 3,
                name: 'Banner: Cerro Tres Cruces',
                description: '¡Por alcanzar el Nivel 3 de Explorador has desbloqueado una ilustración exclusiva para tu perfil!'
            },
            {
                id: 'banner_torre_cali',
                met: routesCompletedCount > 0,
                name: 'Banner: Torre de Cali',
                description: '¡Por completar tu primera ruta guiada has desbloqueado una ilustración exclusiva para tu perfil!'
            },
            {
                id: 'banner_bulevar_oriente',
                met: insigniasCount >= 5,
                name: 'Banner: Bulevar de Oriente',
                description: '¡Por ganar 5 insignias culturales has desbloqueado una ilustración exclusiva para tu perfil!'
            },
        ];

        const alreadyUnlocked = userProfile.unlocked_banners || [];
        const newlyUnlocked = rules.filter(r => r.met && !alreadyUnlocked.includes(r.id));
        if (newlyUnlocked.length === 0) return;

        const newUnlocks = [...alreadyUnlocked, ...newlyUnlocked.map(r => r.id)];
        // Se muestra un solo modal a la vez (el primero desbloqueado en esta pasada).
        const triggeredUnlock = { type: 'banner' as const, name: newlyUnlocked[0].name, description: newlyUnlocked[0].description };

        userService.updateProfileData(userProfile.id, { unlocked_banners: newUnlocks }).then(() => {
            setUserProfile(prev => prev ? { ...prev, unlocked_banners: newUnlocks } : null);
            setUnlockData(triggeredUnlock);
            setShowUnlockModal(true);
        });
    }, [myReviews.length, userProfile?.saved_routes?.length, economy?.level, routesCompletedCount, insigniasCount]);

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

    const handleSelectAvatar = async (url: { id: string, image_url: string }) => {
        setLoading(true);
        try {
            await userService.updateProfileData(user!.id, { avatar_url: url.image_url, selected_avatar_id: url.id });
            // Force refresh user profile
            const updatedProfile = await userService.getProfile(user!.id);
            setUserProfile(updatedProfile);
            toast.success("¡Avatar actualizado!");
            setShowAvatarModal(false);
            
            // To update auth session metadata we must force a refresh (workaround for local state)
            // But since we use userProfile state mostly, it should be enough for the UI.
        } catch (e) {
            console.error(e);
            toast.error("Error al actualizar el avatar");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await userService.updateProfileData(user!.id, {
                full_name: editName,
                city: editCity
            });
            const updatedProfile = await userService.getProfile(user!.id);
            setUserProfile(updatedProfile);
            toast.success("¡Datos actualizados!");
            setIsEditingProfile(false);
        } catch (e) {
            console.error(e);
            toast.error("Error al actualizar datos");
        } finally {
            setLoading(false);
        }
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
            if (err.message && (err.message.includes('already registered') || err.message.includes('User already registered'))) {
                setErrorMsg('Este correo ya está registrado. Por favor intenta iniciar sesión.');
            } else if (err.message && err.message.includes('Invalid login credentials')) {
                setErrorMsg('Correo o contraseña incorrectos.');
            } else {
                setErrorMsg(err.message || "Error de autenticación");
            }
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
                                                placeholder="Ej: Cali, Valle del Cauca"
                                                value={formCity}
                                                onChange={(e) => setFormCity(e.target.value)}
                                                list="city-options"
                                            />
                                            <datalist id="city-options">
                                                {COLOMBIAN_CITIES.map((city) => (
                                                    <option key={city} value={city} />
                                                ))}
                                            </datalist>
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

    const displayName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Explorador";
    const economyHelp = getHelp('economy');

    const getLevelTitle = (lvl: number) => {
        if (!lvl || lvl < 3) return language === 'es' ? 'Explorador Novato' : 'Novice Explorer';
        if (lvl < 6) return language === 'es' ? 'Caminante Urbano' : 'Urban Trekker';
        if (lvl < 10) return language === 'es' ? 'Maestro Cultural' : 'Culture Master';
        return language === 'es' ? 'Leyenda de Cali' : 'Legend of Cali';
    };

    // Gamification Progress Math
    const currentLevel = economy?.level || userProfile?.level || 1;
    const currentXp = economy?.experience_points || userProfile?.experience_points || 0;
    const levelStartXp = economy?.level_start_xp || (100 * Math.pow(currentLevel - 1, 2));
    const nextLevelXp = economy?.next_level_xp || (100 * Math.pow(currentLevel, 2));
    const xpWithinLevel = Math.max(0, currentXp - levelStartXp);
    const xpNeededThisLevel = Math.max(1, nextLevelXp - levelStartXp);
    const progressPercent = Math.min(100, Math.round((xpWithinLevel / xpNeededThisLevel) * 100));

    const currentAvatarUrl = userProfile?.selected_avatar_id || userProfile?.avatar_url || user?.user_metadata?.avatar_url;
    
    // Get active banner image URL
    const activeBannerUrl = userProfile?.selected_banner_id 
        ? dynamicBanners.find(b => b.id === userProfile.selected_banner_id)?.image_url 
        : null;

    return (
        <ScrollArea className="max-h-[72vh] w-full">
            <div className="p-3 pr-5 sm:pr-6 space-y-6 w-full max-w-full overflow-x-hidden pb-12">

                {/* Incomplete Profile Banner */}
                {userProfile && (!userProfile.full_name || !currentAvatarUrl || !userProfile.interests?.length) && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 mt-0.5">
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-800 dark:text-amber-200 text-sm">Perfil Incompleto</h4>
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                    Terminá de completar tu perfil para guardar rutas, recibir sellos y personalizar tu experiencia.
                                    {!userProfile.full_name && " Faltan tus datos."}
                                    {!currentAvatarUrl && " Falta tu avatar."}
                                    {!userProfile.interests?.length && " Faltan tus intereses."}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white shrink-0 shadow-sm"
                            onClick={() => setShowSettingsModal(true)}
                        >
                            Completar Perfil
                        </Button>
                    </div>
                )}

                {/* Header Profile Section */}
                <div className="relative rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                    {activeBannerUrl ? (
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${activeBannerUrl})` }}>
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm sm:backdrop-blur-none sm:bg-gradient-to-t sm:from-background sm:via-background/80 sm:to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50" />
                    )}
                    
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute top-4 right-4 z-20 rounded-full shadow-md bg-background/50 backdrop-blur-md border border-border/50 hover:bg-background/80"
                        onClick={() => setShowBannerGallery(true)}
                        title="Cambiar fondo"
                    >
                        <ImageIcon className="h-4 w-4 text-foreground" />
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute top-4 right-16 z-20 rounded-full shadow-md bg-background/50 backdrop-blur-md border border-border/50 hover:bg-background/80"
                        onClick={() => setShowSettingsModal(true)}
                        title="Ajustes de perfil"
                    >
                        <Settings className="h-4 w-4 text-foreground" />
                    </Button>

                    <InfoHint
                        title="Tu memoria de ciudad"
                        trigger={
                            <button
                                type="button"
                                aria-label="Qué es tu perfil"
                                title="Qué es tu perfil"
                                className="absolute left-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-foreground shadow-md backdrop-blur-md transition-colors hover:bg-background/80"
                            >
                                <Info className="h-4 w-4" />
                            </button>
                        }
                    >
                        <CityMemoryGuide />
                    </InfoHint>

                    <aside className="absolute right-6 top-1/2 z-10 hidden w-56 -translate-y-1/2 rounded-2xl border bg-background/75 p-3 shadow-sm backdrop-blur-md xl:block">
                        <p className="mb-2 text-left text-[11px] font-bold uppercase tracking-widest text-primary">Tus recursos</p>
                        <div className="grid grid-cols-2 gap-1.5">
                            <EconomyTile icon={<Sparkles className="h-4 w-4 text-emerald-500" />} value={economy?.app_points ?? userProfile?.points ?? 0} label="Puntos" help={ECONOMY_HELP.points} animOnHover={ECONOMY_META.points.hoverAnim} />
                            <EconomyTile icon={<Coins className="h-4 w-4 text-yellow-500" />} value={economy?.coins ?? 0} label="Monedas" help={ECONOMY_HELP.coins} animOnHover={ECONOMY_META.coins.hoverAnim} />
                            <EconomyTile icon={<Gem className="h-4 w-4 text-cyan-500" />} value={economy?.gems ?? 0} label="Gemas" help={ECONOMY_HELP.gems} animOnHover={ECONOMY_META.gems.hoverAnim} />
                            <EconomyTile icon={<Heart className="h-4 w-4 text-red-500" />} value={`${economy?.lives ?? 0}/${economy?.max_lives ?? 3}`} label="Vidas" help={ECONOMY_HELP.lives} animOnHover={ECONOMY_META.lives.hoverAnim} />
                        </div>
                    </aside>

                    <div className="relative z-10 flex flex-col items-center p-6 pt-12 text-center xl:min-h-[300px] xl:justify-center">
                        <div className="relative mb-4 cursor-pointer group" onClick={() => setShowAvatarModal(true)}>
                            {/* Circular Progress SVG */}
                            <svg className="absolute -inset-2 w-[112px] h-[112px] -rotate-90">
                                <circle 
                                    cx="56" cy="56" r="52" 
                                    className="stroke-muted fill-none" 
                                    strokeWidth="4"
                                />
                                <circle 
                                    cx="56" cy="56" r="52" 
                                    className="stroke-primary fill-none transition-all duration-1000 ease-out" 
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray="326.72"
                                    strokeDashoffset={326.72 - (326.72 * progressPercent) / 100}
                                />
                            </svg>

                            <div className="w-24 h-24 rounded-full relative bg-background border-4 border-background overflow-hidden grid place-items-center shadow-lg group-hover:brightness-90 transition-all">
                                <UserAvatar userProfile={userProfile} className="w-full h-full border-0" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 transform left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
                                Lvl {currentLevel}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-1 mt-2">{displayName}</h2>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mb-2">
                            {getLevelTitle(currentLevel)}
                        </p>
                        <p className="text-xs text-primary font-medium flex items-center justify-center gap-1.5 mb-5 bg-primary/10 px-3 py-1 rounded-full">
                            {xpWithinLevel} / {xpNeededThisLevel} XP para el siguiente nivel
                        </p>

                        <div className="flex gap-4 w-full max-w-sm justify-center">
                            <div className="flex flex-col items-center p-3 bg-background/50 rounded-xl flex-1 backdrop-blur-sm border shadow-sm cursor-pointer hover:bg-background/80 transition-colors" onClick={() => setActiveTab('badges')}>
                                <span className="text-xl font-bold text-foreground">{insigniasCount}</span>
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">{t('profile.badges')}</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-background/50 rounded-xl flex-1 backdrop-blur-sm border shadow-sm cursor-pointer hover:bg-background/80 transition-colors" onClick={() => setActiveTab('activity')}>
                                <span className="text-xl font-bold text-foreground">{myReviews.length + myFavorites.length}</span>
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Aportes</span>
                            </div>
                        </div>
                        <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4 xl:hidden">
                            <EconomyTile icon={<Sparkles className="h-4 w-4 text-emerald-500" />} value={economy?.app_points ?? userProfile?.points ?? 0} label="Puntos" help={ECONOMY_HELP.points} animOnHover={ECONOMY_META.points.hoverAnim} />
                            <EconomyTile icon={<Coins className="h-4 w-4 text-yellow-500" />} value={economy?.coins ?? 0} label="Monedas" help={ECONOMY_HELP.coins} animOnHover={ECONOMY_META.coins.hoverAnim} />
                            <EconomyTile icon={<Gem className="h-4 w-4 text-cyan-500" />} value={economy?.gems ?? 0} label="Gemas" help={ECONOMY_HELP.gems} animOnHover={ECONOMY_META.gems.hoverAnim} />
                            <EconomyTile icon={<Heart className="h-4 w-4 text-red-500" />} value={`${economy?.lives ?? 0}/${economy?.max_lives ?? 3}`} label="Vidas" help={ECONOMY_HELP.lives} animOnHover={ECONOMY_META.lives.hoverAnim} />
                        </div>

                        <InfoHint
                            title={economyHelp.title}
                            trigger={
                                <button type="button" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                                    <Info className="w-3.5 h-3.5" /> {language === 'es' ? '¿Cómo funcionan los puntos?' : 'How do points work?'}
                                </button>
                            }
                        >
                            <EconomyGuide />
                        </InfoHint>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <ScrollArea className="relative w-full whitespace-nowrap mb-6">
                        <TabsList className="inline-flex h-12 w-full justify-start rounded-xl bg-muted/50 p-1">
                            <TabsTrigger value="overview" className="rounded-lg px-4 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm flex-shrink-0">Pasaporte</TabsTrigger>
                            <TabsTrigger value="rutas" className="rounded-lg px-4 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm flex-shrink-0">Rutas</TabsTrigger>
                            <TabsTrigger value="badges" className="rounded-lg px-4 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm flex-shrink-0">Insignias</TabsTrigger>
                            <TabsTrigger value="games" className="rounded-lg px-4 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm flex-shrink-0">Juegos</TabsTrigger>
                            <TabsTrigger value="activity" className="rounded-lg px-4 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm flex-shrink-0">Aportes</TabsTrigger>
                        </TabsList>
                        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background pointer-events-none" />
                    </ScrollArea>
                    <p className="-mt-4 mb-6 px-2 text-sm text-muted-foreground">
                        {activeTab === 'overview' && 'Tu pasaporte reúne la memoria de tus recorridos y los sellos que representan territorios explorados.'}
                        {activeTab === 'rutas' && 'Consulta las rutas que guardaste, empezaste o completaste y elegí tu próxima andanza.'}
                        {activeTab === 'badges' && 'Las insignias reconocen acciones y constancia; algunas evolucionan de bronce a plata y oro.'}
                        {activeTab === 'games' && 'Revisa partidas, precisión, rachas y puntos obtenidos en los juegos culturales.'}
                        {activeTab === 'activity' && 'Tus aportes conservan reseñas, favoritos y otras huellas que compartís con la comunidad.'}
                    </p>

                    <TabsContent value="overview" className="space-y-6 mt-0">
                        {/* Experiencias Vividas */}
                        <div className="grid grid-cols-2 gap-3">
                            <Card className="overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none shadow-sm">
                                <CardContent className="p-4 pt-4 flex flex-col gap-2">
                                    <Map className="h-5 w-5 text-blue-500" />
                                    <span className="text-2xl font-bold">{routesCompletedCount}</span>
                                    <span className="text-xs opacity-70">Rutas Completadas</span>
                                </CardContent>
                            </Card>
                            <Card className="overflow-hidden bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-none shadow-sm cursor-pointer hover:bg-yellow-500/20 transition-colors" onClick={() => setActiveTab('badges')}>
                                <CardContent className="p-4 pt-4 flex flex-col gap-2">
                                    <Award className="h-5 w-5 text-yellow-600" />
                                    <span className="text-2xl font-bold">{insigniasCount}</span>
                                    <span className="text-xs opacity-70">Insignias Ganadas</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sellos: viven dentro del Pasaporte para mantener la coherencia del concepto */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <Map className="h-4 w-4 text-primary" /> Mis Sellos
                                </h3>
                                <span className="text-xs text-muted-foreground">{stamps.length + (routesCompletedCount > 0 ? 1 : 0)} coleccionados</span>
                            </div>
                            <Card className="border-2 border-border bg-card overflow-hidden relative shadow-sm">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                                <CardContent className="p-5 pt-5 flex gap-4 overflow-x-auto snap-x hide-scrollbar">
                                    
                                    {/* Cali Stamp (Dynamic) */}
                                    {(() => {
                                        // Calculate total experiences dynamically based on user stats
                                        const totalExperiences = routesCompletedCount + (myReviews?.length || 0);
                                        // If no experiences, show a faded "Próximamente" state or early state.
                                        // But requirements said "aparecerá si tiene al menos 1 experiencia". 
                                        // However, providing a faded placeholder motivates them.
                                        
                                        // Stamp styles logic
                                        const isLevel1 = totalExperiences >= 1 && totalExperiences <= 4;
                                        const isLevel2 = totalExperiences >= 5 && totalExperiences <= 9;
                                        const isLevel3 = totalExperiences >= 10;
                                        const hasAnyExperience = totalExperiences > 0;
                                        
                                        const getStampStyle = () => {
                                            if (isLevel3) return 'border-yellow-400 bg-yellow-100/50 shadow-[0_0_15px_rgba(250,204,21,0.5)]';
                                            if (isLevel2) return 'border-primary bg-primary/10 shadow-sm';
                                            if (isLevel1) return 'border-border bg-background shadow-sm';
                                            return 'border-dashed border-border bg-muted/20 opacity-50 grayscale'; // Level 0
                                        };
                                        
                                        const getInnerStyle = () => {
                                            if (isLevel3) return 'bg-yellow-400/20 text-yellow-700';
                                            if (isLevel2) return 'bg-primary/20 text-primary-foreground';
                                            return 'bg-muted text-muted-foreground';
                                        };

                                        return (
                                            <div className="flex flex-col items-center gap-2 snap-center shrink-0 w-32 group cursor-pointer relative">
                                                {isLevel3 && (
                                                    <div className="absolute -top-3 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-md">
                                                        Oro
                                                    </div>
                                                )}
                                                
                                                {/* Sello postal: doble borde (externo sólido + interno punteado) sobre esquinas redondeadas */}
                                                <div className={`w-24 h-28 relative flex flex-col items-center justify-center p-1.5 rounded-lg border-2 overflow-hidden transition-transform group-hover:scale-105 duration-300 ${getStampStyle()}`}>

                                                    <div className={`w-full h-full border border-dashed rounded-sm flex flex-col items-center justify-center overflow-hidden p-1 ${isLevel3 ? 'border-yellow-500/50' : 'border-border'}`}>
                                                        <div className={`mb-1 h-1/2 w-full overflow-hidden rounded-sm ${getInnerStyle()} ${!hasAnyExperience ? 'grayscale opacity-40' : ''}`}>
                                                            <img src="/images/rewards/sello-cali-v2.webp" alt="Ilustración del sello de Santiago de Cali" className="h-full w-full object-cover" />
                                                        </div>
                                                        <span className={`text-[12px] font-black uppercase drop-shadow-sm tracking-widest mt-1 ${isLevel3 ? 'text-yellow-600' : (hasAnyExperience ? 'text-foreground' : 'text-muted-foreground')}`}>
                                                            Cali
                                                        </span>
                                                        <span className="text-[8px] font-mono opacity-60">
                                                            {hasAnyExperience ? `${totalExperiences} EXP` : '0 EXP'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-center mt-1 w-32 px-1">
                                                    <span className="text-xs font-bold leading-tight block w-full">
                                                        Santiago de Cali
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground block w-full leading-tight">
                                                        {isLevel3 ? 'Leyenda Urbana' : (isLevel2 ? 'Explorador Frecuente' : (isLevel1 ? 'Iniciando Viaje' : 'Por descubrir'))}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* Future region placeholder */}
                                    <div className="flex flex-col items-center gap-2 snap-center shrink-0 w-32 opacity-40 grayscale">
                                        <div className="w-24 h-28 rounded-lg border-2 border-muted border-dashed bg-muted/20 overflow-hidden flex flex-col items-center justify-center p-2">
                                            <div className="w-full h-full border border-dashed border-muted rounded-sm flex items-center justify-center">
                                                <GameMascot icon="leaf" accent="#1F9E5A" size={36} />
                                            </div>
                                        </div>
                                        <div className="text-center mt-1">
                                            <span className="text-xs font-bold leading-tight block">Valle del Cauca</span>
                                            <span className="text-[10px] text-muted-foreground block">Próximamente</span>
                                        </div>
                                    </div>
                                    
                                    {stamps.filter(s => s.stamp_type !== 'city' && s.city !== 'Cali').map((stamp, idx) => (
                                        <div key={stamp.id} className="flex flex-col items-center gap-2 snap-center shrink-0 w-32 group cursor-pointer relative">
                                            {/* Sellos adicionales: color de acento del tema aplicado por estilo inline
                                                (las clases Tailwind dinámicas se purgan en build, por eso no se usaban colores por clase) */}
                                            <div
                                                className="w-24 h-28 rounded-lg border-2 overflow-hidden flex flex-col items-center justify-center p-1.5 bg-primary/5 transition-transform group-hover:scale-105 duration-300"
                                                style={{ borderColor: stamp.color_theme || 'hsl(var(--primary) / 0.6)' }}
                                            >
                                                <div className="w-full h-full border border-dashed border-border rounded-sm flex flex-col items-center justify-center overflow-hidden">
                                                    {stamp.image_url ? (
                                                        <img src={stamp.image_url} alt={stamp.title} className="w-full h-full object-cover opacity-90" />
                                                    ) : (
                                                        <span className="text-[10px] font-black uppercase drop-shadow-sm rotate-[-15deg] opacity-80 text-primary">{stamp.city || 'Sellado'}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-center mt-1 w-32 px-1">
                                                <span className="text-xs font-bold leading-tight block w-full line-clamp-2">{stamp.title}</span>
                                                {stamp.subtitle && <span className="text-[10px] text-muted-foreground block w-full leading-tight line-clamp-1">{stamp.subtitle}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Rutas Tab */}
                    <TabsContent value="rutas" className="space-y-6 mt-0">
                        <Card className="border-dashed border-2 border-primary/20 shadow-none bg-primary/5 hover:bg-primary/10 transition-colors">
                            <CardContent className="p-8 pt-8 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <RouteIcon className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-base font-bold text-primary mb-1">Mis Rutas</p>
                                <p className="text-sm text-muted-foreground mb-4 max-w-sm">Aquí verás las rutas que tienes por andar, las que están en progreso y las que ya finalizaste.</p>
                                <Button variant="default" className="rounded-full shadow-lg shadow-primary/20" onClick={() => onNavigate('rutas')}>Explorar Rutas</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="badges" className="mt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {allBadges.length > 0 ? (
                                allBadges.map(badge => (
                                    <BadgeCard
                                        key={badge.id}
                                        insignia={badge}
                                        obtenida={earnedBadgeIds.includes(String(badge.id))}
                                        progress={badge.family_key ? badgeProgress[badge.family_key] : undefined}
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

                    <TabsContent value="games" className="mt-0 space-y-6">
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <StatItem icon={Gamepad2} label="Partidas" value={gameSummary.sessions} />
                            <StatItem icon={Trophy} label="Puntos en juegos" value={gameSummary.score} />
                            <StatItem icon={Target} label="Precisión" value={`${gameSummary.accuracy}%`} />
                            <StatItem icon={Flame} label="Mejor racha" value={gameSummary.bestStreak} />
                        </div>
                        <Card className="border-2 border-purple-500/20 shadow-none bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-orange-500/10 transition-colors">
                            <CardContent className="p-8 pt-8 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                                    <Trophy className="h-8 w-8 text-purple-600" />
                                </div>
                                <p className="text-base font-bold text-purple-600 mb-1">Mi Rendimiento en Juegos</p>
                                <p className="text-sm text-muted-foreground mb-4 max-w-md">Has respondido {gameSummary.questions} preguntas y acertado {gameSummary.correct}. Sigue jugando para mejorar tu precisión, superar tu mejor racha y ampliar tu memoria cultural.</p>
                                <Button variant="outline" className="rounded-full text-purple-600 border-purple-200 hover:bg-purple-50" onClick={() => onNavigate('juegos')}>Ir a Juegos</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-0 space-y-6">
                        {/* Recent Activity Feed */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-primary" /> Actividad Reciente
                            </h3>
                            {myReviews.length > 0 ? (
                                <div className="space-y-3 pl-2 border-l-2 border-muted ml-2">
                                    {myReviews.slice(0, 3).map(review => {
                                        const site = sites.find(s => s.id === review.siteId);
                                        return (
                                            <div key={review.id} className="relative pl-4">
                                                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[23px] top-1.5 ring-4 ring-background" />
                                                <Card className="border-none shadow-sm bg-muted/20 hover:bg-muted/40 transition-colors">
                                                    <CardContent className="p-3 pt-3">
                                                        <p className="text-xs text-muted-foreground mb-1">Escribiste una reseña en</p>
                                                        <h4 className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors" onClick={() => site && onOpenSite(site)}>
                                                            {site ? getTranslated(site, 'nombre', language) : 'Sitio desconocido'}
                                                        </h4>
                                                        <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            <span>{review.rating}/5</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <Card className="border-dashed border-2 border-primary/20 shadow-none bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                                    <CardContent className="p-8 pt-8 text-center flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                            <MapPin className="h-8 w-8 text-primary" />
                                        </div>
                                        <p className="text-base font-bold text-primary mb-1">Aún no hay actividad reciente</p>
                                        <p className="text-sm text-muted-foreground mb-4">¡El mapa te espera! Empieza a explorar la ciudad y deja tu huella.</p>
                                        <Button variant="default" className="rounded-full shadow-lg shadow-primary/20" onClick={() => onNavigate('explorar')}>Descubrir Sitios</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Favorites Section */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Heart className="h-4 w-4 text-primary" /> {t('profile.favorites')} ({myFavorites.length})
                            </h3>
                            {myFavorites.length > 0 ? (
                                <div className="grid gap-2">
                                    {myFavorites.map(site => (
                                        <Card
                                            key={site.id}
                                            className="group overflow-hidden border-none shadow-sm bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                                            onClick={() => onOpenSite(site)}
                                        >
                                            <CardContent className="flex p-3 pt-3 gap-3">
                                                <div className="h-16 w-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                                                    <img src={site.logoUrl} alt={site.nombre} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-semibold truncate">{getTranslated(site, 'nombre', language)}</h4>
                                                    <p className="text-xs text-muted-foreground truncate">{getMacroCategory(getTranslated(site, 'tipo', language) as string, language)}</p>
                                                </div>
                                                <div className="flex flex-col justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFav(site.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-dashed border-2 border-pink-500/20 shadow-none bg-pink-500/5 hover:bg-pink-500/10 transition-colors cursor-pointer">
                                    <CardContent className="p-6 pt-6 text-center flex flex-col items-center">
                                        <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-3">
                                            <Heart className="h-8 w-8 text-pink-500" />
                                        </div>
                                        <p className="text-sm font-bold text-pink-600 dark:text-pink-400 mb-1">Aún no tienes favoritos</p>
                                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Guarda los sitios que más te gusten tocando el corazón. Así armarás tu propia ruta personal.</p>
                                        <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50 dark:border-pink-900 dark:hover:bg-pink-950 rounded-full" onClick={() => onNavigate('explorar')}>Encontrar favoritos</Button>
                                    </CardContent>
                                </Card>
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
                                            <Card
                                                key={review.id}
                                                className="border-none shadow-sm bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                                                onClick={() => site && onOpenSite(site)}
                                            >
                                                <CardContent className="p-3 pt-3 space-y-2">
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteReview(review.id);
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    {review.text && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">"{review.text}"</p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Card className="border-dashed border-2 border-orange-500/20 shadow-none bg-orange-500/5 hover:bg-orange-500/10 transition-colors cursor-pointer">
                                    <CardContent className="p-6 pt-6 text-center flex flex-col items-center">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3">
                                            <MessageSquare className="h-8 w-8 text-orange-500" />
                                        </div>
                                        <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-1">Sin reseñas</p>
                                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Tus aportes ayudan a que la comunidad crezca. Deja tu opinión en los sitios que visites.</p>
                                        <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-900 dark:hover:bg-orange-950 rounded-full" onClick={() => onNavigate('explorar')}>Escribir una reseña</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Avatar Selection Modal */}
                <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
                    <DialogContent className="max-w-xs sm:max-w-sm rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-center font-bold text-xl">Elige tu Avatar</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* Current Google Avatar if exists */}
                            {user?.user_metadata?.avatar_url && !user?.user_metadata?.avatar_url.includes('/avatars/') && (
                                <div 
                                    className={`relative cursor-pointer flex flex-col items-center gap-2 group p-2 rounded-xl transition-all ${currentAvatarUrl === user.user_metadata.avatar_url ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}
                                    onClick={() => handleSelectAvatar({ id: 'google', image_url: user.user_metadata.avatar_url })}
                                >
                                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                                        <img src={user.user_metadata.avatar_url} alt="Google Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs font-semibold text-center">Foto de Google</span>
                                </div>
                            )}

                            {/* Custom Avatars */}
                            {availableAvatars.map(avatar => (
                                <div 
                                    key={avatar.id} 
                                    className={`relative cursor-pointer flex flex-col items-center gap-2 group p-3 rounded-xl transition-all border ${currentAvatarUrl === avatar.image_url ? 'bg-primary/10 border-primary shadow-sm' : 'border-transparent hover:bg-muted'}`}
                                    onClick={() => handleSelectAvatar({ id: avatar.id, image_url: avatar.image_url })}
                                >
                                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform bg-muted border-2 border-background">
                                        <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-sm font-bold leading-none mb-1">{avatar.name}</span>
                                        {avatar.personality_title && (
                                            <span className="block text-[10px] text-primary font-medium">{avatar.personality_title}</span>
                                        )}
                                        {avatar.phrase && (
                                            <span className="block text-[9px] text-muted-foreground mt-1 italic leading-tight">"{avatar.phrase}"</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Settings Modal */}
                <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
                    <DialogContent className="max-w-sm rounded-3xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" /> 
                                Configuración
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                            {isEditingProfile ? (
                                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-muted">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Alias o Seudónimo</label>
                                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-9" placeholder="Tu alias" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Ciudad</label>
                                        <Input value={editCity} onChange={e => setEditCity(e.target.value)} className="h-9" placeholder="Ej: Cali" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Correo Electrónico (Solo Lectura)</label>
                                        <Input value={userProfile?.email || user?.email || ""} disabled className="h-9 bg-muted/50 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Fecha de Nacimiento (Solo Lectura)</label>
                                        <Input value={user?.user_metadata?.birth_date || "No registrada"} disabled className="h-9 bg-muted/50 cursor-not-allowed" />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsEditingProfile(false)}>Cancelar</Button>
                                        <Button size="sm" className="flex-1" onClick={handleSaveProfile} disabled={loading}>
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                                    <div>
                                        <h4 className="text-sm font-semibold">Datos del Explorador</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{editName || displayName}</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => setIsEditingProfile(true)} className="rounded-full h-8">
                                        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                                        {t('edit')}
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-semibold">{language === 'es' ? 'Preferencias de Viaje' : 'Travel Preferences'}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {userProfile?.interests && userProfile.interests.length > 0
                                            ? `${userProfile.interests.length} intereses configurados`
                                            : (language === 'es' ? 'Configura tu perfil' : 'Setup your profile')}
                                    </p>
                                </div>
                                <Button size="sm" onClick={() => setShowInterestsModal(true)} className="rounded-full h-8">
                                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                                    {t('edit')}
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-semibold">{t('profile.enableNotifications')}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Alertas de rutas y logros</p>
                                </div>
                                <Switch defaultChecked id="notifications-switch" />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-semibold">Perfil Accesible</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Guardar preferencias de accesibilidad en tu cuenta</p>
                                </div>
                                <Switch 
                                    checked={userProfile?.accessibility_preferences?.persist || false} 
                                    onChange={async (e) => {
                                        const checked = e.target.checked;
                                        if (user) {
                                            const updatedPrefs = { ...userProfile?.accessibility_preferences, persist: checked };
                                            await userService.updateProfileData(user.id, { accessibility_preferences: updatedPrefs });
                                            setUserProfile(prev => prev ? { ...prev, accessibility_preferences: updatedPrefs } : prev);
                                            toast.success("Preferencias guardadas");
                                        }
                                    }} 
                                    id="accessibility-persist-switch" 
                                />
                            </div>

                            <div className="flex flex-col gap-2 p-3 bg-muted/40 rounded-xl">
                                <h4 className="text-sm font-semibold">Documentos Legales</h4>
                                <div className="flex gap-4 mt-1">
                                    <a href="/terms" className="text-xs text-primary hover:underline">Términos de Servicio</a>
                                    <a href="/privacy" className="text-xs text-primary hover:underline">Política de Privacidad</a>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Aceptados el {userProfile?.legal_accepted_at ? new Date(userProfile.legal_accepted_at).toLocaleDateString() : 'fecha de registro'}</p>
                            </div>
                            
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setShowSettingsModal(false);
                                    logout();
                                }} 
                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-11 rounded-xl mt-4 font-semibold"
                            >
                                <LogIn className="h-4 w-4 mr-2 rotate-180" />
                                {t('logOutButton')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
            <OnboardingModal isOpen={showInterestsModal} onClose={() => setShowInterestsModal(false)} isEditing={true} />
            <BannerGalleryModal 
                open={showBannerGallery}
                onOpenChange={setShowBannerGallery}
                unlockedBanners={userProfile?.unlocked_banners || []}
                selectedBannerId={userProfile?.selected_banner_id}
                onBannerSelected={(id) => {
                    setUserProfile(prev => prev ? { ...prev, selected_banner_id: id } : null);
                }}
                dynamicBanners={dynamicBanners}
            />

            <RewardUnlockModal
                open={showUnlockModal}
                onOpenChange={setShowUnlockModal}
                rewardType={unlockData.type}
                rewardName={unlockData.name}
                description={unlockData.description}
                onActionClick={() => setShowBannerGallery(true)}
            />
        </ScrollArea>
    );
};

export default PerfilPanel;
