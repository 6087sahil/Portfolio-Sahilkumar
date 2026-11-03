import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import {
  Download,
  ArrowRight,
  ArrowUp,
  MapPin,
  Sparkles,
  Heart,
  Hammer,
  Eye,
  Mail,
} from 'lucide-react';
import Magnet from './Magnet';

const EASE_SPRING = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────────
   ANIMATED SECTION REVEAL (Respects prefers-reduced-motion)
───────────────────────────────────────────────────────────────── */
const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}> = ({ children, delay = 0, className = '', y = 20 }) => {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: shouldReduce ? 0.2 : 0.65, delay, ease: EASE_SPRING }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   CIRCULAR READING PROGRESS & BACK TO TOP
───────────────────────────────────────────────────────────────── */
const BackToTopProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-6 sm:right-8 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#161513] text-[#FAF8F5] dark:bg-[#FAF8F5] dark:text-[#161513] flex items-center justify-center shadow-xl hover:bg-[#8F5431] dark:hover:bg-[#8F5431] dark:hover:text-white transition-colors group cursor-pointer"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90 p-1" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              className="opacity-20"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="1 1"
              style={{ pathLength }}
              strokeLinecap="round"
              className="text-[#8F5431]"
            />
          </svg>
          <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll progress for reading bar & subtle parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scaleXProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax elements (disabled on prefers-reduced-motion)
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const yBadge1 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yBadge2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yBadge3 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const imageUrl = '/sahil-profile.png';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-[#F4F1EA] dark:bg-[#161513] text-[#161513] dark:text-[#F4F1EA] overflow-hidden flex flex-col pt-28 sm:pt-36 pb-20 md:pb-28 transition-colors duration-500"
    >
      {/* ── TOP READING PROGRESS BAR ── */}
      <motion.div
        style={{ scaleX: scaleXProgress }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8F5431] via-[#B37750] to-[#8F5431] origin-left z-50 pointer-events-none"
      />

      {/* Floating Circular Back-to-Top Button */}
      <BackToTopProgress />

      {/* SUBTLE BACKGROUND GRID */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(22, 21, 19, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(22, 21, 19, 0.2) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
        }}
      />

      {/* AMBIENT WARM ACCENTS */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#8F5431]/5 dark:bg-[#8F5431]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-[#6E3D1E]/5 dark:bg-[#6E3D1E]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col gap-24 md:gap-32">

        {/* ========================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-10 sm:gap-14 pt-4 sm:pt-6">
          {/* Eyebrow Label */}
          <FadeUp delay={0.05} className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#8F5431] animate-pulse" />
            <span className="text-[#8F5431] dark:text-[#E8AF8B] font-mono text-xs uppercase tracking-widest font-semibold">
              ABOUT ME &bull; SAHIL KUMAR
            </span>
          </FadeUp>

          {/* Editorial Display Headline */}
          <FadeUp delay={0.12}>
            <h1 className="font-serif text-[#161513] dark:text-[#F4F1EA] text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-normal tracking-tight leading-[1.08] max-w-[20ch]">
              Designing digital interfaces with{' '}
              <span className="italic font-serif text-[#8F5431] dark:text-[#E8AF8B]">
                clarity and care.
              </span>
            </h1>
          </FadeUp>

          {/* Hero Two-Column Layout: Photo Frame + Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-2">
            
            {/* Left Column: Photo with Polaroid Frame + Floating Tags */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start">
              <div className="relative w-[280px] sm:w-[350px] md:w-[380px] py-4">
                
                {/* Layered Back Polaroid (Dehradun Mountain Duotone) */}
                <div className="absolute -top-4 -left-4 sm:-left-6 w-[78%] bg-white dark:bg-[#1E1C18] p-3 pb-8 sm:pb-9 rounded-2xl border border-[#161513]/10 dark:border-white/10 shadow-[0_12px_28px_-8px_rgba(22,21,19,0.12)] -rotate-6 select-none pointer-events-none z-0 opacity-85">
                  <div className="aspect-square bg-[#6E3D1E] overflow-hidden rounded-xl relative">
                    <img
                      src="/hero-bottom.png"
                      alt="Dehradun mountains landscape"
                      className="w-full h-full object-cover filter grayscale contrast-125 brightness-95"
                    />
                    {/* Warm Brown Duotone Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#542a13] via-[#8F5431] to-[#b37750] opacity-85 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 bg-[#8F5431]/40 mix-blend-color pointer-events-none" />
                  </div>
                  <div className="pt-2 text-left">
                    <span className="font-serif italic text-xs text-[#8F5431] dark:text-[#E8AF8B]">
                      Dehradun.
                    </span>
                  </div>
                </div>

                {/* Main Foreground Polaroid Photo Frame */}
                <motion.div
                  style={shouldReduceMotion ? {} : { y: yImage }}
                  whileHover={shouldReduceMotion ? {} : { rotate: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: EASE_SPRING }}
                  className="relative z-10 bg-white dark:bg-[#1E1C18] p-3.5 sm:p-4 pb-12 sm:pb-14 rounded-2xl sm:rounded-[1.75rem] border border-[#161513]/15 dark:border-white/15 shadow-[0_22px_55px_-12px_rgba(22,21,19,0.22),0_8px_22px_-6px_rgba(22,21,19,0.08)] hover:shadow-[0_28px_65px_-12px_rgba(110,61,30,0.28)] rotate-2 transition-shadow duration-500 group cursor-pointer"
                >
                  {/* Photo Inner Canvas */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#EDE8DE] dark:bg-[#2A2621] rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                    <img
                      src={imageUrl}
                      alt="Sahil Kumar"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                  </div>

                  {/* Editorial Handwritten Chin Caption */}
                  <div className="pt-3.5 sm:pt-4 text-left">
                    <p className="font-serif italic text-base sm:text-lg text-[#161513]/90 dark:text-white/90 tracking-tight leading-tight select-none">
                      happiest a little higher up.
                    </p>
                  </div>
                </motion.div>

                {/* Floating "Available for work" Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-6 -right-3 sm:-right-6 z-20 flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#161513]/15 dark:border-white/15 bg-white/95 dark:bg-[#1E1C18]/95 backdrop-blur-xl shadow-md"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FA765] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4FA765]" />
                  </span>
                  <span className="text-[#161513] dark:text-[#F4F1EA] text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase">
                    Available for work
                  </span>
                </motion.div>

                {/* Parallax Floating Tags */}
                <motion.div
                  style={shouldReduceMotion ? {} : { y: yBadge1 }}
                  className="absolute top-[22%] -left-6 sm:-left-12 z-20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#161513]/15 dark:border-white/15 bg-white/95 dark:bg-[#1E1C18]/95 backdrop-blur-xl shadow-sm hover:border-[#8F5431] hover:text-[#8F5431] transition-colors"
                >
                  <span className="text-[#161513] dark:text-[#F4F1EA] text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase">
                    DESIGN
                  </span>
                </motion.div>

                <motion.div
                  style={shouldReduceMotion ? {} : { y: yBadge2 }}
                  className="absolute top-[58%] -right-6 sm:-right-10 z-20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#161513]/15 dark:border-white/15 bg-white/95 dark:bg-[#1E1C18]/95 backdrop-blur-xl shadow-sm hover:border-[#8F5431] hover:text-[#8F5431] transition-colors"
                >
                  <span className="text-[#161513] dark:text-[#F4F1EA] text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase">
                    RESEARCH
                  </span>
                </motion.div>

                <motion.div
                  style={shouldReduceMotion ? {} : { y: yBadge3 }}
                  className="absolute bottom-[18%] -left-5 sm:-left-10 z-20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#161513]/15 dark:border-white/15 bg-white/95 dark:bg-[#1E1C18]/95 backdrop-blur-xl shadow-sm hover:border-[#8F5431] hover:text-[#8F5431] transition-colors"
                >
                  <span className="text-[#161513] dark:text-[#F4F1EA] text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase">
                    INTERACTION
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Short First-Person Intro */}
            <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-4">
              <FadeUp delay={0.2}>
                <p className="text-[#161513] dark:text-[#F4F1EA] text-xl sm:text-2xl font-serif leading-snug max-w-[65ch]">
                  I’m Sahil, an entry-level UI/UX and product designer based in Delhi.
                </p>
              </FadeUp>

              <FadeUp delay={0.26}>
                <p className="text-[#5C5852] dark:text-[#A8A29E] text-base sm:text-lg font-light leading-relaxed max-w-[65ch]">
                  I like turning confusing everyday apps into ones that feel clear and easy to use, and I care about the small details that make that happen: simple layouts, readable type and thoughtful interactions. I’m looking for my first full-time design role, where I can learn from a team and grow as a designer.
                </p>
              </FadeUp>

              {/* Action Buttons: "Read my story" and "Let's talk" */}
              <FadeUp delay={0.32} className="flex flex-wrap items-center gap-4 pt-2">
                <Magnet strength={12} padding={15}>
                  <button
                    onClick={() => scrollToSection('my-story')}
                    className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#161513] text-white dark:bg-[#FAF8F5] dark:text-[#161513] rounded-full font-mono text-xs font-semibold tracking-wider uppercase hover:bg-[#8F5431] dark:hover:bg-[#8F5431] dark:hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <span>READ MY STORY</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </Magnet>

                <Magnet strength={10} padding={15}>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#161513]/20 dark:border-white/20 text-[#161513] dark:text-[#FAF8F5] font-mono text-xs font-semibold tracking-wider uppercase hover:border-[#8F5431] hover:text-[#8F5431] dark:hover:border-[#E8AF8B] dark:hover:text-[#E8AF8B] transition-colors cursor-pointer"
                  >
                    <span>LET'S TALK</span>
                  </button>
                </Magnet>
              </FadeUp>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. 01 / MY STORY SECTION */}
        {/* ========================================================= */}
        <section id="my-story" className="flex flex-col gap-10 scroll-mt-28">
          <FadeUp className="flex items-center gap-4">
            <span className="w-10 h-px bg-[#8F5431]" />
            <span className="text-[#8F5431] dark:text-[#E8AF8B] font-mono text-xs uppercase tracking-widest font-semibold">
              01 / MY STORY
            </span>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <FadeUp delay={0.08}>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#161513] dark:text-[#FAF8F5] leading-tight max-w-[20ch]">
                  Where I started, and what keeps me building.
                </h2>
              </FadeUp>
              <FadeUp delay={0.16}>
                <p className="text-[#8E8980] dark:text-[#A8A29E] font-mono text-xs uppercase tracking-wider">
                  BACKGROUND &bull; DISCOVERY &bull; DIRECTION
                </p>
              </FadeUp>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Paragraph 1: Where I started */}
              <FadeUp delay={0.12}>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#161513]/10 dark:border-white/10 hover:border-[#8F5431]/30 transition-colors">
                  <p className="text-[#161513] dark:text-[#F4F1EA] text-base sm:text-lg leading-relaxed max-w-[65ch]">
                    Based in Delhi, I started with a simple curiosity about how digital products are built. Whenever I used mobile apps or websites, I found myself paying attention to why some interfaces felt effortless while others felt confusing and cluttered.
                  </p>
                </div>
              </FadeUp>

              {/* Paragraph 2: What got me into design & how I learned Figma */}
              <FadeUp delay={0.2}>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#161513]/10 dark:border-white/10 hover:border-[#8F5431]/30 transition-colors">
                  <p className="text-[#161513] dark:text-[#F4F1EA] text-base sm:text-lg leading-relaxed max-w-[65ch]">
                    That curiosity naturally drew me into UI/UX design. I taught myself Figma from the ground up by deconstructing existing software, testing layout proportions, and building component systems and interactive prototypes hands-on.
                  </p>
                </div>
              </FadeUp>

              {/* Paragraph 3: What I'm doing now */}
              <FadeUp delay={0.28}>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#161513]/10 dark:border-white/10 hover:border-[#8F5431]/30 transition-colors">
                  <p className="text-[#161513] dark:text-[#F4F1EA] text-base sm:text-lg leading-relaxed max-w-[65ch]">
                    Today, I spend my days designing interface flows, refining typography and spacing, and learning native mobile design patterns. I'm actively looking for my first full-time design role where I can make everyday apps clearer and easier to use.
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. 02 / WHAT I CARE ABOUT SECTION */}
        {/* ========================================================= */}
        <section id="values" className="flex flex-col gap-10 scroll-mt-28">
          <div className="flex flex-col gap-4">
            <FadeUp className="flex items-center gap-4">
              <span className="w-10 h-px bg-[#8F5431]" />
              <span className="text-[#8F5431] dark:text-[#E8AF8B] font-mono text-xs uppercase tracking-widest font-semibold">
                02 / WHAT I CARE ABOUT
              </span>
            </FadeUp>

            <FadeUp delay={0.08} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#161513] dark:text-[#FAF8F5] max-w-[22ch]">
                Principles that guide my work.
              </h2>
              <p className="text-[#5C5852] dark:text-[#A8A29E] font-mono text-xs uppercase tracking-wider max-w-sm">
                CLARITY &bull; EMPATHY &bull; ITERATION
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                num: '01',
                title: 'Clarity over decoration',
                desc: 'Good design gets out of the way. I believe every element on a screen should earn its place by helping the user accomplish what they came to do with minimal effort.',
                icon: Eye,
              },
              {
                num: '02',
                title: 'Empathy for real users',
                desc: 'Designing for people means respecting their time and attention. I look at friction points honestly so the interface feels intuitive, calm, and trustworthy.',
                icon: Heart,
              },
              {
                num: '03',
                title: 'Learning by building',
                desc: 'The best way to understand interface craft is to create and refine. I stay curious by building concepts, testing components, and paying attention to small details.',
                icon: Hammer,
              },
            ].map((value, i) => {
              const IconComp = value.icon;
              return (
                <FadeUp key={i} delay={i * 0.1} className="h-full">
                  <div className="group relative flex flex-col justify-between h-full p-7 sm:p-8 rounded-2xl sm:rounded-[1.75rem] bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#161513]/10 dark:border-white/10 hover:border-[#8F5431]/40 hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md">
                    
                    <div className="flex items-center justify-between pb-5 border-b border-[#161513]/10 dark:border-white/10">
                      <span className="font-mono text-xs font-bold text-[#8F5431] dark:text-[#E8AF8B]">
                        {value.num}
                      </span>
                      <IconComp className="w-5 h-5 text-[#8E8980] dark:text-[#A8A29E] group-hover:text-[#8F5431] transition-colors" />
                    </div>

                    <div className="flex flex-col gap-3 pt-6">
                      <h3 className="font-serif text-2xl font-normal text-[#161513] dark:text-[#FAF8F5] tracking-tight group-hover:text-[#8F5431] dark:group-hover:text-[#E8AF8B] transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-[#5C5852] dark:text-[#A8A29E] text-sm leading-relaxed max-w-[65ch]">
                        {value.desc}
                      </p>
                    </div>

                  </div>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. 03 / SKILLS & TOOLS SECTION (CHIPS ONLY) */}
        {/* ========================================================= */}
        <section id="skills" className="flex flex-col gap-8 scroll-mt-28">
          <FadeUp className="flex items-center gap-4">
            <span className="w-10 h-px bg-[#8F5431]" />
            <span className="text-[#8F5431] dark:text-[#E8AF8B] font-mono text-xs uppercase tracking-widest font-semibold">
              03 / SKILLS & TOOLS
            </span>
          </FadeUp>

          <FadeUp delay={0.08} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#161513] dark:text-[#FAF8F5]">
              Core skills & everyday tools.
            </h2>
          </FadeUp>

          <FadeUp delay={0.16}>
            <div className="p-8 sm:p-10 rounded-2xl sm:rounded-[1.75rem] bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#161513]/10 dark:border-white/10">
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {[
                  'Figma',
                  'FigJam',
                  'Prototyping',
                  'Wireframing',
                  'Secondary Research',
                  'Design Systems (basics)',
                ].map((skill, idx) => (
                  <span
                    key={idx}
                    className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white dark:bg-[#25221C] text-[#161513] dark:text-[#F4F1EA] border border-[#161513]/15 dark:border-white/15 hover:border-[#8F5431] hover:text-[#8F5431] dark:hover:border-[#E8AF8B] dark:hover:text-[#E8AF8B] transition-all duration-200 text-sm font-mono tracking-wide shadow-xs cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8F5431]/40 group-hover:bg-[#8F5431] transition-colors" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ========================================================= */}
        {/* 5. 04 / BEYOND DESIGN SECTION */}
        {/* ========================================================= */}
        <section id="beyond" className="flex flex-col gap-8 scroll-mt-28">
          <FadeUp className="flex items-center gap-4">
            <span className="w-10 h-px bg-[#8F5431]" />
            <span className="text-[#8F5431] dark:text-[#E8AF8B] font-mono text-xs uppercase tracking-widest font-semibold">
              04 / BEYOND DESIGN
            </span>
          </FadeUp>

          <FadeUp delay={0.08}>
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-[1.75rem] border border-[#161513]/10 dark:border-white/10 p-8 sm:p-12 md:p-14 min-h-[380px] sm:min-h-[440px] flex flex-col justify-end shadow-md">
              {/* Background atmospheric image */}
              <img
                src="/forest-mist.jpg"
                alt="Misty pine forest landscape"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />

              {/* Rich gradient overlay for crystal-clear readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#161513]/95 via-[#161513]/70 to-[#161513]/30 md:bg-gradient-to-r md:from-[#161513]/95 md:via-[#161513]/75 md:to-transparent pointer-events-none" />

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E8AF8B]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#E8AF8B] font-semibold">
                    PERSPECTIVE & LIFE OUTSIDE WORK
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight leading-snug">
                  Clarity comes from stepping away from the screen.
                </h3>

                <p className="text-white/85 text-base sm:text-lg leading-relaxed pt-1 max-w-[60ch]">
                  When I am not designing in Figma, I spend time stepping away from the screen to reset. Taking walks, noticing typography and signs around the city, and heading up to the hills whenever I can brings fresh perspective back to my work.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <span className="w-2 h-2 rounded-full bg-[#E8AF8B]" />
                  <span className="font-serif italic text-sm sm:text-base text-[#E8AF8B]">
                    "happiest a little higher up."
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ========================================================= */}
        {/* 6. 05 / CURRENTLY SECTION */}
        {/* ========================================================= */}
        <section id="currently" className="flex flex-col gap-8 scroll-mt-28">
          <FadeUp className="flex items-center gap-4">
            <span className="w-10 h-px bg-[#8F5431]" />
            <span className="text-[#8F5431] dark:text-[#E8AF8B] font-mono text-xs uppercase tracking-widest font-semibold">
              05 / CURRENTLY
            </span>
          </FadeUp>

          <FadeUp delay={0.08}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[1.75rem] bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#161513]/10 dark:border-white/10 p-8 sm:p-12">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#161513]/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8F5431] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8F5431]" />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8F5431] dark:text-[#E8AF8B] font-bold">
                    PRESENT FOCUS & GOALS
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8E8980] dark:text-[#A8A29E] uppercase tracking-wider">
                  ACTIVELY SEEKING OPPORTUNITIES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                
                {/* What I'm Learning */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8F5431]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#8F5431] dark:text-[#E8AF8B] font-semibold">
                      WHAT I'M LEARNING
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-normal text-[#161513] dark:text-[#FAF8F5]">
                    Mobile Guidelines & Interaction Polish
                  </h4>
                  <p className="text-[#5C5852] dark:text-[#A8A29E] text-sm sm:text-base leading-relaxed max-w-[65ch]">
                    I am currently diving deeper into native iOS Human Interface Guidelines, exploring micro-interaction timing, and structuring scalable component sets in Figma.
                  </p>
                </div>

                {/* What Role I'm Looking For */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#8F5431]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#8F5431] dark:text-[#E8AF8B] font-semibold">
                      ROLE I'M LOOKING FOR
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-normal text-[#161513] dark:text-[#FAF8F5]">
                    Junior / Entry-Level Product Design
                  </h4>
                  <p className="text-[#5C5852] dark:text-[#A8A29E] text-sm sm:text-base leading-relaxed max-w-[65ch]">
                    I am actively seeking my first full-time entry-level UI/UX or Product Designer role (in Delhi or remote) where I can help make everyday products clearer and easier to use.
                  </p>
                </div>

              </div>

            </div>
          </FadeUp>
        </section>

        {/* ========================================================= */}
        {/* 7. CLOSING CTA (Download Resume & Contact) */}
        {/* ========================================================= */}
        <FadeUp delay={0.1}>
          <div className="flex flex-col items-center text-center gap-6 py-12 border-t border-[#161513]/10 dark:border-white/10">
            <span className="text-[#8F5431] dark:text-[#E8AF8B] font-mono text-xs uppercase tracking-widest font-semibold">
              NEXT STEPS
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#161513] dark:text-[#FAF8F5] tracking-tight">
              Let's connect and build something together.
            </h3>
            <p className="text-[#5C5852] dark:text-[#A8A29E] text-base sm:text-lg max-w-xl font-light">
              Feel free to download my resume or send a message below.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Magnet strength={12} padding={15}>
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#8F5431] hover:bg-[#6E3D1E] text-white rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-colors shadow-md"
                >
                  <span>DOWNLOAD RESUME</span>
                  <Download className="w-4 h-4" />
                </a>
              </Magnet>

              <Magnet strength={12} padding={15}>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#161513] dark:bg-[#FAF8F5] text-white dark:text-[#161513] hover:bg-[#8F5431] dark:hover:bg-[#8F5431] dark:hover:text-white rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-colors shadow-md cursor-pointer"
                >
                  <span>GET IN TOUCH</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Magnet>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  );
};

export default AboutSection;
