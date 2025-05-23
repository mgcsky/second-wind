import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';
import { AUTH_MESSAGES } from '@/lib/constants';

// Add paths that should be accessible without authentication
const publicPaths = ['/login', '/register', '/api/login', '/api/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the path starts with /admin or /api
  const isAdminRoute = pathname.startsWith('/admin');
  const isApiRoute = pathname.startsWith('/api');

  // If no token and trying to access protected route, redirect to login
  if (!token && (isAdminRoute || isApiRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has token and trying to access login page, redirect to admin
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/auth|_next|fonts|favicon.ico|sitemap.xml).*)',
  ],
}; 