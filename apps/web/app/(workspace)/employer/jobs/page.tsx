import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getEmployerJobs } from '../../../../lib/workspace/detail-queries';
import { formatDate, formatLabel, formatMoneyRange } from '../../../../lib/workspace/formatters';

function publicationTone(state: string) {
  switch (state) {
    case 'published':
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
    case 'approved':
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
    case 'rejected':
    case 'suspended':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    default:
      return 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]';
  }
}

function riskTone(state: string) {
  switch (state) {
    case 'blocked':
    case 'high':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    case 'medium':
    case 'low':
      return 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]';
    default:
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
  }
}

export default async function EmployerJobsPage() {
  const jobs = await getEmployerJobs();
  const publishedCount = jobs.filter((job) => job.publicationState === 'published').length;
  const reviewLoad = jobs.filter((job) => ['submitted', 'auto_checked', 'flagged', 'pending_review'].includes(job.publicationState)).length;
  const applicantVolume = jobs.reduce((total, job) => total + job.applicantCount, 0);

  return (
    <WorkspacePage
      eyebrow="Employer jobs"
      title="Manage role inventory with enough context to act before applicant momentum drops."
      description="Employers should be able to see publication posture, risk state, role quality, and applicant load from one calmer hiring console instead of jumping between disconnected ATS-style screens."
      actions={[
        { href: '/company', label: 'Company hub' },
        { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Managed jobs',
          value: String(jobs.length),
          hint: 'Every role should remain visible as part of the company hiring system, not just as a public card.'
        },
        {
          label: 'Published jobs',
          value: String(publishedCount),
          hint: 'Live roles currently carrying the employer brand into the public marketplace.'
        },
        {
          label: 'Applicant volume',
          value: String(applicantVolume),
          hint: 'Candidate inflow should stay legible enough for quick hiring follow-through.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {jobs.length ? (
            jobs.map((job) => (
              <article key={job.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${publicationTone(job.publicationState)}`}>
                          {formatLabel(job.publicationState)}
                        </span>
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${riskTone(job.riskState)}`}>
                          {formatLabel(job.riskState)} risk
                        </span>
                        {job.urgentHiring ? (
                          <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                            Urgent hiring
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{job.jobTitle}</h2>
                        <p className="mt-2 text-sm font-semibold text-ink">{job.title}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {[job.emirate, job.area, formatLabel(job.workMode), formatLabel(job.experienceLevel, 'Not specified')].filter(Boolean).join(' / ')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Salary posture</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatMoneyRange({
                          min: job.salaryMin,
                          max: job.salaryMax,
                          currency: job.salaryCurrency,
                          period: job.salaryPeriod
                        })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Updated {formatDate(job.updatedAt)}{job.validThrough ? ` • Valid through ${formatDate(job.validThrough)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Applicants</p>
                    <p className="mt-2 text-xl font-semibold text-ink">{job.applicantCount}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Active pipeline</p>
                    <p className="mt-2 text-xl font-semibold text-ink">{job.activeApplicantCount}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Shortlisted</p>
                    <p className="mt-2 text-xl font-semibold text-ink">{job.shortlistCount}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Rejected</p>
                    <p className="mt-2 text-xl font-semibold text-ink">{job.rejectedCount}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-6 py-5">
                  <Link href="/employer/applicants" className="gh-button-primary">
                    Review applicants
                  </Link>
                  <Link href={`/jobs/${job.slug}`} className="gh-button-secondary">
                    Public job page
                  </Link>
                  {job.publishedAt ? (
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Published {formatDate(job.publishedAt)}
                    </span>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No job inventory yet. This page is ready to become the calmer hiring console as soon as employer posting moves onto the new platform workflow.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Hiring posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Review load</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{reviewLoad}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Roles still waiting for review, approval, or stronger moderation confidence.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Live roles</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{publishedCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Jobs currently carrying the employer brand into public discovery.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Employers need to see which roles are ready, risky, or lagging before applicant momentum fades.</p>
              <p>This page should feel operationally calm enough for daily hiring use without becoming a generic enterprise grid.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
