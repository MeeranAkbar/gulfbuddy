export interface MotorsSearchParams {
  keyword: string;
  location: string;
  vehicleType: string;
  minPrice: number | null;
  maxPrice: number | null;
  year: number | null;
}

export function parseMotorsSearchParams(params: Record<string, string | string[] | undefined>): MotorsSearchParams {
  const getSingleStr = (val: string | string[] | undefined) => (Array.isArray(val) ? val[0] : val) || '';

  return {
    keyword: getSingleStr(params.keyword),
    location: getSingleStr(params.location),
    vehicleType: getSingleStr(params.vehicleType),
    minPrice: params.minPrice ? parseInt(getSingleStr(params.minPrice), 10) : null,
    maxPrice: params.maxPrice ? parseInt(getSingleStr(params.maxPrice), 10) : null,
    year: params.year ? parseInt(getSingleStr(params.year), 10) : null
  };
}

export function searchMotorsListings(params: MotorsSearchParams) {
  // Mock data for motors search
  return [
    {
      id: 'm1',
      title: '2023 Toyota Land Cruiser VXR',
      priceLabel: 'AED 385,000',
      location: 'Dubai / Al Quoz',
      vehicleType: 'SUV',
      year: 2023,
      mileage: '15,000 km',
      sellerType: 'Verified Dealer',
      sellerName: 'Al Futtaim Motors',
      summary: 'Excellent condition VXR. Full service history at official agency. Under warranty.',
      badges: ['GCC Specs', 'Agency Maintained', 'Warranty Active'],
      routeHref: '/motors/2023-toyota-land-cruiser-vxr',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'm2',
      title: '2021 Porsche 911 Carrera S',
      priceLabel: 'AED 495,000',
      location: 'Dubai / Sheikh Zayed Road',
      vehicleType: 'Coupe',
      year: 2021,
      mileage: '22,500 km',
      sellerType: 'Premium Dealer',
      sellerName: 'Luxury Cars DXB',
      summary: 'Stunning Guards Red with black interior. Sport Chrono package, sports exhaust.',
      badges: ['GCC Specs', 'Full Options', 'No Accidents'],
      routeHref: '/motors/2021-porsche-911-carrera-s',
      imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'm3',
      title: '2022 Nissan Patrol Platinum V8',
      priceLabel: 'AED 295,000',
      location: 'Abu Dhabi / Yas Island',
      vehicleType: 'SUV',
      year: 2022,
      mileage: '45,000 km',
      sellerType: 'Private Owner',
      sellerName: 'Ahmed A.',
      summary: 'Perfect family car, very clean inside and out. Always parked in shade.',
      badges: ['GCC Specs', 'Private Seller', 'Clean Title'],
      routeHref: '/motors/2022-nissan-patrol-platinum',
      imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80'
    }
  ];
}

export function getMotorListingBySlug(slug: string) {
  const listings = searchMotorsListings({ keyword: '', location: '', vehicleType: '', minPrice: null, maxPrice: null, year: null });
  // The slug is everything after the last slash in routeHref
  return listings.find(l => l.routeHref.endsWith(slug)) || null;
}
