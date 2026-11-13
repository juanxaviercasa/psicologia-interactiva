# Plan de mejora de ZENIT CORTEX

## Objetivo

Convertir la biblioteca interactiva en una plataforma publicable, mantenible y segura, sin presentar el contenido como diagnóstico, tratamiento ni certificación profesional mientras no exista validación académica y técnica suficiente.

## Fase 0 — Decisiones y contención

- Confirmar `cortex.sistemazenit.com` como dominio canónico.
- Inventariar cada PDF, DOCX, audio e imagen con licencia o autorización verificable.
- Clasificar el contenido como indexable, público no indexable, privado o retirado.
- Decidir si el producto será local sin cuentas o academia con usuarios, sincronización y certificados.

**Criterio de salida:** dominio y política de contenidos aprobados.

## Fase 1 — Publicación, SEO y calidad mínima

- Canonical, CNAME, Open Graph y enlaces absolutos unificados.
- `robots.txt`, `sitemap.xml` y `404.html` válidos.
- Rutas inexistentes con 404 real; academia dinámica marcada como no indexable.
- `package.json` con scripts reproducibles de desarrollo, sintaxis y pruebas.
- Validación CI de metadatos, enlaces y tipos MIME.

**Estado:** implementada parcialmente en esta rama de trabajo. Se añadieron CNAME/canonical, `robots.txt`, `sitemap.xml`, `404.html`, scripts reproducibles, validación CI y documentación de riesgos.

## Fase 2 — Rendimiento y estructura de activos

- Eliminar duplicados en `assets/` y `libros/`.
- Mover archivos pesados a almacenamiento de objetos/CDN.
- Carga bajo demanda de libros, lecciones, audio e imágenes.
- Build reproducible con dependencias fijadas y presupuesto de tamaño.
- Prueba automatizada de portadas, audio y PDF.

**Avance actual:** se añadió `npm run audit:assets`, que mide peso y duplicados sin borrar archivos automáticamente. También se incorporó lazy loading, `decoding="async"` y alt descriptivo para imágenes secundarias de la academia. La migración física a CDN queda pendiente para no romper enlaces sin un destino de almacenamiento aprobado.

## Fase 3 — Seguridad y backend

- Proxy de IA autenticado, con claves solo en servidor.
- Autenticación y persistencia de progreso si el producto lo requiere.
- Certificados verificables y no falsificables desde `localStorage`.
- CSP, HSTS, CORS restringido, Permissions-Policy y rate limiting.
- URLs firmadas y permisos correctos para recursos protegidos.

**Avance actual:** se añadió `SECURITY.md` con el modelo de amenazas y los requisitos mínimos. El proxy de IA, la autenticación y la persistencia aún requieren un entorno de servidor y una decisión sobre proveedor/cuentas; no se simularán con secretos en el frontend.

## Fase 4 — Contenido, accesibilidad y experiencia

- Revisión profesional de afirmaciones psicológicas, fuentes y ejercicios.
- Auditoría WCAG con navegador real, teclado, móvil y lector de pantalla.
- Estados claros de error, carga, contenido ausente y recursos sin curso.
- Sustitución progresiva de eventos inline y arquitectura por módulos.

**Avance actual:** se corrigieron los `alt` ausentes en la aplicación y se protegieron todos los enlaces `target="_blank"`. Se añadió el registro de licencias y permisos. Falta una auditoría WCAG con navegador real y revisión profesional del contenido psicológico.

## Fase 5 — Operación y crecimiento

- Analítica respetuosa con la privacidad y embudo de aprendizaje.
- Monitoreo de 404, errores JavaScript, peso, disponibilidad y certificados.
- Manifiesto y sitemap generados automáticamente desde una fuente editorial única.
- Revisión editorial y técnica antes de publicar nuevos materiales.

## Bloqueadores pendientes

No se deben publicar cambios de contenido masivos ni monetizar la biblioteca hasta cerrar los derechos de distribución. Tampoco se debe anunciar una certificación verificable mientras el progreso siga siendo local y falsificable.
