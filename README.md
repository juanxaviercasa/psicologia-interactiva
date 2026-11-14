# ZENIT CORTEX — Biblioteca y Academia Interactiva

ZENIT CORTEX es una biblioteca web y plataforma de divulgación sobre psicología, conducta, comunicación e influencia. Incluye un catálogo de libros y audiolibros, rutas interactivas, tarjetas de repaso y autoevaluaciones formativas.

El proyecto no constituye diagnóstico, tratamiento, evaluación psicométrica ni titulación profesional. La distribución pública de cada recurso debe contar con una licencia o autorización verificable.

## Desarrollo local

Requiere Node.js 22 o superior. La aplicación estática incluye sus hojas compiladas, por lo que `npm run dev` no requiere instalar dependencias; para regenerar el CSS compilado, instala las dependencias bloqueadas.

```bash
git clone https://github.com/juanxaviercasa/psicologia-interactiva.git
cd psicologia-interactiva
npm ci
npm run build
npm run check
npm test
npm run dev
```

`npm run build` compila las utilidades de Tailwind usadas por la portada a `css/tailwind.generated.css`. Tailwind está fijado en `package-lock.json`; los archivos de salida compilados se mantienen en el repositorio para poder servir la web sin un build en el servidor.

El servidor local queda disponible en `http://localhost:8080`. Para detenerlo, usa `Ctrl+C`.

También puede servirse como sitio estático con un servidor compatible con GitHub Pages, siempre que se publiquen `index.html`, `app.html`, `404.html`, `robots.txt`, `sitemap.xml` y los directorios `css/` y `js/` desde la raíz.

## Estructura principal

- `index.html`: página pública de presentación y acceso.
- `app.html`: academia interactiva.
- `js/`: datos, motores de audio, biblioteca, progreso, IA y lógica de interfaz.
- `css/landing.css`: estilos propios y responsive de la página pública.
- `css/tailwind.source.css`: directivas de entrada para el build.
- `css/tailwind.generated.css`: utilidades Tailwind compiladas que sirve la página pública.
- `tailwind.config.js`: configuración acotada a `index.html` y paleta del sitio.
- `assets/`: imágenes y materiales multimedia.
- `tests/`: pruebas reproducibles con Node nativo.
- `docs/`: documentación de mejoras, riesgos y plan de fases.

## Scripts

`npm run build` genera el CSS estático. `npm run check` verifica la sintaxis de los módulos principales. `npm test` ejecuta las pruebas funcionales. `npm run validate:publication` verifica metadata, recursos e integridad básica de publicación. `npm run dev` inicia el servidor incluido en `server.js`.

## Publicación

El dominio canónico previsto es `https://cortex.sistemazenit.com/`. La academia interactiva se marca como `noindex`; el sitemap debe contener únicamente páginas públicas aprobadas para indexación. Antes de publicar nuevos PDFs, DOCX o audiolibros se debe comprobar y documentar su derecho de distribución.

La landing no debe dirigir a un checkout hasta que la URL de Whop esté verificada y el resumen de precio/condiciones sea correcto.

Consulta [docs/PLAN-MEJORA-2026-11.md](docs/PLAN-MEJORA-2026-11.md) y [docs/AUDITORIA-LANDING-CORTEX-2026-11.md](docs/AUDITORIA-LANDING-CORTEX-2026-11.md) para el plan y la auditoría de la página pública.

## Autor

**Juan Xavier Cabello** — Desarrollador Web Full-Stack & Licenciado en Educación Matemática.  
[LinkedIn](https://www.linkedin.com/in/xaviercabello/) · [GitHub](https://github.com/juanxaviercasa) · [Web personal](https://juan.cabellosalirrosas.com/)
