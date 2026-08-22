import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to inject the "Lectura del Libro Original" section into openLessonModal
target = '<!-- DIAGRAMA EDUCATIVO -->'
new_html = '''<!-- DIAGRAMA EDUCATIVO -->'''

# Let's add it right after DIAGRAMA EDUCATIVO, but before the end of the contentHtml string.
# Actually, looking at the previous injections, let's inject right at the end of the inner HTML of the modal content, before the closing `</div>` of the grid.
# Wait, let's look for "</div>\n      </div>\n    `;\n\n    const contentDiv = document.getElementById('modalContent');"

end_target = "`;\n\n    const contentDiv = document.getElementById('modalContent');"

injection = '''
        <!-- 6. LECTURA COMPLETA (LIBRO ORIGINAL) -->
        ${pillar.chapters && pillar.chapters.length > 0 ? `
        <div class="lg:col-span-2 mt-8">
          <div class="text-[12px] text-indigo-400 font-bold font-mono tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (CAPÍTULOS ORIGINALES)
          </div>
          <div class="space-y-6">
            ${pillar.chapters.map((chapterName, idx) => {
               const rawMd = window.BOOK_CONTENT && window.BOOK_CONTENT[chapterName] ? window.BOOK_CONTENT[chapterName] : 'Contenido no encontrado.';
               // Fallback if marked is not loaded for some reason, though we injected it
               const parsedHtml = typeof marked !== 'undefined' ? marked.parse(rawMd) : '<pre class="whitespace-pre-wrap text-sm text-slate-300">' + rawMd + '</pre>';
               return `
                 <div class="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
                   <div class="bg-slate-800/80 px-6 py-3 border-b border-slate-700/50 flex justify-between items-center cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('i.fa-chevron-down').classList.toggle('rotate-180')">
                     <span class="font-bold text-slate-200 font-serif">Sección ${idx+1}: ${chapterName.replace(/_/g, ' ').replace('Tema', 'Capítulo')}</span>
                     <i class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300"></i>
                   </div>
                   <div class="hidden p-6 lg:p-10 prose prose-invert prose-indigo max-w-none prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-indigo-400">
                     ${parsedHtml}
                   </div>
                 </div>
               `;
            }).join('')}
          </div>
        </div>
        ` : ''}
'''

if end_target in content:
    content = content.replace(end_target, injection + end_target)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected LECTURA COMPLETA into app.js")
else:
    print("Could not find end_target in app.js")
