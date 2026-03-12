import { useRef, useEffect } from 'react';

const useSwipeGesture = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const elementRef = useRef(null);
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);

  // Keep refs in sync
  onSwipeLeftRef.current = onSwipeLeft;
  onSwipeRightRef.current = onSwipeRight;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startX = null;
    let endX = null;

    const handleTouchStart = (e) => {
      endX = null;
      startX = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
      endX = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (startX === null || endX === null) return;

      const distance = startX - endX;
      if (distance > threshold && onSwipeLeftRef.current) {
        onSwipeLeftRef.current();
      }
      if (distance < -threshold && onSwipeRightRef.current) {
        onSwipeRightRef.current();
      }

      startX = null;
      endX = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [threshold]);

  return elementRef;
};

export default useSwipeGesture;
