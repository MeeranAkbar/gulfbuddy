import type { Metadata } from 'next';
import Link from 'next/link';
import { JobsSearchForm } from '../../../../components/search/jobs-search-form';
import { JobsTrustPanel } from '../../../../components/jobs/jobs-discovery';
import { parseJobsSearchParams, searchJobsListings } from '../../../../lib/search/jobs';

export const dynamic = 'force-dynamic';

interface JobsSearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: JobsSearchPageProps): Promise<Metadata> {
  const params = parseJobsSearchParams(await searchParams);
  const title = params.keyword ? `Jobs matching "${params.keyword}" | GulfHabibi` : 'Job Search | GulfHabibi';
  return {
    title,
    description: 'Find verified corporate and executive roles across the UAE.'
  };
}

export default async function JobsSearchPage({ searchParams }: JobsSearchPageProps) {
  const params = parseJobsSearchParams(await searchParams);
  const results = searchJobsListings(params);

  return (
    <div className="space-y-6 pt-6">
      {/* Search Console */}
      <div className="gh-card p-5">
        <JobsSearchForm actionHref="/jobs/search" actionLabel="Update search" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        <section className="space-y-5">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-ink md:text-[2rem]">{results.length} jobs found</h2>
            <p className="text-sm leading-7 text-[var(--text-secondary)] md:text-base">Verified roles from top employers.</p>
          </div>

          {results.length ? (
            <div className="flex flex-col gap-4">
              {results.map((result, index) => (
                <div key={result.id}>
                  {index === 2 && (
                    <div className="mb-4 rounded-[1rem] bg-gradient-to-r from-[var(--primary)]/10 to-transparent border border-[var(--primary)]/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-ink">Stand out to employers</h3>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Create a professional profile and let top companies find you.</p>
                      </div>
                      <button className="whitespace-nowrap rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 shadow-md">
                        Build Profile &rarr;
                      </button>
                    </div>
                  )}
                  <article className="gh-card flex flex-col sm:flex-row gap-5 p-5 hover:border-[var(--primary)] transition-colors bg-[var(--surface)]">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-2xl font-bold text-[var(--primary)] shadow-sm">
                      {result.employerName.charAt(0)}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={result.routeHref} className="group-hover:text-[var(--primary)] text-xl font-bold text-ink transition-colors line-clamp-1">
                            {result.title}
                          </Link>
                          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">{result.employerName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="rounded-[0.25rem] bg-[var(--primary-soft)] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--primary)]">
                            {result.employmentType}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">📍 {result.location}</span>
                        <span className="flex items-center gap-1">💰 {result.salaryLabel}</span>
                        <span className="flex items-center gap-1">🎓 {result.experienceLevel}</span>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                        {result.summary}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
                         <div className="flex flex-wrap gap-2">
                           {result.badges.map(b => (
                             <span key={b} className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-2.5 py-1 text-[0.7rem] font-semibold text-ink">{b}</span>
                           ))}
                         </div>
                         <div className="flex gap-2">
                           <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-ink transition-colors">
                             🔖
                           </button>
                           <button className="flex h-9 items-center justify-center rounded-lg bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-black">
                             Easy Apply
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
           <JobsTrustPanel
            title="Verified Employers"
            description="We manually verify all companies hiring on our platform."
            signals={[
              'Identity Checked',
              'Active Trade License',
              'Transparent Salary'
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
