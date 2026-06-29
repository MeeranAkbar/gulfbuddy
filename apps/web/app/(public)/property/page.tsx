import type { Metadata } from 'next';
import Link from 'next/link';
import { PropertySearchConsole } from '../../../components/property/property-discovery';
import { getPropertyModeConfig } from '../../../lib/property/public-content';
import { searchPropertyListings } from '../../../lib/search/property-server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'UAE Property Portal | GulfHabibi',
  description: 'Search premium properties for sale and rent across the UAE.'
};

export default async function PropertyPage() {
  const primaryPropertyMode = getPropertyModeConfig('long_term');
  
  if (!primaryPropertyMode) {
    return null;
  }

  // Fetch premium featured listings to show on the landing page
  const featuredListings = (await searchPropertyListings({ marketMode: 'long_term' } as any)).slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Massive Hero Section */}
      <section className="relative flex min-h-[500px] flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" 
            alt="UAE Property" 
            className="h-full w-full object-cover brightness-[0.5]" 
          />
        </div>
        
        <div className="relative z-10 w-full max-w-[1000px] text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
            Find Your Dream Home in the UAE
          </h1>
          <p className="mb-10 text-lg text-white/90 drop-shadow">
            Search thousands of verified properties for sale and rent from trusted agents.
          </p>
          
          <div className="rounded-2xl bg-white p-6 shadow-2xl text-left">
             <PropertySearchConsole activeMode={primaryPropertyMode} routeMode="search" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1380px] px-6 py-16 space-y-20">
        
        {/* Quick Links / Categories */}
        <section className="grid gap-6 md:grid-cols-3">
           <Link href="/property/long_term?type=sale" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🏡</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Buy a Home</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Find your dream home with thousands of verified listings across the UAE.</p>
           </Link>
           <Link href="/property/long_term?type=rent" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🔑</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Rent a Home</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Discover apartments, villas, and townhouses for rent with direct agent access.</p>
           </Link>
           <Link href="/property/off_plan" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🏗️</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Off-Plan Projects</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Explore the latest new developments and investment opportunities directly from builders.</p>
           </Link>
        </section>

        {/* Featured Properties Grid */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Featured Properties</h2>
              <p className="mt-2 text-[var(--text-secondary)]">Handpicked premium homes across the UAE</p>
            </div>
            <Link href="/property/long_term" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              View all listings &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredListings.map((result) => (
              <Link key={result.id} href={`/property/listing/${result.slug}`} className="gh-card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden bg-[var(--surface-muted)]">
                  {result.imageUrl ? (
                    <img src={result.imageUrl} alt={result.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-[var(--border-subtle)]" />
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {result.badges.slice(0, 1).map(b => (
                      <span key={b} className="rounded-[0.25rem] bg-white px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-black shadow-sm">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-lg font-bold text-[var(--primary)]">{result.priceLabel}</p>
                  <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted">{result.propertyType}</p>
                  
                  <h3 className="mt-3 line-clamp-1 text-sm font-semibold tracking-tight text-ink">{result.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <span className="text-muted">📍</span> {result.emirateLabel} / {result.area}
                  </p>
                  
                  <div className="mt-auto pt-5 flex items-center gap-4 text-xs font-semibold text-[var(--text-secondary)]">
                    {result.bedrooms && <span className="flex items-center gap-1">🛏️ {result.bedrooms}</span>}
                    {result.bathrooms && <span className="flex items-center gap-1">🚿 {result.bathrooms}</span>}
                    {result.sizeSqft && <span className="flex items-center gap-1">📐 {result.sizeSqft} sqft</span>}
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
