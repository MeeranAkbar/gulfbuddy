import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionPage } from '../../../../components/section-page';
import { MotorsSearchConsole, MotorsSectionHeading, MotorsTrustPanel } from '../../../../components/motors/motors-discovery';
import { motorsSearchFields, motorsQuickFilters } from '../../../../lib/motors/public-content';
import { parseMotorsSearchParams, searchMotorsListings } from '../../../../lib/search/motors';

interface MotorsSearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: MotorsSearchPageProps): Promise<Metadata> {
  const params = parseMotorsSearchParams(await searchParams);
  const title = params.keyword ? `Search results for "${params.keyword}" | Motors` : 'Motors Search | GulfBuddy';
  return {
    title,
    description: 'Find cars, SUVs, and commercial vehicles across the UAE with cleaner dealer branding.'
  };
}

export default async function MotorsSearchPage({ searchParams }: MotorsSearchPageProps) {
  const params = parseMotorsSearchParams(await searchParams);
  const results = searchMotorsListings(params);

  return (
    <SectionPage
      eyebrow="Motors Search"
      title="Motors Inventory"
      description="Dealer-verified and private listings mapped for clean discovery."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Search guide</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Best use</p>
              <p className="mt-2 text-sm font-semibold text-ink">Filter by make, model, and year for the most accurate results.</p>
            </div>
          </div>
        </div>
      }
    >
      <MotorsSearchConsole
        fields={motorsSearchFields}
        filters={motorsQuickFilters}
        actionHref="/motors/search"
        actionLabel="Update search"
      />

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          <MotorsSectionHeading
            eyebrow="Ranked results"
            title={`${results.length} vehicles matching your search`}
            description="Results are ordered by relevance, with premium placements highlighting top-tier agency listings."
          />

          {results.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {results.map((result) => (
                <article key={result.id} className="gh-card overflow-hidden">
                  <div className="relative min-h-[14rem] overflow-hidden p-5">
                    {result.imageUrl && (
                      <>
                        <img src={result.imageUrl} alt={result.title} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.2),rgba(7,12,24,0.85))]" />
                      </>
                    )}
                    {!result.imageUrl && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.18),transparent_42%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
                    )}
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        {result.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/90"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="mt-8 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                            {result.location}
                          </p>
                          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{result.priceLabel}</p>
                        </div>
                        <div className="rounded-[1.1rem] border border-white/20 bg-black/40 backdrop-blur-md px-3 py-3 text-right">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Seller</p>
                          <p className="mt-1 text-sm font-semibold text-white">{result.sellerType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{result.vehicleType}</p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">{result.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{result.summary}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Year</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{result.year}</p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Mileage</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{result.mileage}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Dealer</p>
                        <p className="mt-2 text-sm font-semibold text-ink">{result.sellerName}</p>
                      </div>
                      <Link href={result.routeHref} className="gh-button-secondary">
                        View vehicle
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gh-card p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">No results</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">We couldn't find matches for this search.</h2>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <MotorsTrustPanel
            title="Clean vehicle discovery."
            description="Our platform ensures clear dealer branding and accurate vehicle facts before you make contact."
            signals={[
              'Verified dealer network',
              'Transparent pricing and specs',
              'Direct connection with sellers'
            ]}
          />
        </aside>
      </div>
    </SectionPage>
  );
}
