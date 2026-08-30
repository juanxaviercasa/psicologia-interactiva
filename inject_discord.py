import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_btn = "<!-- Pomodoro Launch Button -->"
new_btn = """<!-- Comunidad / Discord Button -->
          <a href="https://discord.gg/placeholder" target="_blank" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 hover:bg-indigo-900/60 hover:border-indigo-400 text-indigo-300 hover:text-white transition-all text-[11px] uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(99,102,241,0.1)] group" title="Unirse al Cuartel General (Discord)">
            <i class="fa-brands fa-discord text-indigo-400 group-hover:scale-110 transition-transform"></i>
            <span class="hidden sm:inline">Comunidad</span>
          </a>

          <!-- Pomodoro Launch Button -->"""

text = text.replace(old_btn, new_btn)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Discord button injected")
