import React from 'react';
import FadeIn from './FadeIn';
import TextReveal from './TextReveal';
import RevealBackground from './RevealBackground';

import { motion } from 'framer-motion';

interface HeroSectionProps {
  isLoaded?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isLoaded = true }) => {
  return (
    <section className="h-screen flex flex-col overflow-x-clip relative">
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 opacity-70">
          <RevealBackground bottomImageSrc="/hero-bottom.png" topImageSrc="/hero-top.png" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 px-6 md:px-16 lg:px-24 pointer-events-none">
        
        <div className="w-full flex flex-col items-start text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="text-white/60 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-6 sm:mb-8 block">
              PORTFOLIO &bull; 2026
            </span>
          </motion.div>
          
          <div className="w-full flex flex-col mb-6">
            <motion.h1 
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.04, delayChildren: 0.2 }
                }
              }}
              className="font-bold tracking-tight leading-[1.05] text-left mb-2 sm:mb-4 flex flex-wrap"
            >
              {"Hi, I'm".split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                  }}
                  className="text-white/80 text-4xl sm:text-5xl md:text-6xl font-medium" 
                  style={{ fontFamily: "inherit", whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.h1 
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.5 }
                }
              }}
              className="font-bold tracking-tight leading-[1.05] text-left flex flex-wrap"
            >
              {"Sahil Kumar".split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={{
                    hidden: { opacity: 0, y: 30, rotateX: -90 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                  }}
                  className="text-white drop-shadow-lg text-6xl sm:text-7xl md:text-8xl lg:text-[100px]" 
                  style={{ fontFamily: "'Arima', sans-serif", whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 sm:mt-6" 
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white mb-4">
              UI/UX & Product Designer
            </h2>
            <p className="text-white/80 font-normal leading-relaxed text-base sm:text-lg max-w-md">
              I design digital experiences that are <br className="hidden sm:block"/>
              simple, intuitive, and memorable.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 sm:gap-6"
          >
            <a 
              href="#projects"
              className="pointer-events-auto bg-white text-black px-8 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_35px_rgba(255,255,255,0.8)] hover:-translate-y-1 hover:bg-gray-100"
            >
              VIEW MY WORK
            </a>
            <a 
              href="#contact"
              className="pointer-events-auto bg-transparent border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] hover:-translate-y-1 hover:bg-white/10"
            >
              LET'S CONNECT
            </a>
          </motion.div>
        </div>

      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 z-20 pointer-events-none"
      >
        <div className="w-4 sm:w-5 h-7 sm:h-8 border border-white/40 rounded-full flex justify-center pt-1.5">
          <motion.div 
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full"
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-white/50 text-[7px] sm:text-[8px] font-medium tracking-[0.3em] uppercase text-center ml-[0.3em]">
          Scroll to explore
        </span>
      </motion.div>

    </section>
  );
};

export default HeroSection;
