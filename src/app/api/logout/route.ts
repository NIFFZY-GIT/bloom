import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the legacy authentication cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });

    // Clear NextAuth session cookies
    // NextAuth uses multiple cookies that need to be cleared
    const cookiesToClear = [
      'authjs.session-token',
      '__Secure-authjs.session-token',
      'authjs.csrf-token',
      '__Host-authjs.csrf-token',
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
      });
    });

    console.log('[Logout API] All authentication cookies cleared successfully');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
