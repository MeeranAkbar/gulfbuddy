import type { Metadata } from 'next';
import {
  ClassifiedsCategoryGrid,
  ClassifiedsEmirateGrid,
  ClassifiedsHeroAside,
  ClassifiedsHighlightGrid,
  ClassifiedsListingGrid,
  ClassifiedsSearchConsole,
  ClassifiedsSectionHeading,
  ClassifiedsTrustPanel
} from '../../../components/classifieds/classifieds-discovery';
import { SectionPage } from '../../../components/section-page';
import {
  classifiedsCategories,
  classifiedsEmirates,
  classifiedsHighlights,
  classifiedsListings,
  classifiedsMetrics,
  classifiedsQuickFilters,
  classifiedsSearchFields,
  classifiedsTrustSignals
} from '../../../lib/classifieds/public-content';

export const metadata: Metadata = {
  title: 'UAE Classifieds | GulfHabibi',
  description:
    'Explore GulfHabibi Classifieds as a cleaner UAE resale marketplace with premium category lanes, visible seller trust, and calmer local discovery.'
};

export default function ClassifiedsPage() {
  return (
    <SectionPage
      eyebrow="Classifieds"
      title="Classifieds should feel fast and effortless without falling into open-board chaos."
      description="GulfHabibi Classifieds is being shaped as a cleaner UAE resale lane with stronger seller identity, calmer category pages, and premium scan speed that feels sharper than generic open marketplaces."
      imageUrl="https://images.unsplash.com/photo-1555529771-835f59bfc50c?auto=format&fit=crop&w=2000&q=80"
      aside={
        <ClassifiedsHeroAside
          metrics={classifiedsMetrics}
          primaryHref="/classifieds/dubai"
          primaryLabel="Explore classifieds"
          secondaryHref="/login"
          secondaryLabel="Start selling"
        />
      }
    >
      <ClassifiedsSearchConsole fields={classifiedsSearchFields} filters={classifiedsQuickFilters} actionHref="/classifieds/search" actionLabel="Browse listings" />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <ClassifiedsSectionHeading
            eyebrow="Category lanes"
            title="The fastest classifieds experiences start with clear category lanes, not filter overload."
            description="Electronics, furniture, baby goods, and fashion should each carry their own scanning rhythm and trust language inside the same premium system."
          />
          <ClassifiedsCategoryGrid items={classifiedsCategories} />
        </section>

        <ClassifiedsTrustPanel
          title="Seller trust should be visible even in the lightest product lane."
          description="A good classifieds section still needs moderation, duplicate control, and cleaner seller posture so users do not feel like they have stepped into an unmanaged ad board."
          signals={classifiedsTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <ClassifiedsSectionHeading
          eyebrow="Local lanes"
          title="Emirate pages should keep resale discovery local, fast, and premium."
          description="Local search works better when users can move directly into stronger emirate routes instead of wading through one endless national feed."
        />
        <ClassifiedsEmirateGrid items={classifiedsEmirates} />
      </section>

      <section className="space-y-6">
        <ClassifiedsSectionHeading
          eyebrow="Featured listings"
          title="Premium classifieds cards should stay elegant, not loud."
          description="Featured visibility should strengthen the browsing experience through better presentation and trust cues, not through noisy ad-like merchandising."
        />
        <ClassifiedsListingGrid items={classifiedsListings.slice(0, 3)} />
      </section>

      <section className="space-y-6">
        <ClassifiedsSectionHeading
          eyebrow="Marketplace fit"
          title="The best classifieds products keep speed, trust, and monetization in balance."
          description="That balance is what turns a basic resale board into a durable premium marketplace lane."
        />
        <ClassifiedsHighlightGrid items={classifiedsHighlights} />
      </section>
    </SectionPage>
  );
}
