import React, { useMemo, useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import AuthRequiredDialog from "./components/shared/AuthRequiredDialog";
import { Menu, Search, Route, User, Bell, Sparkles, Shield, AlertTriangle, Maximize2, Minimize2, Share2, Star, Phone, Map, X, Settings2, Award } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Sheet, SheetContent } from "./components/ui/sheet";
import { ScrollArea } from "./components/ui/scroll-area";

import { Site, Evento, Ruta, ActivePanelType } from './types';
import { cn } from './lib/utils';
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";

import MapaGoogle from "./components/map/MapaGoogle";
import ExplorarPanel from "./components/panels/ExplorarPanel";
import EventosPanel from "./components/panels/EventosPanel";
import TendenciasPanel from "./components/panels/TendenciasPanel";
import FavoritosPanel from "./components/panels/FavoritosPanel";
import ResenasPanel from "./components/panels/ResenasPanel";
import RutasPanel from "./components/panels/RutasPanel";
import PerfilPanel from "./components/panels/PerfilPanel";
import { UserAvatar } from "./components/shared/UserAvatar";
import SobrePanel from "./components/panels/SobrePanel";
import SoportePanel from "./components/panels/SoportePanel";
import RightRail from "./components/layout/RightRail";
import NotificationsPanel from "./components/layout/NotificationsPanel";
import FullView from "./components/views/FullView";
import InsigniasModal from "./components/panels/InsigniasModal";
import ActiveRouteBanner from './components/shared/ActiveRouteBanner';
import RouteIntroModal from "./components/views/RouteIntroModal";
import Logo from "./components/layout/Logo";
import AccessibilityMenu from "./components/layout/AccessibilityMenu";
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import { LegalAcceptanceModal } from './components/legal/LegalAcceptanceModal';
import { useI18n } from "./i18n";
import NoticiasPanel from "./components/panels/NoticiasPanel";
import ConfiguracionPanel from "./components/panels/ConfiguracionPanel";
import OnboardingModal from "./components/panels/OnboardingModal";
import { AppTutorialModal } from "./components/views/AppTutorialModal";
import ReviewModal from "./components/views/ReviewModal";
import { userService } from './services/user.service';
import { routesService } from './services/routes.service'; // Kept for updateRouteDetails which might not be in hook yet
import { gamificationService } from './services/gamification.service';
import PaQueSepasPanel from './components/panels/PaQueSepasPanel';
import AdminDashboard from './components/panels/admin/AdminDashboard';
import { GameSessionModal } from './components/views/GameSessionModal';
import { JuegosPanel } from './components/panels/JuegosPanel';
import { ChallengeLobby } from './components/views/ChallengeLobby';
import { ChallengeVerdict } from './components/views/ChallengeVerdict';

// New Imports
import { useAuth } from './contexts/AuthContext';
import { useAppData } from './contexts/AppDataContext';
import { useUserData } from './contexts/UserDataContext';
import { useSearchFilter } from './hooks/useSearchFilter';
import { useRouteNavigation } from './hooks/useRouteNavigation';
import { useTheme } from './hooks/useTheme';

// Helpers
const parseHash = () => {
  const h = (window.location.hash || "").replace(/^#/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const [type, id, sub] = parts;
    if (["site", "event", "route", "challenge"].includes(type)) return { type, id, sub };
  }
  return { type: null, id: null, sub: null };
};

const pushHash = (route: { type: string; id: string } | null) => {
  if (!route || !route.type || !route.id) return;
  const next = `#/${route.type}/${route.id}`;
  if (window.location.hash !== next) {
    window.location.hash = next;
  }
};

const clearHash = () => {
  if (window.location.hash) {
    const previousHash = window.location.hash;
    history.back();
    setTimeout(() => {
      // If the hash didn't change (e.g. user landed directly on the site via bookmark), force clear it
      if (window.location.hash === previousHash) {
        window.location.hash = "";
      }
    }, 50);
  }
};

const defaultAccessibilitySettings = {
  fontSize: 1,
  lineHeight: 1,
  highContrast: false,
  grayscale: false,
};

export default function App() {
  // --- routing for legal pages ---
  const path = window.location.pathname;
  if (path === '/privacy') return <PrivacyPolicy />;
  if (path === '/terms') return <TermsOfService />;

  const { t, language } = useI18n();
  const { isAuthenticated, user, signIn, signUp } = useAuth();

  // --- Global State via Contexts ---
  const { sites, eventos, rutasTematicas, feed, allInsignias, learnEntries, isLoading } = useAppData();
  const {
    favIds,
    reviews,
    earnedInsignias,
    notifications,
    routesInProgress,
    routesCompleted,
    toggleFav,
    addReview,
    markAsRead,
    markAllAsRead,
    addNotification,
    userProfile
  } = useUserData();
  const { theme, setTheme } = useTheme();

  // --- Search & Filter Hook ---
  const {
    query, setQuery,
    selectedCategories,
    minRating, setMinRating,
    showAccessibilityOnly, setShowAccessibilityOnly,
    allCategories,
    results,
    handleCategoryChange,
    clearFilters
  } = useSearchFilter();

  // --- Route Navigation Hook ---
  const {
    activeGuidedRoute, setActiveGuidedRoute,
    previewRoute, setPreviewRoute,
    visitedRoutePoints,
    currentRouteStep, setCurrentRouteStep,
    showRouteModal, setShowRouteModal,
    reviewSiteId, setReviewSiteId,
    startRoute,
    confirmStartRoute,
    handlePointVisited,
    handleReviewClose,
    nextStep,
    prevStep,
    completeRouteById
  } = useRouteNavigation();

  // --- Local UI State ---
  const [openMenu, setOpenMenu] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanelType>("mapa");
  // Recuerda cuál era el panel activo justo antes de entrar a 'perfil' (sin importar la
  // entrada: avatar del header, Sidebar, BottomNav o clic en notificación), para que el
  // botón de "cerrar perfil" regrese ahí en vez de saltar siempre al mapa.
  const [lastPanelBeforeProfile, setLastPanelBeforeProfile] = useState<ActivePanelType>("mapa");
  const prevActivePanelRef = useRef<ActivePanelType>("mapa");
  useEffect(() => {
    if (activePanel === 'perfil' && prevActivePanelRef.current !== 'perfil') {
      setLastPanelBeforeProfile(prevActivePanelRef.current);
    }
    prevActivePanelRef.current = activePanel;
  }, [activePanel]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInsigniasModal, setShowInsigniasModal] = useState(false);
  const [badgeProgress, setBadgeProgress] = useState<Record<string, number>>({});
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [fullView, setFullView] = useState<{ type: string; data: any } | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  // Se incrementa en cada "Reintentar" para forzar un remount limpio de GameSessionModal
  // (mismo gameId no cambia por sí solo, así que se necesita este nonce en la key).
  const [gameSessionNonce, setGameSessionNonce] = useState(0);

  // Accessibility & Settings
  const [accessibilitySettings, setAccessibilitySettings] = useState(defaultAccessibilitySettings);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const accessibilityMenuRef = useRef<HTMLDivElement>(null);

  // UI Layout Refs
  const mainRef = useRef<HTMLElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Other UI State
  const [showSOS, setShowSOS] = useState(false);
  const [aiSheetOpen, setAiSheetOpen] = useState(false);
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);

  // New Routes State (User created - kept local for now/service call wrapper)
  // TODO: Move completely to UserDataContext if desired, or keep as simple wrapper
  const [userRoutes, setUserRoutes] = useState<Ruta[]>([]);
  const [newRoutePoints, setNewRoutePoints] = useState<Site[]>([]);

  // Derived
  const allRutas = useMemo(() => [...rutasTematicas, ...userRoutes], [rutasTematicas, userRoutes]);
  const unreadCount = notifications.filter(n => !n.leida).length;
  const panelTitle = t(`panelTitles.${activePanel}`);
  const tendencias = useMemo(() => [...sites].sort((a, b) => b.visitas + b.rating * 100 - (a.visitas + a.rating * 100)).slice(0, 10), [sites]);
  const gridClass = "grid grid-cols-1 md:grid-cols-[260px_1fr]";
  const isFiltered = query.trim() !== '' || selectedCategories.length > 0;

  // --- Effects ---

  // Load User Routes (this part wasn't in UserContext yet, so we keep it here or call service)
  useEffect(() => {
    if (isAuthenticated && user) {
      routesService.getUserRoutes(user.id).then(setUserRoutes);
      // Check onboarding
      userService.getProfile(user.id).then(profile => {
        if (profile && (!profile.interests || profile.interests.length === 0)) setShowOnboarding(true);
      });
    }
  }, [isAuthenticated, user]);

  // Accessibility Application
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-multiplier', String(accessibilitySettings.fontSize));
    root.style.setProperty('--line-height-multiplier', String(accessibilitySettings.lineHeight));
    root.dataset.highContrast = String(accessibilitySettings.highContrast);
    root.dataset.grayscale = String(accessibilitySettings.grayscale);
    root.lang = language;
  }, [accessibilitySettings, language]);

  // Focus Management
  useEffect(() => {
    setTimeout(() => { if (mainRef.current) mainRef.current.focus(); }, 100);
  }, [activePanel]);

  // Progreso de insignias por familia (favoritos/reseñas/rutas), para la barra de
  // avance hacia el siguiente tier en InsigniasModal.
  useEffect(() => {
    if (showInsigniasModal && user) {
      gamificationService.getUserBadgeProgress(user.id).then(setBadgeProgress);
    }
  }, [showInsigniasModal, user]);

  // Hash Sync
  useEffect(() => {
    const syncFromHash = () => {
      const r = parseHash();
      const currentViewId = fullView?.data?.id;
      if (r.id === currentViewId && r.type === fullView?.type) return;

      const getSiteById = (id: string) => sites.find(s => s.id === id);
      const getEventById = (id: string) => eventos.find(e => String(e.id) === id);

      if (!r.type || !r.id) { if (fullView !== null) setFullView(null); return; }
      if (r.type === "site") setFullView({ type: "site", data: getSiteById(r.id) });
      if (r.type === "event") setFullView({ type: "event", data: getEventById(r.id) });
      if (r.type === "route") setFullView({ type: "route", data: allRutas.find(route => route.id === r.id) });
      if (r.type === "challenge") {
         if (r.sub === "verdict") {
             setFullView({ type: "challenge_verdict", data: { id: r.id }});
         } else {
             setFullView({ type: "challenge_lobby", data: { id: r.id }});
         }
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [allRutas, fullView, sites, eventos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        const bellButton = document.getElementById('notifications-bell');
        if (bellButton && !bellButton.contains(event.target as Node)) setShowNotifications(false);
      }
      if (accessibilityMenuRef.current && !accessibilityMenuRef.current.contains(event.target as Node)) {
        const accessibilityButton = document.getElementById('accessibility-button');
        if (accessibilityButton && !accessibilityButton.contains(event.target as Node)) setShowAccessibilityMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleOpenGame = (e: CustomEvent) => {
      if (e.detail?.gameId) setActiveGameId(e.detail.gameId);
    };
    window.addEventListener('open-game' as any, handleOpenGame);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('open-game' as any, handleOpenGame);
    };
  }, []);

  // --- Handlers ---
  const handleResetFilter = () => { clearFilters(); if (activePanel !== 'mapa') setActivePanel('mapa'); };
  const getSiteById = (id: string) => sites.find(s => s.id === id);
  const openSite = (s: Site) => {
    // If active route
    if (activeGuidedRoute && activeGuidedRoute.puntos.includes(s.id)) {
      const stepIndex = activeGuidedRoute.puntos.indexOf(s.id);
      setCurrentRouteStep(stepIndex);
    }
    pushHash({ type: "site", id: s.id });
  };
  const openEvent = (e: Evento) => pushHash({ type: "event", id: e.id });
  const openRoute = (r: Ruta) => pushHash({ type: "route", id: r.id });
  const closeFull = () => clearHash();
  const goToPlaceInMap = (placeName: string) => { setActivePanel("mapa"); setQuery(placeName); closeFull(); };

  const handleAiSearch = () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    toast.info("La función de IA estará disponible próximamente.");
  };

  const avatarUrl = userProfile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  const startNewRoute = () => {
    if (!isAuthenticated) { setAuthDialogOpen(true); return; }
    setNewRoutePoints([]); setActivePanel("rutas");
  };

  const saveNewRoute = async (name: string, description: string, emoji?: string) => {
    if (!isAuthenticated || !name || newRoutePoints.length === 0 || !user) return;
    const ruta: Ruta = {
      id: `r_${Date.now()}`,
      nombre: name,
      puntos: newRoutePoints.map((p) => p.id),
      duracionMin: newRoutePoints.length * 20,
      descripcion: description || `Ruta personalizada con ${newRoutePoints.length} puntos.`,
      justificaciones: newRoutePoints.map(p => `Punto añadido: ${p.nombre}.`),
      recomendaciones: [],
      publico: false,
      emoji: emoji || "🗺️"
    };

    setUserRoutes((r) => [ruta, ...r]); // Optimistic
    setNewRoutePoints([]);

    try {
      const savedRoute = await routesService.createRoute(ruta, user.id);
      if (savedRoute) {
        setUserRoutes(prev => prev.map(r => r.id === ruta.id ? savedRoute : r));
      }
      // insignia-route-1 (familia route_create) nunca se disparaba desde aquí; se conecta ahora.
      const newBadge = await gamificationService.incrementFamilyProgress(user.id, 'route_create');
      if (newBadge) {
        addNotification({
          titulo: '¡Nueva Insignia!',
          titulo_en: 'New Badge!',
          descripcion: 'Has desbloqueado: ' + newBadge.nombre,
          descripcion_en: 'You unlocked: ' + (newBadge.nombre_en || newBadge.nombre),
          leida: false,
          icono: Award as any,
        });
      }
    } catch (e) {
      console.error("Error saving route", e);
    }
  };

  const updateRouteDetails = async (id: string, newName: string, newDescription: string, newPoints?: string[], emoji?: string) => {
    setUserRoutes(prevRutas => prevRutas.map(ruta =>
      ruta.id === id
        ? { ...ruta, nombre: newName, descripcion: newDescription, ...(emoji ? { emoji } : {}), ...(newPoints ? { puntos: newPoints, duracionMin: newPoints.length * 20 } : {}) }
        : ruta
    ));
    const updatePayload: any = { id, nombre: newName, descripcion: newDescription };
    if (newPoints) updatePayload.puntos = newPoints;
    if (emoji) updatePayload.emoji = emoji;
    if (isAuthenticated) routesService.updateRoute(updatePayload);
  };

  const deleteRoute = async (id: string) => {
    setUserRoutes(prev => prev.filter(r => r.id !== id));
    if (isAuthenticated) routesService.deleteRoute(id);
  };

  // Keep toggleRutaPrivacy local logic here since it's admin/user specific
  const toggleRutaPrivacy = async (id: string) => {
    const route = userRoutes.find(r => r.id === id);
    if (!route) return;
    const newStatus = !route.publico;
    setUserRoutes(userRoutes.map(ruta => ruta.id === id ? { ...ruta, publico: newStatus } : ruta));
    if (isAuthenticated) routesService.updateRoute({ id, publico: newStatus });
  };

  const handleShowSOS = (open: boolean) => {
    if (open) { setAiSheetOpen(false); setShowNotifications(false); setShowAccessibilityMenu(false); }
    setShowSOS(open);
  };

  const handleShowNotifications = (open: boolean) => {
    if (open) { setShowSOS(false); setAiSheetOpen(false); setShowAccessibilityMenu(false); }
    setShowNotifications(open);
  };

  const handleShowAccessibilityMenu = (open: boolean) => {
    if (open) { setShowSOS(false); setAiSheetOpen(false); setShowNotifications(false); }
    setShowAccessibilityMenu(open);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Andanzas GO', text: t('shareText'), url: window.location.origin }); }
      catch (error) { console.error('Error sharing:', error); }
    } else { toast.error(t('shareNotSupported')); }
  };

  const generateAiRecommendations = () => {
    toast.info("La función de IA estará disponible próximamente.");
  };

  return (
    <div className="h-[100dvh] flex flex-col w-full bg-muted/20 overflow-hidden">
      <Toaster position="top-center" richColors />
      <AuthRequiredDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onLogin={async (email, password, isSignUp) => {
          if (isSignUp) {
            await signUp(email, password, email.split('@')[0]);
          } else {
            await signIn(email, password);
          }
          // No forzar navegación a 'perfil': el diálogo de login siempre se abre desde una
          // acción contextual (iniciar ruta, dejar reseña, aceptar reto), así que activePanel
          // y fullView ya reflejan correctamente dónde estaba el usuario.
          setAuthDialogOpen(false);
        }}
      />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[2000] focus:px-4 focus:py-2 focus:bg-background focus:text-primary focus:border focus:rounded-md shadow-lg transition-transform">
        {language === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
      </a>

      {/* Header */}
      <header className={cn("flex-shrink-0 pt-2 md:pt-3 z-[1000] w-full mx-auto md:max-w-7xl md:px-4 transition-all duration-300", activeGuidedRoute && "hidden")}>
        <div className="glass-panel shadow-md border-b md:border md:rounded-2xl w-full px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label={t('openMenu')} onClick={() => setOpenMenu(true)}><Menu className="h-5 w-5" /></Button>
          <div className="flex items-center gap-2 mr-2"><Logo /></div>

          <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-black/5 dark:border-white/5" aria-label="Main Navigation">
            {[
              { id: 'mapa', label: 'nav.map' },
              { id: 'explorar', label: 'nav.explore' },
              { id: 'rutas', label: 'nav.routes' },
              { id: 'eventos', label: 'nav.events' },
              { id: 'juegos', label: 'nav.games' },
              { id: 'paquesepas', label: 'panelTitles.paquesepas' }
            ].map(item => (
              <Button key={item.id} size="sm" className="rounded-full px-4" variant={activePanel === item.id ? "default" : "ghost"} onClick={() => setActivePanel(item.id as any)}>{t(item.label)}</Button>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 w-[300px] lg:w-[360px]" role="search">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                aria-label="Buscar lugares"
                placeholder={t('searchPlaceholder')}
                className="pl-9 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary/50 transition-all shadow-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {/* Search Dropdown logic simplified visually since hooking it up is complex, reusing basic logic */}
              {query.length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-popover rounded-xl border shadow-lg overflow-hidden z-[60] animate-in slide-in-from-top-2">
                  <ScrollArea className="max-h-[300px]">
                    <div className="p-1 space-y-0.5">
                      {(() => {
                        const siteMatches = sites.filter(s => s.nombre.toLowerCase().includes(query.toLowerCase()));
                        if (siteMatches.length === 0) return <div className="px-4 py-8 text-center text-sm text-muted-foreground">No matches</div>;
                        return siteMatches.map(s => (
                          <button key={s.id} className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-lg flex items-center gap-2"
                            onClick={() => { pushHash({ type: 'site', id: s.id }); setQuery(''); }}>
                            <Map className="h-4 w-4 text-muted-foreground" /><span className="truncate">{s.nombre}</span>
                          </button>
                        ));
                      })()}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative" ref={notificationsRef}>
              <Button id="notifications-bell" variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={() => handleShowNotifications(!showNotifications)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-orange-500 border border-background" />}
              </Button>
              {showNotifications && <NotificationsPanel 
                  notifications={notifications} 
                  onMarkAsRead={markAsRead} 
                  onMarkAllAsRead={markAllAsRead} 
                  onOpenNews={() => {
                      setActivePanel('noticias');
                      setShowNotifications(false);
                  }}
                  onNotificationClick={(notif) => {
                      if ((notif as any).tipo === 'badge_earned' || (notif as any).tipo === 'reward' || notif.titulo.includes('Insignia') || notif.titulo.includes('Banner')) {
                          setActivePanel('perfil');
                          setShowNotifications(false);
                      }
                  }}
              />}
            </div>

            <div className="relative" ref={accessibilityMenuRef}>
              <Button id="accessibility-button" variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={() => handleShowAccessibilityMenu(!showAccessibilityMenu)}>
                <Settings2 className="h-6 w-6" />
              </Button>
              {showAccessibilityMenu && <AccessibilityMenu settings={accessibilitySettings} onSettingsChange={setAccessibilitySettings} onReset={() => setAccessibilitySettings(defaultAccessibilitySettings)} />}
            </div>

            <Button variant="ghost" size="icon" className={cn("rounded-full hover:bg-muted p-0 overflow-hidden", isAuthenticated ? "border-2 border-primary" : "")} onClick={() => setActivePanel(prev => prev === 'perfil' ? lastPanelBeforeProfile : 'perfil')}>
              {isAuthenticated ? (
                <UserAvatar userProfile={userProfile} className="w-full h-full" />
              ) : (
                <User className="h-6 w-6 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main ref={mainRef} id="main-content" tabIndex={-1} className={cn("flex-1 min-h-0 w-full mx-auto max-w-7xl px-4 pt-4 md:pt-6 pb-4 focus:outline-none", "gap-4 md:gap-6")}>
        <section className="relative h-full flex flex-col min-h-0 w-full">
          <Card className="h-full border-none shadow-medium ring-1 ring-black/5 dark:ring-white/10 flex flex-col overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-muted/30">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground/80">{panelTitle}</CardTitle>
              {activePanel === "mapa" && <Button variant="default" size="sm" onClick={startNewRoute} className="rounded-full shadow-lg shadow-primary/20"><Route className="h-4 w-4 mr-1" /> {language === 'es' ? 'Vivir / Crear Ruta' : 'Live / Create Route'}</Button>}
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
              {/* PANELS */}
              {activePanel === 'mapa' && (
                <MapaGoogle
                  sites={activeGuidedRoute ? sites.filter(s => activeGuidedRoute.puntos.includes(s.id)) : results}
                  onSelect={openSite}
                  allCategories={allCategories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  onClearCategories={clearFilters}
                  isFiltered={isFiltered || minRating > 0 || showAccessibilityOnly}
                  onResetFilter={handleResetFilter}
                  isLoading={isLoading}
                  activeRoute={activeGuidedRoute}
                  activeRouteStep={currentRouteStep}
                  minRating={minRating}
                  onRatingChange={setMinRating}
                  showAccessibilityOnly={showAccessibilityOnly}
                  onAccessibilityChange={setShowAccessibilityOnly}
                  plannedRoutePoints={newRoutePoints}
                />
              )}
              {activePanel === 'explorar' && <ExplorarPanel sites={sites} query={query} onOpenSite={openSite} onOpenRoute={openRoute} onNavigateToRoutes={() => setActivePanel('rutas')} onNavigateToAprende={() => setActivePanel('paquesepas')} rutasTematicas={rutasTematicas} />}
              {activePanel === 'eventos' && <EventosPanel eventos={eventos} query={query} sites={sites} onOpenEvent={openEvent} />}
              {activePanel === 'tendencias' && <TendenciasPanel items={tendencias} query={query} onOpenSite={openSite} />}
              {activePanel === 'favoritos' && <FavoritosPanel ids={favIds} query={query} onOpen={(id) => openSite(getSiteById(id)!)} onToggleFav={(id) => toggleFav(id, getSiteById(id)?.nombre || '')} sites={sites} />}
              {activePanel === 'reseñas' && <ResenasPanel reviews={reviews} sites={sites} />}
              {activePanel === 'rutas' && <RutasPanel query={query} rutas={userRoutes} suggestedRoutes={rutasTematicas} newPoints={newRoutePoints} allSites={sites} onAddPoint={(p) => setNewRoutePoints(prev => (prev.find(x => x.id === p.id) ? prev : [...prev, p]))} onRemovePoint={(id) => setNewRoutePoints(prev => prev.filter(x => x.id !== id))} onReorderPoints={setNewRoutePoints} onSave={saveNewRoute} onOpenDetail={openRoute} onTogglePrivacy={toggleRutaPrivacy} onDelete={deleteRoute} onUpdateDetails={updateRouteDetails} onStartRoute={(r) => { const res = startRoute(r); if (!res) { setAuthDialogOpen(true); } else if (res === 'started') { setActivePanel('mapa'); } }} onCompleteRoute={completeRouteById} routesInProgress={routesInProgress} routesCompleted={routesCompleted} />}
              {activePanel === 'perfil' && <PerfilPanel favCount={favIds.length} reviewsCount={reviews.length} rutasCount={userRoutes.length} insigniasCount={earnedInsignias.length} onOpenInsigniasModal={() => setShowInsigniasModal(true)} routesInProgressCount={routesInProgress.length} routesCompletedCount={routesCompleted.length} favoriteSiteIds={favIds} sites={sites} toggleFav={(id) => toggleFav(id, getSiteById(id)?.nombre || '')} onOpenSite={openSite} onNavigate={setActivePanel} />}
              {activePanel === 'configuracion' && <ConfiguracionPanel theme={theme} setTheme={setTheme} />}
              {activePanel === 'sobre' && <SobrePanel />}
              {activePanel === 'soporte' && <SoportePanel />}
              {activePanel === 'noticias' && <NoticiasPanel feed={feed} onOpenSite={openSite} sites={sites} />}
              {activePanel === 'paquesepas' && <PaQueSepasPanel entries={learnEntries} isLoading={isLoading} onOpenSite={(id) => openSite(getSiteById(id)!)} />}
              {activePanel === 'juegos' && <JuegosPanel onPlayGame={(gameId) => window.dispatchEvent(new CustomEvent('open-game', { detail: { gameId } }))} />}
              {activePanel === 'admin' && <AdminDashboard />}

              {/* Full View inside CardContent */}
              {fullView && ["site", "event", "route"].includes(fullView.type) && <FullView view={fullView} onClose={closeFull} isFav={(id) => favIds.includes(id)} toggleFav={(id) => toggleFav(id, getSiteById(id)?.nombre || '')} addReview={addReview} addToRoute={(site) => setNewRoutePoints(prev => (prev.find(p => p.id === site.id) ? prev : [...prev, site]))} goToPlaceInMap={goToPlaceInMap} onStartRoute={(r) => { const res = startRoute(r); if (!res) { setAuthDialogOpen(true); } else { if (res === 'started') { setActivePanel('mapa'); } closeFull(); } }} onCompleteRoute={() => { }} routesInProgress={routesInProgress} routesCompleted={routesCompleted} sites={sites} onAuthRequired={() => setAuthDialogOpen(true)} onNavigateToAprende={() => setActivePanel('paquesepas')} />}
              {fullView && fullView.type === 'challenge_lobby' && <ChallengeLobby challengeId={fullView.data.id} onClose={closeFull} isAuthenticated={isAuthenticated} onAccept={(gameId, challengeId) => { if (!isAuthenticated) { setAuthDialogOpen(true); } else { closeFull(); setActiveChallengeId(challengeId); setActiveGameId(gameId); } }} />}
              {fullView && fullView.type === 'challenge_verdict' && <ChallengeVerdict challengeId={fullView.data.id} onClose={closeFull} />}
            </CardContent>
          </Card>

          {/* Active Route Banner (Route Companion Panel) */}
          {activeGuidedRoute && (
            <ActiveRouteBanner
              route={activeGuidedRoute}
              currentStep={currentRouteStep}
              sites={sites}
              onCancel={() => setShowCancelConfirmation(true)}
              onNext={nextStep}
              onPrev={prevStep}
              onComplete={() => completeRouteById(activeGuidedRoute.id)}
              visitedPoints={visitedRoutePoints}
              onPointVisited={handlePointVisited}
              onSetStep={setCurrentRouteStep}
              onOpenSiteDetails={openSite}
            />
          )}
        </section>
      </main>

      <BottomNav activePanel={activePanel} setActivePanel={setActivePanel} />

      {/* Floating Buttons */}
      <div className="fixed bottom-24 md:bottom-8 right-4 flex flex-col-reverse items-end gap-2 z-[500]">
        <Button variant="destructive" size="icon" className="rounded-full shadow-lg h-11 w-11 hover:scale-110" onClick={() => handleShowSOS(true)}><AlertTriangle className="h-5 w-5" /></Button>
        <Button variant="secondary" size="icon" className="rounded-full shadow-md h-9 w-9" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
      </div>

      <Dialog open={showSOS} onOpenChange={handleShowSOS}>
        <DialogContent className="max-w-md border-destructive/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />{t('sos.title')}</DialogTitle>
            <DialogDescription className="text-foreground">{t('sos.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button variant="destructive" className="h-14 justify-start px-6 rounded-xl" onClick={() => { window.location.href = 'tel:123'; }}><Phone className="mr-3 h-5 w-5" />{t('sos.emergencyLine')}</Button>
            <Button variant="secondary" className="h-14 justify-start px-6 rounded-xl" onClick={() => { window.location.href = 'tel:123'; }}><Shield className="mr-3 h-5 w-5 text-primary" />{t('sos.touristLine')}</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Privacy Banner */}
      {showPrivacyBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-[2000] p-3 flex items-center gap-3 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span className="flex-1">Tus datos están protegidos.</span>
          <Button size="sm" onClick={() => setShowPrivacyBanner(false)} className="rounded-full">Aceptar</Button>
        </div>
      )}

      {/* Menus / Modals */}
      <Sheet open={openMenu} onOpenChange={setOpenMenu} side="left">
        <SheetContent className="w-80 p-0" showCloseButton={false}>
          <Sidebar onNavigate={(k) => { setActivePanel(k as any); setOpenMenu(false); }} onClose={() => setOpenMenu(false)} activePanel={activePanel} />
        </SheetContent>
      </Sheet>

      <InsigniasModal open={showInsigniasModal} onOpenChange={setShowInsigniasModal} earnedInsigniaIds={earnedInsignias} allInsignias={allInsignias} badgeProgress={badgeProgress} />

      <ReviewModal
        isOpen={!!reviewSiteId}
        onClose={handleReviewClose}
        site={sites.find(s => s.id === reviewSiteId)}
        onSubmit={addReview}
      />

      <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
        <DialogContent>
          <DialogHeader><DialogTitle>¿Cancelar Misión?</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelConfirmation(false)}>Continuar</Button>
            <Button variant="destructive" onClick={() => { setActiveGuidedRoute(null); setShowCancelConfirmation(false); setActivePanel("rutas"); }}>Sí, salir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewRoute && <RouteIntroModal route={previewRoute} sites={sites} onStart={() => { confirmStartRoute(); setActivePanel('mapa'); }} onClose={() => setPreviewRoute(null)} onAuthRequired={() => setAuthDialogOpen(true)} />}
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      <AppTutorialModal />
      <LegalAcceptanceModal />
      {activeGameId && <GameSessionModal key={`${activeGameId}-${gameSessionNonce}`} gameId={activeGameId} challengeId={activeChallengeId || undefined} onClose={() => { setActiveGameId(null); setActiveChallengeId(null); }} onNavigate={(panel) => { setActivePanel(panel as any); setActiveGameId(null); setActiveChallengeId(null); }} onRetry={() => setGameSessionNonce(n => n + 1)} />}
    </div>
  );
}
