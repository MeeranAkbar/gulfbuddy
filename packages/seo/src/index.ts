export function buildCanonical(pathname: string, locale: 'en' | 'ar' = 'en') {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `https://gulfhabibi.com/${locale}${normalized === '/' ? '' : normalized}`;
}

export function buildTitle(title: string) {
  return `${title} | GulfHabibi`;
}

export function buildMetaDescription(copy: string, max = 155) {
  return copy.length > max ? `${copy.slice(0, max - 1).trim()}…` : copy;
}

export interface JobPostingStructuredDataInput {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string | null;
  employmentType?: string | null;
  hiringOrganizationName: string;
  hiringOrganizationUrl?: string | null;
  jobLocationAddressLocality?: string | null;
  jobLocationAddressRegion?: string | null;
  salaryCurrency?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
}

export function buildJobPostingStructuredData(input: JobPostingStructuredDataInput) {
  const base = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: input.title,
    description: input.description,
    datePosted: input.datePosted,
    employmentType: input.employmentType || undefined,
    validThrough: input.validThrough || undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: input.hiringOrganizationName,
      sameAs: input.hiringOrganizationUrl || undefined
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: input.jobLocationAddressLocality || undefined,
        addressRegion: input.jobLocationAddressRegion || undefined,
        addressCountry: 'AE'
      }
    }
  } as Record<string, unknown>;

  if (input.salaryCurrency && (input.salaryMin != null || input.salaryMax != null)) {
    base.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: input.salaryCurrency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: input.salaryMin ?? undefined,
        maxValue: input.salaryMax ?? undefined,
        unitText: 'MONTH'
      }
    };
  }

  return base;
}

export interface LocalBusinessStructuredDataInput {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
  telephone?: string | null;
  areaServed?: string[] | null;
  addressLocality?: string | null;
  addressRegion?: string | null;
  priceRange?: string | null;
}

export function buildLocalBusinessStructuredData(input: LocalBusinessStructuredDataInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    description: input.description || undefined,
    url: input.url,
    image: input.image || undefined,
    telephone: input.telephone || undefined,
    areaServed: input.areaServed?.length ? input.areaServed : undefined,
    priceRange: input.priceRange || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: input.addressLocality || undefined,
      addressRegion: input.addressRegion || undefined,
      addressCountry: 'AE'
    }
  };
}
