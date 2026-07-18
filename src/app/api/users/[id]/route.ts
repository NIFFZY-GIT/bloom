import { NextResponse } from 'next/server';

import { query } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin() {
  // Accepts a NextAuth session (e.g. Google admin) or the legacy auth_token, and
  // verifies the current role against the DB. Throws a 401 Response otherwise.
  const { userId } = await requireAdminApi();
  return userId;
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export async function PATCH(request: Request, { params: paramsPromise }: Params) {
  const params = await paramsPromise;
  try {
    const adminId = await requireAdmin();
    const numericId = Number(params.id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return badRequest('Invalid user id');
    }

    const body = await request.json().catch(() => null) as { role?: string } | null;
    const targetRole = body?.role;

    if (targetRole !== 'ADMIN' && targetRole !== 'USER') {
      return badRequest('Role must be either ADMIN or USER');
    }

    const existing = await query('SELECT role FROM users WHERE user_id = $1', [numericId]);
    if (existing.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const currentRole = existing.rows[0].role as 'ADMIN' | 'USER';
    if (currentRole === targetRole) {
      return NextResponse.json({ success: true, user: { id: numericId, role: currentRole } }, { status: 200 });
    }

    if (numericId === adminId) {
      return badRequest('You cannot change your own admin status.');
    }

    if (currentRole === 'ADMIN' && targetRole === 'USER') {
      const countResult = await query('SELECT COUNT(*)::int AS count FROM users WHERE role = $1', ['ADMIN']);
      const adminCount = countResult.rows[0]?.count as number | undefined;
      if (!adminCount || adminCount <= 1) {
        return badRequest('Unable to remove the last remaining admin account.');
      }
    }

    const updated = await query('UPDATE users SET role = $1 WHERE user_id = $2 RETURNING user_id, role', [targetRole, numericId]);

    return NextResponse.json(
      { success: true, user: { id: updated.rows[0].user_id, role: updated.rows[0].role } },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('Failed to update user role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params: paramsPromise }: Params) {
  try {
    const adminId = await requireAdmin();
    const params = await paramsPromise;
    const numericId = Number(params.id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return badRequest('Invalid user id');
    }

    if (numericId === adminId) {
      return badRequest('You cannot delete your own account while managing users.');
    }

    const existing = await query('SELECT role FROM users WHERE user_id = $1', [numericId]);
    if (existing.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const currentRole = existing.rows[0].role as 'ADMIN' | 'USER';

    if (currentRole === 'ADMIN') {
      const countResult = await query('SELECT COUNT(*)::int AS count FROM users WHERE role = $1', ['ADMIN']);
      const adminCount = countResult.rows[0]?.count as number | undefined;
      if (!adminCount || adminCount <= 1) {
        return badRequest('Unable to delete the last remaining admin account.');
      }
    }

    await query('DELETE FROM users WHERE user_id = $1', [numericId]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('Failed to delete user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
