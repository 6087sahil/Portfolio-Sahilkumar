import React from 'react';
import { motion } from 'framer-motion';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
      {/* Drifting Ambient Magenta/Violet Blob 1 */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-10%] right-[5%] w-[650px] h-[650px] rounded-full blur-[160px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #E5336D 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)',
        }}
      />

      {/* Drifting Ambient Violet/Indigo Blob 2 */}
      <motion.div
        animate={{
          x: [0, -60, 50, 0],
          y: [0, 70, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[40%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, rgba(229, 51, 109, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* Drifting Ambient Accent Blob 3 (Bottom) */}
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #E5336D 0%, rgba(86, 14, 34, 0.4) 60%, transparent 75%)',
        }}
      />

      {/* Subtle fine architectural grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />
    </div>
  );
};
