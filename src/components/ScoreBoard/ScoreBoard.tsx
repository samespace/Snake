import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

function pad(n: number): string {
  return String(n).padStart(4, '0');
}

export function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <div className={styles.scoreboard}>
      <div className={styles.item}>
        <div className={styles.label}>SCORE</div>
        <div className={styles.value}>{pad(score)}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>BEST</div>
        <div className={styles.value}>{pad(highScore)}</div>
      </div>
    </div>
  );
}
