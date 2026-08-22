import re

APP_JS = 'js/app.js'

with open(APP_JS, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Corregir el encabezado duplicado de LECTURA PROFUNDA
old_profunda_dup = '''<div class="mb-4 flex items-center justify-between">
            <div class="text-[12px] text-cyan-400 font-bold font-mono tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO COMPLETO ORIGINAL)
            </div>
            <button onclick="App.openVoiceSettingsModal()" class="px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm" title="Cambiar voz masculina/femenina y velocidad">
              <i class="fa-solid fa-sliders text-indigo-400"></i> Configurar Voz
            </button>
          </div>
            <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO COMPLETO ORIGINAL)
          </div>'''

new_profunda_clean = '''<div class="mb-4 flex items-center justify-between">
            <div class="text-[12px] text-cyan-400 font-bold font-mono tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO COMPLETO ORIGINAL)
            </div>
            <button onclick="App.openVoiceSettingsModal()" class="px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm" title="Cambiar voz masculina/femenina y velocidad">
              <i class="fa-solid fa-sliders text-indigo-400"></i> Configurar Voz
            </button>
          </div>'''

if old_profunda_dup in text:
    text = text.replace(old_profunda_dup, new_profunda_clean)
    print("Corregido encabezado duplicado de Lectura Profunda.")

# 2. Corregir el comentario duplicado de Notas Personales
text = text.replace('<!-- 7. NOTAS PERSONALES<!-- 7. NOTAS PERSONALES & SPAR AI -->', '<!-- 7. NOTAS PERSONALES & SPAR AI -->')

# 3. Asegurar que initLessonQuiz se ejecute de inmediato tras insertar el HTML en el modal
target_injection = "document.getElementById('lessonModalContent').innerHTML = contentHtml;"
if target_injection in text:
    replacement = target_injection + "\n\n    // Inicializar Quiz Interactivo Brilliant.org\n    this.initLessonQuiz(modNumber, pIndex);"
    text = text.replace(target_injection, replacement)
    print("Inyectada llamada directa a this.initLessonQuiz(modNumber, pIndex).")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(text)

print("=== REPARACIÓN DE MODAL COMPLETADA ===")
