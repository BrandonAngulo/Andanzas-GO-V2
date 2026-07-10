import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { ScrollArea } from '../../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { useUserData } from '../../../contexts/UserDataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ShieldAlert, Users, Map, BookOpen, Settings, Gamepad2, Landmark, Megaphone, Activity, Info, Calendar, Smile, MessageSquare, UserX, Image, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { useI18n } from '../../../i18n';
import { AdminCuriosidades } from './AdminCuriosidades';
import { AdminRutas } from './AdminRutas';
import { AdminRutasPersonalizadas } from './AdminRutasPersonalizadas';
import { AdminJuegos } from './AdminJuegos';
import { AdminSitios } from './AdminSitios';
import { AdminEventos } from './AdminEventos';
import { AdminIntroModal } from './AdminIntroModal';
import { AdminNoticias } from './AdminNoticias';
import { AdminSettings } from './AdminSettings';
import { AdminUsuarios } from './AdminUsuarios';
import { AdminInstitucional } from './AdminInstitucional';
import { AdminBanners } from './AdminBanners';
import { CuriousFactsManager } from './CuriousFactsManager';
import { AdminMetricas } from './AdminMetricas';
import { AdminAvatarsManager } from './AdminAvatarsManager';
import { AdminDocumentosLegales } from './AdminDocumentosLegales';

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
                    supabase.from('ruta_registrations').select('*', { count: 'exact', head: true }),
                    
                    supabase.from('sites').select('*', { count: 'exact', head: true }),
                    supabase.from('rutas').select('*', { count: 'exact', head: true }),
                    supabase.from('events').select('*', { count: 'exact', head: true }),
                    supabase.from('news').select('*', { count: 'exact', head: true }),
                    supabase.from('games').select('*', { count: 'exact', head: true }),
                    supabase.from('game_questions').select('*', { count: 'exact', head: true }),
                    supabase.from('curious_facts').select('*', { count: 'exact', head: true }),
                    supabase.from('avatar_presets').select('*', { count: 'exact', head: true }),
                    supabase.from('institutional_content').select('*', { count: 'exact', head: true }).like('section_key', 'banner_%')
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
                    Mtricas de Usuarios y Actividad
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.users}</div>
                            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-destructive/5 shadow-none hover:bg-destructive/10 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-destructive">Usuarios Suspendidos</CardTitle>
                            <UserX className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{counts.bannedUsers}</div>
                            <p className="text-xs text-destructive/70">Cuentas inactivadas</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reseas Publicadas</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.reviews}</div>
                            <p className="text-xs text-muted-foreground">Opiniones de sitios</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rutas Guiadas</CardTitle>
                            <Map className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.rutaRegistrations}</div>
                            <p className="text-xs text-muted-foreground">Rutas iniciadas/completadas</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sesiones de Juego</CardTitle>
                            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.gameSessions}</div>
                            <p className="text-xs text-muted-foreground">Partidas jugadas</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Seccin de Contenido */}
            <div className="bg-background rounded-2xl p-6 border shadow-sm">
                <h3 className="text-xl font-bold mb-6 border-b pb-3 flex items-center gap-2 text-primary">
                    <Landmark className="h-5 w-5" />
                    Mtricas de Contenido de la App
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sitios Registrados</CardTitle>
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.sites}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rutas Oficiales (Públicas)</CardTitle>
                            <Map className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.rutas}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Juegos Activos</CardTitle>
                            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.games}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Preguntas de Trivia</CardTitle>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.questions}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Curiosidades</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.curiosities}</div>
                            <p className="text-xs text-muted-foreground">Sabas qu y Pa' que seps</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.events}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Noticias</CardTitle>
                            <Megaphone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.news}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avatares</CardTitle>
                            <Smile className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.avatars}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Banners Activos</CardTitle>
                            <Image className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.banners}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { userProfile } = useUserData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'metricas' | 'sabias_que' | 'paquesepas' | 'rutas' | 'rutas_personalizadas' | 'juegos' | 'sitios' | 'eventos' | 'noticias' | 'usuarios' | 'institucional' | 'legal' | 'settings' | 'avatares' | 'banners'>('overview');
    const [showIntroModal, setShowIntroModal] = useState(false);

    // Security Check: Only render if user is admin or editor
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'editor' && user?.email?.trim().toLowerCase() !== 'gruesobrandon@gmail.com' && userProfile?.email?.trim().toLowerCase() !== 'gruesobrandon@gmail.com') {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
                <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
                <p className="text-muted-foreground">
                    No tienes los permisos necesarios para ver esta pÃ¡gina. Requiere rol de Administrador o Editor.
                </p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[72vh] bg-muted/20">
            <div className="p-4 md:p-6 max-w-6xl mx-auto">
                <AdminIntroModal isOpen={showIntroModal} onClose={() => setShowIntroModal(false)} />
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <ShieldAlert className="h-8 w-8 text-primary" />
                            Panel de AdministraciÃ³n
                        </h2>
                    </div>
                    <p className="text-muted-foreground">
                        Bienvenido, {userProfile?.full_name || 'Admin'}. Gestiona el contenido de Andanzas GO.
                    </p>
                </div>

                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
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
                        variant={activeTab === 'metricas' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('metricas')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Activity className="w-4 h-4 mr-2" /> Actividad
                    </Button>
                    <Button 
                        variant={activeTab === 'sabias_que' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('sabias_que')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <BookOpen className="w-4 h-4 mr-2" /> SabÃ­as que
                    </Button>
                    <Button 
                        variant={activeTab === 'paquesepas' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('paquesepas')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <BookOpen className="w-4 h-4 mr-2" /> Pa' que sepÃ¡s
                    </Button>
                    <Button 
                        variant={activeTab === 'rutas' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('rutas')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Map className="w-4 h-4 mr-2" /> Rutas
                    </Button>
                    <Button 
                        variant={activeTab === 'rutas_personalizadas' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('rutas_personalizadas')}
                        className="rounded-full whitespace-nowrap border-primary/30"
                    >
                        <Map className="w-4 h-4 mr-2" /> Solicitudes Rutas
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
                        <Settings className="w-4 h-4 mr-2" /> Eventos
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
                        <BookOpen className="w-4 h-4 mr-2" /> Institucional
                    </Button>
                    <Button 
                        variant={activeTab === 'banners' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('banners')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <Settings className="w-4 h-4 mr-2" /> Banners
                    </Button>
                    <Button 
                        variant={activeTab === 'legal' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('legal')}
                        className="rounded-full whitespace-nowrap"
                    >
                        <ShieldAlert className="w-4 h-4 mr-2" /> Legal y ModeraciÃ³n
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
                </div>

                <div className="bg-card rounded-xl border p-4 md:p-6 shadow-sm min-h-[500px]">
                    {activeTab === 'overview' && <AdminOverview />}
                    {activeTab === 'metricas' && <AdminMetricas />}
                    {activeTab === 'avatares' && <AdminAvatarsManager />}
                    {activeTab === 'sabias_que' && <CuriousFactsManager />}
                    {activeTab === 'paquesepas' && <AdminCuriosidades />}
                    {activeTab === 'rutas' && <AdminRutas />}
                    {activeTab === 'rutas_personalizadas' && <AdminRutasPersonalizadas />}
                    {activeTab === 'sitios' && <AdminSitios />}
                    {activeTab === 'eventos' && <AdminEventos />}
                    {activeTab === 'noticias' && <AdminNoticias />}
                    {activeTab === 'juegos' && <AdminJuegos />}
                    {activeTab === 'institucional' && <AdminInstitucional />}
                    {activeTab === 'legal' && <AdminDocumentosLegales />}
                    {activeTab === 'usuarios' && <AdminUsuarios />}
                    {activeTab === 'banners' && <AdminBanners />}
                    {activeTab === 'settings' && <AdminSettings />}
                </div>
            </div>
        </ScrollArea>
    );
};

export default AdminDashboard;
