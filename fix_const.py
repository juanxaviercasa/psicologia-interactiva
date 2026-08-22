import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = "const contentHtml = `"
replacement = "let contentHtml = `"

if target in content:
    content = content.replace(target, replacement)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced const with let for contentHtml.")
else:
    print("const contentHtml not found.")
