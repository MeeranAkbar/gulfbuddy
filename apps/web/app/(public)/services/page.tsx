import type { Metadata } from 'next';
import {
  ServicesCategoryGrid,
  ServicesEmirateGrid,
  ServicesHeroAside,
  ServicesProviderGrid,
  ServicesSearchConsole,
  ServicesSectionHeading,
  ServicesShowcaseGrid,
  ServicesTrustPanel
} from '../../../components/services/services-discovery';
import { SectionPage } from '../../../components/section-page';
import {
  servicesCategories,
  servicesEmirates,
  servicesMetrics,
  servicesProviderHighlights,
  servicesQuickFilters,
  servicesSearchFields,
  servicesShowcaseItems,
  servicesTrustSignals
} from '../../../lib/services/public-content';

export const metadata: Metadata = {
  title: 'UAE Services Marketplace | GulfHabibi',
  description:
    'Explore GulfHabibi Services as a premium UAE local services marketplace with provider profiles, quote requests, local discovery, and commission-ready workflow design.'
};

export default function ServicesPage() {
  return (
    <SectionPage
      eyebrow="Services Marketplace"
      title="Find local providers, request quotes, and compare trusted service brands."
      description="Search local UAE services through category and area pages built around provider identity, quote-ready flows, and stronger trust signals than a static directory."
      imageUrl="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2000&q=80"
      aside={
        <ServicesHeroAside
          metrics={servicesMetrics}
          primaryHref="/services/request"
          primaryLabel="Request a service"
          secondaryHref="/pricing"
          secondaryLabel="For providers"
        />
      }
    >
      <ServicesSearchConsole fields={servicesSearchFields} filters={servicesQuickFilters} actionHref="/services/search" actionLabel="Browse services" />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <ServicesSectionHeading
            eyebrow="Category lanes"
            title="Services should be organised around real local need."
            description="Home maintenance, beauty, business support, and emergency demand each need their own entry lane, local routing, and provider comparison."
          />
          <ServicesCategoryGrid items={servicesCategories} />
        </section>

        <ServicesTrustPanel
          title="Trust is what turns service discovery into repeat business."
          description="Provider identity, response posture, and the quote flow should all feel safe before the user submits a request."
          signals={servicesTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <ServicesSectionHeading
          eyebrow="Local demand"
          title="Emirate-led pages should feel like serious local service hubs."
          description="Service search is deeply local, so users should move into stronger emirate and category lanes instead of weak filter pages."
        />
        <ServicesEmirateGrid items={servicesEmirates} />
      </section>

      <section className="space-y-6">
        <ServicesSectionHeading
          eyebrow="Marketplace framing"
          title="Requests, quotes, and provider branding should feel integrated."
          description="The public experience needs to balance trust, speed, and provider quality without becoming cluttered."
        />
        <ServicesShowcaseGrid items={servicesShowcaseItems} />
      </section>

      <section className="space-y-6">
        <ServicesSectionHeading
          eyebrow="Provider fit"
          title="Providers should feel like real marketplace operators."
          description="Public provider pages, request flow, and premium visibility should work together so strong operators can build brand and repeat trust."
        />
        <ServicesProviderGrid items={servicesProviderHighlights} />
      </section>
    </SectionPage>
  );
}
