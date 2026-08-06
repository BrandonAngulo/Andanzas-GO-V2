# TRIVIA GO V3 — Fase 0, bloque 2

**Alcance:** cobertura real para el capítulo “Sabores de Cali”

**Fecha:** 26 de julio de 2026

**Fuente:** Supabase `Andanzas GO V3` (`jacspnfiscrhxvorovri`), consultas agregadas de solo lectura

**Cambios en producción:** ninguno

## 1. Veredicto

El banco actual **sí permite construir un piloto de 10 niveles con 5 preguntas por nivel**, usando 50 preguntas distintas en el primer recorrido.

Sin embargo, todavía no está listo para publicarse como capítulo:

- hay 51 preguntas publicadas candidatas, un margen de solo una pregunta;
- la dificultad está concentrada en niveles técnicos 1 y 2;
- 18 preguntas de “Valle comestible” no tienen validación editorial registrada;
- solo 20 preguntas mencionan explícitamente Cali;
- el uso histórico es demasiado bajo para validar dificultad empírica.

La meta fue ampliada a **200 preguntas publicadas y aprobadas**: 150 generales más 50 preguntas visuales adicionales. Las visuales deben sumar al menos 5 por nivel, distribuirse entre modos y gestionarse desde el panel.

## 2. Inventario

### Categorías candidatas dentro de TRIVIA GO

| Categoría | Publicadas | En revisión | Total candidato |
|---|---:|---:|---:|
| Gastronomía | 33 | 7 | 40 |
| Valle comestible | 18 | 0 | 18 |
| **Total** | **51** | **7** | **58** |

Existe además otro juego, “Sabores y Saberes del Valle”, con 14 preguntas gastronómicas publicadas. No se deben incorporar automáticamente: primero hay que revisar derechos editoriales, alcance territorial, duplicados semánticos y compatibilidad con TRIVIA GO.

### Dificultad de las 51 publicadas

| Nivel técnico actual | Cantidad |
|---|---:|
| 1 | 19 |
| 2 | 30 |
| 3 | 2 |
| 4–5 | 0 |

**Conclusión:** no es viable mapear directamente nivel técnico de pregunta a los 10 niveles narrativos. Los niveles narrativos deben combinar contenido y progresión; además se necesitan preguntas de mayor profundidad.

### Variedad de formatos

| Formato | Cantidad publicada |
|---|---:|
| Opción múltiple | 33 |
| Selección múltiple | 7 |
| Ordenar | 7 |
| Relacionar | 4 |
| Elección por imagen | 0 |

La variedad funcional es aceptable para un piloto, pero falta contenido visual.

### Calidad y completitud

- Las 33 preguntas publicadas de Gastronomía tienen explicación, respuesta y control editorial con puntuación 100; no registran errores ni advertencias.
- Las 7 preguntas gastronómicas en revisión también tienen control 100, pero su estado sigue siendo `review`; no cuentan como publicables hasta completar el flujo.
- Las 18 preguntas de Valle comestible tienen explicación y respuesta, pero no tienen fila de control editorial.
- No se encontraron duplicados textuales exactos entre las 58 candidatas.
- La traducción inglesa es prácticamente inexistente en el conjunto de TRIVIA GO; no debe bloquear el piloto en español, pero debe quedar como deuda explícita.

### Alcance territorial por señales de texto

Entre las 51 publicadas:

- 20 mencionan explícitamente Cali o “caleño”;
- 20 mencionan el Valle del Cauca o identidad valluna;
- 18 contienen señales del Pacífico o territorios vecinos;
- 18 mencionan alimentos icónicos como pandebono, champús, cholado, lulada, marranita, aborrajado, manjar blanco o pandeyuca.

Estas señales se solapan y no sustituyen una revisión humana. “Sabores de Cali” puede incluir relaciones regionales, pero cada pregunta debe etiquetarse como:

- Cali;
- Valle del Cauca;
- Pacífico relacionado;
- contexto colombiano;
- fuera de alcance.

## 3. Señal de uso

Las 58 preguntas candidatas acumulan:

- 14 respuestas históricas;
- 12 correctas;
- solo 13 preguntas han sido vistas.

No hay muestra suficiente para usar dificultad empírica. El orden del piloto debe partir de evaluación editorial y luego ajustarse con datos reales.

## 4. Base general de 150 + ampliación visual a 200

Distribución objetivo:

| Dificultad técnica | Publicadas actuales | En revisión | Meta | Nuevas necesarias si revisión aprueba |
|---:|---:|---:|---:|---:|
| 1 | 19 | 0 | 25 | 6 |
| 2 | 30 | 0 | 35 | 5 |
| 3 | 2 | 3 | 35 | 30 |
| 4 | 0 | 3 | 35 | 32 |
| 5 | 0 | 1 | 20 | 19 |
| **Total** | **51** | **7** | **150** | **92** |

Si alguna pregunta en revisión no se aprueba, deberá reemplazarse. Por tanto:

- mejor escenario: 92 preguntas nuevas;
- máximo necesario con el estado actual: 99 preguntas nuevas;
- prioridad de autoría: nivel 4 → nivel 3 → nivel 5 → nivel 1;
- también se crearán 5 preguntas de nivel 2 para ampliar variedad.

La distribución 25/35/35/35/20 conserva una entrada amable y ofrece profundidad suficiente para repetición sin convertir la mayoría del banco en contenido experto.

## 5. Diseño viable de los 10 niveles narrativos

Cada nivel tendrá 5 preguntas en el primer recorrido:

| Nivel | Tema editorial propuesto | Propósito |
|---:|---|---|
| 1 | Bienvenida a los sabores | reconocimiento básico |
| 2 | Bebidas caleñas | lulada, champús y cholado |
| 3 | Fritos y antojos | marranita, aborrajado y empanada |
| 4 | Panes y amasijos | pandebono y pandeyuca |
| 5 | Dulces y postres | manjar blanco y tradición |
| 6 | Plaza y calle | lugares, ventas y costumbres |
| 7 | Ingredientes del territorio | origen y productos |
| 8 | Herencia del Pacífico | conexiones culturales |
| 9 | Preparaciones y memoria | ordenar/relacionar |
| 10 | Mesa maestra | mezcla de mayor exigencia |

Esta taxonomía es propuesta editorial. Las 51 preguntas deben clasificarse antes de confirmar que todos los niveles tienen contenido suficiente.

## 6. Desbloqueo de Pandebono

Regla aprobada:

```text
10 niveles completados
AND respuestas correctas acumuladas en el capítulo >= 30
```

Con 5 preguntas por nivel, el recorrido inicial ofrece 50 oportunidades. El umbral de 30 correctas equivale a un 60 % acumulado si el jugador completa una sola vez cada nivel.

Claridad funcional:

- completar los 10 niveles habilita el cierre del recorrido;
- si todavía no alcanza 30 correctas, puede practicar niveles;
- las respuestas correctas se cuentan por pregunta única para el desbloqueo, no por repetir indefinidamente la misma pregunta;
- el servidor evalúa y registra el desbloqueo una sola vez;
- Pandebono permanece desbloqueado aunque luego cambie el banco;
- equiparlo o no equiparlo es una preferencia separada.

La regla de “pregunta única” evita que una persona desbloquee al compañero repitiendo una sola respuesta conocida.

## 7. Trabajo editorial necesario

### Imprescindible

1. Ejecutar controles editoriales sobre las 18 preguntas de Valle comestible.
2. Resolver las 7 preguntas en revisión.
3. Clasificar las 58 candidatas en los 10 temas.
4. Marcar alcance territorial.
5. Revisar duplicados semánticos, no solo textuales.
6. Confirmar exactitud de opciones y explicaciones.
7. Crear entre 92 y 99 preguntas nuevas aprobadas para llegar a 150.
8. Incorporar preguntas de dificultad 3–5 y elección por imagen.

### Uso de la base general de 150

- 50 para el primer recorrido;
- 70 para nuevos recorridos, variaciones adaptativas y antirrepetición;
- 30 para práctica, recuperación y reemplazo editorial;
- cobertura promedio: 15 preguntas aprobadas por nivel narrativo.

Las 50 preguntas visuales son adicionales: 35 con una imagen en el enunciado y opciones de texto, y 15 `image_choice` como punto de partida. Elevan la cobertura total a un promedio de 20 por nivel.

## 8. Decisión de arquitectura derivada

No debe modificarse `game_questions.level` para representar los 10 niveles narrativos.

Se necesitan asignaciones administrables:

```text
capítulo
  └─ nivel narrativo
      └─ preguntas asignadas
```

Una pregunta conserva su dificultad técnica y puede asignarse a un nivel narrativo según tema, dificultad y orden. Esto evita romper el motor adaptativo existente.

## 9. Puerta de salida del bloque

Este bloque queda completo porque ya responde:

- hay contenido suficiente para prototipar 10 × 5;
- no hay margen suficiente para publicar;
- faltan entre 92 y 99 preguntas para la meta aprobada de 150;
- la principal brecha es dificultad/calidad editorial, no cantidad absoluta;
- los niveles narrativos necesitan una relación propia con las preguntas.

El siguiente bloque recomendado es definir el **contrato funcional de capítulos, niveles y asignaciones**, todavía como especificación; no aplicar migraciones hasta revisar ese contrato.
