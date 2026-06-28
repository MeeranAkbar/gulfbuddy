import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { AdBanner } from '../../../../../components/ui/ad-banner';
import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MotorListingPage({ params }: PageProps) {
  const { id } = await params;
  
  const ad = await prisma.ad.findUnique({
    where: { id },
    include: { metadata: true, user: true }
  });

  if (!ad || ad.category !== 'motors') {
    notFound();
  }

  const meta = ad.metadata?.details ? JSON.parse(ad.metadata.details) : {};
  const motorFeatures: string[] = meta.motorFeatures || [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 animate-in fade-in zoom-in-95 duration-500">
      <AdBanner className="mb-6" />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        
        {/* Main Content */}
        <div className="space-y-8">
          
          {/* Image Gallery */}
          <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-3xl shadow-xl border border-[var(--border-subtle)]">
            <img 
              src={meta.imageUrl || 'https://images.unsplash.com/photo-1503376712344-652bb8fc59eb?auto=format&fit=crop&w=1200&q=80'} 
              alt={ad.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="inline-block rounded-full bg-[var(--accent)] px-4 py-1 text-sm font-bold tracking-widest text-white uppercase">
                {ad.status}
              </span>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">{ad.title}</h1>
              <p className="mt-2 flex items-center text-white/80 font-medium">
                <MapPinIcon className="h-5 w-5 mr-1" />
                Dubai, UAE
              </p>
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-[var(--surface-alt)] p-4 border border-[var(--border-subtle)]">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">Year</p>
              <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">2023</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-alt)] p-4 border border-[var(--border-subtle)]">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">Kilometers</p>
              <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">15,000</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-alt)] p-4 border border-[var(--border-subtle)]">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">Body Type</p>
              <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{meta.bodyType || 'SUV'}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-alt)] p-4 border border-[var(--border-subtle)]">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">Specs</p>
              <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{meta.regionalSpecs || 'GCC'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl bg-[var(--surface)] p-8 border border-[var(--border-subtle)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4 mb-6">Description</h2>
            <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{ad.description || 'No description provided.'}</p>
          </div>

          {/* Features */}
          {motorFeatures.length > 0 && (
            <div className="rounded-3xl bg-[var(--surface)] p-8 border border-[var(--border-subtle)] shadow-sm">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4 mb-6">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {motorFeatures.map(f => (
                  <div key={f} className="flex items-center text-[var(--text-secondary)] font-medium">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-[var(--surface)] p-6 border border-[var(--border-subtle)] shadow-xl sticky top-24">
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Asking Price</p>
            <h2 className="mt-1 text-4xl font-black text-[var(--accent)]">AED {ad.price.toLocaleString()}</h2>
            
            <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold mb-3">Listed By</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center font-bold text-[var(--accent)] text-xl border border-[var(--border-subtle)]">
                  {ad.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-lg text-[var(--text-primary)]">{ad.user?.name || 'Private Seller'}</p>
                  <p className="text-sm text-[var(--text-secondary)] flex items-center">
                    {ad.user?.plan !== 'FREE' && <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-1" />}
                    {ad.user?.plan !== 'FREE' ? 'Verified Dealer' : 'Member'}
                  </p>
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-bold text-lg shadow-md hover:opacity-90 transition-opacity flex items-center justify-center mb-3">
                Show Phone Number
              </button>
              <button className="w-full py-4 rounded-2xl border-2 border-[var(--border-strong)] text-[var(--text-primary)] font-bold text-lg hover:bg-[var(--surface-alt)] transition-colors flex items-center justify-center">
                Send Message
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
