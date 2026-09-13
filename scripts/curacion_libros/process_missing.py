import os
import shutil
from pathlib import Path
import sys

# Import functions from pipeline
try:
    from pipeline import extract_pdf, split_chapters, safe_id, DATA, OUTPUT, REPORTS
except ImportError:
    sys.exit("Error: Must run from within scripts/curacion_libros/")

def main():
    pdf_dir = Path('../../assets/libros').resolve()
    if not pdf_dir.exists():
        pdf_dir = Path('../../libros').resolve()
    
    existing = set(d.name for d in OUTPUT.iterdir() if d.is_dir())
    
    all_pdfs = list(pdf_dir.rglob('*.pdf'))
    missing = [p for p in all_pdfs if safe_id(p.stem) not in existing]
    
    print(f"Total PDFs: {len(all_pdfs)}")
    print(f"Missing PDFs: {len(missing)}")
    
    for pdf in missing:
        book_id = safe_id(pdf.stem)
        print(f"\n--- Procesando: {book_id} ---")
        
        extracted = DATA / f"{book_id}.md"
        chapters_dir = DATA / book_id / "capitulos"
        curated_dir = OUTPUT / book_id / "capitulos"
        
        # 1. Extract
        if not extracted.exists():
            print(f"Extrayendo texto de {pdf.name}...")
            extract_pdf(pdf, extracted)
        else:
            print(f"Texto ya extraído: {extracted.name}")
            
        # 2. Split
        if not (chapters_dir / "manifest.json").exists():
            print("Dividiendo capítulos...")
            split_chapters(extracted, chapters_dir)
        else:
            print(f"Capítulos ya divididos: {chapters_dir}")
            
        # 3. Bypass Curation (copy from data to output)
        if not curated_dir.exists():
            print("Saltando curación de Gemini, copiando crudos a output...")
            shutil.copytree(chapters_dir, curated_dir)
            print(f"Copiado a: {curated_dir}")
        else:
            print(f"La carpeta curated_dir ya existe: {curated_dir}")

if __name__ == "__main__":
    main()
