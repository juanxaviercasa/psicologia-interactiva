with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Also fix the dashboard module card thumbnail to not distort
# It uses h-40 fixed height — change to aspect-video container
old_card_img = '''        <!-- IMAGE THUMBNAIL - PROMINENT & VISIBLE -->
        <div class="relative w-full h-40 overflow-hidden bg-slate-900">
          <img src="assets/img/cover_mod${m.bookNumber}.jpg"
               alt="${m.title}"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               onerror="this.parentElement.classList.add('flex','items-center','justify-center'); this.style.display='none'">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <span class="absolute top-2 right-2 text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur px-2 py-0.5 rounded border border-slate-700">${m.badge}</span>
        </div>'''

new_card_img = '''        <!-- IMAGE THUMBNAIL - PROMINENT & VISIBLE — 16:9 ratio, no distortion -->
        <div class="relative w-full bg-slate-900 overflow-hidden" style="padding-top: 56.25%;">
          <img src="assets/img/cover_mod${m.bookNumber}.jpg"
               alt="${m.title}"
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               onerror="this.style.display='none'">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
          <span class="absolute top-2 right-2 text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur px-2 py-0.5 rounded border border-slate-700">${m.badge}</span>
        </div>'''

if old_card_img in content:
    content = content.replace(old_card_img, new_card_img)
    print('Dashboard card images fixed: 16:9 aspect ratio, no distortion')
else:
    print('Dashboard card pattern not found')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
