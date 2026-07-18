import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, role } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userRole = role && role === 'ADMIN' ? 'ADMIN' : 'USER';

    // Store email normalized (trimmed + lowercased) so it always matches at login,
    // which looks it up case-insensitively.
    const normalizedEmail = String(email).trim().toLowerCase();

    const insert = await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role',
      [username, normalizedEmail, password_hash, userRole]
    );

    const user = insert.rows[0];

    // Send welcome email (don't fail signup if email fails)
    try {
      await sendWelcomeEmail({
        email: user.email,
        username: user.username,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with successful signup even if email fails
    }

    // Return success without logging in the user
    return NextResponse.json(
      { 
        success: true,
        message: 'Registration successful! Please log in.',
        user: { id: user.user_id, username: user.username, email: user.email } 
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Signup error', err);
    // unique violation (duplicate email/username)
    if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
      return NextResponse.json({ error: 'Email or username already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
