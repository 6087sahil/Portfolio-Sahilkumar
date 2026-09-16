import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 8000; // Adjusted duration to 8 seconds
    const interval = 20;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0C0C0C] text-white overflow-hidden p-6 md:p-12"
      initial={{ y: 0 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
      >
        <source src="/1.mp4" type="video/mp4" />
      </video>

      {/* Top Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10 flex justify-between items-center text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase w-full"
      >
        <div className="flex-1 text-left tracking-tight font-extrabold text-sm md:text-base capitalize">
          Sahil Studio
        </div>
        <div className="hidden md:block flex-1 text-center text-white/50">
          Loading
        </div>
        <div className="hidden lg:block flex-1 text-center text-white/70">
          HOME / SERVICES / CONTACT
        </div>
        <div className="flex-1 flex justify-end">
          <span className="border border-white/20 rounded-full px-4 py-1.5 hover:bg-white hover:text-black transition-colors duration-300">
            Book a call
          </span>
        </div>
      </motion.div>

      {/* Middle Labels */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 w-full flex justify-between items-center text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50"
      >
        <div className="rotate-[-90deg] origin-left translate-y-12 translate-x-4">
          LATEST
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
        </div>
      </motion.div>

      {/* Bottom Typography */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative z-10 flex flex-col md:flex-row justify-between items-end w-full pb-4"
      >
        {/* Name Identity */}
        <div className="text-left font-black tracking-tight leading-[0.9] text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] uppercase whitespace-nowrap">
          SAHIL KUMAR <br/> 
          <span className="tracking-tighter">-26</span>
        </div>

        {/* Loader Percentage */}
        <div className="text-right flex items-end justify-end mt-8 md:mt-0 relative">
          <div className="hidden md:block absolute right-full bottom-2 mr-6 text-[10px] uppercase tracking-[0.1em] text-white/50 text-right w-48 font-medium leading-relaxed">
            I'm a multidisciplinary designer focused on creating bold digital experiences.
          </div>
          <div className="font-light tracking-tighter leading-none text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw]">
            {Math.min(100, Math.floor(progress))}
          </div>
          <div className="text-2xl md:text-4xl lg:text-5xl font-serif italic mb-2 md:mb-4 lg:mb-6 text-white/50" style={{ fontFamily: "'Playfair Display', serif" }}>
            %
          </div>
        </div>
      </motion.div>

      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden z-20">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
