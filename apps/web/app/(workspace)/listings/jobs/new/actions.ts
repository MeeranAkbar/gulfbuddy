'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedUserContext } from '../../../../../lib/auth/session';
import { createSupabaseAdminClient } from '../../../../../lib/supabase/admin';
import { slugify } from '../../../../../lib/utils/slugify';

export interface JobsDraftActionState {
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

export async function createJobsDraftAction(
  _previousState: JobsDraftActionState,
  formData: FormData
): Promise<JobsDraftActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before creating a job draft.'
    };
  }

  const ownerCompanyId = getNullableText(formData, 'ownerCompanyId');
  const title = getText(formData, 'title');
  const companyName = getText(formData, 'companyName');
  const jobTitle = getText(formData, 'jobTitle') || title;
  const employmentType = getText(formData, 'employmentType') || 'full_time';
  const workMode = getText(formData, 'workMode') || 'on_site';
  const experienceLevel = getText(formData, 'experienceLevel') || 'mid';
  const industry = getText(formData, 'industry');
  const price = getNullableNumber(formData, 'salaryMin'); // Base salary
  const emirate = getText(formData, 'emirate');
  const area = getText(formData, 'area');

  if (!title || !companyName || !price) {
    return {
      status: 'error',
      message: 'Please fill in all required fields marked with *.'
    };
  }

  const slug = slugify([title, companyName, emirate].filter(Boolean).join('-'));

  try {
    const adminClient = createSupabaseAdminClient();

    // 1. Insert into listing.listing_core
    const { data: coreListing, error: coreError } = await adminClient
      .schema('listing')
      .from('listing_core')
      .insert({
        section: 'jobs',
        owner_user_id: context.userId,
        owner_company_id: ownerCompanyId,
        branch_id: getNullableText(formData, 'branchId'),
        seller_type: 'business',
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
    const publicEmail = getNullableText(formData, 'publicEmail');
    if (publicEmail) {
      await adminClient
        .schema('listing')
        .from('listing_contacts')
        .insert({
          listing_id: listingId,
          public_phone: getNullableText(formData, 'publicPhone'),
          public_whatsapp: getNullableText(formData, 'publicWhatsapp'),
          public_email: publicEmail,
          hide_number_until_click: formData.get('hideNumberUntilClick') === 'on',
          click_to_reveal_enabled: true,
          preferred_contact_method: 'email'
        });
    }

    // 3. Insert into jobs.job_listing_details
    const { error: jobsError } = await adminClient
      .schema('jobs')
      .from('job_listing_details')
      .insert({
        listing_id: listingId,
        job_title: jobTitle,
        employment_type: employmentType,
        work_mode: workMode,
        salary_min: price,
        salary_max: getNullableNumber(formData, 'salaryMax'),
        salary_currency: 'AED',
        salary_period: 'monthly',
        experience_level: experienceLevel,
        industry,
        department: getNullableText(formData, 'department'),
        openings_count: getNullableNumber(formData, 'openingsCount') || 1,
        urgent_hiring: formData.get('urgentHiring') === 'on',
        valid_through: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days valid
      });

    if (jobsError) {
      await adminClient.schema('listing').from('listing_core').delete().eq('id', listingId);
      return {
        status: 'error',
        message: jobsError.message
      };
    }

    revalidatePath('/listings');
    revalidatePath('/dashboard');

    return {
      status: 'success',
      message: 'Job draft listing saved successfully in your workspace.',
      listingId,
      listingSlug: slug
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'An unexpected error occurred while saving the job draft.'
    };
  }
}
