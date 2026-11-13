# Activación de Whop para ZENIT CORTEX

La integración está implementada en `functions/api/` y opera en **denegación segura** mientras no se configuren las variables de producción.

## Variables requeridas

Configurar como secrets o variables protegidas en Cloudflare Pages:

- `WHOP_CLIENT_ID`: client ID de la aplicación OAuth.
- `WHOP_CLIENT_SECRET`: reservado para el flujo que lo requiera; nunca se publica en el frontend.
- `SESSION_SECRET`: secreto aleatorio largo para cifrar la cookie de sesión.
- `WHOP_API_KEY`: API key server-side con permisos mínimos para comprobar acceso.
- `WHOP_PRODUCT_ID` o `WHOP_EXPERIENCE_ID`: recurso cuyo acceso concede la compra.
- `WHOP_CHECKOUT_URL`: URL de checkout de Whop.
- `WHOP_WEBHOOK_SECRET`: secreto `ws_...` del webhook firmado.

## URL OAuth

Registrar exactamente:

```text
https://cortex.sistemazenit.com/api/auth/callback
```

El frontend inicia `/api/auth/login`. El callback usa OAuth 2.1 + PKCE, consulta `/oauth/userinfo` y cifra la sesión en una cookie `HttpOnly`, `Secure` y `SameSite=Lax`.

## Webhook

Registrar:

```text
https://cortex.sistemazenit.com/api/webhooks/whop
```

Suscribir al menos eventos de pago y membresía. El endpoint verifica la firma Standard Webhooks, rechaza timestamps con más de cinco minutos de diferencia y acepta duplicados de forma segura mediante `webhook-id` cuando se configura el binding opcional `CORTEX_EVENTS`.

## Contenido premium

Antes de activar ventas, mover PDFs, DOCX, PPTX y audios premium al bucket R2 privado. La ruta `app.html` comprueba `/api/access` antes de renderizar. La protección de archivos individuales debe completarse con URLs firmadas o un proxy de media antes de publicar enlaces directos.

## Oferta

`landing.html` no inventa precio ni promesas. Se activa cuando existe `WHOP_CHECKOUT_URL`; entonces `/api/offer` muestra el texto configurado con `OFFER_LABEL`, `OFFER_DESCRIPTION` y `OFFER_CTA`.

## Binding de media privado

Crear un binding R2 de Pages Functions llamado `MEDIA_PRIVATE` apuntando al bucket privado. El endpoint dinámico `functions/api/media/[key].js` comprueba la membresía de Whop antes de leer el objeto y nunca expone el bucket directamente. Después de verificar el flujo, actualizar las URLs de PDFs, documentos y audios premium para usar `/api/media/<clave>`.
