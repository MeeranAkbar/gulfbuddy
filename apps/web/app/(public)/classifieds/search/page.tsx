import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionPage } from '../../../../components/section-page';
import { ClassifiedsSearchConsole, ClassifiedsSectionHeading, ClassifiedsTrustPanel } from '../../../../components/classifieds/classifieds-discovery';
import { classifiedsSearchFields, classifiedsQuickFilters } from '../../../../lib/classifieds/public-content';
import { parseClassifiedsSearchParams, searchClassifiedsListings } from '../../../../lib/search/classifieds';

interface ClassifiedsSearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: ClassifiedsSearchPageProps): Promise<Metadata> {
  const params = parseClassifiedsSearchParams(await searchParams);
  const title = params.keyword ? `Items matching "${params.keyword}" | GulfBuddy` : 'Classifieds | GulfBuddy';
  return {
    title,
    description: 'Buy and sell pre-loved items securely across the UAE.'
  };
}

export default async function ClassifiedsSearchPage({ searchParams }: ClassifiedsSearchPageProps) {
  const params = parseClassifiedsSearchParams(await searchParams);
  const results = searchClassifiedsListings(params);

  return (
    <SectionPage
      eyebrow="Classifieds Search"
      title="Secure Local Resale"
      description="Connect with verified buyers and sellers in your community."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Buying guide</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Stay safe</p>
              <p className="mt-2 text-sm font-semibold text-ink">Always meet in public places and never transfer money before inspecting the item.</p>
            </div>
          </div>
        </div>
      }
    >
      <ClassifiedsSearchConsole
        fields={classifiedsSearchFields}
        filters={classifiedsQuickFilters}
        actionHref="/classifieds/search"
        actionLabel="Update search"
      />

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          <ClassifiedsSectionHeading
            eyebrow="Listed items"
            title={`${results.length} items in your area`}
            description="Verified sellers and items with clear photos are prioritized."
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
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_42%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
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
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Condition</p>
                          <p className="mt-1 text-sm font-semibold text-white">{result.condition}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{result.category}</p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">{result.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{result.summary}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Posted</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{result.postedAt}</p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Delivery</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--classifieds-accent)]">Available</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Seller</p>
                        <p className="mt-2 text-sm font-semibold text-ink">{result.sellerName}</p>
                      </div>
                      <Link href={result.routeHref} className="gh-button-secondary">
                        View item
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gh-card p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">No items found</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">We couldn't find matches for this search.</h2>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <ClassifiedsTrustPanel
            title="Safe local resale."
            description="Our platform ensures clear item conditions and verified seller accounts before you meet."
            signals={[
              'Verified seller identities',
              'Clear condition reporting',
              'Secure chat system'
            ]}
          />
        </aside>
      </div>
    </SectionPage>
  );
}
