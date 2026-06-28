'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { createSupabaseAdminClient } from '../../../../../lib/supabase/admin';
import { slugify } from '../../../../../lib/utils/slugify';

export interface MotorsDraftActionState {
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

export async function createMotorsDraftAction(
  _previousState: MotorsDraftActionState,
  formData: FormData
): Promise<MotorsDraftActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before creating a vehicle draft.'
    };
  }

  const ownerCompanyId = getNullableText(formData, 'ownerCompanyId');
  const title = getText(formData, 'title');
  const make = getText(formData, 'make');
  const model = getText(formData, 'model');
  const year = getNullableNumber(formData, 'year');
  const price = getNullableNumber(formData, 'priceAmount');
  const emirate = getText(formData, 'emirate');
  const area = getText(formData, 'area');

  if (!title || !make || !model || !year || !price) {
    return {
      status: 'error',
      message: 'Please fill in all required fields marked with *.'
    };
  }

  const slug = slugify([title, make, model, year.toString(), emirate].filter(Boolean).join('-'));

  try {
    const adminClient = createSupabaseAdminClient();

    // 1. Insert into listing.listing_core
    const { data: coreListing, error: coreError } = await adminClient
      .schema('listing')
      .from('listing_core')
      .insert({
        section: 'motors',
        owner_user_id: context.userId,
        owner_company_id: ownerCompanyId,
        branch_id: getNullableText(formData, 'branchId'),
        seller_type: ownerCompanyId ? 'dealer' : 'individual',
        slug,
        title,
        description: getText(formData, 'description'),
        emirate,
        area: area || null,
        price_amount: price,
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

    // 3. Insert into motors.motor_listing_details
    const { error: motorsError } = await adminClient
      .schema('motors')
      .from('motor_listing_details')
      .insert({
        listing_id: listingId,
        listing_type: 'used',
        vehicle_type: getText(formData, 'vehicleType') || 'sedan',
        make,
        model,
        trim: getNullableText(formData, 'trim'),
        year,
        mileage: getNullableNumber(formData, 'mileage'),
        condition: getText(formData, 'condition') || 'good',
        fuel_type: getNullableText(formData, 'fuelType'),
        transmission: getNullableText(formData, 'transmission'),
        color: getNullableText(formData, 'color')
      });

    if (motorsError) {
      // Clean up core listing if details insert failed
      await adminClient.schema('listing').from('listing_core').delete().eq('id', listingId);
      return {
        status: 'error',
        message: motorsError.message
      };
    }

    revalidatePath('/listings');
    revalidatePath('/dashboard');

    return {
      status: 'success',
      message: 'Vehicle draft listing saved successfully in your workspace.',
      listingId,
      listingSlug: slug
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'An unexpected error occurred while saving the vehicle draft.'
    };
  }
}
