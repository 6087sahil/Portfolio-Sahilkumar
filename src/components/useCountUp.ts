import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Count-up hook — animates from 0 to `target` with ease-out cubic curve.
 * Triggers once when the returned `ref` enters the viewport.
 */
export function useCountUp(
  target: number,
  duration: number = 1800,
  decimals: number = 0
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: '0px 0px -60px 0px',
  });

  useEffect(() => {
    if (!isInView) return;

    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - raw, 3);
      const value = eased * target;
      setCount(decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.floor(value));
      if (raw < 1) rafId = requestAnimationFrame(tick);
      else setCount(target);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, duration, decimals]);

  return { count, ref };
}
