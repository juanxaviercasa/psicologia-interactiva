import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<div class="flex items-center gap-3">'
injection = '''<div class="flex items-center gap-3">
        <!-- BOTONES DE MODO DIOS Y AYUDA -->
        <button onclick="document.getElementById('methodologyModal').classList.remove('hidden')" class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-all text-xs font-bold">
          <i class="fa-solid fa-microscope"></i> Bases Científicas
        </button>
        <button onclick="App.unlockAll()" class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30 transition-all text-xs font-bold">
          <i class="fa-solid fa-unlock-keyhole"></i> Modo Dios
        </button>'''

if target in content and 'Bases Científicas' not in content:
    content = content.replace(target, injection)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected buttons successfully!")
else:
    print("Already injected or target not found")
