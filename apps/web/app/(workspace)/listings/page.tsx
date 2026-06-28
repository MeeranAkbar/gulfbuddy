import Link from 'next/link';
import { addPropertyComplianceDocumentAction, submitPropertyForReviewAction } from './actions';
import { PropertyComplianceDocumentForm } from '../../../components/property/property-compliance-document-form';
import { PropertyReviewSubmissionForm } from '../../../components/property/property-review-submission-form';
import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../lib/auth/session';
import { getWorkspacePropertyDrafts } from '../../../lib/listing/queries';

const inventoryLanes = [
  {
    title: 'Property',
    description: 'Regulated publishing, permit-aware workflows, and branch-aware company inventory.',
    href: '/listings/property/new'
  },
  {
    title: 'Motors',
    description: 'Dealer-ready vehicles, featured placements, and future reseller branding.',
    href: '/motors'
  },
  {
    title: 'Jobs and Services',
    description: 'Employer and provider lanes already exist in the foundation and can plug into the same company object.',
    href: '/jobs'
  }
];

function formatPrice(amount: number | null) {
  if (amount == null) return 'Price not set';
  return `AED ${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(amount)}`;
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

function formatStateLabel(value: string) {
  return value.replace(/_/g, ' ');
}

export default async function WorkspaceListingsPage() {
  const context = await getAuthenticatedUserContext();
  const propertyDrafts = context
    ? await getWorkspacePropertyDrafts({ companyIds: context.companyIds, userId: context.userId })
    : [];

  return (
    <WorkspacePage
      eyebrow="Listings workspace"
      title="Use one inventory lane per section, but keep every listing tied to the same shared platform backbone."
      description="Property, Motors, Jobs, Services, Directory, and future classifieds should all consume the same company, permissions, moderation, monetization, and lead systems."
      actions={[
        { href: '/listings/property/new', label: 'Create property listing' },
        { href: '/company', label: 'Company hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'Recent property drafts',
          value: String(propertyDrafts.length),
          hint: 'The first real regulated vertical already writes structured drafts into the shared backbone.'
        },
        { label: 'Other lanes', value: 'Motors + Jobs + Services', hint: 'These modules can plug into the same company, leads, and monetization rails.' },
        { label: 'Workflow style', value: 'Draft first', hint: 'Publication, moderation, and compliance should stay separate from raw data entry.' }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {inventoryLanes.map((lane) => (
            <article key={lane.title} className="gh-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Inventory lane</p>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">{lane.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{lane.description}</p>
              <Link href={lane.href} className="mt-5 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]">
                Open lane
              </Link>
            </article>
          ))}
        </div>

        <section className="gh-card p-6 md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Recent inventory</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Property drafts already saved into the new shared backbone.</h2>
              <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                The listings workspace should feel like a premium operational lane where review, evidence, and trust stay visible without turning into admin clutter.
              </p>
            </div>
            <Link href="/listings/property/new" className="gh-button-primary">
              Create another draft
            </Link>
          </div>

          {propertyDrafts.length ? (
            <div className="mt-6 grid gap-5">
              {propertyDrafts.map((draft) => (
                <article key={draft.id} className="gh-card overflow-hidden">
                  <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.16),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {formatStateLabel(draft.publication_state)}
                          </span>
                          <span className={`rounded-full border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${formatRiskTone(draft.riskProfile?.risk_state || draft.risk_state)}`}>
                            {(draft.riskProfile?.risk_state || draft.risk_state) + ' risk'}
                          </span>
                          {draft.property ? (
                            <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent-soft)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink">
                              {formatStateLabel(draft.property.market_mode)}
                            </span>
                          ) : null}
                          {draft.compliance ? (
                            <span className="rounded-full border border-[color:var(--info)]/20 bg-[color:var(--info)]/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--info)]">
                              {formatStateLabel(draft.compliance.verification_status)}
                            </span>
                          ) : null}
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-ink">{draft.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                            {draft.emirate}
                            {draft.area ? `, ${draft.area}` : ''}
                            {draft.property ? ` / ${draft.property.property_type}` : ''}
                            {draft.property?.bedrooms != null ? ` / ${draft.property.bedrooms} bed` : ''}
                          </p>
                          {draft.compliance ? (
                            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                              {draft.compliance.permit_system}
                              {draft.compliance.permit_number ? ` / Permit ${draft.compliance.permit_number}` : ' / Permit pending'}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                            Evidence docs {draft.complianceDocuments.length}
                          </span>
                          {draft.riskProfile ? (
                            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                              Risk score {draft.riskProfile.total_score}
                            </span>
                          ) : null}
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                            Updated {new Date(draft.updated_at).toLocaleDateString('en-AE')}
                          </span>
                        </div>
                      </div>

                      <div className="lg:w-[18rem]">
                        <div className="rounded-[1.3rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Price</p>
                          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{formatPrice(draft.price_amount)}</p>
                          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                            Draft-first publishing keeps review, trust scoring, and compliance evidence separate from raw posting.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 p-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-5">
                      <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Current evidence</p>
                        {draft.complianceDocuments.length ? (
                          <div className="mt-4 space-y-3">
                            {draft.complianceDocuments.map((document) => (
                              <div key={document.id} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                                <div className="flex flex-wrap gap-2">
                                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                                    {formatStateLabel(document.document_type)}
                                  </span>
                                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                                    {formatStateLabel(document.review_state)}
                                  </span>
                                </div>
                                <p className="mt-3 text-sm font-semibold text-ink">{document.document_label}</p>
                                {document.access_url ? (
                                  <a className="mt-3 inline-flex text-sm font-semibold text-ink transition hover:text-[var(--primary)]" href={document.access_url} target="_blank" rel="noreferrer">
                                    Open document reference
                                  </a>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                            No evidence attached yet. Regulated property drafts now require at least one evidence record before they can enter the review lane.
                          </p>
                        )}
                      </div>

                      <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Review lane posture</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                            Publication {formatStateLabel(draft.publication_state)}
                          </span>
                          {draft.property ? (
                            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                              Purpose {formatStateLabel(draft.property.purpose)}
                            </span>
                          ) : null}
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                            Last touch {new Date(draft.updated_at).toLocaleDateString('en-AE')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Submit for review</p>
                        <div className="mt-4">
                          <PropertyReviewSubmissionForm
                            listingId={draft.id}
                            publicationState={draft.publication_state}
                            riskState={draft.riskProfile?.risk_state || draft.risk_state}
                            action={submitPropertyForReviewAction}
                          />
                        </div>
                      </div>

                      <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Attach compliance evidence</p>
                        <div className="mt-4">
                          <PropertyComplianceDocumentForm listingId={draft.id} action={addPropertyComplianceDocumentAction} />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No property drafts yet. The first regulated inventory lane is ready, so the next move is to create a company workspace and save the first Dubai-first property draft.
            </div>
          )}
        </section>
      </div>
    </WorkspacePage>
  );
}
