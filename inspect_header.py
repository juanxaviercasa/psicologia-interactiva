with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the Racha/Enfoque/Nivel pills header area
idx = html.find('RACHA')
print(html[idx-50:idx+600])
print('\n\n---\n\n')
# Also search for avatar/profile button area
idx2 = html.find('Dominio')
print(html[idx2-200:idx2+300])
