import Link from 'next/link';
import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../lib/auth/session';
import {
  getWorkspaceBranches,
  getWorkspaceCompanies,
  getWorkspaceCompanyInvites,
  getWorkspaceCompanyMembers,
  getWorkspaceCompanyOperationalSummaries
} from '../../../lib/company/queries';

const pillars = [
  {
    title: 'Company profile and verification',
    detail: 'One legal company record, one public brand object, and one verification trail should power listings, packages, and trust.'
  },
  {
    title: 'Branches and operating lanes',
    detail: 'Branches should separate inventory, permits, and lead ownership so serious operators can scale without one noisy dashboard.'
  },
  {
    title: 'People and permissions',
    detail: 'Owners, admins, brokers, publishers, marketing users, and analysts should all stay scoped inside one reusable permission model.'
  }
];

const quickLinks = [
  { href: '/company/onboarding', label: 'Create company record' },
  { href: '/company/branches', label: 'Manage branches' },
  { href: '/company/members', label: 'Review team roles' },
  { href: '/verification', label: 'Open verification center' }
];

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

export default async function WorkspaceCompanyPage() {
  const context = await getAuthenticatedUserContext();
  const companyIds = context?.companyIds || [];
  const [companies, branches, members, invites, operationalSummaries] = await Promise.all([
    getWorkspaceCompanies(companyIds),
    getWorkspaceBranches(companyIds),
    getWorkspaceCompanyMembers(companyIds),
    getWorkspaceCompanyInvites(companyIds),
    getWorkspaceCompanyOperationalSummaries(companyIds)
  ]);

  const companyCount = companies.length;
  const branchCount = branches.length;
  const activeMemberCount = members.filter((member) => member.status === 'active').length;
  const pendingInviteCount = invites.length;
  const pendingReviewCount = operationalSummaries.reduce(
    (total, company) => total + company.property_in_review_count + company.compliance_case_count + company.moderation_case_count,
    0
  );

  return (
    <WorkspacePage
      eyebrow="Company command center"
      title="Control the business object that every serious GulfHabibi workflow should plug into."
      description="This lane should become the operational home for agencies, developers, employers, dealers, service providers, and directory brands before they start scaling listings or campaigns."
      actions={[
        { href: '/company/onboarding', label: 'Create company record' },
        { href: '/listings/property/new', label: 'Start a property listing', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Company records', value: String(companyCount), hint: 'One shared company layer should anchor every serious posting lane.' },
        { label: 'Active branches', value: String(branchCount), hint: 'Branches separate permissions, leads, and operating lanes by location.' },
        { label: 'Active seats', value: String(activeMemberCount), hint: 'Owners, admins, brokers, managers, and analysts all stay scoped here.' },
        {
          label: 'Reviews and invites',
          value: `${pendingReviewCount} / ${pendingInviteCount}`,
          hint: 'Track approval load and pending team seats without leaving the company command center.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="gh-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Shared backbone</p>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{pillar.detail}</p>
              </article>
            ))}
          </div>

          <section className="gh-card p-6 md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Workspace companies</p>
                <h2 className="text-2xl font-semibold tracking-tight text-ink">See which company records already exist under this account.</h2>
                <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                  The company layer should feel like a premium operations surface, not a loose profile list. Every serious workflow should start from here.
                </p>
              </div>
              <Link href="/company/onboarding" className="gh-button-primary">
                Create another company
              </Link>
            </div>

            {companies.length ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {companies.map((company) => {
                  const companyBranches = branches.filter((branch) => branch.company_id === company.id);
                  const companyMembers = members.filter((member) => member.company_id === company.id && member.status === 'active');
                  const companyInvites = invites.filter((invite) => invite.company_id === company.id);
                  const operationalSummary = operationalSummaries.find((summary) => summary.company_id === company.id);

                  return (
                    <article key={company.id} className="gh-card overflow-hidden">
                      <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.16),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{formatCompanyType(company.company_type)}</p>
                            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{company.display_name}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                              {company.verification_status}
                            </span>
                            <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                              {company.public_profile_enabled ? 'Public profile on' : 'Profile private'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                          <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Branches</p>
                            <p className="mt-2 text-2xl font-semibold text-ink">{companyBranches.length}</p>
                          </div>
                          <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Seats</p>
                            <p className="mt-2 text-2xl font-semibold text-ink">{companyMembers.length}</p>
                          </div>
                          <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Primary lane</p>
                            <p className="mt-2 text-sm font-semibold text-ink">
                              {company.company_type === 'agency' || company.company_type === 'developer' ? 'Property operations' : 'Shared workspace'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 p-6">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Property inventory</p>
                            <p className="mt-2 text-xl font-semibold text-ink">{operationalSummary?.property_listing_count || 0}</p>
                          </div>
                          <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">In review</p>
                            <p className="mt-2 text-xl font-semibold text-ink">{operationalSummary?.property_in_review_count || 0}</p>
                          </div>
                          <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Compliance docs</p>
                            <p className="mt-2 text-xl font-semibold text-ink">{operationalSummary?.evidence_document_count || 0}</p>
                          </div>
                          <div className="rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending invites</p>
                            <p className="mt-2 text-xl font-semibold text-ink">{companyInvites.length}</p>
                          </div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                          <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Trust profile</p>
                                <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{operationalSummary?.trust_total_score || 0}</p>
                              </div>
                              <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatRiskTone(operationalSummary?.trust_risk_state)}`}>
                                {operationalSummary?.trust_risk_state || 'normal'}
                              </span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                              Company-level trust now rolls up from listing risk checks, recent rejections, and verification credits.
                            </p>
                          </div>

                          <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Operational pulse</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                                Drafts {operationalSummary?.property_draft_count || 0}
                              </span>
                              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                                Compliance {operationalSummary?.compliance_case_count || 0}
                              </span>
                              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                                Moderation {operationalSummary?.moderation_case_count || 0}
                              </span>
                              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                                Published {operationalSummary?.property_published_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
                No company records yet. Start with one controlled workspace company before you publish inventory, invite team members, or buy premium placements.
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <aside className="gh-card overflow-hidden">
            <div className="bg-[linear-gradient(135deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] p-6 text-[var(--text-inverse)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">Quick actions</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight">Move from setup into real operating lanes faster.</p>
            </div>
            <div className="space-y-3 p-6">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-4 py-4 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              ))}
            </div>
          </aside>

          <aside className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current operating posture</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Review load</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{pendingReviewCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Property review, moderation, and compliance volume already routes through the same shared company backbone.</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Pending invites</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{pendingInviteCount}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">Keep seats and branch roles clean before scaling listings, campaigns, or lead routing.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </WorkspacePage>
  );
}
