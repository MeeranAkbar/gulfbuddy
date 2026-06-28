import Link from 'next/link';
import { WorkspacePage } from '../../../../components/workspace/workspace-page';

const postCategories = [
  {
    title: 'Property',
    meta: 'Residential & Commercial',
    description: 'Post apartments, villas, townhouses, off-plan developer projects, or short-term holiday stays with UAE compliance.',
    href: '/listings/property/new',
    badge: 'Trakheesi / Dari ready',
    badgeTone: 'accent',
    mark: 'P',
    details: ['Sale and Rent', 'Evidence verification', 'RERA compliant']
  },
  {
    title: 'Motors',
    meta: 'Cars, SUVs, Vans & Fleets',
    description: 'List certified used vehicles, SUV listings, electric cars, or commercial utility transport.',
    href: '/listings/motors/new',
    badge: 'Dealer storefront-ready',
    badgeTone: 'info',
    mark: 'M',
    details: ['Verified dealer badges', 'Year and Mileage options', 'Duplicate checks']
  },
  {
    title: 'Jobs',
    meta: 'Careers & Hiring',
    description: 'Publish open roles, candidate search criteria, employment opportunities, and corporate details.',
    href: '/listings/jobs/new',
    badge: 'Employer Verified',
    badgeTone: 'success',
    mark: 'J',
    details: ['Anti-scam verification', 'Salary transparency', 'Internal applicant panel']
  },
  {
    title: 'Services',
    meta: 'Local Professionals',
    description: 'List provider profiles, offer standard home maintenance services, beauty, or emergency jobs.',
    href: '/listings/services/new',
    badge: 'Quote bookings enabled',
    badgeTone: 'warning',
    mark: 'S',
    details: ['Commission dashboard', 'Coverage by Emirate', 'Client inquiries']
  },
  {
    title: 'Classifieds',
    meta: 'Resale Marketplace',
    description: 'Quickly resell electronics, furniture, books, clothing, or other consumer items locally.',
    href: '/listings/classifieds/new',
    badge: 'Zero fees',
    badgeTone: 'neutral',
    mark: 'C',
    details: ['Fast moderation', 'Phone protection option', 'Instant chat leads']
  },
  {
    title: 'Directory',
    meta: 'UAE Business Index',
    description: 'List or claim your business directory profile, area coordinates, tags, and reviews.',
    href: '/listings/directory/new',
    badge: 'Premium SEO ranking',
    badgeTone: 'featured',
    mark: 'D',
    details: ['Map integration', 'Rating widgets', 'Promotional campaigns']
  }
];

function getBadgeStyle(tone: string) {
  switch (tone) {
    case 'accent':
      return 'border-[color:var(--accent)]/30 bg-[var(--accent-soft)] text-ink';
    case 'info':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400';
    case 'success':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    case 'warning':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'featured':
      return 'border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400';
    default:
      return 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400';
  }
}

export default function NewListingWizardPage() {
  return (
    <WorkspacePage
      eyebrow="Posting Wizard"
      title="Choose a section to publish your inventory across the UAE."
      description="GulfHabibi provides dedicated compliance-aware and intent-focused posting flows for each category to ensure your listings are highly traceable, searchable, and trusted."
      actions={[
        { href: '/listings', label: 'Go to listings manager', tone: 'secondary' }
      ]}
      metrics={[
        { label: 'Category verticals', value: '6 available', hint: 'Property, Motors, Jobs, Services, Classifieds, Directory' },
        { label: 'Verified posting', value: '100% trace', hint: 'Every listing is tied to a company profile or registered user' },
        { label: 'Leads routing', value: 'Automated', hint: 'Direct WhatsApp, Phone, and email inquiries' }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postCategories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group flex flex-col justify-between rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#111827,#243b68)] text-base font-semibold text-white shadow-[var(--shadow-sm)] group-hover:scale-105 transition-transform duration-200">
                    {cat.mark}
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider ${getBadgeStyle(cat.badgeTone)}`}>
                    {cat.badge}
                  </span>
                </div>

                <div className="mt-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{cat.meta}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{cat.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{cat.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cat.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-2.5 py-1 text-[0.68rem] font-medium text-[var(--text-secondary)]"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center text-sm font-semibold text-ink group-hover:translate-x-1 transition-transform duration-200">
                  Select and continue &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </WorkspacePage>
  );
}
