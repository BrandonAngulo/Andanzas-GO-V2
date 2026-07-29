# TRIVIA GO — Contrato funcional de Aventura (capítulos, niveles, progreso)

**Fecha:** 29 de julio de 2026
**Estado:** ESPECIFICACIÓN para revisión. No aplicar migraciones hasta aprobar.
**Base:** decisiones aprobadas en `trivia-go-v3-fase0-bloque2` (piloto Sabores de Cali) y
`bloque3` (secc. 10). Reutiliza la [elegibilidad por modo](trivia-mode-eligibility.md) (`aventura`).

## 1. Conceptos y reglas fijas (ya aprobadas)

- Un **capítulo** (ej. "Sabores de Cali") tiene **10 niveles narrativos**.
- Cada **nivel** muestra **5 preguntas** en un recorrido.
- Meta editorial: **150 preguntas aprobadas por capítulo** (~15 por nivel para antirrepetición).
- **NO** se usa `game_questions.level` para el nivel narrativo: hay una **relación de asignación**
  propia (una pregunta conserva su dificultad técnica y se asigna a un nivel por tema/orden).
- **Desbloqueo del personaje** (ej. Pandebono): `10 niveles completados AND ≥30 correctas ÚNICAS
  en el capítulo`. Se evalúa y registra **una sola vez** en el servidor; queda permanente aunque
  después cambie el banco. Correctas se cuentan **por pregunta única** (no por repetir).
- **Publicación versionada**: el capítulo tiene versión; el progreso guarda la versión; el
  desbloqueo ya logrado no se pierde al republicar.

## 2. Modelo de datos propuesto

```text
game_chapters            1 ─┬─* game_chapter_levels      1 ─┬─* game_chapter_level_questions ─*─1 game_questions
(capítulo)                  │  (nivel narrativo 1..10)      │  (asignación pregunta→nivel, con orden)
                            │
usuario ─*─ user_chapter_progress (por capítulo: correctas únicas, niveles completados, desbloqueo)
usuario ─*─ user_chapter_level_progress (por nivel: completado, mejor puntaje)
usuario ─*─ user_chapter_correct (pregunta única acertada en el capítulo → para el umbral de 30)
```

### game_chapters
`id, game_id, slug (único), title, subtitle, description, cover_image_url, image_position,`
`character_name, character_image_url, reward_badge_id (fk badges, opcional),`
`levels_count int=10, questions_per_level int=5, unlock_min_levels int=10, unlock_min_correct int=30,`
`status ('draft'|'published'|'archived'), version int=1, order_index int, created_at, updated_at.`

### game_chapter_levels
`id, chapter_id, level_number (1..N), title, narrative (intro del nivel), purpose,`
`questions_per_run int (default hereda del capítulo). unique(chapter_id, level_number).`

### game_chapter_level_questions  (la asignación administrable)
`chapter_level_id, question_id, order_index. pk(chapter_level_id, question_id).`
Sirve además para la elegibilidad `aventura`: una pregunta es elegible para Aventura si está
asignada a un nivel de un capítulo **publicado**.

### user_chapter_progress
`user_id, chapter_id, levels_completed int, unique_correct int, unlocked bool, unlocked_at,`
`version int, updated_at. pk(user_id, chapter_id).`

### user_chapter_level_progress
`user_id, chapter_level_id, completed bool, best_score int, runs int, completed_at.`
`pk(user_id, chapter_level_id).`

### user_chapter_correct
`user_id, chapter_id, question_id. pk(user_id, chapter_id, question_id).`
Se inserta (idempotente) cuando el usuario acierta una pregunta del capítulo; `count(*)` = correctas únicas.

## 3. Lógica de servidor (RPC)

- `get_chapter_map(p_chapter_id)` → capítulo + niveles + estado por nivel del usuario
  (bloqueado / disponible / completado), correctas únicas y estado de desbloqueo.
  Regla de acceso: nivel N disponible si N=1 o nivel N-1 completado (secuencial).
- `start_chapter_level(p_chapter_level_id)` → devuelve las 5 preguntas del nivel
  (pool asignado, no vistas primero, antirrepetición; reusa criterios del compositor).
- `submit_chapter_level(p_chapter_level_id, p_answers jsonb)` → califica, marca el nivel
  completado, inserta correctas únicas, recalcula `user_chapter_progress` y **evalúa el
  desbloqueo una sola vez**. Devuelve puntaje, correctas y si desbloqueó al personaje.

## 4. Superficies de UI

**Jugador:**
- Entrada "Aventura" en el selector de modos (JuegosPanel).
- **Mapa del capítulo**: camino de 10 niveles con estados (bloqueado/disponible/completado),
  contador de correctas únicas y meta del personaje.
- **Intro de nivel** (narrativa) → jugar (reusa el motor/`GameSessionModal` con el set asignado).
- **Celebración de desbloqueo** del personaje al cumplir la regla.

**Admin:**
- CRUD de capítulos (portada, personaje, umbrales, estado/versión).
- Editor de los 10 niveles (título, narrativa, propósito).
- **Asignador de preguntas** a cada nivel (buscar en el banco por categoría/nivel/formato y
  asignar con orden). Muestra cobertura por nivel (cuántas asignadas vs meta ~15).

## 5. Enganche con elegibilidad por modo

`fn_mode_default_eligible(q, 'aventura')` pasará a `true` si la pregunta está asignada a un nivel
de un capítulo publicado (hoy es `false` fijo). Así el pool `aventura` deja de ser 0 en cuanto se
publique un capítulo, sin duplicar preguntas.

## 6. Plan de construcción por incrementos

1. **Fundación de datos** (este contrato): tablas + índices + RLS + hook de elegibilidad. Inerte.
2. **RPCs de servidor**: get_chapter_map, start/submit_chapter_level, desbloqueo.
3. **Admin**: CRUD capítulos/niveles + asignador de preguntas.
4. **Jugador**: entrada + mapa + intro + juego + celebración.
5. **Contenido**: clasificar las 51 candidatas de Sabores de Cali en los 10 niveles y crear las
   ~92–99 nuevas para llegar a 150 (frente editorial, separado).

## 7. Decisiones confirmadas (2026-07-29)

- **Acceso a niveles:** secuencial — el nivel N requiere completar N-1 (nivel 1 abierto).
- **Repetición para práctica:** sí; un nivel completado se puede repetir con antirrepetición
  (preguntas no vistas primero) para sumar correctas únicas hacia el umbral.
- **Recompensa:** **personaje como entidad propia** (tabla `characters` + `user_characters`),
  no badge. `game_chapters.reward_character_id`. ANDI = principal; Pandebono de Cali = secundario
  (recompensa del piloto).

## 8. Estado de implementación

- ✅ **Incremento 1 (fundación):** 8 tablas + RLS + índices + hook de elegibilidad `aventura`
  (`fn_mode_default_eligible` ahora `stable`, true si la pregunta está asignada a un capítulo
  publicado). Migración `20260729_aventura_foundation.sql`.
- ✅ **Incremento 2 (RPC):** `get_chapter_map`, `start_chapter_level`, `submit_chapter_level`
  (calificación en servidor, correctas únicas idempotentes, desbloqueo una sola vez). Migración
  `20260729_aventura_rpcs.sql`. Verificado end-to-end con el usuario de prueba.
- ✅ **Scaffolding del piloto sembrado:** personajes ANDI + Pandebono; capítulo "Sabores de Cali"
  (**draft**) con los 10 niveles; 5 preguntas de Gastronomía asignadas al nivel 1 como semilla.
- ⏳ **Incremento 3 (admin):** CRUD de capítulos/niveles + asignador de preguntas. Pendiente.
- ⏳ **Incremento 4 (jugador):** entrada Aventura + mapa + intro + juego + celebración. Pendiente.
- ⏳ **Contenido:** clasificar las 51 candidatas en los 10 niveles y crear ~92–99 nuevas (→150).
