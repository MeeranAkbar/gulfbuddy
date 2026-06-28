export interface ServicesSearchParams {
  keyword: string;
  location: string;
  category: string;
}

export function parseServicesSearchParams(params: Record<string, string | string[] | undefined>): ServicesSearchParams {
  const getSingleStr = (val: string | string[] | undefined) => (Array.isArray(val) ? val[0] : val) || '';

  return {
    keyword: getSingleStr(params.keyword),
    location: getSingleStr(params.location),
    category: getSingleStr(params.category)
  };
}

export function searchServicesListings(params: ServicesSearchParams) {
  // Mock data for services search
  return [
    {
      id: 's1',
      title: 'AC Repair & Maintenance',
      priceLabel: 'From AED 150',
      location: 'Dubai / All Areas',
      category: 'Home Maintenance',
      providerType: 'Verified Company',
      providerName: 'Cool Breeze Technical',
      summary: 'Professional AC cleaning, duct sanitization, and emergency repairs. 24/7 service available across Dubai.',
      badges: ['24/7 Service', 'Licensed'],
      routeHref: '/services/ac-repair-dubai',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 's2',
      title: 'Professional Home Cleaning',
      priceLabel: 'AED 35 / Hour',
      location: 'Sharjah & Ajman',
      category: 'Cleaning',
      providerType: 'Verified Company',
      providerName: 'Sparkle Cleaners',
      summary: 'Deep cleaning, regular maid service, and move-in/move-out cleaning. Highly trained and background-checked staff.',
      badges: ['Top Rated', 'Same Day'],
      routeHref: '/services/home-cleaning-sharjah',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 's3',
      title: 'Local Movers and Packers',
      priceLabel: 'Custom Quote',
      location: 'Abu Dhabi / UAE Wide',
      category: 'Moving',
      providerType: 'Premium Provider',
      providerName: 'SafeWay Movers',
      summary: 'Villa and apartment shifting. We handle packing, dismantling, transport, and reassembly with utmost care.',
      badges: ['Insured', 'Premium Service'],
      routeHref: '/services/movers-abu-dhabi',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop'
    }
  ];
}

export function getServiceListingBySlug(slug: string) {
  const listings = searchServicesListings({ keyword: '', location: '', category: '' });
  return listings.find(l => l.routeHref.endsWith(slug)) || null;
}
