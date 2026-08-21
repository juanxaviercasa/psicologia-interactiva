import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix: correct IDs for the 3 missing sections
missing_banners = [
    ('view-bodylab',  'banner_noverbal',   'No Verbal'),
    ('view-quizzes',  'banner_quizzes',    'Quizzes Tacticos'),
    ('view-biometrics', 'banner_pdf',      'Auditoria Biometrica'),
]

for section_id, img_name, label in missing_banners:
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
        print(f'  {section_id}: OK')
    else:
        print(f'  {section_id}: NOT FOUND')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done: Remaining banners fixed.')
