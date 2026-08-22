with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('// Append Extended Reading Chapters')
end = text.find('contentHtml += chaptersHtml;', idx)

print("=== CURRENT ACCORDION CODE IN APP.JS ===")
print(text[idx:end+40])
