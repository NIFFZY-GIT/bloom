import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { verificationCodes, generateCode, cleanupExpiredCodes } from '@/lib/verification-codes';
import { sendPasswordResetCode } from '@/lib/email';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { sub?: string | number };
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    const result = await query(
      'SELECT user_id, email FROM users WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      id: result.rows[0].user_id,
      email: result.rows[0].email,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function POST() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clean up expired codes
    await cleanupExpiredCodes();

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    await verificationCodes.set(user.email, { code, expiresAt }, user.id);

    // Send email with verification code
    const emailSent = await sendPasswordResetCode(user.email, code);

    if (!emailSent) {
      // If email fails, still log the code for debugging
      console.log(`Failed to send email, but code is: ${code}`);
      // Don't fail the request, user can still try to use the code
    }

    console.log(`Password reset code for ${user.email}: ${code}`);
    console.log(`Code expires at: ${new Date(expiresAt).toLocaleString()}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      // In development, return the code (remove in production!)
      devCode: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error) {
    console.error('Failed to send reset code:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
