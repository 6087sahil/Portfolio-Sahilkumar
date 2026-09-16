import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import ScrollReveal, { ScrollRevealItem } from './ScrollReveal';
import { useTheme } from './ThemeProvider';

const services = [
  {
    title: 'UI/UX Design',
    desc: 'Crafting intuitive and visually striking user interfaces that solve real problems.',
  },
  {
    title: 'Web Design',
    desc: 'Designing responsive, modern websites focused on conversion and aesthetics.',
  },
  {
    title: 'Product Design',
    desc: 'End-to-end product design from user research to high-fidelity prototyping.',
  },
  {
    title: 'Interaction & Motion',
    desc: 'Bringing digital experiences to life with meaningful animations and micro-interactions.',
  }
];

const ServiceCard = ({ service }: { service: any }) => {
  const { theme } = useTheme();
  
  const darkShadows = [
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)", 
    "0 10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.1)", 
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)"
  ];
  
  const lightShadows = [
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.15)", 
    "0 10px 30px rgba(0,0,0,0.05), 0 0 40px rgba(168,85,247,0.3)", 
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.15)"
  ];

  return (
    <ScrollRevealItem yOffset={40}>
      <motion.div
        whileHover={{ y: -6 }}
        animate={{ 
          boxShadow: theme === 'dark' ? darkShadows : lightShadows
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="group relative p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#DCD9D4] dark:border-white/5 overflow-hidden transition-colors duration-500 hover:bg-[#F5F3EF] dark:hover:bg-white/[0.02] cursor-default"
      >
        <motion.h3 
          className="text-2xl md:text-3xl font-bold text-[#111111] dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors duration-500 relative z-10"
          whileHover={{ x: 6 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {service.title}
        </motion.h3>
        <p className="text-[#686868] dark:text-white/50 text-sm md:text-base font-light leading-relaxed relative z-10 transition-colors duration-500">
          {service.desc}
        </p>
      </motion.div>
    </ScrollRevealItem>
  );
};

const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Extremely subtle premium scroll effects
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const expertiseX = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const glowY = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <section ref={sectionRef} id="services" className="relative w-full bg-[#F5F3EF] dark:bg-[#050108] transition-colors duration-500 py-28 md:py-36 border-t border-[#DCD9D4] dark:border-white/5 overflow-hidden">
      
      {/* Subtle ambient glow tied to scroll */}
      <motion.div 
        style={{ y: glowY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full bg-purple-500/5 dark:bg-purple-900/10 blur-[150px] pointer-events-none z-0 transition-colors duration-500" 
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        <ScrollReveal delay={0.1} yOffset={20}>
          <span className="text-[#686868] dark:text-white/60 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-8 sm:mb-12 block uppercase transition-colors duration-500">
            02 &bull; Services
          </span>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-20">
          <div className="lg:w-1/2">
            <motion.div style={{ y: headingY }} className="flex flex-col mb-6">
              <ScrollReveal delay={0.2} staggerChildren={0.1}>
                <motion.span 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-[#111111] dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 font-bold tracking-tight leading-[1.0] block transition-colors duration-500" style={{ fontFamily: "'Arima', sans-serif" }}>
                  Capabilities
                </motion.span>
                <motion.span 
                  style={{ x: expertiseX, fontFamily: "'Arima', sans-serif" }} 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="text-purple-600 dark:text-purple-300 text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic font-bold tracking-tight leading-[1.0] block transition-colors duration-500"
                >
                  & Expertise.
                </motion.span>
              </ScrollReveal>
            </motion.div>
            
            <ScrollReveal delay={0.4}>
              <p className="text-[#686868] dark:text-white/60 text-base sm:text-lg max-w-md font-light leading-relaxed transition-colors duration-500">
                Specializing in digital product design, I bridge the gap between human needs and business goals through thoughtful, beautiful interfaces.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3} staggerChildren={0.15} className="lg:w-1/2 flex flex-col gap-6">
            {services.map((service, idx) => (
              <ServiceCard key={idx} service={service} />
            ))}
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
