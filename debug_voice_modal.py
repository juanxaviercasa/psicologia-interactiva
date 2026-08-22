with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('voiceSettingsModal')
print("voiceSettingsModal in index.html:", idx != -1)
if idx != -1:
    print(html[idx-50:idx+500])

with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx_js = js.find('openVoiceSettingsModal')
print("\nopenVoiceSettingsModal in app.js:", idx_js != -1)
if idx_js != -1:
    print(js[idx_js:idx_js+1000])
