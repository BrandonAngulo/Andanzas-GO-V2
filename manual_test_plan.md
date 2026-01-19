# Plan de Pruebas Manuales: Integración de Feedback de Auditoría

Como el inicio de sesión automático no es posible, he preparado esta guía para que puedas verificar las nuevas funcionalidades "Narrativa Inmersiva" y "Validación Híbrida" manualmente.

## 1. Narrativa de Misión (Intro Story)
**Objetivo:** Verificar que la historia introductoria aparece con el efecto de "máquina de escribir".

1.  Abre la aplicación (`localhost:3000`).
2.  Inicia sesión con tu cuenta (si es necesario).
3.  En el mapa, selecciona el marcador de la **"Ruta de la Salsa y el Sabor"** o **"Ruta Histórica"**.
4.  Haz clic en el botón **"Iniciar Ruta"** (o el icono de "Play").
5.  **Verificación:**
    *   Deberías ver la pantalla de "Briefing" (fondo oscuro).
    *   Observa el texto verde tipo consola que aparece letra por letra: *"Agente, tu misión es infiltrarte..."* (Ruta Salsa) o *"Bienvenido, viajero del tiempo..."* (Ruta Histórica).
    *   Verifica que el resto de datos (tiempo, desafíos) se muestran correctamente debajo.
    *   **NUEVO (Modo Inmersivo):** Observa que la barra superior de búsqueda y filtros ha desaparecido para dar foco total a la misión.

## 2. Validación Híbrida (Check-in GPS + Manual)
**Objetivo:** Verificar que el usuario puede validar su visita manualmente si el GPS falla, respondiendo una pregunta del lugar.

1.  Una vez en la pantalla de "Briefing" de la **"Ruta de la Salsa"**, haz clic en **"Comenzar Misión"**.
2.  Verás la pantalla de navegación hacia el primer punto (Museo de la Salsa).
3.  Simula que has llegado haciendo clic en **"Validar GPS" / "Estoy Aquí"**.
    *   *Nota:* Aparecerá la animación de radar buscando ubicación.
4.  **Verificación - Paso Clave:**
    *   Busca el enlace de texto debajo del botón que dice: **"¿Problemas con el GPS? Validar manualmente"**.
    *   Haz clic en él.
5.  **Modo Manual:**
    *   Debería aparecer un cuadro naranja indicando "Modo Manual".
    *   **Pregunta:** *"Mirando hacia la entrada principal, ¿De qué color es el letrero?"*
    *   **Opciones:** Rojo, Azul, Amarillo.
6.  **Prueba de Error:** Selecciona "Azul". Debería marcarse en rojo como incorrecta.
7.  **Prueba de Éxito:** Selecciona **"Rojo"** y luego **"Confirmar Respuesta"**.
8.  Deberías ver la pantalla de "Misión Cumplida" con los puntos otorgados.

## 3. Estado del Código
Los siguientes archivos han sido modificados y están listos en tu entorno local:

*   `types.ts`: Añadido soporte para `intro_story`, `ChallengeType: PHOTO` y datos de trivia manual.
*   `services/routes.service.ts`: Mapeo de los nuevos campos desde la base de datos (simulada/local).
*   `routes_data.json`: Datos actualizados para Ruta 1 y Ruta 2 con historias y preguntas de validación.
*   `components/views/GuidedRouteModal.tsx`:
    *   Implementado componente `Typewriter` para el texto.
    *   Lógica para `showManualCheckin`.
    *   Renderizado condicional del formulario de trivia manual dentro del desafío de Check-in.

---
**Nota:** La funcionalidad de "Foto Evidencia" está preparada a nivel de datos (`type: 'PHOTO'`), pero la interfaz de usuario para subir la foto se implementará en la siguiente iteración para no sobrecargar esta entrega.
