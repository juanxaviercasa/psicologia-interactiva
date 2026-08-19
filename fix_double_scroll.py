import re

def fix_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    modal_start = content.find('<!-- MODAL DE LECCIÓN ACTIVA (ENFOQUE TOTAL) -->')
    modal_end = content.find('<!-- VISTA 3: MATRIZ TÁCTICA DE DEFENSA -->')

    if modal_start != -1 and modal_end != -1:
        new_modal = '''<!-- MODAL DE LECCIÓN ACTIVA (ENFOQUE TOTAL) -->
  <div id="lessonModal" class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md hidden flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto custom-scrollbar">
    <div class="bg-slate-900 border border-indigo-500/50 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col my-auto shrink-0 animate-in zoom-in-95 duration-300">
      
      <!-- Modal Header (Static inside the box) -->
      <div class="bg-slate-900 p-3 sm:p-4 border-b border-slate-800 flex justify-between items-center rounded-t-2xl">
        <h3 id="lessonModalTitle" class="text-base sm:text-lg font-bold text-indigo-400 font-mono line-clamp-1 pr-4">
          <i class="fa-solid fa-book-open-reader"></i> Absorción Cognitiva
        </h3>
        <button onclick="App.closeLessonModal()" class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors shrink-0">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <!-- Modal Body (Natural Height) -->
      <div id="lessonModalContent" class="p-4 sm:p-6">
        <!-- Contenido inyectado por JS -->
      </div>
      
      <!-- Modal Footer -->
      <div class="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-2xl">
        <div class="text-xs text-slate-500 flex items-center gap-2 text-center sm:text-left">
          <i class="fa-solid fa-lock-open text-indigo-500 text-lg"></i> 
          <span>Asimila este conocimiento<br class="hidden sm:block">para desbloquear el siguiente nivel.</span>
        </div>
        <button id="btnCompleteLesson" class="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-check-double"></i> Asimilar e Interiorizar
        </button>
      </div>

    </div>
  </div>
  
  '''
        content = content[:modal_start] + new_modal + content[modal_end:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("index.html fixed for single scrollbar")

def fix_app():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Add body overflow hidden logic
    if "document.body.style.overflow = 'hidden';" not in content:
        # Inject into openLessonModal
        content = content.replace(
            "document.getElementById('lessonModal').classList.add('flex');",
            "document.getElementById('lessonModal').classList.add('flex');\n    document.body.style.overflow = 'hidden';"
        )
        # Inject into closeLessonModal
        content = content.replace(
            "document.getElementById('lessonModal').classList.remove('flex');",
            "document.getElementById('lessonModal').classList.remove('flex');\n    document.body.style.overflow = 'auto';"
        )
        
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("app.js fixed for body overflow")

fix_index()
fix_app()
