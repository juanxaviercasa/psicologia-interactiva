import re

# ====================================================
# FIX 1: Inject the two buttons into the MAIN HEADER
# The main header has the search bar and RACHA/ENFOQUE/NIVEL pills
# We need to find those pills and inject our buttons next to them
# ====================================================

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The correct place is next to the avatar/dominio button in the TOP header bar
# Look for the DOMINIO button (avatar area)
target = 'Dominio</button>'
if target in html and 'fa-microscope' not in html:
    btn_html = '''Dominio</button>
        <!-- BOTONES DE AYUDA Y MODO DIOS -->
        <button onclick="document.getElementById('methodologyModal').classList.remove('hidden')" title="¿Por qué está bloqueado el contenido?" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all text-xs font-bold">
          <i class="fa-solid fa-microscope"></i><span class="hidden lg:inline"> Bases Científicas</span>
        </button>
        <button onclick="App.unlockAll()" title="Activar Modo Dios: desbloquear todo el contenido" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-all text-xs font-bold">
          <i class="fa-solid fa-unlock-keyhole"></i><span class="hidden lg:inline"> Modo Dios</span>
        </button>'''
    html = html.replace(target, btn_html)
    print("Injected buttons after Dominio button")

# ====================================================
# FIX 2: Remove old wrongly-placed buttons to avoid duplicates
# ====================================================
# Remove buttons added inside Skill Tree section
old_pattern = '''        <!-- BOTONES DE MODO DIOS Y AYUDA -->
        <button onclick="document.getElementById('methodologyModal').classList.remove('hidden')" class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-all text-xs font-bold">
          <i class="fa-solid fa-microscope"></i> Bases Científicas
        </button>
        <button onclick="App.unlockAll()" class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30 transition-all text-xs font-bold">
          <i class="fa-solid fa-unlock-keyhole"></i> Modo Dios
        </button>'''
if old_pattern in html:
    html = html.replace(old_pattern, '')
    print("Removed old misplaced buttons")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Done!")
