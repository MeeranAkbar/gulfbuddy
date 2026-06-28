import Link from 'next/link';
import { HomepageHeroSearch } from '../../components/search/homepage-hero-search';
import { AdBanner } from '../../components/ui/ad-banner';

const sectionTiles = [
  { 
    title: 'Property', href: '/property/search', meta: 'Homes / projects / rent', 
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    color: 'from-blue-600/80 to-blue-900/90'
  },
  { 
    title: 'Motors', href: '/motors/search', meta: 'Cars / SUVs / dealers', 
    imageUrl: 'https://images.unsplash.com/photo-1503376712344-652bb8fc59eb?auto=format&fit=crop&w=800&q=80',
    color: 'from-orange-600/80 to-orange-900/90'
  },
  { 
    title: 'Jobs', href: '/jobs/search', meta: 'Roles / employers / apply', 
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
    color: 'from-green-600/80 to-green-900/90'
  },
  { 
    title: 'Services', href: '/services/search', meta: 'Providers / quotes / local', 
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    color: 'from-red-600/80 to-red-900/90'
  },
  { 
    title: 'Directory', href: '/directory/search', meta: 'Businesses / categories / areas', 
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    color: 'from-yellow-600/80 to-yellow-900/90'
  },
  { 
    title: 'Classifieds', href: '/classifieds/search', meta: 'Resale / deals / promoted', 
    imageUrl: 'https://images.unsplash.com/photo-1588702545922-77eb618a8ea4?auto=format&fit=crop&w=800&q=80',
    color: 'from-purple-600/80 to-purple-900/90'
  }
] as const;

const featuredCards = [
  {
    badge: 'Property',
    title: 'Marina-facing apartment with permit-backed visibility',
    meta: 'Dubai Marina / AED 2.45M',
    href: '/property/listing/waterfront-apartments-with-cleaner-comparison-flow',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    badge: 'Motors',
    title: 'Dealer-certified premium SUV with low-mileage profile',
    meta: 'Al Quoz / AED 228,000',
    href: '/motors/premium-suvs-with-stronger-dealer-identity-and-faster-comparison-flow',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    badge: 'Jobs',
    title: 'Regional finance manager with verified employer profile',
    meta: 'Dubai / Full time',
    href: '/jobs/dubai',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
  }
] as const;

const trustTiles = [
  ['Verified operators', 'Agencies, dealers, employers, and providers are surfaced with cleaner trust cues.'],
  ['Search-first discovery', 'One gateway routes people into the right section without making the homepage feel crowded.'],
  ['Premium placements', 'Banner and featured inventory can slot in cleanly without breaking the layout.']
] as const;

const heroSignals = [
  ['7 emirates', 'Location starts from the first click'],
  ['Smart routing', 'Search moves into the right section'],
  ['One portal', 'Homes, cars, jobs, services, and business discovery']
] as const;

export default function HomePage() {
  return (
    <div className="space-y-8 md:space-y-12">
      <section className="relative overflow-hidden rounded-[2.4rem] bg-[#0b1220] shadow-[var(--shadow-lg)]">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80"
          alt="Luxury modern property exterior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.48),rgba(7,12,24,0.82))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(224,182,75,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(72,93,139,0.26),transparent_28%)]" />

        <div className="relative z-10 px-5 py-8 md:px-10 md:py-12 xl:px-14 xl:py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <span className="inline-flex rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/88">
              UAE multi-category marketplace
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl md:leading-[0.98] xl:text-7xl">
              Find anything in the UAE
              <span className="block text-[#e0b64b]">all in one place.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-white/78 md:text-lg">
              One trusted platform to browse motors, property, jobs, classifieds, services, and businesses across all seven emirates.
            </p>

            <div className="mt-8 w-full max-w-5xl">
              <HomepageHeroSearch />
            </div>

            <div className="mt-6 grid w-full max-w-4xl gap-3 md:grid-cols-3">
              {heroSignals.map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-[1.2rem] border border-white/20 bg-black/40 px-5 py-4 text-left backdrop-blur-md shadow-lg"
                >
                  <p className="text-[0.95rem] font-bold text-white tracking-tight">{title}</p>
                  <p className="mt-1.5 text-sm font-medium text-white/90">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdBanner type="leaderboard" />

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="gh-card p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Marketplace sections</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink md:text-3xl">
                Browse the section that matches the intent.
              </h2>
            </div>
            <Link href="/pricing" className="gh-button-secondary">
              Pricing
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sectionTiles.map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--border-default)] hover:shadow-[var(--shadow-md)] h-48 flex flex-col justify-end"
              >
                <img src={tile.imageUrl} alt={tile.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-t ${tile.color} mix-blend-multiply opacity-80 transition-opacity group-hover:opacity-90`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="relative z-10">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/80">{tile.meta}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <h3 className="text-2xl font-bold tracking-tight text-white">{tile.title}</h3>
                    <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-transform group-hover:translate-x-2">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="overflow-hidden rounded-[1.7rem] bg-[linear-gradient(135deg,#10192f,#213865)] shadow-[var(--shadow-md)]">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/60">Premium ad zone</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Hero banner placement</h2>
            </div>
            <div className="space-y-5 p-6 text-white">
              <p className="max-w-md text-sm leading-7 text-white/74">
                Launch project, dealer, employer, or provider campaigns in a premium slot that disappears cleanly when ads are off.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/84">
                  Hero top banner
                </span>
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/84">
                  Desktop + mobile
                </span>
              </div>
              <Link href="/campaigns" className="gh-button-secondary !border-white/18 !bg-white/10 !text-white hover:!bg-white/16">
                View campaign mockup
              </Link>
            </div>
          </div>

          <div className="gh-card p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Trust strip</p>
            <div className="mt-5 space-y-4">
              {trustTiles.map(([title, copy]) => (
                <div key={title} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gh-card p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Featured now</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink md:text-3xl">
              Featured inventory that makes the portal feel real.
            </h2>
          </div>
          <Link href="/search" className="gh-button-secondary">
            Open all discovery
          </Link>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          {featuredCards.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.04),rgba(7,12,24,0.42))]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/88 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {item.badge}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.meta}</p>
                <span className="mt-6 inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-2 text-sm font-semibold text-ink transition group-hover:translate-x-1">
                  Open detail
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
