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
import { dealerProfiles, operatorHighlights } from '../../../lib/operators/public-content';

export const metadata: Metadata = {
  title: 'Motors Dealers | GulfHabibi',
  description: 'Discover premium dealer profiles on GulfHabibi with verified branding, inventory trust, and cleaner motors operator identity.'
};

export default function DealersPage() {
  return (
    <SectionPage
      eyebrow="Motors Dealers"
      title="Dealer pages should feel like premium inventory brands, not seller placeholders."
      description="GulfHabibi dealer profiles are being built as sharper public objects for inventory trust, showroom branding, and faster lead confidence inside Motors."
      aside={
        <OperatorHeroAside
          metrics={[
            { label: 'Primary role', value: 'Dealer brand and inventory object' },
            { label: 'Core section', value: 'Motors and dealer inventory' },
            { label: 'Commercial fit', value: 'Featured vehicles and dealer packages' }
          ]}
          primaryHref="/motors"
          primaryLabel="Explore motors"
          secondaryHref="/company"
          secondaryLabel="Dealer workspace"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <OperatorSectionHeading
            eyebrow="Dealer profiles"
            title="A strong dealer page should make inventory feel more credible before the user even opens a vehicle."
            description="This is where Motors can separate itself from generic seller feeds by giving real dealers a cleaner, more premium public identity."
          />
          <OperatorProfileGrid items={dealerProfiles} basePath="/dealers" />
        </section>

        <OperatorTrustPanel
          title="Dealer identity is one of the biggest trust cues in the whole Motors section."
          description="The page should combine brand clarity, response posture, and inventory credibility without slipping into noisy automotive portal styling."
          signals={dealerProfiles[0]?.trustSignals || []}
        />
      </div>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Operator lanes"
          title="Dealer pages should connect cleanly to public browsing and private dealer operations."
          description="That link is what makes the dealer object useful for both customers and business users."
        />
        <OperatorLaneGrid items={dealerProfiles[0]?.lanes || []} />
      </section>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Marketplace fit"
          title="Dealer pages are long-term branding assets, not just inventory wrappers."
          description="Handled well, they improve lead confidence, repeat visits, and monetization without turning the page into a promo slab."
        />
        <OperatorHighlightGrid items={operatorHighlights} />
      </section>
    </SectionPage>
  );
}
