# TRIVIA GO V3 — Fase 0, bloque 3

**Alcance:** diagnóstico del banco para modos, dificultades y capítulos

**Fecha:** 26 de julio de 2026

**Fuente:** Supabase `Andanzas GO V3`, consultas agregadas de solo lectura

**Cambios en producción:** ninguno

## 1. Resumen ejecutivo

TRIVIA GO tiene volumen suficiente para sostener modos de mezcla general, pero no todavía una colección amplia de capítulos con repetición profunda.

Estado actual:

- 1.225 preguntas vinculadas a TRIVIA GO;
- 924 publicadas;
- 300 en revisión;
- 28 categorías con alguna pregunta publicada;
- 924 explicaciones completas;
- 0 traducciones inglesas publicadas;
- 0 preguntas `image_choice` publicadas al corte. Después se crearon 6 borradores, todavía sin imágenes cargadas.
- 815 preguntas publicadas son de opción múltiple.

El número total debe interpretarse con cuidado: **288 preguntas pertenecen a Vocabulario**. Sin esa categoría quedan 636 preguntas publicadas distribuidas entre 27 categorías.

## 2. Distribución general

### Dificultad técnica

| Dificultad | Publicadas | Participación |
|---:|---:|---:|
| 1 | 305 | 33,0 % |
| 2 | 302 | 32,7 % |
| 3 | 147 | 15,9 % |
| 4 | 95 | 10,3 % |
| 5 | 75 | 8,1 % |

El banco global sí tiene progresión, pero está concentrado en dificultades 1–2. La distribución mejora artificialmente por Vocabulario, que aporta alrededor de 57 preguntas en cada nivel.

### Formatos

| Formato | Publicadas | Participación |
|---|---:|---:|
| Opción múltiple | 815 | 88,2 % |
| Selección múltiple | 53 | 5,7 % |
| Ordenar | 30 | 3,2 % |
| Relacionar | 26 | 2,8 % |
| Elección por imagen | 0 | 0 % |

La variedad funcional existe, pero es insuficiente. La creación futura debe reservar cuotas explícitas para formatos alternativos y contenido visual.

### Campañas/territorios

| Campaña | Publicadas |
|---|---:|
| Vocabulario | 288 |
| Cali | 230 |
| Valle del Cauca | 206 |
| Mundo general | 150 |
| Colombia | 50 |
| Expansión 2026 | 300 en revisión |

Las campañas sirven como alcance geográfico, pero no equivalen a capítulos ni garantizan equilibrio temático.

## 3. Diagnóstico por modo

### 3.1 Reto rápido

**Estado:** viable hoy para mezcla general, mundo, Valle y Vocabulario.

Fortalezas:

- 924 preguntas disponibles;
- soporte técnico de tema/campaña ya existente;
- cantidad suficiente para partidas de 15 preguntas;
- buena cobertura de opción múltiple.

Brechas:

- categorías pequeñas producen repetición;
- el fallback del motor puede salir del tema cuando no encuentra suficiente contenido;
- formatos complejos no siempre son adecuados para una sesión “rápida”;
- no existe una regla editorial que determine qué preguntas son elegibles para este modo.

Requisito recomendado:

- mínimo 30 preguntas aprobadas para mostrar una categoría como Reto rápido;
- 50 recomendadas para una experiencia repetible;
- pool propio por modo mediante asignación, no duplicación de preguntas.

### 3.2 Aventura

**Estado:** requiere estructura nueva y expansión editorial.

Aventura necesita:

- capítulos administrables;
- 10 niveles narrativos por capítulo aprobado;
- asignación pregunta–nivel;
- orden y requisitos;
- progreso persistente;
- pool de práctica;
- versión publicada.

Sabores de Cali adoptó posteriormente una meta de 200: 150 generales + 50 visuales. Este estándar ampliado no se aplica automáticamente a todos los capítulos hasta validar el piloto.

Vocabulario tiene 288 preguntas y podría sostener un recorrido propio, pero conceptualmente pertenece a una experiencia educativa distinta y no debe convertirse automáticamente en capítulo de Cali.

### 3.3 Contrarreloj

**Estado:** viable con un pool curado.

Datos:

- 815 preguntas de opción múltiple;
- 800 preguntas tienen límite entre 16 y 30 segundos;
- 124 tienen más de 30 segundos;
- ninguna tiene 15 segundos o menos.

Recomendación:

- Contrarreloj debe usar inicialmente opción múltiple;
- excluir ordenar, relacionar y selección múltiple hasta validar tiempos;
- definir un flag de elegibilidad por modo;
- calibrar tiempo efectivo con datos reales;
- evitar preguntas largas o dependientes de lectura visual detallada.

No se debe asumir que `time_limit_sec` actual representa dificultad temporal validada.

### 3.4 Duelo

**Estado:** funcional si conserva sets congelados y reglas autoritativas.

Requisitos editoriales:

- ambos jugadores reciben exactamente el mismo set y versión;
- usar preguntas publicadas;
- excluir formatos no equivalentes hasta probar interacción;
- evitar preguntas reportadas o con advertencias;
- equilibrar dificultad y categoría;
- no revelar el set a través de partidas recientes.

Pool inicial recomendado:

- opción múltiple;
- explicación disponible después de cerrar;
- mínimo 100 preguntas elegibles por territorio para reducir repetición.

### 3.5 Pregunta del día

**Estado:** tiene contenido suficiente.

El banco ofrece 815 candidatas de opción múltiple con explicación. Debe añadirse selección editorial para:

- relevancia;
- claridad autónoma;
- actualidad no perecedera;
- ausencia de ambigüedad;
- dificultad moderada;
- posibilidad de compartir sin revelar respuesta.

No todas las preguntas publicadas deben ser elegibles automáticamente.

### 3.6 Práctica

**Estado:** soportada por el motor adaptativo, pero no presentada como experiencia.

La práctica debe seleccionar:

- conceptos débiles;
- preguntas no vistas;
- errores recientes;
- dificultad progresiva;
- variantes del capítulo.

Las respuestas correctas para desbloqueos deben contar por pregunta única, mientras que la práctica puede repetir preguntas con fines pedagógicos.

## 4. Diagnóstico de capítulos de Cali

Las categorías actuales son etiquetas editoriales, no capítulos. La siguiente agrupación es una propuesta de diagnóstico y puede contener solapamientos que deben resolverse manualmente.

| Capítulo candidato | Publicadas relacionadas | En revisión relacionadas | Estado frente a meta 150 |
|---|---:|---:|---|
| Sabores de Cali | 51 | 7 | expansión aprobada |
| Cali que suena | 23 | 12 | muy insuficiente |
| Historia y memoria | 19 | 50 | insuficiente, gran lote pendiente |
| Barrios y territorio | 36 | 28 | insuficiente |
| Gente e identidad | 21 aprox. | 23 aprox. | muy insuficiente |
| Naturaleza y río | 13 | 36 | muy insuficiente |
| Arte, escena y Caliwood | 20 | 49 | insuficiente, gran lote pendiente |
| Fiestas y tradiciones | 15 | 8 | muy insuficiente |
| Deporte caleño | 16 | 16 | muy insuficiente |

“Publicadas relacionadas” no significa automáticamente utilizables. Es necesario revisar solapamientos, alcance territorial y coherencia del capítulo.

### Orden recomendado de desarrollo

1. **Sabores de Cali:** ya tiene decisión, personaje y expansión a 150.
2. **Historia y memoria:** dispone de 50 preguntas en revisión que pueden acelerar el capítulo.
3. **Arte, escena y Caliwood:** 49 en revisión y buena variedad potencial.
4. **Barrios y territorio:** base pública de 36 más 28 en revisión.
5. **Naturaleza y río:** 36 pendientes, pero requiere revisar relación con Cali.
6. **Cali que suena:** identidad fuerte, banco todavía pequeño.

No conviene producir simultáneamente los nueve capítulos a 150 preguntas. Se debe completar y validar uno, aprender con datos y luego escalar el sistema editorial.

## 5. Categorías publicadas: alertas principales

### Con buena profundidad o equilibrio relativo

- Vocabulario: 288, balanceada en dificultad, pero monótona en formato.
- Historia y economía: 66, buena progresión y variedad.
- Municipios y territorio: 64, buena base regional.
- Arte y cultura: 21, poca cantidad pero buena presencia de niveles 3–5.

### Con volumen pero dificultad superficial

- Geografía mundial: 80, sin niveles 3–5.
- Geografía de Colombia: 28, sin niveles 3–5.
- Culturas del mundo: 25, sin niveles 3–5.
- Ciencia y naturaleza: 20, sin niveles 3–5.
- Gastronomía: 33, sin niveles 3–5 publicados.

### Con cobertura crítica

- General: 3.
- Leyendas: 6.
- Cultura colombiana: 6.
- Historia de Colombia: 8.
- Naturaleza de Colombia: 8.
- Cultura e identidad: 10 publicadas, 18 en revisión.
- Personajes ilustres: 17.
- Naturaleza y entorno: 13.

## 6. Backlog editorial de 300 preguntas

La campaña `expansion_300_2026` contiene exactamente 300 preguntas en revisión repartidas entre 15 categorías.

Este lote debe procesarse antes de producir masivamente sin diagnóstico porque puede:

- cubrir parte de Historia, Arte, Naturaleza, Barrios y Cultura;
- reducir el volumen nuevo necesario;
- revelar duplicados semánticos;
- mejorar dificultades altas;
- permitir una taxonomía de capítulos más estable.

Publicar las 300 en bloque no es aceptable. Deben revisarse por capítulo, nivel, formato y alcance.

## 7. Modelo de elegibilidad recomendado

Una pregunta puede pertenecer al banco global y, mediante asignaciones, ser elegible para varios contextos:

```text
pregunta
├─ territorio/campaña
├─ categoría editorial
├─ capítulo
├─ nivel narrativo
└─ modos permitidos
   ├─ reto rápido
   ├─ aventura
   ├─ contrarreloj
   ├─ duelo
   ├─ diaria
   └─ práctica
```

La elegibilidad no debe almacenarse como una única lista JSON dentro de la pregunta. Conviene una relación administrable y auditable para evitar duplicar contenido.

## 8. Reglas de publicación por experiencia

| Experiencia | Mínimo recomendado |
|---|---|
| Reto rápido por categoría | 30 aprobadas; 50 recomendadas |
| Contrarreloj por pool | 100 breves y validadas |
| Duelo por territorio | 100 equivalentes y validadas |
| Pregunta del día | 90 elegibles para tres meses |
| Capítulo piloto | 50 para recorrido |
| Capítulo completo repetible | 150 aprobadas |
| Práctica de capítulo | al menos 30 fuera del primer recorrido |

Estos mínimos son reglas operativas propuestas; salvo Sabores de Cali, todavía requieren aprobación.

## 9. Decisiones derivadas

1. “Modo”, “categoría”, “campaña”, “dificultad” y “capítulo” son dimensiones distintas.
2. No debe crearse una copia de la pregunta para cada modo.
3. Los 10 niveles narrativos no reemplazan `game_questions.level`.
4. Se necesita elegibilidad administrable por modo.
5. Se necesita asignación administrable a capítulo y nivel.
6. La expansión de 300 debe revisarse antes de calcular el backlog definitivo de otros capítulos.
7. La creación nueva debe corregir formatos, dificultad y cobertura, no solo aumentar totales.
8. El idioma inglés requiere un plan separado: hoy las 924 publicadas de TRIVIA GO carecen de traducción.

## 10. Próximo bloque recomendado

Definir el contrato funcional de:

- capítulo;
- nivel narrativo;
- asignación de preguntas;
- elegibilidad por modo;
- publicación versionada;
- progreso;
- regla de desbloqueo.

La especificación debe incluir ejemplos con Sabores de Cali, pero ser reutilizable para los demás capítulos. Solo después se diseñará la migración.
