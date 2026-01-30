import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Site, Evento, Ruta, FeedItem, Insignia } from '../types';
import { sitesService } from '../services/sites.service';
import { eventsService } from '../services/events.service';
import { routesService } from '../services/routes.service';
import { gamificationService } from '../services/gamification.service';
import { newsService } from '../services/news.service';

interface AppDataContextType {
    sites: Site[];
    eventos: Evento[];
    rutasTematicas: Ruta[];
    allInsignias: Insignia[];
    feed: FeedItem[];
    isLoading: boolean;
    refreshData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sites, setSites] = useState<Site[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [rutasTematicas, setRutasTematicas] = useState<Ruta[]>([]);
    const [allInsignias, setAllInsignias] = useState<Insignia[]>([]);
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            console.log("AppData: Requesting events...");
            const e = await eventsService.getAll();
            console.log("AppData: Events received:", e.length);
            setEventos(e);
        } catch (evError) {
            console.error("AppData: Failed to load events safely", evError);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        loadStaticData();
    }, []);

    return (
        <AppDataContext.Provider value={{
            sites,
            eventos,
            rutasTematicas,
            allInsignias,
            feed,
            isLoading,
            refreshData: loadStaticData
        }}>
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};
