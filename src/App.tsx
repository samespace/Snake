import { useRef, useState } from 'react';
import type { Difficulty } from './types/game';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useKeyboard } from './hooks/useKeyboard';
import { useSwipe } from './hooks/useSwipe';
import { Screen } from './components/Screen/Screen';
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard';
import { GameBoard } from './components/GameBoard/GameBoard';
import { Overlay } from './components/Overlay/Overlay';

export function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const { state, actions } = useSnakeGame(difficulty);
  const boardRef = useRef<HTMLDivElement>(null);

  useKeyboard(actions.enqueueDirection, state.status, actions);
  useSwipe(actions.enqueueDirection, boardRef);

  return (
    <Screen>
      <ScoreBoard score={state.score} highScore={state.highScore} />
      <GameBoard
        ref={boardRef}
        snake={state.snake}
        food={state.food}
        gridSize={state.gridSize}
      />
      <Overlay
        status={state.status}
        score={state.score}
        difficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        actions={actions}
      />
    </Screen>
  );
}
