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
import { developerProfiles, operatorHighlights } from '../../../lib/operators/public-content';

export const metadata: Metadata = {
  title: 'Developers | GulfHabibi',
  description: 'Explore developer profiles on GulfHabibi with project trust, launch storytelling, and premium new-project identity.'
};

export default function DevelopersPage() {
  return (
    <SectionPage
      eyebrow="Developers"
      title="Developer pages should feel like premium launch objects, not brochure placeholders."
      description="GulfHabibi developer profiles are being built as public trust and launch surfaces that connect company identity, active projects, and monetizable campaign storytelling."
      aside={
        <OperatorHeroAside
          metrics={[
            { label: 'Primary role', value: 'Developer trust and project launch object' },
            { label: 'Core section', value: 'Off-plan and new projects' },
            { label: 'Commercial fit', value: 'Launch packages and project campaigns' }
          ]}
          primaryHref="/property/new_project/dubai"
          primaryLabel="Explore new projects"
          secondaryHref="/campaigns"
          secondaryLabel="Launch campaigns"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <OperatorSectionHeading
            eyebrow="Developer profiles"
            title="A strong developer page should anchor project trust before users browse inventory."
            description="That is how the off-plan experience feels calmer, clearer, and more premium than ordinary launch-marketing clutter."
          />
          <OperatorProfileGrid items={developerProfiles} basePath="/developers" />
        </section>

        <OperatorTrustPanel
          title="Developer identity should make launch pages feel more credible immediately."
          description="When developer trust is legible, project pages can focus on narrative and offer clarity instead of trying to prove legitimacy from scratch."
          signals={developerProfiles[0]?.trustSignals || []}
        />
      </div>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Operator lanes"
          title="Developer pages should connect directly to project objects and launch campaigns."
          description="That turns the developer layer into a real monetizable growth surface rather than a static brand bio."
        />
        <OperatorLaneGrid items={developerProfiles[0]?.lanes || []} />
      </section>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Marketplace fit"
          title="Developer profiles are where trust, storytelling, and monetization should meet cleanly."
          description="Handled well, these pages help GulfHabibi feel more premium than standard project-listing portals."
        />
        <OperatorHighlightGrid items={operatorHighlights} />
      </section>
    </SectionPage>
  );
}
