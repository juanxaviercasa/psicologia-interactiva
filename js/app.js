// app.js - NEURO-TACTICAL OS v2.0 — FULL REBUILD (ALL FUNCTIONS IMPLEMENTED)
const App = {
  state: {
    activeTab: 'dashboard',
    currentCaseIndex: 0,
    currentFlashcardIndex: 0,
    filteredFlashcards: null,
    quizScore: 0,
    quizAnswered: {},
    casesSolved: 0,
    flashcardsDone: 0,
    progress: { unlockedLessons: { 'm1-0': true } },
    level: 1,
    xp: 0,
    sparringHistory: [],
    certName: '',
    userNotes: {}
  },

  // =============================================
  // INIT & CORE
  // =============================================

  toggleTheme() {
      const html = document.documentElement;
      const icon = document.getElementById('themeIcon');
      if (html.classList.contains('light-theme')) {
          html.classList.remove('light-theme');
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
          localStorage.setItem('pso_theme', 'dark');
      } else {
          html.classList.add('light-theme');
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
          localStorage.setItem('pso_theme', 'light');
      }
  },

  init() {
      // Load theme
      if (localStorage.getItem('pso_theme') === 'light') {
          document.documentElement.classList.add('light-theme');
          const icon = document.getElementById('themeIcon');
          if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
      }

    this.loadProgress();
    this.renderDashboard();
    this.loadFlashcards();

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); this.openSearchModal(); }
      if (e.key === 'Escape') { this.closeSearchModal(); this.closeLessonModal(); }
    });

    if (typeof CVEngine !== 'undefined') CVEngine.init('webcamVideo', 'webcamCanvas');
    if (typeof AIEngine !== 'undefined' && AIEngine.hasKey()) {
      const el = document.getElementById('apiKeyInput');
      if (el) el.value = '••••••••••••••••';
    }
  },

  loadProgress() {
    const saved = localStorage.getItem('pso_progress_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
        if (!this.state.progress.unlockedLessons) this.state.progress.unlockedLessons = { 'm1-0': true };
      } catch(e) { console.error('Progress load error', e); }
    }
    this.updateAllUI();
  },

  saveProgress() {
    const toSave = {
      progress: this.state.progress,
      quizScore: this.state.quizScore,
      quizAnswered: this.state.quizAnswered,
      casesSolved: this.state.casesSolved,
      flashcardsDone: this.state.flashcardsDone,
      level: this.state.level,
      xp: this.state.xp,
      certName: this.state.certName,
      userNotes: this.state.userNotes
    };
    localStorage.setItem('pso_progress_v4', JSON.stringify(toSave));
    this.updateAllUI();
  },

  updateAllUI() {
    if (typeof LIBROS_DATA === 'undefined') return;
    const unlocked = Object.keys(this.state.progress.unlockedLessons);
    const completed = Math.max(0, unlocked.length - 1);
    let total = 0;
    LIBROS_DATA.modules.forEach(m => total += m.keyPillars.length);
    const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    // Dashboard stats
    const dp = document.getElementById('dashProgressPercent');
    if (dp) dp.textContent = pct + '%';
    const db = document.getElementById('dashProgressBar');
    if (db) db.style.width = pct + '%';
    const df = document.getElementById('dashFlashcardsLearned');
    if (df) df.textContent = this.state.flashcardsDone + ' / ' + (LIBROS_DATA.flashcards ? LIBROS_DATA.flashcards.length : 18);
    const dc = document.getElementById('dashCasesSolved');
    if (dc) dc.textContent = this.state.casesSolved + ' / ' + (LIBROS_DATA.caseScenarios ? LIBROS_DATA.caseScenarios.length : 8);
    const dq = document.getElementById('dashQuizScore');
    if (dq) dq.textContent = this.state.quizScore + ' pts';

    // Streak
    const stEl = document.getElementById('streakCounterText');
    if (stEl) stEl.textContent = (this.state.progress.streak || 0) + ' Días';

    // Header level
    const lvlEl = document.getElementById('globalLevelText');
    if (lvlEl) {
      const levels = ['Novato', 'Observador', 'Analista', 'Táctico', 'Maestro'];
      lvlEl.textContent = levels[Math.min(this.state.level - 1, levels.length - 1)];
    }

    // Header progress circle
    const circle = document.getElementById('globalProgressCircle');
    if (circle) circle.textContent = pct + '%';

    // Quiz score badge
    const qb = document.getElementById('quizScoreBadge');
    if (qb && LIBROS_DATA.quizzes) qb.textContent = `Puntuación: ${this.state.quizScore} / ${LIBROS_DATA.quizzes.length}`;
  },

  playSound(type) {
    // Minimal audio feedback via AudioEngine if available
    if (typeof AudioEngine !== 'undefined' && AudioEngine.ctx && type === 'success') {
      try {
        const o = AudioEngine.ctx.createOscillator();
        const g = AudioEngine.ctx.createGain();
        o.connect(g); g.connect(AudioEngine.ctx.destination);
        o.frequency.value = 880; g.gain.value = 0.1;
        o.start(); g.gain.exponentialRampToValueAtTime(0.001, AudioEngine.ctx.currentTime + 0.3);
        o.stop(AudioEngine.ctx.currentTime + 0.3);
      } catch(e) {}
    }
  },

  
  // ==========================================
  // ADVANCED NEURAL TTS NARRATION ENGINE
  // ==========================================
  
  toggleChapterReader(contentId, headerEl) {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;
    
    const isHidden = contentEl.classList.contains('hidden');
    contentEl.classList.toggle('hidden');
    
    const chevron = headerEl.querySelector('.fa-chevron-down');
    if (chevron) {
      if (isHidden) {
        chevron.classList.add('rotate-180');
      } else {
        chevron.classList.remove('rotate-180');
      }
    }
    
    if (isHidden && typeof mermaid !== 'undefined') {
      setTimeout(() => {
        try {
          mermaid.init(undefined, contentEl.querySelectorAll('.mermaid'));
        } catch(e) {}
      }, 50);
    }
  },

  
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

  ttsState: {
    activeChapter: null,
    activeButton: null,
    utterances: [],
    currentIndex: 0,
    isPaused: false,
    selectedVoice: null
  },

  initTTSVoices() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Prioritize natural / neural Spanish voices
          const esVoices = voices.filter(v => v.lang.startsWith('es'));
          const neuralVoice = esVoices.find(v => 
            v.name.includes('Natural') || 
            v.name.includes('Online') || 
            v.name.includes('Neural') || 
            v.name.includes('Google español')
          );
          const savedVoiceName = localStorage.getItem('userTTSVoice');
          const savedVoice = savedVoiceName ? esVoices.find(v => v.name === savedVoiceName) : null;
          this.ttsState.selectedVoice = savedVoice || neuralVoice || esVoices[0] || null;
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  },

  stripMarkdownForTTS(md) {
    if (!md) return '';
    return md
      .replace(/```mermaid[\s\S]*?```/g, '') // remove mermaid diagrams
      .replace(/```[\s\S]*?```/g, '')        // remove code blocks
      .replace(/`[^`]*`/g, '')                 // remove inline code
      .replace(/!\[.*?\]\(.*?\)/g, '')         // remove images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')      // keep link text
      .replace(/^#{1,6}\s+/gm, '')             // remove headings
      .replace(/>\s*\[!.*?\]/g, '')            // remove alert markers
      .replace(/>/g, '')                       // remove blockquotes
      .replace(/[*_~]{1,3}/g, '')              // remove bold/italic/strikethrough
      .replace(/📖|🔥|🧠|🏛️|✅|❌|⚠️|🚀|💡|🎉|✍️|📦|📁/g, '') // remove emojis
      .replace(/\s+/g, ' ')                   // normalize spaces
      .trim();
  },

  toggleAudioNarration(chapterKey, btn) {
    if (!('speechSynthesis' in window)) {
      this.showToast('Tu navegador no soporta síntesis de voz.', 'error');
      return;
    }

    const state = this.ttsState;

    // Case 1: If clicked the active chapter currently speaking -> Pause / Resume
    if (state.activeChapter === chapterKey) {
      if (state.isPaused) {
        window.speechSynthesis.resume();
        state.isPaused = false;
        btn.innerHTML = '<i class="fa-solid fa-pause text-amber-400 animate-pulse"></i> <span class="btn-text text-amber-300">Pausar</span>';
        btn.classList.add('bg-amber-950/90', 'border-amber-500/60');
      } else {
        window.speechSynthesis.pause();
        state.isPaused = true;
        btn.innerHTML = '<i class="fa-solid fa-play text-cyan-400"></i> <span class="btn-text text-cyan-300">Reanudar</span>';
        btn.classList.remove('bg-amber-950/90');
        btn.classList.add('bg-cyan-950/90', 'border-cyan-500/60');
      }
      return;
    }

    // Case 2: Stop any previous playback
    this.stopAudioNarration();

    // Case 3: Start speaking the new chapter
    const bookStore = (typeof BOOK_CONTENT !== 'undefined' ? BOOK_CONTENT : null) || window.BOOK_CONTENT || {};
    const rawText = bookStore[chapterKey] || '';
    const cleanText = this.stripMarkdownForTTS(rawText);

    if (!cleanText || cleanText.length < 5) {
      this.showToast('No hay texto para narrar en este capítulo.', 'error');
      return;
    }

    // Ensure voices are loaded
    if (!state.selectedVoice) this.initTTSVoices();

    // Chunk text into natural sentences to bypass Chrome 15s freeze bug
    const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
    state.utterances = sentences.map(s => s.trim()).filter(s => s.length > 0);
    state.currentIndex = 0;
    state.activeChapter = chapterKey;
    state.activeButton = btn;
    state.isPaused = false;

    // Update Button UI
    btn.innerHTML = '<i class="fa-solid fa-pause text-amber-400 animate-pulse"></i> <span class="btn-text text-amber-300">Pausar</span>';
    btn.classList.add('bg-amber-950/90', 'border-amber-500/60');

    this.showToast('Iniciando audio narración del capítulo...', 'info');
    this.playNextTTSChunk();
  },

  playNextTTSChunk() {
    const state = this.ttsState;
    if (!state.activeChapter || state.currentIndex >= state.utterances.length) {
      this.stopAudioNarration();
      return;
    }

    const chunk = state.utterances[state.currentIndex];
    const u = new SpeechSynthesisUtterance(chunk);
    u.lang = 'es-ES';
    const savedRate = localStorage.getItem('userTTSRate');
    u.rate = savedRate ? parseFloat(savedRate) : 0.92; // Cadencia tranquila y comprensible
    u.pitch = 1.0;
    if (state.selectedVoice) u.voice = state.selectedVoice;

    // Calcular pausa natural según el signo de puntuación final
    let pauseMs = 380; // Pausa estándar de 380ms para punto seguido
    if (chunk.endsWith('?') || chunk.endsWith('!')) {
      pauseMs = 450;
    } else if (chunk.endsWith(':') || chunk.endsWith(';')) {
      pauseMs = 250;
    } else if (chunk.endsWith(',')) {
      pauseMs = 180;
    }

    u.onend = () => {
      if (!state.isPaused && state.activeChapter) {
        state.currentIndex++;
        // Respiración / Pausa humana antes de la siguiente oración
        setTimeout(() => {
          if (!state.isPaused && state.activeChapter) {
            this.playNextTTSChunk();
          }
        }, pauseMs);
      }
    };

    u.onerror = (e) => {
      console.warn('TTS chunk error:', e);
      state.currentIndex++;
      setTimeout(() => this.playNextTTSChunk(), 200);
    };

    window.speechSynthesis.speak(u);
  },

  stopAudioNarration() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const state = this.ttsState;
    if (state.activeButton) {
      state.activeButton.innerHTML = '<i class="fa-solid fa-volume-high text-indigo-400"></i> <span class="btn-text">Escuchar</span>';
      state.activeButton.classList.remove('bg-amber-950/90', 'border-amber-500/60', 'bg-cyan-950/90', 'border-cyan-500/60');
    }
    state.activeChapter = null;
    state.activeButton = null;
    state.utterances = [];
    state.currentIndex = 0;
    state.isPaused = false;
  },

  // ==========================================
  // VOICE CONFIGURATOR METHODS
  // ==========================================
  populateVoiceSelect() {
    const select = document.getElementById('ttsVoiceSelect');
    if (!select || !('speechSynthesis' in window)) return;
    
    let voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      setTimeout(() => this.populateVoiceSelect(), 150);
      return;
    }
    
    // Sort: Spanish voices first, neural/natural first
    const esVoices = voices.filter(v => v.lang.startsWith('es') || v.lang.includes('ES') || v.lang.includes('MX') || v.lang.includes('US') || v.lang.includes('419'));
    const otherVoices = voices.filter(v => !esVoices.includes(v));
    const voiceList = esVoices.length > 0 ? [...esVoices, ...otherVoices] : voices;

    select.innerHTML = voiceList.map(v => {
      const isEs = v.lang.startsWith('es');
      const isNeural = v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online') || v.name.includes('Google');
      const isFemale = v.name.toLowerCase().includes('dalia') || v.name.toLowerCase().includes('elena') || v.name.toLowerCase().includes('laura') || v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('paulina') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer');
      const isMale = v.name.toLowerCase().includes('jorge') || v.name.toLowerCase().includes('alvaro') || v.name.toLowerCase().includes('raul') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hombre');
      
      let tag = isNeural ? '⭐ Neural' : 'Estándar';
      let genderTag = isFemale ? ' [Femenina]' : (isMale ? ' [Masculina]' : '');
      let langTag = isEs ? '🇪🇸 Español' : `🌐 ${v.lang}`;
      
      return `<option value="${v.name}">${langTag} - ${v.name} (${tag}${genderTag})</option>`;
    }).join('');

    const savedVoice = localStorage.getItem('userTTSVoice');
    if (savedVoice) {
      select.value = savedVoice;
    } else if (this.ttsState.selectedVoice) {
      select.value = this.ttsState.selectedVoice.name;
    }
  },

  openVoiceSettingsModal() {
    const modal = document.getElementById('voiceSettingsModal');
    if (!modal) return;
    
    this.populateVoiceSelect();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => this.populateVoiceSelect();
    }
    
    const range = document.getElementById('ttsSpeedRange');
    const speedLabel = document.getElementById('ttsSpeedLabel');
    const savedRate = localStorage.getItem('userTTSRate') || '0.92';
    if (range) {
      range.value = savedRate;
      if (speedLabel) speedLabel.innerText = savedRate + 'x';
    }
    
    modal.classList.remove('hidden');
  },

  closeVoiceSettingsModal() {
    const modal = document.getElementById('voiceSettingsModal');
    if (modal) modal.classList.add('hidden');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  saveVoiceSettings() {
    const select = document.getElementById('ttsVoiceSelect');
    const range = document.getElementById('ttsSpeedRange');
    
    if (select && select.value) {
      localStorage.setItem('userTTSVoice', select.value);
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices.find(v => v.name === select.value);
      if (chosen) this.ttsState.selectedVoice = chosen;
    }
    
    if (range) {
      localStorage.setItem('userTTSRate', range.value);
    }
    
    this.closeVoiceSettingsModal();
    this.showToast('Preferencias de voz guardadas con éxito.', 'success');
  },

  testVoice() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const select = document.getElementById('ttsVoiceSelect');
    const range = document.getElementById('ttsSpeedRange');
    
    const sampleText = "Esta es una demostración de mi voz para la lectura de Psicología Oscura. La autorregulación emocional y el pensamiento crítico son tus mejores defensas.";
    const u = new SpeechSynthesisUtterance(sampleText);
    u.lang = 'es-ES';
    u.rate = range ? parseFloat(range.value) : 0.92;
    
    if (select && select.value) {
      const voices = window.speechSynthesis.getVoices();
      const chosen = voices.find(v => v.name === select.value);
      if (chosen) u.voice = chosen;
    }
    
    window.speechSynthesis.speak(u);
  },


  speakText(text) {
    if ('speechSynthesis' in window) {
      this.stopAudioNarration();
      if (!this.ttsState.selectedVoice) this.initTTSVoices();
      
      const clean = this.stripMarkdownForTTS(text);
      const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
      this.ttsState.utterances = sentences.map(s => s.trim()).filter(s => s.length > 0);
      this.ttsState.currentIndex = 0;
      this.ttsState.activeChapter = 'generic_text';
      this.ttsState.isPaused = false;

      this.showToast('Reproduciendo audio con voz neural...', 'info');
      this.playNextTTSChunk();
    } else {
      this.showToast('Tu navegador no soporta síntesis de voz.', 'error');
    }
  },

  addXP(amount) {
    this.state.xp += amount;
    const xpPerLevel = 100;
    if (this.state.xp >= xpPerLevel * this.state.level) {
      this.state.level++;
      this.showToast(`🎖️ ¡Nivel ${this.state.level} desbloqueado!`, 'success');
    }
    this.saveProgress();
  },

  showToast(msg, type = 'info') {
    const existing = document.getElementById('toastNotif');
    if (existing) existing.remove();

    const colors = { success: 'bg-emerald-600 border-emerald-400', error: 'bg-rose-700 border-rose-500', info: 'bg-indigo-700 border-indigo-400' };
    const div = document.createElement('div');
    div.id = 'toastNotif';
    div.className = `fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl border ${colors[type]} text-white text-sm font-bold shadow-2xl transition-all animate-in slide-in-from-bottom-5 duration-300`;
    div.innerHTML = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3500);
  },

  // =============================================
  // TAB NAVIGATION
  // =============================================
  goToModule(modNumber) {
    this.switchTab('learning');
    setTimeout(() => {
      const el = document.getElementById(`module-${modNumber}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  },

  switchTab(tabId) {
    this.state.activeTab = tabId;
    if (window.speechSynthesis && window.speechSynthesis.speaking) window.speechSynthesis.cancel();

    const views = ['dashboard','learning','matrix','simulator','bodylab','flashcards','quizzes','certificate','glossary','skilltree','sparring','auditor','biometrics'];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.classList.add('hidden');
      const btn = document.getElementById(`tab-btn-${v}`);
      if (btn) { btn.classList.remove('active','text-cyan-400','text-indigo-400','text-rose-400','text-emerald-400'); btn.classList.add('text-slate-400'); }
    });

    const target = document.getElementById(`view-${tabId}`);
    if (target) {
        target.classList.remove('hidden', 'fade-in-view');
        // Trigger reflow
        void target.offsetWidth;
        target.classList.add('fade-in-view');
    }
    const btn = document.getElementById(`tab-btn-${tabId}`);
    if (btn) { btn.classList.add('active','text-cyan-400'); btn.classList.remove('text-slate-400'); }

    if (tabId === 'learning') this.renderLearningPath();
    else if (tabId === 'matrix') this.renderMatrix();
    else if (tabId === 'simulator') this.renderSimulator();
    else if (tabId === 'bodylab') this.renderBodyLab();
    else if (tabId === 'flashcards') this.renderCurrentFlashcard();
    else if (tabId === 'quizzes') this.renderQuizzes();
    else if (tabId === 'glossary') this.renderGlossary();
    else if (tabId === 'certificate') this.renderCertificateView();
    else if (tabId === 'skilltree') this.renderSkillTree();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // =============================================
  // DASHBOARD
  // =============================================
  renderDashboard() {
    if (typeof LIBROS_DATA === 'undefined') return;
    const container = document.getElementById('dashboardModulesGrid');
    if (!container) return;
    container.innerHTML = LIBROS_DATA.modules.map(m => {
      let modCompletedCount = 0;
      m.keyPillars.forEach((_, pi) => {
        const nextId = pi + 1 < m.keyPillars.length ? `m${m.bookNumber}-${pi+1}` : `m${m.bookNumber+1}-0`;
        if (this.state.progress.unlockedLessons && this.state.progress.unlockedLessons[nextId]) modCompletedCount++;
      });
      const modTotal = m.keyPillars.length;
      const modPct = Math.round((modCompletedCount / modTotal) * 100);

      return `
      <div class="glass-card rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col overflow-hidden" onclick="App.goToModule(${m.bookNumber})">
        <!-- IMAGE THUMBNAIL - PROMINENT & VISIBLE — 16:9 ratio, no distortion -->
        <div class="relative w-full bg-slate-900 overflow-hidden" style="padding-top: 56.25%;">
          <img src="assets/img/cover_mod${m.bookNumber}.jpg"
               alt="${m.title}"
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               onerror="this.style.display='none'">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
          <span class="absolute top-2 right-2 text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur px-2 py-0.5 rounded border border-slate-700">${m.badge}</span>
        </div>
        <!-- CARD CONTENT -->
        <div class="p-4 flex flex-col flex-1">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 text-sm shrink-0">
                <i class="fa-solid ${m.icon}"></i>
              </div>
              <h3 class="text-white font-bold text-sm leading-tight">${m.title}</h3>
            </div>
            <p class="text-xs text-slate-400 line-clamp-2 mb-3 flex-1">${m.overview}</p>
            
            <div class="mt-auto">
              <div class="flex justify-between text-[10px] mb-1">
                <span class="text-slate-400">${modCompletedCount}/${modTotal} Pilares</span>
                <span class="${modPct === 100 ? 'text-emerald-400' : 'text-cyan-400'} font-bold">${modPct}%</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="h-full ${modPct === 100 ? 'bg-emerald-500' : 'bg-cyan-500'} transition-all duration-500" style="width: ${modPct}%"></div>
              </div>
            </div>
        </div>
      </div>
      `;
    }).join('');
  },

  renderLearningPath() {
    const container = document.getElementById('learningPathContainer');
    if (!container || typeof LIBROS_DATA === 'undefined') return;
    if (!this.state.progress.unlockedLessons) this.state.progress.unlockedLessons = { 'm1-0': true };

    let html = '';
    let prevModCompleted = true;

    LIBROS_DATA.modules.forEach((mod) => {
      let modCompletedCount = 0;
      mod.keyPillars.forEach((_, pi) => {
        const nextId = pi + 1 < mod.keyPillars.length ? `m${mod.bookNumber}-${pi+1}` : `m${mod.bookNumber+1}-0`;
        if (this.state.progress.unlockedLessons[nextId]) modCompletedCount++;
      });
      const modTotal = mod.keyPillars.length;
      const modPct = Math.round((modCompletedCount / modTotal) * 100);

      html += `
        <div id="module-${mod.bookNumber}" class="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl shadow-xl scroll-mt-24">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 border border-indigo-500/30 shrink-0">
              <i class="fa-solid ${mod.icon}"></i>
            </div>
            <div class="flex-1">
              <div class="text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Fase ${mod.bookNumber}</div>
              <h3 class="text-base font-bold text-white">${mod.title}</h3>
            </div>
            <div class="text-right shrink-0">
              <div class="text-xs font-mono font-bold ${modPct === 100 ? 'text-emerald-400' : 'text-slate-400'}">${modPct}%</div>
            </div>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-1 mb-4">
            <div class="bg-indigo-500 h-1 rounded-full transition-all" style="width:${modPct}%"></div>
          </div>
          <div class="space-y-2 pl-4 border-l-2 border-slate-800 ml-4">
      `;

      mod.keyPillars.forEach((pillar, pIndex) => {
        const lessonId = `m${mod.bookNumber}-${pIndex}`;
        const nextId = pIndex + 1 < mod.keyPillars.length ? `m${mod.bookNumber}-${pIndex+1}` : `m${mod.bookNumber+1}-0`;
        const isFirst = mod.bookNumber === 1 && pIndex === 0;
        const isUnlocked = isFirst || this.state.progress.unlockedLessons[lessonId];
        const isCompleted = this.state.progress.unlockedLessons[nextId] && pIndex + 1 < mod.keyPillars.length
          ? true
          : this.state.progress.unlockedLessons[`m${mod.bookNumber+1}-0`] && pIndex === mod.keyPillars.length - 1;

        const actuallyUnlocked = isUnlocked && prevModCompleted;

        html += `
          <div class="relative pl-5 py-1.5 ${actuallyUnlocked ? '' : 'opacity-40'}">
            <div class="absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full border-2 ${isCompleted ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_8px_#6366f1]' : (actuallyUnlocked ? 'bg-amber-400 border-amber-300 animate-pulse' : 'bg-slate-700 border-slate-600')}"></div>
            <button
              ${actuallyUnlocked ? `onclick="App.openLessonModal(${mod.bookNumber}, ${pIndex})"` : 'disabled'}
              class="w-full text-left p-3.5 rounded-xl border ${actuallyUnlocked ? 'border-indigo-500/20 bg-indigo-950/10 hover:bg-indigo-900/20 hover:border-indigo-500/40 cursor-pointer' : 'border-slate-800 bg-slate-900/30 cursor-not-allowed'} flex justify-between items-center group transition-all">
              <div>
                <div class="text-[10px] ${actuallyUnlocked ? 'text-indigo-400' : 'text-slate-600'} font-mono mb-0.5">Pilar ${pIndex + 1} de ${modTotal}</div>
                <div class="font-semibold text-sm ${actuallyUnlocked ? 'text-slate-200' : 'text-slate-600'}">${pillar.title}</div>
                ${pillar.diagram ? '<div class="text-[10px] text-cyan-500 mt-0.5"><i class="fa-solid fa-sitemap"></i> Incluye mapa mental</div>' : ''}
                ${pillar.interactiveChallenge ? '<div class="text-[10px] text-amber-500 mt-0.5"><i class="fa-solid fa-bolt"></i> Incluye prueba interactiva</div>' : ''}
              </div>
              <div class="text-slate-500 group-hover:text-indigo-400 transition-colors">
                ${isCompleted ? '<i class="fa-solid fa-circle-check text-indigo-500 text-lg"></i>' : (actuallyUnlocked ? '<i class="fa-solid fa-play text-indigo-400"></i>' : '<i class="fa-solid fa-lock text-slate-600"></i>')}
              </div>
            </button>
          </div>
        `;
      });

      prevModCompleted = modCompletedCount === modTotal;
      html += `</div></div>`;
    });

    container.innerHTML = html;
  },

  enrichTextWithIcons(text) {
    if (!text) return '';
    let res = text;
    const rules = [
        { regex: /\b(cerebro|neurol[óo]gic[oa]s?)\b/gi, icon: '<i class="fa-solid fa-brain text-pink-400 mx-1"></i>$1' },
        { regex: /\b(am[íi]gdala)\b/gi, icon: '<i class="fa-solid fa-fire text-rose-500 mx-1"></i>$1' },
        { regex: /\b(Sistema 1)\b/gi, icon: '<span class="bg-rose-950/40 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/20 mx-1 whitespace-nowrap"><i class="fa-solid fa-bolt text-amber-500"></i> Sistema 1</span>' },
        { regex: /\b(Sistema 2)\b/gi, icon: '<span class="bg-indigo-950/40 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 mx-1 whitespace-nowrap"><i class="fa-solid fa-chess-knight text-indigo-400"></i> Sistema 2</span>' },
        { regex: /\b(cortisol)\b/gi, icon: '<span class="text-rose-400 font-bold">$1 <i class="fa-solid fa-temperature-arrow-up"></i></span>' },
        { regex: /\b(dopamina|oxitocina)\b/gi, icon: '<span class="text-cyan-400 font-bold">$1 <i class="fa-solid fa-droplet"></i></span>' },
        { regex: /\b(manipulador(?:es)?)\b/gi, icon: '<span class="text-rose-400 font-semibold"><i class="fa-solid fa-user-ninja"></i> $1</span>' },
        { regex: /\b(v[íi]ctima(?:s)?)\b/gi, icon: '<span class="text-emerald-400 font-semibold"><i class="fa-solid fa-user-shield"></i> $1</span>' },
        { regex: /\b(Contacto Cero)\b/gi, icon: '<span class="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-600 font-mono mx-1 whitespace-nowrap"><i class="fa-solid fa-user-slash text-rose-500"></i> Contacto Cero</span>' },
        { regex: /\b(l[íi]mite(?:s)?)\b/gi, icon: '<span class="border-b-2 border-emerald-500 text-emerald-300"><i class="fa-solid fa-ban text-emerald-400"></i> $1</span>' },
        { regex: /\b(Piedra Gris)\b/gi, icon: '<span class="text-slate-400 font-bold bg-slate-800 px-1 rounded"><i class="fa-solid fa-hill-rockslide"></i> Piedra Gris</span>' },
        { regex: /\b(DARVO)\b/gi, icon: '<span class="text-rose-500 font-bold bg-rose-950/30 px-1 rounded border border-rose-500/30"><i class="fa-solid fa-radiation"></i> DARVO</span>' },
        { regex: /\b(subconsciente)\b/gi, icon: '<i class="fa-solid fa-water text-cyan-500 mx-1"></i>$1' }
    ];
    rules.forEach(rule => {
        res = res.replace(rule.regex, rule.icon);
    });
    return res;
  },

  openLessonModal(modNumber, pIndex) {
    if (typeof LIBROS_DATA === 'undefined') return;
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    if (!mod) return;
    const pillar = mod.keyPillars[pIndex];
    if (!pillar) return;

    document.getElementById('lessonModalTitle').innerHTML = `<i class="fa-solid fa-brain"></i> ${pillar.title}`;

    const notes = this.state.userNotes[`m${modNumber}-${pIndex}`] || '';
    
    // Support for both old and new data structures
    const rawConcept = pillar.storytellingConcept || pillar.concept;
    const rawShield = pillar.tacticalShield || pillar.tacticalRule;
    const conceptText = this.enrichTextWithIcons(rawConcept);
    const shieldText = this.enrichTextWithIcons(rawShield);
    
    let dialogueHtml = '';
    if (pillar.dialogueBreakdown && pillar.dialogueBreakdown.length > 0) {
        dialogueHtml = pillar.dialogueBreakdown.map(line => {
            const isAggressor = line.speaker.toLowerCase().includes('manipulador') || line.speaker === 'A' || line.speaker.toLowerCase().includes('tóxica');
            const icon = isAggressor 
    ? '<img src="assets/img/avatar_manipulator.jpg" class="w-12 h-12 rounded-full border-2 border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.5)] object-cover shrink-0">' 
    : '<img src="assets/img/avatar_victim.jpg" class="w-12 h-12 rounded-full border-2 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.5)] object-cover shrink-0">';
            return `
            <div class="mb-4">
                <div class="flex items-center gap-2 text-[11px] font-bold ${isAggressor ? 'text-rose-400' : 'text-emerald-400'} mb-1 tracking-wider uppercase">
                    ${icon} ${line.speaker}:
                </div>
                <div class="bg-slate-900/80 p-3.5 rounded-lg text-slate-200 text-sm italic mb-2 border-l-2 ${isAggressor ? 'border-rose-500' : 'border-emerald-500'} shadow-sm">
                    "${this.enrichTextWithIcons(line.text)}"
                </div>
                <div class="flex items-start gap-2 text-[11.5px] text-slate-300 bg-indigo-950/30 p-2.5 rounded border border-indigo-500/20">
                    <i class="fa-solid fa-microscope text-indigo-400 mt-0.5"></i>
                    <div><span class="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">Disección:</span> ${this.enrichTextWithIcons(line.analysis)}</div>
                </div>
            </div>
        `}).join('');
    } else {
        dialogueHtml = `<p class="text-rose-100 italic text-sm leading-relaxed p-2">"${pillar.realExample}"</p>`;
    }

    const socraticBtnHtml = `
        <div class="flex justify-center mt-6 pt-5 border-t border-slate-700/50">
            <button onclick="App.startSocraticSparring(${modNumber}, ${pIndex})" class="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all flex items-center gap-2">
                <i class="fa-solid fa-robot text-lg"></i> ¿Dudas? Debatir este pilar con el Mentor AI
            </button>
        </div>
    `;

    
    const moduleIcons = {
        1: '<i class="fa-solid fa-network-wired"></i>',
        2: '<i class="fa-solid fa-eye"></i>',
        3: '<i class="fa-solid fa-spider"></i>',
        4: '<i class="fa-solid fa-masks-theater"></i>',
        5: '<i class="fa-solid fa-shield-heart"></i>',
        6: '<i class="fa-solid fa-door-closed"></i>'
    };
    const modIcon = moduleIcons[modNumber] || '<i class="fa-solid fa-brain"></i>';

    let contentHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- HEADER VISUAL ARCHITECTURE -->
        <div class="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-700 shadow-2xl" style="padding-top:28%;">
            <img src="assets/img/module_header_m${modNumber}.jpg"
                 alt="Módulo ${modNumber}"
                 class="absolute inset-0 w-full h-full object-cover"
                 onerror="this.style.display='none'">
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
            <div class="absolute inset-0 flex items-end p-6 gap-4">
                <div class="w-14 h-14 rounded-2xl bg-indigo-500/30 backdrop-blur flex items-center justify-center border border-indigo-500/50 text-3xl text-indigo-300 shrink-0">
                    ${modIcon}
                </div>
                <div>
                    <div class="text-xs text-indigo-300 font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                       <i class="fa-solid fa-layer-group"></i> Fase ${modNumber} &bull; Pilar ${pIndex + 1}
                    </div>
                    <h2 class="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg">${pillar.title}</h2>
                </div>
            </div>
        </div>


        <!-- 1. LA RAÍZ (CONCEPTO) -->
        <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 lg:col-span-2 shadow-inner">
          <div class="text-[11px] text-amber-500 font-bold font-mono tracking-widest mb-4 flex justify-between items-center">
            <span><i class="fa-solid fa-seedling"></i> 1. LA RAÍZ (EL POR QUÉ FUNCIONA)</span>
            
          </div>
          <!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
          <div class="lesson-img-container w-full mb-6 mt-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950" id="lesson-img-m${modNumber}-p${pIndex+1}">
              <!-- Aspect ratio 16:9 wrapper — prevents any stretching/pixelation -->
              <div class="relative w-full" style="padding-top: 56.25%;">
                  <img src="assets/img/lesson_m${modNumber}_p${pIndex+1}.jpg" 
                       alt="Ilustración de ${pillar.title}" 
                       class="absolute inset-0 w-full h-full object-contain bg-slate-950 transition-transform duration-700 group-hover:scale-105"
                       onerror="this.parentElement.parentElement.querySelector('.img-placeholder').style.display='flex'; this.parentElement.style.display='none'">
              </div>
              <div class="img-placeholder hidden w-full aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950">
                  <div class="text-5xl text-indigo-400/60">${modIcon}</div>
                  <span class="text-xs text-slate-500 font-mono text-center px-4">Ilustración educativa en preparación</span>
                  <span class="text-[10px] text-slate-600 font-mono text-center px-8">${pillar.title}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-3">
                  <span class="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase"><i class="fa-solid fa-image text-slate-500 mr-1"></i> Fig 1. Aplicación Práctica: ${pillar.title}</span>
              </div>
          </div>
          <div class="text-slate-200 text-[15px] md:text-base leading-relaxed space-y-4 font-medium">
             ${conceptText.split('\n').map(p => `<p>${p}</p>`).join('')}
          </div>
        </div>

        <!-- 2. ANATOMÍA DEL ATAQUE -->
        <div class="p-6 rounded-2xl bg-rose-950/10 border border-rose-900/30 lg:col-span-1 shadow-inner relative overflow-hidden">
          <div class="absolute -right-4 -top-4 text-rose-500/5 text-9xl pointer-events-none"><i class="fa-solid fa-scalpel"></i></div>
          <div class="text-[11px] text-rose-400 font-bold font-mono tracking-widest mb-5 relative z-10"><i class="fa-solid fa-biohazard"></i> 2. ANATOMÍA DEL ATAQUE (DISECCIÓN)</div>
          <div class="relative z-10">
             ${dialogueHtml}
          </div>
        </div>

        <!-- 3. EL ESCUDO TÁCTICO -->
        <div class="p-6 rounded-2xl bg-emerald-950/10 border border-emerald-900/30 lg:col-span-1 shadow-inner flex flex-col justify-center relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 text-emerald-500/5 text-9xl pointer-events-none"><i class="fa-solid fa-shield"></i></div>
          <div class="text-[11px] text-emerald-400 font-bold font-mono tracking-widest mb-5 relative z-10"><i class="fa-solid fa-shield-halved"></i> 3. MECÁNICA DEL ESCUDO (LA DEFENSA)</div>
          <div class="text-emerald-100/90 text-[15px] leading-relaxed relative z-10 space-y-3 font-medium">
              ${shieldText.split('\n').map(p => `<p>${p}</p>`).join('')}
          </div>
        </div>

        <!-- 4. NEUROBIOLOGÍA -->
        ${pillar.deepDive ? `
        <div class="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 relative overflow-hidden lg:col-span-2">
          <div class="text-[11px] text-indigo-400 font-bold font-mono tracking-widest mb-3 relative z-10"><i class="fa-solid fa-network-wired"></i> 4. CONSOLIDACIÓN NEUROLÓGICA (EL MECANISMO)</div>
          <p class="text-indigo-200/90 text-sm leading-relaxed relative z-10">${pillar.deepDive}</p>
        </div>` : ''}

        ${pillar.clinicalCase ? `
        <!-- CASO CLÍNICO DOCUMENTADO -->
        <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 lg:col-span-2 shadow-inner mb-4">
          <div class="text-[11px] text-amber-500 font-bold font-mono tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-file-medical"></i> EVIDENCIA EMPÍRICA: CASO CLÍNICO
          </div>
          <div class="text-slate-300 text-[15px] md:text-base leading-relaxed italic border-l-4 border-amber-500/30 pl-4 bg-slate-900/30 p-4 rounded-r-xl">
             ${this.enrichTextWithIcons(pillar.clinicalCase)}
          </div>
        </div>` : ''}
        
        ${pillar.academicCitation ? `
        <!-- RESPALDO ACADÉMICO -->
        <div class="p-5 rounded-xl bg-slate-950 border border-slate-800 lg:col-span-2 shadow-sm flex items-start gap-4 mb-4">
          <div class="text-slate-600 text-2xl pt-1 shrink-0"><i class="fa-solid fa-graduation-cap"></i></div>
          <div>
            <div class="text-[10px] text-slate-500 font-bold font-mono tracking-widest uppercase mb-1">Respaldo Académico / Científico</div>
            <div class="text-slate-400 text-xs leading-relaxed font-serif">
               ${pillar.academicCitation}
            </div>
          </div>
        </div>` : ''}

        <!-- DIAGRAMA EDUCATIVO -->
        <div class="lg:col-span-2">
          <div class="text-[11px] text-slate-500 font-bold font-mono tracking-widest mb-2"><i class="fa-solid fa-diagram-project text-slate-500 mr-1"></i> DIAGRAMA DEL MECANISMO INTERNO</div>
          <div class="relative w-full rounded-xl overflow-hidden border border-slate-700 shadow-md bg-slate-950 group" style="padding-top:56.25%;">
            <img src="assets/img/diagram_m${modNumber}_p${pIndex+1}.jpg"
                 alt="Diagrama ${pillar.title}"
                 class="absolute inset-0 w-full h-full object-contain bg-slate-950 transition-transform duration-500 group-hover:scale-105"
                 onerror="this.parentElement.parentElement.style.display='none'">
          </div>
        </div>

        <!-- 5. MAPA MENTAL -->
        ${pillar.diagram ? `
        <div class="p-6 rounded-2xl bg-slate-900 border border-cyan-500/20 lg:col-span-2 overflow-x-auto">
          <div class="text-[11px] text-cyan-400 font-bold font-mono tracking-widest mb-4"><i class="fa-solid fa-sitemap"></i> 5. ARQUITECTURA VISUAL (MAPA MENTAL)</div>
          <div class="mermaid text-sm flex justify-center">${pillar.diagram}</div>
        </div>` : ''}

        <!-- 6. DESAFÍO INTERACTIVO ESTILO BRILLIANT.ORG -->
        <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-indigo-500/30 lg:col-span-2 shadow-2xl relative overflow-hidden">
          <div class="absolute -right-8 -top-8 text-indigo-500/5 text-9xl pointer-events-none"><i class="fa-solid fa-brain"></i></div>
          <div class="text-[11px] text-amber-400 font-bold font-mono tracking-widest mb-4 flex items-center gap-2 relative z-10">
            <i class="fa-solid fa-bolt text-amber-400 animate-pulse"></i> 6. ENTRENAMIENTO DE ASIMILACIÓN INTERACTIVA
          </div>
          
          <div id="quizInteractiveContainer" class="relative z-10">
            <!-- Renderizado dinámico por App.initLessonQuiz -->
          </div>
        </div>

        <!-- 7. NOTAS PERSONALES & SPAR AI -->
        <div class="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 lg:col-span-2">
          <div class="text-[11px] text-slate-400 font-bold font-mono tracking-widest mb-3"><i class="fa-solid fa-pen"></i> 7. MIS NOTAS E INSIGHTS PERSONALES</div>
          <textarea id="lessonNotes" placeholder="Escribe tus conexiones, epifanías o cómo aplicarías esto mañana mismo..." class="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-32">${notes}</textarea>
          <button onclick="App.saveLessonNotes(${modNumber}, ${pIndex})" class="mt-3 px-5 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white rounded-lg transition-colors shadow-sm"><i class="fa-solid fa-save"></i> Guardar Notas</button>
          
          ${socraticBtnHtml}
        </div>

      </div>
    `;

    
    // Append Extended Reading Chapters
    if (pillar.chapters && pillar.chapters.length > 0) {
      const bookStore = (typeof BOOK_CONTENT !== 'undefined' ? BOOK_CONTENT : null) || (typeof window !== 'undefined' ? window.BOOK_CONTENT : null) || {};
      
      let chaptersHtml = `
        <div class="lg:col-span-2 mt-8">
          <div class="mb-4 flex items-center justify-between">
            <div class="text-[12px] text-cyan-400 font-bold font-mono tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-book-open-reader"></i> LECTURA PROFUNDA (TEXTO COMPLETO ORIGINAL)
            </div>
            <button onclick="App.openVoiceSettingsModal()" class="px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm" title="Cambiar voz masculina/femenina y velocidad">
              <i class="fa-solid fa-sliders text-indigo-400"></i> Configurar Voz
            </button>
          </div>
          <div class="space-y-4">
      `;
      
      pillar.chapters.forEach((chapterName, idx) => {
         const rawMd = bookStore[chapterName] || 'Contenido del capítulo no disponible.';
         
         // Parse markdown safely
         let parsedHtml = '';
         if (typeof marked !== 'undefined') {
            parsedHtml = typeof marked.parse === 'function' ? marked.parse(rawMd) : marked(rawMd);
         } else {
            parsedHtml = '<div class="whitespace-pre-wrap text-slate-300 font-sans leading-relaxed text-sm">' + rawMd + '</div>';
         }
         
         const cleanTitle = chapterName.replace(/_/g, ' ').replace(/^Tema\s*\d+\s*/i, '').trim();
         const contentId = `chapter-drawer-${modNumber}-${pIndex}-${idx}`;
         
         chaptersHtml += `
           <div class="bg-slate-900/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
             <!-- Header del Acordeón -->
             <div class="bg-slate-800/90 hover:bg-slate-700/80 px-6 py-4 border-b border-slate-700/60 flex justify-between items-center cursor-pointer transition-colors" onclick="App.toggleChapterReader('${contentId}', this)">
               <div class="flex items-center gap-3">
                 <span class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">${idx + 1}</span>
                 <span class="font-bold text-slate-100 font-serif text-base">${cleanTitle || chapterName}</span>
               </div>
               <div class="flex items-center gap-3">
                 <!-- Botón de Audio Narración -->
                 <button onclick="event.stopPropagation(); App.toggleAudioNarration('${chapterName}', this)" class="narration-btn px-3 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm" title="Escuchar este capítulo con voz natural">
                   <i class="fa-solid fa-volume-high text-indigo-400"></i>
                   <span class="btn-text">Escuchar</span>
                 </button>
                 <i class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300"></i>
               </div>
             </div>
             <!-- Cuerpo del Texto Desplegable -->
             <div id="${contentId}" class="hidden p-6 sm:p-8 prose-editorial max-w-none prose-headings:font-serif prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-cyan-300 bg-[#090e17]/80">
               ${parsedHtml}
             </div>
           </div>
         `;
      });
      chaptersHtml += `</div></div>`;
      contentHtml += chaptersHtml;
    }

    document.getElementById('lessonModalContent').innerHTML = contentHtml;

    // Inicializar Quiz Interactivo Brilliant.org
    this.initLessonQuiz(modNumber, pIndex);

    const btn = document.getElementById('btnCompleteLesson');
    btn.onclick = () => this.completeLesson(modNumber, pIndex);
    if (pillar.interactiveChallenge) {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    document.getElementById('lessonModal').classList.remove('hidden');
    document.getElementById('lessonModal').classList.add('flex');
    document.body.style.overflow = 'hidden';

    if (pillar.diagram && window.mermaid) {
      setTimeout(() => { try { mermaid.init(undefined, document.querySelectorAll('.mermaid')); } catch(e) {} }, 80);
    }
  },

  startSocraticSparring(modNumber, pIndex) {
    if (typeof LIBROS_DATA === 'undefined') return;
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    if (!mod) return;
    const pillar = mod.keyPillars[pIndex];
    if (!pillar) return;
    
    this.closeLessonModal();
    this.switchTab('sparring');
    
    // Auto-fill Sparring AI chat
    const input = document.getElementById('sparringInput');
    if (input) {
        input.value = `Quiero debatir y entender mejor este pilar: ${pillar.title}. ¿Podrías hacerme algunas preguntas socráticas para ponerme a prueba sobre cómo aplicaría esto en la vida real?`;
        
        // Optionally auto-send if the function exists
        if (typeof sendSparringMessage === 'function') {
            setTimeout(sendSparringMessage, 500);
        }
    }
  },

  checkLessonChallenge(modNumber, pIndex, selectedIdx) {
    if (typeof LIBROS_DATA === 'undefined') return;
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    const challenge = mod.keyPillars[pIndex].interactiveChallenge;
    const feedback = document.getElementById('challengeFeedback');
    const btn = document.getElementById('btnCompleteLesson');

    // Visual feedback on options
    challenge.options.forEach((_, i) => {
      const optBtn = document.getElementById(`challenge-opt-${i}`);
      if (!optBtn) return;
      if (i === challenge.correctIndex) { optBtn.className = optBtn.className.replace('border-slate-700 bg-slate-900/50', '') + ' border-emerald-500 bg-emerald-950/30 text-emerald-200'; }
      else if (i === selectedIdx && i !== challenge.correctIndex) { optBtn.className = optBtn.className.replace('border-slate-700 bg-slate-900/50', '') + ' border-rose-500 bg-rose-950/30 text-rose-200'; }
      optBtn.disabled = true;
    });

    feedback.classList.remove('hidden');

    if (selectedIdx === challenge.correctIndex) {
      feedback.className = 'mt-4 p-3 rounded-xl text-sm font-bold bg-emerald-950/30 border border-emerald-500/50 text-emerald-200';
      feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> CÓDIGO ACEPTADO — ${challenge.successMessage}`;
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
      btn.classList.add('animate-pulse');
      this.playSound('success');
      this.addXP(10);
    } else {
      feedback.className = 'mt-4 p-3 rounded-xl text-sm font-bold bg-rose-950/30 border border-rose-500/50 text-rose-200';
      feedback.innerHTML = `<i class="fa-solid fa-xmark-circle"></i> ERROR TÁCTICO — Caíste en la trampa. La respuesta correcta está resaltada.`;
    }
  },

  saveLessonNotes(modNumber, pIndex) {
    const textarea = document.getElementById('lessonNotes');
    if (!textarea) return;
    if (!this.state.userNotes) this.state.userNotes = {};
    this.state.userNotes[`m${modNumber}-${pIndex}`] = textarea.value;
    this.saveProgress();
    this.showToast('📝 Notas guardadas', 'success');
  },

  closeLessonModal() {
    document.getElementById('lessonModal').classList.add('hidden');
    document.getElementById('lessonModal').classList.remove('flex');
    document.body.style.overflow = '';
  },

  completeLesson(modNumber, pIndex) {
    if (typeof LIBROS_DATA === 'undefined') return;
    const mod = LIBROS_DATA.modules.find(m => m.bookNumber === modNumber);
    let nextId = pIndex + 1 < mod.keyPillars.length ? `m${modNumber}-${pIndex+1}` : `m${modNumber+1}-0`;

    if (!this.state.progress.unlockedLessons) this.state.progress.unlockedLessons = {};
    this.state.progress.unlockedLessons[`m${modNumber}-${pIndex}`] = true;
    this.state.progress.unlockedLessons[nextId] = true;

    this.addXP(25);
    this.saveProgress();
    this.closeLessonModal();
    this.renderLearningPath();
    if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    this.showToast('✅ ¡Pilar dominado! +25 XP', 'success');
  },

  // =============================================
  // MATRIZ TÁCTICA
  // =============================================
  renderMatrix(filter = 'all') {
    const container = document.getElementById('matrixGrid');
    if (!container || typeof LIBROS_DATA === 'undefined') return;
    let items = LIBROS_DATA.tacticalMatrix || [];
    if (filter !== 'all') items = items.filter(t => t.category === filter);

    container.innerHTML = items.map(t => `
      <div class="glass-card p-5 rounded-2xl border border-slate-800 hover:border-rose-500/30 transition-colors">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-full bg-rose-950 flex items-center justify-center text-rose-400 border border-rose-900 shrink-0">
            <i class="fa-solid ${t.icon || 'fa-exclamation'}"></i>
          </div>
          <div>
            <div class="text-[10px] text-rose-500/80 font-bold uppercase tracking-wider">${t.category}</div>
            <h4 class="text-white font-bold leading-tight text-sm">${t.name}</h4>
          </div>
        </div>
        <div class="text-xs text-slate-400 mb-3 leading-relaxed">${t.howItWorks}</div>
        <div class="mb-3">
          <div class="text-[10px] text-rose-400 font-bold font-mono mb-1.5">🚩 RED FLAGS:</div>
          <ul class="text-xs text-slate-300 list-disc list-inside space-y-0.5">
            ${t.redFlags.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <div class="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
          <div class="font-bold text-emerald-400 mb-1.5 font-mono"><i class="fa-solid fa-shield-halved"></i> CONTRAATAQUE EXACTO:</div>
          <p class="italic leading-relaxed">"${t.counterScript}"</p>
        </div>
        ${t.deepMechanics ? `<div class="mt-2 p-2.5 rounded-lg border border-indigo-500/20 bg-indigo-950/10 text-[11px] text-indigo-200/80"><i class="fa-solid fa-gears text-indigo-400 mr-1"></i><strong>CÓDIGO FUENTE:</strong> ${t.deepMechanics}</div>` : ''}
      </div>
    `).join('');

    if (items.length === 0) {
      container.innerHTML = '<div class="col-span-2 text-center text-slate-500 py-12"><i class="fa-solid fa-shield-virus text-4xl mb-3 opacity-30 block"></i>No hay fichas para esta categoría aún.</div>';
    }
  },

  filterMatrix(category) {
    document.querySelectorAll('.matrix-filter-btn').forEach(b => {
      b.className = b.className.replace('bg-cyan-500 text-slate-950', 'bg-slate-800 text-slate-300');
    });
    event.target.className = event.target.className.replace('bg-slate-800 text-slate-300', 'bg-cyan-500 text-slate-950');
    this.renderMatrix(category);
  },

  // =============================================
  // SIMULADOR DE CASOS
  // =============================================
  renderSimulator() {
    if (typeof LIBROS_DATA === 'undefined' || !LIBROS_DATA.caseScenarios) return;

    const listEl = document.getElementById('simulatorList');
    if (listEl) {
      listEl.innerHTML = LIBROS_DATA.caseScenarios.map((c, i) => `
        <button onclick="App.loadCase(${i})" class="w-full text-left p-3 rounded-xl border ${i === this.state.currentCaseIndex ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800'} text-xs font-semibold transition-all">
          <span class="text-[10px] text-slate-500 block mb-0.5">${c.badge || 'Caso ' + (i+1)}</span>
          ${c.title}
        </button>
      `).join('');
    }

    this.loadCase(this.state.currentCaseIndex);
  },

  loadCase(index) {
    this.state.currentCaseIndex = index;
    const caseData = LIBROS_DATA.caseScenarios[index];
    const area = document.getElementById('simulatorPlayerArea');
    if (!area || !caseData) return;

    area.innerHTML = `
      <div class="glass-card p-5 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2.5 py-1 bg-amber-950 text-amber-400 text-[10px] font-bold rounded border border-amber-900 font-mono">${caseData.badge || 'ESCENARIO'}</span>
        </div>
        <!-- Simulator Scenario Image -->
        <div class="relative w-full rounded-xl overflow-hidden mb-4 border border-slate-700 bg-slate-950 group" style="padding-top:56.25%;">
          <img src="assets/img/sim_case_${caseData.id.replace('c','')}.jpg"
               alt="${caseData.title}"
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               onerror="this.parentElement.style.display='none'">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
          <div class="absolute bottom-3 left-4">
            <span class="text-xs font-mono text-amber-400 font-bold tracking-widest uppercase"><i class="fa-solid fa-film mr-1"></i> Caso en Vivo</span>
          </div>
        </div>
        <h3 class="text-xl font-bold text-white mb-4">${caseData.title}</h3>
        <div class="p-4 rounded-xl bg-slate-950 border border-slate-700 mb-5 text-sm text-slate-300 leading-relaxed italic">
          "${caseData.scenarioDescription}"
        </div>
        <div class="space-y-3">
          ${caseData.options.map((opt, i) => `
            <button onclick="App.selectCase(${i})" class="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-cyan-500/40 transition-all text-sm text-slate-200 flex items-start gap-3">
              <span class="font-bold text-cyan-400 shrink-0">${['A','B','C','D'][i]}.</span>
              <span>${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Update list highlight
    document.querySelectorAll('#simulatorList button').forEach((b, i) => {
      if (i === index) { b.classList.add('border-cyan-500/50','bg-cyan-950/20','text-cyan-300'); b.classList.remove('border-slate-800','bg-slate-900/50','text-slate-300'); }
      else { b.classList.remove('border-cyan-500/50','bg-cyan-950/20','text-cyan-300'); b.classList.add('border-slate-800','bg-slate-900/50','text-slate-300'); }
    });
  },

  selectCase(optIndex) {
    const caseData = LIBROS_DATA.caseScenarios[this.state.currentCaseIndex];
    const opt = caseData.options[optIndex];
    const area = document.getElementById('simulatorPlayerArea');
    const isGood = opt.wisdomScore > 50;

    if (isGood) { this.state.casesSolved++; this.addXP(20); this.saveProgress(); }

    area.innerHTML = `
      <div class="glass-card p-6 rounded-2xl border border-slate-800 text-center mb-5">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full ${isGood ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-rose-950 border-rose-500 text-rose-400'} border-2 mb-4 text-2xl mx-auto">
          <i class="fa-solid ${isGood ? 'fa-check' : 'fa-xmark'}"></i>
        </div>
        <h3 class="text-xl font-bold text-white">${opt.outcome}</h3>
        <div class="text-sm ${isGood ? 'text-emerald-400' : 'text-rose-400'} font-mono mt-1">Wisdom Score: ${opt.wisdomScore} / 100 ${isGood ? '· +20 XP' : ''}</div>
      </div>
      <div class="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 mb-5">
        <div>
          <div class="text-[10px] text-slate-500 font-bold uppercase mb-1">Análisis Táctico</div>
          <p class="text-sm text-slate-200 leading-relaxed">${opt.analysis}</p>
        </div>
        <div class="p-3 bg-indigo-950/20 border-l-2 border-indigo-500 rounded-lg text-xs text-indigo-200">
          <strong class="text-indigo-400"><i class="fa-solid fa-book-open"></i> PRINCIPIO:</strong> ${opt.bookInsight}
        </div>
      </div>
      <div class="flex gap-3">
        <button onclick="App.renderSimulator()" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700">
          <i class="fa-solid fa-list"></i> Ver todos los casos
        </button>
        <button onclick="App.nextSimulatorCase()" class="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm">
          Siguiente <i class="fa-solid fa-arrow-right ml-1"></i>
        </button>
      </div>
    `;
  },

  nextSimulatorCase() {
    this.state.currentCaseIndex = (this.state.currentCaseIndex + 1) % LIBROS_DATA.caseScenarios.length;
    this.renderSimulator();
  },

  // =============================================
  // LABORATORIO CORPORAL
  // =============================================
  renderBodyLab() {
    const container = document.getElementById('bodyLabGrid');
    if (!container || typeof LIBROS_DATA === 'undefined') return;
    container.innerHTML = LIBROS_DATA.bodyLanguageLab.map(b => `
      <div class="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/20 transition-colors">
        <div class="text-[10px] text-cyan-500 font-bold tracking-widest mb-2 font-mono">${b.category}</div>
        <h4 class="text-white font-bold mb-3">${b.title}</h4>
        <div class="space-y-3 text-xs">
          <div class="p-2.5 bg-slate-800/50 rounded-lg"><strong class="text-slate-400 block mb-1">Señal Visual:</strong><span class="text-slate-200">${b.cue}</span></div>
          <div class="p-2.5 bg-slate-800/50 rounded-lg"><strong class="text-slate-400 block mb-1">Interpretación:</strong><span class="text-slate-200">${b.interpretation}</span></div>
          <div class="p-2.5 bg-emerald-950/20 border border-emerald-900/50 rounded-lg"><strong class="text-emerald-500 block mb-1"><i class="fa-solid fa-dumbbell"></i> Práctica Diaria:</strong><span class="text-emerald-200">${b.practicalDrill}</span></div>
          ${b.accuracyNote ? `<div class="text-[10px] text-slate-500 italic">${b.accuracyNote}</div>` : ''}
        </div>
      </div>
    `).join('');
  },

  // =============================================
  // FLASHCARDS (REPETICIÓN ESPACIADA SM-2)
  // =============================================
  loadFlashcards() {
    if (typeof LIBROS_DATA === 'undefined' || !LIBROS_DATA.flashcards) return;
    if (!this.state.filteredFlashcards) {
      this.state.filteredFlashcards = [...LIBROS_DATA.flashcards];
    }
  },

  renderCurrentFlashcard() {
    this.loadFlashcards();
    const container = document.getElementById('flashcard-container');
    if (!container || !this.state.filteredFlashcards || this.state.filteredFlashcards.length === 0) {
      if (container) container.innerHTML = '<div class="text-center text-slate-500 py-12">No hay flashcards disponibles</div>';
      return;
    }

    const cards = this.state.filteredFlashcards;
    const idx = Math.min(this.state.currentFlashcardIndex, cards.length - 1);
    const card = cards[idx];

    const counterEl = document.getElementById('fcCounterText');
    if (counterEl) counterEl.textContent = `Tarjeta ${idx + 1} de ${cards.length}`;
    const catEl = document.getElementById('fcCategoryBadge');
    if (catEl) catEl.textContent = card.category || 'General';
    const frontEl = document.getElementById('fcFrontText');
    if (frontEl) frontEl.textContent = card.front;
    const backEl = document.getElementById('fcBackText');
    if (backEl) backEl.textContent = card.back;
    const mnemoEl = document.getElementById('fcMnemonicText');
    if (mnemoEl) mnemoEl.textContent = card.mnemonic || '-';

    // Reset flip state
    const inner = document.getElementById('mainFlashcard');
    if (inner) inner.classList.remove('flipped');
  },

  flipCurrentCard() {
    const inner = document.getElementById('mainFlashcard');
    if (inner) inner.classList.toggle('flipped');
  },

  rateFlashcard(rating) {
    const cards = this.filterFlashcards();
    const currentCard = cards[this.state.currentFlashcardIndex];
    if (!currentCard) return;

    // Save rating
    if (!this.state.progress.flashcardRatings) this.state.progress.flashcardRatings = {};
    this.state.progress.flashcardRatings[currentCard.id] = rating;

    if (rating === 'easy') { this.state.flashcardsDone++; this.addXP(5); }
    
    this.nextFlashcard();
    this.saveProgress();
  },

  nextFlashcard() {
    this.state.currentFlashcardIndex++;
    if (this.state.currentFlashcardIndex >= (this.state.filteredFlashcards || []).length) {
      this.state.currentFlashcardIndex = 0;
    }
    this.renderCurrentFlashcard();
  },

  prevFlashcard() {
    this.state.currentFlashcardIndex--;
    if (this.state.currentFlashcardIndex < 0) {
      this.state.currentFlashcardIndex = (this.state.filteredFlashcards || []).length - 1;
    }
    this.renderCurrentFlashcard();
  },

  filterFlashcards(bookNum) {
    if (typeof LIBROS_DATA === 'undefined' || !LIBROS_DATA.flashcards) return;
    if (bookNum === 'all') {
      this.state.filteredFlashcards = [...LIBROS_DATA.flashcards];
    } else {
      this.state.filteredFlashcards = LIBROS_DATA.flashcards.filter(f => String(f.bookNumber) === String(bookNum));
    }
    this.state.currentFlashcardIndex = 0;
    this.renderCurrentFlashcard();
  },

  shuffleFlashcards() {
    if (!this.state.filteredFlashcards) this.loadFlashcards();
    for (let i = this.state.filteredFlashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.filteredFlashcards[i], this.state.filteredFlashcards[j]] = [this.state.filteredFlashcards[j], this.state.filteredFlashcards[i]];
    }
    this.state.currentFlashcardIndex = 0;
    this.renderCurrentFlashcard();
    this.showToast('🔀 ¡Tarjetas barajadas!', 'info');
  },

  // =============================================
  // QUIZZES
  // =============================================
  renderQuizzes() {
    const container = document.getElementById('quizzesContainer');
    if (!container || typeof LIBROS_DATA === 'undefined') return;
    container.innerHTML = LIBROS_DATA.quizzes.map((q, i) => `
      <div class="glass-card p-6 rounded-2xl border border-slate-800" id="quiz-block-${q.id}">
        <!-- Quiz Scenario Image -->
        <div class="relative w-full rounded-xl overflow-hidden mb-4 border border-slate-700 bg-slate-950 group" style="padding-top:50%;">
          <img src="assets/img/quiz_${q.id}.jpg"
               alt="Escenario ${q.question.substring(0,40)}"
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               onerror="this.parentElement.style.display='none'">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
        </div>
        <h4 class="text-base font-bold text-white mb-4 flex items-start gap-2">
          <span class="text-cyan-500 font-mono shrink-0">Q${String(i+1).padStart(2,'0')}</span>
          ${q.question}
        </h4>
        <div class="space-y-2" id="quiz-opts-${q.id}">
          ${q.options.map((opt, oi) => `
            <button onclick="App.checkQuizAnswer('${q.id}', ${oi}, ${q.correctIndex}, '${q.explanation.replace(/'/g, "&apos;")}')" class="quiz-opt w-full text-left p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-sm text-slate-300 transition-colors flex items-start gap-2">
              <span class="font-bold text-slate-500 shrink-0">${['A','B','C','D'][oi]}.</span> ${opt}
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback-${q.id}" class="mt-4 hidden p-3 rounded-xl text-sm"></div>
      </div>
    `).join('');
  },

  checkQuizAnswer(qId, selectedIdx, correctIdx, explanation) {
    const opts = document.querySelectorAll(`#quiz-opts-${qId} .quiz-opt`);
    opts.forEach((b, i) => {
      b.disabled = true;
      if (i === correctIdx) b.className = b.className.replace('border-slate-700 bg-slate-800/50','') + ' border-emerald-500 bg-emerald-950/30 text-emerald-200';
      else if (i === selectedIdx && i !== correctIdx) b.className = b.className.replace('border-slate-700 bg-slate-800/50','') + ' border-rose-500 bg-rose-950/30 text-rose-200';
    });

    const feedback = document.getElementById(`quiz-feedback-${qId}`);
    feedback.classList.remove('hidden');
    const key = `quiz-${qId}`;

    if (!this.state.quizAnswered[key]) {
      this.state.quizAnswered[key] = true;
      if (selectedIdx === correctIdx) {
        this.state.quizScore++;
        feedback.className = 'mt-4 p-3 rounded-xl text-sm bg-emerald-950/30 border border-emerald-500/50 text-emerald-200';
        feedback.innerHTML = `<i class="fa-solid fa-check"></i> <strong>¡Correcto!</strong> ${explanation}`;
        this.addXP(15);
        this.playSound('success');
      } else {
        feedback.className = 'mt-4 p-3 rounded-xl text-sm bg-rose-950/30 border border-rose-500/50 text-rose-200';
        feedback.innerHTML = `<i class="fa-solid fa-xmark"></i> <strong>Incorrecto.</strong> ${explanation}`;
      }
      this.saveProgress();
    }
  },

  resetQuiz() {
    this.state.quizScore = 0;
    this.state.quizAnswered = {};
    this.saveProgress();
    this.renderQuizzes();
    this.showToast('🔄 Quiz reiniciado', 'info');
  },

  // =============================================
  // GLOSARIO
  // =============================================
  renderGlossary(filter = '') {
    const container = document.getElementById('glossaryGrid');
    if (!container || typeof LIBROS_DATA === 'undefined') return;
    const terms = LIBROS_DATA.glossary.filter(g =>
      !filter || g.term.toLowerCase().includes(filter.toLowerCase()) || g.definition.toLowerCase().includes(filter.toLowerCase())
    );
    container.innerHTML = terms.map(g => `
      <div class="glass-card p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
        <div class="flex justify-between items-baseline mb-1.5">
          <strong class="text-cyan-400 text-sm">${g.term}</strong>
          <span class="text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded">${g.category}</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${g.definition}</p>
        ${g.example ? `<p class="text-[11px] text-slate-500 mt-2 italic">"${g.example}"</p>` : ''}
      </div>
    `).join('');

    if (terms.length === 0) {
      container.innerHTML = '<div class="col-span-3 text-center text-slate-500 py-8">No se encontraron términos.</div>';
    }
  },

  filterGlossary(query) { this.renderGlossary(query); },

  // =============================================
  // CERTIFICADO
  // =============================================
  renderCertificateView() { this.generateCertificate(); },

  saveCertName(name) {
    this.state.certName = name;
    this.saveProgress();
    this.generateCertificate();
  },

  generateCertificate() {
    const canvas = document.getElementById('certCanvas');
    if (!canvas) return;
    canvas.width = 900; canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background
    const bg = ctx.createLinearGradient(0, 0, 900, 600);
    bg.addColorStop(0, '#070D1A'); bg.addColorStop(1, '#0D1526');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 900, 600);

    // Border
    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 8; ctx.strokeRect(16, 16, 868, 568);
    ctx.strokeStyle = '#1e3a5f'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, 840, 540);

    // Header
    ctx.fillStyle = '#06b6d4'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
    ctx.fillText('NEURO-TACTICAL OS • ACADEMIA DE MAESTRÍA PSICOLÓGICA', 450, 90);

    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 38px sans-serif';
    ctx.fillText('CERTIFICADO DE DOMINIO', 450, 145);

    ctx.fillStyle = '#94a3b8'; ctx.font = 'italic 18px sans-serif';
    ctx.fillText('Se acredita que', 450, 210);

    ctx.fillStyle = '#ffffff'; ctx.font = `bold 32px sans-serif`;
    ctx.fillText(this.state.certName || 'El Estudiante', 450, 265);

    ctx.fillStyle = '#94a3b8'; ctx.font = 'italic 17px sans-serif';
    ctx.fillText('ha completado el Sistema de Aprendizaje Estratégico de', 450, 320);

    ctx.fillStyle = '#06b6d4'; ctx.font = 'bold 22px sans-serif';
    ctx.fillText('PSICOLOGÍA OSCURA Y PERFILADO TÁCTICO (6 EN 1)', 450, 360);

    // Stats
    const unlocked = Object.keys(this.state.progress.unlockedLessons).length - 1;
    ctx.fillStyle = '#475569'; ctx.font = '13px monospace';
    ctx.fillText(`Lecciones: ${Math.max(0,unlocked)} | Quiz: ${this.state.quizScore} pts | Nivel ${this.state.level} | XP: ${this.state.xp}`, 450, 420);

    ctx.fillStyle = '#334155'; ctx.font = '13px monospace';
    ctx.fillText(`Emitido: ${new Date().toLocaleDateString('es-ES', {year:'numeric', month:'long', day:'numeric'})}`, 450, 480);

    // Seal
    ctx.beginPath(); ctx.arc(450, 540, 28, 0, Math.PI*2);
    ctx.fillStyle = '#0ea5e9'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif';
    ctx.fillText('VERIFIED', 450, 544);
  },

  downloadCertificate() {
    this.generateCertificate();
    const canvas = document.getElementById('certCanvas');
    const a = document.createElement('a');
    a.download = `Certificado_PSO_${this.state.certName || 'Estudiante'}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    this.showToast('📥 Certificado descargado', 'success');
  },

  // =============================================
  // SKILL TREE
  // =============================================
  renderSkillTree() {
    const container = document.getElementById('skillTreeContainer');
    if (!container || typeof LIBROS_DATA === 'undefined') return;

    let html = '<div class="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-6 w-full py-8">';
    LIBROS_DATA.modules.forEach((mod, mi) => {
      const lessonsDone = mod.keyPillars.filter((_, pi) => {
        const nextId = pi + 1 < mod.keyPillars.length ? `m${mod.bookNumber}-${pi+1}` : `m${mod.bookNumber+1}-0`;
        return this.state.progress.unlockedLessons && this.state.progress.unlockedLessons[nextId];
      }).length;
      const total = mod.keyPillars.length;
      const pct = Math.round((lessonsDone / total) * 100);
      const unlocked = mi === 0 || lessonsDone > 0;

      // The Node
      html += `
        <div class="relative flex flex-col items-center gap-3 p-4 rounded-2xl border ${unlocked ? 'border-indigo-500/50 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-slate-800 bg-slate-900/30 opacity-50'} text-center cursor-pointer hover:border-indigo-500/80 transition-all w-48" onclick="App.switchTab('learning')">
          <div class="w-16 h-16 rounded-full ${unlocked ? 'bg-indigo-900 border-indigo-400 text-indigo-300 shadow-inner shadow-indigo-500/50' : 'bg-slate-800 border-slate-700 text-slate-600'} border-4 flex items-center justify-center text-2xl z-10">
            <i class="fa-solid ${mod.icon}"></i>
          </div>
          <div class="z-10">
            <div class="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">Fase ${mod.bookNumber}</div>
            <div class="text-sm font-bold ${unlocked ? 'text-white' : 'text-slate-600'} leading-tight">${mod.title}</div>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2 z-10 mt-2">
            <div class="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" style="width:${pct}%"></div>
          </div>
          <div class="text-[10px] font-mono ${unlocked ? 'text-indigo-300' : 'text-slate-600'} z-10">${lessonsDone}/${total} dominados</div>
        </div>
      `;

      // The Connector (except for the last node)
      if (mi < LIBROS_DATA.modules.length - 1) {
          const nextUnlocked = (lessonsDone > 0);
          const colorClass = nextUnlocked ? 'text-indigo-500 drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]' : 'text-slate-800';
          html += `
            <div class="flex items-center justify-center text-2xl ${colorClass}">
              <i class="fa-solid fa-angles-down md:hidden"></i>
              <i class="fa-solid fa-angles-right hidden md:block"></i>
            </div>
          `;
      }
    });
    html += '</div>';

    // XP Bar
    const xpNeeded = this.state.level * 100;
    const xpPct = Math.round((this.state.xp % xpNeeded) / xpNeeded * 100);
    const headerHtml = `
      <div class="mb-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-6 shadow-lg relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white border-4 border-cyan-400/50 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-10">
          ${this.state.level}
        </div>
        <div class="flex-1 z-10">
          <div class="flex justify-between text-sm mb-2">
            <span class="font-bold text-white tracking-wide">Nivel ${this.state.level}</span>
            <span class="text-cyan-400 font-mono font-bold">${this.state.xp} XP total</span>
          </div>
          <div class="w-full bg-slate-800/80 rounded-full h-4 p-0.5 border border-slate-700">
            <div class="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all shadow-inner" style="width:${xpPct}%"></div>
          </div>
          <div class="text-xs text-slate-400 mt-2 flex justify-between">
            <span>Próximo nivel a los ${xpNeeded} XP</span>
            <span class="text-indigo-300 font-mono">${this.state.xp % xpNeeded} / ${xpNeeded}</span>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = headerHtml + html;
  },
  // =============================================
  // BUSCADOR UNIVERSAL (CTRL+K)
  // =============================================
  openSearchModal() {
    const m = document.getElementById('searchModal');
    m.classList.remove('hidden'); m.classList.add('flex');
    const inp = document.getElementById('globalSearchInput');
    if (inp) { inp.value = ''; inp.focus(); }
    document.getElementById('searchResultsContainer').innerHTML = '<div class="text-center text-slate-500 text-xs py-8">Escribe para buscar tácticas, conceptos, defensas o términos del glosario.</div>';
  },

  closeSearchModal() {
    const m = document.getElementById('searchModal');
    m.classList.add('hidden'); m.classList.remove('flex');
  },

  toggleSearchModal() {
    const m = document.getElementById('searchModal');
    m.classList.contains('hidden') ? this.openSearchModal() : this.closeSearchModal();
  },

  executeGlobalSearch(query) {
    const container = document.getElementById('searchResultsContainer');
    if (!container || typeof LIBROS_DATA === 'undefined') return;
    if (!query || query.length < 2) {
      container.innerHTML = '<div class="text-center text-slate-500 text-xs py-8">Escribe al menos 2 caracteres...</div>';
      return;
    }

    const q = query.toLowerCase();
    const results = [];

    LIBROS_DATA.modules.forEach(m => {
      m.keyPillars.forEach((p, pi) => {
        if (p.title.toLowerCase().includes(q) || p.concept.toLowerCase().includes(q) || p.tacticalRule.toLowerCase().includes(q)) {
          results.push({ type: 'Lección', icon: 'fa-brain', color: 'text-indigo-400', title: p.title, desc: p.concept.substring(0,80) + '...', action: `App.closeSearchModal(); App.switchTab('learning'); setTimeout(() => App.openLessonModal(${m.bookNumber}, ${pi}), 300);` });
        }
      });
    });

    (LIBROS_DATA.tacticalMatrix || []).forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.howItWorks.toLowerCase().includes(q)) {
        results.push({ type: 'Táctica', icon: 'fa-shield-virus', color: 'text-rose-400', title: t.name, desc: t.howItWorks.substring(0,80) + '...', action: `App.closeSearchModal(); App.switchTab('matrix');` });
      }
    });

    (LIBROS_DATA.glossary || []).forEach(g => {
      if (g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)) {
        results.push({ type: 'Glosario', icon: 'fa-file-invoice', color: 'text-cyan-400', title: g.term, desc: g.definition.substring(0,80) + '...', action: `App.closeSearchModal(); App.switchTab('glossary');` });
      }
    });

    if (results.length === 0) {
      container.innerHTML = `<div class="text-center text-slate-500 text-sm py-8"><i class="fa-solid fa-magnifying-glass block text-3xl mb-2 opacity-30"></i>Sin resultados para "<span class="text-slate-300">${query}</span>"</div>`;
    } else {
      container.innerHTML = results.slice(0, 12).map(r => `
        <div onclick="${r.action}" class="p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 cursor-pointer transition-colors">
          <div class="flex items-center gap-2 mb-1">
            <i class="fa-solid ${r.icon} ${r.color} text-xs"></i>
            <span class="text-[10px] text-slate-500 font-mono uppercase">${r.type}</span>
          </div>
          <div class="text-sm font-bold text-white">${r.title}</div>
          <div class="text-xs text-slate-400 line-clamp-1">${r.desc}</div>
        </div>
      `).join('');
    }
  },

  // =============================================
  // HERRAMIENTAS DE EXPORTACIÓN
  // =============================================
  exportStudySummary() {
    if (typeof LIBROS_DATA === 'undefined') return;
    const unlocked = Object.keys(this.state.progress.unlockedLessons).length - 1;
    let text = `===== RESUMEN DE ESTUDIO — PSICOLOGÍA OSCURA =====\n`;
    text += `Fecha: ${new Date().toLocaleString('es-ES')}\n`;
    text += `Nivel: ${this.state.level} | XP: ${this.state.xp}\n`;
    text += `Lecciones completadas: ${Math.max(0,unlocked)}\n`;
    text += `Puntuación Quiz: ${this.state.quizScore}\n\n`;
    text += `===== MIS NOTAS PERSONALES =====\n`;
    Object.entries(this.state.userNotes || {}).forEach(([key, note]) => {
      if (note.trim()) text += `\n[${key}]: ${note}\n`;
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'Resumen_Estudio_PSO.txt'; a.click();
    this.showToast('📄 Notas exportadas', 'success');
  },

  
  unlockAll() {
    if (typeof LIBROS_DATA === 'undefined') return;
    if (!confirm('¿Activar Modo Dios? Esto desbloqueará TODO el contenido ignorando el progreso lineal.')) return;
    
    LIBROS_DATA.modules.forEach(mod => {
      mod.keyPillars.forEach((_, pIndex) => {
        this.state.progress.unlockedLessons[`m${mod.bookNumber}-${pIndex}`] = true;
      });
      // Unlock the next module 0 index too
      this.state.progress.unlockedLessons[`m${mod.bookNumber+1}-0`] = true;
    });
    this.saveProgress();
    this.showToast('🔓 MODO DIOS ACTIVADO. Todo el contenido está desbloqueado.', 'success');
    
    if(this.state.activeTab === 'learning') {
       this.renderLearningPath();
    }
  },

  resetAllProgress() {
    if (!confirm('¿Estás seguro de que quieres reiniciar TODO el progreso? Esta acción no se puede deshacer.')) return;
    localStorage.removeItem('pso_progress_v4');
    location.reload();
  },

  // =============================================
  // AUDIO ENGINE
  // =============================================
  toggleFocusMode() {
    if (typeof AudioEngine !== 'undefined') {
      const on = AudioEngine.toggleBinauralBeats(200, 10);
      const btn = document.getElementById('btnFocusMode');
      if (btn) {
        btn.innerHTML = on
          ? '<i class="fa-solid fa-stop"></i> Detener Frecuencia Binaural'
          : '<i class="fa-solid fa-headphones"></i> Activar Modo Enfoque (Ondas Alfa 10Hz)';
        btn.className = btn.className.replace(on ? 'bg-indigo-600' : 'bg-rose-600', on ? 'bg-rose-600' : 'bg-indigo-600');
      }
      this.showToast(on ? '🎧 Frecuencia binaural activa (10Hz)' : '🔇 Frecuencia detenida', on ? 'success' : 'info');
    } else {
      this.showToast('⚠️ Audio Engine no disponible', 'error');
    }
  },

  // =============================================
  // SPARRING AI
  // =============================================
  async sendSparringMessage(e) {
    e.preventDefault();
    const input = document.getElementById('sparringInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    const box = document.getElementById('sparringChatBox');

    box.innerHTML += `<div class="flex items-start gap-3 justify-end"><div class="bg-indigo-600 rounded-2xl rounded-tr-none p-3 max-w-[80%] text-sm text-white">${msg}</div></div>`;
    box.scrollTop = box.scrollHeight;
    this.state.sparringHistory.push({ role: 'user', text: msg });

    const typingId = 'typing-' + Date.now();
    box.innerHTML += `<div id="${typingId}" class="flex items-start gap-3"><div class="w-8 h-8 rounded-full bg-rose-950 flex items-center justify-center text-rose-400 border border-rose-800"><i class="fa-solid fa-mask"></i></div><div class="text-slate-500 text-xs mt-2 animate-pulse">Formulando táctica oscura...</div></div>`;
    box.scrollTop = box.scrollHeight;

    try {
      const reply = await AIEngine.sparringChat(msg, this.state.sparringHistory);
      document.getElementById(typingId)?.remove();
      this.state.sparringHistory.push({ role: 'ai', text: reply });
      box.innerHTML += `<div class="flex items-start gap-3"><div class="w-8 h-8 rounded-full bg-rose-950 flex items-center justify-center text-rose-400 border border-rose-800"><i class="fa-solid fa-mask"></i></div><div class="bg-slate-800 rounded-2xl rounded-tl-none p-3 max-w-[80%] text-sm text-slate-200 whitespace-pre-line">${reply}</div></div>`;
      box.scrollTop = box.scrollHeight;
    } catch (err) {
      document.getElementById(typingId).innerHTML = `<span class="text-rose-500 text-xs">Error: ${err.message}</span>`;
    }
  },

  // =============================================
  // AUDITOR FORENSE
  // =============================================
  async runAuditor() {
    const input = document.getElementById('auditorInput').value.trim();
    if (!input) { this.showToast('Pega un texto para analizar', 'error'); return; }
    const area = document.getElementById('auditorResults');
    area.innerHTML = '<div class="text-center py-8"><i class="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-500 mb-3 block"></i><div class="text-slate-400 text-sm">Analizando patrones lingüísticos y sesgos...</div></div>';

    try {
      const result = await AIEngine.analyzeToxicText(input);
      area.innerHTML = `
        <h3 class="text-emerald-400 font-bold mb-4 flex items-center gap-2"><i class="fa-solid fa-microscope"></i> Reporte Forense Completo</h3>
        <div class="space-y-4">
          <div class="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl">
            <div class="text-xs text-rose-400 font-bold font-mono mb-2">🚩 RED FLAGS DETECTADAS</div>
            <ul class="list-disc list-inside text-sm text-slate-200 space-y-1">${result.redFlags.map(f => `<li>${f}</li>`).join('')}</ul>
          </div>
          <div class="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl">
            <div class="text-xs text-amber-400 font-bold font-mono mb-2">⚔️ TÁCTICAS USADAS</div>
            <div class="flex flex-wrap gap-2">${result.tacticsDetected.map(t => `<span class="px-2.5 py-1 bg-amber-950/30 text-amber-300 border border-amber-800/50 rounded-lg text-xs font-mono">${t}</span>`).join('')}</div>
          </div>
          <div class="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl">
            <div class="text-xs text-indigo-400 font-bold font-mono mb-2">🔬 ANÁLISIS PROFUNDO</div>
            <p class="text-sm text-slate-200 leading-relaxed">${result.analysis}</p>
          </div>
          <div class="p-4 bg-emerald-950/20 border-l-4 border-emerald-500">
            <div class="text-xs text-emerald-400 font-bold font-mono mb-2">🛡️ CONTRAATAQUE RECOMENDADO</div>
            <p class="text-sm text-emerald-100 font-mono leading-relaxed italic">"${result.counterScript}"</p>
          </div>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<div class="p-4 bg-rose-950/20 border border-rose-500 rounded-xl text-rose-300 text-sm">${err.message.includes('API Key') ? '⚠️ Configura tu API Key de Gemini primero en el botón "Configurar IA" del Sparring.' : 'Error de análisis: ' + err.message}</div>`;
    }
  },

  // =============================================
  // BIOMETRÍA / CÁMARA
  // =============================================
  async toggleCamera() {
    if (typeof CVEngine === 'undefined') return;
    const btn = document.getElementById('btnToggleCam');
    const overlay = document.getElementById('camOverlayText');
    if (CVEngine.isTracking) {
      CVEngine.stopCamera();
      btn.innerHTML = '<i class="fa-solid fa-video"></i> Iniciar Escáner';
      if (overlay) overlay.style.display = 'block';
    } else {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
      const ok = await CVEngine.startCamera();
      btn.innerHTML = ok ? '<i class="fa-solid fa-video-slash"></i> Apagar Escáner' : '<i class="fa-solid fa-video"></i> Error — Reintentar';
      if (overlay) overlay.style.display = ok ? 'none' : 'block';
    }
  },

  // =============================================
  // API KEY MODAL
  // =============================================
  saveApiKey() {
    const k = document.getElementById('apiKeyInput').value.trim();
    if (!k || k.includes('•')) { this.showToast('Pega una API Key válida', 'error'); return; }
    if (typeof AIEngine !== 'undefined') AIEngine.setKey(k);
    document.getElementById('aiSettingsModal').classList.add('hidden');
    this.showToast('🔑 API Key guardada. IA activa.', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => { App.init(); });