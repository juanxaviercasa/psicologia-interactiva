import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# ─────────────────────────────────────────────
# 4. QUIZ IMAGES - inject into quiz question rendering
# Find quiz render function
# ─────────────────────────────────────────────
idx_quiz = content.find('renderQuiz(')
if idx_quiz == -1:
    idx_quiz = content.find('view-quizzes')
print(f'Quiz render at: {idx_quiz}')

# Find the quiz question display - look for the pattern that renders each question
for marker in ['quiz.question', 'q.question', 'quizData', 'currentQuiz']:
    idx = content.find(marker)
    if idx != -1:
        print(f'  Found "{marker}" at {idx}: {content[idx:idx+100]}')

# Find sim case rendering
for marker in ['sim_case', 'simulador', 'case.title', 'scenario']:
    idx = content.find(marker)
    if idx != -1:
        print(f'  Found sim "{marker}" at {idx}')
