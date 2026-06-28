const fs = require('fs');
const path = require('path');

// 1. Fix lib/property/public-content.ts
const propContentPath = path.join(__dirname, 'apps/web/lib/property/public-content.ts');
if (fs.existsSync(propContentPath)) {
  let content = fs.readFileSync(propContentPath, 'utf-8');
  // Remove duplicates: if we see multiple `image?: string;`, we clean it up.
  // Actually, let's just regex replace `image\?\:\s*string;\s*imageUrl\?\:\s*string;\s*` to just one instance.
  // We can just find all instances of:
  // image?: string;
  // imageUrl?: string;
  // and dedup them. Or simply write a regex to replace 2 or more occurrences with just 1.
  content = content.replace(/(?:\s*image\?: string;\s*imageUrl\?: string;\s*){2,}/g, '\n  image?: string;\n  imageUrl?: string;\n');
  fs.writeFileSync(propContentPath, content);
  console.log('Fixed property/public-content.ts');
}

// 2. Fix lib/search/property.ts missing imageUrl
const propSearchPath = path.join(__dirname, 'apps/web/lib/search/property.ts');
if (fs.existsSync(propSearchPath)) {
  let content = fs.readFileSync(propSearchPath, 'utf-8');
  // Looking at the error:
  // Property 'imageUrl' is missing in type '{ id: string; slug: string; title: string; summary: string; marketMode: "long_term"; purpose: "sale";
  // We need to just inject imageUrl: '...' into any object in the array that lacks it.
  // My previous update-images.js was doing this:
  // content = content.replace(/(id: '[^']+',\s*slug: '[^']+',\s*title: '[^']+',)/g, "$1\n    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',");
  // But maybe it missed some.
  // Let's use a smarter replacement: find any object starting with `{` and `id: '...',` that DOES NOT have `imageUrl:` before the closing `}` and inject it.
  
  // A simpler way: just define a default `imageUrl?: string` in `PropertyListingSeed` type.
  // The error says: Property 'imageUrl' is missing in type ... but required in type 'PropertyListingSeed'.
  // If we just make it optional in `PropertyListingSeed` (or `PropertyListing`), it fixes it.
  // Let's make it optional in the type definition inside lib/search/property.ts.
  content = content.replace(/imageUrl: string;/g, 'imageUrl?: string;');
  
  fs.writeFileSync(propSearchPath, content);
  console.log('Fixed lib/search/property.ts');
}
