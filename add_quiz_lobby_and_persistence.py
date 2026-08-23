import re

APP_JS = 'js/app.js'

print("=== ACTUALIZANDO QUIZ ENGINE: LOBBY DE INICIO, PERSISTENCIA DE NOTAS Y BLOQUEO/DESBLOQUEO ===")

with open(APP_JS, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Buscamos la sección del quizState e initLessonQuiz
new_lobby_methods = '''
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
    startTime: null,
    hasStarted: false
  },

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
      startTime: null,
      hasStarted: false
    };

    // Consultamos si ya tiene nota previa guardada
    const scoreKey = `score_m${modNumber}_p${pIndex}`;
    const scores = JSON.parse(localStorage.getItem('userPillarScores') || '{}');
    const pastResult = scores[scoreKey] || null;

    // Actualizar estado del botón de completar lección
    const btnComplete = document.getElementById('btnCompleteLesson');
    if (btnComplete) {
      if (pastResult && pastResult.passed) {
        btnComplete.disabled = false;
        btnComplete.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        btnComplete.disabled = true;
        btnComplete.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }

    // Renderizamos el Lobby de Inicio (No arranca solo)
    this.renderQuizLobby(pastResult);
  },

  renderQuizLobby(pastResult) {
    const container = document.getElementById('quizInteractiveContainer');
    if (!container) return;

    const state = this.quizState;
    const hasHistory = pastResult !== null;
    const isPassed = hasHistory && pastResult.passed;

    container.innerHTML = `
      <div class="p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6 text-center animate-fade-in shadow-inner">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-400 text-3xl shadow-lg">
          <i class="fa-solid fa-brain"></i>
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <h4 class="text-xl font-bold text-white tracking-wide">
            Entrenamiento de Asimilación Táctica
          </h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Pon a prueba tu agilidad mental frente a 5 escenarios tácticos simulados. El examen no se detendrá una vez que inicies.
          </p>
        </div>

        <!-- Indicadores de Reglas del Examen -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-left">
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-[10px] font-mono text-slate-500 uppercase">Preguntas</div>
            <div class="text-sm font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
              <i class="fa-solid fa-list-ol text-cyan-400 text-xs"></i> 5 Niveles
            </div>
          </div>
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-[10px] font-mono text-slate-500 uppercase">Tiempo</div>
            <div class="text-sm font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
              <i class="fa-solid fa-stopwatch text-amber-400 text-xs"></i> 45s / Preg.
            </div>
          </div>
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-[10px] font-mono text-slate-500 uppercase">Nota Mínima</div>
            <div class="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <i class="fa-solid fa-shield-check text-emerald-400 text-xs"></i> 80% (4/5)
            </div>
          </div>
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-[10px] font-mono text-slate-500 uppercase">Recompensa</div>
            <div class="text-sm font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
              <i class="fa-solid fa-award text-amber-400 text-xs"></i> Medalla + XP
            </div>
          </div>
        </div>

        <!-- Estado de la Última Nota -->
        <div class="p-4 rounded-xl max-w-lg mx-auto ${hasHistory ? (isPassed ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border border-rose-500/40 text-rose-300') : 'bg-slate-900/60 border border-slate-800 text-slate-400'} flex items-center justify-between text-xs font-mono">
          <span class="flex items-center gap-2">
            <i class="fa-solid ${hasHistory ? (isPassed ? 'fa-circle-check text-emerald-400 text-base' : 'fa-triangle-exclamation text-rose-400 text-base') : 'fa-hourglass-start text-cyan-400'}"></i>
            <span>${hasHistory ? `Última Nota: ${pastResult.score}/5 (${pastResult.score * 20}%) - ${isPassed ? 'Aprobado 🥈' : 'No Aprobado ⚠️'}` : 'Estado: Pendiente de Evaluación'}</span>
          </span>
          <span class="text-[10px] ${isPassed ? 'text-emerald-400 font-bold' : 'text-slate-500'}">
            ${isPassed ? 'Lección Desbloqueada' : 'Bloqueado (Requiere 4/5)'}
          </span>
        </div>

        <!-- Botón de Inicio con Acción Directa -->
        <div class="pt-2">
          <button onclick="App.startQuizQuestions()" class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 hover:via-indigo-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-3 mx-auto cursor-pointer">
            <i class="fa-solid fa-play text-sm"></i>
            <span>${hasHistory ? 'Reintentar Evaluación (Opciones Barajadas)' : 'Iniciar Evaluación Táctica'}</span>
          </button>
        </div>
      </div>
    `;
  },

  startQuizQuestions() {
    this.quizState.hasStarted = true;
    this.quizState.currentStep = 0;
    this.quizState.score = 0;
    this.renderQuizStep();
  },
'''

# Reemplazamos en app.js el bloque previo del Quiz Engine
old_engine_match = re.search(r'// ==========================================\s*// 5-TIER NEURO-LEARNING QUIZ ENGINE[\s\S]*?renderQuizStep\(\) \{', app_js)

if old_engine_match:
    app_js = app_js[:old_engine_match.start()] + new_lobby_methods.strip() + '\n\n  renderQuizStep() {' + app_js[old_engine_match.end():]
    print("Inyectado Lobby de Inicio, control de reintento y persistencia de notas.")

# Actualizamos renderQuizResults para guardar userPillarScores
score_save_code = '''// Guardar nota y medalla en el historial del usuario
    const scoreKey = `score_m${state.modNumber}_p${state.pIndex}`;
    let allScores = JSON.parse(localStorage.getItem('userPillarScores') || '{}');
    allScores[scoreKey] = {
      score: state.score,
      total: state.totalSteps,
      percentage: state.score * 20,
      passed: isPassed,
      tier: isGold ? 'Oro' : (isSilver ? 'Plata' : 'Sin Calificar'),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('userPillarScores', JSON.stringify(allScores));

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
    }'''

old_badge_save = re.search(r'// Guardar medalla en el historial del usuario[\s\S]*?this\.addXP\(isGold \? 125 : 100\);\s*\}', app_js)
if old_badge_save:
    app_js = app_js[:old_badge_save.start()] + score_save_code + app_js[old_badge_save.end():]
    print("Actualizada persistencia de notas en userPillarScores.")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("=== ACTUALIZACIÓN DE LOBBY Y GATEKEEPER DE NOTAS COMPLETADA CON ÉXITO ===")
