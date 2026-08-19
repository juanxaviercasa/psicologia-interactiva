import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the "Raíz del Concepto" block in openLessonModal
pattern = r'(<h3 class="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2"><i class="fa-solid fa-seedling"></i> Raíz del Concepto</h3>\s*)(<p class="text-slate-300)'

repl = r'''\1
    <!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
    <div class="w-full mb-6 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950">
        <img src="assets/img/lesson_${pilar.id}.jpg" 
             onerror="this.src='https://picsum.photos/seed/psy_${pilar.id}/800/400'; this.classList.add('opacity-40', 'grayscale')" 
             alt="Ilustración de ${pilar.title}" 
             class="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105 preserve-color mix-blend-lighten">
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-4">
            <span class="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase"><i class="fa-solid fa-camera text-slate-500 mr-1"></i> Fig 1. Aplicación Práctica: ${pilar.title}</span>
        </div>
    </div>
    \2'''

content = re.sub(pattern, repl, content)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Injected lesson image logic')
