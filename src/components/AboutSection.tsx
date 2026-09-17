import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';
import { useTheme } from './ThemeProvider';

const AboutSection: React.FC = () => {
  const imageUrl = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop";
  const { theme } = useTheme();

  return (
    <section id="about" className="relative w-full min-h-screen bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 flex flex-col md:flex-row overflow-hidden border-y border-[#DCD9D4] dark:border-white/5 pt-20 pb-20 md:py-0">
      
      {/* Animated Ambient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -70, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" 
      />

      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-bold text-[#111111]/[0.03] dark:text-white/[0.03] transition-colors duration-500 leading-none pointer-events-none select-none z-10 flex whitespace-nowrap tracking-tighter mix-blend-overlay">
        SAHIL
      </div>

      {/* LEFT SIDE - Portrait Card */}
      <div className="w-full md:w-5/12 relative h-[60vh] md:h-screen flex items-center justify-center p-8 z-20">
        <FadeIn delay={0.2} className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-[#DCD9D4] dark:border-white/10 transition-colors duration-500 shadow-[0_0_50px_rgba(168,85,247,0.15)] group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F3EF] via-[#F5F3EF]/40 dark:from-[#050108] dark:via-[#050108]/40 transition-colors duration-500 to-transparent z-10 pointer-events-none" />
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            src={imageUrl} 
            alt="Sahil Kumar" 
            className="w-full h-full object-cover filter grayscale opacity-80 mix-blend-luminosity"
          />
          <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
            <h2 className="text-3xl font-light text-[#111111] dark:text-white transition-colors duration-500 tracking-widest uppercase mb-1 drop-shadow-md">
              Sahil <span className="font-bold">Kumar</span>
            </h2>
            <p className="text-purple-600 dark:text-purple-400 transition-colors duration-500 text-xs tracking-[0.2em] uppercase font-semibold drop-shadow-md">
              Expert in UI/UX Design
            </p>
          </div>
        </FadeIn>
      </div>

      {/* RIGHT SIDE - Content & Stats */}
      <div className="w-full md:w-7/12 relative min-h-[50vh] flex flex-col justify-center p-8 md:p-16 lg:p-24 z-30">
        
        <div className="relative z-10 w-full max-w-2xl">
          <FadeIn delay={0.3} y={20}>
            <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-6">
              <span className="text-purple-700 dark:text-purple-300 transition-colors duration-500 text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-md">
                Experience
              </span>
            </div>
            <h3 className="text-[#111111] dark:text-white transition-colors duration-500 font-bold text-5xl md:text-6xl lg:text-8xl tracking-tight leading-[0.9] mb-8" style={{ fontFamily: "'Arima', sans-serif" }}>
              <span className="block text-2xl md:text-3xl font-sans font-medium uppercase tracking-widest text-[#111111]/80 dark:text-white/80 transition-colors duration-500 mb-2" style={{ fontFamily: "inherit" }}>3+ Years of</span>
              Creative <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 dark:from-purple-400 dark:via-fuchsia-300 dark:to-indigo-300 italic transition-colors duration-500">Excellence.</span>
            </h3>
            
            <div className="space-y-4 mb-12 max-w-xl">
              <p className="text-[#111111]/80 dark:text-white/80 transition-colors duration-500 text-base md:text-lg leading-relaxed font-light">
                With years of hands-on design experience, Sahil specializes in crafting intuitive user interfaces and memorable digital experiences that bridge the gap between user needs and business goals.
              </p>
              <p className="text-[#686868] dark:text-white/50 transition-colors duration-500 text-sm md:text-base leading-relaxed font-light">
                My design philosophy is rooted in minimalism and functional aesthetics. I believe that the best products are those that feel effortless to use. By combining visual elegance with rigorous user-centered thinking, I transform complex problems into beautiful, scalable solutions.
              </p>
            </div>
          </FadeIn>

          {/* Stats Grid */}
          <FadeIn delay={0.5} y={30} className="w-full">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              
              {/* Stat Card 1 */}
              <motion.div 
                whileHover={{ y: -5, backgroundColor: theme === 'dark' ? "rgba(255,255,255,0.05)" : "#EBE9E4" }}
                className="flex flex-col p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-[#DCD9D4] dark:border-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all cursor-default"
              >
                <span className="text-4xl md:text-5xl font-bold text-[#111111] dark:text-white transition-colors duration-500 mb-2">50+</span>
                <span className="text-purple-600/80 dark:text-purple-300/80 transition-colors duration-500 text-[10px] uppercase tracking-[0.1em] font-semibold">Successful Projects</span>
              </motion.div>

              {/* Stat Card 2 */}
              <motion.div 
                whileHover={{ y: -5, backgroundColor: theme === 'dark' ? "rgba(255,255,255,0.05)" : "#EBE9E4" }}
                className="flex flex-col p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-[#DCD9D4] dark:border-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all cursor-default"
              >
                <span className="text-4xl md:text-5xl font-bold text-[#111111] dark:text-white transition-colors duration-500 mb-2">99%</span>
                <span className="text-purple-600/80 dark:text-purple-300/80 transition-colors duration-500 text-[10px] uppercase tracking-[0.1em] font-semibold">Client Satisfaction</span>
              </motion.div>

              {/* Stat Card 3 */}
              <motion.div 
                whileHover={{ y: -5, backgroundColor: theme === 'dark' ? "rgba(255,255,255,0.05)" : "#EBE9E4" }}
                className="flex flex-col p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-[#DCD9D4] dark:border-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all cursor-default"
              >
                <span className="text-4xl md:text-5xl font-bold text-[#111111] dark:text-white transition-colors duration-500 mb-2">4</span>
                <span className="text-purple-600/80 dark:text-purple-300/80 transition-colors duration-500 text-[10px] uppercase tracking-[0.1em] font-semibold">Design Awards</span>
              </motion.div>

              {/* Stat Card 4 */}
              <motion.div 
                whileHover={{ y: -5, backgroundColor: theme === 'dark' ? "rgba(255,255,255,0.05)" : "#EBE9E4" }}
                className="flex flex-col p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-[#DCD9D4] dark:border-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all cursor-default"
              >
                <span className="text-4xl md:text-5xl font-bold text-[#111111] dark:text-white transition-colors duration-500 mb-2">100M+</span>
                <span className="text-purple-600/80 dark:text-purple-300/80 transition-colors duration-500 text-[10px] uppercase tracking-[0.1em] font-semibold">Users Reached</span>
              </motion.div>

            </div>
          </FadeIn>
        </div>

      </div>

    </section>
  );
};

export default AboutSection;
