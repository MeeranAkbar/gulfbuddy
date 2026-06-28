"""
Fix section card icons on homepage to match reference image
Icons should be ~22px inside a subtle box, not 14px inside a 32px font div
"""
import os, re

fp = r"D:\Project Try\GulfBuddy Platform\home.html"
c = open(fp, encoding="utf-8").read()

# Fix the icon container div in section cards
# Replace: <div style="font-size:32px;margin-bottom:12px"><svg ... 14px ...></div>
# With:    <div style="width:40px;height:40px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.15);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px"><svg ... 20px ...></div>

c = re.sub(
    r'<div style="font-size:32px;margin-bottom:12px">(<svg[^>]*style=")[^"]*(".*?</svg>)</div>',
    r'<div style="width:40px;height:40px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.15);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px">\1width:20px;height:20px;flex-shrink:0\2</div>',
    c, flags=re.DOTALL
)

open(fp, "w", encoding="utf-8").write(c)
print("Done — section card icons fixed")
