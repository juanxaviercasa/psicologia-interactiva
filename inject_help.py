import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Inject the button next to Modo Dios
target_btn = '<!-- MODO DIOS -->'
btn_html = '''
        <!-- BASES CIENTÍFICAS (AYUDA) -->
        <button onclick="document.getElementById('methodologyModal').classList.remove('hidden')" class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-all text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <i class="fa-solid fa-microscope"></i> Bases Científicas
        </button>
'''
if target_btn in html and 'Bases Científicas' not in html:
    html = html.replace(target_btn, btn_html + '\n' + target_btn)
    print("Injected button")

# 2. Inject the Modal
target_modal = '<!-- Scripts Neural OS -->'
modal_html = '''
  <!-- METHODOLOGY / HELP MODAL -->
  <div id="methodologyModal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
    <div class="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Header -->
      <div class="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 sticky top-0 z-10">
        <h2 class="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center gap-3">
          <i class="fa-solid fa-microscope text-cyan-400"></i> ¿Por qué el contenido está bloqueado?
        </h2>
        <button onclick="document.getElementById('methodologyModal').classList.add('hidden')" class="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-500 transition-colors flex items-center justify-center">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6 overflow-y-auto custom-scrollbar text-slate-300 space-y-6">
        <p class="text-lg text-slate-200">
          La restricción de acceso secuencial (<em>Sequential Gating</em>) en esta plataforma no es un error, sino una <strong>decisión pedagógica deliberada basada en tres principios neurocientíficos</strong> para garantizar que realmente absorbas el material.
        </p>

        <div class="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 border-l-4 border-l-cyan-500">
          <h3 class="text-cyan-400 font-bold mb-2 flex items-center gap-2"><i class="fa-solid fa-brain"></i> 1. Teoría de la Carga Cognitiva (John Sweller, 1988)</h3>
          <p class="text-sm leading-relaxed">
            El cerebro humano tiene una memoria de trabajo limitada. Presentar los 6 módulos y los 76 capítulos al mismo tiempo genera <strong>sobrecarga cognitiva</strong> y "parálisis por análisis". El bloqueo fuerza el procesamiento por bloques (<em>chunking</em>), reduciendo la ansiedad y mejorando la retención de cada técnica antes de avanzar a la siguiente.
          </p>
        </div>

        <div class="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 border-l-4 border-l-rose-500">
          <h3 class="text-rose-400 font-bold mb-2 flex items-center gap-2"><i class="fa-solid fa-lock"></i> 2. Efecto Zeigarnik y Recompensa Dopaminérgica</h3>
          <p class="text-sm leading-relaxed">
            La psiquiatra Bluma Zeigarnik demostró que <strong>el cerebro recuerda mejor las tareas incompletas</strong>. Ver el siguiente módulo bloqueado genera una tensión psicológica y curiosidad naturales. Al completar el módulo actual y "desbloquear" el siguiente, tu cerebro libera <strong>dopamina</strong>, generando una adicción positiva hacia el aprendizaje.
          </p>
        </div>

        <div class="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 border-l-4 border-l-emerald-500">
          <h3 class="text-emerald-400 font-bold mb-2 flex items-center gap-2"><i class="fa-solid fa-layer-group"></i> 3. Andamiaje Estructural (Lev Vygotsky)</h3>
          <p class="text-sm leading-relaxed">
            El aprendizaje profundo de la psicología oscura es jerárquico. Es imposible entender cómo defenderse del <em>Control Coercitivo</em> (Fase 6) si primero no comprendes las vulnerabilidades de tu propia amígdala (Fase 1). El bloqueo asegura que construyas unos cimientos psicológicos sólidos antes de avanzar a tácticas más agresivas.
          </p>
        </div>

        <div class="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-center">
          <h4 class="text-amber-400 font-bold text-sm mb-2"><i class="fa-solid fa-unlock-keyhole"></i> ¿Quieres ignorar la ciencia?</h4>
          <p class="text-xs text-amber-200/70 mb-3">
            Si eres un auditor del curso o prefieres una exploración tipo "sandbox" a riesgo de comprometer la retención del conocimiento, puedes usar el Modo Dios.
          </p>
          <button onclick="document.getElementById('methodologyModal').classList.add('hidden'); App.unlockAll();" class="px-4 py-2 bg-amber-500 text-amber-950 rounded-lg text-sm font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors">
            Activar Modo Dios Ahora
          </button>
        </div>
      </div>
    </div>
  </div>
'''
if target_modal in html and 'methodologyModal' not in html:
    html = html.replace(target_modal, modal_html + '\n  ' + target_modal)
    print("Injected Modal")
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
