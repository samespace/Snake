import type { GameStatus, GameActions, Difficulty } from '../../types/game';
import styles from './Overlay.module.css';

interface OverlayProps {
  status: GameStatus;
  score: number;
  difficulty: Difficulty;
  onSelectDifficulty: (d: Difficulty) => void;
  actions: GameActions;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function Overlay({ status, score, difficulty, onSelectDifficulty, actions }: OverlayProps) {
  if (status === 'playing') return null;

  if (status === 'idle') {
    return (
      <div className={styles.overlay}>
        <div className={styles.title}>SNAKE</div>
        <div className={styles.divider} />
        <div className={styles.modeLabel}>SELECT MODE</div>
        <div className={styles.modeRow}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`${styles.modeBtn} ${difficulty === d ? styles.modeBtnActive : ''}`}
              onClick={() => onSelectDifficulty(d)}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={styles.divider} />
        <div
          className={`${styles.startBtn} ${styles.blink}`}
          onClick={actions.startGame}
        >
          PRESS ENTER
        </div>
      </div>
    );
  }

  if (status === 'paused') {
    return (
      <div className={styles.overlay} onClick={actions.resumeGame}>
        <div className={styles.title}>PAUSED</div>
        <div className={styles.divider} />
        <div className={`${styles.subtitle} ${styles.blink}`}>
          PRESS ENTER TO RESUME
        </div>
      </div>
    );
  }

  // game-over
  return (
    <div className={styles.overlay} onClick={actions.restartGame}>
      <div className={styles.title}>GAME OVER</div>
      <div className={styles.divider} />
      <div className={styles.scoreLabel}>SCORE</div>
      <div className={styles.score}>{String(score).padStart(4, '0')}</div>
      <div className={styles.divider} />
      <div className={`${styles.subtitle} ${styles.blink}`}>
        PRESS ENTER TO RESTART
      </div>
    </div>
  );
}
