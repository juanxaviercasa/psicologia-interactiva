import re

with open('js/data_libros.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's see how many pillars we have. Every pillar has a 'title' but also 'deepDive' or 'storytellingConcept' or 'dialogueBreakdown' or 'tacticalShield'. Let's look for 'tacticalShield'
matches = list(re.finditer(r"tacticalShield:", content))
print(f"tacticalShields found: {len(matches)}")

matches2 = list(re.finditer(r"deepDive:", content))
print(f"deepDives found: {len(matches2)}")

matches3 = list(re.finditer(r"dialogueBreakdown:", content))
print(f"dialogueBreakdowns found: {len(matches3)}")
