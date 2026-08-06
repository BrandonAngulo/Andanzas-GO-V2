# TRIVIA GO V3 — Fase 0, bloque 1

**Alcance:** flujo público actual, gestión existente y matriz de paridad

**Fecha:** 26 de julio de 2026

**Método:** lectura directa del código local. No se modificó base de datos ni comportamiento.

## 1. Resultado

La arquitectura actual permite evolucionar TRIVIA GO como módulo integrado de Andanzas GO. No hace falta crear una aplicación, un panel ni un motor de partidas nuevos.

Los dos puntos de extensión naturales son:

- experiencia pública: `JuegosPanel` → selector → `GameSessionModal`;
- gestión: `AdminJuegos` → `JuegoForm` → `PreguntasForm` / analítica.

V3 debe introducir Plaza, Aventura, capítulos y compañeros alrededor de estos contratos, conservando el motor de sesión.

## 2. Flujo público real

```text
App.tsx
  └─ panel "juegos" (requiere autenticación)
      └─ JuegosPanel
          ├─ carga juegos públicos
          ├─ muestra TRIVIA GO
          ├─ abre instrucciones
          └─ selector
              ├─ lugar/tema → levels
              ├─ clásico → levels
              ├─ historia → legend
              ├─ contrarreloj → timed
              └─ duelo → start-duel

open-game
  └─ App guarda gameId, mode y theme
      └─ GameSessionModal
          └─ useGameEngine
              ├─ compone preguntas
              ├─ crea sesión
              ├─ verifica respuestas
              ├─ persiste respuestas
              ├─ aplica vidas/puntuación
              ├─ entrega recompensas
              └─ registra analítica
```

### Evidencia principal

- `JuegosPanel.tsx`: filtra estados públicos y abre selección para juegos `trivia`.
- `JuegosPanel.tsx`: despacha `levels`, `legend`, `timed`, temas y duelo.
- `App.tsx`: escucha `open-game` y monta `GameSessionModal`.
- `GameSessionModal.tsx`: conserva interfaz y feedback de partida.
- `useGameEngine.ts`: usa `compose_game_questions`, fallback publicado, antirrepetición, sesiones, respuestas, vidas, recompensas y eventos.

### Conclusión para V3

La **Plaza** puede reemplazar progresivamente la presentación y selector actuales, pero debe seguir entregando al motor:

```ts
gameId
mode: 'levels' | 'legend' | 'timed'
theme?: string
```

El primer recorrido de Aventura puede traducir un nodo a estos parámetros sin reescribir `useGameEngine`. Más adelante se añadirá `chapterId`, `levelId` y `publicationVersion` mediante contratos aditivos.

## 3. Gestión existente

### `AdminJuegos`

Actualmente permite:

- listar juegos;
- crear y editar;
- publicar/despublicar;
- acciones masivas;
- eliminar;
- abrir vista previa mediante `open-game`.

### `JuegoForm`

Actualmente permite administrar:

- contenido básico;
- portada mediante URL/subida;
- posición de imagen;
- acento visual, tono suave, icono y patrón;
- estado editorial;
- configuración de preguntas por partida;
- preguntas del juego mediante `PreguntasForm`.

**Hallazgo importante:** la decisión de hacer reemplazable la nueva portada ya encaja con el modelo actual (`cover_image_url` + `image_position`). V3 necesita mejorar previsualización, historial y texto alternativo, no inventar un sistema paralelo.

### `PreguntasForm`

Actualmente permite:

- crear y editar preguntas;
- estados `draft`, `review`, `published`, `archived`;
- filtros por estado, nivel y categoría;
- búsqueda;
- selección y acciones masivas;
- validaciones editoriales;
- bloqueo de publicación cuando existen errores;
- tipos opción múltiple, selección múltiple, ordenar, relacionar e imagen;
- eliminación.

### `JuegosAnalyticsPanel`

Actualmente presenta:

- vistas/inicios/finalizaciones;
- partidas por modo;
- exactitud por dificultad;
- reportes de preguntas y resolución.

### Conclusión para V3

La entrada recomendada es:

```text
Administración
  └─ Juegos
      └─ TRIVIA GO
          ├─ General
          ├─ Preguntas
          ├─ Capítulos y mapa       [nuevo]
          ├─ Desbloqueos            [nuevo]
          ├─ Amigos de Andi         [nuevo]
          └─ Analítica
```

Las nuevas secciones deben vivir dentro de `AdminJuegos/JuegoForm` o una vista de detalle de TRIVIA GO relacionada, usando el mismo shell administrativo.

## 4. Matriz de paridad V3

| Capacidad actual | Debe conservarse | Tratamiento V3 |
|---|:---:|---|
| acceso desde panel Juegos | sí | Plaza integrada |
| autenticación requerida | sí | sin segundo login |
| juegos publicados/programados/próximos | sí | mantener estados |
| instrucciones | sí | acceso desde Plaza y cada modo |
| selección por lugar | sí | portal o filtro |
| selección por tema | sí | capítulos/categorías |
| modo `levels` | sí | Reto rápido |
| modo `legend` | sí | base de Aventura |
| modo `timed` | sí | Contrarreloj |
| duelo | sí | identidad propia, mismo flujo |
| Pregunta del día | sí | módulo secundario en Plaza |
| metas semanales | sí | módulo secundario |
| modificadores | sí | comunicación contextual |
| tipos de pregunta existentes | sí | mismo renderer |
| vidas y compra de vidas | sí | sin alterar economía |
| zonas seguras | sí | nodos/hitos del recorrido |
| explicación y aprendizaje relacionado | sí | feedback V3 |
| reporte de pregunta | sí | menú secundario accesible |
| resultado y recompensas | sí | rediseño con avance |
| portada administrable | sí | usar URL, posición y storage existentes |
| estados editoriales de preguntas | sí | mantener workflow |
| validación editorial | sí | prerrequisito de nivel/publicación |
| acciones masivas | sí | conservar |
| analítica de embudo | sí | ampliar por capítulo/nodo |
| reportes de contenido | sí | conservar y contextualizar |

## 5. Brechas confirmadas para el piloto

No aparecen en el flujo actual:

- entidad administrable de capítulo;
- niveles de capítulo;
- mapa semántico y nodos;
- versión publicada del recorrido;
- progreso de recorrido independiente de maestría;
- catálogo de compañeros;
- desbloqueo/equipamiento de Pandebono;
- constructor/simulador de reglas;
- texto alternativo explícito para portada;
- historial/rollback específico de configuración V3.

Estas son extensiones reales. No deben confundirse con funciones que ya existen.

## 6. Contratos que no deben romperse

1. `open-game` y los parámetros actuales deben seguir funcionando durante la transición.
2. `useGameEngine` sigue siendo la fuente de comportamiento de partida.
3. Solo preguntas publicadas entran a partidas.
4. Los tipos actuales siguen usando `QuestionRenderer`.
5. Recompensas, vidas y resultados continúan siendo autoritativos/idempotentes en servidor.
6. La portada sigue resolviéndose desde datos administrables.
7. Los eventos actuales no se renombran; se amplían con metadatos o eventos nuevos.
8. Una categoría visible no puede convertirse directamente en identificador estable.

## 7. Próximo bloque recomendado

**Inventario de cobertura de Sabores de Cali**, idealmente contra la base conectada:

- total por categoría y posibles alias gastronómicos;
- estado editorial;
- preguntas correctas y completas;
- tipo/formato;
- dificultad;
- explicación y recurso visual;
- duplicados;
- uso histórico;
- cantidad utilizable por cada uno de los 10 niveles.

La salida debe responder si el banco sostiene 10 niveles con variedad y cuántas preguntas nuevas deben producirse. No deben crearse tablas de capítulos antes de conocer ese dato.
