# Pipeline de curacion de libros

Este pipeline conserva los originales y genera salidas nuevas. No publica nada en R2 y no llama a Gemini hasta ejecutar `curate` o `run`.

## Instalacion

Desde la raiz del proyecto:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-curacion.txt
```

Escribe la clave de Google AI Studio en `.env`:

```env
GEMINI_API_KEY=tu_clave_real
GEMINI_MODEL=gemini-2.5-flash
```

`.env` esta excluido de Git. No pegues la clave en ningun archivo JavaScript, Markdown o commit.

## Orden de trabajo

1. Crear inventario:

```powershell
python scripts/curacion_libros/pipeline.py inventory
```

2. Procesar un PDF de prueba completo:

```powershell
python scripts/curacion_libros/pipeline.py run "Coleccion _Psicologia_Oscura_Audiolibros\🎁BONOS🎁\Psicologia-Oscura-6-en-1.pdf"
```

`run` ejecuta: extraccion, division por capitulos, curacion con Gemini y validacion.

3. Ejecutar fases por separado cuando se necesite revisar cada etapa:

```powershell
python scripts/curacion_libros/pipeline.py extract "ruta\libro.pdf"
python scripts/curacion_libros/pipeline.py split "scripts\curacion_libros\data\libro.md" --output "scripts\curacion_libros\data\libro\capitulos"
python scripts/curacion_libros/pipeline.py curate "scripts\curacion_libros\data\libro\capitulos" --output "scripts\curacion_libros\output\libro\capitulos" --reports "scripts\curacion_libros\reports\libro"
python scripts/curacion_libros/pipeline.py validate "scripts\curacion_libros\output\libro\capitulos"
```

Los PDFs escaneados generan marcas `sin texto, requiere OCR`; este primer script no hace OCR. Esos libros deben pasar por OCR antes de la curacion.

## Salidas

- `data/`: texto extraido y capitulos intermedios.
- `output/`: Markdown curado.
- `reports/`: inventario, cambios de Gemini y validacion.

Estas carpetas estan excluidas de Git para evitar subir libros, textos derivados y reportes accidentalmente.
