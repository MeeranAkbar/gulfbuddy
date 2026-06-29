import type { Metadata } from 'next';
import Link from 'next/link';
import { JobsSearchForm } from '../../../components/search/jobs-search-form';
import { searchJobsListings } from '../../../lib/search/jobs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'UAE Jobs Platform | GulfHabibi',
  description: 'Search premium jobs and verified employers across the UAE.'
};

export default async function JobsPage() {
  // Fetch premium featured listings to show on the landing page
  const featuredListings = searchJobsListings({ 
    keyword: '', location: '', category: '', employmentType: '', experienceLevel: '' 
  }).slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Massive Hero Section */}
      <section className="relative flex min-h-[500px] flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80" 
            alt="UAE Jobs" 
            className="h-full w-full object-cover brightness-[0.5]" 
          />
        </div>
        
        <div className="relative z-10 w-full max-w-[1000px] text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
            Find Your Next Career Move
          </h1>
          <p className="mb-10 text-lg text-white/90 drop-shadow">
            Search thousands of top-tier jobs from verified employers across the UAE.
          </p>
          
          <div className="rounded-2xl bg-white p-6 shadow-2xl text-left">
             <JobsSearchForm actionHref="/jobs/search" actionLabel="Search Jobs" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1380px] px-6 py-16 space-y-20">
        
        {/* Quick Links / Categories */}
        <section className="grid gap-6 md:grid-cols-3">
           <Link href="/jobs/search?category=Technology" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">💻</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Technology & IT</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Software engineering, data science, and IT infrastructure roles.</p>
           </Link>
           <Link href="/jobs/search?category=Marketing" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">📈</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Marketing & Sales</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Digital marketing, business development, and enterprise sales.</p>
           </Link>
           <Link href="/jobs/search?category=Real Estate" className="gh-card group flex flex-col items-center justify-center p-8 text-center transition hover:border-[var(--primary)] hover:shadow-md">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl transition group-hover:scale-110 group-hover:bg-[var(--accent-soft)]">🏢</div>
             <h3 className="mt-5 text-lg font-bold text-ink">Real Estate</h3>
             <p className="mt-2 text-sm text-[var(--text-secondary)]">Property management, brokerage, and real estate investment.</p>
           </Link>
        </section>

        {/* Featured Jobs Grid */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Latest Premium Jobs</h2>
              <p className="mt-2 text-[var(--text-secondary)]">Actively hiring roles from verified top employers</p>
            </div>
            <Link href="/jobs/search" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              View all jobs &rarr;
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredListings.map((result) => (
              <Link key={result.id} href={result.routeHref} className="gh-card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between">
                     <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-xl font-bold text-[var(--primary)]">
                       {result.employerName.charAt(0)}
                     </div>
                     <span className="rounded-[0.25rem] bg-[var(--primary-soft)] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--primary)]">
                       {result.employmentType}
                     </span>
                  </div>
                  
                  <h3 className="mt-4 line-clamp-2 font-semibold text-ink group-hover:text-[var(--primary)] transition-colors">{result.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{result.employerName}</p>
                  
                  <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4 text-xs font-medium text-[var(--text-secondary)]">
                    <span className="flex items-center gap-2">📍 {result.location}</span>
                    <span className="flex items-center gap-2">💰 {result.salaryLabel}</span>
                    <span className="flex items-center gap-2">🎓 {result.experienceLevel}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {result.badges.map(b => (
                      <span key={b} className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-2 py-1 text-[0.65rem] font-semibold text-ink">{b}</span>
                    ))}
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
