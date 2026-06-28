import { notFound } from 'next/navigation';
import { getPropertyListingBySlug } from '../../../../../lib/search/property';
import Link from 'next/link';
import { ChevronLeftIcon, ShareIcon, HeartIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const listing = getPropertyListingBySlug(resolvedParams.slug);

  if (!listing) {
    notFound();
  }

  // Use the provided imageUrl or fallback to a standard high-res property photo
  const heroImage = listing.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';
  const subImage1 = 'https://images.unsplash.com/photo-1600607687931-cebf10cb4cb0?auto=format&fit=crop&w=800&q=80';
  const subImage2 = 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-[var(--background)] pb-24">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--surface)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-4 xl:px-8">
          <Link href="/property/search" className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ChevronLeftIcon className="h-4 w-4" />
            Back to search
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)] transition hover:bg-[var(--surface-alt)]">
              <ShareIcon className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)] transition hover:bg-[var(--surface-alt)] hover:text-red-500">
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1380px] px-5 pt-8 xl:px-8">
        
        {/* Cinematic Image Gallery */}
        <div className="grid gap-4 overflow-hidden rounded-[2rem] sm:grid-cols-4 md:h-[60vh] xl:h-[70vh]">
          <div className="relative col-span-1 sm:col-span-2 md:col-span-3">
            <img src={heroImage} alt={listing.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="hidden grid-rows-2 gap-4 sm:grid md:col-span-1">
            <div className="relative">
              <img src={subImage1} alt="Property view 2" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="relative">
              <img src={subImage2} alt="Property view 3" className="absolute inset-0 h-full w-full object-cover" />
              <button className="absolute bottom-4 right-4 rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/60">
                Show all photos
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
          
          {/* Left Column: Details */}
          <div className="space-y-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {listing.badges.map((badge: string) => (
                  <span key={badge} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">{listing.title}</h1>
              <p className="mt-4 text-lg font-medium text-[var(--text-secondary)]">
                {listing.buildingName ? `${listing.buildingName}, ` : ''}{listing.communityName}, {listing.area}, {listing.emirateLabel}
              </p>
            </div>

            {/* Spec Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Type</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{listing.propertyType}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Beds</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{listing.bedrooms ?? 'Studio'}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Baths</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{listing.bathrooms ?? '-'}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Size</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{listing.sizeSqft} sqft</p>
              </div>
            </div>

            <hr className="border-[var(--border-subtle)]" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Property Details</h2>
              <p className="mt-6 leading-8 text-[var(--text-secondary)]">
                {listing.summary}
                <br /><br />
                Experience premium living in the heart of {listing.area}. This exquisite {listing.propertyType.toLowerCase()} offers an unparalleled lifestyle with top-tier finishing, spacious layouts, and breathtaking views. Perfectly situated in {listing.communityName}, residents enjoy direct access to world-class amenities, fine dining, and retail options.
                <br /><br />
                Property features:
                <br />• {listing.furnishing === 'furnished' ? 'Fully Furnished' : 'Unfurnished or Semi-furnished options'}
                <br />• {listing.completionStatus === 'ready' ? 'Ready to move in' : 'Handover expected soon'}
                <br />• Premium fittings and built-in wardrobes
                <br />• Dedicated covered parking
              </p>
            </div>

          </div>

          {/* Right Column: Sticky Action Bar */}
          <div>
            <div className="sticky top-28 rounded-[2rem] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-md)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Asking Price</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight text-[var(--text-primary)]">{listing.priceLabel}</h2>
              <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                Approx. AED {Math.round(listing.priceAmount / listing.sizeSqft)} / sqft
              </p>

              <div className="mt-8 space-y-4">
                <button className="flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1EBE5C]">
                  Contact via WhatsApp
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center rounded-2xl bg-[var(--primary)] px-6 py-4 text-sm font-bold text-[var(--text-inverse)] transition hover:bg-[var(--primary-hover)]">
                    Call Agent
                  </button>
                  <button className="flex items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-transparent px-6 py-4 text-sm font-bold text-[var(--text-primary)] transition hover:bg-[var(--surface-alt)]">
                    Send Email
                  </button>
                </div>
              </div>

              <hr className="my-8 border-[var(--border-subtle)]" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Listed By</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-alt)] text-lg font-bold text-[var(--text-primary)]">
                    {listing.sellerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                      {listing.sellerName}
                      {listing.verifiedCompany && <CheckBadgeIcon className="h-5 w-5 text-[#2563eb]" />}
                    </p>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">{listing.sellerType}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
