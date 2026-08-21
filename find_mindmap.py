import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ─────────────────────────────────────────────
# 3. DIAGRAM IMAGES — inject into lesson modal MAPA MENTAL section
# Find the mapa mental / mind map section in the lesson modal
# ─────────────────────────────────────────────
# Find the mindmap/diagram section
idx = content.find('MAPA MENTAL')
if idx == -1:
    idx = content.find('Mapa Mental')
if idx == -1:
    idx = content.find('mermaid')
print(f'Map section found at: {idx}')
print(content[idx:idx+400])
