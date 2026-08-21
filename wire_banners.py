import re

# ─────────────────────────────────────────────
# 1. SECTION BANNERS in index.html
# ─────────────────────────────────────────────
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

section_banners = [
    ('view-learning',   'banner_academia',   'Academia de Dominio'),
    ('view-matrix',     'banner_matriz',     'Matriz de Defensa'),
    ('view-simulator',  'banner_simulador',  'Simulador de Casos'),
    ('view-laboratory', 'banner_laboratorio','Laboratorio Tactico'),
    ('view-flashcards', 'banner_flashcards', 'Flashcards'),
    ('view-noverbal',   'banner_noverbal',   'No Verbal'),
    ('view-quiz',       'banner_quizzes',    'Quizzes Tacticos'),
    ('view-pdf',        'banner_pdf',        'Biblioteca PDF'),
]

for section_id, img_name, label in section_banners:
    pattern = r'(id="' + section_id + r'"[^>]*>)'
    banner_html = (
        r'\1' +
        '\n      <!-- Section Banner -->'
        '\n      <div class="relative w-full rounded-2xl overflow-hidden mb-6 shadow-xl" style="padding-top:22%;">'
        f'\n        <img src="assets/img/{img_name}.jpg" alt="{label}" class="absolute inset-0 w-full h-full object-cover">'
        '\n        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent"></div>'
        f'\n        <div class="absolute bottom-4 left-6"><span class="text-white font-extrabold text-xl md:text-2xl drop-shadow-lg">{label}</span></div>'
        '\n      </div>'
    )
    new_html, n = re.subn(pattern, banner_html, html)
    if n:
        html = new_html
        print(f'  Banners: {section_id} OK')
    else:
        print(f'  Banners: {section_id} NOT FOUND')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done: Section banners.')
