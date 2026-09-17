import React from 'react';
import ScrollReveal, { ScrollRevealItem } from './ScrollReveal';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F5F3EF] dark:bg-[#06000c] border-t border-[#DCD9D4] dark:border-white/5 pt-16 pb-12 relative z-20 overflow-hidden transition-colors duration-500">
      <ScrollReveal delay={0.1} duration={1} yOffset={30} className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          
          <ScrollRevealItem className="flex flex-col">
            <h3 className="text-[#111111] dark:text-white text-2xl sm:text-3xl font-bold tracking-tight mb-2 transition-colors duration-500" style={{ fontFamily: "'Arima', sans-serif" }}>
              Sahil Kumar
            </h3>
            <p className="text-[#686868] dark:text-white/40 text-sm font-medium tracking-wide transition-colors duration-500">
              UI/UX & Product Designer
            </p>
          </ScrollRevealItem>

          <ScrollReveal delay={0.2} staggerChildren={0.1} className="flex flex-wrap items-center gap-6 sm:gap-10">
            {['Email', 'LinkedIn', 'Dribbble', 'GitHub'].map((link) => (
              <ScrollRevealItem key={link} yOffset={10}>
                <a 
                  href="#" 
                  className="group text-[#686868] dark:text-white/50 text-sm font-medium hover:text-[#111111] dark:hover:text-white transition-colors duration-300 relative py-1"
                >
                  <span className="relative z-10 inline-block transition-transform duration-300 group-hover:-translate-y-0.5">{link}</span>
                </a>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>

        </div>

        <ScrollReveal delay={0.4} className="mt-16 pt-8 border-t border-[#DCD9D4] dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-500">
          <p className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors duration-500">
            &copy; {new Date().getFullYear()} Sahil Kumar. All rights reserved.
          </p>
          <div className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center gap-2 transition-colors duration-500">
            Designed & Built with <span className="text-purple-600 dark:text-purple-500 animate-pulse">&hearts;</span>
          </div>
        </ScrollReveal>

      </ScrollReveal>
    </footer>
  );
};

export default Footer;
