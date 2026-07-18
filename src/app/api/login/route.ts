import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Normalize email: emails are case-insensitive, and mobile keyboards often
    // auto-capitalize or add whitespace. Match the same normalization used by the
    // forgot-password / reset / Google flows so a correct password never 401s.
    const normalizedEmail = String(email).trim().toLowerCase();

    const res = await query(
      'SELECT user_id, email, password_hash, role FROM users WHERE LOWER(email) = $1',
      [normalizedEmail],
    );
    const user = res.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Accounts created via Google sign-in have no password set.
    if (!user.password_hash) {
      return NextResponse.json(
        { error: 'This account uses Google sign-in. Please continue with Google.' },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: user.user_id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });

    console.log('[Login API] JWT token created for user:', user.email);
    console.log('[Login API] Token length:', token.length);
    console.log('[Login API] NODE_ENV:', process.env.NODE_ENV);

    const response = NextResponse.json({ role: user.role }, { status: 200 });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    console.log('[Login API] Cookie set successfully');

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
