with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('let contentHtml = `')
end = text.find('// Append Extended Reading Chapters', idx)

print(text[idx:end])
