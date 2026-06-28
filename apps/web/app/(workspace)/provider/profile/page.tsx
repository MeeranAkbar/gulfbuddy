import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getProviderProfileSummaries } from '../../../../lib/workspace/profile-queries';
import { formatLabel } from '../../../../lib/workspace/formatters';

export default async function ProviderProfilePage() {
  const profiles = await getProviderProfileSummaries();
  const verifiedCount = profiles.filter((item) => item.verificationStatus === 'verified').length;
  const publicProfiles = profiles.filter((item) => item.publicProfileEnabled).length;
  const acceptingRequests = profiles.filter((item) => item.isAcceptingRequests).length;

  return (
    <WorkspacePage
      eyebrow="Provider profile"
      title="Manage the public service brand object that powers trust, SEO, and request conversion."
      description="Provider identity should feel like a serious marketplace asset. This lane should connect verification, profile quality, service breadth, and public exposure from one calmer workspace surface."
      actions={[
        { href: '/provider/services', label: 'Service catalog' },
        { href: '/provider', label: 'Back to provider hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Provider profiles',
          value: String(profiles.length),
          hint: 'Each provider should behave like a real public trust object, not a hidden config record.'
        },
        {
          label: 'Verified providers',
          value: String(verifiedCount),
          hint: 'Verification-backed providers support stronger trust and better request conversion.'
        },
        {
          label: 'Public profiles',
          value: String(publicProfiles),
          hint: 'Shareable provider pages improve both organic discovery and repeat service behavior.'
        },
        {
          label: 'Accepting requests',
          value: String(acceptingRequests),
          hint: 'This shows how many provider brands are actually open for live marketplace demand.'
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
                          {profile.publicProfileEnabled ? 'Public profile on' : 'Profile private'}
                        </span>
                        {profile.emergencyService ? (
                          <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                            Emergency service
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{profile.displayName}</h2>
                        <p className="mt-2 text-sm font-semibold text-ink">{profile.headline || 'Provider headline not set'}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          {formatLabel(profile.providerType)} / {profile.yearsInBusiness ?? 0} years in business /{' '}
                          {profile.isAcceptingRequests ? 'Accepting requests' : 'Requests paused'}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Profile strength</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{profile.profileStrengthScore}</p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Response score {profile.responseTimeScore ?? 'Not set'} / Trust tier {formatLabel(profile.trustTier)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Service areas</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{profile.serviceAreaCount}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Active offerings</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{profile.activeOfferingCount}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Portfolio items</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{profile.portfolioItemCount}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No provider profile yet. This lane is ready to become your public trust console once service-provider companies start operating through staging.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Provider profiles are one of the strongest long-term SEO and conversion assets in the Services marketplace.</p>
              <p>This page should make profile quality and public trust feel like a real business object, not a hidden setup form.</p>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">What strong profiles need</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Clear service areas, active offerings, a complete gallery, and visible request posture should all work together here.</p>
              <p>As staging goes live, this lane should become the place to improve conversion before providers start paying for stronger visibility.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
