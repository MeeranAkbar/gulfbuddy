'use server';

import { revalidatePath } from 'next/cache';
import type { CompanyType } from '@gulfbuddy/types';
import { companyOnboardingSchema } from '@gulfbuddy/validation';
import { ZodError } from 'zod';
import { getAuthenticatedUserContext } from '../../../../lib/auth/session';
import { inferPrimaryCompanyRole } from '../../../../lib/company/helpers';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import { slugify } from '../../../../lib/utils/slugify';

export interface CompanyOnboardingActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  companyId?: string;
  companySlug?: string;
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value ? value : null;
}

function mapCompanyIssuePath(path: (string | number)[]) {
  const joined = path.join('.');

  switch (joined) {
    case 'company.companyType':
      return 'companyType';
    case 'company.legalName':
      return 'legalName';
    case 'company.displayName':
      return 'displayName';
    case 'company.slug':
      return 'displayName';
    case 'company.website':
      return 'website';
    case 'company.licenseNumber':
      return 'licenseNumber';
    case 'branch.name':
      return 'branchName';
    case 'branch.emirate':
      return 'branchEmirate';
    case 'branch.area':
      return 'branchArea';
    case 'branch.address':
      return 'branchAddress';
    case 'branch.phone':
      return 'branchPhone';
    case 'branch.email':
      return 'branchEmail';
    case 'publicProfileSummary':
      return 'publicProfileSummary';
    default:
      return joined || 'form';
  }
}

function flattenZodErrors(error: ZodError) {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = mapCompanyIssuePath(issue.path);
    acc[key] = [...(acc[key] || []), issue.message];
    return acc;
  }, {});
}

export async function onboardCompanyAction(
  _previousState: CompanyOnboardingActionState,
  formData: FormData
): Promise<CompanyOnboardingActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before creating a company workspace.'
    };
  }

  const companyType = getText(formData, 'companyType');
  const legalName = getText(formData, 'legalName');
  const displayName = getText(formData, 'displayName');

  const payload = {
    company: {
      companyType,
      legalName,
      displayName,
      slug: slugify(displayName || legalName || companyType),
      website: getNullableText(formData, 'website'),
      licenseNumber: getNullableText(formData, 'licenseNumber'),
      publicProfileEnabled: formData.get('publicProfileEnabled') === 'on'
    },
    primaryRole: inferPrimaryCompanyRole(companyType as CompanyType),
    branch: getText(formData, 'branchName')
      ? {
          name: getText(formData, 'branchName'),
          emirate: getNullableText(formData, 'branchEmirate'),
          area: getNullableText(formData, 'branchArea'),
          address: getNullableText(formData, 'branchAddress'),
          phone: getNullableText(formData, 'branchPhone'),
          email: getNullableText(formData, 'branchEmail'),
          isActive: true
        }
      : undefined,
    publicProfileSummary: getNullableText(formData, 'publicProfileSummary')
  };

  const parsed = companyOnboardingSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Check the highlighted company details and try again.',
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('create_company_with_owner', { payload: parsed.data });

  if (error) {
    return {
      status: 'error',
      message:
        error.code === '23505'
          ? 'That company slug is already taken. Try a slightly different public display name.'
          : error.message
    };
  }

  const createdCompany = Array.isArray(data) ? data[0] : null;

  revalidatePath('/company');
  revalidatePath('/company/onboarding');
  revalidatePath('/dashboard');

  return {
    status: 'success',
    message: 'Company workspace created successfully. You can now move into branches, team seats, and regulated listing flows.',
    companyId: createdCompany?.company_id,
    companySlug: createdCompany?.company_slug
  };
}
