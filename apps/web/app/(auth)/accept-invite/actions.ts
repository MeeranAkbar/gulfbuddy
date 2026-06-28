'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { companyMemberInviteAcceptanceSchema } from '@gulfbuddy/validation';
import { ZodError } from 'zod';
import { getAuthenticatedUserContext } from '../../../lib/auth/session';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export interface AcceptCompanyInviteActionState {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function flattenZodErrors(error: ZodError) {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join('.') || 'form';
    acc[key] = [...(acc[key] || []), issue.message];
    return acc;
  }, {});
}

export async function acceptCompanyInviteAction(
  _previousState: AcceptCompanyInviteActionState,
  formData: FormData
): Promise<AcceptCompanyInviteActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before accepting the company invite.'
    };
  }

  const parsed = companyMemberInviteAcceptanceSchema.safeParse({
    token: getText(formData, 'token')
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'The invite token is missing or invalid.',
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('accept_company_member_invite', {
    payload: parsed.data
  });

  if (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

  revalidatePath('/company');
  revalidatePath('/company/members');
  redirect('/company/members?invite=accepted');
}
