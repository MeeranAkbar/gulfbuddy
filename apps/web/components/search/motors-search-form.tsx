'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MotorsSearchFormProps {
  actionHref: string;
  actionLabel: string;
}

export function MotorsSearchForm({ actionHref, actionLabel }: MotorsSearchFormProps) {
  const [keyword, setKeyword] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [make, setMake] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-3 shadow-[var(--shadow-lg)] backdrop-blur-xl lg:flex-row lg:items-end">
        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Keyword</span>
          <input
            className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]"
            value={keyword}
            placeholder="Toyota, Patrol, Model 3..."
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Vehicle Type</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
            <option value="">Any type</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
            <option value="pickup">Pickup</option>
            <option value="coupe">Coupe</option>
            <option value="van">Van</option>
          </select>
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Make</span>
          <select className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)]" value={make} onChange={(event) => setMake(event.target.value)}>
            <option value="">Any make</option>
            <option value="toyota">Toyota</option>
            <option value="nissan">Nissan</option>
            <option value="mercedes">Mercedes-Benz</option>
            <option value="bmw">BMW</option>
            <option value="ford">Ford</option>
          </select>
        </label>

        <label className="flex-1 space-y-2 text-left">
          <span className="block px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Model</span>
          <select 
            className="gh-field !rounded-[1.15rem] !border-[var(--border-subtle)] !bg-[var(--background-elevated)] !text-[var(--text-primary)] disabled:opacity-50" 
            disabled={!make}
          >
            <option value="">{make ? 'Any model' : 'Select make first'}</option>
            {make === 'toyota' && (
              <>
                <option value="land-cruiser">Land Cruiser</option>
                <option value="camry">Camry</option>
                <option value="corolla">Corolla</option>
              </>
            )}
            {make === 'nissan' && (
              <>
                <option value="patrol">Patrol</option>
                <option value="altima">Altima</option>
              </>
            )}
          </select>
        </label>

        <div className="flex items-end gap-2 lg:ml-2">
          <button
            type="button"
            className={`gh-button-secondary min-h-[50px] !rounded-[1.15rem] px-4 text-xs font-semibold transition ${showAdvanced ? 'border-[var(--primary)] bg-[var(--accent-soft)]' : ''}`}
            onClick={() => setShowAdvanced((current) => !current)}
          >
            Filters
          </button>
          <Link href={actionHref} className="gh-button-primary min-h-[50px] w-full items-center justify-center lg:w-auto">
            {actionLabel}
          </Link>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid gap-4 rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 lg:grid-cols-4 animate-in slide-in-from-top-2 fade-in duration-200">
          
          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Min Year</span>
            <select className="gh-field !rounded-[1.15rem]">
              <option value="">Any</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Max Year</span>
            <select className="gh-field !rounded-[1.15rem]">
              <option value="">Any</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Min Price (AED)</span>
            <input className="gh-field !rounded-[1.15rem]" inputMode="numeric" placeholder="No min" />
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Max Price (AED)</span>
            <input className="gh-field !rounded-[1.15rem]" inputMode="numeric" placeholder="No max" />
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Seller Type</span>
            <select className="gh-field !rounded-[1.15rem]">
              <option value="">Any seller</option>
              <option value="dealer">Verified Dealer</option>
              <option value="private">Private Seller</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Condition</span>
            <select className="gh-field !rounded-[1.15rem]">
              <option value="">Any condition</option>
              <option value="new">Brand New</option>
              <option value="used">Used</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
