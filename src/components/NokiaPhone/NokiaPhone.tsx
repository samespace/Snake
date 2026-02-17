import type { ReactNode } from 'react';
import styles from './NokiaPhone.module.css';

interface NokiaPhoneProps {
  children: ReactNode;
}

export function NokiaPhone({ children }: NokiaPhoneProps) {
  return (
    <div className={styles.phone}>
      <div className={styles.topBar}>
        <div className={styles.speaker}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.speakerDot} />
          ))}
        </div>
        <div className={styles.brand}>Nokia</div>
        <div className={styles.indicator} />
      </div>
      {children}
    </div>
  );
}
