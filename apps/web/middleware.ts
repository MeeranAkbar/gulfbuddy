import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const protectedPrefixes = ['/candidate', '/employer', '/provider', '/company', '/team', '/settings', '/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = isProtectedPath(pathname);

  // Get supabase response with refreshed cookies
  const { response, user } = await updateSession(request);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};

export function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

