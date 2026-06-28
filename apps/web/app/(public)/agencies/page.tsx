import type { Metadata } from 'next';
import {
  OperatorHeroAside,
  OperatorHighlightGrid,
  OperatorLaneGrid,
  OperatorProfileGrid,
  OperatorSectionHeading,
  OperatorTrustPanel
} from '../../../components/operators/operator-discovery';
import { SectionPage } from '../../../components/section-page';
import { agencyProfiles, operatorHighlights } from '../../../lib/operators/public-content';

export const metadata: Metadata = {
  title: 'Property Agencies | GulfHabibi',
  description: 'Discover premium property agency profiles on GulfHabibi with stronger trust signals, public company identity, and compliance-aware inventory context.'
};

export default function AgenciesPage() {
  return (
    <SectionPage
      eyebrow="Property Agencies"
      title="Agency pages should feel like trusted operating companies, not thin broker directories."
      description="GulfHabibi agency profiles are being shaped as premium public trust objects that connect company identity, compliance posture, inventory quality, and branch credibility in one calmer public layer."
      aside={
        <OperatorHeroAside
          metrics={[
            { label: 'Primary role', value: 'Public trust and listing operator object' },
            { label: 'Core section', value: 'Property and regulated inventory' },
            { label: 'Commercial fit', value: 'Agency packages and premium exposure' }
          ]}
          primaryHref="/property/long_term/dubai"
          primaryLabel="Explore property"
          secondaryHref="/pricing"
          secondaryLabel="List your agency"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <OperatorSectionHeading
            eyebrow="Agency profiles"
            title="A strong public agency page should carry both trust and market relevance."
            description="That means the user should understand who the company is, what kind of inventory it operates, and why its listings feel safer before opening any listing detail page."
          />
          <OperatorProfileGrid items={agencyProfiles} basePath="/agencies" />
        </section>

        <OperatorTrustPanel
          title="Property trust starts with operator identity, not only with the listing card."
          description="Agency pages are one of the cleanest ways to make compliance, verification, and public company posture visible in the product."
          signals={agencyProfiles[0]?.trustSignals || []}
        />
      </div>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Operator lanes"
          title="Agency pages should route users into the right property contexts naturally."
          description="This is where the public business layer connects to regulated property discovery, branch credibility, and stronger listing trust."
        />
        <OperatorLaneGrid items={agencyProfiles[0]?.lanes || []} />
      </section>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Marketplace fit"
          title="Operator profiles are some of the strongest premium surfaces in the whole portal."
          description="Handled well, they improve trust, SEO, monetization, and lead quality at the same time."
        />
        <OperatorHighlightGrid items={operatorHighlights} />
      </section>
    </SectionPage>
  );
}
