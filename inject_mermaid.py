import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject Mermaid.js
mermaid_script = '''
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      mermaid.initialize({ startOnLoad: false, theme: 'dark', fontFamily: 'monospace' });
    });
  </script>
'''
if 'mermaid.min.js' not in content:
    content = content.replace('</head>', mermaid_script + '</head>')

# 2. Fix the scrollbar track so it doesn't show an empty bar
# I will make the track transparent so it only shows the thumb, avoiding the "useless empty bar" look.
content = content.replace('background: rgba(15, 23, 42, 0.5);', 'background: transparent;')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Mermaid injected and Scrollbar fixed.")
