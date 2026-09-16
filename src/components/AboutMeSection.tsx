import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';
import { useTheme } from './ThemeProvider';

const AboutMeSection: React.FC = () => {
  const { theme } = useTheme();
  
  const darkShadows = [
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)", 
    "0 10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.1)", 
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)"
  ];
  
  const lightShadows = [
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.02)", 
    "0 10px 30px rgba(0,0,0,0.05), 0 0 40px rgba(168,85,247,0.06)", 
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.02)"
  ];

  return (
    <section id="aboutme" className="relative w-full bg-[#F5F3EF] dark:bg-[#0a0a0a] transition-colors duration-500 py-28 md:py-36 border-t border-[#DCD9D4] dark:border-white/5">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        <FadeIn delay={0.1} y={30}>
          <span className="text-[#686868] dark:text-white/60 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-8 sm:mb-12 block uppercase transition-colors duration-500">
            03 &bull; About Me
          </span>
        </FadeIn>

        <FadeIn delay={0.2} y={40}>
          <h2 className="font-bold tracking-tight leading-[1.0] mb-10 flex flex-col" style={{ fontFamily: "'Arima', sans-serif" }}>
            <span className="text-purple-600 dark:text-purple-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl transition-colors duration-500">Turning ideas</span>
            <span className="text-[#111111]/30 dark:text-white/30 text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic transition-colors duration-500">into experiences.</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-16" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
          <FadeIn delay={0.3} y={20}>
            <div className="space-y-5">
              <p className="text-[#111111] dark:text-white/80 text-base sm:text-lg leading-relaxed font-normal transition-colors duration-500">
                I'm Sahil Kumar, a UI/UX & Product Designer based in New Delhi, India. I'm passionate about creating digital products that are not just visually stunning but deeply functional and human-centered.
              </p>
              <p className="text-[#686868] dark:text-white/50 text-base leading-relaxed font-normal transition-colors duration-500">
                My design philosophy centers on simplicity, clarity, and purpose. I believe the best interfaces get out of the way and let users accomplish their goals effortlessly.
              </p>
              <p className="text-[#686868]/80 dark:text-white/35 text-sm leading-relaxed font-normal transition-colors duration-500">
                I approach every project by deeply understanding the user's mental model first, then crafting solutions that feel natural and visually polished.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} y={20}>
            <span className="text-[#686868]/80 dark:text-white/40 text-[10px] font-semibold tracking-[0.2em] uppercase block mb-6 transition-colors duration-500">Education & Experience</span>
            <div className="space-y-0 divide-y divide-[#DCD9D4] dark:divide-white/8 transition-colors duration-500">
              {[
                { period: '2026 – Present', role: 'UI/UX & Product Designer', org: 'Freelance & Self-Initiated', accent: 'bg-purple-500 dark:bg-purple-400' },
                { period: 'Ongoing', role: 'Bachelor of Arts', org: 'School of Open Learning · University of Delhi', accent: 'bg-indigo-500 dark:bg-indigo-400' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="py-6 flex gap-5"
                >
                  <div className={`w-1.5 h-1.5 ${item.accent} rounded-full mt-1.5 flex-shrink-0 transition-colors duration-500`} />
                  <div>
                    <span className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-widest uppercase block mb-1 transition-colors duration-500">{item.period}</span>
                    <h4 className="text-[#111111] dark:text-white font-bold text-base transition-colors duration-500">{item.role}</h4>
                    <p className="text-[#686868] dark:text-white/40 text-sm mt-0.5 transition-colors duration-500">{item.org}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Trait cards */}
        <FadeIn delay={0.5} y={20}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'User-Centered', desc: 'Every decision starts with the user.' },
              { label: 'Detail-Oriented', desc: 'Consistency at every pixel matters.' },
              { label: 'Problem Solver', desc: 'Design is a tool for real challenges.' },
            ].map((t) => (
              <motion.div 
                key={t.label} 
                animate={{ 
                  boxShadow: theme === 'dark' ? darkShadows : lightShadows
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="p-6 rounded-2xl border border-[#DCD9D4] dark:border-white/8 bg-white dark:bg-[#0a0a0a] hover:bg-[#F5F3EF] dark:hover:bg-white/[0.02] transition-colors duration-500"
              >
                <div className="w-5 h-px bg-purple-500/50 dark:bg-purple-400/50 mb-5 transition-colors duration-500" />
                <h4 className="text-[#111111] dark:text-white font-bold text-sm mb-2 transition-colors duration-500">{t.label}</h4>
                <p className="text-[#686868] dark:text-white/40 text-sm leading-relaxed transition-colors duration-500">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default AboutMeSection;
