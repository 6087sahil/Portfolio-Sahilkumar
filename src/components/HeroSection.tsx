import React from 'react';
import RevealBackground from './RevealBackground';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  isLoaded?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isLoaded = true }) => {
  return (
    <section className="h-screen flex flex-col overflow-x-clip relative">
      {/* Interactive Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <RevealBackground bottomImageSrc="/hero-bottom.png" topImageSrc="/hero-top.png" />
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 px-6 md:px-16 lg:px-24 pointer-events-none text-white">
        
        <div className="w-full flex flex-col items-start text-left max-w-2xl">
          {/* Portfolio Year */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="text-white/80 font-medium tracking-wide text-xs sm:text-sm mb-4 sm:mb-6 block font-sans">
              Portfolio &bull; 2026
            </span>
          </motion.div>
          
          {/* Main Title Group */}
          <div className="w-full flex flex-col mb-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-white text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-2 sm:mb-3 font-sans"
            >
              Hi, I'm
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 24 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-white drop-shadow-md text-6xl sm:text-7xl md:text-[80px] lg:text-[100px] xl:text-[110px] font-bold tracking-normal leading-[1.02]" 
              style={{ fontFamily: "'Arima', sans-serif" }}
            >
              Sahil Kumar
            </motion.h1>
          </div>

          {/* Subtitle & Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-2"
          >
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-white mb-3 font-sans">
              UI/UX &amp; Product Designer
            </h2>
            <p className="text-white/80 font-normal leading-relaxed text-base sm:text-lg max-w-md font-sans">
              I design digital experiences that are <br className="hidden sm:block"/>
              simple, intuitive, and memorable.
            </p>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4"
          >
            <a 
              href="#projects"
              className="group pointer-events-auto relative inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
            <a 
              href="#contact"
              className="group pointer-events-auto relative inline-flex items-center gap-2 bg-transparent text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 border border-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] backdrop-blur-md"
            >
              <span className="relative z-10 flex items-center gap-2">
                Let's Connect
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </motion.div>
        </div>

      </div>

      {/* Scroll Prompt */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-6 sm:bottom-10 w-full flex flex-col items-center justify-center gap-2 z-20 pointer-events-none"
      >
        <div className="w-4 sm:w-5 h-7 sm:h-8 border border-white/40 rounded-full flex justify-center pt-1.5">
          <motion.div 
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full"
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-white/50 text-xs font-medium tracking-wider text-center">
          Scroll to explore
        </span>
      </motion.div>

    </section>
  );
};

export default HeroSection;
