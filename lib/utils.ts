
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// FIX: Add 'extends object' constraint to generic type T to ensure 'item' can be used with the 'in' operator.
export function getTranslated<T extends object, K extends keyof T>(
  item: T | undefined | null,
  key: K,
  lang: 'es' | 'en'
): T[K] | string {
  if (!item) return '';
  const enKey = `${String(key)}_en` as keyof T;
  
  if (lang === 'en' && enKey in item) {
    const enVal = (item as any)[enKey];
    if (enVal !== null && enVal !== undefined && enVal !== '') {
      return enVal;
    }
  }
  
  const val = item[key];
  return (val === null || val === undefined) ? '' : (val as T[K]);
}

export function formatDuration(minutes: number, lang: 'es' | 'en'): string {
  if (!minutes || minutes < 0) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} h`;
  } else {
    return `${hours} h ${mins} min`;
  }
}

export const getMacroCategory = (category: string | undefined | null, lang: 'es' | 'en'): string => {
  if (!category) return lang === 'es' ? 'Sitios Históricos / Otros' : 'Historic / Other';
  const cat = category.toLowerCase();

  if (cat.includes('parque') || cat.includes('jardín') || cat.includes('natural') || cat.includes('botánico') || cat.includes('ecoparque') || cat.includes('mirador') || cat.includes('público')) 
      return lang === 'es' ? 'Parques y Naturaleza' : 'Parks & Nature';
  
  if (cat.includes('biblioteca') || cat.includes('librería') || cat.includes('libreria') || cat.includes('library') || cat.includes('bookstore'))
      return lang === 'es' ? 'Bibliotecas y Librerías' : 'Libraries & Bookstores';

  if (cat.includes('museo') || cat.includes('centro cultural') || cat.includes('archivo') || cat.includes('casa') || cat.includes('monumento')) 
      return lang === 'es' ? 'Museos y Cultura' : 'Museums & Culture';
  
  if (cat.includes('teatro') || cat.includes('arte') || cat.includes('muralismo') || cat.includes('escultura') || cat.includes('artesanías')) 
      return lang === 'es' ? 'Arte y Teatro' : 'Art & Theater';
  
  if (cat.includes('salsa') || cat.includes('baile') || cat.includes('danza') || cat.includes('música') || cat.includes('vivo') || cat.includes('discoteca') || cat.includes('bar')) 
      return lang === 'es' ? 'Salsa y Música' : 'Salsa & Music';
  
  if (cat.includes('gastronomía') || cat.includes('café') || cat.includes('restaurante') || cat.includes('zona')) 
      return lang === 'es' ? 'Gastronomía' : 'Gastronomy';
  
  if (cat.includes('estadio') || cat.includes('deporte') || cat.includes('recreación') || cat.includes('cancha')) 
      return lang === 'es' ? 'Deportes y Recreación' : 'Sports & Recreation';

  if (cat.includes('universidad') || cat.includes('educación') || cat.includes('escuela') || cat.includes('instituc') || cat.includes('gubernamental'))
      return lang === 'es' ? 'Institucional' : 'Institutional';

  return lang === 'es' ? 'Sitios Históricos / Otros' : 'Historic / Other';
};

export const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  
  if (cat.includes('parque') || cat.includes('naturaleza') || cat.includes('park') || cat.includes('nature')) return "🌳";
  if (cat.includes('museo') || cat.includes('cultura') || cat.includes('museum')) return "🏛️";
  if (cat.includes('biblioteca') || cat.includes('librería') || cat.includes('library')) return "📚";
  if (cat.includes('arte') || cat.includes('teatro') || cat.includes('art') || cat.includes('theater')) return "🎨";
  if (cat.includes('salsa') || cat.includes('música') || cat.includes('music')) return "💃";
  if (cat.includes('gastronomía') || cat.includes('gastronomy')) return "🍽️";
  if (cat.includes('deporte') || cat.includes('sport')) return "🏟️";
  if (cat.includes('institucional') || cat.includes('institutional')) return "🏫";
  if (cat.includes('histórico') || cat.includes('historic')) return "⛪";
  
  return "📍";
};

export const getCategoryColor = (category: string): string => {
  const cat = category.toLowerCase();

  if (cat.includes('parque') || cat.includes('naturaleza') || cat.includes('park') || cat.includes('nature')) return '#10B981'; // Emerald 500
  if (cat.includes('museo') || cat.includes('cultura') || cat.includes('museum')) return '#3B82F6'; // Blue 500
  if (cat.includes('biblioteca') || cat.includes('librería') || cat.includes('library')) return '#6366F1'; // Indigo 500
  if (cat.includes('arte') || cat.includes('teatro') || cat.includes('art') || cat.includes('theater')) return '#8B5CF6'; // Violet 500
  if (cat.includes('salsa') || cat.includes('música') || cat.includes('music')) return '#E11D48'; // Rose 600
  if (cat.includes('gastronomía') || cat.includes('gastronomy')) return '#F97316'; // Orange 500
  if (cat.includes('deporte') || cat.includes('sport')) return '#06B6D4'; // Cyan 500
  if (cat.includes('institucional') || cat.includes('institutional')) return '#64748B'; // Slate 500
  if (cat.includes('histórico') || cat.includes('historic')) return '#F59E0B'; // Amber 500

  return '#64748B'; // Slate 500 (Default)
};