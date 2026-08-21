with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Inject the diagram image BEFORE the existing mermaid diagram block
# The section starts with: <!-- MAPA MENTAL -->
old_mindmap = "<!-- MAPA MENTAL -->\n        ${pillar.diagram ? `\n        <div class=\"p-6 rounded-2xl bg-slate-900 border border-cyan-500/20 lg:col-span-2 overflow-x-auto\">\n          <div class=\"text-[11px] text-cyan-400 font-bold font-mono tracking-widest mb-4\"><i class=\"fa-solid fa-sitemap\"></i> 5. ARQUITECTURA VISUAL (MAPA MENTAL)</div>\n          <div class=\"mermaid text-sm flex justify-center\">${pillar.diagram}</d"

# Instead of exact replacement of a truncated string, let's find and inject before this section
target_comment = '<!-- MAPA MENTAL -->'
target_idx = content.find(target_comment)
if target_idx != -1:
    diagram_block = '''<!-- DIAGRAMA EDUCATIVO -->
        <div class="lg:col-span-2">
          <div class="text-[11px] text-slate-500 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-diagram-project text-slate-500 mr-1"></i> DIAGRAMA DEL MECANISMO INTERNO</div>
          <div class="relative w-full rounded-xl overflow-hidden border border-slate-700 shadow-md bg-slate-950 group" style="padding-top:56.25%;">
            <img src="assets/img/diagram_m${modNumber}_p${pIndex+1}.jpg"
                 alt="Diagrama ${pillar.title}"
                 class="absolute inset-0 w-full h-full object-contain bg-slate-950 transition-transform duration-500 group-hover:scale-105"
                 onerror="this.parentElement.parentElement.style.display='none'">
          </div>
        </div>

        '''
    content = content[:target_idx] + diagram_block + content[target_idx:]
    print('Diagram section injected OK')
else:
    print('MAPA MENTAL comment not found')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Step 3 done.')
