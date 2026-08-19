import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix module covers in renderDashboard
pattern = r'(<div class="h-48 rounded-xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between cursor-pointer hover:border-cyan-500/50 hover:shadow-\[0_0_20px_rgba\(6,182,212,0\.15\)\] transition-all)"(.*?>)'
repl = r'\1 relative overflow-hidden group"\2\n          <img src="assets/img/cover_mod${mod.id}.jpg" class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 preserve-color mix-blend-screen">\n          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/20 z-0"></div>\n          <div class="relative z-10 h-full flex flex-col justify-between">'

# Replace all occurrences (renderDashboard has it)
content = re.sub(pattern, repl, content)

# But we must close the new relative z-10 div at the end of the card.
# The card ends with:
# <span class="text-xs font-bold text-cyan-400">${progressPct}%</span>
# </div>
# </div>
# `
end_pattern = r'(<span class="text-xs font-bold text-cyan-400">\$\{progressPct\}%</span>\s*</div>)'
end_repl = r'\1\n          </div>'
content = re.sub(end_pattern, end_repl, content)


with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Injected module covers into app.js renderDashboard')
