with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix ID mismatches: HTML uses these IDs but app.js had wrong ones
# matrix-container -> matrixGrid (HTML is already matrixGrid, good)
# bodylab-container -> bodyLabGrid
# simulator-container -> simulatorPlayerArea
# quizzes-container -> quizzesContainer
# flashcard-container -> keep as is (used in app.js)

# FIX: Move skilltree, sparring, auditor, biometrics INSIDE <main>
# They are currently after </main>. Find </main> and move sections before it.

footer_pos = content.find('  <!-- FOOTER -->')
main_close = content.find('  </main>')

if footer_pos > main_close and main_close != -1:
    # Extract the stray sections between </main> and <!-- FOOTER -->
    stray_sections = content[main_close + len('  </main>'):footer_pos].strip()
    
    # Remove them from after </main>
    content = content[:main_close + len('  </main>')] + '\n\n  ' + content[footer_pos:]
    
    # Insert them BEFORE </main>
    # Find </main> again (position updated)
    main_close2 = content.find('  </main>')
    content = content[:main_close2] + stray_sections + '\n\n  </main>' + content[main_close2 + len('  </main>'):]
    print("Moved stray sections inside <main>")
else:
    print("Sections may already be inside main, or structure is different")

# Fix the flashcard container ID to match what app.js expects
content = content.replace('id="flashcard-container"', 'id="flashcard-container"')  # already correct

# Fix matrix container ID
content = content.replace('id="matrix-container"', 'id="matrixGrid"')  # ensure correct

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
    
print("HTML structure fixed")
