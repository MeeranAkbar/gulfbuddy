import { envFlags, publicEnv, serverEnv } from '../env';

export interface PlatformReadinessCheck {
  label: string;
  ok: boolean;
  detail: string;
}

export interface PlatformReadinessSnapshot {
  status: 'ready' | 'needs_schema_apply' | 'env_missing' | 'unreachable';
  publicEnvConfigured: boolean;
  serviceRoleConfigured: boolean;
  databaseReachable: boolean;
  schemaReady: boolean;
  nextAction: string;
  checks: PlatformReadinessCheck[];
}

interface RemoteCheckDefinition {
  label: string;
  schema: string;
  path: string;
}

const remoteChecks: RemoteCheckDefinition[] = [
  { label: 'core.users', schema: 'core', path: 'users?select=id&limit=1' },
  { label: 'listing.listing_core', schema: 'listing', path: 'listing_core?select=id&limit=1' },
  { label: 'risk.risk_detection_rules', schema: 'risk', path: 'risk_detection_rules?select=id&limit=1' },
  { label: 'ops.system_settings', schema: 'ops', path: 'system_settings?select=key&limit=1' },
  { label: 'public.property_search_public_v1', schema: 'public', path: 'property_search_public_v1?select=id&limit=1' },
  { label: 'public.jobs_search_public_v1', schema: 'public', path: 'jobs_search_public_v1?select=id&limit=1' },
  { label: 'public.services_search_public_v1', schema: 'public', path: 'services_search_public_v1?select=provider_slug&limit=1' }
];

function buildHeaders(schema: string) {
  return {
    apikey: serverEnv.SUPABASE_SERVICE_ROLE_KEY || '',
    Authorization: `Bearer ${serverEnv.SUPABASE_SERVICE_ROLE_KEY || ''}`,
    Accept: 'application/json',
    'Accept-Profile': schema
  };
}

async function runRemoteCheck(check: RemoteCheckDefinition): Promise<PlatformReadinessCheck> {
  try {
    const response = await fetch(`${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${check.path}`, {
      method: 'GET',
      headers: buildHeaders(check.schema),
      cache: 'no-store'
    });

    const raw = await response.text();
    let parsed: unknown = null;

    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = raw;
    }

    if (!response.ok) {
      const detail =
        typeof parsed === 'object' && parsed && 'message' in parsed
          ? String((parsed as { message?: string }).message || 'Remote check failed')
          : typeof parsed === 'string'
            ? parsed
            : 'Remote check failed';

      return {
        label: check.label,
        ok: false,
        detail
      };
    }

    return {
      label: check.label,
      ok: true,
      detail: 'Reachable'
    };
  } catch (error) {
    return {
      label: check.label,
      ok: false,
      detail: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

export async function getPlatformReadinessSnapshot(): Promise<PlatformReadinessSnapshot> {
  const publicEnvConfigured = envFlags.hasRealSupabasePublicEnv;
  const serviceRoleConfigured = Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY);

  if (!publicEnvConfigured) {
    return {
      status: 'env_missing',
      publicEnvConfigured,
      serviceRoleConfigured,
      databaseReachable: false,
      schemaReady: false,
      nextAction: 'Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local before trying to connect the new platform.',
      checks: [
        {
          label: 'Supabase public env',
          ok: false,
          detail: 'The app is still using placeholder public Supabase values.'
        }
      ]
    };
  }

  if (!serviceRoleConfigured) {
    return {
      status: 'env_missing',
      publicEnvConfigured,
      serviceRoleConfigured,
      databaseReachable: false,
      schemaReady: false,
      nextAction: 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local so staging readiness can be checked and admin-grade verification can run.',
      checks: [
        {
          label: 'Service-role access',
          ok: false,
          detail: 'SUPABASE_SERVICE_ROLE_KEY is not configured for server-side readiness checks.'
        }
      ]
    };
  }

  const checks = await Promise.all(remoteChecks.map((check) => runRemoteCheck(check)));
  const databaseReachable = checks.some((check) => check.ok);
  const schemaReady = checks.every((check) => check.ok);

  if (!databaseReachable) {
    return {
      status: 'unreachable',
      publicEnvConfigured,
      serviceRoleConfigured,
      databaseReachable,
      schemaReady,
      nextAction: 'Confirm the Supabase project is reachable from this environment and that service-role access is still valid.',
      checks
    };
  }

  if (!schemaReady) {
    return {
      status: 'needs_schema_apply',
      publicEnvConfigured,
      serviceRoleConfigured,
      databaseReachable,
      schemaReady,
      nextAction:
        'Apply the new platform SQL bundle in Supabase SQL editor, then rerun the readiness check to confirm the core schemas and public views exist.',
      checks
    };
  }

  return {
    status: 'ready',
    publicEnvConfigured,
    serviceRoleConfigured,
    databaseReachable,
    schemaReady,
    nextAction: 'Staging looks structurally ready. Move into runtime smoke testing for auth, company onboarding, property review, and admin ops.',
    checks
  };
}
