export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'game-over';
export type CellType = 'empty' | 'snake-head' | 'snake-body' | 'food';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  tickIntervalMs: number;
  gridSize: number;
}

export interface GameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  enqueueDirection: (dir: Direction) => void;
}
