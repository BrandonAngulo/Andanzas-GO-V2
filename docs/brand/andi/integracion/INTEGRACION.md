# ANDI — preparación e integración

## Estado de los activos

### Listos para uso estático provisional

- PNG frontal transparente en 1024, 512, 256 y 128 px.
- Personaje completo positivo y negativo en escala de grises, PNG transparente.
- Hojas conceptuales de expresiones, gestos, acciones y movimiento.

Estos archivos permiten prototipos, presentaciones, pantallas vacías, onboarding, mensajes, recompensas y pruebas de composición.

### Aún no listos como personaje animable de producción

Las hojas generadas son imágenes rasterizadas completas. No contienen:

- capas independientes;
- esqueleto o rig;
- vectores editables del personaje ilustrado;
- mallas 3D;
- estados del portal separados;
- posiciones de pivote;
- atlas de sprites consistente;
- animaciones exportadas.

Por eso pueden sumarse con facilidad como imágenes estáticas, pero no deben confundirse con un paquete de animación listo para el juego.

## Ruta recomendada

### Opción A — 2D rig, recomendada para la primera versión

Redibujar el ANDI aprobado en piezas vectoriales:

1. carcasa frontal;
2. carcasa posterior;
3. aro exterior del portal;
4. vidrio y corazón;
5. brújula y luces;
6. ojos, párpados, cejas y boca;
7. brazo y mano izquierdos;
8. brazo y mano derechos;
9. pierna y tenis izquierdos;
10. pierna y tenis derechos;
11. sombras y brillos.

Después se anima con un rig 2D y se exporta a un formato compatible con la tecnología de la app. Esta ruta conserva el aspecto actual, reduce peso y permite reutilizar expresiones y gestos.

### Opción B — sprites prerenderizados

Modelar o animar a ANDI y exportar secuencias WebP/PNG o atlas. Es más fácil de reproducir en interfaces, pero cada gesto aumenta el peso y resulta menos flexible ante cambios de color, escala o vestuario.

### Opción C — 3D en tiempo real

Construir malla, materiales, rig y animaciones. Aporta máxima libertad de cámara, pero aumenta costo, complejidad, consumo de batería y requisitos de integración. No es necesaria para validar el personaje.

## Recomendación

Usar **2D rig** como activo principal y conservar un modelo 3D únicamente como fuente de poses, iluminación o piezas promocionales si el proyecto lo requiere más adelante.

## Estructura sugerida

```text
assets/andi/
  static/
    andi-neutral-1024.png
    andi-neutral-512.png
    andi-neutral-256.png
    andi-neutral-128.png
  grayscale/
    andi-positive-grayscale.png
    andi-negative-grayscale.png
  rig/
    body-front.svg
    body-back.svg
    portal-rim.svg
    portal-glass.svg
    compass.svg
    face/
    hands/
    shoes/
  animations/
    idle
    wave
    think
    celebrate
    error
    walk
```

## Presupuesto inicial de animaciones

Prioridad 1:

- idle;
- saludo;
- pensar;
- acierto o celebración;
- error amable;
- caminar.

Prioridad 2:

- señalar;
- explicar;
- extraer lupa;
- consultar portal;
- correr;
- llegada.

## Rendimiento y accesibilidad

- Evitar usar PNG de 1024 px cuando 256 o 512 px sean suficientes.
- Cargar animaciones bajo demanda.
- Mantener una pose estática equivalente para movimiento reducido.
- No depender solo del cambio de color o del portal para comunicar estados.
- Probar lectura a 32, 48, 64, 128 y 256 px.
- Comprimir imágenes sin destruir el canal alfa ni los contornos.

## Decisión pendiente para integración real

Este directorio no contiene actualmente el código de la app o del juego. Para integrar los activos será necesario trabajar en el repositorio de Andanzas GO y confirmar:

- framework y plataforma;
- sistema actual de assets;
- motor o librería de animación;
- tamaños de destino;
- soporte para SVG, WebP, Lottie, Rive, Spine u otro formato;
- presupuesto de descarga y memoria;
- temas claro y oscuro.

## Disponibilidad en la aplicación

Guardar un archivo en este paquete no lo publica ni lo registra automáticamente en Andanzas GO. El proceso real requiere:

1. copiar los activos aprobados al directorio de recursos del repositorio de la app;
2. registrar o importar cada archivo según el framework;
3. crear el componente de ANDI o actualizar el existente;
4. asignar cada pose a un estado de interfaz;
5. comprobar tamaño, transparencia y tema;
6. compilar, probar y desplegar una nueva versión.

Hasta completar estos pasos, los archivos están disponibles para diseño y desarrollo local, pero no para los usuarios de la aplicación.
