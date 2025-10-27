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

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Clean up expired codes
    cleanupExpiredCodes();

    // Verify code
    const storedData = verificationCodes.get(email.toLowerCase());

    if (!storedData) {
      return NextResponse.json(
        { success: false, message: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(email.toLowerCase());
      return NextResponse.json(
        { success: false, message: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (storedData.code !== code) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Find user
    const result = await query(
      'SELECT user_id, email FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
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
    verificationCodes.delete(email.toLowerCase());

    // Send confirmation email (don't fail if email fails)
    await sendPasswordChangedConfirmation(user.email).catch((error) => {
      console.error('Failed to send confirmation email:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Failed to reset guest password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update password' },
      { status: 500 }
    );
  }
}
