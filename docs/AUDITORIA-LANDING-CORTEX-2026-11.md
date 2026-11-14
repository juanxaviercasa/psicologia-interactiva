# Auditoría de la página de ventas de ZENIT CORTEX

**Revisión:** 13–14 de noviembre de 2026
**Sitio:** <https://cortex.sistemazenit.com/>
**Repositorio:** `juanxaviercasa/psicologia-interactiva`
**Alcance:** inspección de landing publicada y código, accesibilidad básica, contenido, metadatos, CTA y revisión visual local en 360, 390, 768 y 1280 px. No se completaron compras ni se enviaron datos personales.

## Resumen

La propuesta tiene una voz editorial clara, visuales propios y una combinación atractiva de biblioteca, audio y actividades. Se preservó el sistema visual nocturno de Cortex y se hicieron mejoras de velocidad, responsive, estructura del CSS, claridad del copy y accesibilidad.

Durante la auditoría también se descubrió que el checkout enlazado termina en una página de Whop que dice **“Whop not found”**. Para no mandar a los visitantes a un enlace roto ni inducir pagos con precios o condiciones que no pudieron verificarse, se pausaron las CTA de compra, se retiró el precio estático del sitio y se añadió un aviso transparente. **Para reactivar las ventas hacen falta del propietario el enlace vigente y la confirmación de precios y condiciones.**

## Mejoras implementadas

### Velocidad e imágenes

Las cinco imágenes PNG originales (unos 10,7 MB en conjunto) se conservaron y se añadieron derivados WebP. El nuevo grupo pesa aproximadamente 0,71 MB, más de 93 % menos. La portada usa WebP, incluye preload para la imagen del hero y metadatos Open Graph/Twitter para compartir.

### Responsive y jerarquía

Se ajustaron el hero, el tamaño fluido del titular, los espacios, las tarjetas y los CTA de pantallas pequeñas. El enlace a la información del estado de acceso permanece visible en móvil. Se revisaron capturas renderizadas a 360×800, 390×844, 768×1024 y 1280×900; no se observaron recortes ni desbordamientos relevantes en esas vistas. Esto no sustituye pruebas en teléfonos reales, zoom de texto o lectores de pantalla.

### Estructura y mantenimiento

Los estilos propios de la landing se consolidaron en `css/landing.css`, se ordenaron por sección y se retiraron reglas obsoletas. Tailwind se compila localmente y en modo minificado a `css/tailwind.generated.css`; la configuración y versión están fijadas en `tailwind.config.js` y `package-lock.json`. La portada ya no carga Tailwind por CDN. Se reemplazó Font Awesome en la landing por SVG inline y se retiró también su CDN. El output compilado está en el repositorio para poder servir la web estática sin ejecutar Node en producción. CI instala dependencias con `npm ci` y verifica el build. `README.md` documenta el flujo; el validador comprueba CSS compilado, assets y estado del checkout.

### Copy, compra y confianza

El hero ahora explica que Cortex reúne lectura, audio, rutas de aprendizaje y práctica. Se reemplazaron las llamadas a compra con navegación informativa y se retiró el precio publicado (US$9/mes, US$90/año y ahorro indicado), que no pudo validarse en el destino real. La tarjeta de oferta y el aviso inferior móvil explican que el acceso está en actualización; el FAQ pide no usar enlaces guardados.

No se añadieron testimonios, credenciales ni cifras de resultados no verificadas. Las seis capacidades educativas descritas en la página se conservaron. La explicación de sparring mantiene visible el requisito de usar una clave propia de IA y que podrían aplicarse cargos del proveedor externo.

### Accesibilidad

Se mejoró el contraste del aviso educativo, se añadió foco visible para teclado, se respetó `prefers-reduced-motion`, se elevó el área táctil de los encabezados del FAQ y se añadió un nombre accesible para la sección de preguntas. Los iconos nuevos/decorativos se etiquetan como ocultos para tecnologías de asistencia. Sigue pendiente una auditoría WCAG completa con lector de pantalla y dispositivos reales.

## Hallazgo crítico del checkout

La variable `WHOP_CHECKOUT_URL` está configurada y `/api/offer` informa que la oferta está configurada, pero eso solo confirma la presencia del valor, **no** que el destino siga existiendo. Al seguir la URL pública, Whop mostró que el producto no existe o fue retirado. La API `/api/offer` no expone precio, periodicidad, renovaciones, cancelación, reembolsos, impuestos ni acceso posterior al pago.

Por esa razón la landing no inventa esas condiciones ni intenta realizar una transacción. Una vez que el propietario proporcione el destino actualizado, se puede comprobar que cargue y revisar el resumen previo al pago sin finalizar una compra. Las condiciones económicas deberán copiarse de la oferta real de Whop.

## Pendientes que necesitan una decisión o acceso del propietario

1. **Reactivar ventas:** proporcionar la URL actual de checkout y confirmar el precio/planes que se desea anunciar.
2. **Completar el FAQ comercial:** confirmar renovación, cancelación, reembolso, moneda/impuestos y cuándo se habilita o termina el acceso. No se deben publicar hasta verificarlos.
3. **Demostración auténtica del producto:** una captura de biblioteca, ruta y ejercicio. El contenido está detrás del control de membresía; no se debe fabricar un mockup que parezca una captura real. Si el propietario facilita screenshots, se integran y optimizan.
4. **Medición de conversión:** no se añadió analítica porque el proyecto no declara proveedor ni política de consentimiento/retención para eventos.
5. **Pruebas reales de accesibilidad y dispositivos:** teclado, 200 % de zoom, lectores de pantalla, orientación horizontal y navegadores/teléfonos reales.

## Verificaciones ejecutadas

- 32 pruebas funcionales del proyecto, con la expectativa de ruta actualizada para asegurar que el checkout roto no reaparezca en la portada.
- Validación de metadatos/publicación y recursos; validación de las 11 Pages Functions.
- Comprobación local de `css/landing.css` (HTTP 200, tipo `text/css`) y las vistas responsive.
- Revisión del destino público de checkout, sin iniciar sesión ni completar pago.

## Archivos relevantes

- `index.html`: copy, estado de compra transparente, CTA informativas y metadatos sociales.
- `css/landing.css`: estilos consolidados de la landing.
- `js/visuals/*.webp`: cinco imágenes optimizadas; los PNG originales se conservan.
- `scripts/validate-publication.cjs`: controles preventivos de la página.
- `tests/routes_integrity.test.cjs`: prueba que el enlace de checkout roto no se reintroduzca.
- `README.md`: estructura y build del proyecto actualizados.
- `tailwind.config.js`, `css/tailwind.source.css` y `css/tailwind.generated.css`: build local reproducible de utilidades Tailwind.
