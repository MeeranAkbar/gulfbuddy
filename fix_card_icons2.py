"""Upgrade section card icons: 40px box → 52px, 20px icon → 26px"""
import re
fp = r"D:\Project Try\GulfBuddy Platform\home.html"
c = open(fp, encoding="utf-8").read()
c = c.replace(
    'width:40px;height:40px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.15);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px',
    'width:52px;height:52px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px'
)
c = c.replace('style="width:20px;height:20px;flex-shrink:0">', 'style="width:26px;height:26px;flex-shrink:0;stroke:#c9a84c">')
open(fp, "w", encoding="utf-8").write(c)
print("Done — card icons upgraded to 52px/26px")
