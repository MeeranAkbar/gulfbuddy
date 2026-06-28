import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { publicEnv } from '../../../lib/env';

function sanitizeNextPath(nextPath: string | null) {
  return nextPath && nextPath.startsWith('/') ? nextPath : '/dashboard';
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const nextPath = sanitizeNextPath(url.searchParams.get('next'));
  let response = NextResponse.redirect(new URL(nextPath, url.origin));

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=Missing+auth+code', url.origin));
  }

  const supabase = createServerClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin));
  }

  return response;
}
