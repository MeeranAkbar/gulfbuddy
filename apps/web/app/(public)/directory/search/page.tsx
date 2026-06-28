import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionPage } from '../../../../components/section-page';
import { DirectorySearchConsole, DirectorySectionHeading, DirectoryTrustPanel } from '../../../../components/directory/directory-discovery';
import { directorySearchFields, directoryQuickFilters } from '../../../../lib/directory/public-content';
import { parseDirectorySearchParams, searchDirectoryListings } from '../../../../lib/search/directory';

interface DirectorySearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: DirectorySearchPageProps): Promise<Metadata> {
  const params = parseDirectorySearchParams(await searchParams);
  const title = params.keyword ? `Businesses matching "${params.keyword}" | GulfBuddy` : 'Business Directory | GulfBuddy';
  return {
    title,
    description: 'Find verified businesses, corporate services, and local storefronts across the UAE.'
  };
}

export default async function DirectorySearchPage({ searchParams }: DirectorySearchPageProps) {
  const params = parseDirectorySearchParams(await searchParams);
  const results = searchDirectoryListings(params);

  return (
    <SectionPage
      eyebrow="Directory Search"
      title="Verified Business Discovery"
      description="Connect with trusted local companies, corporate services, and storefronts."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Search guide</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Best use</p>
              <p className="mt-2 text-sm font-semibold text-ink">Search by company name, category, or business district for the best results.</p>
            </div>
          </div>
        </div>
      }
    >
      <DirectorySearchConsole
        fields={directorySearchFields}
        filters={directoryQuickFilters}
        actionHref="/directory/search"
        actionLabel="Update search"
      />

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          <DirectorySectionHeading
            eyebrow="Ranked results"
            title={`${results.length} businesses matching your criteria`}
            description="Verified businesses with active licenses and strong reviews are prioritized."
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
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_42%),linear-gradient(135deg,var(--surface-alt),var(--surface))]" />
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
                          <p className="mt-2 text-xl font-semibold tracking-tight text-white">{result.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{result.category}</p>
                    <h2 className="mt-3 text-lg font-semibold tracking-tight text-ink">{result.ratingLabel}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{result.summary}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Status</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{result.businessType}</p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">History</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{result.yearsActive}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-4">
                      <Link href={result.routeHref} className="gh-button-secondary">
                        View profile
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gh-card p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">No businesses found</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">We couldn't find matches for this business.</h2>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <DirectoryTrustPanel
            title="Verified business discovery."
            description="We verify commercial licenses to ensure you're connecting with legitimate companies."
            signals={[
              'Commercial license verification',
              'Business history checks',
              'Customer reviews'
            ]}
          />
        </aside>
      </div>
    </SectionPage>
  );
}
