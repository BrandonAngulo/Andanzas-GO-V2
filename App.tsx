
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Menu, Search, Route, User, Bell, Sparkles, Shield, AlertTriangle, Maximize2, Minimize2, Share2, Star, Phone, Accessibility, Map, X, MapPin } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Sheet, SheetContent } from "./components/ui/sheet";
import { ScrollArea } from "./components/ui/scroll-area";
// import { EVENTOS, RUTAS_TEMATICAS, NOTIFICACIONES, INSIGNIAS, NOTICIAS_FEED } from './constants';
import { sitesService } from './services/sites.service';
import { eventsService } from './services/events.service';
import { routesService } from './services/routes.service';
import { gamificationService } from './services/gamification.service';
import { userService } from './services/user.service';
import { reviewsService } from './services/reviews.service';
import { notificationsService } from './services/notifications.service';
import { newsService } from './services/news.service';
import { Site, Evento, Ruta, Review, ActivePanelType, Notificacion, FeedItem, Insignia } from './types';
import { cn, getTranslated } from './lib/utils';
import Sidebar from "./components/layout/Sidebar";

import MapaGoogle from "./components/map/MapaGoogle";
import ExplorarPanel from "./components/panels/ExplorarPanel";
import EventosPanel from "./components/panels/EventosPanel";
import TendenciasPanel from "./components/panels/TendenciasPanel";
import FavoritosPanel from "./components/panels/FavoritosPanel";
import ResenasPanel from "./components/panels/ResenasPanel";
import RutasPanel from "./components/panels/RutasPanel";
import PerfilPanel from "./components/panels/PerfilPanel";
import SobrePanel from "./components/panels/SobrePanel";
import SoportePanel from "./components/panels/SoportePanel";
import RightRail from "./components/layout/RightRail";
import FullView from "./components/views/FullView";
import BottomNav from "./components/layout/BottomNav";
import NotificationsPanel from "./components/layout/NotificationsPanel";
import InsigniasModal from "./components/panels/InsigniasModal";
import GuidedRouteModal from "./components/views/GuidedRouteModal";
import Logo from "./components/layout/Logo";
import AccessibilityMenu from "./components/layout/AccessibilityMenu";
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import { useI18n } from "./i18n";
import NoticiasPanel from "./components/panels/NoticiasPanel";
import ConfiguracionPanel from "./components/panels/ConfiguracionPanel";
import OnboardingModal from "./components/panels/OnboardingModal";
import ReviewModal from "./components/views/ReviewModal";
import { storage } from './lib/storage';
import { useAuth } from './contexts/AuthContext';

// Funciones de ayuda para enrutamiento simple (Hash Routing)
const parseHash = () => {
  const h = (window.location.hash || "").replace(/^#/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 2) {
    const [type, id] = parts;
    if (["site", "event", "route"].includes(type)) return { type, id };
  }
  return { type: null, id: null };
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
    history.back();
    setTimeout(() => {
      if (window.location.hash) window.location.hash = "";
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
  console.log("ANDANZAS GO - VERSION AUTH FIX DEPLOYED - " + new Date().toISOString());
  // Simple routing for legal pages
  const path = window.location.pathname;
  if (path === '/privacy') return <PrivacyPolicy />;
  if (path === '/terms') return <TermsOfService />;

  const { language, t } = useI18n();
  const { isAuthenticated, user } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanelType>("mapa");
  // Focus management
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Move focus to main content when panel changes to aid screen readers
    // Small timeout to ensure render
    setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.focus();
      }
    }, 100);
  }, [activePanel]);

  const [query, setQuery] = useState("");

  // Estado de Datos
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [rutasTematicas, setRutasTematicas] = useState<Ruta[]>([]);
  const [allInsignias, setAllInsignias] = useState<Insignia[]>([]);

  const [favIds, setFavIds] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [earnedInsignias, setEarnedInsignias] = useState<string[]>([]);
  const [routesInProgress, setRoutesInProgress] = useState<string[]>([]);
  const [routesCompleted, setRoutesCompleted] = useState<string[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(storage.getTheme());
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Cargar datos estáticos al inicio
  useEffect(() => {
    const loadStaticData = async () => {
      setIsLoading(true);

      // 1. Load critical data
      try {
        const [s, r, i, f] = await Promise.all([
          sitesService.getAll(),
          routesService.getAll(),
          gamificationService.getAllBadges(),
          newsService.getFeed()
        ]);
        setSites(s);
        setRutasTematicas(r);
        setAllInsignias(i);
        setFeed(f);
      } catch (error) {
        console.error("Failed to load critical static data", error);
      }

      // 2. Load Events separately (tolerant failure)
      try {
        console.log("App: Requesting events...");
        const e = await eventsService.getAll();
        console.log("App: Events received:", e.length);
        setEventos(e);
      } catch (evError) {
        console.error("App: Failed to load events safely", evError);
      }

      setIsLoading(false);
      setQuery("");
      setSelectedCategories([]);
    };
    loadStaticData();

    // Load local settings
    setRoutesInProgress(storage.getRoutesProgress());
    setRoutesCompleted(storage.getRoutesCompleted());
    setRutas(storage.getRoutes()); // User created routes (local for now, could be DB)
  }, []);

  // Cargar datos de usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      userService.getFavorites(user.id).then(setFavIds);
      reviewsService.getByUserId(user.id).then(setReviews);
      routesService.getUserRoutes(user.id).then(setRutas);
      notificationsService.getUserNotifications(user.id).then(setNotifications);
      gamificationService.getAllBadges().then(setAllInsignias);
      gamificationService.getUserBadgeIds(user.id).then(setEarnedInsignias);
      // Check for onboarding
      userService.getProfile(user.id).then(profile => {
        if (profile && (!profile.interests || profile.interests.length === 0)) {
          setShowOnboarding(true);
        }
      });
    } else {
      setFavIds([]);
      setEarnedInsignias([]);
    }
  }, [isAuthenticated, user]);

  const getSiteById = (id: string): Site | undefined => sites.find((s) => s.id === id);
  const getEventById = (id: string): Evento | undefined => eventos.find((e) => e.id === id);

  // Guardar datos al cambiar
  // Guardar datos al cambiar (Deprecated or updated)
  // useEffect(() => { storage.setFavorites(favIds); }, [favIds]); // Now in Supabase
  // useEffect(() => { storage.setReviews(reviews); }, [reviews]); // Now in Supabase (to implement)
  useEffect(() => { storage.setRoutes(rutas); }, [rutas]);
  useEffect(() => { storage.setInsignias(earnedInsignias); }, [earnedInsignias]);
  useEffect(() => { storage.setRoutesProgress(routesInProgress); }, [routesInProgress]);
  useEffect(() => { storage.setRoutesCompleted(routesCompleted); }, [routesCompleted]);

  // Aplicar Tema
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t: 'light' | 'dark') => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
    storage.setTheme(theme);
  }, [theme]);

  const [newRoutePoints, setNewRoutePoints] = useState<Site[]>([]);
  const [showSOS, setShowSOS] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState(defaultAccessibilitySettings);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const accessibilityMenuRef = useRef<HTMLDivElement>(null);

  const [aiTips, setAiTips] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const [aiSheetOpen, setAiSheetOpen] = useState(false);
  const [fullView, setFullView] = useState<{ type: string; data: any } | null>(null);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);

  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [showInsigniasModal, setShowInsigniasModal] = useState(false);
  const [activeGuidedRoute, setActiveGuidedRoute] = useState<Ruta | null>(null);
  const [visitedRoutePoints, setVisitedRoutePoints] = useState<string[]>([]);
  const [reviewSiteId, setReviewSiteId] = useState<string | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [currentRouteStep, setCurrentRouteStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const allCategories = useMemo(() => {
    const categories = new Set(sites.map(s => getTranslated(s, 'tipo', language) as string));
    return Array.from(categories).sort();
  }, [language, sites]);

  const addNotification = (notif: Omit<Notificacion, 'id' | 'fecha'>) => {
    setNotifications(prev => [{ ...notif, id: `n_${Date.now()}`, fecha: new Date().toISOString() }, ...prev]);
  };

  // Lógica de Gamificación (Insignias)
  useEffect(() => {
    const newInsignias = new Set(earnedInsignias);
    let insigniaEarned = false;

    const checkAndAddInsignia = (id: string) => {
      if (!newInsignias.has(id)) {
        newInsignias.add(id);
        const insigniaData = allInsignias.find(i => i.id === id);
        if (insigniaData) {
          addNotification({
            titulo: getTranslated(insigniaData, 'nombre', 'es') as string,
            titulo_en: getTranslated(insigniaData, 'nombre', 'en') as string,
            descripcion: `Has ganado la insignia: "${getTranslated(insigniaData, 'nombre', 'es')}"`,
            descripcion_en: `You've earned the badge: "${getTranslated(insigniaData, 'nombre', 'en')}"`,
            leida: false,
            icono: Star as any,
          });
        }
        insigniaEarned = true;
      }
    };

    if (favIds.length >= 1) checkAndAddInsignia('insignia-fav-1');
    if (reviews.length >= 1) checkAndAddInsignia('insignia-review-1');
    if (rutas.length >= 1) checkAndAddInsignia('insignia-route-1');
    if (routesCompleted.length > 0) checkAndAddInsignia('insignia-route-complete');

    if (insigniaEarned) {
      setEarnedInsignias(Array.from(newInsignias));
    }
  }, [favIds.length, reviews.length, rutas.length, routesCompleted.length, earnedInsignias, language, allInsignias]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(category); else newSet.delete(category);
      return Array.from(newSet);
    });
  };

  const clearCategories = () => setSelectedCategories([]);
  const unreadCount = notifications.filter(n => !n.leida).length;
  const markAsRead = (id: string) => setNotifications(notifications.map(n => n.id === id ? { ...n, leida: true } : n));
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, leida: true })));

  // Cerrar menús al hacer click fuera
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShowSOS = (open: boolean) => {
    if (open) { setAiSheetOpen(false); setShowNotifications(false); setShowAccessibilityMenu(false); }
    setShowSOS(open);
  };

  const generateAiRecommendations = async () => {
    alert("La función de IA estará disponible próximamente.");
  };

  const handleShowAiSheet = (open: boolean) => {
    if (open) alert("Asistente IA: Próximamente");
  };

  const handleShowNotifications = (open: boolean) => {
    if (open) { setShowSOS(false); setAiSheetOpen(false); setShowAccessibilityMenu(false); }
    setShowNotifications(open);
  }

  const handleShowAccessibilityMenu = (open: boolean) => {
    if (open) { setShowSOS(false); setAiSheetOpen(false); setShowNotifications(false); }
    setShowAccessibilityMenu(open);
  }

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Andanzas GO', text: t('shareText'), url: window.location.origin }); }
      catch (error) { console.error('Error sharing:', error); }
    } else { alert(t('shareNotSupported')); }
  };

  const allRutas = useMemo(() => [...rutasTematicas, ...rutas], [rutasTematicas, rutas]);

  const results = useMemo(() => {
    const queryFiltered = !query
      ? sites
      : sites.filter((s) => `${getTranslated(s, 'nombre', language)} ${getTranslated(s, 'tipo', language)}`.toLowerCase().includes(query.trim().toLowerCase()));

    if (selectedCategories.length === 0) return queryFiltered;
    return queryFiltered.filter(s => selectedCategories.includes(getTranslated(s, 'tipo', language) as string));
  }, [query, selectedCategories, language]);

  const tendencias = useMemo(() => [...sites].sort((a, b) => b.visitas + b.rating * 100 - (a.visitas + a.rating * 100)).slice(0, 10), [sites]);

  const newsFeed = useMemo(() => {
    const staticNews: FeedItem[] = feed;
    const reviewNews: FeedItem[] = reviews.map(r => ({ id: r.id, type: 'reseña_usuario' as const, fecha: r.createdAt, review: r }));
    return [...staticNews, ...reviewNews].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [reviews, feed]);

  const isFav = (id: string) => favIds.includes(id);
  const toggleFav = async (id: string) => {
    const isCurrentlyFav = favIds.includes(id);
    // Optimistic update
    setFavIds((prev) => (isCurrentlyFav ? prev.filter((x) => x !== id) : [...prev, id]));

    if (isAuthenticated && user) {
      try {
        if (isCurrentlyFav) {
          await userService.removeFavorite(user.id, id);
        } else {
          await userService.addFavorite(user.id, id);
          gamificationService.awardPoints(5, 'Favorito: ' + id);
          const badgeUnlocked = await gamificationService.unlockBadge(user.id, 'insignia-fav-1');
          if (badgeUnlocked) {
            addNotification({
              titulo: '¡Nueva Insignia!',
              titulo_en: 'New Badge!',
              descripcion: 'Has desbloqueado: Primer Favorito',
              descripcion_en: 'You unlocked: First Favorite',
              leida: false,
              icono: 'Award' as any,
            });
            setEarnedInsignias(prev => [...prev, 'insignia-fav-1']);
          }
        }
      } catch (error) {
        console.error("Error toggling favorite", error);
        // Revert on error
        setFavIds((prev) => (isCurrentlyFav ? [...prev, id] : prev.filter((x) => x !== id)));
      }
    }
  };

  const addReview = async (siteId: string, text: string, rating: number, fotos: File[]) => {
    const photoUrls = (fotos || []).slice(0, 3).map(f => URL.createObjectURL(f));
    const r: Review = { id: `rev_${Date.now()}`, siteId, text: text?.slice(0, 600), rating, fotos: photoUrls, createdAt: new Date().toISOString() };
    setReviews((prev) => [r, ...prev]);

    if (isAuthenticated && user) {
      reviewsService.addReview({ siteId, text, rating, fotos }, user.id)
        .then(async () => {
          gamificationService.awardPoints(20, 'Reseña: ' + siteId);
          const badgeUnlocked = await gamificationService.unlockBadge(user.id, 'insignia-review-1');
          if (badgeUnlocked) {
            addNotification({ titulo: '¡Nueva Insignia!', titulo_en: 'New Badge!', descripcion: 'Has desbloqueado: Crítico Local', descripcion_en: 'You unlocked: Local Critic', leida: false, icono: 'Award' as any });
            setEarnedInsignias(prev => [...prev, 'insignia-review-1']);
          }
        })
        .catch(console.error);
    }
  };

  const startNewRoute = () => {
    if (!isAuthenticated) { alert("Debes iniciar sesión para crear rutas."); setActivePanel("perfil"); return; }
    setNewRoutePoints([]); setActivePanel("rutas");
  };

  const saveNewRoute = async (name: string, description: string) => {
    if (!isAuthenticated || !name || newRoutePoints.length === 0 || !user) return;
    const ruta: Ruta = {
      id: `r_${Date.now()}`,
      nombre: name,
      puntos: newRoutePoints.map((p) => p.id),
      duracionMin: newRoutePoints.length * 20,
      descripcion: description || `Ruta personalizada con ${newRoutePoints.length} puntos.`,
      justificaciones: newRoutePoints.map(p => `Punto añadido: ${p.nombre}.`),
      publico: false,
    };
    // Optimistic update
    setRutas((r) => [ruta, ...r]);
    setNewRoutePoints([]);

    try {
      const savedRoute = await routesService.createRoute(ruta, user.id);
      if (savedRoute) {
        // Replace optimistic with real one (mostly for ID sync if generated by DB, but here we used client ID for now)
        setRutas(prev => prev.map(r => r.id === ruta.id ? savedRoute : r));
      }
    } catch (e) {
      console.error("Error saving route", e);
    }
  };

  const updateRouteDetails = async (id: string, newName: string, newDescription: string) => {
    setRutas(prevRutas => prevRutas.map(ruta => ruta.id === id ? { ...ruta, nombre: newName, descripcion: newDescription } : ruta));
    if (isAuthenticated) routesService.updateRoute({ id, nombre: newName, descripcion: newDescription });
  };

  const toggleRutaPrivacy = async (id: string) => {
    const route = rutas.find(r => r.id === id);
    if (!route) return;
    const newStatus = !route.publico;
    setRutas(rutas.map(ruta => ruta.id === id ? { ...ruta, publico: newStatus } : ruta));
    if (isAuthenticated) routesService.updateRoute({ id, publico: newStatus });
  };

  const deleteRoute = async (id: string) => {
    setRutas(prev => prev.filter(r => r.id !== id));
    if (isAuthenticated) routesService.deleteRoute(id);
  };

  const startRoute = (route: Ruta) => {
    if (!isAuthenticated) { alert("Inicia sesión para comenzar esta ruta."); setActivePanel("perfil"); return; }
    if (routesCompleted.includes(route.id)) return;
    setRoutesInProgress(prev => [...new Set([...prev, route.id])]);
    setActiveGuidedRoute(route);
    setVisitedRoutePoints([]); // Reset visited points
    setCurrentRouteStep(0);
    setShowRouteModal(false); // Do not open modal immediately
    setActivePanel("mapa"); // Go to map to see the path
    setFullView(null); // Close detail view
  };

  const checkRouteCompletion = (currentVisited: string[]) => {
    if (!activeGuidedRoute) return;
    const allVisited = activeGuidedRoute.puntos.every(pId => currentVisited.includes(pId));

    if (allVisited) {
      // Ask user if they want to complete? Or just complete?
      // For now, let's keep the manual "Complete" or auto-complete logic separate.
      // User requirement: "Close route when all sites visited, not when clicked complete".
      // So we should probably allow a "Finalize" action or auto-finalize.
      // Let's rely on the final "Success" modal of the last point or a specific effect.
    }
  };

  const handlePointVisited = (siteId: string) => {
    // Add to visited
    setVisitedRoutePoints(prev => {
      if (prev.includes(siteId)) return prev;
      return [...prev, siteId];
    });
    // Trigger Review Modal
    setReviewSiteId(siteId);
    setShowRouteModal(false);
  };

  const handleReviewClose = () => {
    setReviewSiteId(null);
    // Check for route completion AFTER review is closed/skipped
    if (activeGuidedRoute && activeGuidedRoute.puntos.every(p => visitedRoutePoints.includes(p))) {
      // All visited!
      setTimeout(() => completeRoute(activeGuidedRoute.id), 500);
    }
  };

  const completeRoute = (id: string) => {
    setRoutesInProgress(prev => prev.filter(rId => rId !== id));
    setRoutesCompleted(prev => [...new Set([...prev, id])]);
    setActiveGuidedRoute(null);

    const completedRoute = allRutas.find(r => r.id === id);
    const closingMsg = getTranslated(completedRoute, 'mensajeCierre', language);
    const defaultMsg = language === 'es' ? '¡Felicitaciones! Has completado una andanza.' : 'Congratulations! You have completed a journey.';

    if (isAuthenticated && user) {
      gamificationService.awardPoints(100, 'Ruta completada: ' + id);
      gamificationService.unlockBadge(user.id, 'insignia-route-complete').then(unlocked => {
        if (unlocked) {
          setEarnedInsignias(prev => [...prev, 'insignia-route-complete']);
        }
      });
    }

    addNotification({
      titulo: '¡Ruta Completada!',
      titulo_en: 'Route Completed!',
      descripcion: closingMsg || defaultMsg,
      descripcion_en: closingMsg || defaultMsg, // Simplification: we use translated content directly

      leida: false,
      icono: Route as any,
    });
    setShowRouteModal(false);
    setVisitedRoutePoints([]);
  };

  const handleNextStep = () => { if (activeGuidedRoute && currentRouteStep < activeGuidedRoute.puntos.length - 1) setCurrentRouteStep(prev => prev + 1); };
  const handlePrevStep = () => { if (currentRouteStep > 0) setCurrentRouteStep(prev => prev - 1); };
  const handleCloseGuidedRoute = () => setShowRouteModal(false);

  const panelTitle = t(`panelTitles.${activePanel}`);

  useEffect(() => {
    const syncFromHash = () => {
      const r = parseHash();
      const currentViewId = fullView?.data?.id;
      if (r.id === currentViewId && r.type === fullView?.type) return;
      if (!r.type || !r.id) { if (fullView !== null) setFullView(null); return; }
      if (r.type === "site") setFullView({ type: "site", data: getSiteById(r.id) });
      if (r.type === "event") setFullView({ type: "event", data: getEventById(r.id) });
      if (r.type === "route") setFullView({ type: "route", data: allRutas.find(route => route.id === r.id) });
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [allRutas, fullView]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-multiplier', String(accessibilitySettings.fontSize));
    root.style.setProperty('--line-height-multiplier', String(accessibilitySettings.lineHeight));
    root.dataset.highContrast = String(accessibilitySettings.highContrast);
    root.dataset.grayscale = String(accessibilitySettings.grayscale);
    root.lang = language;
  }, [accessibilitySettings, language]);

  const openSite = (s: Site) => {
    // If a route is active and the clicked site is part of the route, 
    // we just update the current step pointer. 
    if (activeGuidedRoute && activeGuidedRoute.puntos.includes(s.id)) {
      const stepIndex = activeGuidedRoute.puntos.indexOf(s.id);
      setCurrentRouteStep(stepIndex);
      // We do NOT return here anymore; we want to open FullView so user can see details
    }

    pushHash({ type: "site", id: s.id });
    sitesService.incrementVisit(s.id);
    if (isAuthenticated && user) {
      gamificationService.awardPoints(1, 'Visita: ' + s.nombre);
    }
  };
  const openEvent = (e: Evento) => pushHash({ type: "event", id: e.id });
  const openRoute = (r: Ruta) => pushHash({ type: "route", id: r.id });
  const closeFull = () => clearHash();

  const goToPlaceInMap = (placeName: string) => { setActivePanel("mapa"); setQuery(placeName); closeFull(); };
  const gridClass = focusMode ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-[260px_1fr_320px]";

  const RightRailWrapper = () => (
    <div className="sticky top-[70px] space-y-4">
      <RightRail aiTips={false} onOpenSite={openSite} sites={sites} />
    </div>
  );

  const isFiltered = query.trim() !== '' || selectedCategories.length > 0;
  const handleResetFilter = () => {
    setQuery('');
    setSelectedCategories([]);
    if (activePanel !== 'mapa') setActivePanel('mapa');
  };

  return (
    <div className="min-h-screen w-full bg-muted/20">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[2000] focus:px-4 focus:py-2 focus:bg-background focus:text-primary focus:border focus:rounded-md shadow-lg transition-transform">
        {language === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
      </a>
      <header className="sticky top-0 z-[1000] backdrop-blur-xl bg-background/80 border-b shadow-sm support-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className={!focusMode ? "md:hidden" : ""} aria-label={t('openMenu')} onClick={() => setOpenMenu(true)}><Menu className="h-5 w-5" /></Button>
          <div className="flex items-center gap-2 mr-2"><Logo /></div>

          <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-black/5 dark:border-white/5" aria-label={language === 'es' ? 'Navegación principal' : 'Main navigation'}>
            <Button size="sm" className="rounded-full px-4" variant={activePanel === "mapa" ? "default" : "ghost"} onClick={() => setActivePanel("mapa")} aria-current={activePanel === "mapa" ? "page" : undefined}>{t('nav.map')}</Button>
            <Button size="sm" className="rounded-full px-4" variant={activePanel === "explorar" ? "default" : "ghost"} onClick={() => setActivePanel("explorar")} aria-current={activePanel === "explorar" ? "page" : undefined}>{t('nav.explore')}</Button>
            <Button size="sm" className="rounded-full px-4" variant={activePanel === "rutas" ? "default" : "ghost"} onClick={() => setActivePanel("rutas")} aria-current={activePanel === "rutas" ? "page" : undefined}>{t('nav.routes')}</Button>
            <Button size="sm" className="rounded-full px-4" variant={activePanel === "noticias" ? "default" : "ghost"} onClick={() => setActivePanel("noticias")} aria-current={activePanel === "noticias" ? "page" : undefined}>{t('nav.news')}</Button>
          </nav>

          <div className="flex-1" />
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
              {query.length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-popover rounded-xl border shadow-lg overflow-hidden z-[60] animate-in slide-in-from-top-2 fade-in duration-200">
                  <ScrollArea className="max-h-[300px]">
                    <div className="p-1 space-y-0.5">
                      {(() => {
                        const siteMatches = sites.filter(s => s.nombre.toLowerCase().includes(query.toLowerCase()) || s.tipo.toLowerCase().includes(query.toLowerCase()));
                        const eventMatches = eventos.filter(e => e.titulo.toLowerCase().includes(query.toLowerCase()));

                        if (siteMatches.length === 0 && eventMatches.length === 0) {
                          return (
                            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                              <p>No encontramos resultados para "{query}"</p>
                            </div>
                          );
                        }

                        return (
                          <>
                            {siteMatches.length > 0 && <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">Sitios</div>}
                            {siteMatches.map(s => (
                              <button
                                key={s.id}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center gap-2 transition-colors"
                                onClick={() => {
                                  pushHash({ type: 'site', id: s.id });
                                  setQuery('');
                                }}
                              >
                                <Map className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate flex-1 font-medium">{s.nombre}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-2 capitalize">{s.tipo}</span>
                              </button>
                            ))}

                            {eventMatches.length > 0 && <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 mt-2">Eventos</div>}
                            {eventMatches.map(e => (
                              <button
                                key={e.id}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center gap-2 transition-colors"
                                onClick={() => {
                                  pushHash({ type: 'event', id: e.id });
                                  setQuery('');
                                }}
                              >
                                <Sparkles className="h-4 w-4 text-orange-500" />
                                <span className="truncate flex-1 font-medium">{e.titulo}</span>
                                <span className="text-xs text-muted-foreground">{e.fecha}</span>
                              </button>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative" ref={notificationsRef}>
              <Button id="notifications-bell" variant="ghost" size="icon" className="rounded-full hover:bg-muted" aria-label={t('notifications.title')} onClick={() => handleShowNotifications(!showNotifications)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-orange-500 border border-background" />}
              </Button>
              {showNotifications && <NotificationsPanel notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} />}
            </div>
            <div className="relative" ref={accessibilityMenuRef}>
              <Button id="accessibility-button" variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={() => handleShowAccessibilityMenu(!showAccessibilityMenu)} aria-label={t('accessibilityOptions')} title={t('accessibilityOptions')}>
                <Accessibility className="h-6 w-6" />
              </Button>
              {showAccessibilityMenu && <AccessibilityMenu settings={accessibilitySettings} onSettingsChange={setAccessibilitySettings} onReset={() => setAccessibilitySettings(defaultAccessibilitySettings)} />}
            </div>
            {/* User Profile / Login Quick Access */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full hover:bg-muted", isAuthenticated ? "text-primary" : "")}
              onClick={() => setActivePanel((prev) => prev === 'perfil' ? 'mapa' : 'perfil')}
              aria-label={isAuthenticated ? t('panelTitles.perfil') : (t('loginTitle') || "Iniciar Sesión")}
              title={isAuthenticated ? t('panelTitles.perfil') : (t('loginTitle') || "Iniciar Sesión")}
            >
              <User className="h-5 w-5" />
            </Button>

            <Button variant={focusMode ? "default" : "outline"} size="icon" className="ml-1 rounded-full shadow-sm" aria-label={focusMode ? t('focusModeOff') : t('focusModeOn')} onClick={() => setFocusMode((v) => !v)}>
              {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main ref={mainRef} id="main-content" tabIndex={-1} className={cn("mx-auto max-w-7xl px-4 py-6 focus:outline-none", gridClass, "gap-6")}>
        {!focusMode && <aside className="hidden md:block sticky top-[70px] h-[calc(100vh-100px)]"><Sidebar onNavigate={(k) => setActivePanel(k as ActivePanelType)} onClose={() => { }} activePanel={activePanel as ActivePanelType} /></aside>}
        <section className="relative min-h-[60vh] flex flex-col">
          <Card className="h-full border-none shadow-medium ring-1 ring-black/5 dark:ring-white/10 flex flex-col overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4 bg-muted/30">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground/80">{panelTitle}</CardTitle>
              {activePanel === "mapa" && <Button variant="default" size="sm" onClick={startNewRoute} className="rounded-full shadow-lg shadow-primary/20"><Route className="h-4 w-4 mr-1" /> {t('createRoute')}</Button>}
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
              {activePanel === 'mapa' && <MapaGoogle sites={activeGuidedRoute ? sites.filter(s => activeGuidedRoute.puntos.includes(s.id)) : results} onSelect={openSite} allCategories={allCategories} selectedCategories={selectedCategories} onCategoryChange={handleCategoryChange} onClearCategories={clearCategories} isFiltered={isFiltered} onResetFilter={handleResetFilter} isLoading={isLoading} activeRoute={activeGuidedRoute} />}
              {activePanel === 'explorar' && <ExplorarPanel sites={sites} events={eventos} query={query} onOpenSite={openSite} onOpenEvent={openEvent} />}
              {activePanel === 'eventos' && <EventosPanel eventos={eventos} query={query} sites={sites} onOpenEvent={openEvent} />}
              {activePanel === 'tendencias' && <TendenciasPanel items={tendencias} query={query} onOpenSite={openSite} />}
              {activePanel === 'favoritos' && <FavoritosPanel ids={favIds} query={query} onOpen={(id) => openSite(getSiteById(id)!)} onToggleFav={toggleFav} sites={sites} />}
              {activePanel === 'reseñas' && <ResenasPanel reviews={reviews} sites={sites} />}
              {activePanel === 'rutas' && <RutasPanel query={query} rutas={rutas} suggestedRoutes={rutasTematicas} newPoints={newRoutePoints} allSites={sites} onAddPoint={(p) => setNewRoutePoints((prev) => (prev.find((x) => x.id === p.id) ? prev : [...prev, p]))} onRemovePoint={(id) => setNewRoutePoints((prev) => prev.filter((x) => x.id !== id))} onSave={saveNewRoute} onOpenDetail={openRoute} onTogglePrivacy={toggleRutaPrivacy} onDelete={deleteRoute} onUpdateDetails={updateRouteDetails} onStartRoute={startRoute} onCompleteRoute={completeRoute} routesInProgress={routesInProgress} routesCompleted={routesCompleted} />}
              {activePanel === 'perfil' && <PerfilPanel favCount={favIds.length} reviewsCount={reviews.length} rutasCount={rutas.length} insigniasCount={earnedInsignias.length} onOpenInsigniasModal={() => setShowInsigniasModal(true)} routesInProgressCount={routesInProgress.length} routesCompletedCount={routesCompleted.length} favoriteSiteIds={favIds} sites={sites} toggleFav={toggleFav} />}
              {activePanel === 'configuracion' && <ConfiguracionPanel theme={theme} setTheme={setTheme} />}
              {activePanel === 'sobre' && <SobrePanel />}
              {activePanel === 'soporte' && <SoportePanel />}
              {activePanel === 'noticias' && <NoticiasPanel feed={newsFeed} onOpenSite={openSite} sites={sites} />}
            </CardContent>
          </Card>
        </section>
        {!focusMode && <aside className="hidden md:block"><RightRailWrapper /></aside>}
      </main>

      <BottomNav activePanel={activePanel} setActivePanel={setActivePanel} />

      <div className="fixed bottom-24 md:bottom-8 right-4 flex flex-col-reverse items-end gap-2 z-[500]">
        <Button variant="destructive" size="icon" className="rounded-full shadow-lg shadow-destructive/30 h-11 w-11 hover:scale-110 transition-transform" aria-label={t('sos.title')} onClick={() => handleShowSOS(true)}><AlertTriangle className="h-5 w-5" /></Button>
        <Button variant="secondary" size="icon" className="rounded-full shadow-md h-9 w-9 opacity-80 hover:opacity-100 hover:scale-110 transition-all border border-border/50" aria-label={t('share')} onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
      </div>

      <Sheet open={aiSheetOpen} onOpenChange={handleShowAiSheet} side="right">
        <SheetContent className="w-[360px] p-6 overflow-y-auto border-l border-border/50">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary"><Sparkles className="fill-primary/20" /> Asistente IA</h2>
          {isAiLoading ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Analizando tus gustos y el clima...</p>
              <div className="h-32 bg-muted animate-pulse rounded-xl"></div>
            </div>
          ) : aiTips ? (
            <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: aiTips }} />
          ) : (
            <div className="text-center py-8">
              <p className="mb-4 text-muted-foreground">Obtén recomendaciones personalizadas basadas en tus favoritos y la hora del día.</p>
              <Button onClick={generateAiRecommendations} className="w-full rounded-full shadow-glow">Generar Plan</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showSOS} onOpenChange={handleShowSOS}>
        <DialogContent className="max-w-md border-destructive/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />{t('sos.title')}</DialogTitle>
            <DialogDescription className="text-foreground">{t('sos.description')}</DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-destructive/5 rounded-lg text-xs text-muted-foreground mb-4 border border-destructive/10">
            <p className="font-semibold mb-1 text-destructive">Aviso Importante:</p>{t('sos.disclaimer')}
          </div>
          <div className="grid gap-3">
            <Button variant="destructive" className="h-14 text-base justify-start px-6 rounded-xl shadow-lg shadow-destructive/20"><Phone className="mr-3 h-5 w-5" />{t('sos.emergencyLine')}</Button>
            <Button variant="secondary" className="h-14 text-base justify-start px-6 rounded-xl border-2 border-transparent hover:border-primary/20"><Shield className="mr-3 h-5 w-5 text-primary" />{t('sos.touristLine')}</Button>
          </div>
          <DialogFooter className="mt-4"><Button onClick={() => handleShowSOS(false)} variant="outline" className="rounded-full">{t('sos.understood')}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {fullView && <FullView view={fullView} onClose={closeFull} isFav={isFav} toggleFav={toggleFav} addReview={addReview} addToRoute={(site) => setNewRoutePoints((prev) => (prev.find((p) => p.id === site.id) ? prev : [...prev, site]))} goToPlaceInMap={goToPlaceInMap} onStartRoute={startRoute} onCompleteRoute={completeRoute} routesInProgress={routesInProgress} routesCompleted={routesCompleted} sites={sites} />}

      {!focusMode && showPrivacyBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50 transition-transform duration-500 animate-in slide-in-from-bottom-full">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="flex-1 md:flex-none">{t('privacyBanner.text1')}{' '}<span className="font-medium text-primary">{t('privacyBanner.text2')}</span>.</span>
            <div className="flex-1 hidden md:block" />
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-8">{t('privacyBanner.review')}</Button>
              <Button size="sm" onClick={() => setShowPrivacyBanner(false)} className="h-8 rounded-full shadow-sm">{t('privacyBanner.accept')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Route Floating Control */}
      {
        activeGuidedRoute && !showRouteModal && activePanel === 'mapa' && (
          <div className="fixed bottom-24 left-4 right-4 z-[900] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md">
            <Card className="bg-background/95 backdrop-blur shadow-2xl border-primary/20 ring-1 ring-primary/10">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                      {t('guidedRoute.activeRoute') || "Ruta Activa"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {currentRouteStep + 1} / {activeGuidedRoute.puntos.length} • {getTranslated(sites.find(s => s.id === activeGuidedRoute.puntos[currentRouteStep]), 'nombre', language)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm truncate">{getTranslated(activeGuidedRoute, 'nombre', language)}</h4>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/10" onClick={() => { setActiveGuidedRoute(null); setRoutesInProgress(prev => prev.filter(id => id !== activeGuidedRoute.id)); }}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cancelar</span>
                  </Button>
                  <Button onClick={() => setShowRouteModal(true)} className="h-10 px-4 rounded-full shadow-lg shadow-primary/20">
                    <MapPin className="h-4 w-4 mr-2" />
                    {t('guidedRoute.imHere') || "¡Estoy Aquí!"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      }

      <Sheet open={openMenu} onOpenChange={setOpenMenu} side="left">
        <SheetContent className="w-80 p-0" showCloseButton={false}>
          <Sidebar onNavigate={(k) => { setActivePanel(k as ActivePanelType); setOpenMenu(false); }} onClose={() => setOpenMenu(false)} activePanel={activePanel as ActivePanelType} />
        </SheetContent>
      </Sheet>

      <InsigniasModal open={showInsigniasModal} onOpenChange={setShowInsigniasModal} earnedInsigniaIds={earnedInsignias} allInsignias={allInsignias} />

      {
        activeGuidedRoute && showRouteModal && (
          <GuidedRouteModal
            route={activeGuidedRoute}
            currentStep={currentRouteStep}
            onClose={handleCloseGuidedRoute}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onComplete={() => handlePointVisited(activeGuidedRoute.puntos[currentRouteStep])} // Just mark point as visited
            sites={sites}
            isVisited={visitedRoutePoints.includes(activeGuidedRoute.puntos[currentRouteStep])}
          />
        )
      }

      <ReviewModal
        isOpen={!!reviewSiteId}
        onClose={handleReviewClose}
        site={sites.find(s => s.id === reviewSiteId)}
        onSubmit={addReview}
      />

      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div >
  );
}
