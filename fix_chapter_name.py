import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

def replacer(match):
    return """const titlesMap = (typeof CHAPTER_TITLES !== 'undefined' ? CHAPTER_TITLES : null) || (typeof window !== 'undefined' ? window.CHAPTER_TITLES : null) || {};
         const safeChapterName = chapterName || '';
         const cleanTitle = titlesMap[safeChapterName] || safeChapterName.replace(/_/g, ' ').replace(/^Tema\\s*\\d+\\s*/i, '').trim();"""

pattern = r"const titlesMap = [\s\S]*?cleanTitle = titlesMap\[chapterName\] \|\| chapterName\.replace[\s\S]*?trim\(\);"

new_text = re.sub(pattern, replacer, text)
with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Updated app.js with safe chapterName")
