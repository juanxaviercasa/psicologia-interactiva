import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''      <div class="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col" onclick="App.switchTab('learning')">
        <div class="flex items-start justify-between mb-4">'''

repl = '''      <div class="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col relative overflow-hidden" onclick="App.switchTab('learning')">
        <img src="assets/img/cover_mod${m.id}.jpg" onerror="this.style.display='none'" class="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500 z-0">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 z-0"></div>
        <div class="relative z-10 flex flex-col h-full">
        <div class="flex items-start justify-between mb-4">'''

content = content.replace(target, repl)

target2 = '''<div class="text-right">
            <span class="text-xs font-bold text-cyan-400">${modPct}%</span>
          </div>
        </div>
      </div>
      `;'''

repl2 = '''<div class="text-right">
            <span class="text-xs font-bold text-cyan-400">${modPct}%</span>
          </div>
        </div>
        </div>
      </div>
      `;'''

content = content.replace(target2, repl2)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Injected dashboard covers')
