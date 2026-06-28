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

const dir = path.join(__dirname, 'apps/web/lib/search');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.ts') || file === 'catalog.ts') continue;
  
  const key = file.replace('.ts', '');
  if (!images[key]) continue;
  
  let content = fs.readFileSync(path.join(dir, file), 'utf-8');
  
  // If imageUrl already exists, skip replacing to avoid duplication.
  if (content.includes('imageUrl:')) {
    // Only replace if it doesn't already have one, or just do a safe replace.
    // For property.ts, I manually added it to 3 items using multi_replace_file_content.
    // So property.ts already has imageUrl for some items, and routeHref for others.
    // I will replace `routeHref: '...'` with `routeHref: '...', imageUrl: '...'` only if it's not followed by imageUrl.
  }
  
  const regex = /(routeHref:\s*['"][^'"]+['"])(?!\s*,\s*imageUrl)/g;
  content = content.replace(regex, `$1,\n      imageUrl: '${images[key]}'`);

  fs.writeFileSync(path.join(dir, file), content);
  console.log('Updated ' + file);
}
