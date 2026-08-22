import os
import json
import math
import re

MD_DIR = 'Psicologia_Oscura'
DATA_JS = 'js/data_libros.js'

md_files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
md_files.sort()

with open(DATA_JS, 'r', encoding='utf-8') as f:
    data_content = f.read()

matches = list(re.finditer(r"(deepDive:)", data_content))
if len(matches) == 24:
    print("Found exactly 24 pillars based on deepDive. Injecting chapter mappings...")
    offset = 0
    new_data_content = ""
    last_end = 0
    
    chapters_per_pillar = len(md_files) / 24.0
    
    for i, match in enumerate(matches):
        start_idx = int(math.floor(i * chapters_per_pillar))
        end_idx = int(math.floor((i + 1) * chapters_per_pillar))
        
        assigned_chapters = [f.replace('.md', '') for f in md_files[start_idx:end_idx]]
        
        injection = f"chapters: {json.dumps(assigned_chapters)},\n          "
        
        new_data_content += data_content[last_end:match.start()] + injection
        last_end = match.start()
        
    new_data_content += data_content[last_end:]
    
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(new_data_content)
    print("Updated data_libros.js successfully!")
else:
    print(f"Warning: Found {len(matches)} deepDives instead of 24.")
