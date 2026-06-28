"use client";

import { useState } from 'react';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

const initialListings = [
  {
    id: 'L-101',
    title: 'Mercedes-Benz G63 AMG 2023',
    price: 'AED 1,150,000',
    status: 'active',
    views: 1205,
    leads: 12,
    postedAt: '2 days ago',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'L-102',
    title: 'Dubai Marina Waterfront Apartment',
    price: 'AED 120,000 / year',
    status: 'under_review',
    views: 0,
    leads: 0,
    postedAt: 'Just now',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'L-103',
    title: 'Sony A7IV Mirrorless Camera',
    price: 'AED 8,500',
    status: 'sold',
    views: 450,
    leads: 8,
    postedAt: '2 weeks ago',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'
  }
];

export default function MyListingsPage() {
  const [filter, setFilter] = useState('all');

  const filteredListings = initialListings.filter(listing => {
    if (filter === 'all') return true;
    if (filter === 'active') return listing.status === 'active';
    if (filter === 'review') return listing.status === 'under_review';
    if (filter === 'sold') return listing.status === 'sold';
    return true;
  });

  const getTabClass = (currentFilter: string) => {
    return filter === currentFilter
      ? "border-[var(--brand-primary)] text-[var(--brand-primary)] whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer"
      : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:text-white whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer transition-colors";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Ads</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your active inventory, boost listings, or mark items as sold.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href="/post" className="gh-button-primary">
            Post New Ad
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-subtle)] pb-px">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setFilter('all')} className={getTabClass('all')}>
            All Ads ({initialListings.length})
          </button>
          <button onClick={() => setFilter('active')} className={getTabClass('active')}>
            Active ({initialListings.filter(l => l.status === 'active').length})
          </button>
          <button onClick={() => setFilter('review')} className={getTabClass('review')}>
            Under Review ({initialListings.filter(l => l.status === 'under_review').length})
          </button>
          <button onClick={() => setFilter('sold')} className={getTabClass('sold')}>
            Sold / Expired ({initialListings.filter(l => l.status === 'sold').length})
          </button>
        </nav>
      </div>

      {/* Listings List */}
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] shadow-[var(--shadow-md)]">
        {filteredListings.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">
            <p>No ads found in this category.</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-[var(--border-subtle)]">
            {filteredListings.map((listing) => (
              <li key={listing.id} className="p-4 sm:p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-24 sm:h-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">{listing.id}</p>
                      <p className="truncate text-base font-bold text-[var(--text-primary)]">{listing.title}</p>
                      <p className="text-sm font-semibold text-[var(--brand-primary)] mt-1">{listing.price}</p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center">
                          <span className={`mr-1.5 h-2 w-2 rounded-full ${
                            listing.status === 'active' ? 'bg-green-500' :
                            listing.status === 'under_review' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          {listing.status === 'active' ? 'Active' : listing.status === 'under_review' ? 'Reviewing' : 'Sold'}
                        </span>
                        <span>•</span>
                        <span>{listing.views} views</span>
                        <span>•</span>
                        <span>{listing.leads} leads</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:flex-col sm:space-x-0 sm:space-y-2">
                    <button type="button" className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 sm:w-auto">
                      <PencilSquareIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-white/50" aria-hidden="true" />
                      Edit
                    </button>
                    <button type="button" className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 px-3 py-2 text-xs font-semibold text-[var(--brand-primary)] shadow-sm ring-1 ring-inset ring-[var(--brand-primary)]/20 hover:bg-[var(--brand-primary)]/20 sm:w-auto">
                      <ArrowPathIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                      Boost
                    </button>
                    <button type="button" className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-white/10 hover:bg-red-500/10 hover:ring-red-500/20 sm:w-auto">
                      <TrashIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
