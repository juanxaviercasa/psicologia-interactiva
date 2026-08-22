import re
with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

for m in re.finditer(r"switchTab\([^)]+\)", content):
    start = max(0, m.start() - 60)
    end = min(len(content), m.end() + 20)
    print(content[start:end])
