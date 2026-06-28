const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'apps/web/components');
const verticals = ['motors', 'jobs', 'classifieds', 'services', 'directory'];

for (const v of verticals) {
  const p = path.join(dir, v, v + '-discovery.tsx');
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf-8');

  // Find the `<div className="min-h-[12rem] ... p-5">` block inside the ShowcaseGrid.
  // Actually, we can just replace everything between `<div className="min-h-[12rem]...` and `</div>\n          </div>\n          <div className="p-6">`
  
  // A robust way is to just replace the wrapper div and inject the image, similar to the search page.
  content = content.replace(/className="min-h-\[12rem\] bg-\[radial-gradient[^"]+"/, 'className="relative min-h-[16rem] overflow-hidden p-5"');

  const originalRegex = /<div className="(min-h-\[12rem\] bg-\[radial-gradient[^"]+)"\s*>\s*<div className="flex items-center justify-between gap-3">/g;
  
  content = content.replace(originalRegex, (match, classNames) => {
    const fallbackBg = classNames.replace('min-h-[12rem] ', '');
    return `<div className="relative min-h-[16rem] overflow-hidden p-5">
            {item.imageUrl && (
              <>
                <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.15),rgba(7,12,24,0.65))]" />
              </>
            )}
            {!item.imageUrl && (
              <div className="absolute inset-0 ${fallbackBg}" />
            )}
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-3">`;
  });

  // Now we need to remove the placeholder UI elements inside the header.
  // E.g., `<div className="mt-10 grid grid-cols-[1.1fr_0.9fr] gap-3">...</div>`
  // We can just regex delete them, or leave them but they might look weird over an image.
  // Let's delete the `mt-10` layout blocks.
  content = content.replace(/<div className="mt-10[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div className="p-6">/g, '</div>\n          </div>\n          <div className="p-6">');

  // Update text colors in the header badges
  content = content.replace(/border-\[var\(--border-subtle\)\].bg-\[var\(--surface\)\]/g, 'border-white/20 bg-black/40 backdrop-blur-md');
  // For the `text-muted` inside the header, it's safer to just do a blanket replace if we split by `<div className="p-6">` like before.
  
  let parts = content.split('<div className="p-6">');
  if (parts.length > 1) {
    let newParts = [];
    for (let i = 0; i < parts.length - 1; i++) {
      let header = parts[i];
      
      // Only modify the header if it contains our new wrapper
      if (header.includes('relative min-h-[16rem]')) {
        header = header.replace(/text-muted/g, 'text-white/80');
        header = header.replace(/text-\[var\(--text-secondary\)\]/g, 'text-white/90');
      }
      newParts.push(header);
    }
    content = newParts.join('<div className="p-6">') + '<div className="p-6">' + parts[parts.length - 1];
  }

  // Ensure the z-10 div is closed properly if we deleted the mt-10 blocks
  // Actually, the `mt-10` block deletion regex closed three divs.
  // The header structure is:
  // <div relative wrapper>
  //   {img}
  //   <div relative z-10>
  //     <div flex>...</div>
  //     <div mt-10>...</div>
  //   </div>
  // </div>
  // If we delete from `<div mt-10` up to `<div p-6`, we must replace it with `</div></div></div> <div p-6`

  fs.writeFileSync(p, content);
  console.log('Updated components for ' + v);
}
