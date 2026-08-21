with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ─── SIMULATOR IMAGE INJECTION ───
# Inject above: <h3 class="text-xl font-bold text-white mb-4">${caseData.title}</h3>
old_sim = '<h3 class="text-xl font-bold text-white mb-4">${caseData.title}</h3>'
new_sim = (
    '<!-- Simulator Scenario Image -->\n'
    '        <div class="relative w-full rounded-xl overflow-hidden mb-4 border border-slate-700 bg-slate-950 group" style="padding-top:56.25%;">\n'
    '          <img src="assets/img/sim_case_${caseData.id.replace(\'c\',\'\')}.jpg"\n'
    '               alt="${caseData.title}"\n'
    '               class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"\n'
    '               onerror="this.parentElement.style.display=\'none\'">\n'
    '          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>\n'
    '          <div class="absolute bottom-3 left-4">\n'
    '            <span class="text-xs font-mono text-amber-400 font-bold tracking-widest uppercase"><i class="fa-solid fa-film mr-1"></i> Caso en Vivo</span>\n'
    '          </div>\n'
    '        </div>\n'
    '        <h3 class="text-xl font-bold text-white mb-4">${caseData.title}</h3>'
)

if old_sim in content:
    content = content.replace(old_sim, new_sim)
    print('Sim images: OK')
else:
    print('Sim pattern not found — checking exact caseData.title usage...')
    idx = content.find('caseData.title')
    print(content[idx-100:idx+100])

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Step 4 complete.')
