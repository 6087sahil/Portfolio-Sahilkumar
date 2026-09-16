import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 100, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleLinkHoverStart = () => setIsHovering(true);
    const handleLinkHoverEnd = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Add event listeners to all interactive elements
    const setupInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleLinkHoverStart);
        el.addEventListener('mouseleave', handleLinkHoverEnd);
      });
      return interactiveElements;
    };

    let elements = setupInteractiveElements();

    // Create a MutationObserver to watch for new interactive elements (e.g. from framer-motion AnimatePresence)
    const observer = new MutationObserver(() => {
      // Clean up old listeners
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleLinkHoverStart);
        el.removeEventListener('mouseleave', handleLinkHoverEnd);
      });
      // Setup new ones
      elements = setupInteractiveElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleLinkHoverStart);
        el.removeEventListener('mouseleave', handleLinkHoverEnd);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || typeof window === 'undefined') return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          boxShadow: isHovering ? '0 0 15px rgba(255, 255, 255, 0.5)' : '0 0 0px rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.2 }}
      />
      
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 12,
          translateY: 12,
          opacity: isVisible ? (isHovering ? 0 : 1) : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
