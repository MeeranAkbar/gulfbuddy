import type { Metadata } from 'next';
import Link from 'next/link';
import { ClassifiedsSearchForm } from '../../../components/search/classifieds-search-form';
import { searchClassifiedsListings } from '../../../lib/search/classifieds';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'UAE Classifieds | GulfHabibi',
  description: 'Search premium classifieds and verified sellers across the UAE.'
};

export default async function ClassifiedsPage() {
  // Fetch premium featured listings to show on the landing page
  const featuredListings = searchClassifiedsListings({ 
    keyword: '', location: '', category: '', condition: '' 
  }).slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Massive Hero Section */}
      <section className="relative flex min-h-[500px] flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555529771-835f59bfc50c?auto=format&fit=crop&w=2000&q=80" 
            alt="UAE Classifieds" 
            className="h-full w-full object-cover brightness-[0.5]" 
          />
        </div>
        
        <div className="relative z-10 w-full max-w-[1000px] text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
            Buy & Sell in the UAE
          </h1>
          <p className="mb-10 text-lg text-white/90 drop-shadow">
            Discover electronics, furniture, fashion, and more from verified sellers.
          </p>
          
          <div className="rounded-2xl bg-white p-6 shadow-2xl text-left">
             <ClassifiedsSearchForm actionHref="/classifieds/search" actionLabel="Search Items" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1380px] px-6 py-16 space-y-20">
        
        {/* Quick Links / Categories */}
        <section className="grid gap-6 md:grid-cols-3">
           <Link href="/classifieds/search?category=Electronics" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">📱</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Electronics & Gadgets</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Phones, laptops, gaming consoles, and smart home devices.</p>
           </Link>
           <Link href="/classifieds/search?category=Furniture" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🛋️</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Home & Furniture</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Sofas, beds, dining sets, and home decor.</p>
           </Link>
           <Link href="/classifieds/search?category=Fashion" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">👗</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Fashion & Beauty</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Clothing, shoes, accessories, and luxury items.</p>
           </Link>
        </section>

        {/* Featured Ads Grid */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Fresh Finds</h2>
              <p className="mt-2 text-[var(--text-secondary)]">Latest premium listings from verified sellers</p>
            </div>
            <Link href="/classifieds/search" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              View all listings &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredListings.map((result) => (
              <Link key={result.id} href={result.routeHref} className="gh-card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden bg-[var(--surface-muted)]">
                  {result.imageUrl ? (
                    <img src={result.imageUrl} alt={result.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-[var(--border-subtle)]" />
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[90%]">
                    {result.badges.slice(0, 2).map(b => (
                      <span key={b} className="rounded-[0.25rem] bg-white px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-black shadow-sm">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-lg font-bold text-[var(--primary)]">{result.priceLabel}</p>
                  <h3 className="mt-1 line-clamp-1 font-semibold text-ink">{result.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{result.location}</p>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-xs font-medium text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">🏷️ {result.category}</span>
                    <span className="flex items-center gap-1">✨ {result.condition}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between rounded-[0.85rem] bg-[var(--surface-alt)] p-3">
                     <div className="flex items-center gap-2">
                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs">👤</div>
                       <div className="flex flex-col">
                         <span className="text-xs font-semibold text-ink">{result.sellerName}</span>
                         <span className="text-[0.65rem] uppercase tracking-wider text-[var(--text-secondary)]">{result.sellerType}</span>
                       </div>
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
