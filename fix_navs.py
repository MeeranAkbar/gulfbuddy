import os, re

B = r'D:\Project Try\GulfHabibi Platform'

NEW_NAV = {
  'marketplace/index.html': ('🛒 Classifieds', '../'),
  'marketplace/post.html': ('🛒 Classifieds', '../'),
  'jobs/index.html': ('💼 Jobs', '../'),
  'jobs/post.html': ('💼 Jobs', '../'),
  'directory/index.html': ('📒 Directory', '../'),
  'directory/list.html': ('📒 Directory', '../'),
}

def make_nav(active_label, p):
    items = [
        ('Home', f'{p}home.html'),
        ('🚗 Motors', f'{p}motors/index.html'),
        ('🏠 Property', f'{p}property/index.html'),
        ('💼 Jobs', f'{p}jobs/index.html'),
        ('🛒 Classifieds', f'{p}marketplace/index.html'),
        ('🔧 Services', f'{p}services/index.html'),
        ('📒 Directory', f'{p}directory/index.html'),
        ('🤖 AI Guide', f'{"../../../" if p=="../" else "../../"}Gulf Buddy/index.html'),
        ('💰 Pricing', f'{p}pricing.html'),
        ('ℹ️ About Us', f'{p}about.html'),
    ]
    links = ''
    for label, href in items:
        active = ' active' if label == active_label else ''
        links += f'    <a href="{href}" class="nav-link{active}">{label}</a>\n'
    return f'  <div class="nav-links" id="navLinks">\n{links}  </div>'

for fname, (active, prefix) in NEW_NAV.items():
    fp = os.path.join(B, fname)
    if not os.path.exists(fp):
        print(f'SKIP: {fname}')
        continue
    c = open(fp, 'r', encoding='utf-8').read()
    new_nav = make_nav(active, prefix)
    c = re.sub(r'<div class="nav-links"[^>]*>[\s\S]*?</div>', new_nav, c, count=1)
    open(fp, 'w', encoding='utf-8').write(c)
    print(f'OK: {fname}')

print('ALL DONE')
