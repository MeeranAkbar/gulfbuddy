'use server';

import { revalidatePath } from 'next/cache';
import { companyMemberAssignmentSchema, companyMemberInviteSchema } from '@gulfbuddy/validation';
import { ZodError } from 'zod';
import { getAuthenticatedUserContext } from '../../../../lib/auth/session';
import { publicEnv } from '../../../../lib/env';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';

export interface CompanyMemberAssignmentActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  memberId?: string;
}

export interface CompanyMemberInviteActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  inviteId?: string;
  inviteUrl?: string;
  email?: string;
  expiresAt?: string;
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value ? value : null;
}

function mapMemberIssuePath(path: (string | number)[]) {
  const joined = path.join('.');

  switch (joined) {
    case 'companyId':
      return 'companyId';
    case 'email':
      return 'email';
    case 'role':
      return 'role';
    case 'branchId':
      return 'branchId';
    default:
      return joined || 'form';
  }
}

function flattenZodErrors(error: ZodError) {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = mapMemberIssuePath(issue.path);
    acc[key] = [...(acc[key] || []), issue.message];
    return acc;
  }, {});
}

export async function assignCompanyMemberAction(
  _previousState: CompanyMemberAssignmentActionState,
  formData: FormData
): Promise<CompanyMemberAssignmentActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before assigning company seats.'
    };
  }

  const payload = {
    companyId: getText(formData, 'companyId'),
    email: getText(formData, 'email').toLowerCase(),
    role: getText(formData, 'role'),
    branchId: getNullableText(formData, 'branchId')
  };

  const parsed = companyMemberAssignmentSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Check the seat assignment details and try again.',
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('assign_company_member', {
    payload: parsed.data
  });

  if (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

  const assignedSeat = Array.isArray(data) ? data[0] : null;

  revalidatePath('/company');
  revalidatePath('/company/members');

  return {
    status: 'success',
    message: 'Company seat assigned successfully. The user now appears in the shared team model.',
    memberId: assignedSeat?.member_id
  };
}

export async function createCompanyMemberInviteAction(
  _previousState: CompanyMemberInviteActionState,
  formData: FormData
): Promise<CompanyMemberInviteActionState> {
  const context = await getAuthenticatedUserContext();

  if (!context) {
    return {
      status: 'error',
      message: 'Sign in before inviting company teammates.'
    };
  }

  const payload = {
    companyId: getText(formData, 'companyId'),
    email: getText(formData, 'email').toLowerCase(),
    role: getText(formData, 'role'),
    branchId: getNullableText(formData, 'branchId')
  };

  const parsed = companyMemberInviteSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Check the invite details and try again.',
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('create_company_member_invite', {
    payload: parsed.data
  });

  if (error) {
    return {
      status: 'error',
      message: error.message
    };
  }

  const invite = Array.isArray(data) ? data[0] : null;
  const inviteToken = invite?.invite_token as string | undefined;
  const inviteUrl = inviteToken
    ? new URL(`/accept-invite?token=${encodeURIComponent(inviteToken)}`, publicEnv.NEXT_PUBLIC_APP_URL).toString()
    : undefined;

  revalidatePath('/company');
  revalidatePath('/company/members');

  return {
    status: 'success',
    message: 'Invite created successfully. Share the acceptance link below until email automation is wired.',
    inviteId: invite?.invite_id,
    inviteUrl,
    email: invite?.email,
    expiresAt: invite?.expires_at
  };
}
