# Plan de depuración técnica previo al lanzamiento

Este proceso es conservador: inventariar no significa eliminar. Ninguna tabla, función,
componente, migración o contenido se retira hasta demostrar que no tiene referencias,
datos necesarios, tráfico reciente ni responsabilidad vigente.

## Clasificación

- **Activo:** consumido actualmente por interfaz, servicios, tareas o funciones SQL.
- **Heredado compatible:** conserva datos o compatibilidad, aunque ya no es la vía principal.
- **Duplicado:** dos implementaciones cubren la misma responsabilidad.
- **Candidato a archivo:** sin referencias ni actividad, pero se conserva durante una ventana de observación.
- **Candidato a retiro:** verificado en código, base, métricas y despliegue; requiere respaldo y aprobación.

## Orden de revisión

1. Seguridad y funciones privilegiadas.
2. Tablas y políticas RLS.
3. Funciones, triggers y RPC expuestos.
4. Servicios y componentes sin referencias.
5. SQL históricos fuera de `supabase/migrations`.
6. Dependencias, recursos públicos y archivos duplicados.
7. Textos, configuraciones y reglas repetidas entre código y base de datos.

## Salvaguardas

- Registrar conteos y dependencias antes de cualquier cambio.
- Respaldar datos y definición del objeto.
- Primero revocar o desactivar; observar; luego archivar.
- No usar eliminaciones en cascada durante la depuración.
- Ejecutar compilación, pruebas RLS, asesores y recorridos funcionales.
- Mantener una migración reversible por cada retiro aprobado.

## Hallazgos iniciales

- `support_tickets` es heredada; la aplicación vigente usa `tickets`. Se conserva cerrada a nuevas inserciones.
- `award_points` permitía solicitar cantidades desde el cliente; debe quedar solo para composición interna.
- Existen archivos SQL históricos en la raíz además de las migraciones oficiales; deben clasificarse, no borrarse directamente.
- Perfil, rutas y `App.tsx` concentran responsabilidades y requieren división gradual.
- Varias reglas económicas ya tienen filas de configuración, pero algunas funciones aún conservan valores internos duplicados.
- El diccionario y la Palabra del día comparten datos, aunque sus reglas de acceso son diferentes.

## Criterio de cierre

La depuración termina cuando cada objeto tiene propietario funcional, consumidor conocido,
política de acceso, prueba mínima y una única fuente vigente de configuración.
