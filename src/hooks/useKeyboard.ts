import { useEffect } from 'react';
import type { Direction, GameStatus, GameActions } from '../types/game';

export function useKeyboard(
  enqueueDirection: (dir: Direction) => void,
  status: GameStatus,
  actions: GameActions
): void {
  // actions and enqueueDirection are stable references (useMemo / useCallback
  // with stable deps), so this effect only re-registers when status changes —
  // i.e. on game state transitions, not on every tick.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': enqueueDirection('UP');    break;
        case 'ArrowDown':  case 's': case 'S': enqueueDirection('DOWN');  break;
        case 'ArrowLeft':  case 'a': case 'A': enqueueDirection('LEFT');  break;
        case 'ArrowRight': case 'd': case 'D': enqueueDirection('RIGHT'); break;
        case ' ':
        case 'Enter':
          if (status === 'idle')       actions.startGame();
          else if (status === 'playing')    actions.pauseGame();
          else if (status === 'paused')     actions.resumeGame();
          else if (status === 'game-over')  actions.restartGame();
          break;
        case 'Escape':
          if (status === 'playing') actions.pauseGame();
          else if (status === 'paused') actions.resumeGame();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enqueueDirection, status, actions]);
}
