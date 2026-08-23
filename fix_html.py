import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Buscamos la inyección rota
broken_pattern = r'<button onclick="App\.toggleTheme\(\)"\s*<button onclick="App\.openAIEngineModal\(\)"[\s\S]*?</button>\s*id="themeToggleBtn"'

def replacer(match):
    match_str = match.group(0)
    ai_btn_start = match_str.find('<button onclick="App.openAIEngineModal()"')
    ai_btn_end = match_str.find('</button>', ai_btn_start) + len('</button>')
    ai_btn = match_str[ai_btn_start:ai_btn_end]
    
    return f"""
        {ai_btn}
        <button onclick="App.toggleTheme()" id="themeToggleBtn"
"""

if re.search(broken_pattern, html):
    html = re.sub(broken_pattern, replacer, html)
    print("Inyección rota encontrada y reparada!")
else:
    print("No se encontró el patrón roto.")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
