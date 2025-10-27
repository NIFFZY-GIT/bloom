import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('[Auth Check API] Token exists:', !!token);

    if (!token) {
      console.log('[Auth Check API] No token found - returning false');
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    
    try {
      const decoded = jwt.verify(token, secret);
      console.log('[Auth Check API] Token verified successfully for user:', decoded);
      return NextResponse.json({ authenticated: true }, { status: 200 });
    } catch (error) {
      // Token is invalid or expired
      console.log('[Auth Check API] Token verification failed:', error);
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
  } catch (error) {
    console.error('[Auth Check API] Error:', error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
