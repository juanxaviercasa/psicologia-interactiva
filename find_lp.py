import re
with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('renderLearningPath')
end = content.find('renderDefenseMatrix')
print(content[idx:idx+500])
