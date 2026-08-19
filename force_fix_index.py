with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# SPLIT at view-microlearning and at VISTA 3
start_marker = '<section id="view-microlearning" class="hidden space-y-6">'
end_marker = '<!-- VISTA 3: MATRIZ TÁCTICA DE DEFENSA -->'

if start_marker in content and end_marker in content:
    part1 = content.split(start_marker)[0]
    part2 = content.split(end_marker)[1]
    
    new_view = '''<!-- VISTA 2: ACADEMIA (APRENDIZAJE PROGRESIVO NEURO-OPTIMIZADO) -->
  <section id="view-learning" class="hidden space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
    <div class="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/10">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <i class="fa-solid fa-brain text-indigo-400"></i> Academia de Dominio: Ruta de 0 a 100
      </h2>
      <p class="text-xs text-slate-400 mt-1">El cerebro aprende mediante <strong>Fragmentación (Chunking)</strong>, <strong>Anclaje Contextual</strong> y <strong>Divulgación Progresiva</strong>. Esta ruta está bloqueada secuencialmente. Absorbe, procesa y asimila un pilar a la vez.</p>
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
  </div>
  
  '''
    content = part1 + new_view + end_marker + part2
    print("Replaced section successfully!")
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
else:
    print("Could not find start/end markers")
