with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ─── QUIZ IMAGE INJECTION ───
old_quiz_q = (
    '<h4 class="text-base font-bold text-white mb-4 flex items-start gap-2">\n'
    "          <span class=\"text-cyan-500 font-mono shrink-0\">Q${String(i+1).padStart(2,'0')}</span>\n"
    '          ${q.question}\n'
    '        </h4>'
)
new_quiz_q = (
    '<!-- Quiz Scenario Image -->\n'
    '        <div class="relative w-full rounded-xl overflow-hidden mb-4 border border-slate-700 bg-slate-950 group" style="padding-top:50%;">\n'
    '          <img src="assets/img/quiz_${q.id}.jpg"\n'
    '               alt="Escenario ${q.question.substring(0,40)}"\n'
    '               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"\n'
    '               onerror="this.parentElement.style.display=\'none\'">\n'
    '          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>\n'
    '        </div>\n'
    '        <h4 class="text-base font-bold text-white mb-4 flex items-start gap-2">\n'
    "          <span class=\"text-cyan-500 font-mono shrink-0\">Q${String(i+1).padStart(2,'0')}</span>\n"
    '          ${q.question}\n'
    '        </h4>'
)

if old_quiz_q in content:
    content = content.replace(old_quiz_q, new_quiz_q)
    print('Quiz images: OK')
else:
    print('Quiz pattern not found')

# ─── SIMULATOR IMAGE INJECTION ───
sim_idx = content.find('scenario')
print(f'Sim scenario at: {sim_idx}')
print(content[sim_idx-300:sim_idx+200])

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Step 4 partial done.')
