import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Review, Notificacion, Insignia } from '../types';
import { userService } from '../services/user.service';
import { reviewsService } from '../services/reviews.service';
import { notificationsService } from '../services/notifications.service';
import { gamificationService } from '../services/gamification.service';
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

    // Actions
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

    // Local state for routes progress (synced with storage in the future or DB)
    const [routesInProgress, setRoutesInProgress] = useState<string[]>([]);
    const [routesCompleted, setRoutesCompleted] = useState<string[]>([]);

    useEffect(() => {
        if (isAuthenticated && user) {
            userService.getFavorites(user.id).then(setFavIds);
            reviewsService.getByUserId(user.id).then(setReviews);
            notificationsService.getUserNotifications(user.id).then(setNotifications);
            gamificationService.getUserBadgeIds(user.id).then(setEarnedInsignias);
            // Routes progress loading would go here if fetched from DB
        } else {
            setFavIds([]);
            setReviews([]);
            setEarnedInsignias([]);
            setNotifications([]);
        }
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
                    gamificationService.awardPoints(5, 'Favorito: ' + id);

                    // We can check badges here or inside a separate effect/service
                    // For now, mirroring App.tsx logic roughly
                    const badgeUnlocked = await gamificationService.unlockBadge(user.id, 'insignia-fav-1');
                    if (badgeUnlocked) {
                        addNotification({
                            titulo: '¡Nueva Insignia!',
                            titulo_en: 'New Badge!',
                            descripcion: 'Has desbloqueado: Primer Favorito',
                            descripcion_en: 'You unlocked: First Favorite',
                            leida: false,
                            icono: Award as any,
                        });
                        setEarnedInsignias(prev => [...prev, 'insignia-fav-1']);
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
                await reviewsService.addReview({ siteId, text, rating, fotos }, user.id);
                gamificationService.awardPoints(20, 'Reseña: ' + siteId);
                const badgeUnlocked = await gamificationService.unlockBadge(user.id, 'insignia-review-1');
                if (badgeUnlocked) {
                    addNotification({
                        titulo: '¡Nueva Insignia!',
                        titulo_en: 'New Badge!',
                        descripcion: 'Has desbloqueado: Crítico Local',
                        descripcion_en: 'You unlocked: Local Critic',
                        leida: false,
                        icono: Award as any
                    });
                    setEarnedInsignias(prev => [...prev, 'insignia-review-1']);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, leida: true })));

    const updateRouteProgress = (inProgress: string[], completed: string[]) => {
        setRoutesInProgress(inProgress);
        setRoutesCompleted(completed);
        // Here we could sync with DB if that feature existed in services
    };

    return (
        <UserDataContext.Provider value={{
            favIds,
            reviews,
            earnedInsignias,
            notifications,
            routesInProgress,
            routesCompleted,
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
