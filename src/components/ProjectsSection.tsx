import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Project Type & Data ────────────────────────────────── */
interface Project {
  num: string;
  category: string;
  name: string;
  role: string;
  timeline: string;
  desc: string;
  metrics: { label: string; value: string }[];
  tools: string[];
  image: string;
  video?: string;
  link: string;
  ctaText?: string;
  accent: string;
}

const PROJECTS: Project[] = [
  {
    num: '01',
    category: 'Mobile App — UI/UX Design & Research',
    name: 'Roomly',
    role: 'Lead Product Designer',
    timeline: '8 Weeks · 2026',
    desc: 'Re-architecting urban apartment discovery around roommate lifestyle compatibility rather than just square footage and broker listings.',
    metrics: [
      { label: 'Task Success Rate', value: '94%' },
      { label: 'Discovery Speed', value: '3.2×' },
      { label: 'Screen Architecture', value: '24+ UI Screens' },
    ],
    tools: ['UI/UX', 'User Research', 'Design Systems', 'iOS HIG', 'Figma'],
    image: '/roomly/home_screen.png',
    video: '/Mockup-1791278724467.mp4',
    link: '/case-study/roomly',
    accent: '#8F5431',
  },
  {
    num: '02',
    category: 'Mobile App — UI/UX Design & Quick-Commerce',
    name: 'Grocery Delivery App',
    role: 'Lead UX/UI Designer',
    timeline: '6 Weeks · 2026',
    desc: 'A rapid, minimal grocery ordering experience designed around speed and ease. Streamlined cart architecture with smart recommendations and fresh produce categorization.',
    metrics: [
      { label: 'Checkout Duration', value: '45s' },
      { label: 'Cart Drop-off', value: '-38%' },
      { label: 'Order Satisfaction', value: '4.9/5' },
    ],
    tools: ['UI/UX', 'User Research', 'Cart Architecture', 'Design Systems', 'Figma'],
    image: '/grocery-mockup.jpg',
    link: '#contact',
    ctaText: 'Request Walkthrough',
    accent: '#8F5431',
  },
];

/* ── Interactive 3D Card Tilt Hook ───────────────────────── */
function useCardTilt(shouldReduceMotion: boolean | null) {
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 25, stiffness: 180 });
  const sRotY = useSpring(rotY, { damping: 25, stiffness: 180 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    rotX.set(-yPct * 6);
    rotY.set(xPct * 6);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return { sRotX, sRotY, handleMouseMove, handleMouseLeave };
}

/* ── Individual Project Showcase Card (Editorial Staggered Split) ── */
const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { sRotX, sRotY, handleMouseMove, handleMouseLeave } = useCardTilt(shouldReduceMotion);
  const isEven = index % 2 === 0;

  // Scroll Parallax for Card & Mockup Container
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Smooth subtle media parallax (moves gently opposite/slower for depth)
  const mediaParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [24, -24]
  );

  // Subtle image zoom reveal on scroll through viewport
  const mediaInnerScale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    shouldReduceMotion ? [1, 1, 1] : [1.08, 1, 1.04]
  );

  // Stagger animation container variants
  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50, scale: shouldReduceMotion ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="group relative rounded-[2.5rem] p-8 sm:p-12 md:p-14 lg:p-16 bg-[#FAF8F5] border border-[#161513]/12 shadow-[0_16px_40px_-8px_rgba(110,61,30,0.14),0_4px_16px_-2px_rgba(22,21,19,0.06)] hover:shadow-[0_28px_60px_-10px_rgba(110,61,30,0.22),0_10px_26px_-4px_rgba(156,102,68,0.14)] hover:border-[#8F5431]/35 transition-all duration-700 will-change-transform"
    >
      {/* Decorative Index Watermark in Background - Kept faint & non-overlapping */}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="absolute top-6 right-8 sm:right-12 font-serif text-7xl sm:text-8xl md:text-9xl select-none pointer-events-none transition-all duration-700 group-hover:scale-105 z-0 text-black/[0.04] dark:text-white/[0.05] group-hover:text-black/[0.08] dark:group-hover:text-white/[0.09]"
      >
        {project.num}
      </motion.span>

      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center relative z-10`}>
        
        {/* ── Content Column (46%) with Staggered Scroll Storytelling ── */}
        <motion.div
          variants={contentContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="w-full lg:w-[46%] flex flex-col gap-6 lg:order-none order-2"
        >
          {/* Header Tag / Badge */}
          <motion.div variants={itemFadeUp} className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold tracking-widest text-[#8F5431] px-2.5 py-0.5 rounded-full bg-[#8F5431]/10 border border-[#8F5431]/20">
              CASE {project.num}
            </span>
            <div className="h-px w-6 bg-[#161513]/15" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8980]">
              {project.category}
            </span>
          </motion.div>

          {/* Title & Metadata */}
          <motion.div variants={itemFadeUp}>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161513] font-normal tracking-tight leading-[1.08] transition-colors duration-300 group-hover:text-[#8F5431]">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[#8E8980]">
              <span>{project.role}</span>
              <span>&bull;</span>
              <span>{project.timeline}</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p variants={itemFadeUp} className="text-[#5C5852] font-light leading-relaxed text-sm sm:text-base">
            {project.desc}
          </motion.p>

          {/* Key Metrics Strip with Hover Lift */}
          <motion.div variants={itemFadeUp} className="grid grid-cols-3 gap-3 py-4 border-y border-[#161513]/10">
            {project.metrics.map((m, i) => (
              <div key={i} className="flex flex-col group/metric">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#161513] group-hover/metric:text-[#8F5431] transition-colors">
                  {m.value}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] mt-0.5">
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Tool Chips */}
          <motion.div variants={itemFadeUp} className="flex flex-wrap gap-2 pt-1">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 rounded-full text-xs font-mono border border-[#161513]/10 text-[#5C5852] bg-[#EDE8DE]/60 transition-all duration-300 hover:border-[#8F5431]/40 hover:text-[#8F5431] hover:bg-white"
              >
                {tool}
              </span>
            ))}
          </motion.div>

          {/* Interactive CTA Button */}
          <motion.div variants={itemFadeUp} className="pt-3">
            {project.link.startsWith('#') ? (
              <a
                href={project.link}
                data-cursor="Contact"
                className="group/btn inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#161513] text-white hover:bg-[#8F5431] transition-all duration-300 font-mono text-xs uppercase tracking-wider font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <span>{project.ctaText || 'Explore Case Study'}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover/btn:bg-white text-white group-hover/btn:text-[#8F5431] flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover/btn:rotate-0" />
                </div>
              </a>
            ) : (
              <Link
                to={project.link}
                data-cursor="View"
                className="group/btn inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#161513] text-white hover:bg-[#8F5431] transition-all duration-300 font-mono text-xs uppercase tracking-wider font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <span>{project.ctaText || 'Explore Case Study'}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover/btn:bg-white text-white group-hover/btn:text-[#8F5431] flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover/btn:rotate-0" />
                </div>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* ── Media Column (54%) with Cinematic Reveal + Parallax + 3D Tilt ── */}
        <div className="w-full lg:w-[54%] lg:order-none order-1">
          <motion.div
            ref={mediaRef}
            style={{ y: mediaParallaxY }}
            className="transition-transform duration-100 ease-out will-change-transform"
          >
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: sRotX,
                rotateY: sRotY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full rounded-[2rem] overflow-hidden border border-[#161513]/15 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-[#8F5431]/40"
            >
              {/* Cinematic Overflow Mask Container */}
              <div className="w-full aspect-[16/10] bg-[#161513] overflow-hidden relative group/media">
                {/* Smooth Image/Video Reveal Layer with Scale */}
                <motion.div
                  style={{ scale: mediaInnerScale }}
                  className="w-full h-full will-change-transform"
                >
                  {project.video ? (
                    <video
                      src={project.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.04]"
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.04]"
                    />
                  )}
                </motion.div>

                {/* Soft ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#161513]/45 via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161513]/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#8F5431]" />
                    {project.video ? 'Interactive Prototype' : 'High-Fi Showcase'}
                  </span>
                </div>

                {/* Bottom Interactive Hover Indicator */}
                <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-0 group-hover/media:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#161513] text-[10px] font-mono uppercase tracking-wider font-semibold shadow-md">
                    <Eye className="w-3 h-3 text-[#8F5431]" />
                    Click to Open
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

/* ── Main Projects Section ──────────────────────────────── */
const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Heading Animation Variants
  const headingContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const labelVariant = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const titleVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const descVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-[#F4F1EA] text-[#161513] py-28 md:py-36 border-t border-[#161513]/10 overflow-hidden"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#8F5431]/4 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-[#8F5431]/4 blur-[130px] rounded-full pointer-events-none" />

      {/* Header Container with Staggered Scroll Animations */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-16 md:mb-20">
        <motion.div
          variants={headingContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-start"
        >
          {/* 1. Label: Subtle fade-in and horizontal slide */}
          <motion.div variants={labelVariant} className="flex items-center gap-3 mb-3">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-8 h-px bg-[#8F5431] origin-left"
            />
            <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider font-semibold">
              01 / SELECTED WORK
            </span>
          </motion.div>

          {/* 2. Heading: Staggered text reveal with natural easing */}
          <motion.h2
            variants={titleVariant}
            className="font-serif text-[#161513] text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.05]"
          >
            Featured{' '}
            <span className="italic text-[#8F5431] font-serif">
              Projects.
            </span>
          </motion.h2>

          {/* 3. Description: Smooth fade-up */}
          <motion.p
            variants={descVariant}
            className="mt-4 text-[#5C5852] text-base md:text-lg max-w-[620px] leading-relaxed font-light"
          >
            A curated selection of end-to-end design case studies exploring mobile workflows, user psychology, and systems.
          </motion.p>
        </motion.div>
      </div>

      {/* Projects Cards List with Independent Viewport Triggers */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col gap-14 md:gap-24 relative z-10">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
