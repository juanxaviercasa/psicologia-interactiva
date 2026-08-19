import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the remaining 'microlearning' references
content = content.replace("App.switchTab('microlearning')", "App.switchTab('learning')")
content = content.replace("Iniciar Micro-Learning", "Iniciar Academia (0 a 100)")
content = content.replace("<!-- VISTA 2: MICRO-LEARNING (LOS 6 LIBROS) -->", "<!-- VISTA 2: ACADEMIA DE DOMINIO -->")

# 2. Fix the Modal Layout (UI/UX expert fix)
# We will replace the entire lessonModal block
modal_start = content.find('<!-- MODAL DE LECCIÓN ACTIVA (ENFOQUE TOTAL) -->')
modal_end = content.find('<!-- VISTA 3: MATRIZ TÁCTICA DE DEFENSA -->')

if modal_start != -1 and modal_end != -1:
    old_modal_chunk = content[modal_start:modal_end]
    
    new_modal = '''<!-- MODAL DE LECCIÓN ACTIVA (ENFOQUE TOTAL) -->
  <div id="lessonModal" class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-indigo-500/50 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
      
      <!-- Modal Header (Static) -->
      <div class="bg-slate-900 p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
        <h3 id="lessonModalTitle" class="text-base sm:text-lg font-bold text-indigo-400 font-mono line-clamp-1 pr-4">
          <i class="fa-solid fa-book-open-reader"></i> Absorción Cognitiva
        </h3>
        <button onclick="App.closeLessonModal()" class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors shrink-0">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <!-- Modal Body (Scrollable) -->
      <div id="lessonModalContent" class="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        <!-- Contenido inyectado por JS -->
      </div>
      
      <!-- Modal Footer (Static) -->
      <div class="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div class="text-xs text-slate-500 flex items-center gap-2 text-center sm:text-left">
          <i class="fa-solid fa-lock-open text-indigo-500 text-lg"></i> 
          <span>Asimila este conocimiento<br class="hidden sm:block">para desbloquear el siguiente nivel.</span>
        </div>
        <button id="btnCompleteLesson" class="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-check-double"></i> Asimilar e Interiorizar
        </button>
      </div>

    </div>
  </div>
  
  '''
    content = content[:modal_start] + new_modal + content[modal_end:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("UI fixed successfully!")
else:
    print("Could not find the modal boundaries.")
