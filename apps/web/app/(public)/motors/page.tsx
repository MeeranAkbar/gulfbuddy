import type { Metadata } from 'next';
import Link from 'next/link';
import { MotorsSearchForm } from '../../../components/search/motors-search-form';
import { searchMotorsListings } from '../../../lib/search/motors';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'UAE Motors Marketplace | GulfHabibi',
  description: 'Search premium vehicles for sale across the UAE.'
};

export default async function MotorsPage() {
  // Fetch premium featured listings to show on the landing page
  const featuredListings = searchMotorsListings({ 
    keyword: '', location: '', vehicleType: '', minPrice: null, maxPrice: null, year: null 
  }).slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Massive Hero Section */}
      <section className="relative flex min-h-[500px] flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376712344-652bb8fc59eb?auto=format&fit=crop&w=2000&q=80" 
            alt="UAE Motors" 
            className="h-full w-full object-cover brightness-[0.5]" 
          />
        </div>
        
        <div className="relative z-10 w-full max-w-[1000px] text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
            Find Your Next Vehicle
          </h1>
          <p className="mb-10 text-lg text-white/90 drop-shadow">
            Search thousands of verified cars, SUVs, and commercial vehicles.
          </p>
          
          <div className="rounded-2xl bg-white p-6 shadow-2xl text-left">
             <MotorsSearchForm actionHref="/motors/search" actionLabel="Search Vehicles" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1380px] px-6 py-16 space-y-20">
        
        {/* Quick Links / Categories */}
        <section className="grid gap-6 md:grid-cols-3">
           <Link href="/motors/search?vehicleType=suv" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🚙</div>
             <h3 className="mt-5 text-lg font-bold text-ink">SUVs & Family Cars</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Find spacious and reliable SUVs perfect for family trips across the UAE.</p>
           </Link>
           <Link href="/motors/search?vehicleType=sedan" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🏎️</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Sedans & Coupes</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Discover sleek city cars, daily drivers, and premium sports cars.</p>
           </Link>
           <Link href="/motors/search?vehicleType=commercial" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🚚</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Commercial Vehicles</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Explore vans, trucks, and heavy-duty vehicles for your business needs.</p>
           </Link>
        </section>

        {/* Featured Motors Grid */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Featured Vehicles</h2>
              <p className="mt-2 text-[var(--text-secondary)]">Premium dealer-backed stock and verified sellers</p>
            </div>
            <Link href="/motors/search" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              View all inventory &rarr;
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
                    <span className="flex items-center gap-1">⏱️ {result.year}</span>
                    <span className="flex items-center gap-1">🛣️ {result.mileage}</span>
                    <span className="flex items-center gap-1">🚗 {result.vehicleType}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between rounded-[0.85rem] bg-[var(--surface-alt)] p-3">
                     <div className="flex items-center gap-2">
                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs">🏢</div>
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
