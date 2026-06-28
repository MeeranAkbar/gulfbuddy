import type { Metadata } from 'next';
import {
  PropertyCommunityGrid,
  PropertyHeroAside,
  PropertyModeOverviewGrid,
  PropertyOperatorGrid,
  PropertySearchConsole,
  PropertySectionHeading,
  PropertyShowcaseGrid,
  PropertyTrustPanel
} from '../../../components/property/property-discovery';
import { SectionPage } from '../../../components/section-page';
import {
  getPropertyModeConfig,
  propertyEmirateSpotlights,
  propertyLandingCollections,
  propertyLandingOperators,
  propertyLandingTrustSignals,
  propertyModeOrder
} from '../../../lib/property/public-content';

export const metadata: Metadata = {
  title: 'UAE Property Marketplace | GulfHabibi',
  description:
    'Search GulfHabibi Property for homes, projects, rentals, and off-plan launches across the UAE with cleaner trust signals, stronger company visibility, and premium public pages.'
};

const propertyModes = propertyModeOrder
  .map((marketMode) => getPropertyModeConfig(marketMode))
  .filter((mode): mode is NonNullable<ReturnType<typeof getPropertyModeConfig>> => Boolean(mode));

const primaryPropertyMode = getPropertyModeConfig('long_term');

export default function PropertyPage() {
  if (!primaryPropertyMode) {
    return null;
  }

  return (
    <SectionPage
      eyebrow="Property Marketplace"
      title="Search homes, projects, and investment opportunities through a cleaner UAE property portal."
      description="Browse sale, rent, off-plan, short-stay, and project lanes with stronger company visibility, sharper local search, and calmer listing pages."
      imageUrl="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
      aside={
        <PropertyHeroAside
          metrics={[
            { label: 'Discovery lanes', value: 'Long-term, short stay, off-plan, and new projects' },
            { label: 'Public posture', value: 'Trust-first pages with cleaner company visibility' },
            { label: 'Revenue fit', value: 'Launch campaigns, premium placements, and profile-driven leads' }
          ]}
          primaryHref="/property/long_term"
          primaryLabel="Open Property"
          secondaryHref="/listings/property/new"
          secondaryLabel="Start posting"
        />
      }
    >
      <PropertySearchConsole activeMode={primaryPropertyMode} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <PropertySectionHeading
            eyebrow="Discovery lanes"
            title="Each property lane is built for a different kind of search."
            description="Sale, rent, off-plan, and project discovery each need their own filters, trust cues, and premium surfaces so the page stays useful instead of overloaded."
          />
          <PropertyModeOverviewGrid modes={propertyModes} />
        </section>

        <PropertyTrustPanel
          title="Trust should be visible before a user opens the first listing."
          description="Permit-aware publishing, visible company identity, and cleaner local routing make the property module feel safer and more premium from the first screen."
          signals={propertyLandingTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <PropertySectionHeading
          eyebrow="Local discovery"
          title="Strong emirate and area pages turn search into a real local journey."
          description="Property discovery in the UAE is deeply location-led, so the first move should be into believable local pages, not weak filter states or empty combinations."
        />
        <PropertyCommunityGrid
          communities={propertyEmirateSpotlights.map((emirate) => ({
            name: emirate.label,
            focus: emirate.headline,
            detail: emirate.summary
          }))}
          actionHref="/property/long_term"
          actionLabel="Open market lane"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <PropertySectionHeading
            eyebrow="Premium inventory framing"
            title="Featured inventory should feel curated, not noisy."
            description="Prime communities, launch projects, and premium operators can all be highlighted without turning the property page into an ad board."
          />
          <PropertyShowcaseGrid items={propertyLandingCollections} marketMode="long_term" />
        </section>

        <section className="space-y-6">
          <PropertySectionHeading
            eyebrow="Operator fit"
            title="Agencies, developers, and operators need distinct public identity."
            description="Better public operator pages make the property module feel more trustworthy and help buyers understand who is actually behind the inventory."
          />
          <PropertyOperatorGrid items={propertyLandingOperators} />
        </section>
      </div>
    </SectionPage>
  );
}
