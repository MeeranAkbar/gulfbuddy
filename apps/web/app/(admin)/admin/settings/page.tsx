import { getAdminSettingsSnapshot } from '../../../../lib/admin/settings-queries';

export default async function AdminSettingsPage() {
  const { totalSettings, activePackages, activeSlots, publicProfiles, verifiedCompanies, recentSettings, sectionMetrics } =
    await getAdminSettingsSnapshot();

  return (
    <div className="space-y-6">
      <section className="gh-card overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(198,169,112,0.18),transparent_34%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
          <span className="gh-pill">Settings</span>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Control platform posture, monetization surfaces, and shared marketplace policy from one calm operations layer.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            Settings should eventually govern feature flags, section posture, trust copy, badge policy, ad inventory, pricing surfaces, and indexability rules without scattering control across one-off pages.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Setting keys</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{totalSettings}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Persisted system settings currently present in the shared ops schema.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active packages</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{activePackages}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Commercial products available for listings, seats, boosts, and campaigns.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active ad slots</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{activeSlots}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Monetization inventory currently available across the shared ad system.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Public profiles</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{publicProfiles}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Companies already eligible for indexable public profile exposure later.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Verified companies</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{verifiedCompanies}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Verified business objects that can support stronger trust surfaces and badges.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Control surfaces</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Section economics and platform controls should stay visible enough for calm decision-making.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Sections {sectionMetrics.length}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {sectionMetrics.map((metric) => (
              <article key={metric.section} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-ink">{metric.section}</h3>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                      Live {metric.liveListings}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Packages</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{metric.activePackages}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Slots</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{metric.activeSlots}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Public inventory</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{metric.liveListings}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Recent keys</p>
            {recentSettings.length ? (
              <div className="mt-5 space-y-3">
                {recentSettings.map((setting) => (
                  <article key={`${setting.environment}-${setting.key}`} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink break-all">{setting.key}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{setting.environment}</p>
                      </div>
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                        {new Date(setting.updated_at).toLocaleDateString('en-AE')}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.15rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                No system setting rows yet. Once staging controls are connected, this panel becomes the latest configuration audit snapshot.
              </div>
            )}
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Settings intent</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Settings should stay centralized so section visibility, ad controls, pricing posture, trust messaging, and feature flags never drift into fragile page-level logic.</p>
              <p>This screen should later support versioned settings, environment-aware overrides, SEO posture toggles, and explicit policy content management.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
