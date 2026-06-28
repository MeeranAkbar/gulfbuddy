import { getAdminCompanyOpsSnapshot } from '../../../../lib/company/queries';

function formatCompanyType(value: string) {
  return value.replace(/_/g, ' ');
}

function formatRiskTone(riskState: string | null | undefined) {
  switch (riskState) {
    case 'blocked':
      return 'border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 text-[color:var(--danger)]';
    case 'high':
    case 'medium':
      return 'border-[color:var(--warning)]/20 bg-[color:var(--warning)]/10 text-[color:var(--warning)]';
    case 'low':
      return 'border-[color:var(--info)]/20 bg-[color:var(--info)]/10 text-[color:var(--info)]';
    default:
      return 'border-[color:var(--success)]/20 bg-[color:var(--success)]/10 text-[color:var(--success)]';
  }
}

export default async function AdminCompaniesPage() {
  const companies = await getAdminCompanyOpsSnapshot();

  const verifiedCompanies = companies.filter((company) => company.verification_status === 'verified').length;
  const pendingCompanies = companies.filter((company) => company.verification_status !== 'verified').length;
  const highRiskCompanies = companies.filter((company) => ['high', 'blocked'].includes(company.trust_risk_state || '')).length;
  const publicProfiles = companies.filter((company) => company.public_profile_enabled).length;

  return (
    <div className="space-y-6">
      <section className="gh-card overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(198,169,112,0.18),transparent_34%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
          <span className="gh-pill">Company Ops</span>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Control the verified business layer that powers listings, campaigns, trust, and workspace permissions.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] md:text-base">
            Company Ops should feel like the operating system for serious marketplace participants. Verification, public profiles, team scale, and trust posture all meet here.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Company records</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{companies.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">The total business objects flowing through the shared platform backbone.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Verified companies</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{verifiedCompanies}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Trusted operators ready for publishing, campaigns, and higher-confidence public presentation.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Pending verification</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{pendingCompanies}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Brands that still need review before they earn stronger marketplace trust signals.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">High-risk posture</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{highRiskCompanies}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Operators currently surfacing higher trust or moderation pressure across their workflows.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Operator queue</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">The business layer should be readable at a glance, even under review pressure.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Public profiles {publicProfiles}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                Team-managed companies {companies.filter((company) => company.active_member_count > 1).length}
              </span>
            </div>
          </div>

          {companies.length ? (
            <div className="mt-6 grid gap-4">
              {companies.map((company) => (
                <article key={company.id} className="gh-card overflow-hidden">
                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.14),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{formatCompanyType(company.company_type)}</p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{company.display_name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {company.verification_status}
                        </span>
                        <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatRiskTone(company.trust_risk_state)}`}>
                          {company.trust_risk_state || 'normal'}
                        </span>
                        <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                          {company.public_profile_enabled ? 'Public profile on' : 'Profile private'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Branches</p>
                        <p className="mt-2 text-xl font-semibold text-ink">{company.branch_count}</p>
                      </div>
                      <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Active seats</p>
                        <p className="mt-2 text-xl font-semibold text-ink">{company.active_member_count}</p>
                      </div>
                      <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending invites</p>
                        <p className="mt-2 text-xl font-semibold text-ink">{company.pending_invite_count}</p>
                      </div>
                      <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Trust score</p>
                        <p className="mt-2 text-xl font-semibold text-ink">{company.trust_total_score}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Listings</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{company.property_listing_count}</p>
                      <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">All current property-linked records for this company.</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Review load</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{company.property_in_review_count}</p>
                      <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">Drafts already in property review or compliance flow.</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Compliance docs</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{company.evidence_document_count}</p>
                      <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">Evidence objects linked to current property workflows.</p>
                    </div>
                    <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Published stock</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{company.property_published_count}</p>
                      <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">Property items already approved or live in the system.</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No company records yet. The admin company command center is ready once staging data is wired into the new platform.
            </div>
          )}
        </section>

        <div className="space-y-6">
          <aside className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Review posture</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Compliance-heavy companies</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{companies.filter((company) => company.compliance_case_count > 0).length}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Operators currently sitting inside property permit or evidence review lanes.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Moderation pressure</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {companies.reduce((total, company) => total + company.moderation_case_count, 0)}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">The total moderation case volume linked to the current company queue.</p>
              </div>
            </div>
          </aside>

          <aside className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this screen matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Company Ops is where agencies, developers, employers, dealers, and providers stop being anonymous posters and become controlled marketplace operators.</p>
              <p>This page should eventually connect verification actions, suspension controls, branch context, billing state, and public-profile posture without feeling like a cold enterprise grid.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
