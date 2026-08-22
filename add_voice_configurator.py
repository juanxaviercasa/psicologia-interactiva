import re

HTML_FILE = 'index.html'
APP_JS = 'js/app.js'

print("=== 1. AGREGANDO MODAL DE CONFIGURADOR DE VOZ EN INDEX.HTML ===")

with open(HTML_FILE, 'r', encoding='utf-8') as f:
    html = f.read()

voice_modal_html = '''
  <!-- MODAL DE CONFIGURACIÓN DE VOZ TTS -->
  <div id="voiceSettingsModal" class="hidden fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
    <div class="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(99,102,241,0.25)] relative overflow-hidden flex flex-col gap-5">
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-2">
          <i class="fa-solid fa-sliders text-indigo-400"></i> Configurador de Voz Neural
        </h3>
        <button onclick="document.getElementById('voiceSettingsModal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-500 transition-colors flex items-center justify-center">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Selector de Voz -->
      <div class="space-y-2">
        <label class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <i class="fa-solid fa-microphone-lines text-cyan-400"></i> Voz del Narrador (Masculina / Femenina):
        </label>
        <select id="ttsVoiceSelect" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 custom-scrollbar">
          <option value="">Cargando voces disponibles...</option>
        </select>
        <p class="text-[11px] text-slate-500">Detectamos automáticamente todas las voces naturales instaladas en tu navegador y sistema operativo.</p>
      </div>

      <!-- Velocidad de Reproducción -->
      <div class="space-y-2">
        <div class="flex justify-between items-center text-xs font-mono font-bold text-slate-300 uppercase">
          <span class="flex items-center gap-1.5"><i class="fa-solid fa-gauge-high text-amber-400"></i> Velocidad de Lectura:</span>
          <span id="ttsSpeedLabel" class="text-amber-400">0.92x</span>
        </div>
        <input type="range" id="ttsSpeedRange" min="0.7" max="1.4" step="0.05" value="0.92" class="w-full accent-indigo-500 cursor-pointer" oninput="document.getElementById('ttsSpeedLabel').innerText = this.value + 'x'">
      </div>

      <!-- Botones de Acción -->
      <div class="flex items-center gap-3 pt-2">
        <button onclick="App.testVoice()" class="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
          <i class="fa-solid fa-play text-cyan-400"></i> Probar Voz
        </button>
        <button onclick="App.saveVoiceSettings()" class="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
          <i class="fa-solid fa-check"></i> Guardar Ajustes
        </button>
      </div>
    </div>
  </div>
'''

if 'id="voiceSettingsModal"' not in html:
    idx_scripts = html.find('<!-- Scripts Neural OS -->')
    if idx_scripts != -1:
        html = html[:idx_scripts] + voice_modal_html + '\n  ' + html[idx_scripts:]
        with open(HTML_FILE, 'w', encoding='utf-8') as f:
            f.write(html)
        print("Inyectado modal de configuración de voz en index.html")
    else:
        print("Marker <!-- Scripts Neural OS --> not found")
else:
    print("Modal voiceSettingsModal already present in index.html")

print("\n=== 2. ACTUALIZANDO APP.JS (CONFIGURADOR DE VOZ + LIMPIEZA DE BOTÓN INÚTIL) ===")

with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Quitar el botón viejo que estaba arriba sobre la imagen
old_root_btn = re.search(r'<button onclick="App\.speakText[\s\S]*?</button>', app_js)
if old_root_btn:
    # Check if inside LA RAÍZ header
    idx_raiz = app_js.find('1. LA RAÍZ')
    if idx_raiz != -1:
        idx_btn = app_js.find('<button onclick="App.speakText', idx_raiz)
        idx_btn_end = app_js.find('</button>', idx_btn) + len('</button>')
        app_js = app_js[:idx_btn] + app_js[idx_btn_end:]
        print("Eliminado botón redundante de 'Escuchar Concepto' sobre la imagen.")

# 2. Agregar botón de 'Configurar Voz' en el encabezado de LECTURA PROFUNDA
old_profunda_header = '<div class="text-[12px] text-cyan-400 font-bold font-mono tracking-widest mb-4 flex items-center gap-2">'
new_profunda_header = '''<div class="mb-4 flex items-center justify-between">
            <div class="text-[12px] text-cyan-400 font-bold font-mono tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO COMPLETO ORIGINAL)
            </div>
            <button onclick="App.openVoiceSettingsModal()" class="px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm" title="Cambiar voz masculina/femenina y velocidad">
              <i class="fa-solid fa-sliders text-indigo-400"></i> Configurar Voz
            </button>
          </div>'''

if old_profunda_header in app_js:
    # find occurrence inside Extended Reading Chapters
    idx_ext = app_js.find('// Append Extended Reading Chapters')
    if idx_ext != -1:
        app_js = app_js.replace(old_profunda_header, new_profunda_header, 1)
        print("Añadido botón de 'Configurar Voz' en la cabecera de Lectura Profunda.")

# 3. Métodos del Configurador de Voz en App
voice_methods = '''
  openVoiceSettingsModal() {
    const modal = document.getElementById('voiceSettingsModal');
    if (!modal) return;
    
    const select = document.getElementById('ttsVoiceSelect');
    const range = document.getElementById('ttsSpeedRange');
    const speedLabel = document.getElementById('ttsSpeedLabel');
    
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const esVoices = voices.filter(v => v.lang.startsWith('es') || v.lang.includes('ES') || v.lang.includes('MX') || v.lang.includes('US'));
      const voiceList = esVoices.length > 0 ? esVoices : voices;
      
      select.innerHTML = voiceList.map(v => {
        const isNeural = v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online') || v.name.includes('Google');
        const isFemale = v.name.toLowerCase().includes('dalia') || v.name.toLowerCase().includes('elena') || v.name.toLowerCase().includes('laura') || v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('paulina') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer');
        const isMale = v.name.toLowerCase().includes('jorge') || v.name.toLowerCase().includes('alvaro') || v.name.toLowerCase().includes('raul') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hombre');
        
        let tag = isNeural ? '⭐ Neural' : 'Estándar';
        let genderTag = isFemale ? ' [Femenina]' : (isMale ? ' [Masculina]' : '');
        
        return `<option value="${v.name}">${v.name} (${v.lang}) - ${tag}${genderTag}</option>`;
      }).join('');
      
      const savedVoice = localStorage.getItem('userTTSVoice');
      if (savedVoice) {
        select.value = savedVoice;
      } else if (this.ttsState.selectedVoice) {
        select.value = this.ttsState.selectedVoice.name;
      }
      
      const savedRate = localStorage.getItem('userTTSRate') || '0.92';
      if (range) {
        range.value = savedRate;
        if (speedLabel) speedLabel.innerText = savedRate + 'x';
      }
    }
    
    modal.classList.remove('hidden');
  },

  saveVoiceSettings() {
    const select = document.getElementById('ttsVoiceSelect');
    const range = document.getElementById('ttsSpeedRange');
    
    if (select && select.value) {
      localStorage.setItem('userTTSVoice', select.value);
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices.find(v => v.name === select.value);
      if (chosen) this.ttsState.selectedVoice = chosen;
    }
    
    if (range) {
      localStorage.setItem('userTTSRate', range.value);
    }
    
    document.getElementById('voiceSettingsModal').classList.add('hidden');
    this.showToast('Preferencias de voz guardadas con éxito.', 'success');
  },

  testVoice() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const select = document.getElementById('ttsVoiceSelect');
    const range = document.getElementById('ttsSpeedRange');
    
    const sampleText = "Esta es una demostración de mi voz para la lectura de Psicología Oscura. La autorregulación emocional es clave para neutralizar la manipulación.";
    const u = new SpeechSynthesisUtterance(sampleText);
    u.lang = 'es-ES';
    u.rate = range ? parseFloat(range.value) : 0.92;
    
    if (select && select.value) {
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices.find(v => v.name === select.value);
      if (chosen) u.voice = chosen;
    }
    
    window.speechSynthesis.speak(u);
  },
'''

if 'openVoiceSettingsModal()' not in app_js:
    idx_toggle = app_js.find('toggleChapterReader(')
    if idx_toggle != -1:
        app_js = app_js[:idx_toggle] + voice_methods + '\n  ' + app_js[idx_toggle:]
        print("Añadidos métodos de configuración de voz a App.")

# 4. Usar savedRate en playNextTTSChunk
old_rate = 'u.rate = 0.92;'
new_rate = '''const savedRate = localStorage.getItem('userTTSRate');
    u.rate = savedRate ? parseFloat(savedRate) : 0.92;'''

if old_rate in app_js:
    app_js = app_js.replace(old_rate, new_rate)
    print("Conectado userTTSRate guardado en playNextTTSChunk.")

# 5. Cargar savedVoice en initTTSVoices
old_init_voice = 'this.ttsState.selectedVoice = neuralVoice || esVoices[0] || null;'
new_init_voice = '''const savedVoiceName = localStorage.getItem('userTTSVoice');
          const savedVoice = savedVoiceName ? esVoices.find(v => v.name === savedVoiceName) : null;
          this.ttsState.selectedVoice = savedVoice || neuralVoice || esVoices[0] || null;'''

if old_init_voice in app_js:
    app_js = app_js.replace(old_init_voice, new_init_voice)
    print("Conectado userTTSVoice guardado en initTTSVoices.")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("=== CONFIGURACIÓN DE VOZ FINALIZADA CON ÉXITO ===")
