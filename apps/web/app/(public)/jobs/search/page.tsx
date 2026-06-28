import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionPage } from '../../../../components/section-page';
import { JobsSearchConsole, JobsSectionHeading, JobsTrustPanel } from '../../../../components/jobs/jobs-discovery';
import { jobsSearchFields, jobsQuickFilters } from '../../../../lib/jobs/public-content';
import { parseJobsSearchParams, searchJobsListings } from '../../../../lib/search/jobs';

interface JobsSearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: JobsSearchPageProps): Promise<Metadata> {
  const params = parseJobsSearchParams(await searchParams);
  const title = params.keyword ? `Jobs matching "${params.keyword}" | GulfBuddy` : 'Job Search | GulfBuddy';
  return {
    title,
    description: 'Find verified corporate and executive roles across the UAE.'
  };
}

export default async function JobsSearchPage({ searchParams }: JobsSearchPageProps) {
  const params = parseJobsSearchParams(await searchParams);
  const results = searchJobsListings(params);

  return (
    <SectionPage
      eyebrow="Job Search"
      title="Verified UAE Careers"
      description="Connect with top employers offering transparent salaries and verified corporate roles."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Career guide</p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Apply smart</p>
              <p className="mt-2 text-sm font-semibold text-ink">Use the filters to find roles that match your exact seniority and category.</p>
            </div>
          </div>
        </div>
      }
    >
      <JobsSearchConsole
        fields={jobsSearchFields}
        filters={jobsQuickFilters}
        actionHref="/jobs/search"
        actionLabel="Update search"
      />

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5">
          <JobsSectionHeading
            eyebrow="Open Roles"
            title={`${results.length} jobs matching your criteria`}
            description="Verified employers are prioritized. Keep your profile updated for a better apply flow."
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
                          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{result.salaryLabel}</p>
                        </div>
                        <div className="rounded-[1.1rem] border border-white/20 bg-black/40 backdrop-blur-md px-3 py-3 text-right">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Type</p>
                          <p className="mt-1 text-sm font-semibold text-white">{result.employmentType}</p>
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
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Seniority</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{result.seniorityLevel}</p>
                      </div>
                      <div className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Posted</p>
                        <p className="mt-1 text-sm font-semibold text-ink">Just now</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Employer</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--jobs-accent)]">{result.employerName}</p>
                      </div>
                      <Link href={result.routeHref} className="gh-button-secondary">
                        View job
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gh-card p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">No roles found</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">We couldn't find matches for this search.</h2>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <JobsTrustPanel
            title="Clean hiring discovery."
            description="Our platform ensures clear employer branding and accurate role facts before you apply."
            signals={[
              'Verified employer network',
              'Transparent salary ranges',
              'Direct application flow'
            ]}
          />
        </aside>
      </div>
    </SectionPage>
  );
}
