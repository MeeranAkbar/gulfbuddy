import type { Metadata } from 'next';
import {
  DirectoryAreaGrid,
  DirectoryEmirateGrid,
  DirectoryHeroAside,
  DirectorySectionHeading,
  DirectoryTrustPanel
} from '../../../components/directory/directory-discovery';
import { SectionPage } from '../../../components/section-page';
import { directoryEmirates, directoryMetrics, directoryTrustSignals } from '../../../lib/directory/public-content';

export const metadata: Metadata = {
  title: 'Area Hubs | GulfHabibi',
  description: 'Explore GulfHabibi area hubs as premium local discovery pages connecting business profiles, categories, and stronger local-intent search.'
};

export default function AreasPage() {
  return (
    <SectionPage
      eyebrow="Area Hubs"
      title="Area pages are where local SEO, business profiles, and marketplace discovery should meet cleanly."
      description="Area hubs should become the connective layer across directory, services, property, and future editorial routes, all with stronger local identity and controlled indexability."
      aside={
        <DirectoryHeroAside
          metrics={directoryMetrics}
          primaryHref="/directory"
          primaryLabel="Open directory"
          secondaryHref="/businesses"
          secondaryLabel="Business profiles"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <DirectorySectionHeading
            eyebrow="Emirate lanes"
            title="Area strategy should begin with strong emirate hubs."
            description="Once the emirate lane is strong, area pages can turn into richer local entry points for business discovery, services, and future content."
          />
          <DirectoryEmirateGrid items={directoryEmirates} />
        </section>

        <DirectoryTrustPanel
          title="Area pages should feel intentional, not mass-generated."
          description="A premium local marketplace should use area hubs to improve navigation and trust, not just to create thin indexable pages."
          signals={directoryTrustSignals}
        />
      </div>

      <section className="space-y-6">
        <DirectorySectionHeading
          eyebrow="Top local areas"
          title="Good area hubs should highlight real clusters of local demand."
          description="The first generation of area pages can start by surfacing strong neighborhoods inside the top emirates, then expand once live data grows."
        />
        <div className="grid gap-6">
          {directoryEmirates.map((emirate) => (
            <section key={emirate.slug} className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{emirate.label}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{emirate.headline}</h3>
              </div>
              <DirectoryAreaGrid items={emirate.topAreas} actionHref={`/directory/${emirate.slug}`} actionLabel="Open local directory" />
            </section>
          ))}
        </div>
      </section>
    </SectionPage>
  );
}
