import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const raw = fs.readFileSync(filePath, 'utf8');
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

const envFromFiles = {
  ...parseEnvFile(path.join(rootDir, '.env')),
  ...parseEnvFile(path.join(rootDir, '.env.local')),
  ...parseEnvFile(path.join(rootDir, 'apps', 'web', '.env.local'))
};

const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || envFromFiles.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || envFromFiles.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN || envFromFiles.SUPABASE_ACCESS_TOKEN
};

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment or .env.local');
  process.exit(1);
}

const checks = [
  { label: 'core.users', schema: 'core', relation: 'core.users' },
  { label: 'company.companies', schema: 'company', relation: 'company.companies' },
  { label: 'company.company_member_invites', schema: 'company', relation: 'company.company_member_invites' },
  { label: 'listing.listing_core', schema: 'listing', relation: 'listing.listing_core' },
  { label: 'property.property_compliance_documents', schema: 'property', relation: 'property.property_compliance_documents' },
  { label: 'jobs.candidate_profiles', schema: 'jobs', relation: 'jobs.candidate_profiles' },
  { label: 'services.service_provider_profiles', schema: 'services', relation: 'services.service_provider_profiles' },
  { label: 'monetization.package_catalog', schema: 'monetization', relation: 'monetization.package_catalog' },
  { label: 'risk.risk_detection_rules', schema: 'risk', relation: 'risk.risk_detection_rules' },
  { label: 'risk.moderation_queue', schema: 'risk', relation: 'risk.moderation_queue' },
  { label: 'compliance.compliance_cases', schema: 'compliance', relation: 'compliance.compliance_cases' },
  { label: 'ops.admin_members', schema: 'ops', relation: 'ops.admin_members' },
  { label: 'ops.system_settings', schema: 'ops', relation: 'ops.system_settings' },
  { label: 'public.property_search_public_v1', schema: 'public', path: 'property_search_public_v1?select=id&limit=1' },
  { label: 'public.property_detail_public_v1', schema: 'public', path: 'property_detail_public_v1?select=id&limit=1' },
  { label: 'public.property_projects_public_v1', schema: 'public', path: 'property_projects_public_v1?select=id&limit=1' },
  { label: 'public.motors_search_public_v1', schema: 'public', path: 'motors_search_public_v1?select=id&limit=1' },
  { label: 'public.jobs_search_public_v1', schema: 'public', path: 'jobs_search_public_v1?select=id&limit=1' },
  { label: 'public.jobs_detail_public_v1', schema: 'public', path: 'jobs_detail_public_v1?select=id&limit=1' },
  { label: 'public.services_search_public_v1', schema: 'public', path: 'services_search_public_v1?select=provider_slug&limit=1' },
  { label: 'public.service_provider_public_v1', schema: 'public', path: 'service_provider_public_v1?select=company_id&limit=1' }
];

function buildHeaders(schema) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    Accept: 'application/json',
    'Accept-Profile': schema
  };
}

async function runCheck(check) {
  if (check.relation && env.SUPABASE_ACCESS_TOKEN) {
    const projectRef = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
    const query = `select to_regclass('${check.relation}')::text as relation_name`;
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const rawText = await response.text();
    let payload = null;

    try {
      payload = rawText ? JSON.parse(rawText) : null;
    } catch {
      payload = rawText;
    }

    if (!response.ok) {
      return {
        ok: false,
        label: check.label,
        status: response.status,
        detail: typeof payload === 'object' && payload ? payload.message || JSON.stringify(payload) : String(payload)
      };
    }

    const relationName = Array.isArray(payload) ? payload[0]?.relation_name : null;
    return {
      ok: Boolean(relationName),
      label: check.label,
      status: response.status,
      detail: relationName ? `${relationName} exists` : 'relation missing'
    };
  }

  const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${check.path}`, {
    method: 'GET',
    headers: buildHeaders(check.schema)
  });

  const rawText = await response.text();
  let payload = null;

  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = rawText;
  }

  if (!response.ok) {
    return {
      ok: false,
      label: check.label,
      status: response.status,
      detail: typeof payload === 'object' && payload ? payload.message || JSON.stringify(payload) : String(payload)
    };
  }

  return {
    ok: true,
    label: check.label,
    status: response.status,
    detail: Array.isArray(payload) ? `${payload.length} row(s) returned` : 'object returned'
  };
}

async function main() {
  console.log(`Verifying staging Supabase objects against ${env.NEXT_PUBLIC_SUPABASE_URL}`);

  const results = [];
  for (const check of checks) {
    results.push(await runCheck(check));
  }

  let failed = 0;

  for (const result of results) {
    if (result.ok) {
      console.log(`OK   ${result.label} (${result.status}) - ${result.detail}`);
    } else {
      failed += 1;
      console.error(`FAIL ${result.label} (${result.status}) - ${result.detail}`);
    }
  }

  console.log(`\nChecks run: ${results.length}`);
  console.log(`Passed: ${results.length - failed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

await main();
