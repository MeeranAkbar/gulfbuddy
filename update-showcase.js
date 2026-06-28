const fs = require('fs');
const path = require('path');

const images = {
  property: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
  motors: 'https://images.unsplash.com/photo-1503376712344-652bb8fc59eb?q=80&w=2070&auto=format&fit=crop',
  jobs: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
  classifieds: 'https://images.unsplash.com/photo-1605636362598-cb54e3d64c12?q=80&w=2070&auto=format&fit=crop',
  services: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop',
  directory: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
};

const dir = path.join(__dirname, 'apps/web/lib');
const dirs = fs.readdirSync(dir);

for (const section of dirs) {
  if (!images[section]) continue;
  
  const publicContentPath = path.join(dir, section, 'public-content.ts');
  if (!fs.existsSync(publicContentPath)) continue;
  
  let content = fs.readFileSync(publicContentPath, 'utf-8');
  
  // They usually have 'price:', 'salaryLabel:', 'highlight:', 'ratingLabel:' inside their showcase arrays
  // Or they have `badge: '...'` and `meta: '...'`. Let's look for something common to add `imageUrl` to.
  // Actually, they might already have `image: '...'` or they don't.
  
  const regex = /(highlight:\s*['"][^'"]+['"]|salaryLabel:\s*['"][^'"]+['"]|price:\s*['"][^'"]+['"])(?!\s*,\s*image)/g;
  content = content.replace(regex, `$1,\n    image: '${images[section]}'`);
  
  // also add imageUrl
  const regex2 = /(highlight:\s*['"][^'"]+['"]|salaryLabel:\s*['"][^'"]+['"]|price:\s*['"][^'"]+['"])(?!\s*,\s*imageUrl)/g;
  content = content.replace(regex2, `$1,\n    imageUrl: '${images[section]}'`);

  fs.writeFileSync(publicContentPath, content);
  console.log('Updated ' + section);
}
