import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // First check NextAuth session
    const session = await auth();
    
    if (session?.user) {
      console.log('[Auth Check API] NextAuth session found:', session.user);
      return NextResponse.json({
        authenticated: true,
        isAuthenticated: true,
        user: {
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          avatar: session.user.avatar,
        },
      }, { status: 200 });
    }

    // Fallback to legacy JWT token check
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('[Auth Check API] Legacy token exists:', !!token);

    if (!token) {
      console.log('[Auth Check API] No token found - returning false');
      return NextResponse.json({ authenticated: false, isAuthenticated: false }, { status: 200 });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    
    try {
  const decoded = jwt.verify(token, secret);
  console.log('[Auth Check API] Legacy token verified successfully for user:', decoded);
  return NextResponse.json({ authenticated: true, isAuthenticated: true }, { status: 200 });
    } catch (error) {
      // Token is invalid or expired
  console.log('[Auth Check API] Token verification failed:', error);
  return NextResponse.json({ authenticated: false, isAuthenticated: false }, { status: 200 });
    }
  } catch (error) {
  console.error('[Auth Check API] Error:', error);
  return NextResponse.json({ authenticated: false, isAuthenticated: false }, { status: 200 });
  }
}
