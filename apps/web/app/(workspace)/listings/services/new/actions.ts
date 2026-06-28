'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { createSupabaseAdminClient } from '../../../../../lib/supabase/admin';
import { slugify } from '../../../../../lib/utils/slugify';

export interface ServicesDraftActionState {
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

export async function createServicesDraftAction(
  _previousState: ServicesDraftActionState,
  formData: FormData
): Promise<ServicesDraftActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before creating a service draft.'
    };
  }

  const ownerCompanyId = getNullableText(formData, 'ownerCompanyId');
  const title = getText(formData, 'title');
  const providerName = getText(formData, 'providerName');
  const category = getText(formData, 'category');
  const pricingModel = getText(formData, 'pricingModel') || 'quote_based';
  const basePrice = getNullableNumber(formData, 'priceAmount');
  const emirate = getText(formData, 'emirate');
  const area = getText(formData, 'area');

  if (!title || !providerName || !category || !ownerCompanyId) {
    return {
      status: 'error',
      message: 'Please fill in all required fields marked with *.'
    };
  }

  const slug = slugify([title, providerName, emirate].filter(Boolean).join('-'));

  try {
    const adminClient = createSupabaseAdminClient();

    // 1. Insert into listing.listing_core
    const { data: coreListing, error: coreError } = await adminClient
      .schema('listing')
      .from('listing_core')
      .insert({
        section: 'services',
        owner_user_id: context.userId,
        owner_company_id: ownerCompanyId,
        branch_id: getNullableText(formData, 'branchId'),
        seller_type: 'business',
        slug,
        title,
        description: getText(formData, 'description'),
        emirate,
        area: area || null,
        price_amount: basePrice,
        price_currency: 'AED',
        publication_state: 'draft'
      })
      .select('id')
      .single();

    if (coreError) {
      return {
        status: 'error',
        message: coreError.message
      };
    }

    const listingId = coreListing.id;

    // 2. Insert into listing.listing_contacts
    const publicPhone = getNullableText(formData, 'publicPhone');
    if (publicPhone) {
      await adminClient
        .schema('listing')
        .from('listing_contacts')
        .insert({
          listing_id: listingId,
          public_phone: publicPhone,
          public_whatsapp: getNullableText(formData, 'publicWhatsapp'),
          public_email: getNullableText(formData, 'publicEmail'),
          hide_number_until_click: formData.get('hideNumberUntilClick') === 'on',
          click_to_reveal_enabled: true,
          preferred_contact_method: getText(formData, 'preferredContactMethod') || 'phone'
        });
    }

    // 3. Upsert service provider profile
    await adminClient
      .schema('services')
      .from('service_provider_profiles')
      .upsert({
        company_id: ownerCompanyId,
        slug: slugify(providerName),
        provider_type: 'business_provider',
        display_name: providerName,
        headline: title,
        bio: getText(formData, 'description'),
        verification_status: 'pending',
        trust_tier: 'starter',
        is_accepting_requests: true
      });

    // 4. Insert into services.service_offerings
    const { error: offeringError } = await adminClient
      .schema('services')
      .from('service_offerings')
      .insert({
        company_id: ownerCompanyId,
        category,
        subcategory: getNullableText(formData, 'subcategory'),
        service_title: title,
        description: getText(formData, 'description'),
        pricing_model: pricingModel,
        base_price: basePrice,
        currency: 'AED',
        duration_estimate: getNullableText(formData, 'durationEstimate')
      });

    if (offeringError) {
      await adminClient.schema('listing').from('listing_core').delete().eq('id', listingId);
      return {
        status: 'error',
        message: offeringError.message
      };
    }

    // 5. Insert service coverage area
    await adminClient
      .schema('services')
      .from('service_areas')
      .insert({
        company_id: ownerCompanyId,
        emirate,
        area: area || null,
        area_slug: area ? slugify(area) : null,
        coverage_type: 'fixed_area'
      });

    revalidatePath('/listings');
    revalidatePath('/dashboard');

    return {
      status: 'success',
      message: 'Service offering draft saved successfully in your workspace.',
      listingId,
      listingSlug: slug
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'An unexpected error occurred while saving the service draft.'
    };
  }
}
