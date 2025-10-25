import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const requestedPath = '/admin/dashboard';

  if (!token) {
    redirect(`/login?redirect=${encodeURIComponent(requestedPath)}`);
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };

    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for admin layout:', error);
    redirect(`/login?redirect=${encodeURIComponent(requestedPath)}`);
  }

  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebarWrapper}>
        <AdminSidebar />
      </div>
      <div className={styles.contentArea}>{children}</div>
    </div>
  );
}
