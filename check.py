import re
c = open(r'D:\Project Try\GulfBuddy Platform\home.html', encoding='utf-8').read()
nav_svgs = re.findall(r'class="nav-link[^"]*"[^>]*>.*?<svg', c, re.DOTALL)
print('Nav SVGs remaining:', len(nav_svgs))
card_icons = c.count('width:40px;height:40px')
print('Card icon boxes 40px:', card_icons)
print('CSS linked:', c.count('shared/style.css'))
idx = c.find('class="nav-link active"')
print('Nav sample:', repr(c[idx:idx+80]))
