import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextReveal from './TextReveal';

const services = [
  {
    num: '01',
    title: 'UI/UX Design',
    accent: 'from-purple-600/10 to-indigo-600/5 dark:from-purple-900/20 dark:to-indigo-900/10',
    icon: '✦',
    desc: 'Crafting intuitive, visually striking interfaces that solve real problems — from research through pixel-perfect delivery.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
  },
  {
    num: '02',
    title: 'Web Design',
    accent: 'from-fuchsia-600/10 to-purple-600/5 dark:from-fuchsia-900/20 dark:to-purple-900/10',
    icon: '◈',
    desc: 'Designing responsive, performance-focused websites with a sharp eye for layout, hierarchy, and conversion.',
    tags: ['Responsive', 'Motion', 'Typography'],
  },
  {
    num: '03',
    title: 'Product Design',
    accent: 'from-indigo-600/10 to-blue-600/5 dark:from-indigo-900/20 dark:to-blue-900/10',
    icon: '⬡',
    desc: 'End-to-end product thinking — from discovery and user research to high-fidelity screens and handoff.',
    tags: ['User Research', 'Flows', 'Handoff'],
  },
  {
    num: '04',
    title: 'Interaction & Motion',
    accent: 'from-violet-600/10 to-purple-600/5 dark:from-violet-900/20 dark:to-purple-900/10',
    icon: '◎',
    desc: 'Bringing digital products to life with meaningful micro-interactions and scroll-driven motion design.',
    tags: ['Framer Motion', 'GSAP', 'Lottie'],
  },
];

const ServicesSection: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress → horizontal translate of card track
  // 4 cards, each 80vw on mobile, 48vw on desktop — we need to shift 3 card-widths
  const x = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '-75%']);
  const glowX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    // Outer wrapper creates scroll budget: 400vh (1 screen + 3 card transitions)
    <div
      ref={outerRef}
      id="services"
      className="relative bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 border-t border-[#DCD9D4] dark:border-white/5"
      style={{ height: '400vh' }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

        {/* Scroll-linked ambient glow */}
        <motion.div
          style={{ x: glowX }}
          className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-purple-500/5 dark:bg-purple-900/10 blur-[150px] pointer-events-none"
        />

        {/* ── Header row ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-10 flex items-end justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#686868] dark:text-white/60 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-4 block uppercase transition-colors duration-500"
            >
              02 &bull; Services
            </motion.span>

            <div className="flex flex-col">
              <TextReveal
                as="h2"
                className="text-[#111111] dark:text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.0] block transition-colors duration-500"
                style={{ fontFamily: "'Arima', sans-serif" }}
                delay={0.1}
                stagger={0.08}
              >
                Capabilities
              </TextReveal>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "'Arima', sans-serif" }}
                className="text-purple-600 dark:text-purple-300 text-4xl sm:text-5xl md:text-6xl italic font-bold tracking-tight leading-[1.0] transition-colors duration-500"
              >
                &amp; Expertise.
              </motion.span>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="hidden md:flex items-center gap-2 text-[#686868] dark:text-white/30 text-xs font-medium tracking-widest uppercase"
          >
            <motion.span
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >→</motion.span>
            Scroll to explore
          </motion.div>
        </div>

        {/* ── Horizontal scroll track ── */}
        <div className="relative z-10 w-full overflow-visible pl-6 md:pl-16 lg:pl-24">
          <motion.div
            style={{ x }}
            className="flex gap-5 items-stretch"
            // Prevent momentum from clobbering layout
          >
            {services.map((svc, i) => (
              <motion.div
                key={svc.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group flex-shrink-0 w-[82vw] sm:w-[60vw] md:w-[46vw] lg:w-[36vw] rounded-3xl bg-gradient-to-br ${svc.accent} border border-[#DCD9D4] dark:border-white/5 p-8 md:p-10 flex flex-col justify-between backdrop-blur-sm transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] cursor-default overflow-hidden relative min-h-[360px]`}
              >
                {/* Bg number */}
                <span className="absolute -bottom-4 -right-4 text-[120px] font-black text-[#111111]/4 dark:text-white/[0.03] leading-none select-none pointer-events-none">
                  {svc.num}
                </span>

                <div>
                  {/* Icon + number */}
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-4xl text-purple-600/40 dark:text-purple-400/40 transition-colors duration-500 group-hover:text-purple-500/70">
                      {svc.icon}
                    </span>
                    <span className="text-[#686868] dark:text-white/20 font-mono text-xs tracking-widest transition-colors duration-500">
                      {svc.num}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[#111111] dark:text-white font-bold text-2xl md:text-3xl mb-4 tracking-tight group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors duration-500"
                    style={{ fontFamily: "'Arima', sans-serif" }}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-[#686868] dark:text-white/50 text-sm md:text-base font-light leading-relaxed transition-colors duration-500">
                    {svc.desc}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 relative z-10">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#111111]/5 dark:bg-white/5 border border-[#111111]/10 dark:border-white/10 text-[#686868] dark:text-white/50 text-[10px] font-semibold tracking-wide uppercase transition-colors duration-500 group-hover:border-purple-500/30 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll progress dots */}
        <div className="relative z-10 flex items-center gap-2 mt-8 pl-6 md:pl-16 lg:pl-24">
          {services.map((_, i) => {
            const segStart = 0.05 + (i / services.length) * 0.9;
            const segEnd = 0.05 + ((i + 1) / services.length) * 0.9;
            const dotScale = useTransform(scrollYProgress, [segStart, segEnd], [0.7, 1.2]);
            const dotOpacity = useTransform(scrollYProgress, [segStart - 0.1, segStart + 0.05, segEnd - 0.05, segEnd + 0.1], [0.3, 1, 1, 0.3]);
            return (
              <motion.div
                key={i}
                style={{ scale: dotScale, opacity: dotOpacity }}
                className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"
              />
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ServicesSection;
