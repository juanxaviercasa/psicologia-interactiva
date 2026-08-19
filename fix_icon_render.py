with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_placeholder = '''              <div class="img-placeholder hidden w-full h-48 md:h-64 flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950 border-0">
                  <i class="fa-solid ${modIcon} text-5xl text-indigo-400/60"></i>
                  <span class="text-xs text-slate-500 font-mono text-center px-4">Ilustración educativa en preparación</span>
                  <span class="text-[10px] text-slate-600 font-mono text-center px-8">${pillar.title}</span>
              </div>'''

new_placeholder = '''              <div class="img-placeholder hidden w-full h-48 md:h-64 flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950 border-0">
                  <div class="text-5xl text-indigo-400/60">${modIcon}</div>
                  <span class="text-xs text-slate-500 font-mono text-center px-4">Ilustración educativa en preparación</span>
                  <span class="text-[10px] text-slate-600 font-mono text-center px-8">${pillar.title}</span>
              </div>'''

content = content.replace(old_placeholder, new_placeholder)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed icon rendering in placeholder')
