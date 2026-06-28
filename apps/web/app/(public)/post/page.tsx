'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  BuildingOfficeIcon, 
  KeyIcon, 
  BriefcaseIcon, 
  ShoppingBagIcon, 
  WrenchScrewdriverIcon, 
  MapPinIcon,
  PhotoIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { AdBanner } from '../../../components/ui/ad-banner';

import {
  PROPERTY_AMENITIES,
  PROPERTY_FURNISHING,
  RENT_FREQUENCIES,
  LISTED_BY
} from '../../../lib/property/constants';

import {
  MOTOR_FEATURES,
  MOTOR_REGIONAL_SPECS,
  MOTOR_BODY_TYPES,
  MOTOR_FUEL_TYPES,
  MOTOR_TRANSMISSIONS,
  MOTOR_DOORS,
  MOTOR_CYLINDERS
} from '../../../lib/motors/constants';

import {
  JOB_INDUSTRIES,
  JOB_CAREER_LEVELS,
  JOB_EMPLOYMENT_TYPES,
  JOB_EDUCATION_LEVELS,
  JOB_BENEFITS
} from '../../../lib/jobs/constants';

import {
  CLASSIFIEDS_CONDITIONS,
  CLASSIFIEDS_WARRANTY,
  CLASSIFIEDS_CATEGORIES
} from '../../../lib/classifieds/constants';

import {
  SERVICE_CATEGORIES,
  SERVICE_FREQUENCIES,
  SERVICE_RATE_TYPES
} from '../../../lib/services/constants';

import {
  DIRECTORY_CATEGORIES,
  BUSINESS_SIZES,
  BUSINESS_FEATURES
} from '../../../lib/directory/constants';

const categories = [
  { id: 'property', name: 'Property', icon: BuildingOfficeIcon, color: 'bg-blue-500' },
  { id: 'motors', name: 'Motors', icon: KeyIcon, color: 'bg-orange-500' },
  { id: 'jobs', name: 'Jobs', icon: BriefcaseIcon, color: 'bg-green-600' },
  { id: 'classifieds', name: 'Classifieds', icon: ShoppingBagIcon, color: 'bg-purple-500' },
  { id: 'services', name: 'Services', icon: WrenchScrewdriverIcon, color: 'bg-red-500' },
  { id: 'directory', name: 'Directory', icon: MapPinIcon, color: 'bg-yellow-500' }
];

export default function PostAdWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({ 
    category: '', 
    title: '', 
    price: '', 
    description: '',
    amenities: [] as string[],
    furnishingStatus: '',
    rentFrequency: '',
    listedBy: '',
    motorFeatures: [] as string[],
    jobBenefits: [] as string[],
    condition: '',
    regionalSpecs: '',
    doors: '',
    cylinders: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    make: '',
    model: '',
    industry: '',
    careerLevel: '',
    employmentType: '',
    educationLevel: '',
    warranty: '',
    subCategory: '',
    serviceCategory: '',
    serviceFrequency: '',
    rateType: '',
    businessCategory: '',
    tradeLicense: '',
    businessSize: '',
    businessFeatures: [] as string[],
    imageUrl: '',
    marketMode: 'sale',
    location: '',
    emirate: 'Dubai'
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Set the category we selected in Step 1
      const payload = { ...formData, category: selectedCategory };
      
      const res = await fetch('/api/ads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create ad');
      
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-elevated)] pb-24 pt-12">
      <div className="mx-auto max-w-3xl px-5">
        
        {/* Header & Progress */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Post an Ad</h1>
          <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">Reach thousands of buyers across the UAE</p>
          
          <div className="mt-8 flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-2 w-16 rounded-full transition-colors ${step >= i ? 'bg-[var(--accent)]' : 'bg-[var(--border-default)]'}`} />
            ))}
          </div>
        </div>

        {/* Wizard Container */}
        <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-8 shadow-[var(--shadow-md)] md:p-12">
          
          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">What are you offering?</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); nextStep(); }}
                    className={`group flex flex-col items-center justify-center gap-4 rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedCategory === cat.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border-default)] bg-transparent hover:border-[var(--border-strong)]'}`}
                  >
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${cat.color} text-white shadow-md transition-transform group-hover:scale-110`}>
                      <cat.icon className="h-8 w-8" />
                    </div>
                    <span className="font-semibold text-[var(--text-primary)]">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Add some details</h2>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Ad Title</label>
                  <input
                    type="text"
                    placeholder="e.g., 2023 Toyota Land Cruiser VXR"
                    className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Price (AED)</label>
                  <input
                    type="number"
                    placeholder="e.g., 385000"
                    className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                {selectedCategory === 'property' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Sale or Rent</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.marketMode} onChange={(e) => setFormData({...formData, marketMode: e.target.value})}>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Property Type</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.subCategory} onChange={(e) => setFormData({...formData, subCategory: e.target.value})}>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Penthouse">Penthouse</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Bedrooms</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]">
                        <option>Studio</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Bathrooms</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Size (SqFt)</label>
                      <input type="number" placeholder="e.g., 1200" className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Emirate</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.emirate} onChange={(e) => setFormData({...formData, emirate: e.target.value})}>
                        <option value="Dubai">Dubai</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Sharjah">Sharjah</option>
                        <option value="Ajman">Ajman</option>
                        <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Location / Community</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}>
                        <option value="">Select a community...</option>
                        <option value="Dubai Marina">Dubai Marina</option>
                        <option value="Downtown Dubai">Downtown Dubai</option>
                        <option value="Business Bay">Business Bay</option>
                        <option value="Jumeirah Village Circle (JVC)">Jumeirah Village Circle (JVC)</option>
                        <option value="Palm Jumeirah">Palm Jumeirah</option>
                        <option value="Al Reem Island">Al Reem Island</option>
                        <option value="Al Majaz">Al Majaz</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Furnishing Status</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.furnishingStatus} onChange={e => setFormData({...formData, furnishingStatus: e.target.value})}>
                        <option value="">Select...</option>
                        {PROPERTY_FURNISHING.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    {formData.marketMode === 'rent' && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Rent Frequency</label>
                        <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.rentFrequency} onChange={e => setFormData({...formData, rentFrequency: e.target.value})}>
                          <option value="">Select...</option>
                          {RENT_FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Listed By</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.listedBy} onChange={e => setFormData({...formData, listedBy: e.target.value})}>
                        <option value="">Select...</option>
                        {LISTED_BY.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="col-span-2 mt-4">
                      <label className="mb-4 block text-sm font-semibold text-[var(--text-primary)]">Amenities (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {PROPERTY_AMENITIES.map((amenity) => (
                          <label key={amenity} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3 cursor-pointer hover:border-[var(--brand-primary)]">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                              checked={formData.amenities.includes(amenity)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({...formData, amenities: [...formData.amenities, amenity]});
                                } else {
                                  setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                                }
                              }}
                            />
                            <span className="text-xs font-medium text-[var(--text-secondary)] leading-tight">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedCategory === 'motors' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Make</label>
                      <input type="text" placeholder="e.g., Toyota, BMW" className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Model</label>
                      <input type="text" placeholder="e.g., Land Cruiser, X5" className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Year</label>
                      <input type="number" placeholder="e.g., 2023" className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Mileage (km)</label>
                      <input type="number" placeholder="e.g., 45000" className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Transmission</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
                        <option value="">Select...</option>
                        {MOTOR_TRANSMISSIONS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Body Type</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.bodyType} onChange={e => setFormData({...formData, bodyType: e.target.value})}>
                        <option value="">Select...</option>
                        {MOTOR_BODY_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Regional Specs</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.regionalSpecs} onChange={e => setFormData({...formData, regionalSpecs: e.target.value})}>
                        <option value="">Select...</option>
                        {MOTOR_REGIONAL_SPECS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Fuel Type</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}>
                        <option value="">Select...</option>
                        {MOTOR_FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Doors</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.doors} onChange={e => setFormData({...formData, doors: e.target.value})}>
                        <option value="">Select...</option>
                        {MOTOR_DOORS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Cylinders</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.cylinders} onChange={e => setFormData({...formData, cylinders: e.target.value})}>
                        <option value="">Select...</option>
                        {MOTOR_CYLINDERS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="col-span-2 mt-4">
                      <label className="mb-4 block text-sm font-semibold text-[var(--text-primary)]">Features (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {MOTOR_FEATURES.map((feature) => (
                          <label key={feature} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3 cursor-pointer hover:border-[var(--brand-primary)]">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                              checked={formData.motorFeatures.includes(feature)}
                              onChange={(e) => {
                                if (e.target.checked) setFormData({...formData, motorFeatures: [...formData.motorFeatures, feature]});
                                else setFormData({...formData, motorFeatures: formData.motorFeatures.filter(a => a !== feature)});
                              }}
                            />
                            <span className="text-xs font-medium text-[var(--text-secondary)] leading-tight">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedCategory === 'jobs' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Industry</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                        <option value="">Select...</option>
                        {JOB_INDUSTRIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Employment Type</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})}>
                        <option value="">Select...</option>
                        {JOB_EMPLOYMENT_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Career Level</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.careerLevel} onChange={e => setFormData({...formData, careerLevel: e.target.value})}>
                        <option value="">Select...</option>
                        {JOB_CAREER_LEVELS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Education Level</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.educationLevel} onChange={e => setFormData({...formData, educationLevel: e.target.value})}>
                        <option value="">Select...</option>
                        {JOB_EDUCATION_LEVELS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="col-span-2 mt-4">
                      <label className="mb-4 block text-sm font-semibold text-[var(--text-primary)]">Benefits Offered (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {JOB_BENEFITS.map((benefit) => (
                          <label key={benefit} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3 cursor-pointer hover:border-[var(--brand-primary)]">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                              checked={formData.jobBenefits.includes(benefit)}
                              onChange={(e) => {
                                if (e.target.checked) setFormData({...formData, jobBenefits: [...formData.jobBenefits, benefit]});
                                else setFormData({...formData, jobBenefits: formData.jobBenefits.filter(a => a !== benefit)});
                              }}
                            />
                            <span className="text-xs font-medium text-[var(--text-secondary)] leading-tight">{benefit}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedCategory === 'classifieds' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Category</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                        <option value="">Select...</option>
                        {CLASSIFIEDS_CATEGORIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Condition</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                        <option value="">Select...</option>
                        {CLASSIFIEDS_CONDITIONS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Warranty</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})}>
                        <option value="">Select...</option>
                        {CLASSIFIEDS_WARRANTY.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {selectedCategory === 'services' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Service Category</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.serviceCategory} onChange={e => setFormData({...formData, serviceCategory: e.target.value})}>
                        <option value="">Select...</option>
                        {SERVICE_CATEGORIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Service Frequency</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.serviceFrequency} onChange={e => setFormData({...formData, serviceFrequency: e.target.value})}>
                        <option value="">Select...</option>
                        {SERVICE_FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Rate Type</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.rateType} onChange={e => setFormData({...formData, rateType: e.target.value})}>
                        <option value="">Select...</option>
                        {SERVICE_RATE_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {selectedCategory === 'directory' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Business Category</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.businessCategory} onChange={e => setFormData({...formData, businessCategory: e.target.value})}>
                        <option value="">Select...</option>
                        {DIRECTORY_CATEGORIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Trade License Number</label>
                      <input type="text" placeholder="e.g., 1234567" className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.tradeLicense} onChange={e => setFormData({...formData, tradeLicense: e.target.value})} />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Business Size</label>
                      <select className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" value={formData.businessSize} onChange={e => setFormData({...formData, businessSize: e.target.value})}>
                        <option value="">Select...</option>
                        {BUSINESS_SIZES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="col-span-2 mt-4">
                      <label className="mb-4 block text-sm font-semibold text-[var(--text-primary)]">Business Features (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {BUSINESS_FEATURES.map((feature) => (
                          <label key={feature} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-3 cursor-pointer hover:border-[var(--brand-primary)]">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                              checked={formData.businessFeatures.includes(feature)}
                              onChange={(e) => {
                                if (e.target.checked) setFormData({...formData, businessFeatures: [...formData.businessFeatures, feature]});
                                else setFormData({...formData, businessFeatures: formData.businessFeatures.filter(a => a !== feature)});
                              }}
                            />
                            <span className="text-xs font-medium text-[var(--text-secondary)] leading-tight">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your item, highlighting key features..."
                    className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="rounded-xl border border-[var(--border-strong)] px-6 py-3 font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-alt)]">Back</button>
                <button onClick={nextStep} className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--text-inverse)] hover:bg-[var(--primary-hover)]">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Upload Photos</h2>
              <div 
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--background)] py-16 cursor-pointer transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  accept="image/*" 
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      setUploadedPhotos(prev => prev + (e.target.files?.length || 0));
                      
                      const uploadData = new FormData();
                      for (let i = 0; i < e.target.files.length; i++) {
                        uploadData.append('file', e.target.files[i]);
                      }

                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: uploadData
                        });
                        const data = await res.json();
                        if (data.success && data.urls.length > 0) {
                          // Save the first image URL to formData
                          setFormData({ ...formData, imageUrl: data.urls[0] });
                        }
                      } catch (error) {
                        console.error('Upload failed:', error);
                      }
                    }
                  }}
                />
                <PhotoIcon className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {uploadedPhotos > 0 ? `${uploadedPhotos} photos selected` : 'Drag and drop images here'}
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">or click to browse from your device</p>
                <button 
                  type="button" 
                  className="mt-6 rounded-lg bg-[var(--surface)] px-4 py-2 text-sm font-bold shadow-sm hover:shadow-md pointer-events-none"
                >
                  Browse Files
                </button>
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="rounded-xl border border-[var(--border-strong)] px-6 py-3 font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-alt)]">Back</button>
                <button onClick={nextStep} className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--text-inverse)] hover:bg-[var(--primary-hover)]">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PUBLISH */}
          {step === 4 && (
            <div className="space-y-8 text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircleIcon className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Ready to publish!</h2>
              <p className="mx-auto max-w-sm text-[var(--text-secondary)]">
                Your ad looks great. Sign in to your account or continue as a guest to make it live instantly.
              </p>
              
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-6 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Preview</p>
                <h3 className="mt-2 text-lg font-bold text-[var(--text-primary)]">{formData.title || 'Untitled Ad'}</h3>
                <p className="text-xl font-bold text-[var(--accent)]">AED {formData.price || '0'}</p>
              </div>

              {submitError && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {submitError}
                </div>
              )}

              {submitSuccess ? (
                <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
                  <h3 className="text-lg font-bold">Ad Published Successfully!</h3>
                  <p className="mt-2 text-sm">Your ad has been saved to the database. You can now view it in your dashboard.</p>
                  <Link href="/dashboard/listings" className="mt-6 inline-block rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-lg hover:opacity-90">
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <button onClick={prevStep} disabled={isSubmitting} className="rounded-xl border border-[var(--border-strong)] px-8 py-3 font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-alt)] disabled:opacity-50">Edit Ad</button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl bg-[var(--accent)] px-8 py-3 font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50">
                    {isSubmitting ? 'Publishing...' : 'Publish Ad Now'}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
        
        <AdBanner className="mt-8" type="leaderboard" />
      </div>
    </div>
  );
}
