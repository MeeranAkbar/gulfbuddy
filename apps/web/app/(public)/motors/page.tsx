import type { Metadata } from 'next';
import {
  MotorsCategoryGrid,
  MotorsHeroAside,
  MotorsOperatorGrid,
  MotorsSearchConsole,
  MotorsSectionHeading,
  MotorsShowcaseGrid,
  MotorsTrustPanel
} from '../../../components/motors/motors-discovery';
import { SectionPage } from '../../../components/section-page';
import {
  motorsCategoryLanes,
  motorsMetrics,
  motorsOperatorHighlights,
  motorsQuickFilters,
  motorsSearchFields,
  motorsShowcaseItems,
  motorsTrustSignals
} from '../../../lib/motors/public-content';

export const metadata: Metadata = {
  title: 'UAE Motors Marketplace | GulfHabibi',
  description:
    'Explore GulfHabibi Motors as a dealer-ready UAE vehicle marketplace with cleaner trust signals, stronger dealer branding, and premium public search design.'
};

export default function MotorsPage() {
  return (
    <SectionPage
      eyebrow="Motors Marketplace"
      title="Find dealer and seller stock in a cleaner, trust-first vehicle marketplace."
      description="Search cars, SUVs, EVs, and commercial vehicles with sharper comparison cards, visible dealer identity, and a calmer public experience than ordinary vehicle classifieds."
      imageUrl="https://images.unsplash.com/photo-1503376712344-652bb8fc59eb?auto=format&fit=crop&w=2000&q=80"
      aside={
        <MotorsHeroAside
          metrics={motorsMetrics}
          primaryHref="/motors"
          primaryLabel="Explore Motors"
          secondaryHref="/pricing"
          secondaryLabel="For dealers"
        />
      }
    >
      <MotorsSearchConsole fields={motorsSearchFields} filters={motorsQuickFilters} actionHref="/motors/search" actionLabel="Search inventory" />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <MotorsSectionHeading
            eyebrow="Category lanes"
            title="Vehicle discovery works best when it is organised around buying intent."
            description="SUVs, sedans, EVs, and commercial stock each need their own pace, specs, and seller trust cues for fast comparison."
          />
          <MotorsCategoryGrid items={motorsCategoryLanes} />
        </section>

        <MotorsTrustPanel
          title="Buyers should understand the seller before they open a lead action."
          description="Dealer-backed stock, duplicate controls, and clearer listing facts help the motors section feel premium and believable."
          signals={motorsTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <MotorsSectionHeading
          eyebrow="Inventory framing"
          title="High-value stock should feel curated, fast to scan, and easy to compare."
          description="Price, mileage, condition, and seller identity should all be visible without forcing the user through clutter."
        />
        <MotorsShowcaseGrid items={motorsShowcaseItems} />
      </section>

      <section className="space-y-6">
        <MotorsSectionHeading
          eyebrow="Operator fit"
          title="Dealers, sellers, and promoted slots should fit one calm system."
          description="Public inventory can stay premium even with promotions, as long as ranking and layout stay controlled."
        />
        <MotorsOperatorGrid items={motorsOperatorHighlights} />
      </section>
    </SectionPage>
  );
}
