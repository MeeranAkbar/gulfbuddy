export interface OperatorMetric {
  label: string;
  value: string;
}

export interface OperatorHighlight {
  title: string;
  badge: string;
  detail: string;
  image?: string;
  imageUrl?: string;
}

export interface OperatorLane {
  title: string;
  href: string;
  detail: string;
}

export interface OperatorProfile {
  slug: string;
  name: string;
  category: string;
  headline: string;
  summary: string;
  badges: string[];
  metrics: OperatorMetric[];
  trustSignals: string[];
  lanes: OperatorLane[];
}

export const agencyProfiles: OperatorProfile[] = [
  {
    slug: 'harbor-key-properties',
    name: 'Harbor Key Properties',
    category: 'Property Agency',
    headline: 'An agency profile should make compliance, local credibility, and active inventory feel legible instantly.',
    summary:
      'Agency pages are one of the strongest trust objects in the whole Property stack. They should connect verified company identity, branch presence, broker posture, and live inventory in one premium public surface.',
    badges: ['Verified Agency', 'Permit-backed inventory', 'Multi-branch'],
    metrics: [
      { label: 'Primary market', value: 'Dubai long-term and off-plan' },
      { label: 'Profile role', value: 'Compliance-aware agency brand page' },
      { label: 'Commercial fit', value: 'Premium listings and launch distribution' }
    ],
    trustSignals: [
      'Broker identity and company verification should be obvious before users contact anyone.',
      'Permit-backed and regulated inventory cues should feel built in, not bolted on.',
      'Agency pages should help both end-users and landlords understand who is operating the listings.',
      'This page should feel calmer and more premium than a broker directory row or open classifieds profile.'
    ],
    lanes: [
      { title: 'Dubai long-term property', href: '/property/long_term/dubai', detail: 'Core resale and rental lane with compliance-first inventory posture.' },
      { title: 'New project distribution', href: '/property/new_project/dubai', detail: 'Controlled partner distribution for off-plan and launch-ready inventory.' },
      { title: 'Agency workspace', href: '/company', detail: 'Private company dashboard, broker seats, and reporting layer.' }
    ]
  },
  {
    slug: 'north-gate-realty',
    name: 'North Gate Realty',
    category: 'Property Agency',
    headline: 'A premium agency page should feel like a real operating company, not just a list of phone numbers.',
    summary:
      'North Gate Realty represents how a serious agency profile can balance public trust, local market coverage, and monetizable premium visibility without becoming sales-heavy.',
    badges: ['Verified Agency', 'Top Responder'],
    metrics: [
      { label: 'Primary market', value: 'Abu Dhabi family and investor demand' },
      { label: 'Profile role', value: 'Trust-led local agency surface' },
      { label: 'Commercial fit', value: 'Featured inventory and branch growth' }
    ],
    trustSignals: [
      'Local agency pages should make area strength and operating posture easy to scan.',
      'Public trust cues should reduce the feeling of anonymous brokerage spam.',
      'The page should help users understand what kind of inventory and response quality to expect.',
      'A premium agency object supports both SEO and better lead conversion.'
    ],
    lanes: [
      { title: 'Abu Dhabi property lane', href: '/property/long_term/abu-dhabi', detail: 'Family-ready and investor-ready inventory with stronger local trust language.' },
      { title: 'Agency performance view', href: '/leads', detail: 'Lead and inventory posture should connect back to the workspace product.' }
    ]
  }
];

export const dealerProfiles: OperatorProfile[] = [
  {
    slug: 'velocity-motors-gallery',
    name: 'Velocity Motors Gallery',
    category: 'Motors Dealer',
    headline: 'Dealer pages should combine inventory trust, brand identity, and fast lead intent in one sharp surface.',
    summary:
      'Dealer profiles are one of the biggest conversion assets in Motors. They should show verified identity, stock quality, showroom posture, and premium placement value without feeling like a noisy car portal ad.',
    badges: ['Verified Dealer', 'Premium Inventory', 'Fast Reply'],
    metrics: [
      { label: 'Primary market', value: 'Dubai premium used cars' },
      { label: 'Profile role', value: 'Dealer trust and inventory object' },
      { label: 'Commercial fit', value: 'Featured cars and dealer branding' }
    ],
    trustSignals: [
      'Dealer identity should feel much stronger than a generic seller card.',
      'Inventory quality and response posture should be visible before contact.',
      'Public dealer pages should support both repeat browsing and shareable brand presence.',
      'Premium dealer features should enhance the page without making it look like a promo sheet.'
    ],
    lanes: [
      { title: 'Motors marketplace', href: '/motors', detail: 'Dealer inventory should plug naturally into the public Motors lane.' },
      { title: 'Dealer workspace', href: '/company', detail: 'Private inventory, team, and lead management layer.' }
    ]
  },
  {
    slug: 'summit-auto-hub',
    name: 'Summit Auto Hub',
    category: 'Motors Dealer',
    headline: 'The right dealer profile should make inventory feel curated and more trustworthy than open resale boards.',
    summary:
      'Summit Auto Hub represents how a value-focused dealer page can still feel premium, brand-led, and highly usable across mobile and desktop.',
    badges: ['Verified Dealer', 'Showroom Ready'],
    metrics: [
      { label: 'Primary market', value: 'Sharjah and Dubai commuter vehicles' },
      { label: 'Profile role', value: 'Lead and inventory brand page' },
      { label: 'Commercial fit', value: 'Dealer package growth lane' }
    ],
    trustSignals: [
      'Dealer trust should be obvious on the first screen, especially in used-car discovery.',
      'Inventory should feel organized, not like one giant seller feed.',
      'The page should support branch expansion and future team seat logic naturally.',
      'Users should understand quickly why this dealer is worth opening over a generic listing.'
    ],
    lanes: [
      { title: 'Daily-stock vehicles', href: '/motors', detail: 'General browsing lane for used and featured vehicles.' },
      { title: 'Dealer campaigns', href: '/campaigns', detail: 'Premium campaign and branding layer for inventory pushes.' }
    ]
  }
];

export const developerProfiles: OperatorProfile[] = [
  {
    slug: 'crestline-developments',
    name: 'Crestline Developments',
    category: 'Developer',
    headline: 'Developer pages should feel like premium launch objects with clear trust and project structure.',
    summary:
      'Developer profiles should unify company identity, active projects, launch posture, and premium public storytelling so new projects do not feel like generic listing clusters.',
    badges: ['Verified Developer', 'Launch Ready', 'Project Profile'],
    metrics: [
      { label: 'Primary market', value: 'Dubai off-plan and branded residential' },
      { label: 'Profile role', value: 'Launch and project trust surface' },
      { label: 'Commercial fit', value: 'Developer packages and campaign placement' }
    ],
    trustSignals: [
      'Developer identity should be clearer than the surrounding project inventory.',
      'Project pages should inherit trust from the developer profile, not stand alone as thin marketing pages.',
      'The public profile should help users understand delivery posture and launch quality faster.',
      'Premium launch visibility should sit naturally inside the same design system.'
    ],
    lanes: [
      { title: 'New projects lane', href: '/property/new_project/dubai', detail: 'Project-first public discovery and launch lead capture.' },
      { title: 'Project profile example', href: '/property/project/harbor-crown-residences', detail: 'A richer public project object connected to the developer identity.' }
    ]
  },
  {
    slug: 'atlas-urban-properties',
    name: 'Atlas Urban Properties',
    category: 'Developer',
    headline: 'A strong developer page should communicate delivery confidence before it tries to sell urgency.',
    summary:
      'Atlas Urban Properties shows how GulfHabibi can position developer pages as premium, regulated, and monetizable surfaces instead of disposable promotional brochures.',
    badges: ['Verified Developer', 'Premium Profile'],
    metrics: [
      { label: 'Primary market', value: 'Abu Dhabi and Dubai mixed-use launches' },
      { label: 'Profile role', value: 'Developer trust and launch page' },
      { label: 'Commercial fit', value: 'Launch campaigns and premium distribution' }
    ],
    trustSignals: [
      'Users should understand developer identity and launch posture before browsing units.',
      'The page should reduce the noise that usually surrounds off-plan marketing.',
      'Project storytelling and company credibility should work together instead of competing.',
      'A clean developer object creates better SEO and stronger premium sales paths.'
    ],
    lanes: [
      { title: 'Developer launch campaigns', href: '/campaigns', detail: 'Structured monetization lane for launch storytelling and premium placement.' },
      { title: 'Off-plan property route', href: '/property/off_plan/dubai', detail: 'The surrounding off-plan discovery environment for project traffic.' }
    ]
  }
];

export const operatorHighlights: OperatorHighlight[] = [
  {
    badge: 'Trust Layer',
    title: 'Operator pages should be public trust objects, not thin logo rows.',
    detail: 'Agencies, dealers, and developers need premium profile pages that carry real operating credibility into every linked listing or project.'
  },
  {
    badge: 'Growth Engine',
    title: 'These public profiles can become some of the strongest SEO and referral surfaces in the entire portal.',
    detail: 'Operator identity gives GulfHabibi durable public pages that are useful to users and commercially valuable to businesses.'
  },
  {
    badge: 'Commercial Fit',
    title: 'Premium placements should strengthen operator pages without making them feel like ad boards.',
    detail: 'That balance is what turns operator profiles into long-term monetization assets rather than noisy promo surfaces.'
  }
];

export function getAgencyProfile(slug: string) {
  return agencyProfiles.find((profile) => profile.slug === slug) || buildFallbackProfile(slug, 'Agency');
}

export function getDealerProfile(slug: string) {
  return dealerProfiles.find((profile) => profile.slug === slug) || buildFallbackProfile(slug, 'Dealer');
}

export function getDeveloperProfile(slug: string) {
  return developerProfiles.find((profile) => profile.slug === slug) || buildFallbackProfile(slug, 'Developer');
}

function buildFallbackProfile(slug: string, category: string): OperatorProfile {
  const name = humanizeSlug(slug);

  return {
    slug,
    name,
    category,
    headline: `${name} should become a premium operator profile with stronger trust, inventory framing, and business identity.`,
    summary: 'This fallback profile keeps the operator layer usable before live public company data is connected to the new read models.',
    badges: [category, 'Trust First'],
    metrics: [
      { label: 'Profile role', value: 'Public operator identity surface' },
      { label: 'Growth fit', value: 'SEO and premium trust object' },
      { label: 'Commercial fit', value: 'Package and campaign ready' }
    ],
    trustSignals: [
      'Operator pages should help users understand who is behind the inventory.',
      'Trust should feel built into the profile, not hidden behind the dashboard.',
      'The page should support business branding and stronger public credibility.',
      'Premium upgrades should enhance the object without making it noisy.'
    ],
    lanes: [{ title: 'Workspace', href: '/company', detail: 'Private company and reporting experience.' }]
  };
}

export function humanizeSlug(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
