with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('<header')
end = content.find('</header>')

with open('header_dump.html', 'w', encoding='utf-8') as out:
    out.write(content[idx:end+10])

print("Header written to header_dump.html. Length:", len(content[idx:end+10]))
