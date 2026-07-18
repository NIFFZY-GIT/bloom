import { ReactNode } from 'react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { requireAdminPage } from '@/lib/admin-auth';
import styles from './AdminLayout.module.css';

// Admin pages are per-user and auth-gated — always render on demand, never prerender.
export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Accepts either a NextAuth session (e.g. Google sign-in) or the legacy auth_token,
  // and reads the current role from the DB. Gates every /admin/* page.
  await requireAdminPage('/admin/dashboard');

  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebarWrapper}>
        <AdminSidebar />
      </div>
      <div className={styles.contentArea}>{children}</div>
    </div>
  );
}
