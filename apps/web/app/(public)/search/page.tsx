import Link from 'next/link';
import { SectionPage } from '../../../components/section-page';
import { buildSearchHref, getSearchSectionConfig, popularSearchesBySection, searchSections, type SearchSection } from '../../../lib/search/catalog';

interface SearchPageProps {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
    section?: string;
  }>;
}

function normalizeSection(value?: string): SearchSection {
  if (!value) return 'all';
  return (searchSections.find((item) => item.key === value)?.key || 'all') as SearchSection;
}

function buildResultGroups(section: SearchSection, keyword: string, location: string) {
  const baseGroups = [
    {
      section: 'property',
      title: keyword ? `Property matches for "${keyword}"` : 'Property discovery',
      description: 'Area-led real estate discovery with structured filters for sale, rent, and projects.'
    },
    {
      section: 'motors',
      title: keyword ? `Motors matches for "${keyword}"` : 'Motors discovery',
      description: 'Vehicle search with dealer-aware inventory and comparison-friendly scanning.'
    },
    {
      section: 'jobs',
      title: keyword ? `Jobs matching "${keyword}"` : 'Jobs discovery',
      description: 'Role, employer, and category search designed for cleaner hiring journeys.'
    },
    {
      section: 'services',
      title: keyword ? `Service providers for "${keyword}"` : 'Services discovery',
      description: 'Local quote-ready provider search across categories, coverage, and trust posture.'
    },
    {
      section: 'directory',
      title: keyword ? `Business results for "${keyword}"` : 'Directory discovery',
      description: 'Category and location-led business profiles built for local discovery.'
    },
    {
      section: 'classifieds',
      title: keyword ? `Classifieds for "${keyword}"` : 'Classifieds discovery',
      description: 'Fast local consumer inventory with cleaner trust cues than open resale boards.'
    }
  ] as const;

  return baseGroups
    .filter((group) => section === 'all' || group.section === section)
    .map((group) => ({
      ...group,
      location,
      chips: popularSearchesBySection[group.section as SearchSection].slice(0, 3)
    }));
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const section = normalizeSection(resolved.section);
  const keyword = resolved.keyword?.trim() || '';
  const location = resolved.location?.trim() || '';
  const config = getSearchSectionConfig(section);
  const groups = buildResultGroups(section, keyword, location);
  const title =
    keyword && section === 'all'
      ? `Search across GulfHabibi for "${keyword}"`
      : keyword
        ? `Search ${config.label.toLowerCase()} for "${keyword}"`
        : section === 'all'
          ? 'Search across GulfHabibi'
          : `${config.label} search`;
  const description =
    section === 'all'
      ? location
        ? `All-section search should quickly route people into the right marketplace lane with location context in ${location}.`
        : 'All-section search should help visitors move from a broad search into the right marketplace lane without noisy dead ends.'
      : location
        ? `Showing structured search lanes for ${config.label.toLowerCase()} with location context in ${location}.`
        : `Browse ${config.label.toLowerCase()} with cleaner section-aware search, stronger filtering, and faster paths into the right marketplace lane.`;

  return (
    <SectionPage
      eyebrow="Search"
      title={title}
      description={description}
      aside={
        <div className="gh-surface-alt rounded-[1.75rem] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Search guide</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
            <p>Use this page to move quickly into the right section when your search could fit more than one marketplace lane.</p>
            <p>{location ? `Location context: ${location}` : 'No location filter applied yet.'}</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          {groups.map((group) => (
            <article key={group.section} className="gh-card p-6 md:p-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{group.section}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{group.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {group.description}
                    {group.location ? ` / Focused on ${group.location}.` : ''}
                  </p>
                </div>
                <Link href={buildSearchHref(group.section as SearchSection, keyword, location)} className="gh-button-secondary">
                  Open {group.section}
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {group.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Search tips</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>If you already know the section you want, open that vertical directly for a deeper local search experience.</p>
              <p>Short, specific keywords usually work best, especially when paired with an emirate, district, or business area.</p>
            </div>
          </section>
        </aside>
      </div>
    </SectionPage>
  );
}
