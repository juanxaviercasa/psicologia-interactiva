import os
import json
from pathlib import Path
import re

def clean_text(text):
    text = re.sub(r'<!--.*?-->', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_markdown_to_module(md_path, module_idx):
    title = md_path.stem
    title = re.sub(r'^\d+-', '', title).replace('-', ' ').title()
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple chunking by 1500 characters to form "pillars"
    content = clean_text(content)
    chunks = [content[i:i+1500] for i in range(0, len(content), 1500)]
    
    pillars = []
    for i, chunk in enumerate(chunks):
        if not chunk.strip(): continue
        pillars.append({
            "title": f"Parte {i+1}",
            "realExample": chunk.strip(),
            "interactiveChallenge": {
                "question": "¿Cuál es la lección principal de esta lectura?",
                "options": [
                    {"text": "Reflexionar y aplicar", "isCorrect": True, "feedback": "¡Excelente!"},
                    {"text": "Ignorar la lectura", "isCorrect": False, "feedback": "Debes leer con atención."}
                ]
            }
        })
        
    return {
        "id": f"m{module_idx}",
        "bookNumber": module_idx,
        "title": title,
        "keyPillars": pillars
    }

def process_book(folder_path, output_dir):
    book_id = folder_path.name
    print(f"Procesando {book_id}...")
    
    capitulos_dir = folder_path / 'capitulos'
    if not capitulos_dir.exists():
        print(f"  -> Saltando (no hay capitulos)")
        return False

    modules = []
    idx = 1
    for md_file in sorted(capitulos_dir.glob('*.md')):
        mod = parse_markdown_to_module(md_file, idx)
        if mod['keyPillars']:
            modules.append(mod)
            idx += 1

    # Dummy simulator
    sim_data = [
        {
            "id": "case-1", "category": "General", "title": "Caso de Prueba", "difficulty": "Media", "badge": "TEST",
            "scenarioDescription": "Este es un caso generado automáticamente. Más adelante la IA podrá actualizarlo.",
            "options": [
                {"id": "opt-A", "text": "Avanzar", "outcome": "Éxito", "wisdomScore": 100, "analysis": "Decisión correcta.", "bookInsight": "Aplica lo aprendido."}
            ]
        }
    ]

    # Dummy flashcards
    flash_data = [
        {
            "id": "f1", "term": "Concepto Clave", "definition": "Definición generada automáticamente.", "tacticalUse": "Uso práctico...", "countermeasure": "Defensa..."
        }
    ]

    # Guardar JS content
    content_js = f"const BOOK_CONTENT = {{ modules: {json.dumps(modules, indent=2, ensure_ascii=False)} }};\n"
    with open(output_dir / f"{book_id}_content.js", 'w', encoding='utf-8') as f:
        f.write(content_js)
        
    # Guardar JS data
    data_js = f"""const LIBROS_DATA = {{
  modules: {json.dumps(modules, indent=2, ensure_ascii=False)},
  caseScenarios: {json.dumps(sim_data, indent=2, ensure_ascii=False)},
  flashcards: {json.dumps(flash_data, indent=2, ensure_ascii=False)}
}};
"""
    with open(output_dir / f"{book_id}_data.js", 'w', encoding='utf-8') as f:
        f.write(data_js)
        
    return True

def main():
    base_dir = Path(__file__).resolve().parent.parent
    input_dir = base_dir / 'scripts' / 'curacion_libros' / 'output'
    output_dir = base_dir / 'js' / 'books'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    if not input_dir.exists():
        print(f"Directorio no encontrado: {input_dir}")
        return

    count = 0
    for folder in input_dir.iterdir():
        if folder.is_dir():
            success = process_book(folder, output_dir)
            if success:
                count += 1

    print(f"\n¡ÉXITO! Se procesaron {count} libros automáticamente.")

if __name__ == '__main__':
    main()
