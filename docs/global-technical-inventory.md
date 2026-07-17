# Inventario técnico global de Andanzas GO

Fecha de corte: 16 de julio de 2026.

## Objetivo y regla de conservación

Este inventario precede cualquier eliminación. Un elemento solo podrá retirarse cuando se hayan comprobado sus referencias en el cliente, sus dependencias en PostgreSQL, sus datos y una alternativa canónica. Los datos con valor editorial no se eliminan: se migran, archivan o conservan con una justificación explícita.

## Dimensión actual

- 154 archivos TypeScript/TSX dentro de componentes, contextos, hooks, servicios y librerías.
- 60 tablas activas entre los esquemas `public` y `economy`, todas con RLS habilitado.
- 24 funciones de aplicación y 9 disparadores de base de datos.
- 29 migraciones locales.
- 39 SQL y 14 JSON sueltos en la raíz, además de 18 utilidades en `scratch` y 2 archivos compilados versionados en `dist_temp`.
- El `dist` local contiene 88 archivos y cerca de 48 MB, pero está ignorado correctamente.

## Hallazgos confirmados

### Prioridad crítica

1. `.env` estaba versionado desde varios commits. Se retira del índice sin borrar el archivo local y se corrige `.gitignore`. Las credenciales históricas deben rotarse o restringirse.
2. `user_route_progress` tenía permisos de tabla excesivos, incluidos permisos anónimos y `TRUNCATE`. La tabla tenía RLS, pero la concesión era innecesariamente amplia.
3. Las funciones internas `economy.apply_rewards`, `economy.refresh_lives` y `economy.roll_gem_reward` conservaban `EXECUTE` para `anon` y `authenticated`. No tienen llamadas directas desde el cliente; sus permisos públicos se revocan y quedan disponibles para composición interna y `service_role`.

### Errores o deuda funcional activa

1. El progreso de rutas existía solo en estado React y se perdía al recargar. La tabla `user_route_progress` estaba vacía y sin uso. Se activa como fuente persistente.
2. El resumen antiguo del panel consultaba nombres inexistentes: `ruta_registrations`, `rutas` y `news`. Los nombres canónicos actuales son `user_route_progress`, `routes` y `feed_items`.
3. `routes.service.ts` todavía usa `ruta_registrations` para inscripciones a rutas con cupo. Esa tabla no existe en el proyecto activo; esta función debe reconstruirse o sustituirse antes de ofrecer inscripciones.
4. Las métricas avanzadas dependen de `analytics_events` y `user_sessions`, pero `analytics.service.ts` no tiene consumidores y ambas tablas están vacías. Por eso “actividad hoy” no puede producir información útil todavía.

### Duplicados o candidatos de consolidación

| Elemento | Estado observado | Decisión provisional |
|---|---|---|
| `challenge.service.ts` / `challenges.service.ts` | El singular tiene 3 consumidores; el plural no tiene ninguno | Conservar el singular y retirar el plural tras comprobación final |
| `tickets` / `support_tickets` | Ambas vacías; el cliente usa `tickets` | Definir el formulario canónico y migrar columnas útiles antes de retirar una |
| `app_banners` / `promoted_banners` | Ambas contienen datos distintos | No son duplicados exactos: una gestiona textos de panel/perfil y otra destacados con destino |
| `routes.puntos/gamificacion` / `route_stops/route_challenges` | Las tablas normalizadas están vacías; la app usa arreglos/JSON en `routes` | Mantener el modelo vigente hasta diseñar una migración sin pérdida |
| `analytics.service.ts` | Sin consumidores | No borrar hasta decidir e implementar la instrumentación de métricas |

### Elementos que parecían inexistentes pero no son tablas

- `images` y `avatars` son buckets de Supabase Storage, no tablas. Sus referencias no deben eliminarse por el cruce de tablas.
- `dictionary_readiness` es una vista de diagnóstico; no se considera contenido huérfano por no aparecer en el cliente.

## Datos que deben preservarse

- 1.126 preguntas, 818 verificaciones editoriales, 1.126 enlaces temáticos y 686 asignaciones entre preguntas y juegos.
- 133 sitios, 42 eventos, 6 rutas, 39 curiosidades, 96 entradas de diccionario y 1.023 relaciones de contenido.
- 11 banners configurables, 3 destacados promocionados y 7 avatares.
- Historial de 20 sesiones de juego y 76 respuestas.

## Secuencia recomendada de limpieza

1. Seguridad y persistencia: retirar `.env`, cerrar permisos amplios y persistir rutas.
2. Corregir referencias a tablas inexistentes en panel y servicios.
3. Activar instrumentación mínima de `analytics_events/user_sessions` o retirar sus métricas hasta que existan datos reales.
4. Consolidar servicios duplicados sin cambiar contratos de componentes.
5. Mover SQL/JSON históricos de la raíz a `archive/legacy-data` con un manifiesto; no borrarlos.
6. Retirar `dist_temp` y utilidades `scratch` solo después de confirmar que sus salidas ya están preservadas.
7. Auditar permisos tabla por tabla y funciones `SECURITY DEFINER` antes del lanzamiento.

## Compatibilidad con cambios recientes de Supabase

Las migraciones nuevas deben incluir `GRANT` explícitos por rol. Supabase anunció que las tablas nuevas dejarán de exponerse automáticamente a Data API; depender de privilegios implícitos generaría fallos futuros y fronteras de acceso poco claras.
