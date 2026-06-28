import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  PropertyEmirateGrid,
  PropertyHeroAside,
  PropertyOperatorGrid,
  PropertySearchConsole,
  PropertySectionHeading,
  PropertyShowcaseGrid,
  PropertyTrustPanel
} from '../../../../components/property/property-discovery';
import { SectionPage } from '../../../../components/section-page';
import { getPropertyModeConfig, propertyModeOrder } from '../../../../lib/property/public-content';

interface PropertyMarketModePageProps {
  params: Promise<{ marketMode: string }>;
}

export function generateStaticParams() {
  return propertyModeOrder.map((marketMode) => ({ marketMode }));
}

export async function generateMetadata({ params }: PropertyMarketModePageProps): Promise<Metadata> {
  const { marketMode } = await params;
  const mode = getPropertyModeConfig(marketMode);

  if (!mode) {
    return {
      title: 'Property | GulfHabibi'
    };
  }

  return {
    title: `${mode.label} Property | GulfHabibi`,
    description: mode.description
  };
}

export default async function PropertyMarketModePage({ params }: PropertyMarketModePageProps) {
  const { marketMode } = await params;
  const mode = getPropertyModeConfig(marketMode);

  if (!mode) {
    notFound();
  }

  return (
    <SectionPage
      eyebrow={mode.eyebrow}
      title={mode.title}
      description={mode.description}
      aside={
        <PropertyHeroAside
          metrics={mode.metrics}
          primaryHref={`/property/${mode.marketMode}`}
          primaryLabel={mode.searchActionLabel}
          secondaryHref="/listings/property/new"
          secondaryLabel="Post into this lane"
        />
      }
    >
      <PropertySearchConsole activeMode={mode} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <PropertySectionHeading
            eyebrow="Browse by emirate"
            title={`Start with the emirate that matches your ${mode.label.toLowerCase()} search.`}
            description="Open a local lane for Dubai, Abu Dhabi, Sharjah, or Ras Al Khaimah and go straight into communities, operators, and stock that fit the market."
          />
          <PropertyEmirateGrid marketMode={mode.marketMode} />
        </section>

        <PropertyTrustPanel
          title={`${mode.label} keeps trust visible without slowing the search.`}
          description="Every lane is built to show operator quality, safer inventory cues, and cleaner local routing before users commit to a deeper search."
          signals={mode.trustSignals}
        />
      </div>

      <section className="space-y-6">
        <PropertySectionHeading
          eyebrow="Signature inventory"
          title="Featured stock should feel sharp, visual, and easy to compare."
          description="See the kind of inventory that defines this lane first, with price, place, and operator signals staying clear at a glance."
        />
        <PropertyShowcaseGrid items={mode.showcaseItems} marketMode={mode.marketMode} />
      </section>

      <section className="space-y-6">
        <PropertySectionHeading
          eyebrow="Who is behind the stock"
          title="The right operator model should be obvious from the first scroll."
          description="Whether the supply comes from agencies, developers, owners, or managed operators, the page should make responsibility and quality clear."
        />
        <PropertyOperatorGrid items={mode.operatorHighlights} />
      </section>
    </SectionPage>
  );
}
