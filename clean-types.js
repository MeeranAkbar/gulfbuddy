const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'apps/web/lib');
const dirs = ['property', 'motors', 'jobs', 'classifieds', 'services', 'directory'];

for (const dir of dirs) {
  const p = path.join(base, dir, 'public-content.ts');
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf-8');

  // Fix 1: Duplicate `image?: string;` and `imageUrl?: string;` in interfaces
  // We'll just remove all of them from the file first
  content = content.replace(/\s*image\?: string;/g, '');
  content = content.replace(/\s*imageUrl\?: string;/g, '');

  // Then add them back to any interface ending in ShowcaseItem or Highlight or Spotlight or Listing
  const ifaceRegex = /(export\s+interface\s+\w+(?:ShowcaseItem|Highlight|Spotlight|Listing)\s*\{[^}]*)(})/g;
  content = content.replace(ifaceRegex, `$1  imageUrl?: string;\n$2`);

  // Fix 2: Duplicate `imageUrl: '...'` keys in object literals
  // Let's use a replacer function that only keeps the last `imageUrl:` in an object block.
  // A simpler way: just remove all `imageUrl: '...',` completely
  // Then we can re-inject it safely.
  // Wait, I already injected the correct Unsplash images using `update-images.js`!
  // If I delete them, I lose the images.
  // The duplicate is likely exactly the same string because I ran `update-images.js` twice!
  
  // So let's replace two or more identical `imageUrl: '...',` lines with just one.
  // Actually, let's just find any `imageUrl: '[^']+',\s*` that appears more than once consecutively.
  // Or better, let's just parse the lines. If a line is an `imageUrl` line and the previous line was also an `imageUrl` line (or we already saw `imageUrl` for this block), remove it.
  
  const lines = content.split('\n');
  const cleanedLines = [];
  let inObject = false;
  let seenImageUrl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // reset seenImageUrl on new object start `{` or if we hit `}`
    if (line.includes('{')) {
      seenImageUrl = false;
    }
    
    if (line.match(/\s*imageUrl:\s*'.*?',/)) {
      if (seenImageUrl) {
        // Skip duplicate
        continue;
      } else {
        seenImageUrl = true;
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
    
    if (line.includes('}')) {
      seenImageUrl = false;
    }
  }

  content = cleanedLines.join('\n');

  fs.writeFileSync(p, content);
  console.log('Cleaned ' + dir);
}
