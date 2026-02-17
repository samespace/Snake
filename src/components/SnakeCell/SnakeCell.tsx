import type { CellType } from '../../types/game';
import styles from './SnakeCell.module.css';

interface SnakeCellProps {
  type: CellType;
}

const CLASS_MAP: Record<CellType, string> = {
  'empty':      styles.cell,
  'snake-head': `${styles.cell} ${styles.snakeHead}`,
  'snake-body': `${styles.cell} ${styles.snakeBody}`,
  'food':       `${styles.cell} ${styles.food}`,
};

export function SnakeCell({ type }: SnakeCellProps) {
  return <div className={CLASS_MAP[type]} />;
}
