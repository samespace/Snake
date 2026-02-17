import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import type { Position, Direction, GameStatus, GameState, GameActions, Difficulty } from '../types/game';
import {
  GRID_SIZE,
  DIFFICULTY_CONFIGS,
  DIRECTION_BUFFER_SIZE,
  HIGH_SCORE_KEY,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
} from '../constants/game';

interface InternalState {
  snake: Position[];
  food: Position;
  direction: Direction;
  directionBuffer: Direction[];
  status: GameStatus;
  score: number;
  highScore: number;
  tickIntervalMs: number;
}

function loadHighScore(): number {
  try {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // ignore
  }
}

function wrapPosition(pos: Position, gridSize: number): Position {
  return {
    x: ((pos.x % gridSize) + gridSize) % gridSize,
    y: ((pos.y % gridSize) + gridSize) % gridSize,
  };
}

function moveInDirection(pos: Position, dir: Direction): Position {
  switch (dir) {
    case 'UP':    return { x: pos.x, y: pos.y - 1 };
    case 'DOWN':  return { x: pos.x, y: pos.y + 1 };
    case 'LEFT':  return { x: pos.x - 1, y: pos.y };
    case 'RIGHT': return { x: pos.x + 1, y: pos.y };
  }
}

function isOpposite(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

function generateFood(snake: Position[], gridSize: number): Position {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
  const empty: Position[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return snake[0];
  return empty[Math.floor(Math.random() * empty.length)];
}

function makeInitialState(difficulty: Difficulty): InternalState {
  const cfg = DIFFICULTY_CONFIGS[difficulty];
  const snake = INITIAL_SNAKE.map(p => ({ ...p }));
  return {
    snake,
    food: generateFood(snake, GRID_SIZE),
    direction: INITIAL_DIRECTION,
    directionBuffer: [],
    status: 'idle',
    score: 0,
    highScore: loadHighScore(),
    tickIntervalMs: cfg.baseInterval,
  };
}

function toSnapshot(s: InternalState): GameState {
  return {
    snake: s.snake,
    food: s.food,
    direction: s.direction,
    status: s.status,
    score: s.score,
    highScore: s.highScore,
    tickIntervalMs: s.tickIntervalMs,
    gridSize: GRID_SIZE,
  };
}

export function useSnakeGame(difficulty: Difficulty): { state: GameState; actions: GameActions } {
  // initialInternal is computed once at mount — no ref reads during render
  const initialInternal = makeInitialState(difficulty);
  const internalRef = useRef<InternalState>(initialInternal);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const difficultyRef = useRef<Difficulty>(difficulty);

  // loopRef holds the self-rescheduling game loop. Updated in useEffect so it
  // always closes over the latest `publish` without being a recursive const.
  const loopRef = useRef<(ms: number) => void>(() => {});

  // Rendered snapshot — what components actually read
  const [snapshot, setSnapshot] = useState<GameState>(() => toSnapshot(initialInternal));

  // Sync difficulty into a ref (effect, not during render)
  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const publish = useCallback(() => {
    setSnapshot(toSnapshot(internalRef.current));
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Keep the loop function up to date whenever publish changes
  useEffect(() => {
    loopRef.current = function loop(ms: number) {
      const start = performance.now();
      timerRef.current = setTimeout(() => {
        const s = internalRef.current;

        // Consume next valid direction from buffer
        while (s.directionBuffer.length > 0) {
          const next = s.directionBuffer[0];
          s.directionBuffer.shift();
          if (!isOpposite(next, s.direction)) {
            s.direction = next;
            break;
          }
        }

        const newHead = wrapPosition(moveInDirection(s.snake[0], s.direction), GRID_SIZE);

        // Tail vacates its spot this tick — exclude it from collision check
        const selfCollision = s.snake
          .slice(0, s.snake.length - 1)
          .some(seg => seg.x === newHead.x && seg.y === newHead.y);

        if (selfCollision) {
          s.status = 'game-over';
          if (s.score > s.highScore) {
            s.highScore = s.score;
            saveHighScore(s.highScore);
          }
          publish();
          return; // loop stops
        }

        const ateFood = newHead.x === s.food.x && newHead.y === s.food.y;
        const newSnake = [newHead, ...s.snake];
        if (!ateFood) newSnake.pop();
        s.snake = newSnake;

        if (ateFood) {
          s.score += 1;
          s.food = generateFood(newSnake, GRID_SIZE);
          const cfg = DIFFICULTY_CONFIGS[difficultyRef.current];
          s.tickIntervalMs = Math.max(cfg.minInterval, s.tickIntervalMs - cfg.decrement);
          if (s.score > s.highScore) {
            s.highScore = s.score;
            saveHighScore(s.highScore);
          }
        }

        publish();

        const elapsed = performance.now() - start;
        if (s.status === 'playing') {
          loopRef.current(Math.max(0, s.tickIntervalMs - elapsed));
        }
      }, ms);
    };
  }, [publish]);

  const enqueueDirection = useCallback((dir: Direction) => {
    const s = internalRef.current;
    if (s.status !== 'playing') return;
    const lastQueued = s.directionBuffer.at(-1) ?? s.direction;
    if (isOpposite(dir, lastQueued)) return;
    if (s.directionBuffer.length >= DIRECTION_BUFFER_SIZE) return;
    if (dir === lastQueued) return;
    s.directionBuffer.push(dir);
  }, []);

  const startGame = useCallback(() => {
    const s = internalRef.current;
    if (s.status !== 'idle') return;
    s.status = 'playing';
    publish();
    loopRef.current(s.tickIntervalMs);
  }, [publish]);

  const pauseGame = useCallback(() => {
    const s = internalRef.current;
    if (s.status !== 'playing') return;
    s.status = 'paused';
    clearTimer();
    publish();
  }, [clearTimer, publish]);

  const resumeGame = useCallback(() => {
    const s = internalRef.current;
    if (s.status !== 'paused') return;
    s.status = 'playing';
    publish();
    loopRef.current(s.tickIntervalMs);
  }, [publish]);

  const restartGame = useCallback(() => {
    clearTimer();
    const prevHighScore = internalRef.current.highScore;
    internalRef.current = makeInitialState(difficultyRef.current);
    internalRef.current.highScore = prevHighScore;
    internalRef.current.status = 'playing';
    publish();
    loopRef.current(internalRef.current.tickIntervalMs);
  }, [clearTimer, publish]);

  const actions = useMemo<GameActions>(() => ({
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    enqueueDirection,
  }), [startGame, pauseGame, resumeGame, restartGame, enqueueDirection]);

  return { state: snapshot, actions };
}
