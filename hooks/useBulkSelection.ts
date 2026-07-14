import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Manejo genérico de selección múltiple para vistas de gestión.
 * Recibe la lista visible (ya filtrada) y descarta automáticamente ids
 * que dejan de estar presentes (p. ej. tras eliminar o filtrar).
 */
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visibleIds = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    setSelected((prev) => {
      if (prev.size === 0) return prev;
      const valid = new Set(visibleIds);
      let changed = false;
      const next = new Set<string>();
      prev.forEach((id) => { if (valid.has(id)) next.add(id); else changed = true; });
      return changed ? next : prev;
    });
  }, [visibleIds]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      const everySelected = items.length > 0 && items.every((item) => prev.has(item.id));
      return everySelected ? new Set() : new Set(visibleIds);
    });
  }, [items, visibleIds]);

  return {
    selectedIds: useMemo(() => Array.from(selected), [selected]),
    count: selected.size,
    isSelected: useCallback((id: string) => selected.has(id), [selected]),
    toggle,
    toggleAll,
    clear,
    allSelected,
    hasSelection: selected.size > 0,
  };
}
