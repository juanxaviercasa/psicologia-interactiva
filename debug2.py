with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The MAPA MENTAL comment uses different encoding in file — find exact bytes
idx = content.find('MAPA MENTAL')
print(repr(content[idx-20:idx+30]))
