'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '@/app/admin/users/AdminUsers.module.css';

interface UserRow {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface UserManagementTableProps {
  users: UserRow[];
  currentUserId: number;
  adminCount: number;
}

export default function UserManagementTable({ users, currentUserId, adminCount }: UserManagementTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleRoleChange = async (userId: number, targetRole: 'ADMIN' | 'USER') => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: targetRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to update role');
      }

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update role';
       
      window.alert(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm('Delete this user account? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to delete user');
      }

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
       
      window.alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeaderCell}>Name</th>
            <th className={styles.tableHeaderCell}>Email</th>
            <th className={styles.tableHeaderCell}>Role</th>
            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellActions}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const isSelf = user.id === currentUserId;
            const isAdmin = user.role === 'ADMIN';
            const isLastAdmin = isAdmin && adminCount <= 1;
            const disableDemote = updatingId === user.id || isSelf || isLastAdmin;
            const disablePromote = updatingId === user.id || isAdmin;
            const disableDelete = deletingId === user.id || isSelf || isLastAdmin;

            return (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  {user.username}
                  {isSelf && <span className={styles.selfTag}>You</span>}
                </td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>
                  <span className={`${styles.rolePill} ${isAdmin ? styles.roleAdmin : styles.roleUser}`}>
                    {isAdmin ? 'Admin' : 'Member'}
                  </span>
                </td>
                <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                  <div className={styles.actionsGroup}>
                    {isAdmin ? (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.demoteBtn}`}
                        onClick={() => handleRoleChange(user.id, 'USER')}
                        disabled={disableDemote}
                      >
                        {updatingId === user.id ? 'Updating…' : 'Remove Admin'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.promoteBtn}`}
                        onClick={() => handleRoleChange(user.id, 'ADMIN')}
                        disabled={disablePromote}
                      >
                        {updatingId === user.id ? 'Updating…' : 'Make Admin'}
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(user.id)}
                      disabled={disableDelete}
                    >
                      {deletingId === user.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
