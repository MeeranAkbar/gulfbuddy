"""
Apply white light theme to ALL pages except home.html (already done)
Replaces dark inline background/color styles with light equivalents
"""
import os, re

BASE = r"D:\Project Try\GulfBuddy Platform"
SKIP = {"home.html", "rebrand.py", "replace_icons.py", "fix_nav_icons.py",
        "fix_home_light.py", "fix_card_icons.py", "fix_card_icons2.py",
        "fix_icon_sizes.py", "fix_svg_sizes.py", "update_logo.py", "check.py"}

REPLACEMENTS = [
    # Page/body backgrounds
    ('background:#06060e',   'background:#ffffff'),
    ('background:#07070e',   'background:#f7f7f7'),
    ('background:#08081a',   'background:#f8f8f8'),
    ('background:#09090f',   'background:#f5f5f5'),
    ('background:#0a0f1e',   'background:#f5f5f5'),
    ('background:#0d0d1a',   'background:#ffffff'),
    ('background:#0d0d1e',   'background:#f8f8f8'),
    ('background:#0f0f1c',   'background:#f5f5f5'),
    ('background:#0f0f1e',   'background:#f8f8f8'),
    ('background:#111120',   'background:#ffffff'),
    ('background:#111128',   'background:#f0f0f0'),
    ('background:#111',      'background:#ffffff'),
    ('background:#12100e',   'background:#f5f5f5'),
    ('background:#131320',   'background:#f5f5f5'),
    ('background:#141420',   'background:#f5f5f5'),
    ('background:#151520',   'background:#f0f0f0'),
    ('background:#1a1a26',   'background:#eeeeee'),
    ('background:#1a1828',   'background:#f8f8f8'),
    ('background:#1a1a1a',   'background:#f8f8f8'),
    ('background:#1c1c28',   'background:#eeeeee'),
    ('background:#111122',   'background:#f5f5f5'),
    # Card/panel backgrounds
    ('background:#0d0d1a',   'background:#ffffff'),
    ('background:#1a1828',   'background:#ffffff'),
    ('background:#080810',   'background:#f8f8f8'),
    ('background:#08081a',   'background:#f8f8f8'),
    # Borders
    ('border:1px solid #1a1828',  'border:1px solid #e5e5e5'),
    ('border:1px solid #2a2a3a',  'border:1px solid #e5e5e5'),
    ('border:1px solid #1a1820',  'border:1px solid #e5e5e5'),
    ('border:1px solid #2a2a4a',  'border:1px solid #dddddd'),
    ('border-color:#1a1828',      'border-color:#e5e5e5'),
    ('border-top:1px solid #1a1828', 'border-top:1px solid #e5e5e5'),
    ('border-bottom:1px solid #1a1828', 'border-bottom:1px solid #e5e5e5'),
    ('border-left:3px solid #1a1828',   'border-left:3px solid #e5e5e5'),
    # Dark text colors → light theme equivalents
    ('color:#eee',     'color:#111'),
    ('color:#ececec',  'color:#111'),
    ('color:#e0e0e0',  'color:#222'),
    ('color:#ccc',     'color:#555'),
    ('color:#aaa',     'color:#666'),
    ('color:#888',     'color:#888'),
    ('color:#555',     'color:#555'),
    ('color:#3a3a5a',  'color:#999'),
    ('color:#5a5a80',  'color:#666'),
    ('color:#444444',  'color:#444'),
    ('color:#2a2a4a',  'color:#ccc'),
    ('color:#1e1e2e',  'color:#ddd'),
    # Input/form backgrounds
    ('background:#0d0d1e',  'background:#f8f8f8'),
    ('background:#0d0d1a',  'background:#ffffff'),
    # Sidebar specific
    ('background:#08081a;border-right:1px solid #1a1828', 'background:#f8f8f8;border-right:1px solid #e5e5e5'),
    ('background:#08081a;border-bottom:1px solid #1a1828','background:#f8f8f8;border-bottom:1px solid #e5e5e5'),
    ('background:#08081a;border-left:1px solid #1a1828',  'background:#f8f8f8;border-left:1px solid #e5e5e5'),
    ('background:#08081a',  'background:#f8f8f8'),
    # Deal card specific colors
    ('border-left:3px solid #ef4444',  'border-left:3px solid #ef4444'),
    ('border-left:3px solid #C9A84C',  'border-left:3px solid #c9a84c'),
    ('border-left:3px solid #2a2a3a',  'border-left:3px solid #e5e5e5'),
    # Dark body style on pages
    ('body{background:#06060e', 'body{background:#ffffff'),
    ('body{background:#0d0d1a', 'body{background:#ffffff'),
    ('body{background:#08081a', 'body{background:#f8f8f8'),
    ('.svc-page{display:flex;flex-direction:column;width:100%;min-height:100vh}',
     '.svc-page{display:flex;flex-direction:column;width:100%;min-height:100vh;background:#f7f7f7}'),
]

ok = 0
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "Pricing Ideas")]
    for fname in files:
        if fname in SKIP:
            continue
        if not fname.endswith(".html"):
            continue
        if fname == "home.html" and root == BASE:
            continue
        fp = os.path.join(root, fname)
        c = open(fp, encoding="utf-8", errors="ignore").read()
        orig = c
        for old, new in REPLACEMENTS:
            c = c.replace(old, new)
        # Also fix body background in <style> blocks
        c = re.sub(r'body\{(.*?)background:#[0-9a-fA-F]{6}(.*?)\}',
                   lambda m: 'body{' + m.group(1) + 'background:#ffffff' + m.group(2) + '}',
                   c)
        if c != orig:
            open(fp, "w", encoding="utf-8").write(c)
            ok += 1
            print(f"  LIGHT: {fname}")

print(f"\nDone! {ok} pages converted to white theme")
