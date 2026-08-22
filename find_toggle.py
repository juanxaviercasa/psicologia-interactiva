with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('toggleAudioNarration(')
print("toggleAudioNarration found at:", idx)
if idx != -1:
    print(js[idx-100:idx+300])
