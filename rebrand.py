import os, re

BASE = r"D:\Project Try\GulfHabibi Platform"
EXTS = {'.html', '.js', '.css', '.sql', '.txt', '.xml', '.py', '.json'}

replacements = [
    # Brand name variations
    ("GulfHabibi UAE", "GulfHabibi UAE"),
    ("GulfHabibi —", "GulfHabibi —"),
    ("GulfHabibi -", "GulfHabibi -"),
    ("GulfHabibi |", "GulfHabibi |"),
    ("GulfHabibi\u2019s", "GulfHabibi's"),
    ("GulfHabibi's", "GulfHabibi's"),
    ("GulfHabibi", "GulfHabibi"),
    ("gulfhabibi", "gulfhabibi"),
    # Domain
    ("mygulfhabibi.com", "gulfhabibi.com"),
    ("gulfhabibi.com", "gulfhabibi.com"),
    # Logo text
    ("\U0001f30a GulfHabibi", "\U0001f30a GulfHabibi"),
    # Nav logo
    ("nav-logo\">🌊 GulfHabibi", "nav-logo\">🌊 GulfHabibi"),
    # Title tags
    ("GulfHabibi UAE \u2014", "GulfHabibi UAE \u2014"),
    ("GulfHabibi \u2014", "GulfHabibi \u2014"),
]

changed = 0
skipped = 0

for root, dirs, files in os.walk(BASE):
    # Skip node_modules, .git etc
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', '__pycache__')]
    for fname in files:
        ext = os.path.splitext(fname)[1].lower()
        if ext not in EXTS:
            continue
        fpath = os.path.join(root, fname)
        try:
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            original = content
            for old, new in replacements:
                content = content.replace(old, new)
            if content != original:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(content)
                rel = fpath.replace(BASE + '\\', '')
                print(f"  UPDATED: {rel}")
                changed += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  ERROR: {fname} — {e}")

print(f"\nDone! {changed} files updated, {skipped} files unchanged.")
