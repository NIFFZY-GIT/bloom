import Link from 'next/link';
import styles from './Unauthorized.module.css';

export default function Unauthorized() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>403</div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.description}>
          Sorry, you don&apos;t have permission to access this page. 
          This area is restricted to authorized users only.
        </p>
        
        <div className={styles.illustration}>
          <div className={styles.lock}>🔒</div>
          <div className={styles.key}>🔑</div>
        </div>

        <div className={styles.infoBox}>
          <h3>Why am I seeing this?</h3>
          <ul>
            <li>You may need to log in with an authorized account</li>
            <li>Your session may have expired</li>
            <li>You don&apos;t have the required permissions</li>
            <li>This page is for administrators only</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryBtn}>
            🔐 Sign In
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            🏠 Return Home
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>Need access? <Link href="/contact-us">Contact an administrator</Link></p>
        </div>
      </div>
    </div>
  );
}
