import type { Metadata } from 'next';
import {
  ServicesHeroAside,
  ServicesSectionHeading,
  ServicesTrustPanel
} from '../../../../components/services/services-discovery';
import { SectionPage } from '../../../../components/section-page';
import { servicesMetrics, servicesTrustSignals } from '../../../../lib/services/public-content';

export const metadata: Metadata = {
  title: 'Request a Service | GulfHabibi',
  description:
    'Start a service request on GulfHabibi with a cleaner quote-first workflow designed for local UAE service marketplaces and future commission-ready order flow.'
};

export default function ServicesRequestPage() {
  return (
    <SectionPage
      eyebrow="Request Flow"
      title="Requesting a service should feel guided, local, and confidence-building."
      description="The request flow is where GulfHabibi turns service discovery into real marketplace activity. It should be simple enough for fast customer action, but structured enough to support matching, quoting, orders, and commission tracking underneath."
      aside={
        <ServicesHeroAside
          metrics={servicesMetrics}
          primaryHref="/services"
          primaryLabel="Back to Services"
          secondaryHref="/provider/requests"
          secondaryLabel="Provider request lane"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <ServicesSectionHeading
            eyebrow="Request journey"
            title="The UX should move from need to quote selection without overwhelming the user."
            description="A premium service request flow should collect just enough information to match providers properly, while keeping the page light, mobile-friendly, and trustworthy."
          />
          <div className="grid gap-4">
            {[
              ['1. Describe the job', 'Service category, area, urgency, and what outcome the customer needs.'],
              ['2. Match providers', 'Use service area, provider type, and trust posture to route the request into the right queue.'],
              ['3. Compare quotes', 'Customers should review pricing style, response quality, and provider confidence before converting.'],
              ['4. Convert to order', 'Accepted quotes should move into an order and future commission-ready path cleanly.']
            ].map(([title, copy]) => (
              <article key={title} className="gh-card p-6">
                <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <ServicesTrustPanel
          title="The request flow is where trust turns into revenue."
          description="If the request experience feels clean and safe, users will submit real jobs, providers will respond faster, and the service marketplace can grow into repeat business and commissions."
          signals={servicesTrustSignals}
        />
      </div>
    </SectionPage>
  );
}
