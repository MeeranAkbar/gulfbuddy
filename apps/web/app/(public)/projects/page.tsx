import { SectionPage } from '../../../components/section-page';

const projectLanes = [
  {
    title: 'Developer branding',
    description: 'Projects should give developers a reusable branded surface instead of fragmenting attention across individual unit listings.'
  },
  {
    title: 'Inventory aggregation',
    description: 'Units, launch pricing, and handover status can be grouped under one clean project object with shared narrative and assets.'
  },
  {
    title: 'Trust and compliance',
    description: 'Project pages can show stronger developer identity, clearer stage visibility, and better moderation posture than loose off-plan ads.'
  }
];

export default function ProjectsPage() {
  return (
    <SectionPage
      eyebrow="Projects"
      title="Project pages are the structured layer behind off-plan inventory and developer storytelling."
      description="Instead of repeating the same launch content across many units, GulfHabibi project pages are meant to act as reusable public objects for branding, handover visibility, pricing context, and trust-first discovery."
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Project Surfaces</h2>
          <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
            <p>Developer identity and trust posture</p>
            <p>Handover timing, location, and pricing bands</p>
            <p>Related units, campaigns, and launch visibility</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <div className="grid gap-4">
          {projectLanes.map((lane) => (
            <article key={lane.title} className="gh-surface rounded-[1.75rem] p-6 md:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-ink">{lane.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{lane.description}</p>
            </article>
          ))}
        </div>

        <div className="gh-surface rounded-[1.75rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why This Matters</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Improves SEO by concentrating off-plan context into stronger public pages.</div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Reduces duplicate inventory storytelling across developer launches.</div>
            <div className="gh-surface-alt rounded-[1.35rem] p-4">Creates a better premium discovery layer for buyers, agencies, and developers.</div>
          </div>
        </div>
      </div>
    </SectionPage>
  );
}
