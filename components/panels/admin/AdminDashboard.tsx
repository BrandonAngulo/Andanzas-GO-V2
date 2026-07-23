import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { ScrollArea } from '../../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { useUserData } from '../../../contexts/UserDataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ShieldAlert, Users, Map, BookOpen, Settings, Gamepad2, Landmark, Megaphone, Activity, Info, Calendar, Smile, MessageSquare, UserX, Image, HelpCircle, User, Handshake } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { useI18n } from '../../../i18n';
import { AdminCuriosidades } from './AdminCuriosidades';
import { AdminRutas } from './AdminRutas';
import { AdminRutasPersonalizadas } from './AdminRutasPersonalizadas';
import { AdminAlianzas } from './AdminAlianzas';
import { AdminJuegos } from './AdminJuegos';
import { AdminSitios } from './AdminSitios';
import { AdminEventos } from './AdminEventos';
import { AdminIntroModal } from './AdminIntroModal';
import { AdminNoticias } from './AdminNoticias';
import { AdminSettings } from './AdminSettings';
import { AdminUsuarios } from './AdminUsuarios';
import { AdminInstitucional } from './AdminInstitucional';
import { AdminBanners } from './AdminBanners';
import { AdminHelpContent } from './AdminHelpContent';
import { CuriousFactsManager } from './CuriousFactsManager';
import { AdminMetricas } from './AdminMetricas';
import { AdminAvatarsManager } from './AdminAvatarsManager';
import { AdminDocumentosLegales } from './AdminDocumentosLegales';
import { AdminDictionary } from './AdminDictionary';
import { JuegosAnalyticsPanel } from './JuegosAnalyticsPanel';
import { userService } from '../../../services/user.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';

const ADMIN_TUTORIAL_VERSION = 'admin-v1';

const AdminOverview = () => {
    const [counts, setCounts] = useState({
        users: 0, bannedUsers: 0, reviews: 0, gameSessions: 0, rutaRegistrations: 0,
        sites: 0, rutas: 0, events: 0, news: 0, games: 0, questions: 0, curiosities: 0, avatars: 0, banners: 0
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [
                    { count: usersCount },
                    { count: bannedUsersCount },
                    { count: reviewsCount },
                    { count: gameSessionsCount },
                    { count: rutaRegistrationsCount },
                    { count: sitesCount },
                    { count: rutasCount },
                    { count: eventsCount },
                    { count: newsCount },
                    { count: gamesCount },
                    { count: questionsCount },
                    { count: curiositiesCount },
                    { count: avatarsCount },
                    { count: bannersCount }
                ] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'banned'),
                    supabase.from('reviews').select('*', { count: 'exact', head: true }),
                    supabase.from('game_sessions').select('*', { count: 'exact', head: true }),
                    supabase.from('user_route_progress').select('*', { count: 'exact', head: true }),
                    
                    supabase.from('sites').select('*', { count: 'exact', head: true }),
                    supabase.from('routes').select('*', { count: 'exact', head: true }),
                    supabase.from('events').select('*', { count: 'exact', head: true }),
                    supabase.from('feed_items').select('*', { count: 'exact', head: true }),
                    supabase.from('games').select('*', { count: 'exact', head: true }),
                    supabase.from('game_questions').select('*', { count: 'exact', head: true }),
                    supabase.from('curious_facts').select('*', { count: 'exact', head: true }),
                    supabase.from('avatar_presets').select('*', { count: 'exact', head: true }),
                    supabase.from('app_banners').select('*', { count: 'exact', head: true })
                ]);
                
                setCounts({
                    users: usersCount || 0,
                    bannedUsers: bannedUsersCount || 0,
                    reviews: reviewsCount || 0,
                    gameSessions: gameSessionsCount || 0,
                    rutaRegistrations: rutaRegistrationsCount || 0,

                    sites: sitesCount || 0,
                    rutas: rutasCount || 0,
                    events: eventsCount || 0,
                    news: newsCount || 0,
                    games: gamesCount || 0,
                    questions: questionsCount || 0,
                    curiosities: curiositiesCount || 0,
                    avatars: avatarsCount || 0,
                    banners: bannersCount || 0
                });
            } catch (err) {
                console.error("Error fetching admin overview counts:", err);
            }
        };
        fetchCounts();
    }, []);

    return (
        <div className="mt-4 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Seccin de Usuarios */}
            <div className="bg-background rounded-2xl p-6 border shadow-sm">
                <h3 className="text-xl font-bold mb-6 border-b pb-3 flex items-center gap-2 text-primary">
                    <Users className="h-5 w-5" /> 
                    Métricas de Usuarios y Actividad
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Users className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.users}</div>
                            <p className="text-xs text-muted-foreground mt-1">Registrados en el sistema</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-destructive/5 shadow-none hover:bg-destructive/10 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <UserX className="h-6 w-6 text-destructive mb-1" />
                            <CardTitle className="text-sm font-medium text-destructive">Usuarios Suspendidos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold text-destructive">{counts.bannedUsers}</div>
                            <p className="text-xs text-destructive/70 mt-1">Cuentas inactivadas</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <MessageSquare className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Reseñas Publicadas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.reviews}</div>
                            <p className="text-xs text-muted-foreground mt-1">Opiniones de sitios</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Map className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Rutas Guiadas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.rutaRegistrations}</div>
                            <p className="text-xs text-muted-foreground mt-1">Iniciadas/completadas</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Gamepad2 className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Sesiones de Juego</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.gameSessions}</div>
                            <p className="text-xs text-muted-foreground mt-1">Partidas jugadas</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Seccin de Contenido */}
            <div className="bg-background rounded-2xl p-6 border shadow-sm">
                <h3 className="text-xl font-bold mb-6 border-b pb-3 flex items-center gap-2 text-primary">
                    <Landmark className="h-5 w-5" />
                    Métricas de Contenido de la App
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Landmark className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Sitios Registrados</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.sites}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Map className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Rutas Oficiales</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.rutas}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Gamepad2 className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Juegos Activos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.games}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <HelpCircle className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Preguntas Trivia</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.questions}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Info className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Curiosidades</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.curiosities}</div>
                            <p className="text-xs text-muted-foreground mt-1">Sabías que / Pa' que sepás</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Calendar className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.events}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Megaphone className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Noticias</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.news}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Smile className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Avatares</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.avatars}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors flex flex-col items-center text-center py-4">
                        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                            <Image className="h-6 w-6 text-primary mb-1" />
                            <CardTitle className="text-sm font-medium">Banners Activos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                            <div className="text-3xl font-bold">{counts.banners}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminGeneral = () => (
    <Tabs defaultValue="indicadores" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1 scrollbar-none">
            <TabsTrigger value="indicadores" className="min-w-max flex-none py-2">Indicadores</TabsTrigger>
            <TabsTrigger value="inventario" className="min-w-max flex-none py-2">Inventario</TabsTrigger>
            <TabsTrigger value="juegos" className="min-w-max flex-none py-2">Analítica de juegos</TabsTrigger>
        </TabsList>
        <TabsContent value="indicadores"><AdminMetricas /></TabsContent>
        <TabsContent value="inventario"><AdminOverview /></TabsContent>
        <TabsContent value="juegos"><JuegosAnalyticsPanel /></TabsContent>
    </Tabs>
);

const AdminDashboard: React.FC = () => {
    const { userProfile, setUserProfile } = useUserData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'sabias_que' | 'paquesepas' | 'dictionary' | 'rutas' | 'rutas_personalizadas' | 'alianzas' | 'juegos' | 'sitios' | 'eventos' | 'noticias' | 'usuarios' | 'institucional' | 'legal' | 'settings' | 'avatares' | 'banners' | 'ayuda'>('overview');
    const [showIntroModal, setShowIntroModal] = useState(false);
    const isAdmin = userProfile?.role === 'admin' || userProfile?.email?.trim().toLowerCase() === 'gruesobrandon@gmail.com';
    const hasManagementAccess = isAdmin || userProfile?.role === 'editor' || user?.email?.trim().toLowerCase() === 'gruesobrandon@gmail.com';

    useEffect(() => {
        if (hasManagementAccess && userProfile && userProfile.admin_tutorial_version !== ADMIN_TUTORIAL_VERSION) {
            setShowIntroModal(true);
        }
    }, [hasManagementAccess, userProfile?.id, userProfile?.admin_tutorial_version]);

    const completeIntro = async () => {
        try {
            const completedAt = await userService.completeAdminTutorial(ADMIN_TUTORIAL_VERSION);
            setUserProfile((current) => current ? {
                ...current,
                admin_tutorial_version: ADMIN_TUTORIAL_VERSION,
                admin_tutorial_completed_at: completedAt
            } : current);
            setShowIntroModal(false);
        } catch (error) {
            console.error('No se pudo guardar el tutorial de gestión:', error);
            toast.error('No pudimos guardar este avance. Inténtalo nuevamente.');
        }
    };

    // Security Check: Only render if user is admin or editor
    if (!hasManagementAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
                <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
                <p className="text-muted-foreground">
                    No tienes los permisos necesarios para ver esta página. Requiere rol de Administrador o Editor.
                </p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full bg-muted/20">
            <div className="mx-auto max-w-6xl p-3 md:p-6">
                <AdminIntroModal isOpen={showIntroModal} isAdmin={isAdmin} onClose={() => setShowIntroModal(false)} onComplete={completeIntro} />
                <div className="mb-5 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
                            <ShieldAlert className="h-7 w-7 text-primary md:h-8 md:w-8" />
                            Panel de Administración
                        </h2>
                        <Button variant="outline" onClick={() => setShowIntroModal(true)}>
                            <HelpCircle className="mr-2 h-4 w-4" /> Ver tutorial
                        </Button>
                    </div>
                    <p className="text-muted-foreground">
                        Bienvenido, {userProfile?.full_name || 'Admin'}. Gestiona el contenido de Andanzas GO.
                    </p>
                </div>

                <nav aria-label="Secciones de administración" className="sticky top-0 z-20 mb-4 flex flex-nowrap gap-1.5 overflow-x-auto rounded-2xl border bg-background/95 p-2 shadow-sm backdrop-blur-md scrollbar-none md:mb-6 md:gap-2 md:p-3 [&>button]:h-9 [&>button]:shrink-0 [&>button]:px-3 [&>button]:text-xs md:[&>button]:h-10 md:[&>button]:px-4 md:[&>button]:text-sm">
                    <Button 
                        variant={activeTab === 'overview' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('overview')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <ShieldAlert className="w-4 h-4 mr-2" /> General
                    </Button>
                    <Button 
                        variant={activeTab === 'avatares' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('avatares')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <User className="w-4 h-4 mr-2" /> Avatares
                    </Button>
                    <Button 
                        variant={activeTab === 'settings' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('settings')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Settings className="w-4 h-4 mr-2" /> Ajustes
                    </Button>
                    <Button 
                        variant={activeTab === 'sabias_que' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('sabias_que')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <HelpCircle className="w-4 h-4 mr-2" /> Sabías que
                    </Button>
                    <Button 
                        variant={activeTab === 'paquesepas' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('paquesepas')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <BookOpen className="w-4 h-4 mr-2" /> Pa' que sepás
                    </Button>
                    <Button 
                        variant={activeTab === 'rutas' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('rutas')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Map className="w-4 h-4 mr-2" /> Rutas
                    </Button>
                    <Button
                        variant={activeTab === 'dictionary' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('dictionary')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <BookOpen className="w-4 h-4 mr-2" /> Diccionario
                    </Button>
                    <Button 
                        variant={activeTab === 'rutas_personalizadas' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('rutas_personalizadas')}
                        className="rounded-full whitespace-nowrap border-primary/30"
                    >
                        <Map className="w-4 h-4 mr-2" /> Solicitudes Rutas
                    </Button>
                    <Button
                        variant={activeTab === 'alianzas' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('alianzas')}
                        className="rounded-full whitespace-nowrap border-primary/30"
                    >
                        <Handshake className="w-4 h-4 mr-2" /> Alianzas
                    </Button>
                    <Button
                        variant={activeTab === 'sitios' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('sitios')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Landmark className="w-4 h-4 mr-2" /> Sitios
                    </Button>
                    <Button 
                        variant={activeTab === 'eventos' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('eventos')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Calendar className="w-4 h-4 mr-2" /> Eventos
                    </Button>
                    <Button 
                        variant={activeTab === 'noticias' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('noticias')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Megaphone className="w-4 h-4 mr-2" /> Noticias
                    </Button>
                    <Button 
                        variant={activeTab === 'juegos' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('juegos')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Gamepad2 className="w-4 h-4 mr-2" /> Juegos
                    </Button>
                    <Button 
                        variant={activeTab === 'institucional' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('institucional')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Info className="w-4 h-4 mr-2" /> Institucional
                    </Button>
                    <Button 
                        variant={activeTab === 'banners' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('banners')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Image className="w-4 h-4 mr-2" /> Banners
                    </Button>
                    <Button
                        variant={activeTab === 'ayuda' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('ayuda')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <HelpCircle className="w-4 h-4 mr-2" /> Textos de Ayuda
                    </Button>
                    <Button 
                        variant={activeTab === 'legal' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('legal')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <ShieldAlert className="w-4 h-4 mr-2" /> Legal y Moderación
                    </Button>
                    {(userProfile?.role === 'admin' || userProfile?.email?.trim().toLowerCase() === 'gruesobrandon@gmail.com') && (
                        <Button 
                            variant={activeTab === 'usuarios' ? 'default' : 'outline'} 
                            onClick={() => setActiveTab('usuarios')}
                            className="rounded-full"
                        >
                            <Users className="w-4 h-4 mr-2" /> Usuarios
                        </Button>
                    )}
                </nav>

                <div className="min-h-[420px] rounded-xl border bg-card p-2 shadow-sm sm:p-4 md:min-h-[500px] md:p-6">
                    {activeTab === 'overview' && <AdminGeneral />}
                    {activeTab === 'avatares' && <AdminAvatarsManager />}
                    {activeTab === 'sabias_que' && <CuriousFactsManager />}
                    {activeTab === 'paquesepas' && <AdminCuriosidades />}
                    {activeTab === 'dictionary' && <AdminDictionary />}
                    {activeTab === 'rutas' && <AdminRutas />}
                    {activeTab === 'rutas_personalizadas' && <AdminRutasPersonalizadas />}
                    {activeTab === 'alianzas' && <AdminAlianzas />}
                    {activeTab === 'sitios' && <AdminSitios />}
                    {activeTab === 'eventos' && <AdminEventos />}
                    {activeTab === 'noticias' && <AdminNoticias />}
                    {activeTab === 'juegos' && <AdminJuegos />}
                    {activeTab === 'institucional' && <AdminInstitucional />}
                    {activeTab === 'legal' && <AdminDocumentosLegales />}
                    {activeTab === 'usuarios' && <AdminUsuarios />}
                    {activeTab === 'banners' && <AdminBanners />}
                    {activeTab === 'ayuda' && <AdminHelpContent />}
                    {activeTab === 'settings' && <AdminSettings />}
                </div>
            </div>
        </ScrollArea>
    );
};

export default AdminDashboard;
