'use server';

import { revalidatePath } from 'next/cache';
import { companyBranchSchema } from '@gulfbuddy/validation';
import { ZodError } from 'zod';
import { getAuthenticatedUserContext } from '../../../../lib/auth/session';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

export interface CompanyBranchActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  branchId?: string;
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value ? value : null;
}

function mapBranchIssuePath(path: (string | number)[]) {
  const joined = path.join('.');

  switch (joined) {
    case 'companyId':
      return 'companyId';
    case 'name':
      return 'name';
    case 'emirate':
      return 'emirate';
    case 'area':
      return 'area';
    case 'address':
      return 'address';
    case 'phone':
      return 'phone';
    case 'email':
      return 'email';
    default:
      return joined || 'form';
  }
}

function flattenZodErrors(error: ZodError) {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = mapBranchIssuePath(issue.path);
    acc[key] = [...(acc[key] || []), issue.message];
    return acc;
  }, {});
}

export async function createCompanyBranchAction(
  _previousState: CompanyBranchActionState,
  formData: FormData
): Promise<CompanyBranchActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before creating a branch.'
    };
  }

  const payload = {
    companyId: getText(formData, 'companyId'),
    name: getText(formData, 'name'),
    emirate: getNullableText(formData, 'emirate'),
    area: getNullableText(formData, 'area'),
    address: getNullableText(formData, 'address'),
    phone: getNullableText(formData, 'phone'),
    email: getNullableText(formData, 'email'),
    isActive: true
  };

  const parsed = companyBranchSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Check the branch details and try again.',
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('create_company_branch', { payload: parsed.data });

  if (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

  const createdBranch = Array.isArray(data) ? data[0] : null;

  revalidatePath('/company');
  revalidatePath('/company/branches');

  return {
    status: 'success',
    message: 'Branch created successfully. It is now available for company-scoped inventory and reporting.',
    branchId: createdBranch?.branch_id
  };
}
