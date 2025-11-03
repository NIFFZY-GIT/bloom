import Link from 'next/link';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          Oops! It looks like you&apos;ve wandered off the beaten path. 
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        
        <div className={styles.illustration}>
          <div className={styles.compass}>🧭</div>
          <div className={styles.palm}>🌴</div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            🏠 Return Home
          </Link>
          <Link href="/packages" className={styles.secondaryBtn}>
            🎒 Browse Packages
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>Need help? <Link href="/contact-us">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  );
}
