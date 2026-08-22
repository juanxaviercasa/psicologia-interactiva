with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
matches = [m.start() for m in re.finditer(r'openVoiceSettingsModal', js)]
print(f"Total occurrences of 'openVoiceSettingsModal' in app.js: {len(matches)}")
for idx in matches:
    print("Match context:", js[idx-20:idx+60])
    print("---")
