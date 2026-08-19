import re

def refactor_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Make the modal wider: max-w-3xl -> max-w-5xl (to give it plenty of space for the grid)
    # Also adjust the footer to be more compact if we want, but the grid will already solve the vertical issue.
    content = content.replace('max-w-3xl', 'max-w-5xl')
    
    # Make the header and footer paddings a bit more compact
    content = content.replace('p-4 sm:p-5 border-b', 'p-3 sm:p-4 border-b')
    content = content.replace('p-5 sm:p-8 space-y-6', 'p-4 sm:p-6')
    content = content.replace('p-4 sm:p-6 bg-slate-950', 'p-3 sm:p-4 bg-slate-950')
    content = content.replace('py-3.5', 'py-2.5') # Make button slightly less tall

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

def refactor_app():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace the content generation inside openLessonModal
    start_marker = "const content = `"
    end_marker = "    document.getElementById('lessonModalContent').innerHTML = content;"
    
    start_idx = content.find("openLessonModal(modNumber, pIndex) {")
    if start_idx == -1:
        print("Could not find openLessonModal")
        return
        
    chunk_start = content.find(start_marker, start_idx)
    chunk_end = content.find(end_marker, chunk_start)
    
    if chunk_start != -1 and chunk_end != -1:
        # The new grid layout
        new_content_js = """const content = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <!-- 1. CONCEPTO (Full width) -->
        <div class="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 lg:col-span-2 shadow-inner">
          <div class="text-[11px] text-amber-500 font-bold font-mono tracking-widest mb-3 flex justify-between items-center">
            <span><i class="fa-solid fa-eye"></i> 1. RECONOCIMIENTO (EL CONCEPTO)</span>
            <button onclick="App.speakText('${pillar.concept.replace(/'/g, "\\'")}')" class="text-amber-500 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors"><i class="fa-solid fa-volume-high"></i> Escuchar</button>
          </div>
          <p class="text-slate-200 text-lg md:text-xl leading-relaxed">${pillar.concept}</p>
        </div>

        <!-- 2. AMENAZA REAL (Half width on desktop) -->
        <div class="p-5 rounded-2xl bg-rose-950/20 border-l-4 border-rose-500 flex flex-col justify-center">
          <div class="text-[11px] text-rose-400 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-triangle-exclamation"></i> 2. ANCLAJE CONTEXTUAL (AMENAZA REAL)</div>
          <p class="text-rose-100 italic text-sm md:text-base leading-relaxed">"${pillar.realExample}"</p>
        </div>

        <!-- 3. DEFENSA (Half width on desktop) -->
        <div class="p-5 rounded-2xl bg-emerald-950/20 border-l-4 border-emerald-500 flex flex-col justify-center">
          <div class="text-[11px] text-emerald-400 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-shield-halved"></i> 3. CODIFICACIÓN TÁCTICA (DEFENSA)</div>
          <p class="text-emerald-100 font-medium text-sm md:text-base leading-relaxed">${pillar.tacticalRule}</p>
        </div>

        <!-- 4. NEUROBIOLOGÍA (Full width at bottom) -->
        ${pillar.deepDive ? `
        <div class="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 relative overflow-hidden lg:col-span-2">
          <div class="absolute -right-4 -bottom-4 text-indigo-500/10 text-8xl"><i class="fa-solid fa-microscope"></i></div>
          <div class="text-[11px] text-indigo-400 font-bold font-mono tracking-widest mb-2 relative z-10"><i class="fa-solid fa-network-wired"></i> 4. CONSOLIDACIÓN PROFUNDA (NEUROBIOLOGÍA)</div>
          <p class="text-indigo-200 text-sm md:text-base leading-relaxed relative z-10">${pillar.deepDive}</p>
        </div>
        ` : ''}
      </div>
    `;
"""
        
        content = content[:chunk_start] + new_content_js + content[chunk_end:]
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("JS app refactored successfully!")
    else:
        print("Could not find markers in app.js")

refactor_index()
refactor_app()
