"""
Fix nav link SVG sizing — adds width/height to all inline SVGs in nav-links
"""
import os, re

BASE = r"D:\Project Try\GulfBuddy Platform"

# Add proper sizing to SVGs inside nav-links
SVG_WITH_SIZE = r'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;vertical-align:middle">'
SVG_PLAIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'

ok = 0
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "Pricing Ideas")]
    for fname in files:
        if not fname.endswith(".html"):
            continue
        fp = os.path.join(root, fname)
        c = open(fp, encoding="utf-8", errors="ignore").read()
        orig = c

        # Fix SVGs inside .nav-link elements - add explicit sizing
        def fix_nav_svgs(match):
            content = match.group(0)
            # Replace plain SVG open tag with sized version
            content = content.replace(SVG_PLAIN, SVG_WITH_SIZE)
            return content

        c = re.sub(
            r'class="nav-link[^"]*">[^<]*<svg[^>]*>.*?</svg>[^<]*<',
            fix_nav_svgs,
            c,
            flags=re.DOTALL
        )

        # Also fix all standalone SVGs that replaced emojis - add default sizing
        c = re.sub(
            r'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1\.8" stroke-linecap="round" stroke-linejoin="round">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;vertical-align:middle;flex-shrink:0">',
            c
        )

        # Don't re-size ones already sized
        c = c.replace(
            'style="width:14px;height:14px;flex-shrink:0;vertical-align:middle" style="width:16px;height:16px;vertical-align:middle;flex-shrink:0"',
            'style="width:14px;height:14px;flex-shrink:0;vertical-align:middle"'
        )

        if c != orig:
            open(fp, "w", encoding="utf-8").write(c)
            ok += 1
            print("OK:", fname)

print("Done:", ok, "files fixed")
