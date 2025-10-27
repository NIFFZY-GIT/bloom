import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Animated spinner */}
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner} />
          <div className={styles.spinnerIcon}>
            🌴
          </div>
        </div>

        <h2 className={styles.title}>
          Loading...
        </h2>
        
        <p className={styles.description}>
          Please wait while we prepare your experience
        </p>

        <div className={styles.dots}>
          <div className={styles.dot1} />
          <div className={styles.dot2} />
          <div className={styles.dot3} />
        </div>
      </div>
    </div>
  );
}
