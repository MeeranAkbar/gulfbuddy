import os, re

BASE = r"D:\Project Try\GulfBuddy Platform"

SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#0e0e0e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'

def make_logo(href):
    return f'<a href="{href}" class="nav-logo">\n    <div class="nav-logo-icon">\n      {SVG}\n    </div>\n    <div class="nav-logo-text">Gulf<span>Habibi</span></div>\n  </a>'

ok = 0
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "Pricing Ideas")]
    depth = root.replace(BASE, "").count(os.sep)
    href = "home.html" if depth == 0 else "../home.html"
    for fname in files:
        if not fname.endswith(".html"):
            continue
        fp = os.path.join(root, fname)
        c = open(fp, encoding="utf-8", errors="ignore").read()
        orig = c
        c = re.sub(r'<a[^>]+class="nav-logo"[^>]*>.*?</a>', make_logo(href), c, flags=re.DOTALL)
        if c != orig:
            open(fp, "w", encoding="utf-8").write(c)
            print("OK:", fname)
            ok += 1

print("Done:", ok, "files updated")
