import json
import re

# 1. Update data_libros.js
with open('js/data_libros.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to add diagram and interactiveChallenge to the first pillar.
diagram_code = """
          diagram: `graph TD
    A[ESTÍMULO EXTERNO] --> B{¿Es una amenaza o requiere ahorro de energía?}
    B -- Sí (Sobrevivencia/Prisa) --> C[SISTEMA 1]
    B -- No (Cálculo/Análisis) --> D[SISTEMA 2]
    C --> E[Reacción Rápida / Emocional]
    D --> F[Reacción Lenta / Lógica]
    E --> G((Vulnerabilidad a<br>Manipulación))
    F --> H((Escudo Táctico<br>Activado))`
"""

interactive_challenge = """
          interactiveChallenge: {
            question: "Un reclutador te ofrece un sueldo espectacular, pero te dice: 'Tienes 10 minutos para firmar o se lo doy a otro candidato'. ¿Qué sistema está intentando hackear?",
            options: ["Sistema 2 (Análisis Lógico)", "Sistema 1 (Supervivencia / Urgencia)", "Memoria a largo plazo"],
            correctIndex: 1,
            successMessage: "Exacto. El falso sentido de urgencia desactiva tu Córtex Prefrontal para que no puedas usar la lógica."
          }
"""

# Find the first deepDive and insert the new properties after it.
target = "justificar sus demandas.'"
replacement = target + ",\n" + diagram_code + ",\n" + interactive_challenge

if diagram_code not in content:
    content = content.replace(target, replacement)
    with open('js/data_libros.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("data_libros.js updated")

# 2. Update app.js openLessonModal
with open('js/app.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

# I need to insert the diagram rendering and challenge rendering into the modal content
new_js = """
        <!-- 4. NEUROBIOLOGÍA (Full width at bottom) -->
        ${pillar.deepDive ? `
        <div class="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 relative overflow-hidden lg:col-span-2">
          <div class="absolute -right-4 -bottom-4 text-indigo-500/10 text-8xl"><i class="fa-solid fa-microscope"></i></div>
          <div class="text-[11px] text-indigo-400 font-bold font-mono tracking-widest mb-2 relative z-10"><i class="fa-solid fa-network-wired"></i> 4. CONSOLIDACIÓN PROFUNDA (NEUROBIOLOGÍA)</div>
          <p class="text-indigo-200 text-sm md:text-base leading-relaxed relative z-10">${pillar.deepDive}</p>
        </div>
        ` : ''}

        <!-- 5. VISUALIZACIÓN MENTAL (Mermaid Diagram) -->
        ${pillar.diagram ? `
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-700 lg:col-span-2">
          <div class="text-[11px] text-cyan-400 font-bold font-mono tracking-widest mb-4"><i class="fa-solid fa-sitemap"></i> 5. ARQUITECTURA VISUAL (MAPA MENTAL)</div>
          <div class="mermaid flex justify-center text-sm">${pillar.diagram}</div>
        </div>
        ` : ''}

        <!-- 6. SIMULACIÓN INTERACTIVA (Obligatorio para asimilar) -->
        ${pillar.interactiveChallenge ? `
        <div class="p-5 rounded-2xl bg-slate-800 border border-amber-500/50 lg:col-span-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div class="text-[11px] text-amber-500 font-bold font-mono tracking-widest mb-3"><i class="fa-solid fa-bolt"></i> PRUEBA DE ASIMILACIÓN TÁCTICA</div>
          <p class="text-slate-200 mb-4 font-medium">${pillar.interactiveChallenge.question}</p>
          <div class="space-y-2" id="challengeOptions">
            ${pillar.interactiveChallenge.options.map((opt, i) => `
              <button onclick="App.checkLessonChallenge(${modNumber}, ${pIndex}, ${i})" class="w-full text-left p-3 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all text-sm text-slate-300">
                ${['A', 'B', 'C', 'D'][i]}. ${opt}
              </button>
            `).join('')}
          </div>
          <div id="challengeFeedback" class="mt-4 hidden p-3 rounded-lg text-sm font-bold"></div>
        </div>
        ` : ''}
      </div>
"""

# Replace the specific block in app.js
if "<!-- 5. VISUALIZACIÓN MENTAL (Mermaid Diagram) -->" not in app_content:
    # Use re.sub to replace from "<!-- 4. NEUROBIOLOGÍA" to "</div>" before "`;"
    app_content = re.sub(
        r"<!-- 4\. NEUROBIOLOGÍA \(Full width at bottom\) -->.*?(?=</div>\n    `;)",
        new_js.replace('\\', '\\\\'), # Escaping because python raw string interpolation inside replace
        app_content,
        flags=re.DOTALL
    )
    # The regex above is a bit risky. Let's do a hard replace based on string splitting.
    
    # Actually, simpler:
    part1 = app_content.split('<!-- 4. NEUROBIOLOGÍA (Full width at bottom) -->')[0]
    part2 = app_content.split('</div>\n    `;')[1]
    
    # the new piece includes the closing div
    app_content = part1 + new_js.strip() + '\n    `;' + part2

    # Add checkLessonChallenge method
    challenge_method = """
  checkLessonChallenge(modNumber, pIndex, selectedIdx) {
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    const pillar = mod.keyPillars[pIndex];
    const challenge = pillar.interactiveChallenge;
    const feedback = document.getElementById('challengeFeedback');
    const btnComplete = document.getElementById('btnCompleteLesson');
    
    feedback.classList.remove('hidden');
    
    if (selectedIdx === challenge.correctIndex) {
      feedback.className = 'mt-4 p-3 rounded-lg text-sm bg-emerald-950/30 border border-emerald-500/50 text-emerald-200';
      feedback.innerHTML = `<i class="fa-solid fa-check"></i> <b>CÓDIGO ACEPTADO:</b> ${challenge.successMessage}`;
      btnComplete.disabled = false;
      btnComplete.classList.remove('opacity-50', 'cursor-not-allowed');
      btnComplete.classList.add('animate-pulse');
      this.playSound('success');
    } else {
      feedback.className = 'mt-4 p-3 rounded-lg text-sm bg-rose-950/30 border border-rose-500/50 text-rose-200';
      feedback.innerHTML = `<i class="fa-solid fa-xmark"></i> <b>ERROR TÁCTICO:</b> Intenta de nuevo. Caíste en la trampa.`;
      btnComplete.disabled = true;
      btnComplete.classList.add('opacity-50', 'cursor-not-allowed');
      btnComplete.classList.remove('animate-pulse');
    }
  },
"""
    app_content = app_content.replace('closeLessonModal() {', challenge_method + '\n  closeLessonModal() {')
    
    # Modify openLessonModal to disable btnComplete if challenge exists
    app_content = app_content.replace(
        "document.getElementById('btnCompleteLesson').onclick = () => this.completeLesson(modNumber, pIndex);",
        "document.getElementById('btnCompleteLesson').onclick = () => this.completeLesson(modNumber, pIndex);\n    if(pillar.interactiveChallenge) {\n      const btn = document.getElementById('btnCompleteLesson');\n      btn.disabled = true;\n      btn.classList.add('opacity-50', 'cursor-not-allowed');\n    }\n    setTimeout(() => { if(window.mermaid) mermaid.init(undefined, document.querySelectorAll('.mermaid')); }, 50);"
    )

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(app_content)
    print("app.js updated")

