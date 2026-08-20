with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: Replace fixed height lesson image with proper aspect-ratio container
old_lesson_img = '''<!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
          <div class="lesson-img-container w-full mb-6 mt-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950" id="lesson-img-m${modNumber}-p${pIndex+1}">
              <img src="assets/img/lesson_m${modNumber}_p${pIndex+1}.jpg" 
                   alt="Ilustración de ${pillar.title}" 
                   class="w-full h-52 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                   onerror="this.parentElement.querySelector('.img-placeholder').style.display='flex'; this.style.display='none'">
              <div class="img-placeholder hidden w-full h-48 md:h-64 flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950 border-0">
                  <div class="text-5xl text-indigo-400/60">${modIcon}</div>
                  <span class="text-xs text-slate-500 font-mono text-center px-4">Ilustración educativa en preparación</span>
                  <span class="text-[10px] text-slate-600 font-mono text-center px-8">${pillar.title}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-4">
                  <span class="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase"><i class="fa-solid fa-image text-slate-500 mr-1"></i> Fig 1. Aplicación Práctica: ${pillar.title}</span>
              </div>
          </div>'''

new_lesson_img = '''<!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
          <div class="lesson-img-container w-full mb-6 mt-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950" id="lesson-img-m${modNumber}-p${pIndex+1}">
              <!-- Aspect ratio 16:9 wrapper — prevents any stretching/pixelation -->
              <div class="relative w-full" style="padding-top: 56.25%;">
                  <img src="assets/img/lesson_m${modNumber}_p${pIndex+1}.jpg" 
                       alt="Ilustración de ${pillar.title}" 
                       class="absolute inset-0 w-full h-full object-contain bg-slate-950 transition-transform duration-700 group-hover:scale-105"
                       onerror="this.parentElement.parentElement.querySelector('.img-placeholder').style.display='flex'; this.parentElement.style.display='none'">
              </div>
              <div class="img-placeholder hidden w-full aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950">
                  <div class="text-5xl text-indigo-400/60">${modIcon}</div>
                  <span class="text-xs text-slate-500 font-mono text-center px-4">Ilustración educativa en preparación</span>
                  <span class="text-[10px] text-slate-600 font-mono text-center px-8">${pillar.title}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-3">
                  <span class="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase"><i class="fa-solid fa-image text-slate-500 mr-1"></i> Fig 1. Aplicación Práctica: ${pillar.title}</span>
              </div>
          </div>'''

if old_lesson_img in content:
    content = content.replace(old_lesson_img, new_lesson_img)
    print('Lesson image fixed: now uses 16:9 aspect ratio, no distortion')
else:
    print('Pattern not found - searching for fragment...')
    idx = content.find('lesson-img-container')
    if idx != -1:
        print(content[idx:idx+300])

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
