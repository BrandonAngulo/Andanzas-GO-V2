# TRIVIA GO — Revisión de calidad del lote `expansion_300_2026`

**Fecha:** 28 de julio de 2026
**Alcance:** las 300 preguntas de la campaña `expansion_300_2026` (todas ya estaban `published`).
**Cambios en producción:** sí (ver "Acciones").

## 1. Diagnóstico

**Lo bueno del lote:**
- Estructura impecable: 226/226 opción múltiple con clave de respuesta válida, 0 opciones repetidas, 0 índices fuera de rango.
- Cobertura de dificultad: **100% L3–L5** (llenaba el hueco de dificultad profunda).
- Formato diverso: 25% no-MC (vs 12% del banco).
- Hechos bien citados (Alcaldía de Cali, DAGMA) y sin duplicar el banco viejo (solo 3 casi-duplicados contra las ~924 preexistentes).

**El problema grave — 120 de 300 (40%) eran plantillas meta explotables**, en 3 familias de 40:
1. `Un equipo debe interpretar {X} sin contradecir la memoria documentada de Cali. ¿Qué enunciado debería conservar?`
2. `En una revisión sobre {X}, ¿qué conclusión está respaldada por la documentación local?`
3. `¿Cuál afirmación sobre {X} coincide con la fuente editorial?`

Defectos apilados:
- **Monotonía extrema** (similitud 0.88–0.97 entre enunciados; solo cambiaba una palabra).
- **Enunciado meta/abstracto** (no preguntaban un hecho, sino "cuál enunciado conservar").
- **100% gameable**: en las 120, la respuesta correcta era **siempre la opción más larga**, con distractores absurdos ("La Base fue una estación espacial", "nace en el océano Atlántico"). Elegir la más larga acertaba el 100%.

**Hallazgo de fondo:** las 3 familias cubrían **los mismos 40 hechos** (mismo `correct_answer` palabra por palabra), triplicados como L3/L4/L5. No eran 120 preguntas únicas: eran **40 hechos × 3 plantillas**. La "profundidad L4–L5" era en parte ilusoria.

## 2. Acciones (aprobadas por el usuario)

Enfoque aprobado: **despublicar + reescribir**, y para los duplicados, **rescatar las que tuvieran un segundo dato citado**; el resto, archivar.

1. **120 despublicadas** (`status='review'`) para sacarlas de vivo de inmediato (el motor filtra `status='published'`).
2. **Familia "fuente editorial" (40) → reescritas y republicadas** como preguntas directas y factuales, con distractores plausibles, longitud más pareja y posición de la correcta rotada. Ej.: "¿Cuál afirmación sobre Río Lili…?" → **"¿Dónde nace el río Lili?"**
3. **Familias "revisión" (L4) e "interpretar" (L5) — 80 duplicadas:**
   - **9 rescatadas** a L4 con un **segundo dato** distinto del que ya pregunta la familia 1 (año de declaratoria de los teatros, altura del Lili, desembocadura del Cali, constructores de la Casa Arzobispal, vocaciones del Distrito Especial, año de la CVC, año de Primero de Mayo, otro nombre de La Babilla).
   - **71 archivadas** (`status='archived'`, recuperables) por ser duplicados sin segundo dato.
4. **Corrección de 3 choques con preguntas preexistentes del lote:** archivadas 2 reescrituras redundantes (año de construcción del Teatro Jorge Isaacs y de inauguración del Teatro Municipal ya existían) y acotada la del río Aguacatal a solo el nacimiento.

## 3. Estado final del lote

| Métrica | Antes | Después |
|---|---:|---:|
| Publicadas | 300 | **227** |
| Archivadas (recuperables) | 0 | **73** |
| Plantillas meta publicadas | 120 | **0** |
| Pares casi-duplicados (>0.6) | ~cientos | **0** |
| Gameo "correcta = opción más larga" (MC) | 100% en las 120 | **67%** del lote (≈ baseline del banco) |

Banco total publicado tras la limpieza: **1.151**.

## 4. Nota de reutilización

El patrón "40 hechos × 3 plantillas" es un anti-patrón a vigilar en futuras expansiones: subir el nivel de dificultad **no** puede ser reetiquetar el mismo hecho con un enunciado más rebuscado. Un dato = idealmente una pregunta; para subir de nivel, preguntar **otro atributo** del mismo tema o exigir integración real de varios datos. La herramienta `get_template_concentration(game_id)` (admin → Juegos → Analítica) mide esta monotonía por categoría.
