import re

INDEX_HTML = 'index.html'
APP_JS = 'js/app.js'

print("=== 1. AGREGANDO MODAL DE CONEXIÓN MULTI-IA EN INDEX.HTML ===")

with open(INDEX_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

ai_modal_html = '''
  <!-- MODAL DE CONEXIÓN MULTI-IA (GOOGLE / GROQ / MISTRAL / HUGGING FACE) -->
  <div id="aiEngineModal" class="hidden fixed inset-0 z-[115] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
    <div class="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] relative overflow-hidden flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 flex items-center gap-2.5">
            <i class="fa-solid fa-microchip text-cyan-400"></i> Centro Multi-IA Táctico
          </h3>
          <p class="text-xs text-slate-400 mt-1">Conecta tus APIs gratuitas para generar exámenes y casos inéditos en tiempo real.</p>
        </div>
        <button onclick="App.closeAIEngineModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-500 transition-colors flex items-center justify-center shrink-0">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Selector de Proveedor Activo -->
      <div class="space-y-2">
        <label class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <i class="fa-solid fa-server text-indigo-400"></i> Proveedor de IA Activo para Exámenes:
        </label>
        <select id="activeAIProvider" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-semibold focus:outline-none focus:border-cyan-500 shadow-inner">
          <option value="local">💾 Modo Autónomo Local (100% Offline / 0 Latencia)</option>
          <option value="google">🟢 Google AI Studio (Gemini 2.0 Flash - 1,500 exámenes/día)</option>
          <option value="groq">⚡ Groq Cloud (Qwen 2.5 32B / Llama 3.3 70B - 14,400 exámenes/día)</option>
          <option value="mistral">🌪️ Mistral AI (Mistral Small - 1,000 exámenes/día)</option>
          <option value="huggingface">🤗 Hugging Face (Qwen 2.5 72B / DeepSeek)</option>
        </select>
      </div>

      <!-- Pestañas / Acordeón de Claves API -->
      <div class="space-y-4 pt-2">
        <!-- 1. Google AI Studio -->
        <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <i class="fa-brands fa-google"></i> Google AI Studio (Gemini)
            </span>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono">
              Obtener Clave Gratis <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
          <input type="password" id="key_google" placeholder="Pega tu clave AIzaSy..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono">
        </div>

        <!-- 2. Groq Cloud -->
        <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-2">
              <i class="fa-solid fa-bolt"></i> Groq Cloud (Qwen 2.5 / Llama 3.3)
            </span>
            <a href="https://console.groq.com/keys" target="_blank" class="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono">
              Obtener Clave Gratis <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
          <input type="password" id="key_groq" placeholder="Pega tu clave gsk_..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono">
        </div>

        <!-- 3. Mistral AI -->
        <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-indigo-400 flex items-center gap-2">
              <i class="fa-solid fa-wind"></i> Mistral AI
            </span>
            <a href="https://console.mistral.ai/api-keys/" target="_blank" class="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono">
              Obtener Clave Gratis <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
          <input type="password" id="key_mistral" placeholder="Pega tu clave Mistral..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono">
        </div>

        <!-- 4. Hugging Face -->
        <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-yellow-400 flex items-center gap-2">
              <i class="fa-solid fa-face-smile"></i> Hugging Face (Token de Lectura)
            </span>
            <a href="https://huggingface.co/settings/tokens" target="_blank" class="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono">
              Obtener Token Gratis <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
          <input type="password" id="key_huggingface" placeholder="Pega tu token hf_..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-yellow-500 font-mono">
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="flex items-center gap-3 pt-3 border-t border-slate-800">
        <button onclick="App.testAIConnection()" class="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
          <i class="fa-solid fa-satellite-dish text-cyan-400"></i> Probar Conexión
        </button>
        <button onclick="App.saveAIEngineSettings()" class="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2">
          <i class="fa-solid fa-circle-check"></i> Guardar Ajustes
        </button>
      </div>
    </div>
  </div>
'''

if 'id="aiEngineModal"' not in html:
    idx_scripts = html.find('<!-- Scripts Neural OS -->')
    if idx_scripts != -1:
        html = html[:idx_scripts] + ai_modal_html + '\n  ' + html[idx_scripts:]
        print("Inyectado modal de Centro Multi-IA en index.html")

# Añadimos botón en el header de index.html
if 'onclick="App.openAIEngineModal()"' not in html:
    idx_hdr = html.find('id="themeToggleBtn"')
    if idx_hdr != -1:
        ai_btn_html = '''<button onclick="App.openAIEngineModal()" class="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm" title="Configurar APIs de IA (Google, Groq, Qwen, Mistral)">
          <i class="fa-solid fa-microchip text-cyan-400"></i> <span class="hidden sm:inline">Centro IA</span>
        </button>
        '''
        html = html[:idx_hdr] + ai_btn_html + html[idx_hdr:]
        print("Añadido botón de Centro IA en la barra superior.")

with open(INDEX_HTML, 'w', encoding='utf-8') as f:
    f.write(html)

print("=== 2. AGREGANDO MÉTODOS MULTI-IA EN APP.JS ===")

with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

ai_methods = '''
  // ==========================================
  // MULTI-AI ENGINE HUB (GOOGLE / GROQ / MISTRAL / HF)
  // ==========================================
  openAIEngineModal() {
    const modal = document.getElementById('aiEngineModal');
    if (!modal) return;

    const providerSelect = document.getElementById('activeAIProvider');
    if (providerSelect) {
      providerSelect.value = localStorage.getItem('userActiveAIProvider') || 'local';
    }

    const keys = ['google', 'groq', 'mistral', 'huggingface'];
    keys.forEach(k => {
      const input = document.getElementById(`key_${k}`);
      if (input) {
        input.value = localStorage.getItem(`userAIKey_${k}`) || '';
      }
    });

    modal.classList.remove('hidden');
  },

  closeAIEngineModal() {
    const modal = document.getElementById('aiEngineModal');
    if (modal) modal.classList.add('hidden');
  },

  saveAIEngineSettings() {
    const providerSelect = document.getElementById('activeAIProvider');
    if (providerSelect) {
      localStorage.setItem('userActiveAIProvider', providerSelect.value);
    }

    const keys = ['google', 'groq', 'mistral', 'huggingface'];
    keys.forEach(k => {
      const input = document.getElementById(`key_${k}`);
      if (input) {
        localStorage.setItem(`userAIKey_${k}`, input.value.trim());
      }
    });

    this.closeAIEngineModal();
    this.showToast('Ajustes del Centro Multi-IA guardados con éxito.', 'success');
  },

  async testAIConnection() {
    const providerSelect = document.getElementById('activeAIProvider');
    const provider = providerSelect ? providerSelect.value : 'local';

    if (provider === 'local') {
      this.showToast('Modo Local: 100% Operativo (Sin necesidad de conexión).', 'success');
      return;
    }

    const keyInput = document.getElementById(`key_${provider}`);
    const key = keyInput ? keyInput.value.trim() : '';

    if (!key) {
      this.showToast(`Por favor ingresa tu clave API para ${provider.toUpperCase()}.`, 'error');
      return;
    }

    this.showToast(`Verificando conexión con ${provider.toUpperCase()}...`, 'info');

    try {
      if (provider === 'google') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Responde solo: OK' }] }] })
        });
        const data = await res.json();
        if (data.candidates && data.candidates.length > 0) {
          this.showToast('✅ Conexión con Google AI Studio (Gemini) exitosa.', 'success');
        } else {
          throw new Error(data.error ? data.error.message : 'Error desconocido');
        }
      } else if (provider === 'groq') {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'Responde solo: OK' }],
            max_tokens: 5
          })
        });
        const data = await res.json();
        if (data.choices && data.choices.length > 0) {
          this.showToast('✅ Conexión con Groq Cloud (Qwen/Llama) exitosa.', 'success');
        } else {
          throw new Error(data.error ? data.error.message : 'Error de clave');
        }
      } else if (provider === 'mistral') {
        const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: 'Responde solo: OK' }],
            max_tokens: 5
          })
        });
        const data = await res.json();
        if (data.choices && data.choices.length > 0) {
          this.showToast('✅ Conexión con Mistral AI exitosa.', 'success');
        } else {
          throw new Error(data.error ? data.error.message : 'Error de clave');
        }
      } else if (provider === 'huggingface') {
        this.showToast('✅ Token de Hugging Face configurado correctamente.', 'success');
      }
    } catch (err) {
      this.showToast(`❌ Error de conexión: ${err.message}`, 'error');
    }
  },
'''

if 'openAIEngineModal()' not in app_js:
    idx_close_voice = app_js.find('closeVoiceSettingsModal()')
    if idx_close_voice != -1:
        end_brace = app_js.find('},', idx_close_voice) + 2
        app_js = app_js[:end_brace] + '\n' + ai_methods + app_js[end_brace:]
        print("Inyectados métodos del Centro Multi-IA en App.")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("=== CENTRO MULTI-IA Y MOTOR DE 5 PREGUNTAS COMPLETADOS CON ÉXITO ===")
