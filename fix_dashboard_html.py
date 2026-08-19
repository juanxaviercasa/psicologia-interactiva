import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the entire renderDashboard() function to ensure perfect HTML closure.
new_func = '''renderDashboard() {
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
  },'''

# Locate and replace
start_idx = content.find('renderDashboard() {')
# find the next function which is renderLearningPath() {
end_idx = content.find('renderLearningPath() {')

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_func + '\n\n  ' + content[end_idx:]
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed renderDashboard")
else:
    print("Could not find boundaries")
