import { useState, useCallback } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n';
import { Ruta, Site } from '../types';
import { gamificationService } from '../services/gamification.service';
import { getTranslated } from '../lib/utils';
import { Route } from 'lucide-react';

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

    // Helpers
    const getSiteById = (id: string) => sites.find(s => s.id === id);

    const startRoute = (route: Ruta) => {
        if (!isAuthenticated) return false; // Controller should handle auth dialog
        if (routesCompleted.includes(route.id)) return false;

        // Check if it's a curated route (Passport Mode)
        const isCurated = rutasTematicas.some(r => r.id === route.id);
        if (isCurated) {
            setPreviewRoute(route);
            return true;
        }

        // Direct start
        launchRouteSession(route);
        return true;
    };

    const launchRouteSession = (route: Ruta) => {
        const newInProgress = [...new Set([...routesInProgress, route.id])];
        updateRouteProgress(newInProgress, routesCompleted); // Sync state

        setActiveGuidedRoute(route);
        setVisitedRoutePoints([]);
        setCurrentRouteStep(0);
        setShowRouteModal(false);
        setPreviewRoute(null);
    };

    const confirmStartRoute = () => {
        if (previewRoute) launchRouteSession(previewRoute);
    };

    const handlePointVisited = (siteId: string) => {
        setVisitedRoutePoints(prev => {
            if (prev.includes(siteId)) return prev;
            return [...prev, siteId];
        });
        setReviewSiteId(siteId); // Trigger review prompt
        setShowRouteModal(false);
    };

    const handleReviewClose = () => {
        setReviewSiteId(null);
        // Auto-complete check
        if (activeGuidedRoute && activeGuidedRoute.puntos.every(p => visitedRoutePoints.includes(p))) {
            completeRoute(activeGuidedRoute);
        }
    };

    const completeRoute = (route: Ruta) => {
        const newInProgress = routesInProgress.filter(rId => rId !== route.id);
        const newCompleted = [...new Set([...routesCompleted, route.id])];

        updateRouteProgress(newInProgress, newCompleted);
        setActiveGuidedRoute(null);

        const closingMsg = getTranslated(route, 'mensajeCierre', language);
        const defaultMsg = language === 'es' ? '¡Felicitaciones! Has completado una andanza.' : 'Congratulations! You have completed a journey.';

        if (isAuthenticated && user) {
            gamificationService.awardPoints(100, 'Ruta completada: ' + route.id);
            gamificationService.unlockBadge(user.id, 'insignia-route-complete').then(unlocked => {
                // Determine if we need to show badge notification here or if UserData detects it
                // For simplicity, we can trust the UserContext to refresh badges or we handle it here
            });
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
        }
    };
};
