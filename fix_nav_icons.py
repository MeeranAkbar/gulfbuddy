"""
GulfHabibi — Fix icon sizes to match reference image
1. Remove ALL SVG icons from nav-links (text only)
2. Fix section card icons to 20px max
3. Fix search tab icons to 13px
4. Fix all inline SVGs to correct contextual sizes
"""
import os, re

BASE = r"D:\Project Try\GulfBuddy Platform"

ok = 0
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "Pricing Ideas")]
    for fname in files:
        if not fname.endswith(".html"):
            continue
        fp = os.path.join(root, fname)
        c = open(fp, encoding="utf-8", errors="ignore").read()
        orig = c

        # 1. Remove SVG icons from nav-link anchors — text only in navbar
        # Match: <a class="nav-link..."><svg...></svg> Text</a>
        c = re.sub(
            r'(<a[^>]+class="nav-link[^"]*"[^>]*>)\s*<svg[^>]*>.*?</svg>\s*',
            r'\1',
            c, flags=re.DOTALL
        )

        # 2. Fix search tab icons (stab buttons) — keep but make tiny 13px
        c = re.sub(
            r'(<button[^>]+class="stab[^"]*"[^>]*>)\s*<svg[^>]*style="[^"]*"[^>]*>(.*?)</svg>\s*',
            lambda m: m.group(1) + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;vertical-align:middle;flex-shrink:0;margin-right:3px">' + m.group(2) + '</svg>',
            c, flags=re.DOTALL
        )

        # 3. Fix all remaining inline SVGs — set to 14px default
        c = re.sub(
            r'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1\.8" stroke-linecap="round" stroke-linejoin="round" style="[^"]*">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;flex-shrink:0">',
            c
        )

        if c != orig:
            open(fp, "w", encoding="utf-8").write(c)
            ok += 1
            print("OK:", fname)

print(f"\nDone: {ok} files fixed")
