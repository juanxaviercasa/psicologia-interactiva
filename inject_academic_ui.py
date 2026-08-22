import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<!-- DIAGRAMA EDUCATIVO -->'
new_html = '''${pillar.clinicalCase ? `
        <!-- CASO CLÍNICO DOCUMENTADO -->
        <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 lg:col-span-2 shadow-inner mb-4">
          <div class="text-[11px] text-amber-500 font-bold font-mono tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-file-medical"></i> EVIDENCIA EMPÍRICA: CASO CLÍNICO
          </div>
          <div class="text-slate-300 text-[15px] md:text-base leading-relaxed italic border-l-4 border-amber-500/30 pl-4 bg-slate-900/30 p-4 rounded-r-xl">
             ${this.enrichTextWithIcons(pillar.clinicalCase)}
          </div>
        </div>` : ''}
        
        ${pillar.academicCitation ? `
        <!-- RESPALDO ACADÉMICO -->
        <div class="p-5 rounded-xl bg-slate-950 border border-slate-800 lg:col-span-2 shadow-sm flex items-start gap-4 mb-4">
          <div class="text-slate-600 text-2xl pt-1 shrink-0"><i class="fa-solid fa-graduation-cap"></i></div>
          <div>
            <div class="text-[10px] text-slate-500 font-bold font-mono tracking-widest uppercase mb-1">Respaldo Académico / Científico</div>
            <div class="text-slate-400 text-xs leading-relaxed font-serif">
               ${pillar.academicCitation}
            </div>
          </div>
        </div>` : ''}

        <!-- DIAGRAMA EDUCATIVO -->'''

if target in content and "<!-- CASO CLÍNICO DOCUMENTADO -->" not in content:
    content = content.replace(target, new_html)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected new fields into app.js")
else:
    print("Target not found or already injected")
