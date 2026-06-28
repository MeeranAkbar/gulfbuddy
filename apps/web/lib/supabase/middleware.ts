import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import { publicEnv } from '../env';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({ name, value });
          response.cookies.set({ name, value, ...options });
        });
      }
    }
  });

  const { data: { user } } = await supabase.auth.getUser();

  return { response, user };
}
