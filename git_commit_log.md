# Registro de Cambios - Fase 4 (Interactividad Avanzada y APIs)

## Resumen de la Actualización
Este commit introduce el nuevo "Laboratorio Táctico Interactivo", una suite de herramientas avanzadas diseñadas para la práctica en vivo de los conceptos de Psicología Oscura, utilizando gamificación, visualización de datos y multimedia.

## Cambios Realizados

### 1. `index.html`
- **Inyección de Dependencias:** Se añadieron los CDNs de `Chart.js` (para gráficos interactivos) y `Sortable.js` (para lógica Drag & Drop).
- **Nueva Vista de Laboratorio (`<section id="view-laboratory">`):**
  - Creada pestaña "Laboratorio" en el Navbar.
  - Implementación de 4 sub-pestañas: Modelos Matemáticos, Simulador Drag & Drop, Mapas de Calor, y Diccionario Multimedia.
- **Enlace de JS:** Se vinculó el nuevo archivo `js/laboratory.js` al final del body.

### 2. `js/laboratory.js` (NUEVO)
Archivo creado desde cero con el objeto global `Lab` que controla toda la lógica de las tres fases:
- **Phase 1 (Modelos Matemáticos):**
  - `initCharts()`: Instancia el Radar Chart (Tríada Oscura) y Doughnut Chart (Culpa).
  - `renderCulpaFactors()`, `updateCulpaWeight()`: Lógica para calcular y renderizar en tiempo real los porcentajes de culpa en el gráfico circular.
  - `addTension()`: Controlador del "Termómetro de Tensión" que reacciona a botones inyectando estrés simulado.
- **Phase 2 (Simuladores y Hotspots):**
  - `initDragDrop()`: Usa `SortableJS` para crear zonas de arrastre entre el "Arsenal" y el "Escudo".
  - `checkDragDrop()`: Algoritmo de validación que detecta si el usuario incluyó bloques tóxicos (`data-type="bad"`) en su respuesta, detonando feedback visual (rojo con temblor o verde de acero).
  - `checkHotspot(area)`: Lógica para el mapa de calor corporal sobre imágenes (validación de Nervio Vago vs Ojos).
- **Phase 3 (Multimedia):**
  - Estructura base lista en el HTML/JS para inyectar endpoints de Giphy/Pexels API usando PLACEHOLDERS (ej. `API_KEY = "PEXELS_PLACEHOLDER"`).

### 3. Siguientes Pasos (Para el Usuario)
- Reemplazar el `API_KEY` placeholder en caso de querer activar las llamadas reales de video/GIF en la vista del diccionario multimedia.
- Hacer `git add .`, `git commit -m "feat: Add Interactive Tactical Laboratory (Charts, D&D, Hotspots)"`, y `git push`.
