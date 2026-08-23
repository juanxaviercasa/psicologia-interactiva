import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

timer_methods = '''
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
    if (this.quizState && this.quizState.timerInterval) {
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
      actionBtn.innerHTML = isLast ? '<span>Ver Calificación y Medallas</span> <i class="fa-solid fa-trophy"></i>' : '<span>Siguiente Nivel</span> <i class="fa-solid fa-arrow-right"></i>';
      actionBtn.className = 'px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer';
      actionBtn.disabled = false;
      actionBtn.onclick = () => {
        state.currentStep++;
        this.renderQuizStep();
      };
    }
  },
'''

if 'startQuizTimer() {' not in text:
    # Inyectar justo antes de renderQuizStep
    idx = text.find('  renderQuizStep() {')
    if idx != -1:
        text = text[:idx] + timer_methods + '\n' + text[idx:]
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(text)
        print("Restored deleted timer methods successfully!")
else:
    print("Methods already exist!")
