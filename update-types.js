const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'apps/web/lib');
const dirs = fs.readdirSync(dir);

for (const section of dirs) {
  const publicContentPath = path.join(dir, section, 'public-content.ts');
  if (!fs.existsSync(publicContentPath)) continue;
  
  let content = fs.readFileSync(publicContentPath, 'utf-8');
  
  // Inject into any interface that ends with ShowcaseItem
  // e.g. export interface PropertyShowcaseItem {
  
  const regex = /(export\s+interface\s+\w+ShowcaseItem\s*\{[^}]*)(})/g;
  content = content.replace(regex, `$1  image?: string;\n  imageUrl?: string;\n$2`);

  // Same for any Highlights or listings that might have gotten the injection
  const regex2 = /(export\s+interface\s+\w+Highlight\s*\{[^}]*)(})/g;
  content = content.replace(regex2, `$1  image?: string;\n  imageUrl?: string;\n$2`);

  const regex3 = /(export\s+interface\s+\w+Listing\s*\{[^}]*)(})/g;
  content = content.replace(regex3, `$1  image?: string;\n  imageUrl?: string;\n$2`);

  fs.writeFileSync(publicContentPath, content);
  console.log('Updated types in ' + section);
}
