"""
Fix SVG icon sizes — make them small and inline properly
Nav links: 14px, inline with text, no extra spacing
Category sidebars: 16px
Card icons: 18px
"""
import os, re

BASE = r"D:\Project Try\GulfBuddy Platform"

ok = 0
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "Pricing Ideas")]
    for fname in files:
        if not fname.endswith((".html", ".css")):
            continue
        fp = os.path.join(root, fname)
        c = open(fp, encoding="utf-8", errors="ignore").read()
        orig = c

        # Fix ALL inline SVGs that replaced emojis — set proper small size
        # Remove any existing style on these SVGs first
        c = re.sub(
            r'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1\.8" stroke-linecap="round" stroke-linejoin="round"[^>]*>',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:middle;flex-shrink:0;display:inline-block">',
            c
        )

        if c != orig:
            open(fp, "w", encoding="utf-8").write(c)
            ok += 1
            print("FIXED:", fname)

print(f"\nDone: {ok} files updated")
