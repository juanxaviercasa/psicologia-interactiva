# Auditoría de la página de ventas de ZENIT CORTEX

**Fecha:** 13 de noviembre de 2026  
**URL revisada:** <https://cortex.sistemazenit.com/>  
**Repositorio:** `juanxaviercasa/psicologia-interactiva`  
**Alcance:** revisión visual y de copy de la landing, comprobación del HTML publicado frente a `index.html`, revisión estática de responsive, imágenes, metadata, CTA y rutas expuestas. No se completó una compra ni se envió información a terceros.

## Resumen ejecutivo

La página parte de una base sólida: posicionamiento entendible, tono editorial consistente, imágenes propias alineadas con el relato, desglose del contenido, precio visible y límites educativos explícitos. No necesita un rediseño desde cero. El mayor retorno inmediato está en reducir el peso de las imágenes, mantener accesible la oferta al navegar desde móvil y elevar la claridad del proceso de compra y de la estructura de estilos.

Se conservaron la identidad nocturna de Cortex y sus colores cian/menta/violeta. Se optimizaron las cinco imágenes de la landing a WebP, se incorporó navegación visible a planes y una barra de acceso fija solo en móvil, se añadieron metadatos sociales y se documentaron las siguientes mejoras recomendadas.

## Fortalezas observadas

- El titular «Detrás de cada conducta, hay algo que entender» comunica curiosidad y evita prometer resultados clínicos.
- La combinación de lectura, audio y práctica ofrece una propuesta más específica que una biblioteca digital genérica.
- Los bloques «sentirte mejor», «hacer valer tus ideas» y «conectar» acercan la propuesta a situaciones reconocibles.
- El precio, el ahorro anual y el inventario principal aparecen en la propia página; no se ocultan tras un formulario.
- Hay advertencias claras de que el producto es educativo y no sustituye terapia o diagnóstico, así como una nota sobre el coste externo potencial de la función de IA.
- La página publicada respondía correctamente en su ruta principal; `/api/offer` y `/api/checkout` devolvían una respuesta HTTP 200 en la comprobación de cabeceras. Esto no valida el flujo transaccional, que deliberadamente no se ejecutó.

## Hallazgos y cambios realizados

### 1. Peso de las imágenes — corregido

Las cinco imágenes originales ocupaban aproximadamente **10,7 MB en total**. Se conservaron intactos los PNG originales y se añadieron versiones WebP con calidad 86. El conjunto nuevo ocupa aproximadamente **0,71 MB**, una reducción agregada superior al **93 %**. La landing ya referencia las versiones WebP; se añadió preload para la imagen principal.

### 2. Descubrimiento de la oferta en móvil — corregido

En la implementación original, los enlaces secundarios del encabezado se ocultaban por debajo del breakpoint `sm`. Ahora se muestra «Ver planes» también en pantallas pequeñas. Se añadió una barra inferior fija de compra, visible solo en móvil, con el precio mensual y un enlace directo al checkout, respetando el área segura inferior del teléfono. Se añadió espacio bajo el contenido para que la barra no tape el final de la página.

### 3. Ajuste del hero y tarjetas en móvil — corregido

Se ajustaron el tamaño fluido del titular, los espacios verticales del hero, el ancho/espaciado de las tarjetas de situaciones y la altura de sus imágenes para reducir sensación de saturación en pantallas angostas.

### 4. Vista previa al compartir — corregido

Se añadieron `og:image`, texto alternativo para esa imagen y `twitter:card`, reutilizando la imagen principal optimizada. Se mantiene el canonical existente.

### 5. Consistencia del microcopy — pendiente menor

La respuesta actual del FAQ dice «Pulsa “Empezar ahora”», pero el CTA visible usa «Quiero entrar a Cortex». Conviene alinear ese texto con la etiqueta real y explicar, sin ambigüedad, qué dato se solicita antes del pago.

## Auditoría por área

### Diseño y marca

La paleta oscura con acentos fríos es coherente con el nombre Cortex y las escenas editoriales funcionan como recurso distintivo. Recomiendo consolidar los patrones actuales —tarjetas con bordes suaves, imagen en bloque, tipografía de títulos compacta y un solo acento primario por acción— en vez de sumar gradientes, efectos glow o nuevos estilos de ilustración. Mantener cian/menta para acción y violeta como acento secundario ayudaría a ordenar la jerarquía. La marca debería presentarse como un espacio de aprendizaje y criterio, no como una herramienta para controlar a otras personas.

El logotipo actual funciona en el encabezado. Para fortalecer el sistema de marca, documentar una pequeña guía con versiones claro/oscuro, zona de seguridad, color primario/secundario y uso de iconografía antes de producir nuevas piezas.

### Responsive y estructura

La página ya usa grids adaptativos y reduce las tarjetas a una columna en móvil; el riesgo estaba más en la navegación/CTA y en el balance del primer pantallazo que en un colapso general de layout. Revisar todavía manualmente al menos 360, 390, 768 y 1280 px, con zoom de texto al 200 %, teclado y orientación horizontal. Confirmar que no aparezca desbordamiento horizontal, que el precio no se corte, que el botón fijo no tape avisos de acceso y que el foco sea visible.

`index.html` concentra Tailwind por CDN, metadata, markup y varios bloques de CSS inline. Selectores como `main > section:first-child` y estilos repetidos para `.force-chapter` dependen mucho del orden del documento. Como siguiente paso técnico, mover estilos de landing a `css/landing.css`, usar clases con nombre semántico para secciones y retirar reglas en desuso después de una comparación visual. No mezclar esta refactorización con cambios de contenido amplios sin revisión visual.

### Copy y claridad de la oferta

El titular principal es atractivo, pero la diferenciación se puede concretar antes del primer CTA con una frase que resuma **biblioteca + rutas + casos interactivos + repaso**, sin añadir resultados garantizados. La página ya explica las funciones más abajo; considerar subir una línea-resumen o tres microbeneficios al hero si no lo vuelve denso.

El copy evita muchas promesas exageradas y el disclaimer es una fortaleza. Mantener cautela con «psicología oscura», persuasión y lenguaje corporal: presentar esos temas como estudio crítico, observación contextual, reconocimiento de tácticas y comunicación con límites; evitar sugerir lectura infalible de señales o control de conducta.

Antes de publicar, aclarar de forma verificable: renovación automática o no, cómo cancelar, qué ocurre con el acceso al cancelar, política de reembolso, impuestos/moneda y cuándo se habilita el acceso. No inventar ninguna de estas condiciones en la landing; obtenerlas del checkout/proveedor y mostrar el resumen previo al pago.

### Confianza y prueba

No se encontraron testimonios visibles en el contenido extraído, lo que evita fabricar prueba social, pero deja una oportunidad para mostrar evidencia real del producto: una captura auténtica de la biblioteca, una ruta de aprendizaje y un ejemplo de actividad. Si se añaden credenciales editoriales, fuentes académicas, reseñas o cifras de resultados, verificarlas y contextualizarlas primero. No publicar logos o afirmaciones de acreditación que sugieran validación profesional inexistente.

### Conversión y recorrido

El CTA principal lleva directamente a `/api/checkout`; los enlaces internos saltan a precios. La API respondía, pero el circuito real, los planes y el post-pago no se probaron para evitar iniciar una compra. Revisar el checkout en un entorno autorizado con una transacción de prueba antes de cambiar copy relativo a acceso, cobro, renovaciones o reembolsos.

Recomendación: registrar de forma compatible con la privacidad los clics en «Quiero entrar», vistas de precio, apertura de FAQ y abandono del checkout, si ya existe una analítica aprobada. Comparar una única variante de titular o CTA por vez y no inferir causalidad con muestras pequeñas.

### Accesibilidad y rendimiento

Las imágenes editoriales tienen texto alternativo y las funciones principales son enlaces, no controles de apariencia clicable. Falta una evaluación formal WCAG con lector de pantalla y navegadores móviles. Verificar contraste de texto secundario, orden de encabezados, foco visible, reducción de movimiento, zoom, targets táctiles y uso de la barra inferior con safe-area.

La reducción de imágenes es significativa. A medio plazo, valorar compilar Tailwind localmente en vez de cargar su CDN en producción y revisar si Font Awesome aporta suficientes iconos para justificar cargar la biblioteca completa. Estas tareas requieren validar que no cambie el aspecto ni se rompan iconos.

## Prioridades sugeridas

1. **P0 — Verificar condiciones comerciales reales:** renovación, cancelación, reembolso, moneda/impuestos y acceso; reflejarlos en un FAQ/aviso coherente con el checkout.
2. **P1 — Validación visual real en dispositivos:** comprobar breakpoints, safe-area, zoom, navegación por teclado, FAQ y CTA fijo; arreglar cualquier overflow o solapamiento visible.
3. **P1 — Alinear el FAQ con las etiquetas reales del botón** y describir el paso de compra con precisión.
4. **P2 — Consolidar CSS y Tailwind de producción:** externalizar estilos de landing y eliminar reglas duplicadas/dead CSS en una rama con comparación visual.
5. **P2 — Mostrar una demostración auténtica del producto:** una captura de la biblioteca, una ruta y un ejercicio, sin sustituirlo por mockups que aparenten funciones inexistentes.
6. **P3 — Instrumentación de conversión respetuosa con privacidad:** acordar eventos y retención antes de añadir analítica.

## Archivos modificados en esta revisión

- `index.html`: responsive, navegación/CTA móvil, preload e imagen/metadata social.
- `js/visuals/*.webp`: cinco derivados optimizados; los PNG originales se conservan.
- `docs/AUDITORIA-LANDING-CORTEX-2026-11.md`: este informe.
