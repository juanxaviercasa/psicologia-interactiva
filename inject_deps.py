import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

if 'chart.js' not in content:
    content = content.replace('<!-- Dependencias de Terceros -->', '<!-- Dependencias de Terceros -->\n  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
