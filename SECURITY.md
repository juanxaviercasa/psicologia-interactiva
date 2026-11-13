# Seguridad y privacidad

## Estado actual

La aplicación es principalmente estática. El progreso, las notas y algunas preferencias se guardan en el navegador. La funcionalidad de IA permite que el usuario introduzca claves de proveedor y realiza llamadas directas desde el cliente; esto se considera un modo provisional y no debe tratarse como almacenamiento seguro de secretos.

La constancia actual es local y no verificable en servidor. Los respaldos JSON pueden contener notas personales y no están cifrados.

## Requisitos antes de producción con cuentas o IA

- Mantener las claves de proveedores únicamente en el servidor.
- Implementar un proxy autenticado con cuotas, límites de tokens, rate limiting y registro de errores sin secretos.
- Validar en servidor la propiedad del progreso y la emisión de certificados.
- Restringir CORS a orígenes autorizados.
- Publicar una CSP, HSTS y una Permissions-Policy compatibles con las funciones realmente usadas.
- Usar URLs firmadas o control de acceso para recursos que no sean públicos.
- Definir retención, eliminación y tratamiento de notas, imágenes de cámara y textos enviados a proveedores externos.
- Revisar y documentar la licencia de cada PDF, audio, imagen y fragmento editorial.

## Reporte de vulnerabilidades

No incluir claves, notas personales ni archivos privados en reportes públicos. Para un reporte responsable, abrir un issue privado o contactar al propietario del repositorio con pasos reproducibles y el impacto observado.
