import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

imgs = re.findall(r'assets/img/[^\s"\'`<>]+', content)
print('Images found in app.js:')
for i in imgs:
    print(' -', i)

# Also show first 100 chars around each
for img in set(imgs):
    idx = content.find(img)
    print(f'\n--- {img} ---')
    print(content[max(0,idx-50):idx+100])
