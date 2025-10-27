import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verificationCodes, generateCode, cleanupExpiredCodes } from '@/lib/verification-codes';
import { sendPasswordResetCode } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const result = await query(
      'SELECT user_id, email FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (result.rows.length === 0) {
      // For security, don't reveal if email exists
      // Return success anyway
      return NextResponse.json({
        success: true,
        message: 'If this email exists, a verification code has been sent',
      });
    }

    const user = result.rows[0];

    // Clean up expired codes
    cleanupExpiredCodes();

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    verificationCodes.set(user.email.toLowerCase(), { code, expiresAt });

    // Send email with verification code
    const emailSent = await sendPasswordResetCode(user.email, code);

    if (!emailSent) {
      console.log(`Failed to send email to ${user.email}, but code is: ${code}`);
    }

    console.log(`Password reset code for ${user.email}: ${code}`);
    console.log(`Code expires at: ${new Date(expiresAt).toLocaleString()}`);

    return NextResponse.json({
      success: true,
      message: 'If this email exists, a verification code has been sent',
      // In development, return the code (remove in production!)
      devCode: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error) {
    console.error('Failed to send guest reset code:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
