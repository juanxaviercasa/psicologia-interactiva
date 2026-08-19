import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the random picsum fallback from lesson images and replace with a proper placeholder
old_img = '''<!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
          <div class="w-full mb-6 mt-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950">
              <img src="assets/img/lesson_m${modNumber}_p${pIndex+1}.jpg" 
                   onerror="this.src='https://picsum.photos/seed/psy_m${modNumber}_p${pIndex+1}/800/400'; this.classList.add('opacity-40', 'grayscale')" 
                   alt="Ilustración de ${pillar.title}" 
                   class="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105 preserve-color mix-blend-lighten">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-4">
                  <span class="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase"><i class="fa-solid fa-camera text-slate-500 mr-1"></i> Fig 1. Aplicación Práctica: ${pillar.title}</span>
              </div>
          </div>'''

new_img = '''<!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
          <div class="lesson-img-container w-full mb-6 mt-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950" id="lesson-img-m${modNumber}-p${pIndex+1}">
              <img src="assets/img/lesson_m${modNumber}_p${pIndex+1}.jpg" 
                   alt="Ilustración de ${pillar.title}" 
                   class="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105 preserve-color"
                   onerror="this.parentElement.querySelector('.img-placeholder').style.display='flex'; this.style.display='none'">
              <div class="img-placeholder hidden w-full h-48 md:h-64 flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950 border-0">
                  <i class="fa-solid ${modIcon} text-5xl text-indigo-400/60"></i>
                  <span class="text-xs text-slate-500 font-mono text-center px-4">Ilustración educativa en preparación</span>
                  <span class="text-[10px] text-slate-600 font-mono text-center px-8">${pillar.title}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-4">
                  <span class="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase"><i class="fa-solid fa-image text-slate-500 mr-1"></i> Fig 1. Aplicación Práctica: ${pillar.title}</span>
              </div>
          </div>'''

content = content.replace(old_img, new_img)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed lesson image placeholder - removed random picsum images')
