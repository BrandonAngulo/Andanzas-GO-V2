import { Review, Ruta } from '../types';

const KEYS = {
  FAVORITES: 'andanzas_favs',
  REVIEWS: 'andanzas_reviews',
  ROUTES: 'andanzas_routes',
  INSIGNIAS: 'andanzas_insignias',
  USER: 'andanzas_user',
  ROUTES_PROGRESS: 'andanzas_routes_progress',
  ROUTES_COMPLETED: 'andanzas_routes_completed',
  THEME: 'andanzas_theme'
};

export const storage = {
  getFavorites: (): string[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.FAVORITES) || '["s1", "s9"]');
    } catch { return ["s1", "s9"]; }
  },
  setFavorites: (ids: string[]) => localStorage.setItem(KEYS.FAVORITES, JSON.stringify(ids)),

  getReviews: (): Review[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.REVIEWS) || '[]');
    } catch { return []; }
  },
  setReviews: (reviews: Review[]) => localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews)),

  getRoutes: (): Ruta[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.ROUTES) || '[]');
    } catch { return []; }
  },
  setRoutes: (routes: Ruta[]) => localStorage.setItem(KEYS.ROUTES, JSON.stringify(routes)),

  getInsignias: (): string[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.INSIGNIAS) || '[]');
    } catch { return []; }
  },
  setInsignias: (ids: string[]) => localStorage.setItem(KEYS.INSIGNIAS, JSON.stringify(ids)),

  getUser: (): { name: string; email: string } | null => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.USER) || 'null');
    } catch { return null; }
  },
  setUser: (user: { name: string; email: string } | null) => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  },

  getRoutesProgress: (): string[] => {
      try {
          return JSON.parse(localStorage.getItem(KEYS.ROUTES_PROGRESS) || '[]');
      } catch { return []; }
  },
  setRoutesProgress: (ids: string[]) => localStorage.setItem(KEYS.ROUTES_PROGRESS, JSON.stringify(ids)),

  getRoutesCompleted: (): string[] => {
      try {
          return JSON.parse(localStorage.getItem(KEYS.ROUTES_COMPLETED) || '[]');
      } catch { return []; }
  },
  setRoutesCompleted: (ids: string[]) => localStorage.setItem(KEYS.ROUTES_COMPLETED, JSON.stringify(ids)),

  getTheme: (): 'light' | 'dark' | 'system' => {
      try {
          return (localStorage.getItem(KEYS.THEME) as 'light' | 'dark' | 'system') || 'light';
      } catch { return 'light'; }
  },
  setTheme: (theme: 'light' | 'dark' | 'system') => localStorage.setItem(KEYS.THEME, theme),
};