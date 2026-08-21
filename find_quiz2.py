with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ─── QUIZ IMAGE INJECTION ───
# Found at idx 49200 near: q.question} </h4>
# We inject a 16:9 image ABOVE the question text
quiz_idx = content.find('q.question}\n        </h4>')
if quiz_idx == -1:
    quiz_idx = content.find('q.question}')
print(f'Quiz question found at: {quiz_idx}')
print(content[quiz_idx-200:quiz_idx+100])
