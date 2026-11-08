# Mejoras de fiabilidad y aprendizaje — noviembre 2026

## Cambios incluidos

- Correcciones de errores en el repaso de tarjetas y el control de «Revisión Rápida».
- Respuestas de cuestionarios persistentes, feedback tras recargar y recompensas de una sola concesión.
- Avance separado por libro y porcentaje calculado con lecciones **completadas**, no desbloqueadas.
- Constancia **interna y no oficial** con comprobación de lecciones y evaluaciones aprobadas. La validación sigue siendo **local** y no es resistente a falsificaciones sin servidor.
- Escape de texto de chat y respuestas de la IA, y saneamiento de HTML de Markdown.
- Claves personales solo durante la sesión del navegador; Google Gemini las recibe mediante cabecera. **No es una solución de secretos segura para producción**: hacen falta un backend, autenticación y límites de consumo.
- Cámara solo si hay modelo disponible, temporizadores cancelables y sin penalizar expresiones faciales.
- Catálogo con IDs no duplicados, navegación correcta a laboratorio corporal y mejora en reporte de errores de audio.
- Pruebas mínimas reproducibles con Node 22 y GitHub Actions.

## Validación local

```bash
node --check js/app.js
node --check js/ai_engine.js
node --check js/cv_engine.js
node --test tests/academy.test.cjs
```

## Pendiente por arquitectura o supervisión

1. Incorporar autenticación real y un servidor con persistencia validada de resultados y emisión verificable de certificados.
2. Pasar las claves de servicios de IA a un proxy autenticado, con control de presupuesto, abuso y cuotas.
3. Revisar derechos de distribución de PDFs/audios y permisos R2. No exponer archivos sin derechos.
4. Auditoría académica profesional de conceptos psicológicos, ética, estudios citados y escenarios.
5. Pruebas con navegador real (móvil/desktop, accesibilidad, cámara, PDF, audio) y comprobar las rutas R2.
6. Sustituir los cinco grupos de preguntas genéricas por ejercicios específicos de cada módulo.
7. Separar módulos extensos en componentes y establecer un proceso de compilación/revisión de dependencias.
8. Asegurar que cada libro sin contenido interactivo generado muestre estado «sin curso» en vez del curso de referencia.

> No se debe anunciar esta web como evaluación clínica, diagnóstico o certificación profesional.

## Segunda fase: respaldo académico local

El pie de página incluye **Respaldar avance** y **Restaurar copia**. Se guarda un archivo JSON por libro con lecciones completadas, evaluaciones, tarjetas, notas y puntuación. No incluye claves de API. La restauración valida la versión, el identificador del libro y listas permitidas de datos; requiere confirmación y reemplaza el progreso de ese libro en ese navegador. **El JSON no está cifrado**: contiene notas que pueden ser personales. No es sincronización en la nube ni una fuente de certificación verificable.
