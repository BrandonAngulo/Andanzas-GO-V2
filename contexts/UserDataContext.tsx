import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Review, Notificacion, Insignia, UserProfile } from '../types';
import { userService } from '../services/user.service';
import { reviewsService } from '../services/reviews.service';
import { notificationsService } from '../services/notifications.service';
import { gamificationService } from '../services/gamification.service';
import { routesService } from '../services/routes.service';
import { Star, Award } from 'lucide-react'; // Using Lucide names purely for type consistency if needed, though mostly strings here

// Type for the icon in notifications - usually passed as a component or string
// In App.tsx it was casting standard Lucide icons as "any" or specific types. 
// We will stick to the data structure.

interface UserDataContextType {
    favIds: string[];
    reviews: Review[];
    earnedInsignias: string[];
    notifications: Notificacion[];
    routesInProgress: string[];
    routesCompleted: string[];
    userProfile: UserProfile | null;

    // Actions
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    toggleFav: (id: string, siteName: string) => Promise<void>;
    addReview: (siteId: string, text: string, rating: number, fotos: File[]) => Promise<void>;
    addNotification: (notif: Omit<Notificacion, 'id' | 'fecha'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;

    // Route progress (could arguably be in RouteContext, but it's user data)
    updateRouteProgress: (inProgress: string[], completed: string[]) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    const [favIds, setFavIds] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [earnedInsignias, setEarnedInsignias] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<Notificacion[]>([]);

    // Route progress is kept locally for immediate UI feedback and persisted in Supabase.
    const [routesInProgress, setRoutesInProgress] = useState<string[]>([]);
    const [routesCompleted, setRoutesCompleted] = useState<string[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        let active = true;
        if (isAuthenticated && user) {
            userService.getFavorites(user.id).then(setFavIds);
            reviewsService.getByUserId(user.id).then(setReviews);
            // Genera (si toca) la notificación de la Pregunta del día antes de leer la bandeja.
            notificationsService.ensureDailyNotification().finally(() => {
                if (active) notificationsService.getUserNotifications(user.id).then(n => { if (active) setNotifications(n); });
            });
            gamificationService.getUserBadgeIds(user.id).then(setEarnedInsignias);
            userService.getProfile(user.id).then(setUserProfile);
            routesService.getUserRouteProgress(user.id).then(progress => {
                if (!active) return;
                setRoutesInProgress(progress.inProgress);
                setRoutesCompleted(progress.completed);
            });
        } else {
            setFavIds([]);
            setReviews([]);
            setEarnedInsignias([]);
            setNotifications([]);
            setRoutesInProgress([]);
            setRoutesCompleted([]);
            setUserProfile(null);
        }
        return () => { active = false; };
    }, [isAuthenticated, user]);

    const addNotification = (notif: Omit<Notificacion, 'id' | 'fecha'>) => {
        setNotifications(prev => [{ ...notif, id: `n_${Date.now()}`, fecha: new Date().toISOString() }, ...prev]);
    };

    const toggleFav = async (id: string, siteName: string) => {
        const isCurrentlyFav = favIds.includes(id);
        // Optimistic update
        setFavIds((prev) => (isCurrentlyFav ? prev.filter((x) => x !== id) : [...prev, id]));

        if (isAuthenticated && user) {
            try {
                if (isCurrentlyFav) {
                    await userService.removeFavorite(user.id, id);
                } else {
                    await userService.addFavorite(user.id, id);
                    await gamificationService.claimActionPoints('favorite', id);

                    const newBadge = await gamificationService.incrementFamilyProgress(user.id, 'fav');
                    if (newBadge) {
                        addNotification({
                            titulo: '¡Nueva Insignia!',
                            titulo_en: 'New Badge!',
                            descripcion: 'Has desbloqueado: ' + newBadge.nombre,
                            descripcion_en: 'You unlocked: ' + (newBadge.nombre_en || newBadge.nombre),
                            leida: false,
                            icono: Award as any,
                        });
                        setEarnedInsignias(prev => [...prev, newBadge.id]);
                    }
                }
            } catch (error) {
                console.error("Error toggling favorite", error);
                // Revert
                setFavIds((prev) => (isCurrentlyFav ? [...prev, id] : prev.filter((x) => x !== id)));
            }
        }
    };

    const addReview = async (siteId: string, text: string, rating: number, fotos: File[]) => {
        const photoUrls = (fotos || []).slice(0, 3).map(f => URL.createObjectURL(f));
        const r: Review = { id: `rev_${Date.now()}`, siteId, text: text?.slice(0, 600), rating, fotos: photoUrls, createdAt: new Date().toISOString() };
        setReviews((prev) => [r, ...prev]);

        if (isAuthenticated && user) {
            try {
                const savedReview = await reviewsService.addReview({ siteId, text, rating, fotos }, user.id);
                if (savedReview) await gamificationService.claimActionPoints('review', savedReview.id);
                const newBadge = await gamificationService.incrementFamilyProgress(user.id, 'review');
                if (newBadge) {
                    addNotification({
                        titulo: '¡Nueva Insignia!',
                        titulo_en: 'New Badge!',
                        descripcion: 'Has desbloqueado: ' + newBadge.nombre,
                        descripcion_en: 'You unlocked: ' + (newBadge.nombre_en || newBadge.nombre),
                        leida: false,
                        icono: Award as any
                    });
                    setEarnedInsignias(prev => [...prev, newBadge.id]);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    // Persisten en la BD además del estado local (las notificaciones locales tipo `n_...` no existen en la tabla).
    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
        if (!id.startsWith('n_')) notificationsService.markAsRead(id);
    };
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
        if (user) notificationsService.markAllAsRead(user.id);
    };

    const updateRouteProgress = (inProgress: string[], completed: string[]) => {
        setRoutesInProgress(inProgress);
        setRoutesCompleted(completed);
        if (isAuthenticated && user) void routesService.syncUserRouteProgress(user.id, inProgress, completed);
    };

    return (
        <UserDataContext.Provider value={{
            favIds,
            reviews,
            earnedInsignias,
            notifications,
            routesInProgress,
            routesCompleted,
            userProfile,
            setUserProfile,
            toggleFav,
            addReview,
            addNotification,
            markAsRead,
            markAllAsRead,
            updateRouteProgress
        }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
