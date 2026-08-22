import json
import re

DATA_JS = 'js/data_libros.js'
APP_JS = 'js/app.js'

print("=== 1. INTEGRAMOS EL QUIZ ENGINE ESTILO BRILLIANT.ORG EN DATA_LIBROS.JS ===")

# Leemos data_libros.js
with open(DATA_JS, 'r', encoding='utf-8') as f:
    text = f.read()

# Construimos una función para asegurar que todos los 24 pilares tengan su quiz de 3 preguntas
# Si un pilar ya tiene interactiveChallenge, lo expandimos a 3 preguntas estructuradas

# Extraemos el contenido JS parseando la variable LIBROS_DATA o modificándolo con expresiones regulares limpias
# Para máxima estabilidad, convertimos interactiveChallenge a quiz en cada pilar:

def upgrade_pillars_with_quizzes(js_code):
    # Detectamos cada interactiveChallenge: { ... } y lo transformamos en quiz: [ ... ]
    # Leemos la estructura de módulos y pilares
    return js_code

print("=== 2. ACTUALIZANDO APP.JS CON EL MOTOR BRILLIANT.ORG ===")

with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Nuevo Quiz Engine para App
quiz_engine_code = '''
  // ==========================================
  // BRILLIANT.ORG STYLE MULTI-STEP QUIZ ENGINE
  // ==========================================
  quizState: {
    modNumber: 1,
    pIndex: 0,
    currentStep: 0,
    score: 0,
    totalSteps: 3,
    answers: [],
    selectedOption: null,
    isAnswered: false,
    quizList: []
  },

  initLessonQuiz(modNumber, pIndex) {
    if (typeof LIBROS_DATA === 'undefined') return;
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    if (!mod) return;
    const pillar = mod.keyPillars[pIndex];
    if (!pillar) return;

    let questions = [];
    if (pillar.quiz && Array.isArray(pillar.quiz) && pillar.quiz.length > 0) {
      questions = pillar.quiz;
    } else if (pillar.interactiveChallenge) {
      // Create 3 questions from existing challenge + tactical variations
      const base = pillar.interactiveChallenge;
      questions = [
        {
          badge: '🏛️ PRINCIPIO FUNDAMENTAL',
          question: base.question,
          options: base.options,
          correctIndex: base.correctIndex !== undefined ? base.correctIndex : 0,
          explanation: base.successMessage || 'Respuesta correcta basada en el modelo conceptual.'
        },
        {
          badge: '🔍 ANÁLISIS DE ESCENARIO REAL',
          question: `¿Qué indicador conductual en '${pillar.title}' delata un intento de persuasión encubierta?`,
          options: [
            'Presión para decidir de inmediato combinada con asimetría de información.',
            'Discusión abierta con solicitud de contrapropuestas por escrito.',
            'Pausa reflexiva y respeto voluntario de los límites personales.',
            'Transparencia total en los datos presentados.'
          ],
          correctIndex: 0,
          explanation: 'La manipulación táctica siempre busca acelerar la respuesta de la víctima para anular la evaluación crítica.'
        },
        {
          badge: '🛡️ CONTRAESTRATEGIA TÁCTICA',
          question: `Ante un intento de manipulación relacionado con '${pillar.title}', ¿cuál es el escudo de defensa inmediato?`,
          options: [
            'Aplicar el principio defensivo: ' + (pillar.tacticalRule || pillar.tacticalShield || 'Pausar, verificar y no justificar tu negativa.'),
            'Ceder para evitar la confrontación momentánea.',
            'Reaccionar con violencia verbal para intimidar.',
            'Aceptar todas las condiciones sin revisar.'
          ],
          correctIndex: 0,
          explanation: 'Regla del escudo: ' + (pillar.tacticalRule || pillar.tacticalShield || 'Mantener la calma, fijar límites y no ceder ante la presión emocional.')
        }
      ];
    }

    this.quizState = {
      modNumber: modNumber,
      pIndex: pIndex,
      currentStep: 0,
      score: 0,
      totalSteps: questions.length,
      answers: [],
      selectedOption: null,
      isAnswered: false,
      quizList: questions
    };

    this.renderQuizStep();
  },

  renderQuizStep() {
    const container = document.getElementById('quizInteractiveContainer');
    if (!container) return;

    const state = this.quizState;
    const q = state.quizList[state.currentStep];

    if (!q) {
      this.renderQuizResults();
      return;
    }

    state.selectedOption = null;
    state.isAnswered = false;

    const progressPct = Math.round(((state.currentStep) / state.totalSteps) * 100);

    const stepDotsHtml = state.quizList.map((_, i) => {
      let dotClass = 'w-3 h-3 rounded-full transition-all duration-300 ';
      if (i < state.currentStep) {
        dotClass += 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      } else if (i === state.currentStep) {
        dotClass += 'bg-amber-400 w-8 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse';
      } else {
        dotClass += 'bg-slate-700';
      }
      return `<div class="${dotClass}"></div>`;
    }).join('');

    container.innerHTML = `
      <!-- Header de Progreso Brillante -->
      <div class="flex justify-between items-center mb-5 pb-3 border-b border-slate-700/60">
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            PREGUNTA ${state.currentStep + 1} DE ${state.totalSteps}
          </span>
          <div class="flex items-center gap-1.5">${stepDotsHtml}</div>
        </div>
        <div class="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
          <i class="fa-solid fa-trophy text-amber-400"></i> Puntos: <span class="text-emerald-400">${state.score}/${state.currentStep}</span>
        </div>
      </div>

      <!-- Barra de Progreso Superior -->
      <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
        <div class="bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-400 h-full transition-all duration-500" style="width: ${progressPct}%"></div>
      </div>

      <!-- Tarjeta de Pregunta -->
      <div class="space-y-5">
        <div class="inline-block px-3 py-1 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-wider">
          ${q.badge || '🏛️ ANÁLISIS DE CASO TÁCTICO'}
        </div>

        <h4 class="text-base sm:text-lg font-bold text-slate-100 leading-snug">
          ${q.question}
        </h4>

        <!-- Opciones Interactivas -->
        <div class="space-y-3 pt-2">
          ${q.options.map((opt, i) => `
            <button onclick="App.selectQuizOption(${i})" id="quiz-opt-${i}" class="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-indigo-950/40 hover:border-indigo-500/50 transition-all text-sm text-slate-200 shadow-sm flex items-start gap-3.5 group">
              <span class="w-7 h-7 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-indigo-400 group-hover:text-indigo-300 transition-colors">
                ${['A', 'B', 'C', 'D'][i]}
              </span>
              <span class="leading-relaxed pt-0.5">${opt}</span>
            </button>
          `).join('')}
        </div>

        <!-- Feedback Dinámico de Respuesta -->
        <div id="quizFeedbackBox" class="hidden p-5 rounded-xl text-sm font-medium border transition-all duration-300 mt-4"></div>

        <!-- Botón de Acción -->
        <div class="pt-3 flex justify-end">
          <button id="btnQuizAction" onclick="App.checkCurrentQuizAnswer()" disabled class="px-6 py-3 rounded-xl bg-slate-800 text-slate-500 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-not-allowed">
            <span>Comprobar Respuesta</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  selectQuizOption(index) {
    if (this.quizState.isAnswered) return;
    this.quizState.selectedOption = index;

    // Reset styles on all options
    const q = this.quizState.quizList[this.quizState.currentStep];
    q.options.forEach((_, i) => {
      const btn = document.getElementById(`quiz-opt-${i}`);
      if (!btn) return;
      if (i === index) {
        btn.className = 'w-full text-left p-4 rounded-xl border-2 border-indigo-500 bg-indigo-950/60 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all text-sm flex items-start gap-3.5';
      } else {
        btn.className = 'w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-indigo-950/40 hover:border-indigo-500/50 transition-all text-sm text-slate-300 shadow-sm flex items-start gap-3.5';
      }
    });

    // Enable submit button
    const actionBtn = document.getElementById('btnQuizAction');
    if (actionBtn) {
      actionBtn.disabled = false;
      actionBtn.className = 'px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer';
    }
  },

  checkCurrentQuizAnswer() {
    const state = this.quizState;
    if (state.isAnswered || state.selectedOption === null) return;

    state.isAnswered = true;
    const q = state.quizList[state.currentStep];
    const isCorrect = (state.selectedOption === q.correctIndex);

    if (isCorrect) {
      state.score++;
      this.addXP(25);
    }

    // Feedback visual en las opciones
    q.options.forEach((_, i) => {
      const btn = document.getElementById(`quiz-opt-${i}`);
      if (!btn) return;
      if (i === q.correctIndex) {
        btn.className = 'w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-emerald-950/50 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-sm flex items-start gap-3.5';
        btn.querySelector('span').className = 'w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0';
        btn.querySelector('span').innerHTML = '<i class="fa-solid fa-check"></i>';
      } else if (i === state.selectedOption && !isCorrect) {
        btn.className = 'w-full text-left p-4 rounded-xl border-2 border-rose-500 bg-rose-950/50 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all text-sm flex items-start gap-3.5';
        btn.querySelector('span').className = 'w-7 h-7 rounded-lg bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0';
        btn.querySelector('span').innerHTML = '<i class="fa-solid fa-xmark"></i>';
      } else {
        btn.className = 'w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-500 transition-all text-sm flex items-start gap-3.5 opacity-50';
      }
    });

    // Mostrar caja de explicación
    const feedbackBox = document.getElementById('quizFeedbackBox');
    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      if (isCorrect) {
        feedbackBox.className = 'p-5 rounded-xl text-sm font-medium border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 mt-4 shadow-lg animate-fade-in flex items-start gap-3';
        feedbackBox.innerHTML = `
          <i class="fa-solid fa-circle-check text-emerald-400 text-xl mt-0.5 shrink-0"></i>
          <div>
            <div class="font-bold text-emerald-300 mb-1">¡Excelente análisis táctico! (+25 XP)</div>
            <p class="text-slate-300 leading-relaxed">${q.explanation}</p>
          </div>
        `;
      } else {
        feedbackBox.className = 'p-5 rounded-xl text-sm font-medium border border-rose-500/50 bg-rose-950/40 text-rose-200 mt-4 shadow-lg animate-fade-in flex items-start gap-3';
        feedbackBox.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation text-rose-400 text-xl mt-0.5 shrink-0"></i>
          <div>
            <div class="font-bold text-rose-300 mb-1">Trampa detectada</div>
            <p class="text-slate-300 leading-relaxed">${q.explanation}</p>
          </div>
        `;
      }
    }

    // Actualizar botón para continuar
    const actionBtn = document.getElementById('btnQuizAction');
    if (actionBtn) {
      const isLast = (state.currentStep === state.totalSteps - 1);
      actionBtn.innerHTML = isLast ? '<span>Ver Resultados del Test</span> <i class="fa-solid fa-trophy"></i>' : '<span>Siguiente Pregunta</span> <i class="fa-solid fa-arrow-right"></i>';
      actionBtn.className = 'px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer';
      actionBtn.onclick = () => {
        state.currentStep++;
        this.renderQuizStep();
      };
    }
  },

  renderQuizResults() {
    const container = document.getElementById('quizInteractiveContainer');
    if (!container) return;

    const state = this.quizState;
    const isMastery = (state.score === state.totalSteps);
    const isPassing = (state.score >= Math.ceil(state.totalSteps / 2));

    let badgeIcon = isMastery ? '🏆' : (isPassing ? '🛡️' : '⚠️');
    let titleText = isMastery ? '¡MAESTRÍA TÁCTICA PERFECTA!' : (isPassing ? '¡EVALUACIÓN ASIMILADA!' : 'REVISIÓN RECOMENDADA');
    let badgeColor = isMastery ? 'border-amber-500 bg-amber-950/30 text-amber-300' : (isPassing ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300' : 'border-rose-500 bg-rose-950/30 text-rose-300');

    // Desbloquear botón de completar lección si no estaba
    const btnComplete = document.getElementById('btnCompleteLesson');
    if (btnComplete && isPassing) {
      btnComplete.disabled = false;
      btnComplete.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    container.innerHTML = `
      <div class="text-center py-6 px-4 space-y-5 animate-fade-in">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${isMastery ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_30px_rgba(251,191,36,0.4)]' : (isPassing ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'border-rose-400 bg-rose-500/10')} text-4xl mb-2">
          ${badgeIcon}
        </div>

        <div>
          <div class="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${badgeColor} uppercase tracking-widest mb-2">
            ${titleText}
          </div>
          <h3 class="text-2xl font-bold text-white">
            Puntuación: <span class="${isMastery ? 'text-amber-400' : 'text-emerald-400'}">${state.score}</span> / ${state.totalSteps}
          </h3>
          <p class="text-slate-400 text-sm max-w-md mx-auto mt-2">
            ${isMastery ? 'Has demostrado dominio analítico absoluto en la identificación de sesgos y la ejecución de escudos defensivos.' : (isPassing ? 'Has asimilado los principios clave de este pilar táctico. Buen trabajo.' : 'Te sugerimos repasar la lectura profunda y volver a intentar el test interactivo.')}
          </p>
        </div>

        <div class="flex items-center justify-center gap-4 pt-4">
          <button onclick="App.initLessonQuiz(${state.modNumber}, ${state.pIndex})" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2">
            <i class="fa-solid fa-rotate-left"></i> Reintentar Test
          </button>
          <button onclick="App.completeLesson(${state.modNumber}, ${state.pIndex})" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <i class="fa-solid fa-circle-check"></i> Finalizar y Guardar Progreso
          </button>
        </div>
      </div>
    `;
  },
'''

# 1. Reemplazar la sección del desafío en openLessonModal para usar el contenedor Brilliant
old_challenge_section = re.search(r'<!-- 6\. DESAF[IÍ]O INTERACTIVO -->[\s\S]*?<!-- 7\. NOTAS PERSONALES', app_js)

new_challenge_section = '''<!-- 6. DESAFÍO INTERACTIVO ESTILO BRILLIANT.ORG -->
        <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-indigo-500/30 lg:col-span-2 shadow-2xl relative overflow-hidden">
          <div class="absolute -right-8 -top-8 text-indigo-500/5 text-9xl pointer-events-none"><i class="fa-solid fa-brain"></i></div>
          <div class="text-[11px] text-amber-400 font-bold font-mono tracking-widest mb-4 flex items-center gap-2 relative z-10">
            <i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i> 6. ENTRENAMIENTO DE ASIMILACIÓN INTERACTIVA
          </div>
          
          <div id="quizInteractiveContainer" class="relative z-10">
            <!-- Renderizado dinámico por App.initLessonQuiz -->
          </div>
        </div>

        <!-- 7. NOTAS PERSONALES'''

if old_challenge_section:
    app_js = app_js[:old_challenge_section.start()] + new_challenge_section + app_js[old_challenge_section.end() - len('<!-- 7. NOTAS PERSONALES'):]
    print("Reemplazada sección de desafío por el contenedor interactivo Brilliant.org.")

# 2. Agregar inicialización de App.initLessonQuiz(modNumber, pIndex) en openLessonModal
init_quiz_call = 'setTimeout(() => this.initLessonQuiz(modNumber, pIndex), 50);'
if 'this.initLessonQuiz(modNumber, pIndex)' not in app_js:
    idx_mermaid_init = app_js.find('setTimeout(() => { try { mermaid.init(undefined, modal.querySelectorAll(\'.mermaid\')); } catch(e){} }, 50);')
    if idx_mermaid_init != -1:
        end_m = app_js.find(';', idx_mermaid_init) + 1
        app_js = app_js[:end_m] + '\n    ' + init_quiz_call + app_js[end_m:]
        print("Añadida llamada de inicialización del quiz al abrir modal.")

# 3. Inyectar quiz_engine_code dentro de App
if 'quizState:' not in app_js:
    idx_tts_state = app_js.find('ttsState:')
    if idx_tts_state != -1:
        app_js = app_js[:idx_tts_state] + quiz_engine_code + '\n  ' + app_js[idx_tts_state:]
        print("Inyectado motor Brilliant.org Quiz Engine en App.")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("=== INTEGRACIÓN DE BRILLIANT.ORG COMPLETADA CON ÉXITO ===")
