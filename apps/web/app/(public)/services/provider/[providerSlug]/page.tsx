import type { Metadata } from 'next';
import {
  ServicesHeroAside,
  ServicesProviderGrid,
  ServicesSectionHeading,
  ServicesTrustPanel
} from '../../../../../components/services/services-discovery';
import { SectionPage } from '../../../../../components/section-page';
import { humanizeSlug, servicesProviderHighlights, servicesTrustSignals } from '../../../../../lib/services/public-content';

interface ServicesProviderPageProps {
  params: Promise<{ providerSlug: string }>;
}

export async function generateMetadata({ params }: ServicesProviderPageProps): Promise<Metadata> {
  const { providerSlug } = await params;
  const providerName = humanizeSlug(providerSlug);

  return {
    title: `${providerName} | Service Provider | GulfHabibi`,
    description: `Explore ${providerName} on GulfHabibi with local coverage, service highlights, trust badges, and a clear quote-ready public profile.`
  };
}

export default async function ServicesProviderPage({ params }: ServicesProviderPageProps) {
  const { providerSlug } = await params;
  const providerName = humanizeSlug(providerSlug);

  return (
    <SectionPage
      eyebrow="Provider Profile"
      title={providerName}
      description="A premium provider page should make local coverage, service quality, pricing style, and quote readiness clear in the first screen."
      aside={
        <ServicesHeroAside
          metrics={[
            { label: 'Profile role', value: 'Lead and trust surface' },
            { label: 'Primary action', value: 'Quote request or booking' },
            { label: 'Growth value', value: 'Shareable public provider page' }
          ]}
          primaryHref="/services/request"
          primaryLabel="Request quote"
          secondaryHref="/provider/profile"
          secondaryLabel="Provider workspace"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="gh-card overflow-hidden">
          <div className="min-h-[18rem] bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.24),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="gh-pill">Verified Provider</span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Accepting requests
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Quote-based
              </span>
            </div>
            <div className="mt-10 max-w-3xl">
              <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{providerName}</h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                Trusted local provider for recurring maintenance, emergency callouts, and branded service delivery across high-intent UAE neighborhoods.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Coverage', 'Dubai Marina to JVC'],
                ['Response posture', 'Fast quote response'],
                ['Pricing style', 'Quote + package']
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-base font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServicesTrustPanel
          title="Provider trust should be visible before the user sends a request."
          description="Verification, response posture, and service model should all be visible before the visitor enters the quote flow."
          signals={servicesTrustSignals.slice(0, 4)}
        />
      </div>

      <section className="space-y-6">
        <ServicesSectionHeading
          eyebrow="What you can book"
          title="A provider profile needs richer service modules than a basic contact card."
          description="Offerings, pricing posture, service areas, trust signals, and portfolio cues should help the visitor decide quickly."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {[
            {
              title: 'Offerings and pricing style',
              copy: 'Show what the provider actually does, how pricing works, and whether the service is quote-based, fixed, emergency, or package-led.'
            },
            {
              title: 'Coverage and availability',
              copy: 'Area, emirate, and availability cues should help the user know whether the provider is a real fit before they open a request flow.'
            },
            {
              title: 'Brand and trust surface',
              copy: 'This page should act as a durable public brand object that can be shared, indexed, and used to support repeat business.'
            }
          ].map((item) => (
            <article key={item.title} className="gh-card p-6">
              <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <ServicesSectionHeading
          eyebrow="Marketplace fit"
          title="The provider page should support both trust and monetization naturally."
          description="Featured offerings, response signals, and premium profile upgrades can sit here without making the page feel noisy."
        />
        <ServicesProviderGrid items={servicesProviderHighlights} />
      </section>
    </SectionPage>
  );
}
