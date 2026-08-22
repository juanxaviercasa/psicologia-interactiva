import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add ID to learning path modules
target1 = '<div class="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl shadow-xl">'
replacement1 = '<div id="module-${mod.bookNumber}" class="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl shadow-xl scroll-mt-24">'
if target1 in content:
    content = content.replace(target1, replacement1)
    print("Added IDs to modules in learning path.")

# 2. Add goToModule function
target2 = 'switchTab(tabId) {'
replacement2 = '''goToModule(modNumber) {
    this.switchTab('learning');
    setTimeout(() => {
      const el = document.getElementById(`module-${modNumber}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  },

  switchTab(tabId) {'''
if "goToModule(" not in content:
    content = content.replace(target2, replacement2)
    print("Added goToModule function.")

# 3. Update dashboard card onclick
target3 = 'onclick="App.switchTab(\'learning\')"'
replacement3 = 'onclick="App.goToModule(${m.bookNumber})"'
if target3 in content:
    # Only replace it in renderDashboard!
    idx = content.find('renderDashboard() {')
    end = content.find('renderLearningPath', idx)
    dash = content[idx:end]
    dash_new = dash.replace(target3, replacement3)
    content = content[:idx] + dash_new + content[end:]
    print("Updated dashboard onclick handlers.")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixes applied successfully.")
