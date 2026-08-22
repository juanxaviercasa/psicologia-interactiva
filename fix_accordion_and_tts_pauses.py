import os
import re
import json

MD_DIR = 'Psicologia_Oscura'
BOOK_JS = 'js/book_content.js'
APP_JS = 'js/app.js'

print("=== FIX 1: REPARAR PUNTUACIÓN Y ESPACIADO EN LOS 76 ARCHIVOS ===")

files = [f for f in os.listdir(MD_DIR) if f.endswith('.md')]
files.sort()

cleaned_corpus = {}

for f in files:
    path = os.path.join(MD_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        text = fh.read()
    
    # 1. Asegurar espacio después de puntos, comas, dos puntos y punto y coma
    text = re.sub(r'([a-záéíóúÁÉÍÓÚA-Z0-9])\.([A-ZÁÉÍÓÚ])', r'\1. \2', text)
    text = re.sub(r'([a-záéíóúÁÉÍÓÚA-Z0-9]),([a-záéíóúÁÉÍÓÚA-Z])', r'\1, \2', text)
    text = re.sub(r'([a-záéíóúÁÉÍÓÚA-Z0-9]):([a-záéíóúÁÉÍÓÚA-Z])', r'\1: \2', text)
    text = re.sub(r'([a-záéíóúÁÉÍÓÚA-Z0-9]);([a-záéíóúÁÉÍÓÚA-Z])', r'\1; \2', text)
    
    # 2. Asegurar espacio después de signos de interrogación y exclamación
    text = re.sub(r'\?([A-ZÁÉÍÓÚa-záéíóú])', r'? \1', text)
    text = re.sub(r'!([A-ZÁÉÍÓÚa-záéíóú])', r'! \1', text)
    text = re.sub(r'\.\.\.([A-ZÁÉÍÓÚa-záéíóú])', r'... \1', text)
    
    # 3. Eliminar signos de interrogación dobles / rotos
    text = re.sub(r'\?{2,}', '¿', text)
    text = re.sub(r'¿\s*¿', '¿', text)
    
    # 4. Normalizar saltos de línea
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()
    
    with open(path, 'w', encoding='utf-8') as out_fh:
        out_fh.write(text)
    
    key = f.replace('.md', '')
    cleaned_corpus[key] = text

# Recompilar book_content.js
js_code = "var BOOK_CONTENT = " + json.dumps(cleaned_corpus, ensure_ascii=False) + ";\nwindow.BOOK_CONTENT = BOOK_CONTENT;\n"
with open(BOOK_JS, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Puntuación normalizada en los 76 archivos y {BOOK_JS} actualizado.")

print("\n=== FIX 2: REPARAR ESTRUCTURA DEL ACORDEÓN Y AGREGAR PAUSAS NATURALES AL TTS EN APP.JS ===")

with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Agregar función toggleChapterReader a App
toggle_fn = '''
  toggleChapterReader(contentId, headerEl) {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;
    
    const isHidden = contentEl.classList.contains('hidden');
    contentEl.classList.toggle('hidden');
    
    const chevron = headerEl.querySelector('.fa-chevron-down');
    if (chevron) {
      if (isHidden) {
        chevron.classList.add('rotate-180');
      } else {
        chevron.classList.remove('rotate-180');
      }
    }
    
    if (isHidden && typeof mermaid !== 'undefined') {
      setTimeout(() => {
        try {
          mermaid.init(undefined, contentEl.querySelectorAll('.mermaid'));
        } catch(e) {}
      }, 50);
    }
  },
'''

if 'toggleChapterReader(' not in app_js:
    idx_tts = app_js.find('ttsState:')
    if idx_tts != -1:
        app_js = app_js[:idx_tts] + toggle_fn + '\n  ' + app_js[idx_tts:]
        print("Añadida función App.toggleChapterReader")

# 2. Actualizar el renderizado del acordeón en openLessonModal
old_ch_block = re.search(r'// Append Extended Reading Chapters[\s\S]*?contentHtml \+= chaptersHtml;\s*\}', app_js)

new_ch_block = '''// Append Extended Reading Chapters
    if (pillar.chapters && pillar.chapters.length > 0) {
      const bookStore = (typeof BOOK_CONTENT !== 'undefined' ? BOOK_CONTENT : null) || (typeof window !== 'undefined' ? window.BOOK_CONTENT : null) || {};
      
      let chaptersHtml = `
        <div class="lg:col-span-2 mt-8">
          <div class="text-[12px] text-cyan-400 font-bold font-mono tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO COMPLETO ORIGINAL)
          </div>
          <div class="space-y-4">
      `;
      
      pillar.chapters.forEach((chapterName, idx) => {
         const rawMd = bookStore[chapterName] || 'Contenido del capítulo no disponible.';
         
         // Parse markdown safely
         let parsedHtml = '';
         if (typeof marked !== 'undefined') {
            parsedHtml = typeof marked.parse === 'function' ? marked.parse(rawMd) : marked(rawMd);
         } else {
            parsedHtml = '<div class="whitespace-pre-wrap text-slate-300 font-sans leading-relaxed text-sm">' + rawMd + '</div>';
         }
         
         const cleanTitle = chapterName.replace(/_/g, ' ').replace(/^Tema\s*\d+\s*/i, '').trim();
         const contentId = `chapter-drawer-${modNumber}-${pIndex}-${idx}`;
         
         chaptersHtml += `
           <div class="bg-slate-900/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
             <!-- Header del Acordeón -->
             <div class="bg-slate-800/90 hover:bg-slate-700/80 px-6 py-4 border-b border-slate-700/60 flex justify-between items-center cursor-pointer transition-colors" onclick="App.toggleChapterReader('${contentId}', this)">
               <div class="flex items-center gap-3">
                 <span class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">${idx + 1}</span>
                 <span class="font-bold text-slate-100 font-serif text-base">${cleanTitle || chapterName}</span>
               </div>
               <div class="flex items-center gap-3">
                 <!-- Botón de Audio Narración -->
                 <button onclick="event.stopPropagation(); App.toggleAudioNarration('${chapterName}', this)" class="narration-btn px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm" title="Escuchar este capítulo con voz natural">
                   <i class="fa-solid fa-volume-high text-indigo-400"></i>
                   <span class="btn-text">Escuchar</span>
                 </button>
                 <i class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300"></i>
               </div>
             </div>
             <!-- Cuerpo del Texto Desplegable -->
             <div id="${contentId}" class="hidden p-6 sm:p-8 prose-editorial max-w-none prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-cyan-300 bg-[#090e17]/80">
               ${parsedHtml}
             </div>
           </div>
         `;
      });
      chaptersHtml += `</div></div>`;
      contentHtml += chaptersHtml;
    }'''

if old_ch_block:
    app_js = app_js[:old_ch_block.start()] + new_ch_block + app_js[old_ch_block.end():]
    print("Reemplazado bloque del acordeón con IDs únicos y cierre de etiquetas perfecto.")

# 3. Mejorar el TTS Chunking con Pausas Naturales y Cadencia Humana
old_tts_play = re.search(r'playNextTTSChunk\(\)\s*\{[\s\S]*?window\.speechSynthesis\.speak\(u\);\s*\}', app_js)

new_tts_play = '''playNextTTSChunk() {
    const state = this.ttsState;
    if (!state.activeChapter || state.currentIndex >= state.utterances.length) {
      this.stopAudioNarration();
      return;
    }

    const chunk = state.utterances[state.currentIndex];
    const u = new SpeechSynthesisUtterance(chunk);
    u.lang = 'es-ES';
    u.rate = 0.92; // Cadencia tranquila y comprensible
    u.pitch = 1.0;
    if (state.selectedVoice) u.voice = state.selectedVoice;

    // Calcular pausa natural según el signo de puntuación final
    let pauseMs = 380; // Pausa estándar de 380ms para punto seguido
    if (chunk.endsWith('?') || chunk.endsWith('!')) {
      pauseMs = 450;
    } else if (chunk.endsWith(':') || chunk.endsWith(';')) {
      pauseMs = 250;
    } else if (chunk.endsWith(',')) {
      pauseMs = 180;
    }

    u.onend = () => {
      if (!state.isPaused && state.activeChapter) {
        state.currentIndex++;
        // Respiración / Pausa humana antes de la siguiente oración
        setTimeout(() => {
          if (!state.isPaused && state.activeChapter) {
            this.playNextTTSChunk();
          }
        }, pauseMs);
      }
    };

    u.onerror = (e) => {
      console.warn('TTS chunk error:', e);
      state.currentIndex++;
      setTimeout(() => this.playNextTTSChunk(), 200);
    };

    window.speechSynthesis.speak(u);
  }'''

if old_tts_play:
    app_js = app_js[:old_tts_play.start()] + new_tts_play + app_js[old_tts_play.end():]
    print("Actualizado playNextTTSChunk con pausas naturales de respiración según puntuación.")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("=== FIX COMPLETADO CON ÉXITO ===")
