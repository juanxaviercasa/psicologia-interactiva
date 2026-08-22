import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

matches = list(re.finditer(r'<button onclick="App\.unlockAll\(\)"', content))
if matches:
    idx = matches[0].start()
    btn = '''
        <button onclick="document.getElementById('methodologyModal').classList.remove('hidden')" class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-all text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <i class="fa-solid fa-microscope"></i> Bases Científicas
        </button>
    '''
    if 'Bases Científicas' not in content[:idx]:
        content = content[:idx] + btn + content[idx:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Injected button successfully')
