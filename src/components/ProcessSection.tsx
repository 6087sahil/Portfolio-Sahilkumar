import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from './FadeIn';
import { useTheme } from './ThemeProvider';

const steps = [
  { num: '01', title: 'Research', desc: 'Understand users, markets, and competitors through interviews and data.' },
  { num: '02', title: 'Define', desc: 'Synthesize insights into personas, problem statements, and clear goals.' },
  { num: '03', title: 'Wireframe', desc: 'Map architecture and sketch low-fidelity layouts rapidly.' },
  { num: '04', title: 'Design', desc: 'Craft pixel-perfect high-fidelity screens with consistent design systems.' },
  { num: '05', title: 'Prototype', desc: 'Build interactive prototypes to simulate the real product.' },
  { num: '06', title: 'Test', desc: 'Validate with real users, collect feedback, and surface friction.' },
  { num: '07', title: 'Refine', desc: 'Iterate based on insights until the product is polished and ready.' },
];

const ProcessSection: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section id="process" className="relative w-full bg-[#F5F3EF] dark:bg-[#0a0a0a] transition-colors duration-500 py-28 md:py-36 border-t border-[#DCD9D4] dark:border-white/5">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        <FadeIn delay={0.1} y={30}>
          <span className="text-[#686868] dark:text-white/60 transition-colors duration-500 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-8 sm:mb-12 block uppercase">
            05 &bull; Design Process
          </span>
        </FadeIn>

        <FadeIn delay={0.2} y={40}>
          <h2 className="font-bold tracking-tight leading-[1.0] mb-12 flex flex-col transition-colors duration-500" style={{ fontFamily: "'Arima', sans-serif" }}>
            <span className="text-purple-500 dark:text-purple-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl transition-colors duration-500">How I turn ideas</span>
            <span className="text-[#111111]/30 dark:text-white/30 text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic transition-colors duration-500">into products.</span>
          </h2>
        </FadeIn>

        {/* Steps list */}
        <div className="border-t border-[#DCD9D4] dark:border-white/8 divide-y divide-[#DCD9D4] dark:divide-white/5 transition-colors duration-500">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.03)' }}
              className="group flex items-center gap-6 md:gap-12 py-6 px-3 -mx-3 rounded-xl transition-all duration-300 cursor-default"
            >
              <span className="text-[#111111]/20 dark:text-white/20 transition-colors duration-500 font-mono text-xs tracking-widest flex-shrink-0 w-6">{step.num}</span>
              <h4 className="text-[#111111] dark:text-white transition-colors duration-500 font-bold text-base md:text-lg w-28 md:w-36 flex-shrink-0 group-hover:text-purple-600 dark:group-hover:text-purple-200">
                {step.title}
              </h4>
              <div className="hidden md:block flex-1 h-px bg-[#111111]/5 dark:bg-white/5 group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/15 transition-colors duration-500" />
              <p className="text-[#686868] dark:text-white/40 transition-colors duration-500 text-sm leading-relaxed max-w-sm group-hover:text-[#111111] dark:group-hover:text-white/60" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                {step.desc}
              </p>
              <span className="text-[#111111]/10 dark:text-white/10 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 text-sm hidden lg:block flex-shrink-0">→</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
