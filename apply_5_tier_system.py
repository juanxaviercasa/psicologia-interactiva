import re
import json

APP_JS = 'js/app.js'
DATA_JS = 'js/data_libros.js'
INDEX_HTML = 'index.html'

print("=== 1. MOTOR DE 5 PREGUNTAS TÁCTICAS, TEMPORIZADOR DE 45S Y AUTOCALIFICACIÓN 80% EN APP.JS ===")

with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Código del Quiz Engine de 5 Preguntas con Temporizador Táctico, Barajado y Calificación 80%
new_quiz_engine = '''
  // ==========================================
  // 5-TIER NEURO-LEARNING QUIZ ENGINE
  // ==========================================
  quizState: {
    modNumber: 1,
    pIndex: 0,
    currentStep: 0,
    score: 0,
    totalSteps: 5,
    answers: [],
    selectedOption: null,
    isAnswered: false,
    quizList: [],
    timerSeconds: 45,
    timerInterval: null,
    startTime: null
  },

  // Barajador de Fisher-Yates para permutar opciones aleatoriamente
  shuffleOptions(options, correctIndex) {
    const combined = options.map((opt, i) => ({ opt, isCorrect: i === correctIndex }));
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    const newOptions = combined.map(c => c.opt);
    const newCorrectIndex = combined.findIndex(c => c.isCorrect);
    return { options: newOptions, correctIndex: newCorrectIndex };
  },

  initLessonQuiz(modNumber, pIndex) {
    if (typeof LIBROS_DATA === 'undefined') return;
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    if (!mod) return;
    const pillar = mod.keyPillars[pIndex];
    if (!pillar) return;

    this.stopQuizTimer();

    const pTitle = pillar.title || 'Pilar Táctico';
    const pConcept = pillar.storytellingConcept || pillar.concept || 'Concepto de análisis conductual.';
    const pShield = pillar.tacticalShield || pillar.tacticalRule || 'Regla del escudo: Pausar, verificar y no justificar tu negativa.';

    // Base de 5 preguntas calibradas en los 5 niveles cognitivos de Bloom
    const rawQuestions = [
      {
        badge: '🏛️ NIVEL 1: BASE NEUROBIOLÓGICA Y CONCEPTUAL',
        question: `En el marco de '${pTitle}', ¿cuál es el mecanismo central que describe la psicología estratégica?`,
        options: [
          pConcept.length > 140 ? pConcept.substring(0, 137) + '...' : pConcept,
          'Un fenómeno puramente casual sin base biológica ni conductual demostrable.',
          'Una técnica intuitiva que no se puede entrenar ni prevenir.',
          'Una reacción psicológica que solo afecta a personas sin educación.'
        ],
        correctIndex: 0,
        explanation: `Fundamento del pilar: ${pConcept}`
      },
      {
        badge: '🔍 NIVEL 2: ANÁLISIS DE CASO REAL Y DETECCIÓN',
        question: `Si un interlocutor intenta vulnerar tus límites mediante dinámicas de '${pTitle}', ¿qué señal clave delata la manipulación?`,
        options: [
          'Urgencia artificial, asimetría de información y presión encubierta para forzar una decisión sin consentimiento genuino.',
          'Búsqueda de consenso transparente y respeto mutuo de tiempos.',
          'Apertura a recibir contrapropuestas por escrito.',
          'Presentación clara de datos y auditorías verificables.'
        ],
        correctIndex: 0,
        explanation: 'La manipulación táctica siempre busca acelerar la respuesta de la víctima para anular la evaluación crítica del Córtex Prefrontal.'
      },
      {
        badge: '🛡️ NIVEL 3: EJECUCIÓN DEL ESCUDO DEFENSIVO',
        question: `¿Cuál es el escudo de respuesta inmediata para neutralizar esta dinámica?`,
        options: [
          pShield,
          'Reaccionar con agresión verbal inmediata para intimidar al agresor.',
          'Ceder incondicionalmente esperando que el manipulador cambie por gratitud.',
          'Ignorar la situación y no establecer ningún límite formal.'
        ],
        correctIndex: 0,
        explanation: `Escudo táctico aplicable: ${pShield}`
      },
      {
        badge: '⚠️ NIVEL 4: EL ERROR COMÚN DE LA VÍCTIMA',
        question: `¿Cuál es el error impulsivo más frecuente que le otorga más poder al manipulador?`,
        options: [
          'Justificarse extensamente, pedir disculpas por defender sus derechos y buscar la aprobación del agresor.',
          'Hacer una pausa en silencio de 3 a 5 segundos antes de responder.',
          'Solicitar que la propuesta se formalice por escrito.',
          'Fijar una fecha posterior para evaluar la situación con calma.'
        ],
        correctIndex: 0,
        explanation: 'Buscar la aprobación del agresor y dar explicaciones excesivas valida su falso juicio y le otorga autoridad moral sobre ti.'
      },
      {
        badge: '⚡ NIVEL 5: TRANSFERENCIA EN ESCENARIO CRÍTICO',
        question: `Frente a un intento de manipulación recurrente y sistemática en este ámbito, ¿cuál es la estrategia de contención a largo plazo?`,
        options: [
          'Registrar hechos por escrito (cadena de custodia), establecer consecuencias innegociables y reducir la exposición al manipulador.',
          'Intentar convencer al manipulador de que cambie de actitud.',
          'Contarle secretos personales para ganarse su confianza.',
          'Aceptar el rol de víctima como algo inevitable.'
        ],
        correctIndex: 0,
        explanation: 'La documentación objetiva de hechos y el establecimiento de límites innegociables desmantelan la impunidad de la manipulación sistemática.'
      }
    ];

    // Barajamos aleatoriamente las opciones de cada pregunta (Fisher-Yates)
    const randomizedQuestions = rawQuestions.map(q => {
      const shuffled = this.shuffleOptions(q.options, q.correctIndex);
      return {
        badge: q.badge,
        question: q.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: q.explanation
      };
    });

    this.quizState = {
      modNumber: modNumber,
      pIndex: pIndex,
      currentStep: 0,
      score: 0,
      totalSteps: 5,
      answers: [],
      selectedOption: null,
      isAnswered: false,
      quizList: randomizedQuestions,
      timerSeconds: 45,
      timerInterval: null,
      startTime: Date.now()
    };

    this.renderQuizStep();
  },

  startQuizTimer() {
    this.stopQuizTimer();
    this.quizState.timerSeconds = 45;
    this.quizState.startTime = Date.now();

    const timerEl = document.getElementById('quizTimerText');
    const timerBar = document.getElementById('quizTimerBar');

    this.quizState.timerInterval = setInterval(() => {
      if (this.quizState.isAnswered) {
        this.stopQuizTimer();
        return;
      }

      this.quizState.timerSeconds--;
      const secs = this.quizState.timerSeconds;

      if (timerEl) {
        timerEl.innerText = `${secs}s`;
        if (secs <= 10) {
          timerEl.className = 'text-xs font-mono font-bold text-rose-400 animate-pulse';
        } else if (secs <= 20) {
          timerEl.className = 'text-xs font-mono font-bold text-amber-400';
        } else {
          timerEl.className = 'text-xs font-mono font-bold text-cyan-400';
        }
      }

      if (timerBar) {
        const pct = Math.max(0, (secs / 45) * 100);
        timerBar.style.width = `${pct}%`;
        if (secs <= 10) {
          timerBar.className = 'bg-rose-500 h-full transition-all duration-1000';
        } else if (secs <= 20) {
          timerBar.className = 'bg-amber-500 h-full transition-all duration-1000';
        } else {
          timerBar.className = 'bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-1000';
        }
      }

      if (secs <= 0) {
        this.stopQuizTimer();
        this.handleQuizTimeout();
      }
    }, 1000);
  },

  stopQuizTimer() {
    if (this.quizState.timerInterval) {
      clearInterval(this.quizState.timerInterval);
      this.quizState.timerInterval = null;
    }
  },

  handleQuizTimeout() {
    if (this.quizState.isAnswered) return;
    this.quizState.isAnswered = true;
    this.quizState.selectedOption = -1; // Tiempo expirado

    const state = this.quizState;
    const q = state.quizList[state.currentStep];

    // Resaltar la respuesta correcta
    q.options.forEach((_, i) => {
      const btn = document.getElementById(`quiz-opt-${i}`);
      if (!btn) return;
      if (i === q.correctIndex) {
        btn.className = 'w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-emerald-950/50 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-sm flex items-start gap-3.5';
      } else {
        btn.className = 'w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-500 opacity-50 text-sm flex items-start gap-3.5';
      }
      btn.disabled = true;
    });

    const feedbackBox = document.getElementById('quizFeedbackBox');
    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      feedbackBox.className = 'p-5 rounded-xl text-sm font-medium border border-rose-500/50 bg-rose-950/40 text-rose-200 mt-4 shadow-lg animate-fade-in flex items-start gap-3';
      feedbackBox.innerHTML = `
        <i class="fa-solid fa-clock text-rose-400 text-xl mt-0.5 shrink-0 animate-pulse"></i>
        <div>
          <div class="font-bold text-rose-300 mb-1">¡Tiempo Expirado! (0 puntos)</div>
          <p class="text-slate-300 leading-relaxed">${q.explanation}</p>
        </div>
      `;
    }

    const actionBtn = document.getElementById('btnQuizAction');
    if (actionBtn) {
      const isLast = (state.currentStep === state.totalSteps - 1);
      actionBtn.innerHTML = isLast ? '<span>Ver Resultados Finales</span> <i class="fa-solid fa-trophy"></i>' : '<span>Siguiente Pregunta</span> <i class="fa-solid fa-arrow-right"></i>';
      actionBtn.className = 'px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer';
      actionBtn.disabled = false;
      actionBtn.onclick = () => {
        state.currentStep++;
        this.renderQuizStep();
      };
    }
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

    // Indicador visual de 5 esferas (Niveles de Bloom)
    const stepDotsHtml = state.quizList.map((_, i) => {
      let dotClass = 'w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center text-[9px] font-bold ';
      if (i < state.currentStep) {
        dotClass += 'bg-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      } else if (i === state.currentStep) {
        dotClass += 'bg-amber-400 text-slate-950 w-7 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse';
      } else {
        dotClass += 'bg-slate-700 text-slate-500 border border-slate-600';
      }
      return `<div class="${dotClass}">${i + 1}</div>`;
    }).join('');

    container.innerHTML = `
      <!-- Cabecera de Progreso y Temporizador -->
      <div class="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b border-slate-700/60">
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            NIVEL ${state.currentStep + 1} DE ${state.totalSteps}
          </span>
          <div class="flex items-center gap-1.5">${stepDotsHtml}</div>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Temporizador Táctico -->
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 shadow-inner">
            <i class="fa-solid fa-stopwatch text-cyan-400 text-xs"></i>
            <span id="quizTimerText" class="text-xs font-mono font-bold text-cyan-400">45s</span>
          </div>

          <!-- Puntos y Nota Mínima -->
          <div class="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
            <i class="fa-solid fa-award text-amber-400"></i> Aciertos: <span class="text-emerald-400">${state.score}/${state.currentStep}</span>
            <span class="text-[10px] text-slate-500 font-normal">(Mín. 4/5 para medalla)</span>
          </div>
        </div>
      </div>

      <!-- Barra de Tiempo Regresiva -->
      <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-6 border border-slate-800">
        <div id="quizTimerBar" class="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-1000" style="width: 100%"></div>
      </div>

      <!-- Tarjeta de Pregunta -->
      <div class="space-y-5">
        <div class="inline-block px-3 py-1 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-wider shadow-sm">
          ${q.badge || '🏛️ ANÁLISIS DE CASO TÁCTICO'}
        </div>

        <h4 class="text-base sm:text-lg font-bold text-slate-100 leading-snug">
          ${q.question}
        </h4>

        <!-- Opciones Interactivas Barajadas -->
        <div class="space-y-3 pt-2">
          ${q.options.map((opt, i) => `
            <button onclick="App.selectQuizOption(${i})" id="quiz-opt-${i}" class="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-indigo-950/40 hover:border-indigo-500/50 transition-all text-sm text-slate-200 shadow-sm flex items-start gap-3.5 group cursor-pointer">
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

    // Iniciar temporizador de 45 segundos para este paso
    this.startQuizTimer();
  },

  selectQuizOption(index) {
    if (this.quizState.isAnswered) return;
    this.quizState.selectedOption = index;

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

    const actionBtn = document.getElementById('btnQuizAction');
    if (actionBtn) {
      actionBtn.disabled = false;
      actionBtn.className = 'px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer';
    }
  },

  checkCurrentQuizAnswer() {
    const state = this.quizState;
    if (state.isAnswered || state.selectedOption === null) return;

    this.stopQuizTimer();
    state.isAnswered = true;

    const q = state.quizList[state.currentStep];
    const isCorrect = (state.selectedOption === q.correctIndex);
    const elapsedSeconds = 45 - state.timerSeconds;
    const isFast = elapsedSeconds <= 20;

    if (isCorrect) {
      state.score++;
      let earnedXP = 25;
      if (isFast) earnedXP += 15; // Bonificación de agilidad mental
      this.addXP(earnedXP);
    }

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
      btn.disabled = true;
    });

    const feedbackBox = document.getElementById('quizFeedbackBox');
    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      if (isCorrect) {
        feedbackBox.className = 'p-5 rounded-xl text-sm font-medium border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 mt-4 shadow-lg animate-fade-in flex items-start gap-3';
        feedbackBox.innerHTML = `
          <i class="fa-solid fa-circle-check text-emerald-400 text-xl mt-0.5 shrink-0"></i>
          <div>
            <div class="font-bold text-emerald-300 mb-1">¡Respuesta Táctica Correcta! (+25 XP ${isFast ? '⚡ +15 XP Bono Agilidad' : ''})</div>
            <p class="text-slate-300 leading-relaxed">${q.explanation}</p>
          </div>
        `;
      } else {
        feedbackBox.className = 'p-5 rounded-xl text-sm font-medium border border-rose-500/50 bg-rose-950/40 text-rose-200 mt-4 shadow-lg animate-fade-in flex items-start gap-3';
        feedbackBox.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation text-rose-400 text-xl mt-0.5 shrink-0"></i>
          <div>
            <div class="font-bold text-rose-300 mb-1">Trampa Detectada (0 puntos)</div>
            <p class="text-slate-300 leading-relaxed">${q.explanation}</p>
          </div>
        `;
      }
    }

    const actionBtn = document.getElementById('btnQuizAction');
    if (actionBtn) {
      const isLast = (state.currentStep === state.totalSteps - 1);
      actionBtn.innerHTML = isLast ? '<span>Ver Calificación y Medallas</span> <i class="fa-solid fa-trophy"></i>' : '<span>Siguiente Nivel</span> <i class="fa-solid fa-arrow-right"></i>';
      actionBtn.className = 'px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer';
      actionBtn.onclick = () => {
        state.currentStep++;
        this.renderQuizStep();
      };
    }
  },

  renderQuizResults() {
    this.stopQuizTimer();
    const container = document.getElementById('quizInteractiveContainer');
    if (!container) return;

    const state = this.quizState;
    const isGold = (state.score === 5);
    const isSilver = (state.score === 4);
    const isPassed = (state.score >= 4); // Nota mínima 80% (4 de 5)

    let badgeIcon = isGold ? '🥇' : (isSilver ? '🥈' : '⚠️');
    let titleText = isGold ? '¡MEDALLA DE ORO: MAESTRÍA TÁCTICA 100%!' : (isSilver ? '¡MEDALLA DE PLATA: ESCUDO DEFENSIVO APROBADO (80%)!' : 'EVALUACIÓN NO APROBADA (REQUIERE 80%)');
    let badgeColor = isGold ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.3)]' : (isSilver ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'border-rose-500 bg-rose-950/30 text-rose-300');

    // Guardar medalla en el historial del usuario
    if (isPassed) {
      const badgeKey = `badge_m${state.modNumber}_p${state.pIndex}`;
      const badgeData = {
        pillarTitle: `Módulo ${state.modNumber} - Pilar ${state.pIndex + 1}`,
        score: state.score,
        tier: isGold ? 'Oro' : 'Plata',
        timestamp: new Date().toISOString()
      };
      let badges = JSON.parse(localStorage.getItem('userTacticalBadges') || '{}');
      badges[badgeKey] = badgeData;
      localStorage.setItem('userTacticalBadges', JSON.stringify(badges));
      this.addXP(isGold ? 125 : 100);
    }

    const btnComplete = document.getElementById('btnCompleteLesson');
    if (btnComplete && isPassed) {
      btnComplete.disabled = false;
      btnComplete.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    container.innerHTML = `
      <div class="text-center py-6 px-4 space-y-6 animate-fade-in">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${badgeColor} text-5xl mb-1 transition-transform transform hover:scale-110">
          ${badgeIcon}
        </div>

        <div>
          <div class="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold border ${badgeColor} uppercase tracking-widest mb-3">
            ${titleText}
          </div>
          <h3 class="text-2xl sm:text-3xl font-bold text-white">
            Calificación: <span class="${isPassed ? 'text-emerald-400' : 'text-rose-400'}">${state.score}</span> / 5 Aciertos
            <span class="text-sm font-normal text-slate-400 block mt-1">Nota obtenida: ${state.score * 20}% (Mínimo aprobatorio: 80%)</span>
          </h3>
          <p class="text-slate-300 text-sm max-w-lg mx-auto mt-3 leading-relaxed">
            ${isGold ? '¡Extraordinario! Has alcanzado la asimilación máxima de los 5 niveles cognitivos. Tu escudo psicológico es impenetrable.' : (isSilver ? '¡Excelente rendimiento! Has superado el estándar de defensa táctica (80%). Has ganado la Medalla de Plata.' : 'No has alcanzado la nota mínima del 80% (4/5). El neuroaprendizaje exige consolidar el conocimiento antes de avanzar. Reintenta con nuevas opciones barajadas.')}
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800">
          <button onclick="App.initLessonQuiz(${state.modNumber}, ${state.pIndex})" class="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-md">
            <i class="fa-solid fa-rotate-left text-amber-400"></i> <span>Reintentar con Opciones Barajadas</span>
          </button>
          ${isPassed ? `
            <button onclick="App.completeLesson(${state.modNumber}, ${state.pIndex})" class="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
              <i class="fa-solid fa-award text-amber-300 text-sm"></i> <span>Reclamar Medalla y Finalizar</span>
            </button>
          ` : `
            <button disabled class="px-6 py-3 rounded-xl bg-slate-800/50 text-slate-500 border border-slate-700/50 text-xs font-bold cursor-not-allowed flex items-center gap-2">
              <i class="fa-solid fa-lock"></i> <span>Bloqueado (Requiere 4/5 para aprobar)</span>
            </button>
          `}
        </div>
      </div>
    `;
  },
'''

# Reemplazamos el bloque del quizEngine en app.js
old_quiz_engine_match = re.search(r'// ==========================================\s*// BRILLIANT\.ORG STYLE MULTI-STEP QUIZ ENGINE[\s\S]*?renderQuizResults\(\) \{[\s\S]*?\}\n  \},', app_js)

if old_quiz_engine_match:
    app_js = app_js[:old_quiz_engine_match.start()] + new_quiz_engine.strip() + app_js[old_quiz_engine_match.end():]
    print("Reemplazado el motor de quiz con el nuevo sistema de 5 preguntas tácticas, temporizador y autocalificación 80%.")
else:
    # Buscar quizState
    idx_qs = app_js.find('quizState:')
    if idx_qs != -1:
        idx_end_results = app_js.find('renderQuizResults()', idx_qs)
        idx_end_brace = app_js.find('},', idx_end_results) + 2
        app_js = app_js[:idx_qs] + new_quiz_engine.strip() + '\n  ' + app_js[idx_end_brace:]
        print("Inyectado nuevo sistema de 5 preguntas tácticas.")

# Cerrar el temporizador si el usuario cierra el modal de la lección
if 'this.stopQuizTimer();' not in app_js:
    idx_close = app_js.find('closeLessonModal() {')
    if idx_close != -1:
        end_b = app_js.find('{', idx_close) + 1
        app_js = app_js[:end_b] + '\n    this.stopQuizTimer();' + app_js[end_b:]
        print("Añadida detención de temporizador en closeLessonModal.")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("=== APP.JS ACTUALIZADO AL 100% CON 5 PREGUNTAS TÁCTICAS ===")
