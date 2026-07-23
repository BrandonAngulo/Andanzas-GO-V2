import { useRef, useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n';
import { Ruta, Site } from '../types';
import { gamificationService } from '../services/gamification.service';
import { routesService } from '../services/routes.service';
import { analyticsService } from '../services/analytics.service';
import { getTranslated } from '../lib/utils';
import { Route } from 'lucide-react';
import { toast } from 'sonner';

export const useRouteNavigation = () => {
    const { sites, rutasTematicas } = useAppData();
    const {
        routesInProgress,
        routesCompleted,
        updateRouteProgress,
        addNotification,
        earnedInsignias
    } = useUserData();
    const { user, isAuthenticated } = useAuth();
    const { language } = useI18n();

    // UI State for the Guided Mode
    const [activeGuidedRoute, setActiveGuidedRoute] = useState<Ruta | null>(null);
    const [previewRoute, setPreviewRoute] = useState<Ruta | null>(null); // For passport mode preview
    const [visitedRoutePoints, setVisitedRoutePoints] = useState<string[]>([]); // Ephemeral for this session
    const [currentRouteStep, setCurrentRouteStep] = useState(0);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [reviewSiteId, setReviewSiteId] = useState<string | null>(null);
    const pendingStopClaimRef = useRef<Promise<unknown> | null>(null);

    // Helpers
    const getSiteById = (id: string) => sites.find(s => s.id === id);

    const startRoute = (route: Ruta) => {
        // Check if it's a curated route (Passport Mode)
        const isCurated = rutasTematicas.some(r => r.id === route.id);
        if (isCurated) {
            setPreviewRoute(route);
            return 'preview';
        }

        // Direct start
        launchRouteSession(route);
        return 'started';
    };

    const launchRouteSession = (route: Ruta) => {
        const restartingCompletedRoute = routesCompleted.includes(route.id);
        const newInProgress = [...new Set([...routesInProgress, route.id])];
        const newCompleted = routesCompleted.filter(routeId => routeId !== route.id);
        updateRouteProgress(newInProgress, newCompleted); // Sync state

        setActiveGuidedRoute(route);
        setVisitedRoutePoints([]);
        setCurrentRouteStep(0);
        setShowRouteModal(false);
        setPreviewRoute(null);

        void analyticsService.trackEvent('route_started', 'route', route.id, {
            stops_total: route.puntos.length,
            completion_status: route.completion_status || null,
            gamification_level: route.gamification_level || null,
        });

        if (isAuthenticated && user) {
            void routesService.startOrResumeRoute(user.id, route, restartingCompletedRoute).then(progress => {
                if (!progress || progress.status === 'completed') return;
                const validVisited = progress.visitedStopIds.filter(id => route.puntos.includes(id));
                setVisitedRoutePoints(validVisited);

                const firstPendingIndex = route.puntos.findIndex(id => !validVisited.includes(id));
                if (firstPendingIndex >= 0) {
                    setCurrentRouteStep(firstPendingIndex);
                } else if (progress.lastStopId) {
                    setCurrentRouteStep(Math.max(route.puntos.indexOf(progress.lastStopId), 0));
                }

                if (validVisited.length > 0) {
                    toast.success(
                        language === 'es'
                            ? `Retomamos tu recorrido: ${validVisited.length} paradas conservadas`
                            : `Route resumed: ${validVisited.length} stops restored`
                    );
                    void analyticsService.trackEvent('route_resumed', 'route', route.id, {
                        stops_visited: validVisited.length,
                        progress_percent: progress.progressPercent,
                    });
                }
            });
        }
    };

    const confirmStartRoute = () => {
        if (previewRoute) launchRouteSession(previewRoute);
    };

    const handlePointVisited = (siteId: string) => {
        const updatedVisited = visitedRoutePoints.includes(siteId)
            ? visitedRoutePoints
            : [...visitedRoutePoints, siteId];
        setVisitedRoutePoints(updatedVisited);
        setReviewSiteId(siteId); // Trigger review prompt
        setShowRouteModal(false);
        if (isAuthenticated && activeGuidedRoute) {
            void routesService.saveStopProgress(user!.id, activeGuidedRoute, siteId, updatedVisited);
            void analyticsService.trackEvent('route_stop_completed', 'route', activeGuidedRoute.id, {
                stop_id: siteId,
                stop_index: activeGuidedRoute.puntos.indexOf(siteId),
                stops_visited: updatedVisited.length,
                stops_total: activeGuidedRoute.puntos.length,
            });
            const claim = gamificationService.claimActionPoints('route_stop', activeGuidedRoute.id, siteId).then(result => {
                const points = Number(result?.points_awarded || 0);
                if (points > 0) toast.success(`+${points} puntos por visitar esta parada`);
            });
            pendingStopClaimRef.current = claim;
        }
    };

    const handleReviewClose = () => {
        setReviewSiteId(null);
        // Auto-complete check
        if (activeGuidedRoute && activeGuidedRoute.puntos.every(p => visitedRoutePoints.includes(p))) {
            const route = activeGuidedRoute;
            void (pendingStopClaimRef.current || Promise.resolve()).finally(() => completeRoute(route));
        }
    };

    const completeRoute = (route: Ruta) => {
        const newInProgress = routesInProgress.filter(rId => rId !== route.id);
        const newCompleted = [...new Set([...routesCompleted, route.id])];

        updateRouteProgress(newInProgress, newCompleted);
        setActiveGuidedRoute(null);

        const closingMsg =
            getTranslated(route, 'closing_text', language) ||
            getTranslated(route, 'mensajeCierre', language);
        const defaultMsg = language === 'es' ? '¡Felicitaciones! Has completado una andanza.' : 'Congratulations! You have completed a journey.';

        if (isAuthenticated && user) {
            void routesService.completeDetailedRoute(user.id, route, visitedRoutePoints);
            void analyticsService.trackEvent('route_completed', 'route', route.id, {
                stops_total: route.puntos.length,
                points_reward: route.points_reward || 0,
            });
            void gamificationService.claimActionPoints('route_complete', route.id).then(result => {
                const points = Number(result?.points_awarded || 0);
                if (points > 0) toast.success(`Bono final de ruta: +${points} puntos`);
            });
            gamificationService.incrementFamilyProgress(user.id, 'route_complete');
        }

        addNotification({
            titulo: language === 'es' ? '¡Ruta Completada!' : 'Route Completed!',
            titulo_en: 'Route Completed!',
            descripcion: closingMsg || defaultMsg,
            descripcion_en: closingMsg || defaultMsg, // Simplification
            leida: false,
            icono: Route as any,
        });

        setShowRouteModal(false);
        setVisitedRoutePoints([]);
    };

    const abandonActiveRoute = () => {
        if (!activeGuidedRoute) return;
        const route = activeGuidedRoute;
        if (isAuthenticated && user) {
            void routesService.abandonRoute(user.id, route, visitedRoutePoints);
            void analyticsService.trackEvent('route_abandoned', 'route', route.id, {
                stops_visited: visitedRoutePoints.length,
                stops_total: route.puntos.length,
            });
        }
        updateRouteProgress(
            routesInProgress.filter(routeId => routeId !== route.id),
            routesCompleted,
        );
        setActiveGuidedRoute(null);
        setVisitedRoutePoints([]);
        setCurrentRouteStep(0);
    };

    const nextStep = () => {
        if (activeGuidedRoute && currentRouteStep < activeGuidedRoute.puntos.length - 1) {
            setCurrentRouteStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentRouteStep > 0) {
            setCurrentRouteStep(prev => prev - 1);
        }
    };

    return {
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
        completeRouteById: (id: string) => {
            const r = rutasTematicas.find(x => x.id === id); // We need to search in all routes (static + user)
            // Ideally we need access to allRoutes here, but custom routes are in App state currently.
            // This is a limitation of the current refactor split.
            // However, the "Complete" button usually only appears for active guided routes.
            if (activeGuidedRoute && activeGuidedRoute.id === id) {
                completeRoute(activeGuidedRoute);
            }
        },
        abandonActiveRoute,
    };
};
