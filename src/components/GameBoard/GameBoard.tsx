import { forwardRef, useMemo } from 'react';
import type { Position, CellType } from '../../types/game';
import { SnakeCell } from '../SnakeCell/SnakeCell';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

function buildCellMatrix(
  snake: Position[],
  food: Position,
  gridSize: number
): CellType[][] {
  const matrix: CellType[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill('empty')
  );

  for (let i = snake.length - 1; i >= 0; i--) {
    const { x, y } = snake[i];
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      matrix[y][x] = i === 0 ? 'snake-head' : 'snake-body';
    }
  }

  if (food.x >= 0 && food.x < gridSize && food.y >= 0 && food.y < gridSize) {
    matrix[food.y][food.x] = 'food';
  }

  return matrix;
}

export const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(
  function GameBoard({ snake, food, gridSize }, ref) {
    const cells = useMemo(
      () => buildCellMatrix(snake, food, gridSize),
      [snake, food, gridSize]
    );

    return (
      <div className={styles.wrapper} ref={ref}>
        <div className={styles.board}>
          {cells.map((row, y) =>
            row.map((cellType, x) => (
              <SnakeCell key={`${x}-${y}`} type={cellType} />
            ))
          )}
        </div>
      </div>
    );
  }
);
