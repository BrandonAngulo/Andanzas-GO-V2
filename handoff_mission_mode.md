# Handoff: Sistema de Rutas y Gamificación (Modo Misión)

¡Hola! He completado la refactorización mayor del sistema de rutas. Ahora las rutas se comportan como "Misiones" gamificadas, mucho más atractivas e intuitivas.

## 🚀 Cambios Implementados

### 1. Nuevo "Modo Misión" (`GuidedRouteModal.tsx`)
Transformé el modal aburrido de antes en una experiencia inmersiva con 4 fases:
- **Briefing (Informe):** Pantalla de inicio estilo videojuego con resumen, tiempo y desafíos.
- **Navegación:** Te guía al siguiente punto visualmente. Puedes "minimizar" esta pantalla.
- **Desafío:**
    - **Trivia:** Preguntas de opción múltiple con feedback visual inmediato (rojo/verde).
    - **Check-in GPS:** Nuevo desafío que simula verificar tu ubicación (animación de radar).
- **Victoria:** Pantalla de recompensa al completar un punto.

### 2. Banner de Ruta Activa (`ActiveRouteBanner.tsx`)
- Ahora, si cierras el modal de la ruta, **no se cancela**.
- Aparece una tarjeta flotante en la parte inferior ("Ruta Activa") que te permite seguir navegando por el mapa y "Abrir" la misión de nuevo cuando llegues al lugar.

### 3. Migración de Datos
- Actualicé `types.ts` para soportar los nuevos tipos de desafío (`TRIVIA`, `CHECKIN`).
- Migré automáticamente todas tus rutas existentes en `routes_data.json` al nuevo formato.
    - Las preguntas viejas ahora son desafíos de Trivia.
    - Los puntos sin preguntas ahora tienen desafíos de "Llegada al Sitio" (Check-in) por defecto.

### 4. Internacionalización
- Todo el texto nuevo está traducido en `es.ts` y `en.ts` bajo la clave `mission`.

## 🧪 Cómo Probar (Validación Manual)

Como acordamos, realizarás la prueba manual. Sigue estos pasos:

1.  **Inicia Sesión:** Entra con tu usuario (para que funcionen los puntos y medallas).
2.  **Ve a Rutas:** Abre el panel de Rutas y selecciona "Ruta de la Salsa" (o cualquiera).
3.  **Iniciar Misión:**
    - Verás la nueva pantalla de "Informe de Misión". Dale a "INICIAR MISIÓN".
4.  **Minimizar:**
    - Cierra el modal con la **X** arriba a la derecha.
    - **Verifica:** Debe aparecer el banner pequeño abajo ("Ruta Activa").
5.  **Reanudar:**
    - Dale a "Abrir" o click al banner. El modal debe volver.
6.  **Completar Punto:**
    - Dale a "Ya estoy aquí" -> Realiza el desafío (Trivia o Check-in).
    - Verás la pantalla de "¡Completado!".
    - Dale a "Siguiente Punto".

## ⚠️ Notas
- He revertido el cambio temporal que permitía probar sin login. **El login es necesario** para ganar puntos.
- La verificación de GPS es una *simulación* visual por ahora (espera 2 segundos y valida). En el futuro, conectaremos esto con la API real de geolocalización del navegador si lo deseas.

¡Disfruta del nuevo sistema! Cualquier ajuste visual o de texto es fácil de hacer en los archivos de traducción o componentes.
