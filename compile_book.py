import os
import json
import math
import re

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'
DATA_JS = 'js/data_libros.js'

# 1. Read all MD files
md_files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
md_files.sort()  # Should sort Tema_01, Tema_02 ... Tema_76

book_dict = {}
for f in md_files:
    with open(os.path.join(MD_DIR, f), 'r', encoding='utf-8') as file:
        book_dict[f.replace('.md', '')] = file.read()

# 2. Write book_content.js
js_content = "const BOOK_CONTENT = " + json.dumps(book_dict, ensure_ascii=False) + ";\n"
with open(BOOK_JS, 'w', encoding='utf-8') as f:
    f.write(js_content)
print(f"Created {BOOK_JS} with {len(md_files)} chapters.")

# 3. Update data_libros.js to map chapters to pillars
with open(DATA_JS, 'r', encoding='utf-8') as f:
    data_content = f.read()

# We have 24 pillars (6 modules * 4 pillars). 
# 76 chapters / 24 pillars = ~3.16 chapters per pillar.
# We will just distribute them sequentially.
total_pillars = 24
chapters_per_pillar = len(md_files) / total_pillars

# Find all occurrences of "title: '...', " inside keyPillars
matches = list(re.finditer(r"(title:\s*['\"].*?['\"]\s*,)", data_content))
if len(matches) == total_pillars:
    print("Found exactly 24 pillars. Injecting chapter mappings...")
    offset = 0
    new_data_content = ""
    last_end = 0
    
    for i, match in enumerate(matches):
        start_idx = int(math.floor(i * chapters_per_pillar))
        end_idx = int(math.floor((i + 1) * chapters_per_pillar))
        
        assigned_chapters = [f.replace('.md', '') for f in md_files[start_idx:end_idx]]
        
        # Inject the mapping right after the title
        injection = f"\n          chapters: {json.dumps(assigned_chapters)},"
        
        new_data_content += data_content[last_end:match.end()] + injection
        last_end = match.end()
        
    new_data_content += data_content[last_end:]
    
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(new_data_content)
    print("Updated data_libros.js with chapter mappings.")
else:
    print(f"Warning: Found {len(matches)} pillars instead of 24. Manual mapping might be required.")
