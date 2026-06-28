import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCandidateAppliedJobs } from '../../../../lib/workspace/detail-queries';
import { formatDate, formatLabel, formatMoneyRange } from '../../../../lib/workspace/formatters';

function statusTone(status: string) {
  switch (status) {
    case 'shortlisted':
    case 'contacted':
    case 'interviewing':
    case 'offered':
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
    case 'rejected':
    case 'withdrawn':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    default:
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
  }
}

export default async function CandidateAppliedJobsPage() {
  const applications = await getCandidateAppliedJobs();
  const activeStatuses = new Set(['submitted', 'in_review', 'shortlisted', 'contacted', 'interviewing', 'offered']);
  const activeCount = applications.filter((item) => activeStatuses.has(item.applicationStatus)).length;
  const shortlistedCount = applications.filter((item) =>
    ['shortlisted', 'contacted', 'interviewing', 'offered'].includes(item.applicationStatus)
  ).length;
  const archivedCount = applications.filter((item) => item.archived).length;

  return (
    <WorkspacePage
      eyebrow="Applied jobs"
      title="Track your real application pipeline with enough context to decide the next move."
      description="This lane should feel like a premium hiring pipeline instead of a dead activity list. Candidates should always understand which roles are active, which employers responded, and where archived history begins."
      actions={[
        { href: '/candidate/job-alerts', label: 'Job alerts' },
        { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Applications',
          value: String(applications.length),
          hint: 'Every application stays visible as a real pipeline object, not a one-time submit event.'
        },
        {
          label: 'Active pipeline',
          value: String(activeCount),
          hint: 'Roles still moving through review, shortlist, contact, or interview posture.'
        },
        {
          label: 'Shortlist pressure',
          value: String(shortlistedCount),
          hint: 'Applications already showing stronger employer engagement.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {applications.length ? (
            applications.map((application) => (
              <article key={application.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${statusTone(application.applicationStatus)}`}>
                          {formatLabel(application.applicationStatus)}
                        </span>
                        {application.employerVerificationStatus ? (
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {formatLabel(application.employerVerificationStatus)} employer
                          </span>
                        ) : null}
                        {application.urgentHiring ? (
                          <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                            Urgent hiring
                          </span>
                        ) : null}
                        {application.archived ? (
                          <span className="rounded-full border border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--warning)]">
                            Archived
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{application.jobTitle}</h2>
                        <p className="mt-2 text-sm font-semibold text-ink">{application.companyName}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {[application.emirate, application.area, application.workMode && formatLabel(application.workMode)].filter(Boolean).join(' / ')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Compensation posture</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                        {formatMoneyRange({
                          min: application.salaryMin,
                          max: application.salaryMax,
                          currency: application.salaryCurrency,
                          period: application.salaryPeriod
                        })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Applied {formatDate(application.appliedAt)}{application.validThrough ? ` • Valid through ${formatDate(application.validThrough)}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Employment</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatLabel(application.employmentType)}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Experience</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatLabel(application.experienceLevel, 'Not specified')}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">CV asset</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{application.cvFileName || 'No CV linked'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Last updated</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatDate(application.lastUpdatedAt)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-6 py-5">
                  {application.jobSlug ? (
                    <Link href={`/jobs/${application.jobSlug}`} className="gh-button-primary">
                      View job page
                    </Link>
                  ) : null}
                  {application.companySlug ? (
                    <Link href={`/jobs/company/${application.companySlug}`} className="gh-button-secondary">
                      Employer page
                    </Link>
                  ) : null}
                  {application.source ? (
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Source {formatLabel(application.source)}
                    </span>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No applications yet. This lane is ready to become your calmer career pipeline as soon as you start applying through the Jobs module.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Pipeline posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Live opportunities</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Applications still worth watching closely.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Archived records</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{archivedCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Jobs that are no longer public but still belong in your application history.</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Candidates come back when the platform helps them manage uncertainty after the apply moment, not just before it.</p>
              <p>This page should always feel calmer and more structured than a generic job-board activity list.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
