import { useState, useEffect, useRef, useCallback } from 'react';

const usePullToRefresh = (onRefresh, threshold = 80) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const pullingRef = useRef(false);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  // Keep refs in sync
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    pullingRef.current = isPulling;
  }, [isPulling]);

  useEffect(() => {
    refreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let currentPullDistance = 0;

    const handleTouchStart = (e) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        pullingRef.current = true;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!pullingRef.current) return;

      const distance = e.touches[0].clientY - startY.current;

      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        const resistance = distance > threshold ? threshold + (distance - threshold) * 0.3 : distance;
        currentPullDistance = Math.min(resistance, threshold * 1.5);
        setPullDistance(currentPullDistance);
      }
    };

    const handleTouchEnd = () => {
      if (!pullingRef.current) return;

      setIsPulling(false);
      pullingRef.current = false;

      if (currentPullDistance >= threshold && !refreshingRef.current) {
        setIsRefreshing(true);
        setPullDistance(0);
        currentPullDistance = 0;

        onRefreshRef.current().finally(() => {
          setIsRefreshing(false);
        });
      } else {
        setPullDistance(0);
        currentPullDistance = 0;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [threshold]);

  return {
    containerRef,
    isPulling,
    pullDistance,
    isRefreshing,
    pullIndicatorOpacity: Math.min(pullDistance / threshold, 1),
    shouldRefresh: pullDistance >= threshold
  };
};

export default usePullToRefresh;
