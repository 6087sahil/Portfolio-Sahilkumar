import React, { useEffect, useRef, useState } from 'react';

/**
 * Upgraded High-Performance Custom Cursor
 * - Instant follow dot with lerped smooth trailing ring (~0.15 lag)
 * - Pure translate3d GPU transforms for 60fps
 * - Velocity stretch in direction of motion (max ~1.15x)
 * - Magnetic pull on buttons & nav links (max ~8px)
 * - Dynamic hover states: links/cards (~1.6x + fill), text (vertical bar), media/drag (label)
 * - Click feedback (0.85x scale on mousedown + ripple on mouseup)
 * - Dark section adaptation (lighter ring on dark backgrounds)
 * - Respects (hover: hover) & prefers-reduced-motion
 */
const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'text' | 'media'>('default');
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Position & physics tracking
  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const stretchRef = useRef(1);
  const angleRef = useRef(0);
  const activeMagneticEl = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // 1. Accessibility & device capability check: only enable on hoverable fine-pointer devices
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Read lag from CSS variable if available, default to 0.15
    const computedLag = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--cursor-ring-lag')
    );
    const ringLag = prefersReduced ? 1 : isNaN(computedLag) ? 0.15 : computedLag;

    // Add active class to body for custom cursor styling
    document.body.classList.add('custom-cursor-active');

    // 2. Mouse Move Listener
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!hasMoved) {
        setHasMoved(true);
        setIsVisible(true);
        ringPos.current = { x: e.clientX, y: e.clientY };
      }

      // Detect hovered element and context
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if over form inputs where native cursor should take precedence
      const isInput = !!target.closest('input, textarea, select, [contenteditable="true"]');
      setIsOverInput(isInput);

      // Detect dark sections to invert ring color
      const isDark = !!target.closest(
        '#exhibition-gallery, .dark, [data-theme="dark"], .bg-\\[\\#121110\\], .bg-\\[\\#161513\\], .bg-\\[\\#0d0d10\\], .bg-black, .bg-\\[\\#1A1918\\], [data-dark="true"]'
      );
      setIsDarkBg(isDark);

      // Check for custom label via data-cursor attribute
      const labelEl = target.closest<HTMLElement>('[data-cursor]');
      const customLabel = labelEl ? labelEl.dataset.cursor : null;

      // Check for media / phone mockups
      const isMedia =
        !customLabel &&
        !!target.closest('figure, [data-phone], .aspect-\\[9\\/19\\.5\\], img, video');

      // Check for draggable areas
      const isDragArea =
        !customLabel &&
        !!(
          target.closest('.cursor-ew-resize, [data-draggable="true"]') ||
          window.getComputedStyle(target).cursor === 'ew-resize'
        );

      if (customLabel) {
        setCursorState('media');
        setCursorLabel(customLabel);
      } else if (isMedia) {
        setCursorState('media');
        setCursorLabel('View');
      } else if (isDragArea) {
        setCursorState('media');
        setCursorLabel('Drag');
      } else {
        setCursorLabel(null);

        // Check for links, buttons, cards
        const isInteractive = !!target.closest(
          'a, button, [role="button"], .cursor-pointer, .rounded-xl.border, .rounded-2xl.border, .group.cursor-pointer'
        );

        if (isInteractive) {
          setCursorState('hover');
        } else {
          // Check for text / paragraphs
          const isText = !!(
            target.closest('p, h1, h2, h3, h4, blockquote') &&
            !target.closest('a, button, [role="button"]')
          );

          if (isText) {
            setCursorState('text');
          } else {
            setCursorState('default');
          }
        }
      }

      // 3. Magnetic pull calculation for buttons and nav links
      if (!prefersReduced) {
        const magneticTarget = target.closest<HTMLElement>(
          'header a, header button, a.rounded-full, button.rounded-full, [data-magnetic="true"]'
        );

        if (magneticTarget) {
          activeMagneticEl.current = magneticTarget;
          const rect = magneticTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;

          // Clamped magnetic pull (max ~8px)
          const pullX = Math.max(-8, Math.min(8, deltaX * 0.22));
          const pullY = Math.max(-8, Math.min(8, deltaY * 0.22));
          magneticTarget.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
        } else if (activeMagneticEl.current) {
          // Smooth snap back when leaving magnetic zone
          const prevEl = activeMagneticEl.current;
          prevEl.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
          prevEl.style.transform = 'translate3d(0, 0, 0)';
          setTimeout(() => {
            prevEl.style.transition = '';
          }, 350);
          activeMagneticEl.current = null;
        }
      }
    };

    // 4. Mouse Window Edge Listeners
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => {
      if (hasMoved) setIsVisible(true);
    };

    // 5. Click Feedback Listeners
    const handleMouseDown = () => {
      setIsClicking(true);
      setShowRipple(false);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 450);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // 6. 60fps Animation Loop with lerp and velocity stretch
    const renderLoop = () => {
      // Instant follow for dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      // Soft lag for ring using lerp
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ringLag;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ringLag;

      // Velocity stretch calculation
      const vx = mousePos.current.x - prevMousePos.current.x;
      const vy = mousePos.current.y - prevMousePos.current.y;
      prevMousePos.current = { ...mousePos.current };

      const speed = Math.hypot(vx, vy);
      const targetStretch = prefersReduced ? 1 : Math.min(1.15, 1 + speed * 0.0035);
      stretchRef.current += (targetStretch - stretchRef.current) * 0.25;

      if (speed > 1.2 && !prefersReduced) {
        angleRef.current = Math.atan2(vy, vx) * (180 / Math.PI);
      }

      if (ringRef.current) {
        const stretch = stretchRef.current;
        const squash = 1 / Math.sqrt(stretch);
        const angle = angleRef.current;

        ringRef.current.style.transform = `translate3d(${ringPos.current.x.toFixed(1)}px, ${ringPos.current.y.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) rotate(${angle.toFixed(1)}deg) scale(${stretch.toFixed(3)}, ${squash.toFixed(3)}) rotate(${-angle.toFixed(1)}deg)`;
      }

      rafId.current = requestAnimationFrame(renderLoop);
    };

    rafId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('custom-cursor-active');

      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (activeMagneticEl.current) {
        activeMagneticEl.current.style.transform = '';
      }
    };
  }, [hasMoved]);

  if (!hasMoved) return null;

  // Scale calculations for different states
  const isMediaState = cursorState === 'media';
  const isTextState = cursorState === 'text';
  const isHoverState = cursorState === 'hover';

  let ringScaleClass = 'scale-100';
  if (isClicking) {
    ringScaleClass = 'scale-[0.85]';
  } else if (isMediaState) {
    ringScaleClass = 'scale-[2.4]';
  } else if (isHoverState) {
    ringScaleClass = 'scale-[1.6]';
  }

  const dotHidden = isTextState || isMediaState || isOverInput;
  const cursorOpacity = isVisible && !isOverInput ? 1 : 0;

  return (
    <div
      className="custom-cursor-container"
      style={{ opacity: cursorOpacity }}
      aria-hidden="true"
    >
      {/* ── Ring Element ── */}
      <div
        ref={ringRef}
        className={`cursor-ring ${ringScaleClass} ${
          isDarkBg ? 'is-dark' : ''
        } ${isHoverState ? 'is-hovered' : ''} ${isTextState ? 'is-text' : ''}`}
      >
        {/* Label for Images / Drag / Custom attributes */}
        {isMediaState && cursorLabel && (
          <span className="cursor-label animate-fade-in">{cursorLabel}</span>
        )}

        {/* Click ripple feedback */}
        {showRipple && <span className="cursor-ripple" />}
      </div>

      {/* ── Dot Element (Instant follow, small blue dot) ── */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: dotHidden ? 0 : 1,
          transform: isHoverState ? 'scale(0.5)' : 'scale(1)',
        }}
      />
    </div>
  );
};

export default CustomCursor;
