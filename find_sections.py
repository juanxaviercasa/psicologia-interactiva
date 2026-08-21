import re

# Find actual IDs for noverbal, quiz, pdf sections
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the section IDs that exist
import re
found_ids = re.findall(r'id="(view-[^"]+)"', html)
print('Found section IDs:', found_ids)
