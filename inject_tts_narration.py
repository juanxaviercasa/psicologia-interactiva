import re

# 1. Update app.js to include the advanced TTS Engine and Chapter Narration Controls

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# TTS Engine implementation to attach to App
tts_engine_code = '''
  // ==========================================
  // ADVANCED NEURAL TTS NARRATION ENGINE
  // ==========================================
  ttsState: {
    activeChapter: null,
    activeButton: null,
    utterances: [],
    currentIndex: 0,
    isPaused: false,
    selectedVoice: null
  },

  initTTSVoices() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Prioritize natural / neural Spanish voices
          const esVoices = voices.filter(v => v.lang.startsWith('es'));
          const neuralVoice = esVoices.find(v => 
            v.name.includes('Natural') || 
            v.name.includes('Online') || 
            v.name.includes('Neural') || 
            v.name.includes('Google español')
          );
          this.ttsState.selectedVoice = neuralVoice || esVoices[0] || null;
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  },

  stripMarkdownForTTS(md) {
    if (!md) return '';
    return md
      .replace(/```mermaid[\\s\\S]*?```/g, '') // remove mermaid diagrams
      .replace(/```[\\s\\S]*?```/g, '')        // remove code blocks
      .replace(/`[^`]*`/g, '')                 // remove inline code
      .replace(/!\[.*?\]\(.*?\)/g, '')         // remove images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')      // keep link text
      .replace(/^#{1,6}\s+/gm, '')             // remove headings
      .replace(/>\s*\[!.*?\]/g, '')            // remove alert markers
      .replace(/>/g, '')                       // remove blockquotes
      .replace(/[*_~]{1,3}/g, '')              // remove bold/italic/strikethrough
      .replace(/📖|🔥|🧠|🏛️|✅|❌|⚠️|🚀|💡|🎉|✍️|📦|📁/g, '') // remove emojis
      .replace(/\\s+/g, ' ')                   // normalize spaces
      .trim();
  },

  toggleAudioNarration(chapterKey, btn) {
    if (!('speechSynthesis' in window)) {
      this.showToast('Tu navegador no soporta síntesis de voz.', 'error');
      return;
    }

    const state = this.ttsState;

    // Case 1: If clicked the active chapter currently speaking -> Pause / Resume
    if (state.activeChapter === chapterKey) {
      if (state.isPaused) {
        window.speechSynthesis.resume();
        state.isPaused = false;
        btn.innerHTML = '<i class="fa-solid fa-pause text-amber-400 animate-pulse"></i> <span class="btn-text text-amber-300">Pausar</span>';
        btn.classList.add('bg-amber-950/90', 'border-amber-500/60');
      } else {
        window.speechSynthesis.pause();
        state.isPaused = true;
        btn.innerHTML = '<i class="fa-solid fa-play text-cyan-400"></i> <span class="btn-text text-cyan-300">Reanudar</span>';
        btn.classList.remove('bg-amber-950/90');
        btn.classList.add('bg-cyan-950/90', 'border-cyan-500/60');
      }
      return;
    }

    // Case 2: Stop any previous playback
    this.stopAudioNarration();

    // Case 3: Start speaking the new chapter
    const bookStore = (typeof BOOK_CONTENT !== 'undefined' ? BOOK_CONTENT : null) || window.BOOK_CONTENT || {};
    const rawText = bookStore[chapterKey] || '';
    const cleanText = this.stripMarkdownForTTS(rawText);

    if (!cleanText || cleanText.length < 5) {
      this.showToast('No hay texto para narrar en este capítulo.', 'error');
      return;
    }

    // Ensure voices are loaded
    if (!state.selectedVoice) this.initTTSVoices();

    // Chunk text into natural sentences to bypass Chrome 15s freeze bug
    const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
    state.utterances = sentences.map(s => s.trim()).filter(s => s.length > 0);
    state.currentIndex = 0;
    state.activeChapter = chapterKey;
    state.activeButton = btn;
    state.isPaused = false;

    // Update Button UI
    btn.innerHTML = '<i class="fa-solid fa-pause text-amber-400 animate-pulse"></i> <span class="btn-text text-amber-300">Pausar</span>';
    btn.classList.add('bg-amber-950/90', 'border-amber-500/60');

    this.showToast('Iniciando audio narración del capítulo...', 'info');
    this.playNextTTSChunk();
  },

  playNextTTSChunk() {
    const state = this.ttsState;
    if (!state.activeChapter || state.currentIndex >= state.utterances.length) {
      this.stopAudioNarration();
      return;
    }

    const chunk = state.utterances[state.currentIndex];
    const u = new SpeechSynthesisUtterance(chunk);
    u.lang = 'es-ES';
    u.rate = 1.0;
    u.pitch = 1.0;
    if (state.selectedVoice) u.voice = state.selectedVoice;

    u.onend = () => {
      state.currentIndex++;
      this.playNextTTSChunk();
    };

    u.onerror = (e) => {
      console.warn('TTS chunk error:', e);
      state.currentIndex++;
      this.playNextTTSChunk();
    };

    window.speechSynthesis.speak(u);
  },

  stopAudioNarration() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const state = this.ttsState;
    if (state.activeButton) {
      state.activeButton.innerHTML = '<i class="fa-solid fa-volume-high text-indigo-400"></i> <span class="btn-text">Escuchar</span>';
      state.activeButton.classList.remove('bg-amber-950/90', 'border-amber-500/60', 'bg-cyan-950/90', 'border-cyan-500/60');
    }
    state.activeChapter = null;
    state.activeButton = null;
    state.utterances = [];
    state.currentIndex = 0;
    state.isPaused = false;
  },
'''

# 1. Inject tts_engine_code into App object (e.g. before speakText or init)
if 'ttsState:' not in app_js:
    idx = app_js.find('speakText(text)')
    if idx != -1:
        app_js = app_js[:idx] + tts_engine_code + '\n  ' + app_js[idx:]
        print("Injected TTS narration engine into App")

# 2. Inject call to initTTSVoices() in App.init()
if 'this.initTTSVoices()' not in app_js:
    idx_init = app_js.find('init() {')
    if idx_init != -1:
        end_brace = app_js.find('{', idx_init) + 1
        app_js = app_js[:end_brace] + '\n    this.initTTSVoices();' + app_js[end_brace:]
        print("Added this.initTTSVoices() to App.init()")

# 3. Stop narration when lesson modal closes
if 'this.stopAudioNarration()' not in app_js:
    idx_close = app_js.find('closeLessonModal() {')
    if idx_close != -1:
        end_brace = app_js.find('{', idx_close) + 1
        app_js = app_js[:end_brace] + '\n    this.stopAudioNarration();' + app_js[end_brace:]
        print("Added stopAudioNarration to closeLessonModal()")

# 4. Update the Accordion Header in renderLearningPath / openLessonModal to include the audio button!
old_accordion_header = re.search(r'<div class="bg-slate-800/90 hover:bg-slate-700/80 px-6 py-4[\s\S]*?<i class="fa-solid fa-chevron-down', app_js)

new_accordion_header = '''<div class="bg-slate-800/90 hover:bg-slate-700/80 px-6 py-4 border-b border-slate-700/60 flex justify-between items-center cursor-pointer transition-colors" onclick="const p = this.nextElementSibling; p.classList.toggle('hidden'); this.querySelector('.fa-chevron-down').classList.toggle('rotate-180'); if(!p.classList.contains('hidden') && typeof mermaid !== 'undefined') { setTimeout(() => { try { mermaid.init(undefined, p.querySelectorAll('.mermaid')); } catch(e){} }, 50); }">
               <div class="flex items-center gap-3">
                 <span class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">${idx + 1}</span>
                 <span class="font-bold text-slate-100 font-serif text-base">${cleanTitle || chapterName}</span>
               </div>
               <div class="flex items-center gap-3">
                 <!-- BOTON DE AUDIO NARRACIÓN -->
                 <button onclick="event.stopPropagation(); App.toggleAudioNarration('${chapterName}', this)" class="narration-btn px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm" title="Escuchar este capítulo con voz natural">
                   <i class="fa-solid fa-volume-high text-indigo-400"></i>
                   <span class="btn-text">Escuchar</span>
                 </button>
                 <i class="fa-solid fa-chevron-down'''

if old_accordion_header:
    app_js = app_js[:old_accordion_header.start()] + new_accordion_header + app_js[old_accordion_header.end():]
    print("Injected audio narration button into chapter accordions in app.js")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Audio engine update completed!")
