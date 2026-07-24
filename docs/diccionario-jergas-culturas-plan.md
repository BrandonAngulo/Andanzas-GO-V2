# Plan de diseño — Diccionario de jergas y culturas

> Estado: **propuesta / solo diseño**. No implementado. No modifica BD ni código.
> Fecha: 2026-07-23. Alcance elegido: *diseñar el plan*. Concepto elegido: *reencuadrar
> el "Diccionario de la caleñidad" como "Diccionario de jergas y culturas"*, con
> **Caleñidad como primer capítulo**.

---

## 1. Punto de partida (estado real verificado en V3 `jacspnfiscrhxvorovri`)

- `dictionary_entries`: **96 entradas**, todas con `geographic_scope` iniciando en
  `["Cali", "Valle del Cauca", …]`. Lo geográfico vive como **array de texto libre**,
  sin jerarquía ni entidad propia.
- `dictionary_tags`: **40 categorías** temáticas (habla-cotidiana, acciones, conflicto,
  memoria, gastronomía…), 264 asignaciones vía `dictionary_entry_tags`.
- `dictionary_sources`: **1 sola fila** → `calenidad.wordpress.com`. Las 96 entradas
  cuelgan de esa única fuente comunitaria vía `dictionary_entry_sources` (96 filas).
- RPC públicas (SQL puro, fáciles de extender):
  - `search_dictionary_cards(p_query, p_letter, p_tag, p_temporal_status, p_limit, p_offset)`
  - `get_dictionary_facets()` → letters, tags, temporal_statuses, featured_count, total_entries
- Frontend: `DictionaryPanel.tsx` (búsqueda + filtros letra/categoría/vigencia + palabra
  del día), `DictionaryDetail.tsx` (ficha), `dictionary.service.ts`, CRUD admin, auto-enlace
  en trivias. Flag de función: `app_features.dictionary_caleno`.

**Dos hechos que motivan el cambio:**
1. El diccionario es 100 % Cali; no hay dimensión de país/ciudad estructurada.
2. Dependencia de una única fuente.

---

## 2. Modelo de datos propuesto (jerarquía geográfica real)

Nueva tabla autorreferenciada que representa **capítulo (país) → agrupador (departamento/
estado) → apartado (ciudad/municipio)**:

```sql
-- Jerarquía: country > region > city  (parent_id autorreferenciado)
create table public.dictionary_regions (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.dictionary_regions(id) on delete cascade,
  level       text not null check (level in ('country','region','city')),
  name        text not null,               -- "Colombia", "Valle del Cauca", "Cali"
  slug        text not null unique,        -- "colombia", "valle-del-cauca", "cali"
  emoji_flag  text,                        -- 🇨🇴 (para capítulos país)
  cover_url   text,                        -- imagen de portada del capítulo/apartado
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Relación entrada ↔ región (una palabra puede vivir en Cali Y marcarse compartida)
create table public.dictionary_entry_regions (
  entry_id   uuid references public.dictionary_entries(id) on delete cascade,
  region_id  uuid references public.dictionary_regions(id) on delete cascade,
  is_primary boolean default false,        -- la región "de origen" de la palabra
  scope_note text,                         -- "uso compartido con suroccidente", etc.
  primary key (entry_id, region_id)
);
```

**Por qué relación N–N y no una columna FK simple:** una jerga muchas veces se comparte
entre ciudades/países (ej. "chévere"). `is_primary` marca el origen para el capítulo, y
las demás filas permiten que aparezca también en otros apartados sin duplicar la entrada.

**`geographic_scope` (array de texto) se conserva** como campo descriptivo/legible en la
ficha, pero deja de ser el mecanismo de filtrado. La migración lo usa como semilla.

### Migración de datos (las 96 actuales)
1. Insertar `Colombia` (country) → `Valle del Cauca` (region) → `Cali` (city).
2. Para cada entrada, crear `dictionary_entry_regions(entry_id, region=Cali, is_primary=true)`.
3. Derivar filas secundarias desde el `geographic_scope` existente cuando mencione
   "Colombia (uso compartido)", "suroccidente", etc. → `scope_note`.

---

## 3. Cambios en las RPC

Extender ambas de forma **retrocompatible** (parámetros nuevos opcionales al final):

- `search_dictionary_cards(..., p_region_slug text default null)`
  - Añadir join opcional a `dictionary_entry_regions`/`dictionary_regions` y filtro:
    devuelve entradas cuya región **o cualquier ancestro** coincide con `p_region_slug`
    (recursive CTE sobre `parent_id`, para que filtrar por "Colombia" traiga todo el país).
  - Añadir a la salida `regions jsonb` (como ya hace con `tags`).
- `get_dictionary_facets(p_region_slug default null)`
  - Nueva faceta `regions`: árbol país→ciudad con conteos, para pintar el selector de capítulos.
  - Las facetas de letra/categoría/vigencia se recalculan dentro del capítulo activo.

Ninguna firma actual se rompe (los llamados existentes siguen pasando los mismos args).

---

## 4. Cambios de UI

- **Renombrar** el panel: "Diccionario de jergas y culturas" (título/subtítulo en
  `DictionaryPanel.tsx` e i18n `es.ts`/`en.ts`). `feature_key` `dictionary_caleno` se
  mantiene interno (no romper el flag); solo cambia el texto visible.
- **Selector de capítulo** arriba de los filtros actuales: chips/tabs de país con bandera
  (🇨🇴 Colombia…) y, al entrar, sub-apartados de ciudad/departamento. Cali queda preseleccionado
  por ser el capítulo con contenido.
- La ficha `DictionaryDetail.tsx`: el encabezado "Diccionario de la caleñidad" pasa a mostrar
  el **capítulo/región** de la entrada (breadcrumb *Colombia › Valle del Cauca › Cali*).
- Admin: en `DictionaryEntryEditor.tsx`, selector de región(es) con `is_primary`.

---

## 5. Enriquecer el capítulo Caleñidad (reducir dependencia de 1 fuente)

Independiente de la reestructura, se puede alimentar en paralelo:
- Añadir fuentes adicionales a `dictionary_sources` (academias, prensa local, glosarios
  de salsa/feria, registros orales) y enlazarlas a entradas nuevas o existentes.
- El modelo ya soporta N fuentes por entrada (`dictionary_entry_sources`); solo falta
  poblarlo. Objetivo: que ninguna acepción dependa de una única cita.

---

## 6. Orden de implementación sugerido (cuando se apruebe)

1. Migración: tablas `dictionary_regions` + `dictionary_entry_regions` + seed Colombia/Valle/Cali
   + backfill de las 96 entradas (transacción, reversible).
2. Extender las 2 RPC (retrocompatible) + regenerar tipos TS.
3. `dictionary.service.ts`: soportar `regionSlug` y exponer `regions` en la entrada.
4. UI panel: selector de capítulos + breadcrumb en la ficha.
5. Admin: selector de regiones en el editor.
6. Renombrado visible + i18n.
7. (Paralelo) Enriquecer Caleñidad con nuevas fuentes.

**Riesgos / cuidados:** coordinar push con la sesión Codex (rebase antes de pushear);
mantener `feature_key` intacto; migración en transacción; RLS de las tablas nuevas
espejando las políticas de `dictionary_entries` (lectura pública de publicadas).
