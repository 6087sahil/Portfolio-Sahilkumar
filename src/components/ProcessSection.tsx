import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import TextReveal from './TextReveal';

const steps = [
  { num: '01', title: 'Research',   desc: 'Understand users, markets, and competitors through interviews and data.',       icon: '🔍' },
  { num: '02', title: 'Define',     desc: 'Synthesize insights into personas, problem statements, and clear goals.',       icon: '🎯' },
  { num: '03', title: 'Wireframe',  desc: 'Map information architecture and sketch low-fidelity layouts rapidly.',         icon: '✏️' },
  { num: '04', title: 'Design',     desc: 'Craft pixel-perfect high-fidelity screens with consistent design systems.',     icon: '🎨' },
  { num: '05', title: 'Prototype',  desc: 'Build interactive prototypes to simulate the real product experience.',         icon: '⚡' },
  { num: '06', title: 'Test',       desc: 'Validate with real users, collect feedback, and surface friction points.',      icon: '🧪' },
  { num: '07', title: 'Refine',     desc: 'Iterate based on insights until the product is polished and ready to ship.',   icon: '✨' },
];

/* Step row — hooks at component level ✓ */
const StepRow = ({
  step,
  index,
  stepCount,
  scrollYProgress,
}: {
  step: typeof steps[0];
  index: number;
  stepCount: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const start = index / stepCount;
  const end = (index + 1) / stepCount;

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.04), start + 0.05, end + 0.08, Math.min(1, end + 0.25)],
    [0.15, 1, 1, 0.25]
  );
  const x = useTransform(scrollYProgress, [Math.max(0, start - 0.04), start + 0.06], [-20, 0]);
  const isActiveScale = useTransform(scrollYProgress, [start, start + 0.06], [0.97, 1]);

  return (
    <motion.div
      style={{ opacity, x, scale: isActiveScale }}
      className="flex items-start gap-4 py-1.5 md:py-2 cursor-default"
    >
      <span className="text-[#111111]/25 dark:text-white/20 font-mono text-xs tracking-widest flex-shrink-0 w-6 pt-0.5 transition-colors duration-500">
        {step.num}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-[#111111] dark:text-white font-bold text-base md:text-lg mb-0.5 transition-colors duration-500">
          {step.title}
        </h4>
        <p
          className="text-[#686868] dark:text-white/40 text-sm leading-[1.4] transition-colors duration-300"
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
};

/* Active step icon panel — changes per scroll position */
const StepVisual = ({
  scrollYProgress,
  stepCount,
}: {
  scrollYProgress: MotionValue<number>;
  stepCount: number;
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {steps.map((step, i) => {
        const start = i / stepCount;
        const end = (i + 1) / stepCount;
        const opacity = useTransform(
          scrollYProgress,
          [Math.max(0, start - 0.03), start + 0.06, end, Math.min(1, end + 0.06)],
          [0, 1, 1, 0]
        );
        const scale = useTransform(scrollYProgress, [start, start + 0.08], [0.85, 1]);
        const y = useTransform(scrollYProgress, [start, start + 0.08], [30, 0]);

        return (
          <motion.div
            key={step.num}
            style={{ opacity, scale, y }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          >
            {/* Large emoji icon */}
            <span className="text-6xl md:text-8xl mb-6 filter drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              {step.icon}
            </span>
            {/* Giant step number */}
            <span
              className="text-[100px] md:text-[140px] font-black text-[#111111]/[0.04] dark:text-white/[0.04] leading-none tracking-tighter select-none"
              style={{ fontFamily: "'Arima', sans-serif" }}
            >
              {step.num}
            </span>
            {/* Step title */}
            <span
              className="text-[#111111] dark:text-white text-2xl md:text-3xl font-bold tracking-tight mt-2 transition-colors duration-500"
              style={{ fontFamily: "'Arima', sans-serif" }}
            >
              {step.title}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

const ProcessSection: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const stepCount = steps.length;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Progress line fills from top to bottom as scroll advances
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={outerRef}
      id="process"
      className="relative bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 border-t border-[#DCD9D4] dark:border-white/5"
      style={{ height: `${100 + stepCount * 55}vh` }}
    >
      {/* Sticky panel */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-4 md:py-6">

          {/* Section label + headline */}
          <div className="mb-2 md:mb-4">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#686868] dark:text-white/60 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-2 block uppercase transition-colors duration-500"
            >
              05 &bull; Design Process
            </motion.span>
            <div className="flex flex-col">
              <TextReveal
                as="h2"
                className="text-purple-500 dark:text-purple-200 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] transition-colors duration-500"
                style={{ fontFamily: "'Arima', sans-serif" }}
                delay={0.1} stagger={0.07}
              >
                How I turn ideas
              </TextReveal>
              <TextReveal
                as="h2"
                className="text-[#111111]/30 dark:text-white/30 text-3xl sm:text-4xl md:text-5xl italic font-bold tracking-tight leading-[1.05] transition-colors duration-500"
                style={{ fontFamily: "'Arima', sans-serif" }}
                delay={0.32} stagger={0.07}
              >
                into products.
              </TextReveal>
            </div>
          </div>

          {/* Two-column: steps left, visual right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 flex-1 min-h-0 mt-2">

            {/* LEFT: progress line + steps */}
            <div className="flex gap-4 md:gap-6 min-h-0">
              {/* Vertical progress line */}
              <div className="relative flex-shrink-0 flex flex-col items-center pt-1">
                {/* Track */}
                <div className="w-px bg-[#DCD9D4] dark:bg-white/10 flex-1 transition-colors duration-500" />
                {/* Fill line */}
                <motion.div
                  className="absolute top-0 left-0 w-full bg-purple-500/70 dark:bg-purple-400/70 origin-top"
                  style={{ scaleY: lineScaleY, height: '100%' }}
                />
              </div>

              {/* Steps list */}
              <div className="flex flex-col divide-y divide-[#DCD9D4] dark:divide-white/5 flex-1 min-h-0 transition-colors duration-500">
                {steps.map((step, i) => (
                  <StepRow
                    key={step.num}
                    step={step}
                    index={i}
                    stepCount={stepCount}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: changing visual per active step */}
            <div className="hidden lg:block relative">
              <StepVisual scrollYProgress={scrollYProgress} stepCount={stepCount} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
