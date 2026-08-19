import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

if 'laboratory.js' not in content:
    content = content.replace('<!-- Lógica Principal -->', '<!-- Lógica Principal -->\n  <script src="js/laboratory.js"></script>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
