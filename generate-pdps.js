const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'apps/web');

// 1. Update API Files
const apis = [
  { file: 'jobs.ts', funcName: 'getJobListingBySlug', searchFn: 'searchJobsListings', emptyParams: "{ keyword: '', location: '', category: '', employmentType: '', experienceLevel: '' }" },
  { file: 'classifieds.ts', funcName: 'getClassifiedsListingBySlug', searchFn: 'searchClassifiedsListings', emptyParams: "{ keyword: '', location: '', category: '', condition: '' }" },
  { file: 'services.ts', funcName: 'getServiceListingBySlug', searchFn: 'searchServicesListings', emptyParams: "{ keyword: '', location: '', category: '' }" },
  { file: 'directory.ts', funcName: 'getDirectoryListingBySlug', searchFn: 'searchDirectoryListings', emptyParams: "{ keyword: '', location: '', category: '' }" }
];

for (const api of apis) {
  const p = path.join(baseDir, 'lib/search', api.file);
  let content = fs.readFileSync(p, 'utf-8');
  if (!content.includes(api.funcName)) {
    // Append the helper
    content += `\nexport function ${api.funcName}(slug: string) {\n  const listings = ${api.searchFn}(${api.emptyParams});\n  return listings.find(l => l.routeHref.endsWith(slug)) || null;\n}\n`;
    fs.writeFileSync(p, content);
  }
}

// 2. Generate Page Files
const verticals = [
  { 
    dir: 'jobs', 
    func: 'getJobListingBySlug', 
    titleKey: 'title', 
    priceKey: 'salaryLabel', 
    hero: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80',
    accent: 'var(--jobs-accent)'
  },
  { 
    dir: 'classifieds', 
    func: 'getClassifiedsListingBySlug', 
    titleKey: 'title', 
    priceKey: 'priceLabel', 
    hero: 'https://images.unsplash.com/photo-1588702545922-77eb618a8ea4?auto=format&fit=crop&w=1600&q=80',
    accent: 'var(--classifieds-accent)'
  },
  { 
    dir: 'services', 
    func: 'getServiceListingBySlug', 
    titleKey: 'title', 
    priceKey: 'priceLabel', 
    hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    accent: 'var(--services-accent)'
  },
  { 
    dir: 'directory', 
    func: 'getDirectoryListingBySlug', 
    titleKey: 'name', 
    priceKey: 'ratingLabel', 
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    accent: 'var(--directory-accent)'
  }
];

for (const v of verticals) {
  const dirPath = path.join(baseDir, 'app/(public)', v.dir, '[slug]');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const pageContent = `import { notFound } from 'next/navigation';
import { ${v.func} } from '../../../../../lib/search/${v.dir}';
import Link from 'next/link';
import { ChevronLeftIcon, ShareIcon, HeartIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ${v.dir.charAt(0).toUpperCase() + v.dir.slice(1)}DetailPage({ params }: Props) {
  const resolvedParams = await params;
  const listing = ${v.func}(resolvedParams.slug);

  if (!listing) {
    notFound();
  }

  const heroImage = listing.imageUrl || '${v.hero}';

  return (
    <div className="bg-[var(--background)] pb-24">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--surface)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-4 xl:px-8">
          <Link href="/${v.dir}/search" className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ChevronLeftIcon className="h-4 w-4" />
            Back to ${v.dir}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1380px] px-5 pt-8 xl:px-8">
        
        {/* Cinematic Hero */}
        <div className="relative h-[40vh] w-full overflow-hidden rounded-[2rem] md:h-[50vh] xl:h-[60vh]">
          <img src={heroImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8">
             <div className="flex flex-wrap items-center gap-3">
                {(listing.badges || []).map((badge: string) => (
                  <span key={badge} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    {badge}
                  </span>
                ))}
              </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
          
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">{listing.${v.titleKey} || listing.title}</h1>
              <p className="mt-4 text-lg font-medium text-[var(--text-secondary)]">{listing.location}</p>
            </div>
            <hr className="border-[var(--border-subtle)]" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Details</h2>
              <p className="mt-6 leading-8 text-[var(--text-secondary)]">
                {listing.summary}
                <br /><br />
                This is a premium listing on GulfBuddy. verified and quality assured. Contact the poster to learn more about the specifics.
              </p>
            </div>
          </div>

          <div>
            <div className="sticky top-28 rounded-[2rem] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-md)]">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{listing.${v.priceKey} || listing.priceLabel || 'Price on request'}</h2>
              
              <div className="mt-8 space-y-4">
                <button className="flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1EBE5C]">
                  WhatsApp Now
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center rounded-2xl bg-[${v.accent}] px-6 py-4 text-sm font-bold text-[var(--text-inverse)] transition hover:opacity-90">
                    Call
                  </button>
                  <button className="flex items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-transparent px-6 py-4 text-sm font-bold text-[var(--text-primary)] transition hover:bg-[var(--surface-alt)]">
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), pageContent);
  console.log('Created ' + v.dir);
}
