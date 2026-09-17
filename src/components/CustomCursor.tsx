import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'project'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Ring trails with spring — the dot is raw (instant)
  const ringConfig = { damping: 28, stiffness: 120, mass: 0.6 };
  const ringX = useSpring(cursorX, ringConfig);
  const ringY = useSpring(cursorY, ringConfig);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverStart = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.dataset.cursor === 'project') {
        setCursorState('project');
      } else {
        setCursorState('hover');
      }
    };
    const handleHoverEnd = () => setCursorState('default');

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    const setupInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [data-cursor]');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
      return interactiveElements;
    };

    let elements = setupInteractiveElements();

    const observer = new MutationObserver(() => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
      elements = setupInteractiveElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || typeof window === 'undefined') return null;

  const ringScale = cursorState === 'project' ? 3.5 : cursorState === 'hover' ? 2.2 : 1;
  const ringFill = cursorState !== 'default';
  const dotVisible = cursorState === 'default';

  return (
    <>
      {/* Trailing ring — mix-blend-difference inverts colors on bg */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          width: 36,
          height: 36,
        }}
        animate={{
          scale: ringScale,
          backgroundColor: ringFill ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {cursorState === 'project' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-black text-[7px] font-bold tracking-wider uppercase pointer-events-none select-none"
            style={{ mixBlendMode: 'normal' }}
          >
            View
          </motion.span>
        )}
      </motion.div>

      {/* Dot — instant, no spring, disappears on hover */}
      <motion.div
        className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible && dotVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
};

export default CustomCursor;
