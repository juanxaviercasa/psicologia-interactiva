import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

toggle_logic = """
  toggleTheme() {
      const html = document.documentElement;
      const icon = document.getElementById('themeIcon');
      if (html.classList.contains('light-theme')) {
          html.classList.remove('light-theme');
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
          localStorage.setItem('pso_theme', 'dark');
      } else {
          html.classList.add('light-theme');
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
          localStorage.setItem('pso_theme', 'light');
      }
  },

  init() {"""

content = content.replace('  init() {', toggle_logic)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('toggleTheme injected into app.js')
