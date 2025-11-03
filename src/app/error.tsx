'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './Error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorIcon}>⚠️</div>
        <h1 className={styles.title}>Something Went Wrong</h1>
        <p className={styles.description}>
          We encountered an unexpected error while processing your request. 
          Don&apos;t worry, our team has been notified and we&apos;re working to fix it.
        </p>

        {error.message && (
          <div className={styles.errorDetails}>
            <details>
              <summary>Technical Details</summary>
              <code>{error.message}</code>
              {error.digest && <p className={styles.digest}>Error ID: {error.digest}</p>}
            </details>
          </div>
        )}

        <div className={styles.illustration}>
          <div className={styles.toolbox}>🧰</div>
          <div className={styles.wrench}>🔧</div>
        </div>

        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryBtn}>
            🔄 Try Again
          </button>
          <Link href="/" className={styles.secondaryBtn}>
            🏠 Return Home
          </Link>
        </div>

        <div className={styles.helpText}>
          <p>
            If the problem persists, please{' '}
            <Link href="/contact-us">contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
