import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '<button id="btnFocusMode"'
sandbox_btn = '''
        <!-- MODO DIOS -->
        <button onclick="App.unlockAll()" class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30 transition-all text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <i class="fa-solid fa-unlock-keyhole"></i> Modo Dios
        </button>
'''

if 'Modo Dios' not in html:
    html = html.replace(target, sandbox_btn + '\n        ' + target)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added Modo Dios button to index.html")

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

unlock_fn = '''
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
'''

if 'unlockAll()' not in app_js:
    target_js = 'resetAllProgress() {'
    app_js = app_js.replace(target_js, unlock_fn + '\n  ' + target_js)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(app_js)
    print("Added unlockAll() to app.js")
