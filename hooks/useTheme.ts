import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';

export const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(storage.getTheme());

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

    return { theme, setTheme };
};
