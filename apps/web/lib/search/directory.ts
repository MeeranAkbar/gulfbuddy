export interface DirectorySearchParams {
  keyword: string;
  location: string;
  category: string;
}

export function parseDirectorySearchParams(params: Record<string, string | string[] | undefined>): DirectorySearchParams {
  const getSingleStr = (val: string | string[] | undefined) => (Array.isArray(val) ? val[0] : val) || '';

  return {
    keyword: getSingleStr(params.keyword),
    location: getSingleStr(params.location),
    category: getSingleStr(params.category)
  };
}

export function searchDirectoryListings(params: DirectorySearchParams) {
  // Mock data for directory search
  return [
    {
      id: 'd1',
      title: 'Emirates Legal Services',
      ratingLabel: '4.8 (120 reviews)',
      location: 'Dubai / DIFC',
      category: 'Legal Services',
      businessType: 'Verified Firm',
      yearsActive: '12 Years',
      summary: 'Corporate law, company formation, and intellectual property services. Trusted by over 500 businesses in the UAE.',
      badges: ['ISO Certified', 'DIFC Registered'],
      routeHref: '/directory/emirates-legal',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'd2',
      title: 'Prime Medical Center',
      ratingLabel: '4.5 (340 reviews)',
      location: 'Abu Dhabi / Khalidiyah',
      category: 'Healthcare',
      businessType: 'Verified Clinic',
      yearsActive: '8 Years',
      summary: 'Multi-specialty clinic offering pediatric, dental, and general practice services. Open 24/7 for emergencies.',
      badges: ['Insurance Accepted', '24/7 Care'],
      routeHref: '/directory/prime-medical',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'd3',
      title: 'Desert Safari Adventures',
      ratingLabel: '4.9 (2k+ reviews)',
      location: 'Dubai / Al Barsha',
      category: 'Tourism',
      businessType: 'Premium Partner',
      yearsActive: '15 Years',
      summary: 'Award-winning desert safari experiences, VIP camps, and dune buggy rentals. Excellent safety record.',
      badges: ['Top Rated', 'DTCM Approved'],
      routeHref: '/directory/desert-safari-adventures',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    }
  ];
}

export function getDirectoryListingBySlug(slug: string) {
  const listings = searchDirectoryListings({ keyword: '', location: '', category: '' });
  return listings.find(l => l.routeHref.endsWith(slug)) || null;
}
