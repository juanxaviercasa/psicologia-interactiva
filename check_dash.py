with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
start = content.find('id="view-dashboard"')
print(content[start:start+1500])
