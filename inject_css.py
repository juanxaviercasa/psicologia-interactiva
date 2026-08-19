with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

css_patch = '''
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 8px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 70, 229, 0.4); border-radius: 8px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(79, 70, 229, 0.8); }
'''

if 'custom-scrollbar' not in content[:content.find('</style>')]:
    content = content.replace('</style>', css_patch + '</style>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("CSS injected")
