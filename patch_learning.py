import re

def patch_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Rename tab button
    content = content.replace(
        '''<button onclick="App.switchTab('microlearning')" id="tab-btn-microlearning" class="nav-tab px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap text-slate-400 hover:text-slate-200">
          <i class="fa-solid fa-bolt"></i> Micro-Learning
        </button>''',
        '''<button onclick="App.switchTab('learning')" id="tab-btn-learning" class="nav-tab px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap text-slate-400 hover:text-slate-200">
          <i class="fa-solid fa-brain"></i> Academia (0 a 100)
        </button>'''
    )

    # 2. Replace the view section
    old_view = re.search(r'<!-- VISTA 2: MICRO-LEARNING -->.*?</section>', content, re.DOTALL)
    if old_view:
        new_view = '''<!-- VISTA 2: ACADEMIA (APRENDIZAJE PROGRESIVO NEURO-OPTIMIZADO) -->
  <section id="view-learning" class="hidden space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
    <div class="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/10">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <i class="fa-solid fa-brain text-indigo-400"></i> Academia de Dominio: Ruta de 0 a 100
      </h2>
      <p class="text-xs text-slate-400 mt-1">El cerebro aprende mediante <strong>Fragmentación (Chunking)</strong>, <strong>Anclaje Contextual</strong> y <strong>Divulgación Progresiva</strong>. Esta ruta está bloqueada secuencialmente. No puedes correr sin antes aprender a caminar. Absorbe, procesa y asimila un pilar a la vez.</p>
    </div>

    <!-- Renderizado por JS: La ruta lineal -->
    <div id="learningPathContainer" class="relative space-y-8 py-4">
      <!-- El JS inyectará la línea de tiempo aquí -->
    </div>
  </section>

  <!-- MODAL DE LECCIÓN ACTIVA (ENFOQUE TOTAL) -->
  <div id="lessonModal" class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md hidden flex-col items-center justify-start p-4 overflow-y-auto">
    <div class="bg-slate-900 border border-indigo-500/50 rounded-2xl w-full max-w-3xl my-8 shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-300">
      <div class="sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-800 flex justify-between items-center rounded-t-2xl z-10">
        <h3 id="lessonModalTitle" class="text-lg font-bold text-indigo-400 font-mono"><i class="fa-solid fa-book-open-reader"></i> Absorción Cognitiva</h3>
        <button onclick="App.closeLessonModal()" class="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div id="lessonModalContent" class="p-6 md:p-8 space-y-6">
        <!-- Contenido inyectado por JS -->
      </div>
      <div class="p-6 bg-slate-950 border-t border-slate-800 rounded-b-2xl flex justify-between items-center sticky bottom-0">
        <div class="text-xs text-slate-500 flex items-center gap-2">
          <i class="fa-solid fa-lock-open"></i> Asimilar para desbloquear el siguiente nivel
        </div>
        <button id="btnCompleteLesson" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all flex items-center gap-2">
          <i class="fa-solid fa-check-double"></i> Asimilar e Interiorizar
        </button>
      </div>
    </div>
  </div>'''
        content = content[:old_view.start()] + new_view + content[old_view.end():]

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

def patch_app():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update views array and state
    content = content.replace("'microlearning'", "'learning'")
    if "unlockedLessons: {}" not in content:
        content = content.replace("progress: {},", "progress: { unlockedLessons: {} },")

    # 2. Replace renderMicrolearning with progressive learning logic
    render_func_start = content.find("renderMicrolearning() {")
    if render_func_start != -1:
        # Find end of function (heuristic: find next major function)
        render_func_end = content.find("renderMatrix() {", render_func_start)
        
        new_render_func = """renderLearningPath() {
    const container = document.getElementById('learningPathContainer');
    if (!container) return;

    if (!this.state.progress.unlockedLessons) {
      this.state.progress.unlockedLessons = { 'm1-0': true }; // Primer pilar desbloqueado por defecto
    }

    let html = '';
    let globalIndex = 0;
    let isPrevUnlocked = true;

    LIBROS_DATA.modules.forEach((mod, modIndex) => {
      html += `
        <div class="relative z-10 bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl shadow-xl mb-6 backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <i class="fa-solid ${mod.icon}"></i>
            </div>
            <div>
              <div class="text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Fase ${mod.bookNumber}</div>
              <h3 class="text-lg font-bold text-white">${mod.title}</h3>
            </div>
          </div>
          
          <div class="space-y-3 pl-5 border-l-2 border-slate-800 ml-5">
      `;

      mod.keyPillars.forEach((pillar, pIndex) => {
        const lessonId = `m${mod.bookNumber}-${pIndex}`;
        const isUnlocked = this.state.progress.unlockedLessons[lessonId] || (mod.bookNumber === 1 && pIndex === 0);
        const isCompleted = this.state.progress.unlockedLessons[`m${mod.bookNumber}-${pIndex+1}`] || this.state.progress.unlockedLessons[`m${mod.bookNumber+1}-0`]; // Simplificación visual

        // Si la anterior no está desbloqueada, esta se fuerza a bloqueada
        const actuallyUnlocked = isUnlocked && isPrevUnlocked;

        html += `
          <div class="relative pl-6 py-2 transition-all ${actuallyUnlocked ? 'opacity-100' : 'opacity-40 grayscale'}">
            <!-- Timeline dot -->
            <div class="absolute -left-[5px] top-4 w-2 h-2 rounded-full ${isCompleted ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : (actuallyUnlocked ? 'bg-amber-400 animate-pulse' : 'bg-slate-700')}"></div>
            
            <button 
              ${actuallyUnlocked ? `onclick="App.openLessonModal(${mod.bookNumber}, ${pIndex})"` : 'disabled'}
              class="w-full text-left p-4 rounded-xl border ${actuallyUnlocked ? 'border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-900/30' : 'border-slate-800 bg-slate-900/50'} flex justify-between items-center group">
              <div>
                <div class="text-[10px] ${actuallyUnlocked ? 'text-indigo-400' : 'text-slate-500'} font-mono mb-1">Pilar Cognitivo ${pIndex + 1}</div>
                <div class="font-bold ${actuallyUnlocked ? 'text-slate-200' : 'text-slate-500'}">${pillar.title}</div>
              </div>
              <div class="text-slate-500 group-hover:text-indigo-400 transition-colors">
                ${isCompleted ? '<i class="fa-solid fa-check-circle text-indigo-500"></i>' : (actuallyUnlocked ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-lock"></i>')}
              </div>
            </button>
          </div>
        `;
        
        // El siguiente solo puede desbloquearse si este est completado
        isPrevUnlocked = isCompleted;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  openLessonModal(modNumber, pIndex) {
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    const pillar = mod.keyPillars[pIndex];
    
    document.getElementById('lessonModalTitle').innerHTML = `<i class="fa-solid fa-brain"></i> Análisis Cognitivo: ${pillar.title}`;
    
    const content = `
      <div class="space-y-6">
        <div class="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
          <div class="text-xs text-amber-500 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-eye"></i> 1. RECONOCIMIENTO (EL CONCEPTO)</div>
          <p class="text-slate-200 text-lg leading-relaxed">${pillar.concept}</p>
        </div>

        <div class="p-5 rounded-xl bg-rose-950/20 border-l-4 border-rose-500">
          <div class="text-xs text-rose-400 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-triangle-exclamation"></i> 2. ANCLAJE CONTEXTUAL (AMENAZA REAL)</div>
          <p class="text-rose-100 italic">"${pillar.realExample}"</p>
        </div>

        <div class="p-5 rounded-xl bg-emerald-950/20 border-l-4 border-emerald-500">
          <div class="text-xs text-emerald-400 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-shield-halved"></i> 3. CODIFICACIÓN TÁCTICA (DEFENSA)</div>
          <p class="text-emerald-100 font-medium">${pillar.tacticalRule}</p>
        </div>

        ${pillar.deepDive ? `
        <div class="p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 text-indigo-500/10 text-8xl"><i class="fa-solid fa-microscope"></i></div>
          <div class="text-xs text-indigo-400 font-bold font-mono tracking-widest mb-2 relative z-10"><i class="fa-solid fa-network-wired"></i> 4. CONSOLIDACIÓN PROFUNDA (NEUROBIOLOGÍA)</div>
          <p class="text-indigo-200 text-sm leading-relaxed relative z-10">${pillar.deepDive}</p>
        </div>
        ` : ''}
      </div>
    `;
    
    document.getElementById('lessonModalContent').innerHTML = content;
    
    const btnComplete = document.getElementById('btnCompleteLesson');
    btnComplete.onclick = () => {
      this.completeLesson(modNumber, pIndex);
    };

    document.getElementById('lessonModal').classList.remove('hidden');
    document.getElementById('lessonModal').classList.add('flex');
    this.playSound('click');
  },

  closeLessonModal() {
    document.getElementById('lessonModal').classList.add('hidden');
    document.getElementById('lessonModal').classList.remove('flex');
  },

  completeLesson(modNumber, pIndex) {
    this.playSound('success');
    
    // Desbloquear la siguiente lección
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    let nextId = '';
    
    if (pIndex + 1 < mod.keyPillars.length) {
      nextId = `m${modNumber}-${pIndex + 1}`;
    } else {
      nextId = `m${modNumber + 1}-0`; // Primer pilar del siguiente módulo
    }

    if (!this.state.progress.unlockedLessons) this.state.progress.unlockedLessons = {};
    
    // Marcar la actual como dominada y la siguiente como desbloqueada
    this.state.progress.unlockedLessons[`m${modNumber}-${pIndex}`] = true;
    this.state.progress.unlockedLessons[nextId] = true;
    
    this.saveProgress();
    this.closeLessonModal();
    this.renderLearningPath(); // Re-render to show unlock animation
    
    // Generar confeti desde el centro de la pantalla
    if(typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  },

  """
        content = content[:render_func_start] + new_render_func + content[render_func_end:]
    
    # 3. Add to switchTab special actions
    content = content.replace("this.renderMicrolearning();", "this.renderLearningPath();")

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    patch_index()
    patch_app()
    print("Neuro-Learning Patch Applied!")
