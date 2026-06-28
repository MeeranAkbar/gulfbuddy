import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  DirectoryBusinessGrid,
  DirectoryCategoryGrid,
  DirectoryHeroAside,
  DirectorySectionHeading,
  DirectoryTrustPanel
} from '../../../../../components/directory/directory-discovery';
import { SectionPage } from '../../../../../components/section-page';
import {
  directoryBusinessProfiles,
  directoryCategories,
  directoryEmirates,
  getDirectoryEmirateSpotlight,
  humanizeSlug,
  slugifyLabel
} from '../../../../../lib/directory/public-content';

interface AreaDetailPageProps {
  params: Promise<{ emirate: string; areaSlug: string }>;
}

export function generateStaticParams() {
  return directoryEmirates.flatMap((emirate) =>
    emirate.topAreas.map((area) => ({
      emirate: emirate.slug,
      areaSlug: slugifyLabel(area.name)
    }))
  );
}

export async function generateMetadata({ params }: AreaDetailPageProps): Promise<Metadata> {
  const { emirate, areaSlug } = await params;
  const spotlight = getDirectoryEmirateSpotlight(emirate);
  const areaName = humanizeSlug(areaSlug);

  return {
    title: `${areaName} in ${spotlight.label} | GulfHabibi Area Hub`,
    description: `${areaName} in ${spotlight.label} as a premium local discovery hub for business profiles and category-led search.`
  };
}

export default async function AreaDetailPage({ params }: AreaDetailPageProps) {
  const { emirate, areaSlug } = await params;
  const spotlight = getDirectoryEmirateSpotlight(emirate);
  const area = spotlight.topAreas.find((item) => slugifyLabel(item.name) === areaSlug);

  if (!area) {
    notFound();
  }

  return (
    <SectionPage
      eyebrow={`${area.name} · ${spotlight.label}`}
      title={`${area.name} should feel like a premium local business hub, not a thin area route.`}
      description={area.detail}
      aside={
        <DirectoryHeroAside
          metrics={[
            { label: 'Area focus', value: area.focus },
            { label: 'Emirate', value: spotlight.label },
            { label: 'Best action', value: 'Compare businesses and category lanes' }
          ]}
          primaryHref={`/directory/${emirate}`}
          primaryLabel={`Back to ${spotlight.label}`}
          secondaryHref="/businesses"
          secondaryLabel="Business profiles"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <DirectorySectionHeading
            eyebrow="Category fit"
            title={`${area.name} should open into stronger category lanes instead of a cluttered local result list.`}
            description="Area hubs work best when they explain what kind of business demand defines the neighborhood and where the user should go next."
          />
          <DirectoryCategoryGrid items={directoryCategories} emirateSlug={emirate} />
        </section>

        <DirectoryTrustPanel
          title="Area pages should keep local discovery structured and calm."
          description="This page should help users understand what kinds of businesses matter here, why the area is relevant, and which profile lanes are worth exploring."
          signals={[
            'Area pages should connect local intent to profile quality',
            'Neighborhood discovery should support business trust, not only raw visibility',
            'Better local structure helps the directory scale without creating thin pages',
            'Premium design keeps area hubs useful for both SEO and users'
          ]}
        />
      </div>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Business examples"
          title="Area hubs should show what strong local public profiles look like."
          description="A few high-quality examples help the page feel more real and make the directory system easier to understand."
        />
        <DirectoryBusinessGrid items={directoryBusinessProfiles.slice(0, 3)} />
      </section>
    </SectionPage>
  );
}
