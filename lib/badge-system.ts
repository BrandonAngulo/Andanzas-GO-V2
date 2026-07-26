import type { Insignia } from '../types';

export type BadgeGroup = 'progress' | 'route' | 'knowledge' | 'special';

export interface BadgeVisual {
  group: BadgeGroup;
  groupLabel: string;
  primary: string;
  secondary: string;
  deep: string;
  glow: string;
  ruleLabel: string;
  connected: boolean;
}

export const FAMILY_TIER_THRESHOLDS: Record<string, number[]> = {
  fav: [1, 10, 25],
  review: [1, 5, 15],
  route_create: [1, 3, 7],
  route_complete: [1, 5, 10],
};

export const OFFICIAL_ILLUSTRATED_BADGE_IDS = new Set([
  'badge-afro',
  'badge-arch',
  'badge-art',
  'badge-calenologo',
  'badge-eco',
  'badge-food',
  'badge-history',
  'badge-lit',
  'badge-salsa',
  'badge-sport',
  'badge-theater',
  'insignia-fav-1',
  'insignia-fav-2',
  'insignia-fav-3',
  'insignia-review-1',
  'insignia-review-2',
  'insignia-review-3',
  'insignia-route-1',
  'insignia-route-2',
  'insignia-route-3',
  'insignia-route-complete',
  'insignia-route-complete-2',
  'insignia-route-complete-3',
]);

export function getBadgeIllustrationPath(insignia: Insignia): string | undefined {
  if (OFFICIAL_ILLUSTRATED_BADGE_IDS.has(insignia.id)) {
    return `/images/badges-v2/${insignia.id}.webp`;
  }

  return insignia.image_url || undefined;
}

const FAMILY_VISUALS: Record<string, Omit<BadgeVisual, 'ruleLabel' | 'connected'>> = {
  fav: {
    group: 'progress',
    groupLabel: 'Exploración personal',
    primary: '#FF8A3D',
    secondary: '#FFD166',
    deep: '#8E3B16',
    glow: '#FFF0D9',
  },
  review: {
    group: 'progress',
    groupLabel: 'Voz de la comunidad',
    primary: '#A855F7',
    secondary: '#F9A8D4',
    deep: '#581C87',
    glow: '#F5E8FF',
  },
  route_create: {
    group: 'progress',
    groupLabel: 'Cartografía propia',
    primary: '#2D7FF9',
    secondary: '#67E8F9',
    deep: '#173B7A',
    glow: '#E5F3FF',
  },
  route_complete: {
    group: 'progress',
    groupLabel: 'Andanzas completadas',
    primary: '#12A66A',
    secondary: '#8EE3BE',
    deep: '#07543D',
    glow: '#E1F8EE',
  },
};

const ROUTE_VISUALS: Record<string, Pick<BadgeVisual, 'primary' | 'secondary' | 'deep' | 'glow'>> = {
  'badge-salsa': { primary: '#FF7A1A', secondary: '#FFD34E', deep: '#712B12', glow: '#FFF0CE' },
  'badge-food': { primary: '#F59E0B', secondary: '#84CC16', deep: '#713F12', glow: '#FFF7D6' },
  'badge-art': { primary: '#E74694', secondary: '#22D3EE', deep: '#701A4B', glow: '#FFE3F3' },
  'badge-lit': { primary: '#334E8A', secondary: '#E8C07D', deep: '#172554', glow: '#EEF2FF' },
  'badge-afro': { primary: '#0F9F6E', secondary: '#F4C542', deep: '#064E3B', glow: '#E2F7EF' },
  'badge-arch': { primary: '#7C3AED', secondary: '#5EEAD4', deep: '#3B0764', glow: '#F0E8FF' },
  'badge-eco': { primary: '#0891B2', secondary: '#A3E635', deep: '#164E63', glow: '#E0FAF7' },
  'badge-theater': { primary: '#9333EA', secondary: '#FB923C', deep: '#4C1D95', glow: '#F7E8FF' },
  'badge-history': { primary: '#C47A18', secondary: '#FDE68A', deep: '#5F370E', glow: '#FFF5D8' },
  'badge-sport': { primary: '#2563EB', secondary: '#FB923C', deep: '#1E3A8A', glow: '#E8F0FF' },
};

const DEFAULT_VISUAL = {
  primary: '#12A66A',
  secondary: '#FFB020',
  deep: '#064E3B',
  glow: '#E4F8EF',
};

export function getBadgeVisual(insignia: Insignia): BadgeVisual {
  if (insignia.family_key && FAMILY_VISUALS[insignia.family_key]) {
    const base = FAMILY_VISUALS[insignia.family_key];
    const threshold = insignia.tier ? getBadgeThreshold(insignia) : undefined;
    return {
      ...base,
      ruleLabel: threshold
        ? `${threshold} ${familyUnit(insignia.family_key, threshold)}`
        : 'Progreso automático',
      connected: Boolean(threshold),
    };
  }

  if (ROUTE_VISUALS[insignia.id]) {
    return {
      group: 'route',
      groupLabel: 'Recuerdo de ruta',
      ...ROUTE_VISUALS[insignia.id],
      ruleLabel: 'Completar la ruta cultural asociada',
      connected: true,
    };
  }

  if (insignia.id === 'badge-calenologo') {
    return {
      group: 'knowledge',
      groupLabel: 'Cultura y lenguaje',
      primary: '#00A878',
      secondary: '#FFD447',
      deep: '#07543D',
      glow: '#E6FAF2',
      ruleLabel: 'Descubrir la Palabra del día durante 7 días',
      connected: true,
    };
  }

  return {
    group: 'special',
    groupLabel: 'Logro especial',
    ...DEFAULT_VISUAL,
    ruleLabel: 'Regla de desbloqueo pendiente',
    connected: false,
  };
}

export function isRouteBadge(insignia: Insignia): boolean {
  return Boolean(ROUTE_VISUALS[insignia.id]);
}

export function getBadgeThreshold(insignia: Insignia): number | undefined {
  if (!insignia.family_key || !insignia.tier) return undefined;
  return FAMILY_TIER_THRESHOLDS[insignia.family_key]?.[insignia.tier - 1];
}

export function getBadgeTierLabel(tier?: number): string | null {
  if (tier === 1) return 'Inicio';
  if (tier === 2) return 'Trayectoria';
  if (tier === 3) return 'Maestría';
  return null;
}

export function sortBadges(left: Insignia, right: Insignia): number {
  const groupOrder: Record<BadgeGroup, number> = { progress: 0, route: 1, knowledge: 2, special: 3 };
  const leftVisual = getBadgeVisual(left);
  const rightVisual = getBadgeVisual(right);
  return groupOrder[leftVisual.group] - groupOrder[rightVisual.group]
    || (left.family_key || '').localeCompare(right.family_key || '')
    || (left.tier || 99) - (right.tier || 99)
    || left.nombre.localeCompare(right.nombre);
}

function familyUnit(familyKey: string, value: number): string {
  const singular = value === 1;
  if (familyKey === 'fav') return singular ? 'lugar guardado' : 'lugares guardados';
  if (familyKey === 'review') return singular ? 'reseña publicada' : 'reseñas publicadas';
  if (familyKey === 'route_create') return singular ? 'ruta creada' : 'rutas creadas';
  if (familyKey === 'route_complete') return singular ? 'ruta completada' : 'rutas completadas';
  return singular ? 'acción' : 'acciones';
}
