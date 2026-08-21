import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ─────────────────────────────────────────────
# 2. MODULE HEADERS in renderLearningPath
# Find where each module renders its header and inject module_header_mX.jpg
# The learning path shows each module with a header. We inject after the section title.
# ─────────────────────────────────────────────

# Find where modules are rendered in the learning path
# Look for the module header block - it has the module title rendering
# We will add module_header image to the openLessonModal HEADER section

old_header = '''        <!-- HEADER VISUAL ARCHITECTURE -->
        <div class="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-6 flex items-center gap-6 shadow-2xl">
            <div class="absolute -right-10 -bottom-10 text-slate-700/30 text-[180px] pointer-events-none">
                ${modIcon}
            </div>
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 text-4xl text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)] relative z-10 shrink-0">
                ${modIcon}
            </div>
            <div class="relative z-10">
                <div class="text-xs text-indigo-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                   <i class="fa-solid fa-layer-group"></i> Fase ${modNumber} • Pilar ${pIndex + 1}
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-white leading-tight">${pillar.title}</h2>
            </div>
        </div>'''

new_header = '''        <!-- HEADER VISUAL ARCHITECTURE -->
        <div class="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-700 shadow-2xl" style="padding-top:28%;">
            <img src="assets/img/module_header_m${modNumber}.jpg"
                 alt="Módulo ${modNumber}"
                 class="absolute inset-0 w-full h-full object-cover"
                 onerror="this.style.display='none'">
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
            <div class="absolute inset-0 flex items-end p-6 gap-4">
                <div class="w-14 h-14 rounded-2xl bg-indigo-500/30 backdrop-blur flex items-center justify-center border border-indigo-500/50 text-3xl text-indigo-300 shrink-0">
                    ${modIcon}
                </div>
                <div>
                    <div class="text-xs text-indigo-300 font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                       <i class="fa-solid fa-layer-group"></i> Fase ${modNumber} &bull; Pilar ${pIndex + 1}
                    </div>
                    <h2 class="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg">${pillar.title}</h2>
                </div>
            </div>
        </div>'''

if old_header in content:
    content = content.replace(old_header, new_header)
    print('Module headers: OK')
else:
    print('Module headers: pattern not found, trying partial match...')
    idx = content.find('HEADER VISUAL ARCHITECTURE')
    if idx != -1:
        print('Found at:', idx)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Step 2 done.')
