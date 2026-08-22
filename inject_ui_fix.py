import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = "document.getElementById('lessonModalContent').innerHTML = contentHtml;"
injection = '''
    // Append Extended Reading Chapters
    if (pillar.chapters && pillar.chapters.length > 0) {
      let chaptersHtml = `
        <div class="lg:col-span-2 mt-8">
          <div class="text-[12px] text-indigo-400 font-bold font-mono tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO ORIGINAL)
          </div>
          <div class="space-y-6">
      `;
      pillar.chapters.forEach((chapterName, idx) => {
         const rawMd = window.BOOK_CONTENT && window.BOOK_CONTENT[chapterName] ? window.BOOK_CONTENT[chapterName] : 'Contenido no encontrado.';
         const parsedHtml = typeof marked !== 'undefined' ? marked.parse(rawMd) : '<pre class="whitespace-pre-wrap text-sm text-slate-300">' + rawMd + '</pre>';
         chaptersHtml += `
           <div class="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
             <div class="bg-slate-800/80 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center cursor-pointer hover:bg-slate-700/60 transition-colors" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('i.fa-chevron-down').classList.toggle('rotate-180')">
               <span class="font-bold text-slate-200 font-serif text-lg">Sección ${idx+1}: ${chapterName.replace(/_/g, ' ').replace('Tema', 'Capítulo')}</span>
               <i class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300"></i>
             </div>
             <div class="hidden p-6 lg:p-10 prose prose-invert prose-indigo max-w-none prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-indigo-400">
               ${parsedHtml}
             </div>
           </div>
         `;
      });
      chaptersHtml += `</div></div>`;
      
      // Inject it right before the last closing div of the grid
      contentHtml += chaptersHtml;
    }
'''

if target in content and "Lectura del Libro Original" not in content and "LECTURA PROFUNDA" not in content:
    content = content.replace(target, injection + "\n    " + target)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected LECTURA PROFUNDA successfully!")
else:
    print("Target not found or already injected.")
