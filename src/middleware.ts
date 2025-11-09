import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Force middleware to use Node.js runtime instead of Edge
export const runtime = 'nodejs';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rewrite /uploads/* to API route for serving files
  if (pathname.startsWith('/uploads/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/serve-uploads${pathname.replace('/uploads', '')}`;
    return NextResponse.rewrite(url);
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/bookings', '/user_dashboard'];
  
  // Admin routes that require admin role
  const adminRoutes = ['/admin'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // First check NextAuth session
  const session = await auth();
  
  if (session?.user) {
    // User is authenticated via NextAuth
    const userRole = session.user.role || 'USER';
    
    // Check if admin route requires admin role
    if (isAdminRoute && userRole !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // Add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-user-email', session.user.email || '');
    requestHeaders.set('x-user-role', userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Fallback to legacy JWT token check
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
        url.pathname = '/unauthorized';
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
    // Also match /uploads/* for file serving
    '/uploads/:path*',
  ],
};
