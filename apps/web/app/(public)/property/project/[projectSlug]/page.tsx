import type { Metadata } from 'next';
import {
  PropertyHeroAside,
  PropertyOperatorGrid,
  PropertySectionHeading,
  PropertyTrustPanel
} from '../../../../../components/property/property-discovery';
import { SectionPage } from '../../../../../components/section-page';
import { getPropertyModeConfig, humanizeSlug } from '../../../../../lib/property/public-content';

interface PropertyProjectPageProps {
  params: Promise<{ projectSlug: string }>;
}

export async function generateMetadata({ params }: PropertyProjectPageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const projectName = humanizeSlug(projectSlug);

  return {
    title: `${projectName} | New Project Profile | GulfHabibi`,
    description: `${projectName} is a premium GulfHabibi project profile with developer identity, handover timing, payment-plan context, and launch-ready lead capture.`
  };
}

export default async function PropertyProjectPage({ params }: PropertyProjectPageProps) {
  const { projectSlug } = await params;
  const projectName = humanizeSlug(projectSlug);
  const newProjectMode = getPropertyModeConfig('new_project');

  if (!newProjectMode) {
    return null;
  }

  return (
    <SectionPage
      eyebrow="Project Profile"
      title={`${projectName}`}
      description="Explore project story, launch price, handover timing, and developer-backed confidence in one premium public profile."
      aside={
        <PropertyHeroAside
          metrics={[
            { label: 'Page type', value: 'Developer and launch profile' },
            { label: 'Lead path', value: 'High-intent project enquiries' },
            { label: 'Buyer view', value: 'Price, handover, and unit mix first' }
          ]}
          primaryHref="/property/new_project"
          primaryLabel="Explore new projects"
          secondaryHref="/campaigns"
          secondaryLabel="Launch campaign view"
        />
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="gh-card overflow-hidden">
          <div className="min-h-[18rem] bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.24),transparent_38%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="gh-pill">Developer launch</span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                New Project
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Premium profile
              </span>
            </div>
            <div className="mt-10 max-w-3xl">
              <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{projectName}</h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                A strong project page brings together masterplan context, developer identity, unit mix, payment-plan structure, and local market fit without turning into brochure clutter.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Launch price', 'From AED 1.18M'],
                ['Handover lane', 'Q4 2028'],
                ['Buyer angle', 'End-user + investor']
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-base font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Project snapshot</p>
            <div className="mt-5 space-y-4">
              {[
                ['Developer profile', 'Verified company page with active launches and project pipeline'],
                ['Payment plan', '80 / 20 or milestone-ready campaign presentation'],
                ['Unit mix', 'Studios, 1-3 beds, townhouses, branded inventory'],
                ['Lead path', 'Project-first inquiries plus agency distribution later']
              ].map(([label, copy]) => (
                <div key={label} className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <PropertyTrustPanel
            title="Confidence should come before urgency."
            description="The best launch pages make trust, delivery timing, and developer identity easy to understand before the sales language gets louder."
            signals={newProjectMode.trustSignals}
          />
        </aside>
      </div>

      <section className="space-y-6">
        <PropertySectionHeading
          eyebrow="What matters most"
          title="Project detail works best when the essentials stay structured."
          description="Users should be able to move from story to unit mix, price entry, handover, payment plan, and developer credibility without losing the page flow."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {[
            {
              title: 'Project story and position',
              copy: 'Explain what makes the project relevant in its local market, who it is for, and why it deserves attention now.'
            },
            {
              title: 'Unit mix and financial entry',
              copy: 'Show unit types, starting points, payment-plan rhythm, and handover clarity in a cleaner comparison-ready layout.'
            },
            {
              title: 'Developer + distribution trust',
              copy: 'Keep the developer identity visible while supporting agency distribution, lead routing, and premium campaign surfaces.'
            }
          ].map((item) => (
            <article key={item.title} className="gh-card p-6">
              <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <PropertySectionHeading
          eyebrow="Operator roles"
          title="Developer and agency roles should stay visible and controlled."
          description="A premium project profile should support direct developer storytelling and approved partner distribution without confusing the user about who owns the inventory."
        />
        <PropertyOperatorGrid items={newProjectMode.operatorHighlights} />
      </section>
    </SectionPage>
  );
}
