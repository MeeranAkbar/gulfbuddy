import Link from 'next/link';
import { getAdminJobsOpsSnapshot } from '../../../../lib/jobs/admin-queries';

function formatLabel(value: string) {
  return value.replace(/_/g, ' ');
}

export default async function AdminJobsPage() {
  const snapshot = await getAdminJobsOpsSnapshot();

  return (
    <section className="space-y-6">
      <section className="gh-hero p-8 md:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl space-y-4">
            <p className="gh-pill">Jobs Ops</p>
            <div className="space-y-3">
              <h2 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                Employer trust, publishing control, and applicant flow should sit in one calm hiring console.
              </h2>
              <p className="max-w-3xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">
                Jobs operations should help the team understand which employers feel verified, which roles need review, and where application demand is actually landing.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/listings" className="gh-button-primary">
              Listings ops
            </Link>
            <Link href="/admin/leads" className="gh-button-secondary">
              Lead ops
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Live jobs</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.liveJobs}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{snapshot.totalJobs} total job listings tracked in the ops read model.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Review queue</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.reviewJobs}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Roles still waiting for auto-check or moderation attention.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Verified employers</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.verifiedEmployers}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Employer trust remains one of the biggest quality levers in Jobs.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Applications logged</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{snapshot.totalApplications}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{snapshot.urgentJobs} urgent-hiring roles are active in the current read model.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Latest roles</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Recent hiring inventory</h3>
            </div>
            <Link href="/admin/listings" className="gh-button-secondary">
              Open listings
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {snapshot.recentRoles.length ? (
              snapshot.recentRoles.map((role) => (
                <article key={role.id} className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="gh-pill">{role.publication_state}</span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {role.risk_state} risk
                    </span>
                    {role.urgent_hiring ? (
                      <span className="rounded-full border border-[var(--warning)]/30 bg-[color:color-mix(in_srgb,var(--warning)_12%,transparent)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                        urgent hiring
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-ink">{role.title}</p>
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      {role.company_name || 'Employer profile not linked'} · {role.emirate}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      ['Employment', role.employment_type || 'Not set'],
                      ['Work mode', role.work_mode || 'Not set'],
                      ['Applications', role.applications_count.toString()]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                        <p className="mt-2 text-sm font-medium text-ink">{value}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-5 text-sm leading-7 text-[var(--text-secondary)]">
                Jobs ops will become richer once the staging database has employer and application activity flowing through it.
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Employer verification posture</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">How much of the employer base feels trustworthy</h3>
            <div className="mt-5 space-y-3">
              {snapshot.employerVerificationMetrics.length ? (
                snapshot.employerVerificationMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold capitalize text-ink">{formatLabel(metric.label)}</p>
                      <span className="text-sm font-semibold text-ink">{metric.total}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                  No employer verification rows are visible yet.
                </div>
              )}
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Application flow</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">Where candidates are sitting in the funnel</h3>
            <div className="mt-5 space-y-3">
              {snapshot.applicationStatusMetrics.length ? (
                snapshot.applicationStatusMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold capitalize text-ink">{formatLabel(metric.label)}</p>
                      <span className="text-sm font-semibold text-ink">{metric.total}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                  No job applications are visible yet in the current snapshot.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
