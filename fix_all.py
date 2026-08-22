import os
import json
import math
import re

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'
DATA_JS = 'js/data_libros.js'

# Read all MD files
md_files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
md_files.sort()

# Read data_libros.js
with open(DATA_JS, 'r', encoding='utf-8') as f:
    data_content = f.read()

# Instead of blindly searching for 'title:', let's find 'keyPillars: [' 
# and inside that array, find each '{' block.
# Actually, we can search for storytellingConcept since ONLY pillars have storytellingConcept.
matches = list(re.finditer(r"(storytellingConcept:)", data_content))
if len(matches) == 24:
    print("Found exactly 24 pillars based on storytellingConcept. Injecting chapter mappings...")
    offset = 0
    new_data_content = ""
    last_end = 0
    
    chapters_per_pillar = len(md_files) / 24.0
    
    for i, match in enumerate(matches):
        start_idx = int(math.floor(i * chapters_per_pillar))
        end_idx = int(math.floor((i + 1) * chapters_per_pillar))
        
        assigned_chapters = [f.replace('.md', '') for f in md_files[start_idx:end_idx]]
        
        # Inject the mapping right BEFORE storytellingConcept
        injection = f"chapters: {json.dumps(assigned_chapters)},\n          "
        
        new_data_content += data_content[last_end:match.start()] + injection
        last_end = match.start()
        
    new_data_content += data_content[last_end:]
    
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(new_data_content)
    print("Updated data_libros.js with accurate chapter mappings.")
else:
    print(f"Warning: Found {len(matches)} storytellingConcepts instead of 24.")

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '<script src="js/data_libros.js"></script>'
injection = '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>\n  <script src="js/book_content.js"></script>\n  <script src="js/data_libros.js"></script>'
if target in html and "marked.min.js" not in html:
    html = html.replace(target, injection)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated index.html")
