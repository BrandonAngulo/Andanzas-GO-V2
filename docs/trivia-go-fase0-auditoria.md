# TRIVIA GO — Fase 0: Verificación y línea base

> Entregable de la Fase 0 del *Manual de desarrollo, evolución y seguimiento* de TRIVIA GO: mapa de sistemas, línea base, riesgos y backlog priorizado, más la taxonomía de eventos. Auditoría hecha por **lectura directa del código real** (no resúmenes). Fecha de corte: julio 2026.

## Alcance y método

Se auditó el recurso **TRIVIA GO** dentro de la app **Andanzas GO** (repo `Andanzas-GO-V2`, Vite + React + TS, Supabase `jacspnfiscrhxvorovri`). Archivos núcleo revisados directamente: `hooks/useGameEngine.ts`, `services/challenge.service.ts`, `services/analytics.service.ts`, `services/games.service.ts`, `types.ts`, migraciones `supabase/migrations/20260716_*`, y el inventario previo `docs/global-technical-inventory.md`.

Puerta de decisión de la fase (según manual): *estado actual reproducible y métricas básicas disponibles*. Estado: **estado reproducible ✔ / métricas básicas ✗** (ver §Línea base y §Backlog P0).

---

## 1. Mapa de sistemas (cómo funciona hoy, de verdad)

### 1.1 Cliente y navegación
- App de panel único (`App.tsx`, `ActivePanelType`); el juego vive en el panel `juegos`. Comparte con la app: `AuthContext`, perfil, economía, contenido, insignias.
- El juego se abre en `components/views/GameSessionModal.tsx` vía evento `open-game`; modos `levels | legend | timed`.

### 1.2 Motor de partida (`hooks/useGameEngine.ts`)
- **Composición de preguntas** (`initGame`): RPC `compose_game_questions` (adaptativa: dominio por concepto, dificultad empírica, exposición reciente) con *fallback* a consulta directa `game_questions` publicadas. Antirrepetición **por usuario** (últimas 30 sesiones). Piso de dificultad según `profiles.level` (máx. 3). Ramp de dificultad para `legend` (`buildRampQueue`); `level_distribution` o `questions_per_match` para el resto.
- **Verificación de respuesta** (`checkAnswerCorrectness`): soporta `multiple_choice | multi_select | ordering | matching | image_choice`. `type='quiz'` marca todo como correcto (encuesta).
- **Puntuación** (`submitAnswer`): `points_reward` base + (racha ≥3 → bono `min(streak*10, 50)`) **o** multiplicador (`mechanic_type='multiplier'`, hasta 5×) + bono de tiempo (20) si `bonus_time_enabled`. Contrarreloj: puntuación por tramos (1–10 solo base; 11–14 base+racha; 15 = ×2).
- **Mecánicas de fin**: `legend`→vidas (`consume_game_life`), `timed`→muerte súbita, `safe_zones`→corte por zona segura al abortar. `finishedRef` evita doble finalización.
- **Persistencia**: `game_sessions` (insert al iniciar; update `completed` al cerrar) y `game_answers` (por respuesta, con snapshot ligero). Recompensa vía RPC `award_game_rewards` (servidor, idempotente). Progreso por categoría desde `user_category_progress`.

### 1.3 Economía (esquema `economy`, migraciones 20260716)
- Wallet `user_wallets`: `app_points`, `coins`, `gems` + contadores lifetime; `lives`/`max_lives`/`next_life_at`.
- Ledger `economy_transactions` (idempotente, RLS) vía `economy.apply_rewards`. RPCs: `award_game_rewards`, `refresh_lives` (1 vida/4h), `roll_gem_reward` (pity), `consume_game_life`, `purchase_game_item`, `get_my_economy_summary`. Helpers internos restringidos a `service_role`.
- Cliente: `services/gamification.service.ts`, UI en `PerfilPanel.tsx`. Tienda `game_shop_offers` = **solo vidas** (`item_type='life'`).

### 1.4 Duelo asíncrono (`services/challenge.service.ts` + `game_challenges`)
- Solo guarda dos `session_id` y un `winner_id`. **La autoridad está en el cliente**: `completeChallenge(challengeId, challengedSessionId, winnerId)` — el ganador se calcula en el cliente y se escribe directo.
- El retado **repite en modo `levels`** independientemente del modo del retador; las preguntas son adaptativas/antirrepetición **por usuario**; los tiempos salen del **reloj local** (`state.totalTimeMs`).

### 1.5 Contenido / banco
- `game_questions` (tipos, `options`/`correct_answer` en JSONB, `level`, `category`, `campaign`, `status`). Flujo editorial: `question_editorial_checks`, `question_reports`. Motor adaptativo: `user_category_progress`, `user_topic_mastery`, `question_performance_metrics`.

### 1.6 Ciudad
- Parametrizada por columna `city` en casi todo + `ciudades_visitadas[]` + 63 ciudades en `lib/locations.ts`; pero **runtime/seed/mapa hardcodeados a Cali** (`profiles.city DEFAULT 'Cali'`, trigger de signup, `DEFAULT_CENTER` del mapa).

### 1.7 Analítica (estado real)
- `services/analytics.service.ts` expone `getOrCreateSessionId`, `endSession`, `trackEvent(eventName, entityType?, entityId?, metadata?)` → inserta en `analytics_events`. Tablas `analytics_events` y `user_sessions` existen.
- **Hallazgo crítico:** según `global-technical-inventory.md` el servicio está **"sin consumidores"**; la instrumentación activa se limita a apertura de sesión y vistas de panel. **El motor de juego NO emite ningún evento** (`game_started`, `question_answered`, `game_completed`, etc. no existen). El primitivo está, la taxonomía no.
- `components/panels/admin/JuegosAnalyticsPanel.tsx` existe (lee agregados de sesiones, no una taxonomía de eventos).
- **No hay consola de economía** (observabilidad/gobierno) como la que exige el manual §5.3.

---

## 2. Línea base (qué se puede medir hoy)

**Datos existentes** (inventario, corte 16-jul-2026): 1.126 preguntas · 818 verificaciones editoriales · 1.126 enlaces temáticos · 686 asignaciones pregunta↔juego · **20 sesiones de juego · 76 respuestas**. 60 tablas (public+economy, todas RLS), 24 funciones, 9 triggers, 29 migraciones, 154 archivos TS/TSX.

**Conclusión de línea base:** hay un banco de contenido considerable pero **prácticamente cero señal de comportamiento** (20 sesiones). No existen D1/D7/D30, embudos de modo, exactitud por dificultad, uso de ayudas, ni métricas de retorno. **No se puede evaluar con datos ninguna hipótesis de producto todavía.** Esto convierte la instrumentación en el pre-requisito de todo lo demás.

---

## 3. Riesgos (mapeados al registro del manual §10.4)

| # | Riesgo | Severidad | Evidencia |
|---|---|---|---|
| R1 | **Duelo sin fuente de verdad** (ganador y tiempos en cliente; ruleset y set no congelados) | Crítica | `challenge.service.ts:57-85`; contador asimétrico por modo (`levels` vs `timed`) |
| R2 | **Sin analítica de juego** → imposible medir retorno, conocimiento o economía | Crítica (bloqueante) | `analytics.service.ts` sin consumidores; motor sin `trackEvent` |
| R3 | **Sin consola/observabilidad de economía** | Alta | No existe; ledger sí existe pero no es observable/operable |
| R4 | **Credenciales**: `.env` estuvo versionado; rotación pendiente | Alta (seguridad) | inventario §Prioridad crítica |
| R5 | **Doble linaje de esquema** (SQL raíz vs `supabase/migrations`) con referencias obsoletas | Media | inventario §Errores; `ruta_registrations`/`rutas`/`news` inexistentes |
| R6 | **`daily` sin lógica**; selección de tema/campaña soportada en motor pero **no expuesta** | Media | `types.ts:26`; `useGameEngine` acepta `theme` pero ningún UI lo pasa |
| R7 | **Ciudad hardcodeada a Cali** pese a modelo parametrizado | Media | `DEFAULT_CENTER`, `profiles.city DEFAULT 'Cali'` |
| R8 | **Calidad del banco sin medir** (discriminación, ambigüedad, cobertura por dificultad/territorio) | Media | `question_performance_metrics` sin datos por falta de juego |

---

## 4. Backlog priorizado (salida de Fase 0)

**P0 — cierra la puerta de decisión de Fase 0 (habilita medir):**
1. **Implementar taxonomía de eventos mínima** conectando `analyticsService.trackEvent` a los puntos de disparo del motor (ver §5). Additivo, sin cambiar reglas de juego.
2. **Dashboard base** (o vista mínima) con D1/D7, embudo por modo y exactitud por dificultad, poblándose desde `analytics_events` + `game_sessions`.

**P1 — Fase 1 (estabilidad del duelo):**
3. Rediseñar duelo autoritativo: ruleset+versión inmutable y **set de preguntas congelado** al crear la partida; respuestas idempotentes; **tiempos y resultado derivados en servidor** (tiempo efectivo por participante, sin reloj compartido); ambos clientes renderizan estado persistido. *Plan B condicionado:* si sincronizar estado es frágil → comparación al cierre por turnos.
4. Exponer selección de **tema/campaña** (ya soportada por el motor).

**P2 — higiene/seguridad (transversal, puede paralelizarse):**
5. Rotar/restringir credenciales (R4). 6. Documentar linaje canónico de esquema y marcar SQL raíz como legado (R5).

**P3 — Fase 2+ (según manual):** Pregunta del día como feature completa; prototipo competitivo aislado; colección horizontal; modelo de ciudad; consola de economía.

---

## 5. Taxonomía de eventos (definición para implementar)

Reusar el primitivo existente `analyticsService.trackEvent(event_name, entity_type, entity_id, metadata)` → tabla `analytics_events`. Convención: `entity_type` = objeto principal; `metadata` = solo lo que consume la analítica (sin PII, sin texto libre del usuario).

| Evento | Existe hoy | Punto de disparo (archivo · función) | entity | metadata clave |
|---|---|---|---|---|
| `game_mode_viewed` | No | `JuegosPanel` (elección de modo) | game_id | mode |
| `game_started` | No | `useGameEngine.initGame` (tras insert de `game_sessions`) | session_id | game_id, mode, theme, question_count |
| `question_answered` | No | `useGameEngine.submitAnswer` | session_id | question_id, category, level, is_correct, time_to_answer_ms, timed_out |
| `game_abandoned` | No | cierre de `GameSessionModal` sin finalizar | session_id | game_id, mode, answered_count |
| `game_completed` | No | `useGameEngine.finishGame` | session_id | mode, score, accuracy_percent, answered, correct, max_streak |
| `challenge_created` | No | `challenge.service.createChallenge` | challenge_id | game_id |
| `challenge_accepted` | No | `ChallengeLobby` (aceptar) | challenge_id | game_id |
| `challenge_completed` | No | `challenge.service.completeChallenge` | challenge_id | winner_id (bool self), score_self, score_opp |
| `challenge_expired` | No | (requiere expiración; hoy no existe) | challenge_id | age |
| `daily_question_viewed/answered/shared` | No | (requiere feature Pregunta del día) | daily_id | date, is_correct, streak |
| `reward_granted` | Parcial (RPC, no evento) | tras `award_game_rewards`/`apply_rewards` | session_id | xp, app_points, coins, gems, source |
| `resource_spent` | No | `purchaseLives`/consumo de ayudas | offer_key | resource, amount, mode |
| `offer_viewed` | No | tienda/oferta de vidas | offer_key | context |
| `admin_adjustment` | No | (requiere consola de economía) | user_id | resource, amount, reason, admin_id |
| `circuit_selected` | No | (requiere modo Circuito) | city | source (manual/inferida) |
| `location_permission` | Parcial | flujo GPS de rutas | — | granted |
| `presence_verified` | No | check-in de rutas/recompensa geo | site_id | route_id |
| `content_reported` | Sí (tabla) | `question_reports` (evento espejo) | question_id | reason |
| `ruleset_version_used` | No | al crear partida/duelo con ruleset versionado | session_id | ruleset_version |

**Estado P0.1 (implementado):** ya emiten `game_mode_viewed` (`JuegosPanel.launchGame`), `game_started` · `question_answered` · `game_completed` · `reward_granted` (`hooks/useGameEngine.ts`), y `challenge_created` · `challenge_completed` (`services/challenge.service.ts`). **`game_abandoned` se deriva** (sesiones con `game_started` sin `game_completed`, más el flag `aborted:true` de `game_completed`); no se emite como evento separado. El resto queda ligado a sus fases (Pregunta del día, Circuito, presencia, consola de economía). Todas las llamadas son *fire-and-forget* vía `analyticsService.trackEvent` (no bloquean el juego; `trackEvent` sale temprano si no hay usuario autenticado).

**Guardrails de lectura (manual §8.3):** ninguna mejora de retorno cuenta como positiva si sube frustración, inequidad, gasto compulsivo o reportes; analizar por cohorte, versión, modo, ciudad y experiencia.

---

## 6. Estado de la puerta de decisión de Fase 0

- **Estado actual reproducible:** ✔ (sistemas mapeados y verificados en código real).
- **Métricas básicas disponibles:** ✗ — depende de implementar P0.1 (taxonomía de eventos) y P0.2 (dashboard base).

**Recomendación:** cerrar Fase 0 ejecutando el backlog P0 (instrumentación mínima + dashboard base), y **no** avanzar a features nuevas hasta que la señal de comportamiento empiece a poblarse. La estabilización del duelo (Fase 1) puede diseñarse en paralelo porque su causa raíz ya está diagnosticada (R1).
