with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Redesign the module cards so the image is VISIBLE as a top thumbnail, not a faint background
old_card = '''      <div class="glass-card rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col relative overflow-hidden" onclick="App.switchTab('learning')">
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
      </div>'''

new_card = '''      <div class="glass-card rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col overflow-hidden" onclick="App.switchTab('learning')">
        <!-- IMAGE THUMBNAIL - PROMINENT & VISIBLE -->
        <div class="relative w-full h-40 overflow-hidden bg-slate-900">
          <img src="assets/img/cover_mod${m.bookNumber}.jpg"
               alt="${m.title}"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               onerror="this.parentElement.classList.add('flex','items-center','justify-center'); this.style.display='none'">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
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
      </div>'''

content = content.replace(old_card, new_card)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Redesigned module cards - images now PROMINENT at top')
