import { useEffect, type RefObject } from 'react';
import type { Direction } from '../types/game';

const SWIPE_THRESHOLD = 20;

export function useSwipe(
  enqueueDirection: (dir: Direction) => void,
  targetRef: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        enqueueDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        enqueueDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [enqueueDirection, targetRef]);
}
