import styles from './Maintenance.module.css';

export default function Maintenance() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔧</div>
        <h1 className={styles.title}>We&apos;ll Be Right Back!</h1>
        <p className={styles.description}>
          Tropical Bloom Tourism is currently undergoing scheduled maintenance to improve 
          your experience. We&apos;ll be back online shortly.
        </p>
        
        <div className={styles.illustration}>
          <div className={styles.tools}>🛠️</div>
          <div className={styles.gear}>⚙️</div>
          <div className={styles.tools}>🔨</div>
        </div>

        <div className={styles.statusBox}>
          <h3>What&apos;s happening?</h3>
          <p>
            Our team is working hard to enhance our services and add new features. 
            This maintenance is scheduled and should be completed soon.
          </p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>System Updates</h4>
              <p>Installing latest features</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>Performance Optimization</h4>
              <p>Making things faster</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>Security Enhancements</h4>
              <p>Keeping you safe</p>
            </div>
          </div>
        </div>

        <div className={styles.contact}>
          <p>For urgent inquiries, please contact us at:</p>
          <a href="mailto:contactus@zevarone.com" className={styles.email}>
            📧 contactus@zevarone.com
          </a>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className={styles.refreshBtn}
        >
          🔄 Check Again
        </button>
      </div>
    </div>
  );
}
