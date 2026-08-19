with open('js/data_libros.js', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

with open('js/app.js', 'r', encoding='utf-8', errors='replace') as f:
    app = f.read()

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    html = f.read()

with open('css/styles.css', 'r', encoding='utf-8', errors='replace') as f:
    css = f.read()

checks = {
    'Modules (bookNumber)': content.count('bookNumber:'),
    'Key Pillars': content.count('tacticalRule:'),
    'Flashcards': content.count("front:"),
    'Quizzes': content.count('correctIndex:'),
    'Case Scenarios': content.count('scenarioDescription:'),
    'Matrix cards': content.count('counterScript:'),
    'BodyLab entries': content.count('practicalDrill:'),
    'Glossary terms': content.count('definition:'),
    'Mermaid diagrams': content.count('diagram:'),
    'Interactive challenges': content.count('interactiveChallenge:'),
    'Deep dives': content.count('deepDive:'),
}

print("=== DATA INVENTORY ===")
for k, v in checks.items():
    print(f"  {k}: {v}")

print()
print("=== APP.JS CHECKS ===")
import re
functions_in_html = set(re.findall(r'App\.(\w+)\(', html))
functions_in_app = set(re.findall(r'  (\w+)\(', app))
missing = functions_in_html - functions_in_app
print(f"  Functions in HTML: {len(functions_in_html)}")
print(f"  Functions in app.js: {len(functions_in_app)}")
print(f"  Missing functions: {sorted(missing)}")

print()
print("=== HTML CHECKS ===")
views_in_html = re.findall(r'id="view-(\w+)"', html)
views_in_app = re.findall(r"'(\w+)'", re.search(r"const views = \[.*?\]", app, re.DOTALL).group() if re.search(r"const views = \[.*?\]", app, re.DOTALL) else "")
print(f"  Views in HTML: {views_in_html}")
print(f"  Views in app.js: {views_in_app}")
missing_views = set(views_in_app) - set(views_in_html)
extra_views = set(views_in_html) - set(views_in_app)
print(f"  In app.js but not HTML: {missing_views}")
print(f"  In HTML but not app.js: {extra_views}")

print()
print("=== CSS CHECKS ===")
print(f"  Has flip card styles: {'flip-card-container' in css}")
print(f"  Has glass-card: {'.glass-card' in css}")
print(f"  Has nav-tab active: {'.nav-tab.active' in css}")

print()
print("=== CONTENT GAPS ===")
modules = content.count('bookNumber:')
pillars = content.count('tacticalRule:')
flashcards = content.count('front:')
scenarios = content.count('scenarioDescription:')
matrix = content.count('counterScript:')
bodylab = content.count('practicalDrill:')
glossary = content.count('definition:')
diagrams = content.count('diagram:')
challenges = content.count('interactiveChallenge:')

avg_pillars_per_module = round(pillars / modules, 1) if modules else 0
pct_with_diagrams = round((diagrams / pillars) * 100) if pillars else 0
pct_with_challenges = round((challenges / pillars) * 100) if pillars else 0

print(f"  Avg pillars/module: {avg_pillars_per_module} (target: 5-6)")
print(f"  Pillars with diagrams: {diagrams}/{pillars} ({pct_with_diagrams}%) (target: 100%)")
print(f"  Pillars with challenges: {challenges}/{pillars} ({pct_with_challenges}%) (target: 100%)")
print(f"  Flashcards: {flashcards} (target: 30+)")
print(f"  Scenarios: {scenarios} (target: 12+, UI says 8)")
print(f"  Matrix cards: {matrix} (target: 20, UI says 20)")
print(f"  BodyLab entries: {bodylab} (target: 15+)")
print(f"  Glossary terms: {glossary} (target: 50+)")
