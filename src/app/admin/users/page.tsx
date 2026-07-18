import { query } from '@/lib/db';
import UserManagementTable from '../../../components/admin/UserManagementTable';
import { requireAdminPage } from '@/lib/admin-auth';
import styles from './AdminUsers.module.css';

interface DbUserRow {
  user_id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

async function getAdminContext() {
  const { userId } = await requireAdminPage('/admin/users');
  return { currentUserId: userId };
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
