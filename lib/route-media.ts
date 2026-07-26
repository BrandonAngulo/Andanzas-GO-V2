import { Ruta, Site } from '../types';

interface RouteVisual {
  image: string;
  overlay: string;
  accent: string;
}

const ROUTE_VISUALS: Array<{ keywords: string[]; visual: RouteVisual }> = [
  {
    keywords: ['histor', 'colonial'],
    visual: {
      image: '/images/rutas/ruta_historica.png',
      overlay: 'from-amber-950/5 via-orange-950/20 to-[#3b1f10]/95',
      accent: 'text-amber-200',
    },
  },
  {
    keywords: ['pincel', 'mural', 'arte', 'calle'],
    visual: {
      image: '/images/rutas/pinceles_calle.png',
      overlay: 'from-fuchsia-950/5 via-violet-950/20 to-[#29104d]/95',
      accent: 'text-fuchsia-200',
    },
  },
  {
    keywords: ['clave', 'barrio', 'salsa', 'musica'],
    visual: {
      image: '/images/rutas/salsa_obrero.png',
      overlay: 'from-rose-950/5 via-red-950/20 to-[#3b1015]/95',
      accent: 'text-rose-200',
    },
  },
  {
    keywords: ['naturaleza', 'verde', 'ecolog'],
    visual: {
      image: '/routes/ruta_naturaleza.jpg',
      overlay: 'from-emerald-950/5 via-green-950/20 to-[#0b3927]/95',
      accent: 'text-emerald-200',
    },
  },
  {
    keywords: ['papel', 'liter', 'libro', 'letra'],
    visual: {
      image: '/routes/ruta_literatura.jpg',
      overlay: 'from-sky-950/5 via-blue-950/20 to-[#102a43]/95',
      accent: 'text-sky-200',
    },
  },
  {
    keywords: ['fogon', 'gastronom', 'cocina', 'sabor'],
    visual: {
      image: '/images/fogones_memoria.png',
      overlay: 'from-orange-950/5 via-amber-950/25 to-[#3a2109]/95',
      accent: 'text-orange-200',
    },
  },
];

const DEFAULT_ROUTE_VISUAL: RouteVisual = {
  image: '/routes/ruta_historica.jpg',
  overlay: 'from-emerald-950/5 via-teal-950/20 to-[#042e2b]/95',
  accent: 'text-emerald-200',
};

const SITE_IMAGES: Record<string, string> = {
  s39: '/images/imperdibles/banner_ruta_colonial.png',
  s12: '/images/imperdibles/banner_ruta_colonial.png',
  s57: '/images/imperdibles/banner_ruta_colonial.png',
  s2: '/images/imperdibles/banner_ruta_colonial.png',
  s3: '/images/banners/banner_bulevar_rio.png',
  s19: '/images/capilla_san_antonio.png',
  // La ruta de naturaleza conserva imágenes locales aun si una URL editorial expira.
  s20: '/routes/ruta_naturaleza.jpg',
  s30: '/routes/ruta_naturaleza.jpg',
  s65: '/images/banners/banner_tres_cruces.png',
  s5: '/images/imperdibles/banner_ruta_colonial.png',
};

export function normalizeMediaName(name = '') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function getRouteVisual(route: Pick<Ruta, 'nombre'>): RouteVisual {
  const normalizedName = normalizeMediaName(route.nombre);
  return ROUTE_VISUALS.find(({ keywords }) =>
    keywords.some(keyword => normalizedName.includes(keyword)),
  )?.visual || DEFAULT_ROUTE_VISUAL;
}

function findCuratedRouteVisual(route: Pick<Ruta, 'nombre'>) {
  const normalizedName = normalizeMediaName(route.nombre);
  return ROUTE_VISUALS.find(({ keywords }) =>
    keywords.some(keyword => normalizedName.includes(keyword)),
  )?.visual;
}

/**
 * Approved local artwork is intentionally preferred over remote editorial URLs.
 * This keeps route identity stable even when a storage object is moved or removed.
 */
export function getRouteImage(route: Pick<Ruta, 'nombre' | 'image_url' | 'coverUrl'>) {
  return findCuratedRouteVisual(route)?.image
    || route.image_url
    || route.coverUrl
    || DEFAULT_ROUTE_VISUAL.image;
}

export function getSiteImage(site: Site | undefined, route?: Pick<Ruta, 'nombre' | 'image_url' | 'coverUrl'>) {
  if (!site) return route ? getRouteImage(route) : DEFAULT_ROUTE_VISUAL.image;
  return SITE_IMAGES[site.id]
    || site.fotos?.find(Boolean)
    || site.logoUrl
    || (route ? getRouteImage(route) : DEFAULT_ROUTE_VISUAL.image);
}
