with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update close button onclick
old_close = 'onclick="document.getElementById(\'voiceSettingsModal\').classList.add(\'hidden\')"'
new_close = 'onclick="App.closeVoiceSettingsModal()"'

if old_close in html:
    html = html.replace(old_close, new_close)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated voice modal close button.")
