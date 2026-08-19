import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"const icon = isAggressor \? '<i class=\"fa-solid fa-user-ninja text-lg\"></i>' : '<i class=\"fa-solid fa-user-shield text-lg\"></i>';"
repl = """const icon = isAggressor 
    ? '<img src="assets/img/avatar_manipulator.jpg" class="w-8 h-8 rounded-full border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)] object-cover preserve-color">' 
    : '<img src="assets/img/avatar_victim.jpg" class="w-8 h-8 rounded-full border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] object-cover preserve-color">';"""

content = re.sub(pattern, repl, content)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Avatars injected into app.js')
