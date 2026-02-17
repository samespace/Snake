import styles from './ButtonRow.module.css';

const NUM_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export function ButtonRow() {
  return (
    <div style={{ width: '88%', pointerEvents: 'none', userSelect: 'none', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
      {/* Menu row */}
      <div className={styles.menuRow} style={{ width: '100%' }}>
        <div className={`${styles.menuBtn} ${styles.menuBtnSmall}`} />
        <div className={styles.menuBtn} />
        <div className={styles.menuBtn} />
        <div className={`${styles.menuBtn} ${styles.menuBtnSmall}`} />
      </div>

      {/* D-pad + side buttons */}
      <div className={styles.row}>
        <div className={styles.sideButtons}>
          <div className={styles.sideButton}>L</div>
          <div className={`${styles.sideButton} ${styles.sideButtonSmall}`} />
        </div>

        <div className={styles.dpad}>
          <div className={styles.dpadH} />
          <div className={styles.dpadV} />
          <div className={styles.dpadCenter} />
          <div className={`${styles.dpadArrow} ${styles.arrowUp}`} />
          <div className={`${styles.dpadArrow} ${styles.arrowDown}`} />
          <div className={`${styles.dpadArrow} ${styles.arrowLeft}`} />
          <div className={`${styles.dpadArrow} ${styles.arrowRight}`} />
        </div>

        <div className={styles.sideButtons}>
          <div className={styles.sideButton}>R</div>
          <div className={`${styles.sideButton} ${styles.sideButtonSmall}`} />
        </div>
      </div>

      {/* Number grid */}
      <div className={styles.numGrid}>
        {NUM_KEYS.map((k) => (
          <div key={k} className={styles.numKey}>{k}</div>
        ))}
      </div>
    </div>
  );
}
