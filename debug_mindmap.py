with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# More lenient search
idx = content.find('MAPA MENTAL')
print(f'MAPA MENTAL at: {idx}')
idx2 = content.find('pillar.diagram')
print(f'pillar.diagram at: {idx2}')
if idx2 != -1:
    print(content[idx2-100:idx2+50])
