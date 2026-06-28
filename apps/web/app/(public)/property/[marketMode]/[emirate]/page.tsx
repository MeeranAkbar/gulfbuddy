import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  PropertyCommunityGrid,
  PropertyHeroAside,
  PropertyOperatorGrid,
  PropertySearchConsole,
  PropertySectionHeading,
  PropertyShowcaseGrid,
  PropertyTrustPanel
} from '../../../../../components/property/property-discovery';
import { SectionPage } from '../../../../../components/section-page';
import {
  buildLocalOperatorHighlights,
  getPropertyEmirateSpotlight,
  getPropertyModeConfig,
  propertyEmirateSpotlights,
  propertyModeOrder
} from '../../../../../lib/property/public-content';

interface PropertyMarketModeEmiratePageProps {
  params: Promise<{ marketMode: string; emirate: string }>;
}

export function generateStaticParams() {
  return propertyModeOrder.flatMap((marketMode) =>
    propertyEmirateSpotlights.map((emirate) => ({
      marketMode,
      emirate: emirate.slug
    }))
  );
}

export async function generateMetadata({ params }: PropertyMarketModeEmiratePageProps): Promise<Metadata> {
  const { marketMode, emirate } = await params;
  const mode = getPropertyModeConfig(marketMode);
  const emirateSpotlight = getPropertyEmirateSpotlight(emirate);

  if (!mode) {
    return {
      title: 'Property | GulfHabibi'
    };
  }

  return {
    title: `${mode.label} in ${emirateSpotlight.label} | GulfHabibi`,
    description: `${mode.label} discovery in ${emirateSpotlight.label} with stronger local trust signals, public company identity, and premium property page structure.`
  };
}

export default async function PropertyMarketModeEmiratePage({ params }: PropertyMarketModeEmiratePageProps) {
  const { marketMode, emirate } = await params;
  const mode = getPropertyModeConfig(marketMode);

  if (!mode) {
    notFound();
  }

  const emirateSpotlight = getPropertyEmirateSpotlight(emirate);

  return (
    <SectionPage
      eyebrow={`${mode.label} - ${emirateSpotlight.label}`}
      title={`${mode.label} in ${emirateSpotlight.label}`}
      description={emirateSpotlight.summary}
      aside={
        <PropertyHeroAside
          metrics={[
            { label: 'Local headline', value: emirateSpotlight.headline },
            { label: 'Mode', value: mode.label },
            { label: 'Search focus', value: 'Local communities, trusted operators, and featured stock' }
          ]}
          primaryHref={`/property/${mode.marketMode}`}
          primaryLabel={`Back to ${mode.label}`}
          secondaryHref="/listings/property/new"
          secondaryLabel="Post local stock"
        />
      }
    >
      <PropertySearchConsole
        activeMode={mode}
        emirateLabel={emirateSpotlight.label}
        emirateSlug={emirateSpotlight.slug}
        initialFilters={{ marketMode: mode.marketMode, emirate: emirateSpotlight.slug }}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <PropertySectionHeading
            eyebrow="Community focus"
            title={`Popular communities in ${emirateSpotlight.label}`}
            description="Browse the neighborhoods that shape demand in this emirate, from lifestyle hotspots to family communities and project-led areas."
          />
          <PropertyCommunityGrid communities={emirateSpotlight.communities} actionHref={`/property/${mode.marketMode}`} actionLabel="Compare this lane" />
        </section>

        <PropertyTrustPanel
          title="Local trust signals stay visible on the first scroll."
          description={`In ${emirateSpotlight.label}, buyers and renters should quickly understand which operators are credible and why the lane feels cleaner than a noisy generic portal.`}
          signals={[
            `Verified operators for ${mode.label.toLowerCase()}`,
            `${emirateSpotlight.label} company pages with cleaner public identity`,
            'Local reporting and duplicate checks before risky supply goes live',
            'Premium placements that sit inside the experience instead of overwhelming it'
          ]}
        />
      </div>

      <section className="space-y-6">
        <PropertySectionHeading
          eyebrow="Local showcase"
          title={`${mode.label} inventory in ${emirateSpotlight.label}`}
          description="The first inventory row should immediately show what this local market is known for, from waterfront apartments to family villas or project-led launches."
        />
        <PropertyShowcaseGrid items={mode.showcaseItems} marketMode={mode.marketMode} emirateLabel={emirateSpotlight.label} />
      </section>

      <section className="space-y-6">
        <PropertySectionHeading
          eyebrow="Operator mix"
          title="Meet the operators active in this emirate."
          description="Local property discovery gets much stronger when users can clearly see which agencies, developers, and approved operators are behind the stock."
        />
        <PropertyOperatorGrid items={buildLocalOperatorHighlights(mode.marketMode, emirateSpotlight.label)} />
      </section>
    </SectionPage>
  );
}
