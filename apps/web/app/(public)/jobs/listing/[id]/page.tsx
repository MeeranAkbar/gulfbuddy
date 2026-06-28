import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { AdBanner } from '../../../../../components/ui/ad-banner';
import { CheckCircleIcon, BriefcaseIcon, BuildingOfficeIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/solid';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobListingPage({ params }: PageProps) {
  const { id } = await params;
  
  const ad = await prisma.ad.findUnique({
    where: { id },
    include: { metadata: true, user: true }
  });

  if (!ad || ad.category !== 'jobs') {
    notFound();
  }

  const meta = ad.metadata?.details ? JSON.parse(ad.metadata.details) : {};
  const jobBenefits: string[] = meta.jobBenefits || [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 animate-in fade-in zoom-in-95 duration-500">
      <AdBanner className="mb-6" />

      {/* Header Section */}
      <div className="rounded-3xl bg-[var(--surface)] p-8 md:p-12 border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--accent)] opacity-5 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border-strong)] flex items-center justify-center flex-shrink-0 shadow-sm">
              <BuildingOfficeIcon className="h-10 w-10 text-[var(--accent)] opacity-50" />
            </div>
            <div>
              <span className="inline-block rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-2">
                {meta.employmentType || 'Full-Time'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight">{ad.title}</h1>
              <p className="text-lg font-medium text-[var(--text-secondary)] mt-1">{meta.companyName || 'Confidential Company'}</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-3">
            <button className="w-full md:w-48 py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity">
              Apply Now
            </button>
            <button className="w-full md:w-48 py-3 rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] font-bold hover:bg-[var(--surface-alt)] transition-colors">
              Save Job
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr] mt-8">
        
        {/* Main Content */}
        <div className="space-y-8">
          
          {/* Description */}
          <div className="rounded-3xl bg-[var(--surface)] p-8 border border-[var(--border-subtle)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4 mb-6">Job Description</h2>
            <div className="prose dark:prose-invert max-w-none text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
              {ad.description || 'No description provided.'}
            </div>
          </div>

          {/* Requirements & Benefits */}
          {(jobBenefits.length > 0 || meta.experienceLevel) && (
            <div className="rounded-3xl bg-[var(--surface)] p-8 border border-[var(--border-subtle)] shadow-sm">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4 mb-6">Requirements & Benefits</h2>
              
              {meta.experienceLevel && (
                <div className="mb-6">
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">Experience Required</h3>
                  <p className="text-[var(--text-secondary)]">{meta.experienceLevel}</p>
                </div>
              )}

              {jobBenefits.length > 0 && (
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-4">Benefits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {jobBenefits.map(f => (
                      <div key={f} className="flex items-center text-[var(--text-secondary)] font-medium">
                        <CheckCircleIcon className="h-5 w-5 text-[var(--accent)] mr-3" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Facts */}
          <div className="rounded-3xl bg-[var(--surface)] p-6 border border-[var(--border-subtle)] shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Job Overview</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg bg-[var(--surface-alt)]">
                  <CurrencyDollarIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)]">Salary</p>
                  <p className="font-bold text-[var(--text-primary)]">AED {ad.price.toLocaleString()} / month</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg bg-[var(--surface-alt)]">
                  <BriefcaseIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)]">Job Role</p>
                  <p className="font-bold text-[var(--text-primary)]">{meta.jobRole || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg bg-[var(--surface-alt)]">
                  <ClockIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)]">Posted</p>
                  <p className="font-bold text-[var(--text-primary)]">{new Date(ad.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employer Card */}
          <div className="rounded-3xl bg-[var(--surface-alt)] p-6 border border-[var(--border-subtle)]">
            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold mb-4">Posted By</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xl">
                {ad.user?.name?.charAt(0) || 'E'}
              </div>
              <div>
                <p className="font-bold text-lg text-[var(--text-primary)]">{ad.user?.name || 'Employer'}</p>
                <p className="text-sm text-[var(--text-secondary)] flex items-center">
                  {ad.user?.plan !== 'FREE' && <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-1" />}
                  {ad.user?.plan !== 'FREE' ? 'Verified Employer' : 'Standard Account'}
                </p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl border-2 border-[var(--border-strong)] text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors">
              View Company Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
