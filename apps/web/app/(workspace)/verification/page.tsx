import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { formatLabel } from '../../../lib/workspace/formatters';
import { getWorkspaceVerificationSnapshot } from '../../../lib/workspace/shared-queries';

export default async function VerificationWorkspacePage() {
  const snapshot = await getWorkspaceVerificationSnapshot();

  if (!snapshot) {
    return (
      <WorkspacePage
        eyebrow="Verification center"
        title="No authenticated verification context is available yet."
        description="Verification becomes meaningful once the shared auth and company layers are active in staging."
      />
    );
  }

  const personalChecksPassed = [snapshot.emailVerified, snapshot.phoneVerified, snapshot.identityVerified].filter(Boolean).length;

  return (
    <WorkspacePage
      eyebrow="Verification center"
      title="Keep identity, company verification, and compliance posture visible before risky inventory goes live."
      description="GulfHabibi is supposed to feel trust-first and controlled. This page should make it obvious which parts of the operator identity are already verified, what still needs work, and where compliance pressure is building."
      actions={[
        { href: '/company', label: 'Company command center' },
        { href: '/listings', label: 'Listing review lane', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Personal checks passed',
          value: `${personalChecksPassed} / 3`,
          hint: 'Email, phone, and identity verification should stay obvious to the operator.'
        },
        {
          label: 'Verified companies',
          value: String(snapshot.verifiedCompanyCount),
          hint: 'Company verification is one of the strongest trust levers across the whole marketplace.'
        },
        {
          label: 'Compliance docs',
          value: String(snapshot.totalComplianceDocuments),
          hint: 'Evidence documents currently uploaded into the property compliance flow.'
        },
        {
          label: 'Open review load',
          value: String(snapshot.totalComplianceCases + snapshot.totalModerationCases),
          hint: 'Combined compliance and moderation pressure that still needs operational attention.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Personal verification</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{snapshot.displayName || snapshot.email || 'Workspace identity'}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{snapshot.email || 'No email available'}</p>

            <div className="mt-5 space-y-3">
              {[
                { label: 'Email verification', value: snapshot.emailVerified },
                { label: 'Phone verification', value: snapshot.phoneVerified },
                { label: 'Identity verification', value: snapshot.identityVerified }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">{item.label}</p>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {item.value ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-5">
          {snapshot.companies.length ? (
            snapshot.companies.map((company) => (
              <article key={company.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="gh-pill">{formatLabel(company.company_type)}</span>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {formatLabel(company.verification_status)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{company.display_name}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          Trust tier {formatLabel(company.trust_tier)} / {company.public_profile_enabled ? 'Public profile enabled' : 'Public profile private'}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[18rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Property trust score</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{company.operationalSummary?.trust_total_score || 0}</p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        Risk state {formatLabel(company.operationalSummary?.trust_risk_state, 'normal')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Property reviews</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{company.operationalSummary?.property_in_review_count || 0}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Compliance cases</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{company.operationalSummary?.compliance_case_count || 0}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Moderation cases</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{company.operationalSummary?.moderation_case_count || 0}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Evidence docs</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{company.operationalSummary?.evidence_document_count || 0}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No company verification posture is visible yet. This lane becomes useful once company records and regulated listing flows start operating on staging.
            </div>
          )}
        </section>
      </div>
    </WorkspacePage>
  );
}
