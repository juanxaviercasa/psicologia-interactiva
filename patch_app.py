import os

file_path = "js/app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the views array
content = content.replace(
    "const views = ['dashboard', 'microlearning', 'matrix', 'simulator', 'bodylab', 'flashcards', 'quizzes', 'certificate', 'glossary'];",
    "const views = ['dashboard', 'microlearning', 'matrix', 'simulator', 'bodylab', 'flashcards', 'quizzes', 'certificate', 'glossary', 'skilltree', 'sparring', 'auditor', 'biometrics'];"
)

new_methods = """
  // ==========================================
  // NEURO-TACTICAL OS: NEW METHODS
  // ==========================================

  toggleFocusMode() {
    if (typeof AudioEngine !== 'undefined') {
      const isNowOn = AudioEngine.toggleBinauralBeats(200, 10);
      const btn = document.getElementById('btnFocusMode');
      if (isNowOn) {
        btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-500');
        btn.classList.add('bg-rose-600', 'hover:bg-rose-500');
        btn.innerHTML = '<i class="fa-solid fa-stop"></i> Detener Frecuencia';
      } else {
        btn.classList.add('bg-indigo-600', 'hover:bg-indigo-500');
        btn.classList.remove('bg-rose-600', 'hover:bg-rose-500');
        btn.innerHTML = '<i class="fa-solid fa-headphones"></i> Activar Modo Enfoque (Ondas Alfa)';
      }
    }
  },

  async sendSparringMessage(e) {
    e.preventDefault();
    const input = document.getElementById('sparringInput');
    const msg = input.value.trim();
    if (!msg) return;
    
    input.value = '';
    const chatBox = document.getElementById('sparringChatBox');
    
    // Render user message
    chatBox.innerHTML += `
      <div class="flex items-start gap-3 justify-end">
        <div class="bg-indigo-600 rounded-2xl rounded-tr-none p-3 max-w-[80%] text-sm text-white">
          ${msg}
        </div>
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    if (!this.state.sparringHistory) this.state.sparringHistory = [];
    this.state.sparringHistory.push({ role: 'user', text: msg });

    // Show typing...
    const typingId = 'typing-' + Date.now();
    chatBox.innerHTML += `
      <div id="${typingId}" class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-rose-950 flex items-center justify-center text-rose-400 border border-rose-800"><i class="fa-solid fa-mask"></i></div>
        <div class="text-slate-500 text-xs mt-2">Escribiendo táctica...</div>
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    // Call AI
    try {
      const reply = await AIEngine.sparringChat(msg, this.state.sparringHistory);
      document.getElementById(typingId).remove();
      this.state.sparringHistory.push({ role: 'ai', text: reply });
      
      chatBox.innerHTML += `
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-rose-950 flex items-center justify-center text-rose-400 border border-rose-800"><i class="fa-solid fa-mask"></i></div>
          <div class="bg-slate-800 rounded-2xl rounded-tl-none p-3 max-w-[80%] text-sm text-slate-200 whitespace-pre-line">
            ${reply}
          </div>
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch(err) {
      document.getElementById(typingId).innerHTML = `<span class="text-rose-500 text-xs">Error: ${err.message}</span>`;
    }
  },

  async runAuditor() {
    const input = document.getElementById('auditorInput').value.trim();
    if (!input) return;
    
    const resultsArea = document.getElementById('auditorResults');
    resultsArea.innerHTML = '<div class="text-center text-slate-500 text-sm mt-10"><i class="fa-solid fa-circle-notch fa-spin text-4xl mb-3 text-emerald-500"></i><br>Analizando lingüística y sesgos...</div>';
    
    try {
      const analysis = await AIEngine.analyzeToxicText(input);
      resultsArea.innerHTML = `
        <h3 class="text-emerald-400 font-bold mb-3"><i class="fa-solid fa-microscope"></i> Reporte Forense</h3>
        
        <div class="mb-3">
          <strong class="text-rose-400 text-xs block mb-1">RED FLAGS DETECTADAS:</strong>
          <ul class="list-disc list-inside text-sm text-slate-300">
            ${analysis.redFlags.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        
        <div class="mb-3">
          <strong class="text-amber-400 text-xs block mb-1">TÁCTICAS USADAS:</strong>
          <div class="flex flex-wrap gap-2">
            ${analysis.tacticsDetected.map(t => `<span class="px-2 py-1 bg-amber-950/30 text-amber-300 border border-amber-800/50 rounded text-xs">${t}</span>`).join('')}
          </div>
        </div>

        <div class="mb-3">
          <strong class="text-indigo-400 text-xs block mb-1">ANÁLISIS PROFUNDO:</strong>
          <p class="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">${analysis.analysis}</p>
        </div>

        <div>
          <strong class="text-emerald-400 text-xs block mb-1">CONTRAATAQUE RECOMENDADO (GUIÓN):</strong>
          <div class="p-3 bg-emerald-950/20 border-l-2 border-emerald-500 text-sm text-emerald-200 font-mono">
            ${analysis.counterScript}
          </div>
        </div>
      `;
    } catch(err) {
      resultsArea.innerHTML = `<div class="text-rose-500">Error de Auditoría: ${err.message}</div>`;
    }
  },

  async toggleCamera() {
    if (typeof CVEngine === 'undefined') return;
    const btn = document.getElementById('btnToggleCam');
    
    if (CVEngine.isTracking) {
      CVEngine.stopCamera();
      btn.innerHTML = '<i class="fa-solid fa-video"></i> Iniciar Escáner';
      btn.classList.replace('bg-rose-600', 'bg-slate-800');
      btn.classList.replace('hover:bg-rose-500', 'hover:bg-slate-700');
      document.getElementById('camOverlayText').style.display = 'block';
      const ctx = document.getElementById('webcamCanvas').getContext('2d');
      ctx.clearRect(0,0,3000,3000);
    } else {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
      const success = await CVEngine.startCamera();
      if (success) {
        btn.innerHTML = '<i class="fa-solid fa-video-slash"></i> Apagar Escáner';
        btn.classList.replace('bg-slate-800', 'bg-rose-600');
        btn.classList.replace('hover:bg-slate-700', 'hover:bg-rose-500');
        document.getElementById('camOverlayText').style.display = 'none';
      } else {
        btn.innerHTML = 'Error de Cámara';
      }
    }
  },

  saveApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if(key) {
      AIEngine.setKey(key);
      document.getElementById('aiSettingsModal').classList.add('hidden');
      alert('API Key Guardada localmente. Los sistemas Generativos están activos.');
    }
  }
};
"""

# Append the new methods to the end of the App object
content = content.replace('\n};\n', new_methods + '\n};\n')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("app.js patched successfully.")
