import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple JWT decode without verification (for middleware)
// Full verification should be done in API routes
function decodeJWT(token: string): { sub: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/bookings', '/create_pkg'];
  
  // Admin routes that require admin role
  const adminRoutes = ['/admin'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Get token from cookie or header
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // If no token and route is protected, redirect to login
  if ((isProtectedRoute || isAdminRoute) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Decode token if it exists (basic check, full verification in API routes)
  if (token) {
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      // Invalid token format, redirect to login for protected routes
      if (isProtectedRoute || isAdminRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    } else {
      // Check if admin route requires admin role
      if (isAdminRoute && decoded.role !== 'ADMIN') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      // Add user info to request headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.sub);
      requestHeaders.set('x-user-email', decoded.email);
      requestHeaders.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*|_next).*)',
  ],
};
