# ZENIT CORTEX — Biblioteca y Academia Interactiva

ZENIT CORTEX es una biblioteca web y plataforma de divulgación sobre psicología, conducta, comunicación e influencia. Incluye un catálogo de libros y audiolibros, rutas interactivas, tarjetas de repaso y autoevaluaciones formativas.

El proyecto no constituye diagnóstico, tratamiento, evaluación psicométrica ni titulación profesional. La distribución pública de cada recurso debe contar con una licencia o autorización verificable.

## Desarrollo local

Requiere Node.js 22 o superior. No es necesario instalar dependencias para ejecutar las pruebas actuales.

```bash
git clone https://github.com/juanxaviercasa/psicologia-interactiva.git
cd psicologia-interactiva
npm run check
npm test
npm run dev
```

El servidor local queda disponible en `http://localhost:8080`. Para detenerlo, usa `Ctrl+C`.

También puede servirse como sitio estático con un servidor compatible con GitHub Pages, siempre que se publiquen `index.html`, `app.html`, `404.html`, `robots.txt` y `sitemap.xml` desde la raíz.

## Estructura principal

- `index.html`: catálogo público y filtros.
- `app.html`: academia interactiva.
- `js/`: datos, motores de audio, biblioteca, progreso, IA y lógica de interfaz.
- `assets/`: imágenes y materiales multimedia.
- `tests/`: pruebas reproducibles con Node nativo.
- `docs/`: documentación de mejoras, riesgos y plan de fases.

## Scripts

`npm run check` verifica la sintaxis de los módulos principales. `npm test` ejecuta las pruebas funcionales existentes. `npm run dev` inicia el servidor local incluido en `server.js`.

## Publicación

El dominio canónico previsto es `https://cortex.sistemazenit.com/`. La academia interactiva se marca como `noindex`; el sitemap debe contener únicamente páginas públicas aprobadas para indexación. Antes de publicar nuevos PDFs, DOCX o audiolibros se debe comprobar y documentar su derecho de distribución.

Consulta [docs/PLAN-MEJORA-2026-11.md](docs/PLAN-MEJORA-2026-11.md) para el plan de implementación por fases.

## Autor

**Juan Xavier Cabello** — Desarrollador Web Full-Stack & Licenciado en Educación Matemática.  
[LinkedIn](https://www.linkedin.com/in/xaviercabello/) · [GitHub](https://github.com/juanxaviercasa) · [Web personal](https://juan.cabellosalirrosas.com/)
