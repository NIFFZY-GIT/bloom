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

    // Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if user exists
    const result = await query(
      'SELECT user_id, email FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      // For security, don't reveal if email exists
      // Return success anyway but don't send email
      console.log(`Password reset requested for non-existent email: ${normalizedEmail}`);
      return NextResponse.json({
        success: true,
        message: 'If this email exists, a verification code has been sent',
      });
    }

    const user = result.rows[0] as { user_id: number | null; email: string };

    // Clean up expired codes
    await cleanupExpiredCodes();

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    try {
      await verificationCodes.set(user.email, { code, expiresAt }, user.user_id ?? null);
    } catch (error) {
      console.error('Failed to store verification code:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to generate verification code' },
        { status: 500 }
      );
    }

    // Send email with verification code
    const emailSent = await sendPasswordResetCode(user.email, code);

    if (!emailSent) {
      console.error(`Failed to send email to ${user.email}`);
      console.log(`Verification code for ${user.email}: ${code}`);
      console.log(`Code expires at: ${new Date(expiresAt).toLocaleString()}`);
      
      // Don't fail the request if email fails - code is still stored
      // In development, we can see the code in logs
    } else {
      console.log(`Password reset email sent successfully to ${user.email}`);
    }

    console.log(`Password reset code for ${user.email}: ${code}`);
    console.log(`Code expires at: ${new Date(expiresAt).toLocaleString()}`);

    return NextResponse.json({
      success: true,
      message: 'If this email exists, a verification code has been sent',
    });
  } catch (error) {
    console.error('Failed to process password reset request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
