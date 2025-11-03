import Link from 'next/link';
import styles from '../NotFound.module.css';

export default function AdminNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Admin Page Not Found</h1>
        <p className={styles.description}>
          The admin page you&apos;re looking for doesn&apos;t exist or you may not have 
          the required permissions to access it.
        </p>
        
        <div className={styles.illustration}>
          <div className={styles.compass}>🔒</div>
          <div className={styles.palm}>⚙️</div>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/dashboard" className={styles.primaryBtn}>
            📊 Admin Dashboard
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            🏠 Return Home
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>Not an admin? <Link href="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}
