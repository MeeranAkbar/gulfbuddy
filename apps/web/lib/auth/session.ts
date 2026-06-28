import type { AdminRole, AuthenticatedUserContext, CompanyRole, PermissionCode } from '@gulfbuddy/types';
import { createSupabaseServerClient } from '../supabase/server';
import { mergePermissions } from './permissions';

interface CompanyMemberRow {
  company_id: string;
  role: CompanyRole;
  permissions_json: string[] | null;
}

interface AdminMemberRow {
  role: AdminRole;
}

export async function getAuthenticatedUserContext(): Promise<AuthenticatedUserContext | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userRow } = await supabase
    .schema('core')
    .from('users')
    .select('id,email')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (!userRow) return null;

  const { data: companyMembers } = await supabase
    .schema('company')
    .from('company_members')
    .select('company_id,role,permissions_json')
    .eq('user_id', userRow.id)
    .eq('status', 'active');

  const { data: adminMembers } = await supabase.schema('ops').from('admin_members').select('role').eq('user_id', userRow.id);

  const permissionsByCompany = Object.fromEntries(
    (companyMembers || []).map((member: CompanyMemberRow) => [
      member.company_id,
      mergePermissions(member.role, (member.permissions_json || []) as PermissionCode[])
    ])
  );

  return {
    userId: userRow.id,
    email: userRow.email ?? user.email ?? null,
    companyIds: (companyMembers || []).map((member: CompanyMemberRow) => member.company_id),
    adminRoles: (adminMembers || []).map((member: AdminMemberRow) => member.role),
    permissionsByCompany
  };
}
