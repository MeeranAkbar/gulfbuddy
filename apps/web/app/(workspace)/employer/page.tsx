import Link from 'next/link';
import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getEmployerWorkspaceOverview } from '../../../lib/workspace/overview-queries';

export default async function EmployerWorkspacePage() {
  const overview = await getEmployerWorkspaceOverview();

  return (
    <WorkspacePage
      eyebrow="Employer workspace"
      title="Run hiring like a premium employer workspace, not a thin company account."
      description="The employer side should make job posture, applicants, shortlist pressure, and hiring trust feel operationally clear from the first screen."
      actions={[
        { href: '/employer/jobs', label: 'Open jobs' },
        { href: '/company', label: 'Company hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Employer companies',
          value: String(overview?.companyCount || 0),
          hint: 'Verified employer identity should sit underneath every hiring flow.'
        },
        {
          label: 'Active jobs',
          value: String(overview?.activeJobCount || 0),
          hint: 'Published or approved jobs currently contributing to public hiring presence.'
        },
        {
          label: 'Applicants + shortlist',
          value: `${overview?.applicantCount || 0} / ${overview?.shortlistCount || 0}`,
          hint: 'Keep candidate flow visible enough for hiring teams to act quickly.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Verified employers</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.verifiedEmployerCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Employer trust should stay visible so the Jobs section feels safer than open job boards.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Draft jobs</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.draftJobCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Roles still in draft or review should never disappear into a blind posting flow.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active seats</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.activeSeatCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Recruiters, managers, and hiring admins should all stay visible inside one seat model.</p>
            </article>
          </div>

          <section className="gh-card p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Hiring operating lanes</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">The workspace should move teams cleanly from employer identity into real hiring execution.</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Jobs and visibility</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Control role posture, draft pressure, and public job visibility from one lane.</p>
                <Link href="/employer/jobs" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open jobs
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Applicants</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Keep candidate review and shortlist motion visible enough for fast follow-through.</p>
                <Link href="/employer/applicants" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Review applicants
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Employer profile</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Strengthen public employer trust and hiring brand before scaling volumes.</p>
                <Link href="/employer/profile" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open employer profile
                </Link>
              </article>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Hiring posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Applicant volume</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{overview?.applicantCount || 0}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Shortlist pressure</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{overview?.shortlistCount || 0}</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Employer trust and applicant handling are what make the Jobs module feel like a serious hiring platform instead of a vacancy board.</p>
              <p>This page should keep hiring teams oriented before they ever need a heavier ATS-style interface.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
