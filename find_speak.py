import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'speakText', text):
    start = max(0, m.start() - 100)
    end = min(len(text), m.start() + 200)
    print("app.js match:", text[start:end])
    print("---")

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for m in re.finditer(r'speak', html, re.IGNORECASE):
    start = max(0, m.start() - 100)
    end = min(len(html), m.start() + 200)
    print("index.html match:", html[start:end])
    print("---")
