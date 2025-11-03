'use client';

import Link from 'next/link';
import styles from './GlobalError.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.errorIcon}>🚨</div>
            <h1 className={styles.title}>Critical Error</h1>
            <p className={styles.description}>
              We&apos;ve encountered a critical system error. Our technical team has been 
              automatically notified and is working to resolve this issue as quickly as possible.
            </p>

            {error.digest && (
              <div className={styles.errorId}>
                <p>Error Reference ID:</p>
                <code>{error.digest}</code>
              </div>
            )}

            <div className={styles.illustration}>
              <div className={styles.alert}>⛔</div>
              <div className={styles.signal}>📡</div>
            </div>

            <div className={styles.actions}>
              <button onClick={reset} className={styles.primaryBtn}>
                🔄 Reload Application
              </button>
              <Link href="/" className={styles.secondaryBtn}>
                🏠 Go to Homepage
              </Link>
            </div>

            <div className={styles.helpBox}>
              <h3>What can you do?</h3>
              <ul>
                <li>Try refreshing the page or clicking &quot;Reload Application&quot;</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try again in a few minutes</li>
                <li>Contact our support team if the issue persists</li>
              </ul>
            </div>

            <div className={styles.contact}>
              <p>Need immediate assistance?</p>
              <p>Email: <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contactus@zevarone.com'}`}>
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contactus@zevarone.com'}
              </a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
