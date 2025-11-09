import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { verificationCodes, cleanupExpiredCodes } from '@/lib/verification-codes';
import { sendPasswordChangedConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, code, and new password are required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (normalizedCode.length !== 6 || !/^\d{6}$/.test(normalizedCode)) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code format' },
        { status: 400 }
      );
    }

    // Clean up expired codes
    await cleanupExpiredCodes();

    // Verify code
    const storedData = await verificationCodes.get(normalizedEmail);

    if (!storedData) {
      return NextResponse.json(
        { success: false, message: 'Verification code not found or expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Double-check expiration
    if (Date.now() > storedData.expiresAt) {
      await verificationCodes.delete(normalizedEmail);
      return NextResponse.json(
        { success: false, message: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (storedData.code !== normalizedCode) {
      console.log(`Invalid code attempt for ${normalizedEmail}: received ${normalizedCode}, expected ${storedData.code}`);
      return NextResponse.json(
        { success: false, message: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // Find user
    const result = await query(
      'SELECT user_id, email FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await query(
      'UPDATE users SET password_hash = $1 WHERE user_id = $2',
      [hashedPassword, user.user_id]
    );

    // Remove used code
    await verificationCodes.delete(normalizedEmail);

    console.log(`Password successfully reset for user: ${user.email}`);

    // Send confirmation email (don't fail if email fails)
    await sendPasswordChangedConfirmation(user.email).catch((error) => {
      console.error('Failed to send confirmation email:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Failed to reset password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update password' },
      { status: 500 }
    );
  }
}
