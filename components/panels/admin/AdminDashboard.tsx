import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { ScrollArea } from '../../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { useUserData } from '../../../contexts/UserDataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ShieldAlert, Users, Map, BookOpen, Settings, Gamepad2, Landmark, Megaphone, Activity, Info, Calendar, Smile } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { useI18n } from '../../../i18n';
import { AdminCuriosidades } from './AdminCuriosidades';
import { AdminRutas } from './AdminRutas';
import { AdminJuegos } from './AdminJuegos';
import { AdminSitios } from './AdminSitios';
import { AdminEventos } from './AdminEventos';
import { AdminIntroModal } from './AdminIntroModal';
import { AdminNoticias } from './AdminNoticias';
import { AdminUsuarios } from './AdminUsuarios';
import { AdminInstitucional } from './AdminInstitucional';
import { CuriousFactsManager } from './CuriousFactsManager';
import { AdminMetricas } from './AdminMetricas';
import { AdminAvatarsManager } from './AdminAvatarsManager';
import { AdminDocumentosLegales } from './AdminDocumentosLegales';

const AdminOverview = () => {
    const [counts, setCounts] = useState({ users: 0, curiosities: 0, routes: 0, sites: 0, events: 0, news: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [
                    { count: usersCount },
                    { count: curiositiesCount },
                    { count: routesCount },
                    { count: sitesCount },
                    { count: eventsCount },
                    { count: newsCount }
                ] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('curious_facts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
                    supabase.from('rutas').select('*', { count: 'exact', head: true }),
                    supabase.from('sites').select('*', { count: 'exact', head: true }),
                    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published'),
                    supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'published')
                ]);
                
                setCounts({
                    users: usersCount || 0,
                    curiosities: curiositiesCount || 0,
                    routes: routesCount || 0,
                    sites: sitesCount || 0,
                    events: eventsCount || 0,
                    news: newsCount || 0
                });
            } catch (err) {
                console.error("Error fetching admin overview counts:", err);
            }
        };
        fetchCounts();
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{counts.users}</div>
                    <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Curiosidades Activas</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{counts.curiosities}</div>
                    <p className="text-xs text-muted-foreground">Visibles en la app</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rutas Creadas</CardTitle>
                    <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{counts.routes}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sitios Registrados</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{counts.sites}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Eventos Activos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{counts.events}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Noticias Publicadas</CardTitle>
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{counts.news}</div>
                </CardContent>
            </Card>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const { userProfile } = useUserData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'metricas' | 'sabias_que' | 'paquesepas' | 'rutas' | 'juegos' | 'sitios' | 'eventos' | 'noticias' | 'usuarios' | 'institucional' | 'legal' | 'settings' | 'avatares'>('overview');
    const [showIntroModal, setShowIntroModal] = useState(false);

    // Security Check: Only render if user is admin or editor
    if (userProfile?.role !== 'admin' && userProfile?.role !== 'editor' && user?.email?.trim().toLowerCase() !== 'gruesobrandon@gmail.com' && userProfile?.email?.trim().toLowerCase() !== 'gruesobrandon@gmail.com') {
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
        <ScrollArea className="h-[72vh] bg-muted/20">
            <div className="p-4 md:p-6 max-w-6xl mx-auto">
                <AdminIntroModal isOpen={showIntroModal} onClose={() => setShowIntroModal(false)} />
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <ShieldAlert className="h-8 w-8 text-primary" />
                            Panel de Administración
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
                        <Smile className="w-4 h-4 mr-2" /> Avatares
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
                        <BookOpen className="w-4 h-4 mr-2" /> Sabías que
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
                </div>

                <div className="bg-card rounded-xl border p-4 md:p-6 shadow-sm min-h-[500px]">
                    {activeTab === 'overview' && <AdminOverview />}
                    {activeTab === 'metricas' && <AdminMetricas />}
                    {activeTab === 'avatares' && <AdminAvatarsManager />}
                    {activeTab === 'sabias_que' && <CuriousFactsManager />}
                    {activeTab === 'paquesepas' && <AdminCuriosidades />}
                    {activeTab === 'rutas' && <AdminRutas />}
                    {activeTab === 'sitios' && <AdminSitios />}
                    {activeTab === 'eventos' && <AdminEventos />}
                    {activeTab === 'noticias' && <AdminNoticias />}
                    {activeTab === 'juegos' && <AdminJuegos />}
                    {activeTab === 'institucional' && <AdminInstitucional />}
                    {activeTab === 'legal' && <AdminDocumentosLegales />}
                    {activeTab === 'usuarios' && <AdminUsuarios />}
                    {activeTab === 'settings' && <div>Módulo de Ajustes en construcción...</div>}
                </div>
            </div>
        </ScrollArea>
    );
};

export default AdminDashboard;
