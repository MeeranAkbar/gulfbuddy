const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'apps/web');

// 1. Update page.tsx (add hero imageUrl)
const heroImages = {
  jobs: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80',
  classifieds: 'https://images.unsplash.com/photo-1555529771-835f59bfc50c?auto=format&fit=crop&w=2000&q=80',
  services: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2000&q=80',
  directory: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80'
};

Object.entries(heroImages).forEach(([vertical, url]) => {
  const pagePath = path.join(baseDir, `app/(public)/${vertical}/page.tsx`);
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    if (!content.includes('imageUrl=')) {
      content = content.replace(
        /(description="[^"]+")/,
        `$1\n      imageUrl="${url}"`
      );
      fs.writeFileSync(pagePath, content);
    }
  }
});

// 2. Fix public-content.ts (remove duplicate image, add valid imageUrl)
const contentImages = {
  jobs: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'],
  classifieds: ['https://images.unsplash.com/photo-1550009158-9ebf6e250400?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'],
  services: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'],
  directory: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80']
};

Object.entries(contentImages).forEach(([vertical, urls]) => {
  const contentPath = path.join(baseDir, `lib/${vertical}/public-content.ts`);
  if (fs.existsSync(contentPath)) {
    let content = fs.readFileSync(contentPath, 'utf8');
    
    // Remove all duplicate `image: ...` lines
    content = content.replace(/^\s*image:\s*'.*',?\s*\n/gm, '');
    
    // Replace broken imageUrl with fresh URLs
    let imgIndex = 0;
    content = content.replace(/imageUrl:\s*'.*?'/g, () => {
      const url = urls[imgIndex % urls.length];
      imgIndex++;
      return `imageUrl: '${url}'`;
    });
    
    fs.writeFileSync(contentPath, content);
  }
});

// 3. Create sleek SearchForms
const searchForms = ['jobs', 'classifieds', 'services', 'directory'];
const searchFormTemplate = (vertical) => `'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}SearchFormProps {
  actionHref: string;
  actionLabel: string;
}

export function ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}SearchForm({ actionHref, actionLabel }: ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}SearchFormProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-lg)] backdrop-blur-xl lg:flex-row lg:items-end">
        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Search</span>
          <input
            className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]"
            value={keyword}
            placeholder="Search ${vertical}..."
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Location</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={location} onChange={(event) => setLocation(event.target.value)}>
            <option value="">All UAE</option>
            <option value="dubai">Dubai</option>
            <option value="abudhabi">Abu Dhabi</option>
            <option value="sharjah">Sharjah</option>
          </select>
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Category</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Any category</option>
            <option value="cat1">Category 1</option>
            <option value="cat2">Category 2</option>
          </select>
        </label>

        <div className="flex items-end gap-2 lg:ml-2">
          <button
            type="button"
            className={\`gh-button-secondary min-h-[50px] !rounded-[1.15rem] px-4 text-xs font-semibold transition \${showAdvanced ? 'border-[var(--primary)] bg-[var(--accent-soft)]' : ''}\`}
            onClick={() => setShowAdvanced((current) => !current)}
          >
            Filters
          </button>
          <Link href={actionHref} className="gh-button-primary min-h-[50px] w-full items-center justify-center lg:w-auto">
            {actionLabel}
          </Link>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid gap-4 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 lg:grid-cols-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Min Price (AED)</span>
            <input className="gh-field !rounded-[1.15rem]" inputMode="numeric" placeholder="No min" />
          </label>
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Max Price (AED)</span>
            <input className="gh-field !rounded-[1.15rem]" inputMode="numeric" placeholder="No max" />
          </label>
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Sort By</span>
            <select className="gh-field !rounded-[1.15rem]">
              <option value="recent">Most Recent</option>
              <option value="price_asc">Lowest Price</option>
              <option value="price_desc">Highest Price</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}`;

searchForms.forEach(vertical => {
  const formPath = path.join(baseDir, `components/search/${vertical}-search-form.tsx`);
  fs.writeFileSync(formPath, searchFormTemplate(vertical));
});

// 4. Update discovery components (use SearchForm instead of Console Grid, and update CategoryGrid to images)
const discoveryImages = {
  jobs: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'],
  classifieds: ['https://images.unsplash.com/photo-1550009158-9ebf6e250400?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80'],
  services: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80'],
  directory: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80']
};

Object.keys(discoveryImages).forEach(vertical => {
  const compPath = path.join(baseDir, `components/${vertical}/${vertical}-discovery.tsx`);
  if (fs.existsSync(compPath)) {
    let content = fs.readFileSync(compPath, 'utf8');

    // Add SearchForm import if not exists
    const importName = vertical.charAt(0).toUpperCase() + vertical.slice(1) + 'SearchForm';
    if (!content.includes(importName)) {
      content = content.replace(/(import Link from 'next\/link';)/, `$1\nimport { ${importName} } from '../search/${vertical}-search-form';`);
    }

    // Replace SearchConsole
    const searchRegex = new RegExp(`export function ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}SearchConsole\\(\\{[\\s\\S]*?\\}\\) \\{[\\s\\S]*?<\\/section>\\n\\}`);
    content = content.replace(searchRegex, `export function ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}SearchConsole({
  filters,
  actionHref,
  actionLabel
}: {
  fields?: any[];
  filters: string[];
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="gh-card p-5 md:p-6">
      <${importName} actionHref={actionHref} actionLabel={actionLabel} />
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]"
          >
            {filter}
          </span>
        ))}
      </div>
    </section>
  );
}`);

    // Upgrade Category Grid
    const catRegex = new RegExp(`export function ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}CategoryGrid\\(\\{ items \\}: \\{ items: (.*?) \\}\\) \\{[\\s\\S]*?<\\/div>\\n\\}`);
    
    // Convert array to string of images
    const imagesArrayStr = JSON.stringify(discoveryImages[vertical]);
    
    content = content.replace(catRegex, `export function ${vertical.charAt(0).toUpperCase() + vertical.slice(1)}CategoryGrid({ items }: { items: $1 }) {
  const modeImages: string[] = ${imagesArrayStr};
  
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => (
        <article key={item.slug || item.focus || item.name} className="group relative flex h-[350px] flex-col justify-between overflow-hidden rounded-[2rem] p-6 shadow-lg transition-transform hover:-translate-y-1">
          <img 
            src={modeImages[i % modeImages.length]} 
            alt={item.title || item.focus || item.name} 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 mix-blend-multiply opacity-90 transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1624]/90 via-[#0d1624]/30 to-transparent" />
          
          <div className="relative z-10">
             <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                {item.focus || 'Category'}
             </span>
          </div>
          
          <div className="relative z-10 mt-auto">
            <h3 className="text-xl font-bold tracking-tight text-white">{item.title || item.focus || item.name}</h3>
            <p className="mt-2 text-sm leading-6 text-white/80">{item.detail}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-white/90 group-hover:text-white">
              Explore &rarr;
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}`);

    fs.writeFileSync(compPath, content);
  }
});

console.log('Vertical upgrades complete!');
