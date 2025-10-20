import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import UserManagementTable from '../../../components/admin/UserManagementTable';
import styles from './AdminUsers.module.css';

interface DbUserRow {
  user_id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

async function getAdminContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/users');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { sub?: string | number; role?: string };

    if (payload.role !== 'ADMIN') {
      redirect('/');
    }

    const currentUserId = payload.sub ? Number(payload.sub) : null;
    if (!currentUserId) {
      throw new Error('Invalid token payload');
    }

    return { currentUserId };
  } catch (error) {
    console.error('Failed to verify auth token for admin users page:', error);
    redirect('/login?redirect=/admin/users');
  }
}

async function getUsers(): Promise<DbUserRow[]> {
  const result = await query(
    `SELECT user_id, username, email, role
     FROM users
     ORDER BY user_id DESC`
  );

  return result.rows as DbUserRow[];
}

export default async function AdminUsersPage() {
  const { currentUserId } = await getAdminContext();
  const users = await getUsers();

  const totalUsers = users.length;
  const adminCount = users.filter(user => user.role === 'ADMIN').length;
  const memberCount = totalUsers - adminCount;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manage Users</h1>
          <p className={styles.pageSubtitle}>
            Promote trusted members to administrators, revoke access, or remove inactive accounts.
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Users</span>
          <span className={styles.statValue}>{totalUsers}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Administrators</span>
          <span className={styles.statValue}>{adminCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Members</span>
          <span className={styles.statValue}>{memberCount}</span>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardHeading}>User Directory</h2>
        </div>

        <UserManagementTable
          users={users.map(user => ({
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
          }))}
          currentUserId={currentUserId}
          adminCount={adminCount}
        />
      </section>
    </div>
  );
}
