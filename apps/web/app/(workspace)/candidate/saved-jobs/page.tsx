import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCandidateSavedJobs } from '../../../../lib/workspace/detail-queries';
import { formatDate, formatLabel, formatMoneyRange } from '../../../../lib/workspace/formatters';

export default async function CandidateSavedJobsPage() {
  const savedJobs = await getCandidateSavedJobs();
  const urgentCount = savedJobs.filter((item) => item.urgentHiring).length;
  const verifiedEmployers = savedJobs.filter((item) => item.employerVerificationStatus === 'verified').length;
  const remoteFriendly = savedJobs.filter((item) => ['remote', 'hybrid'].includes(item.workMode)).length;

  return (
    <WorkspacePage
      eyebrow="Saved jobs"
      title="Keep promising roles in a shortlist that still feels actionable when you return."
      description="Saved jobs should help candidates compare roles, remember employer quality, and move from passive interest into confident application behavior without becoming a forgotten bookmark dump."
      actions={[
        { href: '/candidate/job-alerts', label: 'Open alerts' },
        { href: '/jobs', label: 'Explore jobs', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Saved roles',
          value: String(savedJobs.length),
          hint: 'A real shortlist should stay easy to scan by employer, freshness, and work fit.'
        },
        {
          label: 'Urgent hiring',
          value: String(urgentCount),
          hint: 'High-intent roles already asking for faster candidate action.'
        },
        {
          label: 'Remote or hybrid',
          value: String(remoteFriendly),
          hint: 'Saved jobs should support quick comparison around work-mode preference too.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {savedJobs.length ? (
            savedJobs.map((job) => (
              <article key={job.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.12),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatLabel(job.employmentType)}
                        </span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatLabel(job.workMode)}
                        </span>
                        {job.employerVerificationStatus ? (
                          <span className="rounded-full border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--success)]">
                            {formatLabel(job.employerVerificationStatus)} employer
                          </span>
                        ) : null}
                        {job.urgentHiring ? (
                          <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                            Urgent hiring
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{job.jobTitle}</h2>
                        <p className="mt-2 text-sm font-semibold text-ink">{job.companyName}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {[job.emirate, job.area, job.experienceLevel && formatLabel(job.experienceLevel)].filter(Boolean).join(' / ')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Compensation posture</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatMoneyRange({
                          min: job.salaryMin,
                          max: job.salaryMax,
                          currency: job.salaryCurrency,
                          period: job.salaryPeriod
                        })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Saved {formatDate(job.savedAt)}{job.validThrough ? ` • Valid through ${formatDate(job.validThrough)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-6 py-5">
                  <Link href={`/jobs/${job.jobSlug}`} className="gh-button-primary">
                    View job
                  </Link>
                  {job.companySlug ? (
                    <Link href={`/jobs/company/${job.companySlug}`} className="gh-button-secondary">
                      Employer page
                    </Link>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No saved jobs yet. Once you start shortlisting roles, this page is ready to become a clean compare-and-decide lane.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Shortlist posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Verified employers</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{verifiedEmployers}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Saved roles already backed by stronger employer identity.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Decision momentum</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{savedJobs.length ? 'Active' : 'Waiting'}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Use this lane to decide whether to apply, archive, or create a better alert.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Saved jobs are one of the lightest but most important return loops in the whole Jobs product.</p>
              <p>If this page feels strong, candidates come back with intent instead of starting discovery from zero every time.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
