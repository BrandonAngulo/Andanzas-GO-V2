# TRIVIA GO V3 — Auditoría de avance del plan maestro

**Fecha:** 4 de agosto de 2026

**Método:** contraste de plan, código, migraciones y estado agregado de Supabase.

## Ruta dinámica y enfoque en la parada actual

El mapa de Aventura deja de depender de textos, candados y botones ubicados sobre coordenadas fijas de una ilustración. La escena sigue aportando identidad y atmósfera, pero la navegación pasa a una ruta vertical compuesta por elementos de interfaz independientes:

- al abrir el mapa o volver de una partida, la vista se enfoca automáticamente en la parada actual;
- las paradas completadas permanecen arriba y se pueden repetir; las siguientes aparecen abajo y explican cómo se desbloquean;
- cada parada conserva título, estado, mejor resultado y acción legibles sin depender de la perspectiva del fondo;
- una cabecera compacta y fija mantiene visibles la campaña, la parada actual y el progreso esencial;
- una acción inferior permite regresar a la parada actual o comenzar a jugar sin recorrer de nuevo toda la pantalla;
- el nivel final se presenta como un hito especial con el personaje misterioso, sin revelar su identidad antes de obtenerlo;
- el acceso a una campaña posterior es una tarjeta de transición independiente y solo se activa cuando la lógica real lo permite.
- el fondo `aventura-sabores-cali-scroll-background-v5.webp` reemplaza el mapa ilustrado con posiciones fijas: conserva cielo, Farallones, ciudad, río, caña, cacao, barrios y mercado en los bordes, mientras mantiene el centro libre de caminos, podios, puertas, textos y marcadores;
- cada tarjeta usa un recorte diferente de la misma escena para conservar la sensación de viaje sin convertir la ilustración en la fuente de navegación.

Este patrón permite agregar, reordenar o administrar capítulos y niveles sin volver a generar una ilustración con coordenadas nuevas. Los premios adicionales por parada quedan pendientes de una definición operativa real; la interfaz no simula monedas, cofres ni recompensas que todavía no existan en la lógica del juego.

## Recursos de Aventura y separación entre Clásica y Mundo

La cabecera persistente de Aventura incorpora información real del jugador sin crear recursos exclusivos artificiales:

- nivel y XP general de Andanzas;
- monedas, gemas y vidas de la billetera compartida de TRIVIA GO;
- explicación contextual de que Aventura consulta ese saldo, pero no lo descuenta al recorrer la campaña;
- paradas completadas y aciertos distintos como progreso específico de esta modalidad.

La revisión inicial del banco confirmó que **Partida clásica** y `world_general` no consultaban exactamente lo mismo: Clásica usa todo el banco publicado, mientras `world_general` es un ámbito editorial global. La redundancia estaba en la experiencia de producto, porque “Mundo” se ofrecía como una partida adicional de cultura general.

Desde este ajuste:

- **Clásica** es la única modalidad de mezcla general: combina el banco publicado completo sin elegir destino;
- **Mundo** es la raíz del selector de Jugar por lugar y no inicia una ronda;
- Colombia, Valle del Cauca y Cali son los destinos actualmente jugables y cada uno conserva su propio filtro e historial;
- `world_general` pasa a identificarse en gestión como `Contenido global (Clásica)`: sus preguntas se conservan y continúan disponibles en Clásica hasta que una futura taxonomía territorial las distribuya entre continentes, países u otros destinos;
- si un territorio no tiene preguntas elegibles, el motor ya no sustituye silenciosamente su pool por el banco general. La ausencia de contenido se informa en vez de convertir la partida territorial en una Clásica encubierta.

Esta jerarquía permite que Mundo evolucione posteriormente hacia una capa cartográfica o un árbol territorial sin cambiar la identidad de Partida clásica.

## Estado general

La lógica de soporte avanzó de forma importante, pero la capa visual pública todavía no comenzó. El proyecto está preparado para construirla sin rehacer el motor.

| Frente | Estado | Evidencia |
|---|---|---|
| Auditoría y cobertura | Completo | bloques Fase 0 y revisión del lote 300 |
| Elegibilidad por modo | Completo | regla, overrides, vista, motor y gestión por pregunta |
| Imágenes en preguntas | Parcial | renderer, subida y edición; 6 `image_choice` en borrador, 0 publicados y 0 imágenes cargadas |
| Aventura: esquema | Completo | capítulos, niveles, asignaciones, personajes y progreso |
| Aventura: servidor | Completo | mapa, inicio, calificación, correctas únicas y desbloqueo |
| Piloto Sabores de Cali | Parcial | capítulo draft, 10 niveles, 5 asignaciones, Andi y Pandebono |
| Gestión de Aventura | Implementado en este bloque | editor integrado en `JuegoForm` |
| Experiencia pública Aventura | Completo en primera versión | selector, mapa ilustrado, intro, sesión, resultado y recompensa |
| Plaza visual V3 | En progreso | selector rediseñado, accesos prioritarios, módulos compactos y antesalas por modo |
| Colección de amigos | Pendiente | existe `user_characters`, falta UI y equipamiento |
| Portada nueva | Preparada, no publicada | asset local candidato; gestión de portada existente |
| Banco Sabores de Cali | Pendiente | meta vigente 200: 150 generales + 50 visuales |

## Avance estimado por naturaleza

- Fundaciones y lógica de servidor: **75–80 %**.
- Gestión editorial necesaria para el piloto: **45–50 %**.
- Experiencia visual pública V3: **10–15 %**.
- Contenido del capítulo frente a meta 200: **menos de 30 % publicado**.
- Plan completo hasta piloto visible y operable: **aproximadamente 40 %**.

Los porcentajes son una estimación de alcance, no avance de calendario.

## Cambio realizado en este bloque

Se añadió un editor de Aventura dentro de:

```text
Administración → Juegos → editar TRIVIA GO → Aventura
```

Permite:

- editar capítulo, descripción, portada y estado;
- elegir personaje recompensa;
- administrar umbrales de desbloqueo;
- editar título, propósito y narrativa de los 10 niveles;
- buscar y filtrar preguntas publicadas;
- asignarlas o retirarlas de cada nivel;
- ver cobertura por nivel contra 20 y total contra 200.

No crea una aplicación administrativa separada.

## Claridad sobre las 50 preguntas visuales

- Son adicionales a las 150 preguntas generales: meta total 200.
- Mínimo 5 por nivel narrativo.
- Distribución inicial: 35 con imagen en el enunciado y opciones textuales; 15 `image_choice`.
- Deben aparecer también en Reto, Práctica, Aventura, Duelo y, cuando el formato/tiempo lo permita, Contrarreloj y Pregunta del día.
- Las imágenes se generan siguiendo la línea visual de Andanzas GO y se almacenan en el bucket multimedia.
- El panel ya permite subir imágenes del enunciado y de opciones; faltan metadatos accesibles, control de estilo/lote y vista de cobertura visual agregada.

## Siguiente incremento recomendado

Construir la experiencia pública mínima de Aventura:

1. servicio cliente para `get_chapter_map`, `start_chapter_level` y `submit_chapter_level`;
2. entrada Aventura en la Plaza/selector existente;
3. mapa visual de diez niveles;
4. intro de nivel;
5. sesión con las cinco preguntas devueltas por el servidor;
6. resultado y celebración de Pandebono.

El capítulo debe permanecer en borrador mientras solo tenga cinco preguntas asignadas.

## Incremento ejecutado: experiencia pública mínima de Aventura

Se implementaron los seis puntos anteriores dentro de Andanzas GO:

- cliente para las tres RPC de mapa, partida y calificación;
- entrada **Aventura** en el selector actual de TRIVIA GO;
- mapa visual de diez niveles con estados y progreso;
- contexto narrativo del nivel integrado en el recorrido;
- sesión compatible con preguntas textuales y visuales;
- resultado persistido y celebración del personaje desbloqueado.

El equipo gestor puede previsualizar el capítulo en borrador gracias al control de acceso existente. Para el público, Aventura solo aparece con contenido publicado; si aún no existe, se muestra un estado de preparación. La ilustración definitiva de Andi recostado en el signo de pregunta sigue siendo un activo pendiente y administrable desde la portada configurada del juego.

## Evolución visual e introducción narrativa de niveles

La experiencia pública de Aventura ya cuenta con una primera dirección visual funcional:

- escenario ilustrado continuo con cielo, territorios y once plataformas;
- diez niveles interactivos alineados sobre el arte y una meta final para el personaje;
- HUD integrado con progreso de niveles, correctas únicas y desbloqueo;
- pose específica de Andi como guía de expedición;
- diseño responsive y aislamiento de la experiencia sobre la navegación general;
- pantalla de introducción antes de cada nivel.

La introducción consume `title`, `narrative`, `purpose` y `questions_per_run` de cada nivel. Estos textos se administran desde **Administración → Juegos → TRIVIA GO → Aventura**, por lo que no requieren cambios de código.

## Flujo visual completo de partida y cierre

Se completaron dos incrementos adicionales del jugador:

1. **Partida Aventura:** HUD de nivel y pregunta, progreso visible, composición responsive con y sin imagen, identidad del capítulo y revisión conjunta al terminar.
2. **Resultado y recompensa:** puntaje contextual, progreso independiente de niveles y correctas únicas, siguiente objetivo calculado y celebración especial al desbloquear el personaje.

Con esto existe una primera experiencia visual continua desde el selector de modos hasta el regreso al mapa. Continúan pendientes el contenido suficiente para publicar el piloto, la colección/equipamiento de amigos y la renovación completa de la Plaza de juego.

## Primer incremento de Plaza visual V3

Se compactaron los módulos secundarios para reducir el desplazamiento y se añadieron accesos funcionales prioritarios:

- Pregunta del día en formato compacto;
- metas semanales densas, sin perder progreso, monedas ni reclamo;
- **Continuar Aventura** abre directamente el mapa principal;
- **Jugar por lugar** abre directamente el selector de territorios;
- menor altura, padding y separación en escritorio y móvil.

La Plaza visual aún requiere una segunda iteración para incorporar resumen compacto de economía/racha y acceso a la futura colección de amigos.

## Antesalas de modo: primer piloto territorial

Se creó una base reutilizable de antesala y se implementó **Jugar por lugar** como primer piloto:

- entrada desde la Plaza y desde el selector de modos;
- jerarquía narrativa Mundo → Colombia → Valle del Cauca → Cali según disponibilidad;
- selección de territorio antes de iniciar;
- descripción e identidad visual por escala;
- conteo real de preguntas publicadas por territorio;
- resumen de reglas y aclaración sobre recursos aplicables;
- inicio de la partida con el tema territorial seleccionado.

No se muestran todavía precisión, récord o progreso por territorio porque el modelo actual no los persiste por `theme`. Ese contrato deberá implementarse antes de presentar estadísticas territoriales para evitar datos simulados. La base `ModeLobbyShell` queda disponible para Contrarreloj, Duelo y Partida clásica.

## Antesala Contrarreloj

Contrarreloj ya utiliza la base compartida de antesalas:

- explicación previa del ritmo y la condición de derrota;
- resumen de 2 minutos, 15 preguntas y un error;
- consejo contextual;
- presentación de la regla semanal activa, traducida a su efecto concreto en la ronda;
- estado comprensible cuando se juega con las reglas normales, sin lenguaje interno de configuración;
- fichas visuales conectadas al saldo real de monedas, gemas y vidas, con icono y ayuda emergente accesible por toque, foco o cursor;
- explicación de cómo se obtiene y usa cada recurso existente antes de comenzar;
- inicio explícito de la sesión después de revisar las reglas.

La interfaz pública evita desde este incremento expresiones operativas como `consumible no configurado`, `modificador` o `banco publicado`. Contrarreloj consulta la economía existente mediante `get_my_economy_summary`: muestra los saldos reales y aclara que iniciar la ronda no descuenta monedas, gemas ni vidas. Los premios siguen siendo concedidos por `award_game_rewards`; no se crearon recursos ficticios ni una economía paralela.

El historial actual de `game_sessions` no persiste `mode` ni `theme`. Por ello no se presenta todavía un récord personal exclusivo de Contrarreloj. La persistencia de dimensión de modo/tema queda como contrato de datos pendiente antes de construir estadísticas por modalidad.

## Antesala Duelo

Duelo ya se abre desde una antesala propia antes de crear la partida:

- explica el recorrido real: jugar, compartir, recibir al rival y consultar el resultado;
- presenta las reglas congeladas por el servidor: diez preguntas, tres minutos totales y veinticinco segundos por pregunta;
- explica el desempate real por aciertos, puntaje y menor tiempo;
- consulta `game_challenges` para mostrar duelos finalizados, victorias, empates, retos en espera y mejor puntaje del usuario;
- permite volver a copiar el enlace del reto pendiente más reciente;
- aclara que la implementación actual no descuenta monedas, gemas ni vidas y, por tanto, no muestra consumibles inexistentes.

La acción **Crear mi duelo** conserva el flujo autoritativo existente: `create_duel` congela preguntas y reglas antes de abrir `DuelSession`. No se otorgaron premios de economía porque el contrato actual de Duelo aún no llama a `award_game_rewards`; incorporarlos exigirá primero una regla de recompensa e idempotencia específica para duelos.

## Ajuste territorial y partida Duelo

**Jugar por lugar** recibió una segunda iteración para reducir desplazamiento en escritorio y móvil:

- cabecera, tarjetas y panel seleccionado más compactos;
- grilla de dos columnas cuando el ancho lo permite;
- identidad circular coherente y contrastada por escala: globo para Mundo, bandera para Colombia, caña de azúcar para Valle del Cauca y salsa para Cali;
- el símbolo elegido se conserva entre la tarjeta y el detalle del recorrido;
- los únicos recursos mencionados son monedas, gemas y vidas reales; la pantalla aclara que esta modalidad no los consume y no simula pistas inexistentes.

**Duelo** se corrigió también dentro de la partida, no solo en la antesala:

- barra propia por encima de la navegación general, con volver y cerrar siempre visibles y respeto por el área segura del dispositivo;
- temporizador total y temporizador por pregunta compactos;
- agotar el tiempo de una pregunta finaliza la ronda como pérdida, en lugar de avanzar automáticamente;
- salir como rival registra abandono y resuelve el duelo a favor del contrincante;
- el servidor persiste la ronda no completada y la usa antes de puntaje o tiempo para resolver ganador;
- los RPC de Duelo ya no admiten ejecución anónima; solo usuarios autenticados pueden crear, consultar, cancelar o enviar una ronda.

Migraciones aplicadas: `20260806010452_duel_timeout_forfeit.sql` y `20260806012535_duel_rpc_security.sql`.

## Próximos pasos vigentes

1. ✅ Persistir `mode` y `theme` en sesiones para habilitar récords reales por modalidad y territorio.
2. ✅ Construir la antesala de Partida clásica con reglas, historial y economía existente.
3. Completar colección/equipamiento de amigos de Andi y la gestión operativa correspondiente.
4. Completar y publicar el banco de 150 preguntas generales + 50 visuales para el piloto de Sabores de Cali.

## Corrección de ámbitos y lotes editoriales

Se corrigió una mezcla conceptual que hacía aparecer `expansion_300_2026` como una quinta escala territorial. Desde este ajuste:

- `campaign` representa únicamente una colección o ámbito jugable registrado;
- `content_batch` conserva la procedencia operativa de una importación o expansión;
- un lote editorial no genera automáticamente una tarjeta para el jugador;
- las 300 preguntas de `expansion_300_2026`, cuyo contenido fue producido y auditado sobre Cali, conservan ese identificador en `content_batch` y pasan a `campaign = city_cali`;
- las 227 publicadas del lote alimentan el recorrido de Cali y continúan entrando al banco general sin filtro;
- el panel de preguntas permite editar y filtrar por ámbito y por lote como dimensiones independientes.

Migración aplicada: `20260806014356_separate_question_batch_from_playable_scope.sql`.

## Sesiones por modalidad y antesala de Partida clásica

Las sesiones normales de TRIVIA GO ahora persisten dos dimensiones independientes:

- `mode_key`: modalidad pública (`clasica`, `contrarreloj`, `lugar`, `vocabulario`, `historia` o `reto`);
- `theme_key`: territorio o tema aplicado al compositor, cuando corresponde.

Las sesiones históricas permanecen como `reto` porque no existe evidencia suficiente para reconstruir su modalidad original. Desde esta actualización:

- Partida clásica usa todo el banco publicado y guarda `mode_key = clasica`, sin tema;
- Contrarreloj usa todo su pool elegible y guarda `mode_key = contrarreloj`;
- Jugar por lugar guarda `mode_key = lugar` y el territorio seleccionado en `theme_key`;
- Vocabulario guarda su identidad propia;
- el usuario puede consultar partidas completadas, mejor puntaje, precisión y racha por modalidad o territorio;
- el panel de analítica obtiene distribución, finalizaciones, precisión y mejor puntaje desde `game_sessions`, no desde una inferencia de eventos.

Se añadió una antesala compacta para **Partida clásica** con reglas, tamaño real del banco, historial específico, economía existente y comienzo explícito. Contrarreloj y Jugar por lugar también muestran desde ahora sus historiales separados.

Migración aplicada: `20260806020700_game_session_mode_dimensions.sql`.

## Próximos incrementos después de sesiones por modalidad

1. ✅ Diseñar la antesala de Vocabulario caleño y ordenar su progresión propia.
2. Diseñar la colección/equipamiento de Amigos de Andi y su gestión administrativa.
3. Completar contenido general y visual del piloto Sabores de Cali.
4. Ampliar la analítica con evolución temporal y retención por modalidad cuando exista volumen suficiente.

## Antesala y progresión de Vocabulario caleño

Vocabulario caleño ya tiene una antesala propia conectada al contenido y al progreso existentes:

- consulta el banco publicado del ámbito `vocabulario` y presenta su cantidad real;
- separa visualmente los retos de significado directo, elección inversa y verdadero/falso;
- mantiene la dificultad técnica D1–D5 dentro del selector adaptativo, sin exponerla como capítulos, escalas o información operativa al jugador;
- recupera el progreso real de `user_category_progress` para la categoría `Vocabulario`: nivel 1–10, XP, intentos, aciertos y dominio reciente;
- recupera el historial específico desde `game_sessions` con `mode_key = vocabulario` y `theme_key = vocabulario`;
- muestra monedas, gemas y vidas de la economía general, aclarando que comenzar no consume estos recursos;
- inicia la partida con el filtro temático y la identidad de sesión correctos.

No se creó una tabla paralela ni una progresión simulada. El avance sigue siendo actualizado por el disparador adaptativo existente al registrar respuestas. Las preguntas se gestionan desde el editor actual mediante categoría, ámbito, estado, dificultad y formato; por tanto, publicar o archivar contenido cambia automáticamente lo que la antesala cuenta y lo que el jugador puede recibir.

## Claridad pública de Vocabulario y guía del mapa de Aventura

La antesala de Vocabulario fue depurada para separar la experiencia pública de la operación editorial:

- se retiraron `banco activo`, `preguntas publicadas`, D1–D5, `grados técnicos` y la etiqueta `recursos reales`;
- el total de retos permanece porque comunica variedad al jugador;
- la selección adaptativa se explica mediante beneficios comprensibles: cada ronda cambia, se aprende al responder y se puede practicar de nuevo;
- precisión y dominio se traducen como `tus aciertos` y `avance reciente`.

El mapa principal de Aventura incorpora ahora una guía conectada al progreso real de `get_chapter_map`:

- siguiente parada disponible, cantidad de retos y ausencia de reloj;
- paradas recorridas y mejor resultado;
- avance visual hacia las 10 paradas y las 30 respuestas distintas correctas requeridas;
- Pandebono de Cali como recompensa especial del capítulo;
- aclaración de que Aventura no consume monedas, gemas ni vidas;
- reglas desplegables en tres pasos dentro del escenario, sin columna lateral;
- los nodos bloqueados ya no muestran cantidades asignadas ni récord cero: comunican la acción necesaria para avanzar.

No fue necesario cambiar el esquema ni crear nuevas recompensas. La configuración operativa continúa en el panel de Aventura y el jugador recibe únicamente el resultado de esas reglas.

## Integración del progreso en el escenario de Aventura

La información de Aventura dejó de presentarse como un tablero externo al mapa. La interfaz actual concentra en el cielo de la ilustración la siguiente parada, las paradas completadas, los aciertos únicos y el premio real de campaña. Las instrucciones permanecen opcionales y se abren de forma contextual sobre el escenario.

- antes del desbloqueo, el premio se representa como un personaje misterioso y no revela nombre, ilustración ni ficha; la identidad de Pandebono aparece únicamente al obtenerlo;
- el nivel 10 tiene tratamiento de final de campaña mediante mayor escala, brillo, trofeo y etiqueta de recompensa;
- no se inventaron premios por nivel: completar una parada abre el siguiente tramo y permite mejorar el resultado;
- el fondo del recorrido se volvió a ilustrar desde cero como una sola escena: camino, diez podios, plaza final, muro y puerta comparten perspectiva, luz, materiales y arquitectura;
- los podios tienen centros amplios y coordenadas recalibradas para números, estados y candados; el nivel 10 usa una base mayor dentro de la propia pintura;
- la puerta ya no es un recurso superpuesto: el control interactivo es una zona transparente sobre el portón pintado dentro del muro;
- la puerta solo permite avanzar cuando la campaña actual está completada y existe otro capítulo visible para el usuario;
- si todavía no existe una campaña posterior, comunica `Nueva aventura · próximamente` y no simula navegación;
- el arte de Pandebono y el nuevo mapa `aventura-sabores-cali-game-map-v4.webp` se guardan como recursos versionados del proyecto; la identidad del personaje continúa admitiendo una URL administrada.

## Banco progresivo y catálogo administrable

La ampliación `world_v2_2026` incorporó 600 preguntas publicadas al ámbito `world_general`. El banco global quedó con 750 preguntas y TRIVIA GO con 1.751 preguntas publicadas. La carga cubre los cinco niveles y combina opción múltiple, selección múltiple, ordenamiento y relación de elementos.

La solución ya no interpreta una lista fija de territorios o categorías desde los componentes. Se añadieron catálogos administrables y reglas de crecimiento:

- `game_question_scopes` define cada ámbito, su tipo, jerarquía, orden, icono, visibilidad y disponibilidad como recorrido;
- `game_question_categories` registra las categorías canónicas y `game_question_category_aliases` normaliza variantes editoriales;
- el editor permite crear ámbitos, activar recorridos y seleccionar categorías sin modificar componentes;
- un ámbito nuevo encontrado durante una importación se registra como **interno e inactivo**: conserva el contenido sin publicar accidentalmente una experiencia incompleta;
- al activarlo como jugable desde gestión, aparece automáticamente en Jugar por lugar y en los selectores que correspondan;
- `content_batch` sigue siendo trazabilidad operativa y nunca crea por sí solo una modalidad, territorio o tarjeta pública;
- la elegibilidad de cada modalidad continúa resolviéndose mediante `fn_mode_default_eligible`, más las excepciones administradas en `game_mode_eligibility`;
- un índice de texto normalizado evita duplicados exactos entre preguntas no archivadas, incluso en cargas futuras;
- la analítica obtiene los nombres de ámbitos desde el catálogo y no desde constantes del cliente.

### Regla para las próximas importaciones

Cada pregunta debe indicar `campaign` como ámbito editorial, `category` como categoría canónica o alias conocido, `content_batch` como identificador de la entrega y `status = published` únicamente cuando esté aprobada. El disparador de catálogo registra dimensiones nuevas y la función de composición vuelve a calcular los pools sin requerir cambios de código. Aventura permanece fuera del pool general porque recibe preguntas por asignación explícita de capítulo.

La migración base es `20260807000856_progressive_question_bank.sql`. El lote de 600 preguntas se aplicó en doce migraciones idempotentes `20260807001200`–`20260807001402` para evitar transferencias parciales y permitir auditoría por bloques.

## Cabecera integrada del recorrido de Aventura

La franja rígida que quedaba fuera del escenario fue sustituida por un HUD flotante y compacto dentro del lenguaje visual del mapa. La cabecera agrupa campaña, parada actual, progreso, recursos y ayuda en una sola cápsula translúcida; reduce información en móvil sin ocultar el detalle accesible y conserva el avance como una línea integrada. Así la navegación sigue siendo legible sin competir con la ilustración ni crear una segunda interfaz encima del juego.
