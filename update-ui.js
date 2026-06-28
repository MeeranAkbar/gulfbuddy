const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'apps/web/app/(public)');
const verticals = ['jobs', 'classifieds', 'services', 'directory'];

for (const v of verticals) {
  const p = path.join(dir, v, 'search', 'page.tsx');
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf-8');

  // We need to replace:
  // <div className="min-h-[12rem] bg-[radial-gradient...
  // ... until the closing </div> of that header block.
  // Actually, we can use a simpler regex to just replace the opening tags and inject the image.

  // 1. Replace the wrapper div class to be relative and 14rem tall
  content = content.replace(/className="min-h-\[12rem\] bg-\[radial-gradient[^"]+"/, 'className="relative min-h-[14rem] overflow-hidden p-5"');

  // 2. Inject the image logic right after `<div className="relative min-h-[14rem] overflow-hidden p-5">`
  const injectTarget = '<div className="relative min-h-[14rem] overflow-hidden p-5">';
  
  // We need to match the specific color logic for the fallback. Let's extract it before we replace.
  // Let's do it manually using replace:
  
  const originalRegex = /<div className="(min-h-\[12rem\] bg-\[radial-gradient[^"]+)"\s*>\s*<div className="flex flex-wrap items-center gap-2">/g;
  
  content = content.replace(originalRegex, (match, classNames) => {
    // classNames contains bg-[radial-gradient(circle_at_top_left,rgba(X,X,X,0.18)...
    // We want to use that exact background for the fallback
    const fallbackBg = classNames.replace('min-h-[12rem] ', '');
    
    return `<div className="relative min-h-[14rem] overflow-hidden p-5">
                    {result.imageUrl && (
                      <>
                        <img src={result.imageUrl} alt={result.title} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.2),rgba(7,12,24,0.85))]" />
                      </>
                    )}
                    {!result.imageUrl && (
                      <div className="absolute inset-0 ${fallbackBg}" />
                    )}
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex flex-wrap items-center gap-2">`;
  });

  // 3. Update text colors to white/70 and white inside the header
  // Let's look for `<div className="mt-8 flex items-end justify-between gap-3">`
  // and replace all `text-muted` with `text-white/70`, `text-ink` with `text-white`
  // and `border-[var(--border-subtle)]` with `border-white/20`, `bg-[var(--surface)]` with `bg-black/40 backdrop-blur-md`
  
  // To do this safely, we only replace these classes inside the `relative z-10` block.
  // Actually, we can just run a global replace if we isolate it to the search page, but it might hit the body of the card too.
  // Instead of a complex regex, I'll just write a script that does string splits.

  let parts = content.split('<div className="p-6">');
  if (parts.length > 1) {
    let header = parts[0];
    header = header.replace(/text-muted/g, 'text-white/70');
    header = header.replace(/text-ink/g, 'text-white');
    header = header.replace(/border-\[var\(--border-subtle\)\].bg-\[var\(--surface\)\]/g, 'border-white/20 bg-black/40 backdrop-blur-md');
    content = header + '<div className="p-6">' + parts.slice(1).join('<div className="p-6">');
  }

  // Close the relative z-10 div right before `<div className="p-6">`
  content = content.replace(/<\/div>\s*<\/div>\s*<div className="p-6">/g, '</div>\n                    </div>\n                  </div>\n\n                  <div className="p-6">');

  fs.writeFileSync(p, content);
  console.log('Updated ' + v);
}
