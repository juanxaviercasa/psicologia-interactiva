import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'(<div class="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">)'
repl = r'\1\n        <img src="assets/img/hero_banner_brain.jpg" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen hover:opacity-30 transition-opacity duration-1000 preserve-color z-0">\n        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent z-0"></div>'

content = re.sub(pattern, repl, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Injected hero banner into index.html')
