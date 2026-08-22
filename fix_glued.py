import os
import re
import json

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'

files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
files.sort()

for f in files:
    path = os.path.join(MD_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        text = fh.read()
    
    # 1. Fix author and opening paragraph gluing
    text = re.sub(r'\*{0,3}#{0,4}\s*Por Benedict Goleman\*{0,3}\s*', r'\n\n### Autor: Benedict Goleman\n\n', text)
    text = re.sub(r'\*{0,3}BENEDICT GO[EL]{2}MAN\*{0,3}\s*', r'\n\n### Autor: Benedict Goleman\n\n', text)
    
    # 2. Fix glued words like 'GolemanEste'
    text = re.sub(r'Goleman([A-ZÁÉÍÓÚ])', r'Goleman\n\n\1', text)
    
    # 3. Clean double/triple headings
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # 4. Save
    with open(path, 'w', encoding='utf-8') as out_fh:
        out_fh.write(text.strip())

print("Párrafos y autor depurados.")

# Recompile book_content.js
clean_dict = {}
for f in files:
    key = f.replace('.md', '')
    with open(os.path.join(MD_DIR, f), 'r', encoding='utf-8') as fh:
        clean_dict[key] = fh.read()

js_code = "var BOOK_CONTENT = " + json.dumps(clean_dict, ensure_ascii=False) + ";\nwindow.BOOK_CONTENT = BOOK_CONTENT;\n"
with open(BOOK_JS, 'w', encoding='utf-8') as f:
    f.write(js_code)

print("book_content.js recompilado con éxito.")
