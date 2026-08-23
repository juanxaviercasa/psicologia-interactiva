import os

MD_DIR = 'Psicologia_Oscura'
files = [f.replace('.md', '') for f in os.listdir(MD_DIR) if f.endswith('.md')]
files.sort()

print(f"Total files: {len(files)}")
for f in files:
    print(f"'{f}': '',")
