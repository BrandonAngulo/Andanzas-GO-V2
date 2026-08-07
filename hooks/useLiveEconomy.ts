import { useCallback, useEffect, useRef, useState } from 'react';
import { gamificationService, type EconomySummary } from '../services/gamification.service';
import { USER_PROGRESS_UPDATED_EVENT } from '../lib/user-progress';

/** Mantiene el saldo visible sincronizado cuando otra superficie entrega una recompensa. */
export const useLiveEconomy = () => {
    const [economy, setEconomy] = useState<EconomySummary | null>(null);
    const [loadingEconomy, setLoadingEconomy] = useState(true);
    const mounted = useRef(true);

    const refreshEconomy = useCallback(async () => {
        const next = await gamificationService.getEconomySummary();
        if (mounted.current) {
            setEconomy(next);
            setLoadingEconomy(false);
        }
        return next;
    }, []);

    useEffect(() => {
        mounted.current = true;
        void refreshEconomy();
        const refresh = () => { void refreshEconomy(); };
        window.addEventListener(USER_PROGRESS_UPDATED_EVENT, refresh);
        return () => {
            mounted.current = false;
            window.removeEventListener(USER_PROGRESS_UPDATED_EVENT, refresh);
        };
    }, [refreshEconomy]);

    return { economy, loadingEconomy, refreshEconomy };
};

