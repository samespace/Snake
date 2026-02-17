import type { Position, Direction, Difficulty } from '../types/game';

export const GRID_SIZE = 20;
export const DIRECTION_BUFFER_SIZE = 3;
export const HIGH_SCORE_KEY = 'snake_high_score';

export const DIFFICULTY_CONFIGS: Record<Difficulty, { baseInterval: number; decrement: number; minInterval: number }> = {
  easy:   { baseInterval: 200, decrement: 4,  minInterval: 100 },
  medium: { baseInterval: 140, decrement: 6,  minInterval: 65  },
  hard:   { baseInterval: 90,  decrement: 8,  minInterval: 45  },
};

export const INITIAL_SNAKE: Position[] = [
  { x: 12, y: 10 },
  { x: 11, y: 10 },
  { x: 10, y: 10 },
];

export const INITIAL_DIRECTION: Direction = 'RIGHT';
