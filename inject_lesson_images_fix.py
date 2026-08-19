import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'''<div class="text-slate-200 text-\[15px\] md:text-base leading-relaxed space-y-4 font-medium">
             \$\{conceptText\.split\('\\n'\)\.map\(p => `<p>\$\{p\}<\/p>`\)\.join\(''\)\}
          </div>'''

repl = r'''<!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
          <div class="w-full mb-6 mt-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950">
              <img src="assets/img/lesson_m${modNumber}_p${pIndex+1}.jpg" 
                   onerror="this.src='https://picsum.photos/seed/psy_m${modNumber}_p${pIndex+1}/800/400'; this.classList.add('opacity-40', 'grayscale')" 
                   alt="Ilustración de ${pillar.title}" 
                   class="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105 preserve-color mix-blend-lighten">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-4">
                  <span class="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase"><i class="fa-solid fa-camera text-slate-500 mr-1"></i> Fig 1. Aplicación Práctica: ${pillar.title}</span>
              </div>
          </div>
          <div class="text-slate-200 text-[15px] md:text-base leading-relaxed space-y-4 font-medium">
             ${conceptText.split('\\n').map(p => `<p>${p}</p>`).join('')}
          </div>'''

content = re.sub(target, repl, content)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Injected lesson images into app.js properly')
