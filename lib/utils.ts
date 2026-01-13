
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