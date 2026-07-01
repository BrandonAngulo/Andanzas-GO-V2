
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
  
  if (lang === 'en' && enKey in item && typeof (item as any)[enKey] !== 'undefined') {
    return (item as any)[enKey];
  }
  
  return item[key] as T[K];
}

export const getCategoryIcon = (category: string) => {
  const emojiMap: { [key: string]: string } = {
      "Museo": "🏛️", "Museum": "🏛️",
      "Teatro": "🎭", "Theater": "🎭",
      "Espacio público": "🌳", "Public Space": "🌳",
      "Espacio de Arte": "🎨", "Art Space": "🎨",
      "Monumento": "🗿", "Monument": "🗿",
      "Centro Cultural": "🏛️", "Cultural Center": "🏛️",
      "Centro Cultural Comunitario": "🏘️", "Community Cultural Center": "🏘️",
      "Música en Vivo": "🎵", "Live Music": "🎵",
      "Escultura": "🗿", "Sculpture": "🗿",
      "Gastronomía": "🍽️", "Gastronomy": "🍽️",
      "Biblioteca": "📚", "Library": "📚",
      "Artesanías": "🏺", "Crafts": "🏺",
      "Taller Artesanal": "🛠️", "Artisanal Workshop": "🛠️",
      "Muralismo": "🖌️", "Muralism": "🖌️",
      "Parque Natural": "🏞️", "Natural Park": "🏞️",
      "Parque Natural/Cultural": "🏞️", "Natural/Cultural Park": "🏞️",
      "Librería": "📖", "Bookstore": "📖",
      "Teatro Experimental": "🎭", "Experimental Theater": "🎭",
      "Teatro Comunitario": "🎭", "Community Theater": "🎭",
      "Parque Temático": "🎡", "Theme Park": "🎡",
      "Zona Gastronómica": "🍴", "Gastronomic Zone": "🍴",
      "Universidad": "🎓", "University": "🎓",
      "Estadio": "🏟️", "Stadium": "🏟️",
      "Iglesia": "⛪", "Church": "⛪",
      "Escuela de Salsa": "💃", "Salsa School": "💃",
      "Espectáculo de Salsa": "💃", "Salsa Show": "💃",
      "Danza": "🩰", "Dance": "🩰",
      "Casa Museo": "🏡", "House Museum": "🏡",
      "Jardín Botánico": "🌸", "Botanical Garden": "🌸",
      "Música": "🎶", "Music": "🎶",
      "Hacienda Histórica": "🏰", "Historic Estate": "🏰",
      "Museo de Arte": "🖼️", "Art Museum": "🖼️",
      "Museo de Ciencias": "🔬", "Science Museum": "🔬",
      "Café Cultural": "☕", "Cultural Café": "☕",
      "Archivo Cultural": "🎞️", "Cultural Archive": "🎞️",
      "Mirador": "🔭", "Viewpoint": "🔭",
  };
  return emojiMap[category] || "📍";
};

export const getCategoryColor = (category: string): string => {
  const cat = category.toLowerCase();

  if (cat.includes('parque') || cat.includes('jardín') || cat.includes('natural') || cat.includes('botánico') || cat.includes('ecoparque')) return '#10B981'; // Emerald 500
  if (cat.includes('museo') || cat.includes('biblioteca') || cat.includes('centro cultural') || cat.includes('archivo') || cat.includes('casa')) return '#3B82F6'; // Blue 500
  if (cat.includes('teatro') || cat.includes('arte') || cat.includes('cultura')) return '#8B5CF6'; // Violet 500
  if (cat.includes('salsa') || cat.includes('baile') || cat.includes('danza') || cat.includes('música') || cat.includes('vivo') || cat.includes('discoteca') || cat.includes('bar')) return '#E11D48'; // Rose 600
  if (cat.includes('iglesia') || cat.includes('estadio') || cat.includes('monumento') || cat.includes('plaza')) return '#F59E0B'; // Amber 500
  if (cat.includes('gastronomía') || cat.includes('café') || cat.includes('restaurante')) return '#F97316'; // Orange 500

  return '#64748B'; // Slate 500 (Default)
};