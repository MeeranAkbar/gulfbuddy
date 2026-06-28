import { SectionPage } from '../../../components/section-page';

const editorialLanes = [
  {
    title: 'Operator guides',
    description:
      'Practical publishing, verification, compliance, and package guidance for agencies, dealers, employers, and service providers.'
  },
  {
    title: 'Market explainers',
    description:
      'Local UAE context around property lanes, hiring demand, services discovery, and how trust-backed listing quality affects conversion.'
  },
  {
    title: 'Trust and compliance notes',
    description:
      'Clear explanations of moderation, permit expectations, reporting flows, and why GulfHabibi is being built as a controlled marketplace.'
  }
];

const featuredStories = [
  {
    category: 'Property Compliance',
    title: 'What permit-backed publishing should look like for Dubai property inventory',
    summary:
      'A strong public explainer for agencies, developers, and owners on why compliance evidence, review states, and trust badges matter.'
  },
  {
    category: 'Jobs',
    title: 'How verified employer pages can improve candidate confidence and application quality',
    summary:
      'Content that supports employer onboarding, public credibility, and a cleaner jobs marketplace without spam-heavy posting patterns.'
  },
  {
    category: 'Services',
    title: 'Why local service providers need stronger public profiles than a basic directory listing',
    summary:
      'A service-marketplace explainer focused on quote flows, profile quality, response expectations, and local SEO value.'
  }
];

export default function BlogPage() {
  return (
    <SectionPage
      eyebrow="Editorial"
      title="A premium content layer for onboarding, SEO growth, and marketplace education."
      description="GulfHabibi editorial should help users understand how the platform works, why trust controls matter, and how different verticals operate in the UAE market. It should support quality discovery without slipping into thin or repetitive AI content."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Editorial Standards</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
            <li>Helpful, specific, and operationally useful.</li>
            <li>Built to reinforce trust and section clarity.</li>
            <li>Structured for strong indexing, not content spam.</li>
          </ul>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Editorial Lanes</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {editorialLanes.map((lane) => (
              <article key={lane.title} className="gh-surface-alt rounded-[1.5rem] p-5">
                <h2 className="text-lg font-semibold text-ink">{lane.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{lane.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">What This Supports</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Better onboarding and fewer support tickets for posting, verification, and review flows.</div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Higher-quality public pages around local categories, operator profiles, and marketplace trust language.</div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">A stronger content foundation for future guides, comparisons, and local market explainers.</div>
          </div>
        </div>
      </div>

      <section className="gh-surface rounded-[1.75rem] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Featured Story Directions</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Editorial should teach users how to succeed on the platform.</h2>
          </div>
          <span className="rounded-full border border-[var(--border-default)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Planned launch content
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {featuredStories.map((story) => (
            <article key={story.title} className="gh-surface-alt rounded-[1.5rem] p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{story.category}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{story.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{story.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </SectionPage>
  );
}
