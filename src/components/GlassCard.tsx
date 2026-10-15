import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  tilt?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  tilt = true,
  onClick,
  style,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Position as percentage for gradient
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    setGlowPos({ x: xPct, y: yPct });

    if (tilt) {
      // Max 5 deg tilt for subtle feel
      const rX = ((y / rect.height) - 0.5) * -8;
      const rY = ((x / rect.width) - 0.5) * 8;
      setRotateX(rX);
      setRotateY(rY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style,
      }}
      animate={{
        rotateX,
        rotateY,
        y: isHovered ? -5 : 0,
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-[22px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden transition-colors duration-300 ${
        isHovered ? 'border-white/[0.18]' : ''
      } ${className}`}
    >
      {/* Dynamic Cursor-following Inner Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[22px] opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${glowPos.x}% ${glowPos.y}%, rgba(229,51,109,0.12), transparent 45%)`,
        }}
      />

      {/* Static Ambient Glow */}
      {glow && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[22px] opacity-40 blur-xl"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(229,51,109,0.18), transparent 70%)',
          }}
        />
      )}

      {/* Card Content with subtle 3D translation */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};
