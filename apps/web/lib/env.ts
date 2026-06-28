import { z } from 'zod';

const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? 'local';
const allowPlaceholderPublicEnv = appEnv !== 'production';
const placeholderSupabaseUrl = 'https://placeholder-project.supabase.co';
const placeholderSupabaseAnonKey = 'placeholder-public-anon-key-for-local-builds';
const hasRealSupabasePublicEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.string().default('local'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_DOMAIN: z.string().default('localhost'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['en', 'ar']).default('en'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20)
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  SUPABASE_DB_URL: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  WORKER_INTERNAL_TOKEN: z.string().optional()
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || (allowPlaceholderPublicEnv ? placeholderSupabaseUrl : undefined),
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (allowPlaceholderPublicEnv ? placeholderSupabaseAnonKey : undefined)
});

export const serverEnv = serverEnvSchema.parse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || (allowPlaceholderPublicEnv ? placeholderSupabaseUrl : undefined),
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (allowPlaceholderPublicEnv ? placeholderSupabaseAnonKey : undefined),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  WORKER_INTERNAL_TOKEN: process.env.WORKER_INTERNAL_TOKEN
});

export const envFlags = {
  hasRealSupabasePublicEnv
} as const;
