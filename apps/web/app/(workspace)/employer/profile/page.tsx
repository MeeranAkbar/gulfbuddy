import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getEmployerProfileSummaries } from '../../../../lib/workspace/profile-queries';
import { formatLabel } from '../../../../lib/workspace/formatters';

export default async function EmployerProfilePage() {
  const profiles = await getEmployerProfileSummaries();
  const verifiedCount = profiles.filter((item) => item.verificationStatus === 'verified').length;
  const publicCount = profiles.filter((item) => item.publicProfileEnabled).length;
  const activeHiring = profiles.filter((item) => item.hiringStatus === 'active').length;

  return (
    <WorkspacePage
      eyebrow="Employer profile"
      title="Manage the employer brand object that sits underneath every job and applicant flow."
      description="Employer identity should be visible and controlled before hiring volume scales. This lane should connect verification, public hiring posture, response quality, and team readiness from one calmer place."
      actions={[
        { href: '/employer/jobs', label: 'Open jobs' },
        { href: '/employer', label: 'Back to employer hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Employer brands',
          value: String(profiles.length),
          hint: 'Each company should behave like a real hiring object, not just a job owner id.'
        },
        {
          label: 'Verified employers',
          value: String(verifiedCount),
          hint: 'Verification-backed employer identity improves candidate trust and moderation confidence.'
        },
        {
          label: 'Public employer pages',
          value: String(publicCount),
          hint: 'A stronger public employer layer improves both trust and organic hiring discovery.'
        },
        {
          label: 'Actively hiring',
          value: String(activeHiring),
          hint: 'This highlights which employer brands are truly live and candidate-facing.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {profiles.length ? (
            profiles.map((profile) => (
              <article key={profile.companyId} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="gh-pill">{formatLabel(profile.verificationStatus)}</span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {profile.publicProfileEnabled ? 'Public employer page on' : 'Profile private'}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{profile.displayName}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          Hiring status {formatLabel(profile.hiringStatus)} / {profile.activeJobCount} live jobs / {profile.reviewJobCount} in review
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Profile strength</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{profile.profileStrengthScore}</p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Response score {profile.responseTimeScore ?? 'Not set'} / Branches {profile.branchCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Hiring email</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{profile.hiringEmail || 'Not set'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Hiring phone</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{profile.hiringPhone || 'Not set'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Active seats</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{profile.activeSeatCount}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending invites</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{profile.pendingInviteCount}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No employer company profile yet. This lane is ready once the employer company object starts driving real job inventory on staging.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Employer identity is what separates a serious hiring platform from a simple vacancy board.</p>
              <p>This page should make it obvious whether the employer is verified, public-facing, and ready for higher-quality candidate trust.</p>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Signals to improve</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Good hiring pages should combine active jobs, recruiter accessibility, public credibility, and strong response posture.</p>
              <p>This is the employer-side equivalent of a trust badge system for candidates deciding whether to apply.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
