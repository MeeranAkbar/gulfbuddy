"""Fix dark inline styles across home.html — make them white/light"""
import re

fp = r"D:\Project Try\GulfBuddy Platform\home.html"
c = open(fp, encoding="utf-8").read()

# Fix dark backgrounds in inline styles
dark_to_light = [
    ('background:#07070e',   'background:#f5f5f5'),
    ('background:#08081a',   'background:#f7f7f7'),
    ('background:#09090f',   'background:#f7f7f7'),
    ('background:#0d0d1a',   'background:#ffffff'),
    ('background:#0f0f1c',   'background:#f0f0f0'),
    ('background:#111',      'background:#ffffff'),
    ('background:#06060e',   'background:#ffffff'),
    # Dark text colors to light-theme equivalents
    ('color:#444;text-transform:uppercase;letter-spacing:.5px', 'color:#999;text-transform:uppercase;letter-spacing:.5px'),
    ('color:#5a5a80', 'color:#666'),
    ('color:#3a3a5a', 'color:#999'),
    ('color:#1e1e2e', 'color:#ccc'),
    ('color:#ececec', 'color:#111'),
    ('color:#eee', 'color:#111'),
    # Dark borders
    ('border:1px solid #1a1828', 'border:1px solid #e5e5e5'),
    ('border:1px solid #2a2a3a', 'border:1px solid #e5e5e5'),
    ('border-color:#1a1828',     'border-color:#e5e5e5'),
    # Section cards
    ('.section-card{background:#0d0d1a', '.section-card{background:#fff'),
    ('border:1px solid #1a1828;border-radius:14px', 'border:1px solid #e5e5e5;border-radius:14px'),
]

for old, new in dark_to_light:
    c = c.replace(old, new)

# Fix stats bar numbers and labels
c = c.replace(
    '<div style="font-size:20px;font-weight:700;color:#C9A84C">',
    '<div style="font-size:20px;font-weight:800;color:#c9a84c">'
)
c = c.replace(
    'color:#444;text-transform:uppercase;letter-spacing:.5px;margin-top:2px',
    'color:#999;text-transform:uppercase;letter-spacing:.5px;margin-top:2px'
)

open(fp, "w", encoding="utf-8").write(c)
print("Done — home.html light theme applied")
