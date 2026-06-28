import { buildPropertySearchHref, propertyEmirateOptions } from './property';

export type SearchSection = 'all' | 'property' | 'motors' | 'jobs' | 'services' | 'directory' | 'classifieds';

export interface SearchSuggestion {
  id: string;
  label: string;
  value: string;
  type: 'keyword' | 'category' | 'location' | 'company' | 'project' | 'model' | 'job_title' | 'service';
  section: Exclude<SearchSection, 'all'>;
  meta?: string;
}

export interface SearchSectionConfig {
  key: SearchSection;
  label: string;
  description: string;
  href: string;
  placeholder: string;
  suggestionTitle: string;
}

export const searchSections: SearchSectionConfig[] = [
  {
    key: 'all',
    label: 'All sections',
    description: 'Search across the full GulfHabibi marketplace.',
    href: '/search',
    placeholder: 'Search property, cars, jobs, services, and businesses',
    suggestionTitle: 'Trending across GulfHabibi'
  },
  {
    key: 'property',
    label: 'Property',
    description: 'Sale, rent, off-plan, and project discovery.',
    href: '/property',
    placeholder: 'Search area, building, project, or property type',
    suggestionTitle: 'Property suggestions'
  },
  {
    key: 'motors',
    label: 'Motors',
    description: 'Vehicles, dealers, and premium inventory.',
    href: '/motors',
    placeholder: 'Search make, model, dealer, or vehicle type',
    suggestionTitle: 'Motors suggestions'
  },
  {
    key: 'jobs',
    label: 'Jobs',
    description: 'Roles, employers, and hiring lanes.',
    href: '/jobs',
    placeholder: 'Search role, company, industry, or skill',
    suggestionTitle: 'Jobs suggestions'
  },
  {
    key: 'services',
    label: 'Services',
    description: 'Local provider profiles and quote-ready categories.',
    href: '/services',
    placeholder: 'Search provider, category, or local service need',
    suggestionTitle: 'Services suggestions'
  },
  {
    key: 'directory',
    label: 'Directory',
    description: 'Business discovery across categories and areas.',
    href: '/directory',
    placeholder: 'Search business name, category, or area',
    suggestionTitle: 'Directory suggestions'
  },
  {
    key: 'classifieds',
    label: 'Classifieds',
    description: 'Fast local marketplace for consumer inventory.',
    href: '/classifieds',
    placeholder: 'Search product, category, or local resale item',
    suggestionTitle: 'Classifieds suggestions'
  }
];

export const searchSuggestions: SearchSuggestion[] = [
  { id: 'property-dm-rent', label: 'Dubai Marina rentals', value: 'Dubai Marina rent', type: 'location', section: 'property', meta: 'Area / Rent' },
  { id: 'property-bb-sale', label: 'Business Bay sale apartments', value: 'Business Bay sale apartment', type: 'location', section: 'property', meta: 'Area / Sale' },
  { id: 'property-project', label: 'Downtown off-plan projects', value: 'Downtown off-plan project', type: 'project', section: 'property', meta: 'Project / Off-plan' },
  { id: 'motors-corolla', label: 'Toyota Corolla', value: 'Toyota Corolla', type: 'model', section: 'motors', meta: 'Make / Model' },
  { id: 'motors-patrol', label: 'Nissan Patrol Abu Dhabi', value: 'Nissan Patrol Abu Dhabi', type: 'model', section: 'motors', meta: 'Model / Location' },
  { id: 'jobs-accountant', label: 'Accountant in Dubai', value: 'Accountant Dubai', type: 'job_title', section: 'jobs', meta: 'Role / Emirate' },
  { id: 'jobs-hospitality', label: 'Hospitality jobs', value: 'Hospitality jobs', type: 'category', section: 'jobs', meta: 'Industry' },
  { id: 'services-ac', label: 'AC repair in JVC', value: 'AC repair JVC', type: 'service', section: 'services', meta: 'Service / Area' },
  { id: 'services-movers', label: 'Movers in Sharjah', value: 'Movers Sharjah', type: 'service', section: 'services', meta: 'Service / Emirate' },
  { id: 'directory-restaurants', label: 'Restaurants in Jumeirah', value: 'Restaurants Jumeirah', type: 'category', section: 'directory', meta: 'Category / Area' },
  { id: 'directory-clinic', label: 'Clinics in Abu Dhabi', value: 'Clinics Abu Dhabi', type: 'category', section: 'directory', meta: 'Category / Emirate' },
  { id: 'classifieds-iphone', label: 'Used iPhone 14', value: 'Used iPhone 14', type: 'keyword', section: 'classifieds', meta: 'Electronics' },
  { id: 'classifieds-furniture', label: 'Furniture in Dubai', value: 'Furniture Dubai', type: 'category', section: 'classifieds', meta: 'Category / Emirate' }
];

export const popularSearchesBySection: Record<SearchSection, string[]> = {
  all: ['Dubai Marina rent', 'Toyota Corolla', 'Accountant Dubai', 'AC repair JVC'],
  property: ['Dubai Marina rent', 'Business Bay sale apartment', 'Off-plan Downtown'],
  motors: ['Toyota Corolla', 'Nissan Patrol Abu Dhabi', 'SUV Dubai'],
  jobs: ['Accountant Dubai', 'Sales jobs', 'Hospitality jobs'],
  services: ['AC repair JVC', 'Movers Sharjah', 'Home cleaning Dubai'],
  directory: ['Restaurants Jumeirah', 'Clinics Abu Dhabi', 'Beauty salon Dubai'],
  classifieds: ['Used iPhone 14', 'Furniture Dubai', 'Baby stroller Sharjah']
};

export function getSearchSectionConfig(section: SearchSection) {
  return searchSections.find((item) => item.key === section) || searchSections[0];
}

export function getSuggestionsForSection(section: SearchSection, query: string) {
  const normalized = query.trim().toLowerCase();
  const sectionScoped = searchSuggestions.filter((item) => section === 'all' || item.section === section);

  if (!normalized) return sectionScoped.slice(0, 8);

  return sectionScoped.filter((item) => {
    return item.label.toLowerCase().includes(normalized) || item.value.toLowerCase().includes(normalized) || item.meta?.toLowerCase().includes(normalized);
  });
}

function slugifyLocation(value: string) {
  return value.trim().toLowerCase().replace(/[_/]+/g, ' ').replace(/\s+/g, '-');
}

export function buildSearchHref(section: SearchSection, keyword = '', location = '') {
  const trimmedKeyword = keyword.trim();
  const trimmedLocation = location.trim();

  if (section === 'property') {
    const locationSlug = slugifyLocation(trimmedLocation);
    const matchingEmirate = propertyEmirateOptions.find((option) => option.value === locationSlug);

    return buildPropertySearchHref({
      marketMode: 'long_term',
      keyword: trimmedKeyword,
      emirate: matchingEmirate?.value ?? '',
      area: matchingEmirate ? '' : trimmedLocation
    });
  }

  const params = new URLSearchParams();
  if (trimmedKeyword) params.set('keyword', trimmedKeyword);
  if (trimmedLocation) params.set('location', trimmedLocation);
  if (section !== 'all') params.set('section', section);

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : '/search';
}
