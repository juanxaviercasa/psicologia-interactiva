# Configuración de CORS en Cloudflare R2 para Audios

Para que los audios de los libros interactivos se reproduzcan correctamente sin bloqueos de seguridad del navegador (errores 403 o bloqueos de CORS), necesitamos configurar las reglas de origen cruzado en tu bucket de R2.

> [!IMPORTANT]
> Esta configuración es crucial para permitir que los navegadores "adelanten" o "retrocedan" el audio (seeking) correctamente.

## Pasos a seguir en el Dashboard de Cloudflare:

1. Inicia sesión en tu panel de **Cloudflare**.
2. En el menú de la izquierda, ve a **R2** y entra a la sección de **Overview** (Resumen).
3. Haz clic en el **nombre del bucket** donde tienes guardados los audios de los libros.
4. Una vez dentro del bucket, ve a la pestaña **Settings** (Configuración).
5. Baja hasta encontrar la sección **CORS Policy** (Política CORS) y haz clic en el botón **Add CORS policy** (Añadir política) o **Edit** si ya tienes una.
6. Se abrirá un editor de código JSON. Borra lo que haya y pega exactamente esta configuración:

```json
[
  {
    "AllowedOrigins": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD",
      "OPTIONS"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "Content-Length",
      "Content-Range",
      "Accept-Ranges"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

7. Haz clic en **Save** (Guardar).

> [!TIP]
> Si prefieres mayor seguridad y ya sabes cuál será el dominio final donde se alojará tu web (ejemplo: `https://midominio.com`), puedes cambiar el `"*"` en `AllowedOrigins` por tu dominio exacto. Si lo dejas como `"*"` funcionará desde cualquier lugar, incluyendo tu entorno local (`localhost`).

---

**Nota Técnica:** Hemos expuesto los encabezados `Content-Range` y `Accept-Ranges`. Esto permite a los navegadores solicitar "trozos" específicos del archivo de audio, lo cual es obligatorio para que el usuario pueda saltar a diferentes minutos del audio sin que se rompa la reproducción.
