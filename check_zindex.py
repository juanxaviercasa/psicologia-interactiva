with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for modal_id in ['lessonModal', 'voiceSettingsModal', 'methodologyModal']:
    idx = html.find(f'id="{modal_id}"')
    if idx != -1:
        print(f"Modal {modal_id}:", html[idx-20:idx+120])
