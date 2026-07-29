# TRIVIA GO — Elegibilidad de preguntas por modo

**Fecha:** 29 de julio de 2026
**Objetivo:** decidir, de forma administrable y auditable, qué preguntas puede usar cada modo
de juego, sin duplicar preguntas ni meter listas JSON dentro de la pregunta
(bloque 3, secc. 7–8 del plan).

## Modelo: regla automática + override manual

- **Regla por defecto** (`fn_mode_default_eligible(question, mode)`): clasifica cada pregunta
  publicada según su tipo, nivel y explicación. **Las preguntas nuevas se clasifican solas** —
  no hay que taggear nada al sumar contenido.
- **Override manual** (tabla `game_mode_eligibility`, PK `(question_id, mode)`): excepción a la
  regla, con `note` y `updated_by/updated_at` para auditoría.
- **Efectiva** = override si existe, si no la regla (`fn_mode_eligible`, vista
  `v_question_mode_eligibility`).

## Reglas por defecto

| Modo | Elegible por defecto si… |
|---|---|
| `reto` | publicada (todo el banco) |
| `practica` | publicada (motor adaptativo) |
| `contrarreloj` | publicada y `question_type='multiple_choice'` (excluye ordenar/relacionar/selección múltiple/imagen: lectura lenta) |
| `duelo` | publicada, `multiple_choice`/`image_choice` y con explicación |
| `diaria` | publicada, `multiple_choice`, con explicación y `level ≤ 3` |
| `aventura` | nunca por defecto (solo por asignación a capítulo — frente aparte) |

Pools iniciales (TRIVIA GO, 1.151 publicadas): reto/práctica 1.151 · contrarreloj 968 ·
duelo 968 · diaria 761 · aventura 0.

## Dónde se aplica (motor)

- `compose_game_questions(..., p_mode)` — reto/leyenda usan `reto`; contrarreloj usa `contrarreloj`.
  `useGameEngine` mapea el modo runtime (`timed`→`contrarreloj`, `levels`/`legend`→`reto`).
- `create_duel` — pool `duelo`.
- `_ensure_daily_question` — pool `diaria`.

## Dónde se administra (admin)

- **Juegos → Analítica → "Pool elegible por modo"**: tamaños de pool por modo (se actualiza solo
  al crecer el banco) y cuántos overrides hay.
- **Editar pregunta → "Elegibilidad por modo"**: estado efectivo por modo (regla/override) y
  botones Sí / No / Regla para fijar o quitar el override. Visible en preguntas publicadas.

## Pendientes / al sumar preguntas

- Las nuevas preguntas entran a los pools automáticamente por la regla; revisar solo excepciones.
- Si se crea un modo nuevo: añadirlo al `check` de la tabla, a `fn_mode_default_eligible`, a la
  vista y a `GAME_MODES` (services/games.service.ts).
- `aventura` se activará cuando exista el sistema de capítulos (frente "Capítulos/niveles").
- Falta (si se desea): asignar cuotas por formato/dificultad dentro de cada pool, y flags de
  elegibilidad para "Pregunta del día" curada a mano (hoy la regla ya la acota a MC+explicación+L≤3).
