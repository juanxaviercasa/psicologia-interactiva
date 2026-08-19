with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

for view in ['view-auditor', 'view-biometrics']:
    start = content.find(f'id="{view}"')
    end = content.find('</section>', start)
    print(f"--- {view} ---")
    print(content[start:end+10])
