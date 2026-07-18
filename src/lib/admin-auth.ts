import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import { auth } from '@/lib/auth';

export interface AdminContext {
  userId: number;
  role: 'ADMIN' | 'USER';
  email: string | null;
}

/**
 * Next.js implements several things by *throwing* — bailing out of static rendering
 * when a request API (cookies/headers) is used, `redirect()`, and `notFound()`. These
 * must never be caught/swallowed, or rendering control flow breaks (and the build logs
 * spurious "Dynamic server usage" errors). Detect them by their `digest`.
 */
function isNextControlFlowError(error: unknown): boolean {
  const digest = (error as { digest?: unknown } | null | undefined)?.digest;
  return (
    typeof digest === 'string' &&
    (digest === 'DYNAMIC_SERVER_USAGE' ||
      digest.startsWith('NEXT_REDIRECT') ||
      digest === 'NEXT_NOT_FOUND' ||
      digest.startsWith('NEXT_HTTP_ERROR_FALLBACK'))
  );
}

/**
 * Resolve the current user's id from EITHER auth system:
 *   1. a NextAuth session (Google or credentials), or
 *   2. the legacy `auth_token` JWT cookie.
 *
 * Only identity is taken from the token/session — the authoritative role is read
 * fresh from the database by the callers below, so role changes take effect without
 * waiting for a token to expire.
 */
async function resolveUserId(): Promise<number | null> {
  // 1) NextAuth session (this is how Google sign-ins are represented).
  try {
    const session = await auth();
    if (session?.user) {
      const fromSession = session.user.id ? Number(session.user.id) : NaN;
      if (Number.isInteger(fromSession) && fromSession > 0) {
        return fromSession;
      }
      if (session.user.email) {
        const byEmail = await query('SELECT user_id FROM users WHERE LOWER(email) = $1', [
          session.user.email.trim().toLowerCase(),
        ]);
        if (byEmail.rows.length > 0) {
          return Number(byEmail.rows[0].user_id);
        }
      }
    }
  } catch (error) {
    // Let Next.js control-flow errors (static bailout, redirect, notFound) propagate.
    if (isNextControlFlowError(error)) {
      throw error;
    }
    console.error('admin-auth: NextAuth session lookup failed:', error);
  }

  // 2) Legacy auth_token cookie.
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { sub?: string | number };
    const id = Number(payload.sub);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

/**
 * Returns the current admin's context, with the role read fresh from the database,
 * or null if the request is not an authenticated admin.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  const userId = await resolveUserId();
  if (!userId) {
    return null;
  }

  const result = await query('SELECT user_id, role, email FROM users WHERE user_id = $1', [userId]);
  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0] as { user_id: number; role: 'ADMIN' | 'USER'; email: string | null };
  return { userId: Number(row.user_id), role: row.role, email: row.email };
}

/**
 * Guard for admin server components (pages/layouts). Redirects to login when the
 * visitor is not signed in, or to /unauthorized when signed in but not an admin.
 */
export async function requireAdminPage(redirectPath: string): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) {
    redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  }
  if (context.role !== 'ADMIN') {
    redirect('/unauthorized');
  }
  return context;
}

/**
 * Guard for admin API route handlers. Throws a 401 NextResponse when the caller is
 * not an authenticated admin (callers already `catch (e) { if (e instanceof Response) return e; }`).
 */
export async function requireAdminApi(): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context || context.role !== 'ADMIN') {
    throw NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return context;
}
