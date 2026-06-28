import type { Metadata } from 'next';
import {
  DirectoryBusinessGrid,
  DirectoryBusinessHighlightGrid,
  DirectoryHeroAside,
  DirectorySectionHeading,
  DirectoryTrustPanel
} from '../../../components/directory/directory-discovery';
import { SectionPage } from '../../../components/section-page';
import {
  directoryBusinessHighlights,
  directoryBusinessProfiles,
  directoryMetrics,
  directoryTrustSignals
} from '../../../lib/directory/public-content';

export const metadata: Metadata = {
  title: 'Business Profiles | GulfHabibi',
  description: 'Explore premium public business profiles in GulfHabibi with stronger trust cues, local discovery fit, and brand-first presentation.'
};

export default function BusinessesPage() {
  return (
    <SectionPage
      eyebrow="Business Profiles"
      title="Public business pages should be first-class growth assets, not side features."
      description="Each verified business should have a shareable public profile with stronger identity, category fit, branch clarity, and enough design quality to support SEO, trust, and repeat discovery."
      aside={
        <DirectoryHeroAside
          metrics={directoryMetrics}
          primaryHref="/directory"
          primaryLabel="Explore directory"
          secondaryHref="/areas"
          secondaryLabel="Area hubs"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <DirectorySectionHeading
            eyebrow="Profile examples"
            title="Business profiles should look like premium brand objects, not extended cards."
            description="The best public profiles blend local relevance, profile depth, verification, and contact clarity without feeling crowded or sales-heavy."
          />
          <DirectoryBusinessGrid items={directoryBusinessProfiles} />
        </section>

        <DirectoryTrustPanel
          title="Profile quality is one of the strongest trust signals in the whole portal."
          description="A stronger business profile helps users understand who the operator is, what they do, and why the page deserves confidence before any contact or lead action."
          signals={directoryTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Why it matters"
          title="Business profiles are where SEO, trust, and monetization meet."
          description="If these pages are strong, GulfHabibi gains better local search coverage, more shareable operator pages, and cleaner business-side revenue opportunities."
        />
        <DirectoryBusinessHighlightGrid items={directoryBusinessHighlights} />
      </section>
    </SectionPage>
  );
}
