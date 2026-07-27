# TRIVIA GO — Lote 1 de preguntas con imagen (`image_choice`)

**Estado:** contenido editorial listo. Faltan las **imágenes raster** (generarlas con la
herramienta de imágenes de la app y subirlas en admin → Juegos → Preguntas → editar cada
opción → botón de subida). Las 6 preguntas se insertan como **borrador** para completarlas.

## Estilo de imagen (aplicar a TODAS)
> Ilustración digital cálida y detallada, estilo Andanzas GO: colores vivos, luz suave,
> **un solo objeto/lugar centrado** sobre fondo simple (crema #FFF7EC o degradado suave),
> formato **cuadrado 1:1** (≥512 px), **sin texto ni logos ni marcas de agua**. Las 4 imágenes
> de una misma pregunta deben verse como set (misma paleta, misma luz, mismo encuadre).
> Paleta de marca: verde (#3E7D3A / #10B981) y naranja (#E8892B / #F97316).

La opción **correcta debe ser inequívoca**; los distractores, plausibles pero claramente distintos.

---

## 1 · Gastronomía · L1 — Marranita
**Pregunta:** ¿Cuál de estas es una *marranita*?
**Opciones (✓ correcta):** **Marranita ✓** · Aborrajado · Empanada vallecaucana · Pandebono
**Explicación:** La marranita es una bola frita de plátano verde con chicharrón en el centro, típica del Valle.
**Briefs de imagen:**
- Marranita: bola frita dorada y crocante de plátano verde partida mostrando el chicharrón dentro.
- Aborrajado: tajada de plátano maduro rellena de queso, apanada y frita, dorada.
- Empanada vallecaucana: empanada de maíz frita, media luna dorada, con ají al lado.
- Pandebono: pan redondo dorado de almidón de yuca y queso, recién horneado.

## 2 · Gastronomía · L1 — Cholado
**Pregunta:** ¿Cuál de estos es un *cholado*?
**Opciones:** **Cholado ✓** · Lulada · Champús · Salpicón
**Explicación:** El cholado es hielo raspado con frutas troceadas, siropes de colores y leche condensada, un postre callejero de Cali.
**Briefs de imagen:**
- Cholado: vaso alto con hielo raspado, frutas troceadas, siropes de colores y leche condensada por encima.
- Lulada: vaso de bebida verdosa con trozos de lulo, fría, con hielo.
- Champús: vaso de bebida ámbar con maíz, trozos de fruta y canela.
- Salpicón: vaso con jugo rojizo y muchos trozos de frutas surtidas.

## 3 · Música y salsa · L2 — Marimba de chonta
**Pregunta:** ¿Cuál es la *marimba de chonta*?
**Opciones:** **Marimba de chonta ✓** · Guasá · Cununo · Bombo
**Explicación:** Instrumento de láminas de madera de chonta y resonadores, eje de la música del Pacífico sur.
**Briefs de imagen:**
- Marimba de chonta: instrumento de teclas de madera oscura con tubos resonadores debajo y dos baquetas.
- Guasá: tubo de guadua cerrado, relleno de semillas, que se sacude (idiófono).
- Cununo: tambor cónico de madera con parche de cuero, tocado con las manos.
- Bombo: tambor grande de doble parche con correa, tocado con baqueta.

## 4 · Cultura e identidad · L1 — Gato del Río
**Pregunta:** ¿Cuál es el monumento del *Gato del Río* en Cali?
**Opciones:** **Gato del Río ✓** · Cristo Rey · La Ermita · Monumento a Belalcázar
**Explicación:** Escultura de un gran gato (de Hernando Tejada) a orillas del río Cali, ícono de la ciudad.
**Briefs de imagen:**
- Gato del Río: escultura estilizada de un gato grande y macizo junto a un río, en un parque.
- Cristo Rey: estatua blanca de Cristo con los brazos abiertos sobre la cima de un cerro.
- La Ermita: iglesia neogótica azul y blanca con una torre-campanario y reloj.
- Monumento a Belalcázar: estatua ecuestre de un conquistador señalando el valle desde un mirador.

## 5 · Cultura e identidad · L2 — Cristo Rey
**Pregunta:** ¿Cuál de estos es la estatua de *Cristo Rey*?
**Opciones:** **Cristo Rey ✓** · Las Tres Cruces · El Gato del Río · Torre de Cali
**Explicación:** Estatua monumental de Cristo con los brazos extendidos sobre el cerro de los Cristales.
**Briefs de imagen:**
- Cristo Rey: estatua blanca de Cristo con brazos abiertos en la cima de una montaña sobre la ciudad.
- Las Tres Cruces: tres grandes cruces blancas alineadas en la cima de un cerro.
- El Gato del Río: escultura estilizada de un gato grande junto a un río.
- Torre de Cali: rascacielos alto y delgado, edificio moderno emblemático.

## 6 · Gastronomía · L1 — Chontaduro
**Pregunta:** ¿Cuál de estas es la fruta del *chontaduro*?
**Opciones:** **Chontaduro ✓** · Lulo · Borojó · Zapote
**Explicación:** Fruto naranja-amarillo de una palma del Pacífico; se come cocido, con sal y miel, en las calles de Cali.
**Briefs de imagen:**
- Chontaduro: fruto ovalado naranja-amarillo, cocido y partido mostrando pulpa amarilla, con sal y miel al lado.
- Lulo: fruta redonda anaranjada con cáscara vellosa, partida mostrando pulpa verde con semillas.
- Borojó: fruta redonda marrón oscura, pulpa densa, típica del Pacífico.
- Zapote: fruta ovalada de cáscara rugosa marrón y pulpa naranja fibrosa.

---

---

## Patrón eficiente: 1 imagen + opciones de TEXTO
Nuevo soporte del motor: cualquier pregunta puede tener una **imagen en el enunciado**
(`prompt_image_url`) con opciones de **texto**. Ventaja: **1 sola imagen por pregunta** (vs 4
del `image_choice`) y otra forma cognitiva ("nombrá lo que ves"). Se edita en el mismo editor,
campo **"Imagen del enunciado (opcional)"**. Ejemplos ya cargados como borrador (falta subir 1 imagen c/u):

- **Instrumento (Música y salsa, L2):** "¿Cómo se llama este instrumento del Pacífico?" →
  Marimba de chonta ✓ / Guasá / Cununo / Bombo. **Imagen:** marimba de chonta (teclas de madera + resonadores).
- **Postre (Gastronomía, L1):** "¿Cómo se llama este postre callejero de Cali?" →
  Cholado ✓ / Lulada / Champús / Salpicón. **Imagen:** cholado (vaso con hielo raspado, frutas y siropes).
- **Fruta (Gastronomía, L1):** "Este alimento se come cocido, con sal y miel… ¿cuál es?" →
  Chontaduro ✓ / Borojó / Lulo / Zapote. **Imagen:** chontaduro cocido y partido, pulpa amarilla.
- **Lugar (Cultura e identidad, L1):** "¿Qué monumento de Cali aparece en la imagen?" →
  Gato del Río ✓ / Cristo Rey / La Ermita / Las Tres Cruces. **Imagen:** escultura del Gato del Río junto al río.

> **Recomendación:** priorizar este patrón (1 imagen) para la mayoría; reservar el `image_choice`
> (4 imágenes) para cuando comparar visualmente ES la gracia de la pregunta.

---

## Flujo para completar
1. Generar las 4 imágenes de cada pregunta con la herramienta de imágenes (usar el estilo de arriba).
2. En admin → Juegos → Preguntas, filtrar **borrador / imagen**, abrir cada una.
3. Subir cada imagen en su opción (botón de subida → bucket `content`), marcar la correcta (ya viene marcada).
4. Revisar y publicar.
</content>
