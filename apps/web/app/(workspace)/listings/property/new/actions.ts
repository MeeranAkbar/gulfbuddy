'use server';

import { revalidatePath } from 'next/cache';
import { propertyPostingSchema } from '@gulfbuddy/validation';
import type { PropertyAdvertiserType, PropertyMarketMode } from '@gulfbuddy/types';
import { ZodError } from 'zod';
import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { inferPropertySellerType, inferPropertySourceRelationshipType } from '../../../../../lib/company/helpers';
import { inferPropertyPermitSystem, inferPropertyRegulatorRegion } from '../../../../../lib/property/helpers';
import { createSupabaseServerClient } from '../../../../../lib/supabase/server';
import { slugify } from '../../../../../lib/utils/slugify';

export interface PropertyDraftActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  listingId?: string;
  listingSlug?: string;
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value ? value : null;
}

function getNullableNumber(formData: FormData, key: string) {
  const value = getText(formData, key);

  if (!value) return null;

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function mapPropertyIssuePath(path: (string | number)[]) {
  const joined = path.join('.');

  switch (joined) {
    case 'ownerCompanyId':
      return 'ownerCompanyId';
    case 'title':
      return 'title';
    case 'description':
      return 'description';
    case 'emirate':
      return 'emirate';
    case 'area':
      return 'area';
    case 'locationText':
      return 'locationText';
    case 'priceAmount':
      return 'priceAmount';
    case 'property.marketMode':
      return 'marketMode';
    case 'property.purpose':
      return 'purpose';
    case 'property.propertyType':
      return 'propertyType';
    case 'property.propertySubtype':
      return 'propertySubtype';
    case 'property.bedrooms':
      return 'bedrooms';
    case 'property.bathrooms':
      return 'bathrooms';
    case 'property.sizeSqft':
      return 'sizeSqft';
    case 'property.furnishing':
      return 'furnishing';
    case 'property.completionStatus':
      return 'completionStatus';
    case 'property.rentFrequency':
      return 'rentFrequency';
    case 'property.buildingName':
      return 'buildingName';
    case 'property.communityName':
      return 'communityName';
    case 'property.projectName':
      return 'projectName';
    case 'compliance.advertiserType':
      return 'advertiserType';
    case 'compliance.permitNumber':
      return 'permitNumber';
    default:
      return joined || 'form';
  }
}

function flattenZodErrors(error: ZodError) {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = mapPropertyIssuePath(issue.path);
    acc[key] = [...(acc[key] || []), issue.message];
    return acc;
  }, {});
}

export async function createPropertyDraftAction(
  _previousState: PropertyDraftActionState,
  formData: FormData
): Promise<PropertyDraftActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before creating a property draft.'
    };
  }

  const ownerCompanyId = getText(formData, 'ownerCompanyId');

  if (!ownerCompanyId) {
    return {
      status: 'error',
      message: 'Select a company workspace before creating the property draft.',
      fieldErrors: {
        ownerCompanyId: ['Choose the company that owns this listing workflow.']
      }
    };
  }

  const marketMode = getText(formData, 'marketMode') as PropertyMarketMode;
  const emirate = getText(formData, 'emirate');
  const advertiserType = getText(formData, 'advertiserType') as PropertyAdvertiserType;
  const regulatorRegion = inferPropertyRegulatorRegion(emirate);
  const permitSystem = inferPropertyPermitSystem({ emirate, advertiserType, marketMode });
  const title = getText(formData, 'title');
  const propertyType = getText(formData, 'propertyType');
  const area = getText(formData, 'area');

  const payload = {
    section: 'property' as const,
    ownerUserId: context.userId,
    ownerCompanyId,
    branchId: getNullableText(formData, 'branchId'),
    sellerType: inferPropertySellerType(advertiserType),
    slug: slugify([title, emirate, area || propertyType].filter(Boolean).join('-')),
    title,
    description: getText(formData, 'description'),
    emirate,
    area: getNullableText(formData, 'area'),
    areaSlug: area ? slugify(area) : null,
    locationText: getNullableText(formData, 'locationText'),
    lat: null,
    lng: null,
    priceAmount: getNullableNumber(formData, 'priceAmount'),
    priceCurrency: 'AED',
    publicationState: 'draft' as const,
    riskState: 'normal' as const,
    monetizationState: 'none' as const,
    property: {
      marketMode,
      purpose: getText(formData, 'purpose') as 'sale' | 'rent',
      propertyType,
      propertySubtype: getNullableText(formData, 'propertySubtype'),
      bedrooms: getNullableNumber(formData, 'bedrooms'),
      bathrooms: getNullableNumber(formData, 'bathrooms'),
      sizeSqft: getNullableNumber(formData, 'sizeSqft'),
      furnishing: (getNullableText(formData, 'furnishing') || null) as 'furnished' | 'unfurnished' | 'semi_furnished' | null,
      completionStatus: (getNullableText(formData, 'completionStatus') || null) as 'ready' | 'off_plan' | 'under_construction' | null,
      rentFrequency: (getNullableText(formData, 'rentFrequency') || null) as 'daily' | 'weekly' | 'monthly' | 'yearly' | null,
      buildingName: getNullableText(formData, 'buildingName'),
      communityName: getNullableText(formData, 'communityName'),
      projectName: getNullableText(formData, 'projectName'),
      permitDisplayText: getNullableText(formData, 'permitNumber'),
      isShortTerm: marketMode === 'short_term',
      isProjectListing: marketMode === 'off_plan' || marketMode === 'new_project'
    },
    compliance: {
      regulatorRegion,
      advertiserType,
      permitSystem,
      permitNumber: getNullableText(formData, 'permitNumber'),
      permitQrPayload: getNullableText(formData, 'permitQrPayload'),
      manualReviewRequired: true
    }
  };

  const parsed = propertyPostingSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Check the property details and compliance fields before saving the draft.',
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  const rpcPayload = {
    ...parsed.data,
    sourceRelationshipType: inferPropertySourceRelationshipType(advertiserType),
    publicPhone: getNullableText(formData, 'publicPhone'),
    publicWhatsapp: getNullableText(formData, 'publicWhatsapp'),
    publicEmail: getNullableText(formData, 'publicEmail'),
    hideNumberUntilClick: formData.get('hideNumberUntilClick') === 'on',
    clickToRevealEnabled: true,
    preferredContactMethod: getText(formData, 'preferredContactMethod') || 'phone'
  };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('create_property_draft', { payload: rpcPayload });

  if (error) {
    return {
      status: 'error',
      message:
        error.code === '23505'
          ? 'A similar property slug already exists. Adjust the title or area and try again.'
          : error.message
    };
  }

  const createdListing = Array.isArray(data) ? data[0] : null;

  revalidatePath('/listings');
  revalidatePath('/listings/property/new');
  revalidatePath('/dashboard');

  return {
    status: 'success',
    message: 'Property draft saved successfully. The listing now has a structured compliance trail and can move into review later.',
    listingId: createdListing?.listing_id,
    listingSlug: createdListing?.listing_slug
  };
}
