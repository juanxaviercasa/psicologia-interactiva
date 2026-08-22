with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('openLessonModal(modNumber, pIndex)')
idx_end = text.find('closeLessonModal()', idx)

print("=== CURRENT OPENLESSONMODAL ===")
print(text[idx:idx_end])
