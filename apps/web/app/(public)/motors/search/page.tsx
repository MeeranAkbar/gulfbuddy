import type { Metadata } from 'next';
import Link from 'next/link';
import { MotorsSearchForm } from '../../../../components/search/motors-search-form';
import { MotorsTrustPanel } from '../../../../components/motors/motors-discovery';
import { parseMotorsSearchParams, searchMotorsListings } from '../../../../lib/search/motors';

export const dynamic = 'force-dynamic';

interface MotorsSearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: MotorsSearchPageProps): Promise<Metadata> {
  const params = parseMotorsSearchParams(await searchParams);
  const title = params.keyword ? `Search results for "${params.keyword}" | Motors` : 'Motors Search | GulfHabibi';
  return {
    title,
    description: 'Find verified cars, SUVs, and commercial vehicles across the UAE.'
  };
}

export default async function MotorsSearchPage({ searchParams }: MotorsSearchPageProps) {
  const params = parseMotorsSearchParams(await searchParams);
  const results = searchMotorsListings(params);

  return (
    <div className="space-y-6 pt-6">
      {/* Search Console */}
      <div className="gh-card p-5">
        <MotorsSearchForm actionHref="/motors/search" actionLabel="Update search" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        <section className="space-y-5">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-ink md:text-[2rem]">{results.length} vehicles found</h2>
            <p className="text-sm leading-7 text-[var(--text-secondary)] md:text-base">Premium verified inventory.</p>
          </div>

          {results.length ? (
            <div className="flex flex-col gap-4">
              {results.map((result, index) => (
                <div key={result.id}>
                  {index === 2 && (
                    <div className="mb-4 rounded-[1rem] bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-ink">Need a car loan?</h3>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Get pre-approved for auto finance with our trusted banking partners.</p>
                      </div>
                      <button className="whitespace-nowrap rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md">
                        Check Eligibility &rarr;
                      </button>
                    </div>
                  )}
                  <article className="gh-card flex flex-col md:flex-row overflow-hidden hover:border-[var(--primary)] transition-colors bg-[var(--surface)]">
                    <div className="relative h-60 md:h-auto md:w-[320px] shrink-0 overflow-hidden">
                      {result.imageUrl && (
                        <>
                          <img src={result.imageUrl} alt={result.title} className="absolute inset-0 h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </>
                      )}
                      {!result.imageUrl && (
                        <div className="absolute inset-0 bg-[var(--surface-muted)]" />
                      )}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {result.badges.slice(0, 2).map((badge) => (
                          <span
                            key={badge}
                            className="rounded-[0.25rem] bg-white px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.05em] text-black shadow-sm"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="rounded-full bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          📷 8
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-bold text-[var(--primary)]">{result.priceLabel}</p>
                          <p className="mt-1 text-xs font-medium text-[var(--text-secondary)]">{result.vehicleType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">Seller</p>
                          <p className="mt-0.5 text-xs font-bold text-ink">{result.sellerType}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex-1">
                        <Link href={result.routeHref} className="group-hover:text-[var(--primary)] text-lg font-bold text-ink transition-colors line-clamp-1">
                          {result.title}
                        </Link>
                        <p className="mt-2 text-sm text-[var(--text-secondary)] flex items-center gap-1">
                          📍 {result.location}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
                        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-1.5">
                           <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Year</p>
                           <p className="mt-0.5 text-xs font-bold text-ink">{result.year}</p>
                        </div>
                        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-1.5">
                           <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Mileage</p>
                           <p className="mt-0.5 text-xs font-bold text-ink">{result.mileage}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-bold text-ink">
                             {result.sellerName.charAt(0)}
                           </div>
                           <span className="text-xs font-semibold text-ink">{result.sellerName}</span>
                         </div>
                         <div className="flex gap-2">
                           <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-ink transition-colors">
                             ❤️
                           </button>
                           <button className="flex h-9 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-bold text-white transition-colors hover:opacity-90">
                             Contact
                           </button>
                         </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div className="gh-card p-6 md:p-7 bg-[var(--surface)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">No results</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">We couldn't find matches for this search.</h2>
            </div>
          )}
        </section>

        <aside className="space-y-6 hidden xl:block">
           <MotorsTrustPanel
            title="Verified Network"
            description="We partner directly with leading agencies and certified dealers."
            signals={[
              'Certified Dealers',
              'Verified VIN History',
              'Secure Contact'
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
