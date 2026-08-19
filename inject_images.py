import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Hotspot Image
content = content.replace('https://picsum.photos/seed/psychology1/600/400', 'assets/img/hotspot_interrogation.jpg')

# 2. Hero Banner
hero_pattern = r'(<div class="glass-card p-8 md:p-12 rounded-3xl border border-slate-800 relative overflow-hidden group">)'
hero_repl = r'\1\n      <img src="assets/img/hero_banner_brain.jpg" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-1000 preserve-color">'
content = re.sub(hero_pattern, hero_repl, content)

# 3. Module Covers
# We need to find the 6 module cards. They look like:
# <div class="h-48 rounded-xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between cursor-pointer hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all group relative overflow-hidden" onclick="App.openModuleModal(1)">
# Wait, let's just find `onclick="App.openModuleModal(X)"` and inject the img tag inside that div.

for i in range(1, 7):
    card_pattern = rf'(onclick="App\.openModuleModal\({i}\)".*?>)'
    # Since the div opens and then has children, we'll insert right after the closing bracket of the div
    card_repl = rf'\1\n          <img src="assets/img/cover_mod{i}.jpg" class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-60 transition-opacity duration-500 preserve-color mix-blend-screen">\n          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>'
    content = re.sub(card_pattern, card_repl, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Images injected into index.html")
