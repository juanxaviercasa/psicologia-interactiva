import re

# Fix 1: Hero Banner in index.html — increase opacity from 20% to 60%
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace(
    'src="assets/img/hero_banner_brain.jpg" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen hover:opacity-30 transition-opacity duration-1000 preserve-color z-0"',
    'src="assets/img/hero_banner_brain.jpg" class="absolute inset-0 w-full h-full object-cover opacity-50 hover:opacity-65 transition-opacity duration-1000 preserve-color z-0"'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Hero banner opacity fixed')

# Fix 2: Lesson images - make them taller and fully visible (no mix-blend-lighten)
with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the lesson image to be more visible - remove mix-blend-lighten so image shows properly
content = content.replace(
    'class="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105 preserve-color"',
    'class="w-full h-52 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"'
)

# Fix avatar images - make them bigger so they're clearly visible
content = content.replace(
    'class="w-8 h-8 rounded-full border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)] object-cover preserve-color"',
    'class="w-12 h-12 rounded-full border-2 border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.5)] object-cover shrink-0"'
)
content = content.replace(
    'class="w-8 h-8 rounded-full border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] object-cover preserve-color"',
    'class="w-12 h-12 rounded-full border-2 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.5)] object-cover shrink-0"'
)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Lesson images and avatars improved')
