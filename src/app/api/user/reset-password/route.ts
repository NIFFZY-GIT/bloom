import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { verificationCodes, cleanupExpiredCodes } from '@/lib/verification-codes';
import { sendPasswordChangedConfirmation } from '@/lib/email';

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

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, newPassword } = body;

    if (!code || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Code and new password are required' },
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
    const storedData = verificationCodes.get(user.email);

    if (!storedData) {
      return NextResponse.json(
        { success: false, message: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(user.email);
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await query(
      'UPDATE users SET password_hash = $1 WHERE user_id = $2',
      [hashedPassword, user.id]
    );

    // Remove used code
    verificationCodes.delete(user.email);

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
