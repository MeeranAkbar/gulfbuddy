export interface ClassifiedsSearchParams {
  keyword: string;
  location: string;
  category: string;
  condition: string;
}

export function parseClassifiedsSearchParams(params: Record<string, string | string[] | undefined>): ClassifiedsSearchParams {
  const getSingleStr = (val: string | string[] | undefined) => (Array.isArray(val) ? val[0] : val) || '';

  return {
    keyword: getSingleStr(params.keyword),
    location: getSingleStr(params.location),
    category: getSingleStr(params.category),
    condition: getSingleStr(params.condition)
  };
}

export function searchClassifiedsListings(params: ClassifiedsSearchParams) {
  // Mock data for classifieds search
  return [
    {
      id: 'c1',
      title: 'Sony PlayStation 5 (Disc Edition)',
      priceLabel: 'AED 1,650',
      location: 'Dubai / JVC',
      category: 'Electronics',
      condition: 'Like New',
      sellerType: 'Private Seller',
      sellerName: 'Michael R.',
      summary: 'Barely used PS5, comes with 2 dual sense controllers and 3 games (FIFA 23, Spiderman). Box included.',
      badges: ['Box Included', 'Original Receipt'],
      routeHref: '/classifieds/sony-ps5-disc',
      imageUrl: 'https://images.unsplash.com/photo-1605636362598-cb54e3d64c12?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'c2',
      title: 'IKEA Kivik 3-Seat Sofa',
      priceLabel: 'AED 800',
      location: 'Sharjah / Al Majaz',
      category: 'Furniture',
      condition: 'Good',
      sellerType: 'Private Seller',
      sellerName: 'Sarah K.',
      summary: 'Selling because moving out. Light grey cover, washed recently. Very comfortable.',
      badges: ['Must Go', 'Negotiable'],
      routeHref: '/classifieds/ikea-kivik-sofa',
      imageUrl: 'https://images.unsplash.com/photo-1605636362598-cb54e3d64c12?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'c3',
      title: 'MacBook Pro M1 14-inch',
      priceLabel: 'AED 4,200',
      location: 'Abu Dhabi / Reem Island',
      category: 'Computers',
      condition: 'Excellent',
      sellerType: 'Verified Reseller',
      sellerName: 'Tech Deals UAE',
      summary: '16GB RAM, 512GB SSD. Battery cycle count 45. Includes original charger and a free sleeve.',
      badges: ['Warranty Active', 'Verified'],
      routeHref: '/classifieds/macbook-pro-m1',
      imageUrl: 'https://images.unsplash.com/photo-1605636362598-cb54e3d64c12?q=80&w=2070&auto=format&fit=crop'
    }
  ];
}

export function getClassifiedsListingBySlug(slug: string) {
  const listings = searchClassifiedsListings({ keyword: '', location: '', category: '', condition: '' });
  return listings.find(l => l.routeHref.endsWith(slug)) || null;
}
