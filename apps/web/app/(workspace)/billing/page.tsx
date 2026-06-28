import { WorkspacePage } from '../../../components/workspace/workspace-page';
import { getAuthenticatedUserContext } from '../../../lib/auth/session';
import { getWorkspaceMonetizationSnapshot } from '../../../lib/monetization/queries';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(amount)}`;
}

export default async function WorkspaceBillingPage() {
  const context = await getAuthenticatedUserContext();
  const snapshot = context
    ? await getWorkspaceMonetizationSnapshot({ companyIds: context.companyIds, userId: context.userId })
    : { packageCatalog: [], orders: [], entitlements: [], campaigns: [], adSlots: [] };

  const activeEntitlementCount = snapshot.entitlements.filter((entitlement) => entitlement.status === 'active' || entitlement.status === 'scheduled').length;
  const paidOrderCount = snapshot.orders.filter((order) => order.payment_status === 'paid').length;
  const activeCampaignCount = snapshot.campaigns.filter((campaign) => campaign.status === 'active' || campaign.status === 'scheduled').length;

  return (
    <WorkspacePage
      eyebrow="Billing and packages"
      title="Use one commercial backbone for listings, featured placement, and banner campaigns across every GulfHabibi section."
      description="Packages, entitlements, promotions, and campaigns should stay rule-based and company-scoped so Home, Property, Motors, Jobs, and Services can all grow on the same rails."
      metrics={[
        { label: 'Active entitlements', value: String(activeEntitlementCount), hint: 'Shared entitlements should drive inventory, featured placement, and campaign eligibility.' },
        { label: 'Paid orders', value: String(paidOrderCount), hint: 'Commercial history should stay visible per company instead of getting buried in section-specific logic.' },
        { label: 'Campaigns in motion', value: String(activeCampaignCount), hint: 'Banner operations should sit on the same monetization backbone as listing packages.' },
        { label: 'Live package options', value: String(snapshot.packageCatalog.length), hint: 'Package catalog entries are now available to power a real workspace offer wall.' }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="gh-card p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Package catalog</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Shared plans across listings, boosts, and banners.</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {snapshot.packageCatalog.map((pkg) => (
              <article key={pkg.id} className="gh-surface-alt rounded-[1.4rem] p-5">
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{pkg.section || 'cross-portal'}</span>
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">{pkg.product_type.replace(/_/g, ' ')}</span>
                  <span className="rounded-full border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 px-3 py-1 text-[color:var(--success)]">{pkg.billing_model.replace(/_/g, ' ')}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{pkg.name}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{pkg.code}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-ink">{formatMoney(pkg.price_amount, pkg.currency)}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {pkg.duration_days ? `${pkg.duration_days} day term` : 'Flexible duration'}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Active entitlements</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">What this workspace can already use.</h2>
            {snapshot.entitlements.length ? (
              <div className="mt-5 space-y-3">
                {snapshot.entitlements.map((entitlement) => (
                  <article key={entitlement.id} className="gh-surface-alt rounded-[1.15rem] p-4">
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">
                        {entitlement.section || 'cross-portal'}
                      </span>
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[var(--text-secondary)]">
                        {entitlement.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink">{entitlement.package_name}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {entitlement.entitlement_type} x {entitlement.quantity}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">No active entitlements yet. The backbone is ready, but real orders have not been applied in staging yet.</p>
            )}
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Recent orders</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Commercial history for this workspace.</h2>
            {snapshot.orders.length ? (
              <div className="mt-5 space-y-3">
                {snapshot.orders.map((order) => (
                  <article key={order.id} className="gh-surface-alt rounded-[1.15rem] p-4">
                    <p className="text-sm font-semibold text-ink">{order.package_name}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{formatMoney(order.amount_paid, order.currency)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{order.payment_status}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">No orders yet. This page is now ready to surface real workspace billing history once staging data is connected.</p>
            )}
          </section>
        </div>
      </div>
    </WorkspacePage>
  );
}
