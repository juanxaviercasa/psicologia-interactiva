import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find btnFocusMode
idx = html.find('btnFocusMode')
print(html[idx-300:idx+600])
