# Bucket de contenido (`content`) — media editorial compartida

Bucket de Supabase Storage **público** y compartido para las imágenes (y a futuro audio)
que generan las tareas automatizadas de contenido, sin importar la herramienta:
la **rutina diaria de Claude Code** (`andanzas-pa-que-sepas-diario`) y las **tareas
programadas de Codex**.

- **Proyecto:** Andanzas GO V3 (`jacspnfiscrhxvorovri`)
- **Bucket:** `content` — público, límite 25 MB por archivo
- **Lectura:** pública (cualquiera puede ver el archivo por su URL pública).
- **Escritura:** solo `service_role` (omite RLS) o usuario **staff** autenticado
  (`is_staff()` = rol admin/editor). El anon key **no** puede escribir.

## Convención de rutas

```
content/
  stories/<slug-unico>.webp    # ilustraciones de "Pa' que sepás"
  <otras-carpetas-por-tarea>/  # cada tarea puede usar su propia carpeta
```

## URL pública

```
https://jacspnfiscrhxvorovri.supabase.co/storage/v1/object/public/content/<ruta>
```

Ejemplo: `.../public/content/stories/andres-caicedo-cali.webp`

## Cómo subir (tareas automatizadas)

Las tareas suben con la **service_role key** (nunca la incluyas en el repo, en el
prompt de una rutina, ni en el frontend). Debe estar disponible como variable de
entorno del entorno donde corre la tarea, p. ej. `SUPABASE_SERVICE_ROLE_KEY`.

Ejemplo con `@supabase/supabase-js` (Node):

```js
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const supabase = createClient(
  process.env.SUPABASE_URL,               // https://jacspnfiscrhxvorovri.supabase.co
  process.env.SUPABASE_SERVICE_ROLE_KEY,  // secreto — solo en el entorno
);

const path = `stories/${slug}.webp`;
const { error } = await supabase.storage
  .from('content')
  .upload(path, readFileSync(localWebpPath), { contentType: 'image/webp', upsert: false });
if (error) throw error;

const { data } = supabase.storage.from('content').getPublicUrl(path);
const imageUrl = data.publicUrl; // guardar en learn_entries.image_url
```

> Migración: `supabase/migrations/20260717_content_media_bucket.sql`
