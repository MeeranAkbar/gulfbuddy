import type { AuthenticatedUserContext, CompanyRole, PermissionCode } from '@gulfbuddy/types';
import { getRolePermissions } from '@gulfbuddy/types';

export function mergePermissions(role: CompanyRole, explicitPermissions: string[] = []): PermissionCode[] {
  const merged = new Set<PermissionCode>(getRolePermissions(role));
  explicitPermissions.forEach((permission) => {
    merged.add(permission as PermissionCode);
  });
  return Array.from(merged);
}

export function hasCompanyPermission(
  context: AuthenticatedUserContext | null,
  companyId: string,
  permission: PermissionCode
) {
  if (!context) return false;
  return (context.permissionsByCompany[companyId] || []).includes(permission);
}

export function canAccessCompany(context: AuthenticatedUserContext | null, companyId: string) {
  if (!context) return false;
  return context.companyIds.includes(companyId);
}

export function isAdmin(context: AuthenticatedUserContext | null) {
  return !!context && context.adminRoles.length > 0;
}
