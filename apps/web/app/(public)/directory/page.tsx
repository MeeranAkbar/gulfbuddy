import type { Metadata } from 'next';
import {
  DirectoryBusinessGrid,
  DirectoryBusinessHighlightGrid,
  DirectoryCategoryGrid,
  DirectoryEmirateGrid,
  DirectoryHeroAside,
  DirectorySearchConsole,
  DirectorySectionHeading,
  DirectoryShowcaseGrid,
  DirectoryTrustPanel
} from '../../../components/directory/directory-discovery';
import { SectionPage } from '../../../components/section-page';
import {
  directoryBusinessHighlights,
  directoryBusinessProfiles,
  directoryCategories,
  directoryEmirates,
  directoryMetrics,
  directoryQuickFilters,
  directorySearchFields,
  directoryShowcaseItems,
  directoryTrustSignals
} from '../../../lib/directory/public-content';

export const metadata: Metadata = {
  title: 'UAE Business Directory | GulfHabibi',
  description:
    'Explore GulfHabibi Directory as a premium UAE business discovery engine with public business profiles, area-led search, and stronger local trust cues.'
};

export default function DirectoryPage() {
  return (
    <SectionPage
      eyebrow="Business Directory"
      title="Directory should feel like a premium local business discovery engine, not a thin list of names."
      description="GulfHabibi Directory is being shaped as a profile-first UAE business layer with stronger public brand pages, category and area SEO, and trust cues that feel calmer and more credible than generic local listings."
      imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
      aside={
        <DirectoryHeroAside
          metrics={directoryMetrics}
          primaryHref="/directory/dubai"
          primaryLabel="Explore directory"
          secondaryHref="/businesses"
          secondaryLabel="Business profiles"
        />
      }
    >
      <DirectorySearchConsole fields={directorySearchFields} filters={directoryQuickFilters} actionHref="/directory/search" actionLabel="Search businesses" />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <DirectorySectionHeading
            eyebrow="Category lanes"
            title="Business discovery should begin in clear category lanes, not a flat directory index."
            description="Dining, healthcare, beauty, and business services are better entry points than generic business sprawl because they build stronger intent and better local SEO."
          />
          <DirectoryCategoryGrid items={directoryCategories} />
        </section>

        <DirectoryTrustPanel
          title="Local trust should be part of the public directory language from the start."
          description="A premium directory should help users understand which businesses feel credible, which pages are structured, and why the profile is worth opening before any contact action."
          signals={directoryTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Local markets"
          title="Emirate pages should behave like strong local business hubs."
          description="The best directory routes combine category depth, area context, and profile quality into one calm public search layer."
        />
        <DirectoryEmirateGrid items={directoryEmirates} />
      </section>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Profile quality"
          title="Public business profiles should feel like brand assets, not contact cards."
          description="A stronger directory is built on shareable public profiles that support repeat trust, better local search, and cleaner monetization later."
        />
        <DirectoryBusinessGrid items={directoryBusinessProfiles} />
      </section>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Commercial fit"
          title="The directory should support premium growth without becoming an ad board."
          description="Featured profiles, profile depth, and category visibility should all feel native to the product instead of visually overwhelming it."
        />
        <DirectoryShowcaseGrid items={directoryShowcaseItems} />
      </section>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Growth layer"
          title="Public business identity is one of the strongest long-term growth assets in the whole platform."
          description="A clean directory product helps GulfHabibi earn organic visibility, stronger referrals, and more stable business-side monetization."
        />
        <DirectoryBusinessHighlightGrid items={directoryBusinessHighlights} />
      </section>
    </SectionPage>
  );
}
