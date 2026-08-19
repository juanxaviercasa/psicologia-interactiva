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

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.9;
      window.speechSynthesis.speak(u);
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
      <div class="glass-card rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col relative overflow-hidden" onclick="App.switchTab('learning')">
        <img src="assets/img/cover_mod${m.bookNumber}.jpg" onerror="this.style.display='none'" class="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500 z-0">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 z-0"></div>
        <div class="relative z-10 flex flex-col h-full p-5">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform border border-slate-700">
                <i class="fa-solid ${m.icon} text-xl"></i>
              </div>
              <span class="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">${m.badge}</span>
            </div>
            <h3 class="text-white font-bold mb-1">${m.title}</h3>
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
        <div class="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl shadow-xl">
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
    ? '<img src="assets/img/avatar_manipulator.jpg" class="w-8 h-8 rounded-full border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)] object-cover preserve-color">' 
    : '<img src="assets/img/avatar_victim.jpg" class="w-8 h-8 rounded-full border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] object-cover preserve-color">';
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

    const contentHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- HEADER VISUAL ARCHITECTURE -->
        <div class="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-6 flex items-center gap-6 shadow-2xl">
            <div class="absolute -right-10 -bottom-10 text-slate-700/30 text-[180px] pointer-events-none">
                ${modIcon}
            </div>
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 text-4xl text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)] relative z-10 shrink-0">
                ${modIcon}
            </div>
            <div class="relative z-10">
                <div class="text-xs text-indigo-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                   <i class="fa-solid fa-layer-group"></i> Fase ${modNumber} • Pilar ${pIndex + 1}
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-white leading-tight">${pillar.title}</h2>
            </div>
        </div>


        <!-- 1. LA RAÍZ (CONCEPTO) -->
        <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 lg:col-span-2 shadow-inner">
          <div class="text-[11px] text-amber-500 font-bold font-mono tracking-widest mb-4 flex justify-between items-center">
            <span><i class="fa-solid fa-seedling"></i> 1. LA RAÍZ (EL POR QUÉ FUNCIONA)</span>
            <button onclick="App.speakText('${conceptText.replace(/'/g,"&apos;").replace(/"/g,"&quot;")}')" class="text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg text-xs transition-colors">
              <i class="fa-solid fa-volume-high"></i> Escuchar
            </button>
          </div>
          <!-- INFOGRAFIA EDUCATIVA (Encyclopedia Style) -->
          <div class="lesson-img-container w-full mb-6 mt-4 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group bg-slate-950" id="lesson-img-m${modNumber}-p${pIndex+1}">
              <img src="assets/img/lesson_m${modNumber}_p${pIndex+1}.jpg" 
                   alt="Ilustración de ${pillar.title}" 
                   class="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105 preserve-color"
                   onerror="this.parentElement.querySelector('.img-placeholder').style.display='flex'; this.style.display='none'">
              <div class="img-placeholder hidden w-full h-48 md:h-64 flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 to-indigo-950 border-0">
                  <i class="fa-solid ${modIcon} text-5xl text-indigo-400/60"></i>
                  <span class="text-xs text-slate-500 font-mono text-center px-4">Ilustración educativa en preparación</span>
                  <span class="text-[10px] text-slate-600 font-mono text-center px-8">${pillar.title}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-4">
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

        <!-- 5. MAPA MENTAL -->
        ${pillar.diagram ? `
        <div class="p-6 rounded-2xl bg-slate-900 border border-cyan-500/20 lg:col-span-2 overflow-x-auto">
          <div class="text-[11px] text-cyan-400 font-bold font-mono tracking-widest mb-4"><i class="fa-solid fa-sitemap"></i> 5. ARQUITECTURA VISUAL (MAPA MENTAL)</div>
          <div class="mermaid text-sm flex justify-center">${pillar.diagram}</div>
        </div>` : ''}

        <!-- 6. DESAFÍO INTERACTIVO -->
        ${pillar.interactiveChallenge ? `
        <div class="p-6 rounded-2xl bg-amber-950/10 border border-amber-500/30 lg:col-span-2">
          <div class="text-[11px] text-amber-500 font-bold font-mono tracking-widest mb-4"><i class="fa-solid fa-bolt"></i> 6. PRUEBA DE ASIMILACIÓN TÁCTICA</div>
          <p class="text-slate-200 font-medium mb-5 text-base">${pillar.interactiveChallenge.question}</p>
          <div class="space-y-3">
            ${pillar.interactiveChallenge.options.map((opt, i) => `
              <button onclick="App.checkLessonChallenge(${modNumber}, ${pIndex}, ${i})" id="challenge-opt-${i}" class="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all text-sm text-slate-300 shadow-sm">
                <span class="font-bold text-amber-400 mr-3 text-lg">${['A','B','C','D'][i]}.</span><span class="leading-relaxed">${opt}</span>
              </button>
            `).join('')}
          </div>
          <div id="challengeFeedback" class="mt-5 hidden p-4 rounded-xl text-sm font-bold border"></div>
        </div>` : ''}

        <!-- 7. NOTAS PERSONALES & SPAR AI -->
        <div class="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 lg:col-span-2">
          <div class="text-[11px] text-slate-400 font-bold font-mono tracking-widest mb-3"><i class="fa-solid fa-pen"></i> 7. MIS NOTAS E INSIGHTS PERSONALES</div>
          <textarea id="lessonNotes" placeholder="Escribe tus conexiones, epifanías o cómo aplicarías esto mañana mismo..." class="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-32">${notes}</textarea>
          <button onclick="App.saveLessonNotes(${modNumber}, ${pIndex})" class="mt-3 px-5 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white rounded-lg transition-colors shadow-sm"><i class="fa-solid fa-save"></i> Guardar Notas</button>
          
          ${socraticBtnHtml}
        </div>

      </div>
    `;

    document.getElementById('lessonModalContent').innerHTML = contentHtml;

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