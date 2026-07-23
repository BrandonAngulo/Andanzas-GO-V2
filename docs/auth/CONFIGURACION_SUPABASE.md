# Configuración de autenticación de Andanzas GO

## Correo de confirmación

- Asunto: `Confirma tu cuenta en Andanzas GO`
- Plantilla: `supabase-confirmation-email.html`
- Remitente recomendado: `Andanzas GO <hola@andanzasgo.com>`

La plantilla usa `{{ .ConfirmationURL }}`, la variable oficial de Supabase para conservar el token de confirmación y la URL de retorno solicitada por la app.

## URL Configuration

- `Site URL`: dominio canónico de producción de Andanzas GO.
- `Redirect URLs`: agregar el dominio de producción seguido de `/auth/confirmed` y los dominios de vista previa que se vayan a probar.
- Para desarrollo local: `http://localhost:3000/auth/confirmed`.

## SMTP

El proveedor de correo incluido por Supabase es únicamente para pruebas y tiene un límite de envío muy bajo. Antes de invitar más usuarios se debe conectar un SMTP propio, verificar el dominio remitente y ajustar el límite de correos de autenticación a la capacidad acordada con el proveedor.
