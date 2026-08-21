with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# EXACT marker is: <!-- 5. MAPA MENTAL -->
target = '<!-- 5. MAPA MENTAL -->'
target_idx = content.find(target)
print(f'Target found at: {target_idx}')
if target_idx != -1:
    diagram_block = (
        '<!-- DIAGRAMA EDUCATIVO -->\n'
        '        <div class="lg:col-span-2">\n'
        '          <div class="text-[11px] text-slate-500 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-diagram-project text-slate-500 mr-1"></i> DIAGRAMA DEL MECANISMO INTERNO</div>\n'
        '          <div class="relative w-full rounded-xl overflow-hidden border border-slate-700 shadow-md bg-slate-950 group" style="padding-top:56.25%;">\n'
        '            <img src="assets/img/diagram_m${modNumber}_p${pIndex+1}.jpg"\n'
        '                 alt="Diagrama ${pillar.title}"\n'
        '                 class="absolute inset-0 w-full h-full object-contain bg-slate-950 transition-transform duration-500 group-hover:scale-105"\n'
        '                 onerror="this.parentElement.parentElement.style.display=\'none\'">\n'
        '          </div>\n'
        '        </div>\n\n        '
    )
    content = content[:target_idx] + diagram_block + content[target_idx:]
    print('Diagram block injected OK')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
