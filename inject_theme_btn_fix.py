import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

btn_html = """
        <!-- Theme Toggle -->
        <button onclick="App.toggleTheme()" id="themeToggleBtn" class="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:border-amber-500/50 shadow-sm transition-all hover:scale-105">
            <i class="fa-solid fa-sun text-lg" id="themeIcon"></i>
        </button>
        <!-- Porcentaje de Dominio -->"""

# Replace specifically the comment <!-- Porcentaje de Dominio -->
content = content.replace('<!-- Porcentaje de Dominio -->', btn_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Theme toggle injected correctly')
