import type { Metadata } from 'next';
import {
  OperatorHeroAside,
  OperatorHighlightGrid,
  OperatorLaneGrid,
  OperatorSectionHeading,
  OperatorTrustPanel
} from '../../../../components/operators/operator-discovery';
import { SectionPage } from '../../../../components/section-page';
import { developerProfiles, getDeveloperProfile, operatorHighlights } from '../../../../lib/operators/public-content';

interface DeveloperProfilePageProps {
  params: Promise<{ developerSlug: string }>;
}

export function generateStaticParams() {
  return developerProfiles.map((profile) => ({ developerSlug: profile.slug }));
}

export async function generateMetadata({ params }: DeveloperProfilePageProps): Promise<Metadata> {
  const { developerSlug } = await params;
  const profile = getDeveloperProfile(developerSlug);

  return {
    title: `${profile.name} | Developer Profile | GulfHabibi`,
    description: profile.summary
  };
}

export default async function DeveloperProfilePage({ params }: DeveloperProfilePageProps) {
  const { developerSlug } = await params;
  const profile = getDeveloperProfile(developerSlug);

  return (
    <SectionPage
      eyebrow="Developer Public Profile"
      title={`${profile.name} should feel like a premium launch operator, not a generic company page.`}
      description={profile.summary}
      aside={
        <OperatorHeroAside
          metrics={profile.metrics}
          primaryHref="/developers"
          primaryLabel="All developers"
          secondaryHref="/property/new_project/dubai"
          secondaryLabel="Project lane"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="gh-card overflow-hidden">
          <div className="min-h-[18rem] bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.24),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge) => (
                <span key={badge} className="gh-pill">
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-10 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{profile.category}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{profile.headline}</h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{profile.summary}</p>
            </div>
          </div>
        </section>

        <OperatorTrustPanel
          title="Developer trust should frame the whole launch experience."
          description="When the developer object is strong, project pages and off-plan discovery can feel more structured and less promotional."
          signals={profile.trustSignals}
        />
      </div>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Operator lanes"
          title="Developer pages should lead naturally into projects, campaigns, and new-project discovery."
          description="That is how the public brand layer becomes commercially powerful without losing product clarity."
        />
        <OperatorLaneGrid items={profile.lanes} />
      </section>

      <section className="space-y-6">
        <OperatorSectionHeading
          eyebrow="Why it matters"
          title="This layer is where off-plan identity becomes more premium and more trustworthy."
          description="Handled well, developer pages can become some of the strongest branded public surfaces in the portal."
        />
        <OperatorHighlightGrid items={operatorHighlights} />
      </section>
    </SectionPage>
  );
}
