import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner} />
          <div className={styles.spinnerIcon}>TB</div>
        </div>

        <h2 className={styles.title}>Tropical Bloom</h2>
        <p className={styles.description}>Preparing your journey…</p>
      </div>
    </div>
  );
}
