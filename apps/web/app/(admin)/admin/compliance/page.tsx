import { PropertyComplianceDocumentReviewForm } from '../../../../components/property/property-compliance-document-review-form';
import { getAdminComplianceSnapshot } from '../../../../lib/compliance/queries';
import { reviewPropertyComplianceDocumentAction, reviewPropertySubmissionAction } from './actions';

function getRiskTone(riskState: string | null) {
  if (riskState === 'blocked') {
    return 'rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200';
  }

  if (riskState === 'high' || riskState === 'medium') {
    return 'rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200';
  }

  if (riskState === 'low') {
    return 'rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200';
  }

  return 'rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200';
}

function getNeutralTone() {
  return 'rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]';
}

function getFlagTone(active: boolean) {
  return active
    ? 'rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200'
    : getNeutralTone();
}

export default async function AdminCompliancePage() {
  const { complianceCases, moderationCases } = await getAdminComplianceSnapshot();

  return (
    <div className="space-y-6">
      <section className="gh-hero p-8 md:p-10">
        <p className="gh-pill">Compliance Ops</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink">Keep regulated publishing separate from ordinary moderation.</h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
          This queue is where property trust, evidence, permit posture, and publication decisions stay visible before anything risky can go public.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Compliance cases</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{complianceCases.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Regulated records waiting on compliance review.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Moderation cases</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{moderationCases.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Content-quality review stays separate from compliance.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Highest priority</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {complianceCases.length ? Math.min(...complianceCases.map((item) => item.priority)) : 0}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Lower numbers mean faster action required.</p>
          </div>
          <div className="gh-kpi">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Operating rule</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">Queue-based</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Regulated sections never jump directly to public trust.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="gh-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Compliance queue</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Regulated case records</h3>
          {complianceCases.length ? (
            <div className="mt-5 space-y-4">
              {complianceCases.map((item) => (
                <article key={item.id} className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                  <div className="flex flex-wrap gap-2 text-xs font-medium">
                    <span className={getNeutralTone()}>{item.section}</span>
                    <span className={getNeutralTone()}>{item.compliance_state}</span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                      Priority {item.priority}
                    </span>
                    {item.risk_profile ? (
                      <span className={getRiskTone(item.risk_profile.risk_state)}>
                        {item.risk_profile.risk_state} risk - {item.risk_profile.total_score}
                      </span>
                    ) : null}
                    {item.queue_priority ? <span className={getNeutralTone()}>Queue {item.queue_priority}</span> : null}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    Case type: <span className="font-medium text-ink">{item.case_type}</span>
                  </p>
                  <p className="mt-1 text-base font-semibold text-ink">{item.listing_title || 'Listing not attached yet'}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {item.company_name || 'No company linked'}
                    {item.publication_state ? ` | ${item.publication_state}` : ''}
                  </p>

                  {item.reason_codes.length ? (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                      {item.reason_codes.map((reason) => (
                        <span key={reason} className={getNeutralTone()}>
                          {reason.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {item.property_snapshot ? (
                    <div className="mt-4 rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Listing snapshot</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="space-y-2 text-sm leading-7 text-[var(--text-secondary)]">
                          <p>
                            Mode: <span className="font-medium text-ink">{item.property_snapshot.market_mode || 'Not set'}</span>
                          </p>
                          <p>
                            Purpose: <span className="font-medium text-ink">{item.property_snapshot.purpose || 'Not set'}</span>
                          </p>
                          <p>
                            Type: <span className="font-medium text-ink">{item.property_snapshot.property_type || 'Not set'}</span>
                          </p>
                          <p>
                            Area:{' '}
                            <span className="font-medium text-ink">
                              {item.property_snapshot.community_name || item.property_snapshot.building_name || 'Not set'}
                            </span>
                          </p>
                          <p>
                            Images: <span className="font-medium text-ink">{item.property_snapshot.image_count}</span>
                          </p>
                        </div>
                        <div className="space-y-2 text-sm leading-7 text-[var(--text-secondary)]">
                          <p>
                            Advertiser: <span className="font-medium text-ink">{item.property_snapshot.advertiser_type || 'Missing'}</span>
                          </p>
                          <p>
                            Permit system: <span className="font-medium text-ink">{item.property_snapshot.permit_system || 'Missing'}</span>
                          </p>
                          <p>
                            Permit number: <span className="font-medium text-ink">{item.property_snapshot.permit_number || 'Missing'}</span>
                          </p>
                          <p>
                            Permit expiry: <span className="font-medium text-ink">{item.property_snapshot.permit_expiry_date || 'Not set'}</span>
                          </p>
                          <p>
                            Company status:{' '}
                            <span className="font-medium text-ink">
                              {item.property_snapshot.company_verification_status || 'Unlinked'}
                              {item.property_snapshot.company_trust_tier ? ` - ${item.property_snapshot.company_trust_tier}` : ''}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                        <span className={getFlagTone(!item.property_snapshot.permit_number)}>Permit missing</span>
                        <span className={getFlagTone(Boolean(item.property_snapshot.permit_expiry_date))}>Permit dated</span>
                        <span className={getFlagTone(item.property_snapshot.permit_qr_present)}>Permit QR present</span>
                        <span className={getFlagTone(item.property_snapshot.company_verification_status === 'verified')}>Company verified</span>
                      </div>

                      {item.duplicate_signals ? (
                        <div className="mt-4 rounded-[1rem] border border-amber-200 bg-amber-50/70 p-4 text-sm leading-7 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
                          <p className="font-semibold">Duplicate suspected</p>
                          <p className="mt-2">
                            Same permit: <span className="font-medium">{item.duplicate_signals.same_permit_count}</span>
                            {' - '}
                            Same title/price: <span className="font-medium">{item.duplicate_signals.same_title_price_count}</span>
                            {' - '}
                            Reused images: <span className="font-medium">{item.duplicate_signals.reused_image_listing_count}</span>
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {item.triggered_rules.length ? (
                    <div className="mt-4 rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Triggered auto-check rules</p>
                      <div className="mt-3 space-y-3">
                        {item.triggered_rules.map((rule) => (
                          <div key={`${item.id}-${rule.rule_code}`} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                            <div className="flex flex-wrap gap-2 text-xs font-medium">
                              <span className={getNeutralTone()}>{rule.rule_code}</span>
                              <span className={getNeutralTone()}>{rule.severity}</span>
                              <span className={getNeutralTone()}>{rule.action_type.replace(/_/g, ' ')}</span>
                              <span className={getNeutralTone()}>+{rule.score_delta}</span>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{rule.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Evidence documents</p>
                    {item.evidence_documents.length ? (
                      <div className="mt-3 space-y-3">
                        {item.evidence_documents.map((document) => (
                          <div key={document.id} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                            <div className="flex flex-wrap gap-2 text-xs font-medium">
                              <span className={getNeutralTone()}>{document.document_type.replace(/_/g, ' ')}</span>
                              <span className={getNeutralTone()}>{document.review_state.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="mt-3 text-sm font-medium text-ink">{document.document_label}</p>
                            {document.notes ? <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{document.notes}</p> : null}
                            {document.access_url ? (
                              <a
                                className="mt-3 inline-flex text-sm font-medium text-[var(--primary)] hover:opacity-80"
                                href={document.access_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open document reference
                              </a>
                            ) : null}
                            <div className="mt-4">
                              <PropertyComplianceDocumentReviewForm
                                documentId={document.id}
                                currentReviewState={document.review_state}
                                action={reviewPropertyComplianceDocumentAction}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        No evidence documents are attached yet. This case should stay in the regulated review lane until supporting records are uploaded.
                      </p>
                    )}
                  </div>

                  {item.listing_id ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <form action={reviewPropertySubmissionAction}>
                        <input type="hidden" name="listingId" value={item.listing_id} />
                        <input type="hidden" name="decision" value="approve" />
                        <button className="gh-button-primary">Approve + publish</button>
                      </form>
                      <form action={reviewPropertySubmissionAction}>
                        <input type="hidden" name="listingId" value={item.listing_id} />
                        <input type="hidden" name="decision" value="request_changes" />
                        <button className="gh-button-secondary">Request changes</button>
                      </form>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No compliance cases yet. Once property submissions move into review, this queue becomes the regulatory control lane.
            </div>
          )}
        </section>

        <section className="gh-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Moderation queue</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Content and quality review cases</h3>
          {moderationCases.length ? (
            <div className="mt-5 space-y-4">
              {moderationCases.map((item) => (
                <article key={item.id} className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
                  <div className="flex flex-wrap gap-2 text-xs font-medium">
                    <span className={getNeutralTone()}>{item.section}</span>
                    <span className={getNeutralTone()}>{item.moderation_state}</span>
                    <span className={getNeutralTone()}>{item.queue}</span>
                    {item.risk_profile ? (
                      <span className={getRiskTone(item.risk_profile.risk_state)}>
                        {item.risk_profile.risk_state} risk - {item.risk_profile.total_score}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    Reason: <span className="font-medium text-ink">{item.reason_code || 'General review'}</span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">{item.listing_title || 'Listing not attached yet'}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {item.company_name || 'No company linked'}
                    {item.publication_state ? ` | ${item.publication_state}` : ''}
                  </p>

                  {item.triggered_rules.length ? (
                    <div className="mt-4 space-y-3">
                      {item.triggered_rules.map((rule) => (
                        <div key={`${item.id}-${rule.rule_code}`} className="rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                          <div className="flex flex-wrap gap-2 text-xs font-medium">
                            <span className={getNeutralTone()}>{rule.rule_code}</span>
                            <span className={getNeutralTone()}>{rule.severity}</span>
                            <span className={getNeutralTone()}>+{rule.score_delta}</span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{rule.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">No individual triggered rules are visible yet for this listing.</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No moderation cases yet. This queue will matter once the first property submit-for-review action starts generating review records.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
