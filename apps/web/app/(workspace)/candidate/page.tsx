import Link from 'next/link';
import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getCandidateWorkspaceOverview } from '../../../lib/workspace/overview-queries';

function formatVisibility(value: string | null) {
  if (!value) return 'Not configured';
  return value.replace(/_/g, ' ');
}

export default async function CandidateWorkspacePage() {
  const overview = await getCandidateWorkspaceOverview();

  return (
    <WorkspacePage
      eyebrow="Candidate workspace"
      title="Manage your hiring posture with one calmer candidate workspace."
      description="The candidate side should help users understand profile strength, live applications, saved roles, and alert momentum without feeling like a generic account page."
      actions={[
        { href: '/candidate/profile', label: 'Open profile' },
        { href: '/jobs', label: 'Explore jobs', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Profile strength',
          value: String(overview?.profileStrengthScore || 0),
          hint: 'A stronger profile improves both trust and future employer discovery.'
        },
        {
          label: 'Active applications',
          value: String(overview?.activeApplicationCount || 0),
          hint: 'Roles still moving through review, shortlist, or interview stages.'
        },
        {
          label: 'Saved jobs + alerts',
          value: `${overview?.savedJobCount || 0} / ${overview?.activeAlertCount || 0}`,
          hint: 'Keep job search momentum alive between public browsing sessions.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Visibility</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{formatVisibility(overview?.profileVisibility || null)}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Candidates should understand exactly how visible they are to employers and the wider platform.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">CV assets</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.cvCount || 0}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Keep one clear application-ready CV and grow into role-specific versions later.</p>
            </article>
            <article className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Employer searchability</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{overview?.searchableByEmployers ? 'Open' : 'Private'}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Searchability should feel like a deliberate trust choice, not a hidden toggle.</p>
            </article>
          </div>

          <section className="gh-card p-6 md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Candidate operating lanes</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">The hiring workspace should guide the next move immediately.</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Profile and identity</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Shape the core candidate story, desired role, and visibility posture first.</p>
                <Link href="/candidate/profile" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open profile
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">CV and applications</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Track submissions, live pipeline, and application assets without losing context.</p>
                <Link href="/candidate/applied-jobs" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  View applications
                </Link>
              </article>
              <article className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">Discovery memory</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Saved roles and alerts should give the user a real reason to come back.</p>
                <Link href="/candidate/job-alerts" className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                  Open alerts
                </Link>
              </article>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">All applications</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{overview?.applicationCount || 0}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Saved roles</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{overview?.savedJobCount || 0}</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>A strong candidate hub keeps users coming back even when they are not actively browsing the public jobs pages.</p>
              <p>This is the quiet retention engine for Jobs, and it should always feel calmer and more premium than a generic job-board account.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
