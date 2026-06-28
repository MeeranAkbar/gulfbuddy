export interface JobsSearchParams {
  keyword: string;
  location: string;
  category: string;
  employmentType: string;
  experienceLevel: string;
}

export function parseJobsSearchParams(params: Record<string, string | string[] | undefined>): JobsSearchParams {
  const getSingleStr = (val: string | string[] | undefined) => (Array.isArray(val) ? val[0] : val) || '';

  return {
    keyword: getSingleStr(params.keyword),
    location: getSingleStr(params.location),
    category: getSingleStr(params.category),
    employmentType: getSingleStr(params.employmentType),
    experienceLevel: getSingleStr(params.experienceLevel)
  };
}

export function searchJobsListings(params: JobsSearchParams) {
  // Mock data for jobs search
  return [
    {
      id: 'j1',
      title: 'Senior Frontend Developer (Next.js)',
      salaryLabel: 'AED 25,000 - 35,000 / month',
      location: 'Dubai / Internet City',
      category: 'Technology',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      employerType: 'Verified Tech Company',
      employerName: 'Digital Oasis LLC',
      summary: 'Looking for an experienced React/Next.js developer to lead our core product team. Must have strong TypeScript skills.',
      badges: ['Remote Optional', 'Immediate Start', 'Health Insurance'],
      routeHref: '/jobs/senior-frontend-developer',
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'j2',
      title: 'Marketing Manager',
      salaryLabel: 'AED 18,000 - 22,000 / month',
      location: 'Abu Dhabi / Al Maryah Island',
      category: 'Marketing',
      employmentType: 'Full-time',
      experienceLevel: 'Mid-Senior',
      employerType: 'Verified Agency',
      employerName: 'Creative Minds Middle East',
      summary: 'Lead our 360 marketing campaigns across the GCC. Strong background in digital marketing and team leadership required.',
      badges: ['Annual Bonus', 'Hybrid Role'],
      routeHref: '/jobs/marketing-manager',
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'j3',
      title: 'Real Estate Agent (Secondary Market)',
      salaryLabel: 'Commission Only (Ote 50k+)',
      location: 'Dubai / Business Bay',
      category: 'Real Estate',
      employmentType: 'Full-time',
      experienceLevel: 'Any',
      employerType: 'Verified Brokerage',
      employerName: 'Prime Properties Dubai',
      summary: 'Join our award-winning brokerage. We provide leads, marketing support, and excellent commission splits.',
      badges: ['Visa Provided', 'High Commission', 'Training'],
      routeHref: '/jobs/real-estate-agent',
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop'
    }
  ];
}

export function getJobListingBySlug(slug: string) {
  const listings = searchJobsListings({ keyword: '', location: '', category: '', employmentType: '', experienceLevel: '' });
  return listings.find(l => l.routeHref.endsWith(slug)) || null;
}
