import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Project Data ─────────────────────────────────────────────────── */

interface ProjectItem {
  id: string;
  num: string;
  category: string;
  title: string;
  subtitle: string;
  role: string;
  year: string;
  description: string;
  metrics: { label: string; value: string }[];
  deliverables: string[];
  link: string;
  ctaText: string;
  image: string;
  video?: string;
  badge: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'roomly',
    num: '01',
    category: 'Mobile Application · Product Architecture',
    title: 'Roomly',
    subtitle: 'The Co-Living Interface',
    role: 'Lead Product Designer',
    year: '2026',
    description:
      'Re-architecting urban apartment discovery around roommate lifestyle compatibility rather than just square footage and broker listings. Built from first-principles user research into an end-to-end iOS application architecture.',
    metrics: [
      { label: 'Task Success Rate', value: '94%' },
      { label: 'Discovery Velocity', value: '3.2×' },
      { label: 'System Deliverables', value: '24+ Screens' },
    ],
    deliverables: ['Product Strategy', 'User Research', 'Design Systems', 'iOS HIG'],
    link: '/case-study/roomly',
    ctaText: 'Explore Case Study',
    image: '/roomly/home_screen.png',
    video: '/Mockup-1791278724467.mp4',
    badge: 'Interactive Prototype',
  },
  {
    id: 'grocery',
    num: '02',
    category: 'Quick-Commerce · Cart Architecture',
    title: 'Grocery',
    subtitle: 'High-Velocity Ordering',
    role: 'Lead UX/UI Designer',
    year: '2026',
    description:
      'A stripped-down, ultra-rapid grocery commerce experience designed around cognitive friction reduction. Streamlined checkout architecture with predictive re-orders and tactile fresh-produce taxonomy.',
    metrics: [
      { label: 'Checkout Duration', value: '45s' },
      { label: 'Cart Drop-Off', value: '−38%' },
      { label: 'Order Rating', value: '4.9 / 5' },
    ],
    deliverables: ['Cart Architecture', 'Interaction Design', 'Micro-interactions', 'Design Systems'],
    link: '#contact',
    ctaText: 'Request Walkthrough',
    image: '/grocery-mockup.jpg',
    badge: 'Checkout Architecture',
  },
  {
    id: 'pet-adoption',
    num: '03',
    category: 'Community Platform · Behavioral Match',
    title: 'Pet Adoption',
    subtitle: 'Empathy-Led Rescue Workflow',
    role: 'Product Designer',
    year: '2025',
    description:
      'An empathy-driven adoption ecosystem bridging municipal shelters with prospective adopters through lifestyle-aligned animal behavioral logs, medical transparency, and progressive verification tracks.',
    metrics: [
      { label: 'Inquiry Growth', value: '+52%' },
      { label: 'Match Confidence', value: '91%' },
      { label: 'Time-to-Placement', value: '4 Days' },
    ],
    deliverables: ['Service Blueprint', 'Interface Design', 'Editorial Direction', 'Design Systems'],
    link: '/case-study/roomly',
    ctaText: 'Explore Project',
    image: '/pet-adoption-mockup.png',
    badge: 'Emotional UI & Match Flow',
  },
];

/* ── Individual Editorial Project Item (Full Image Showcase) ──────── */

const EditorialProjectRow: React.FC<{ project: ProjectItem; index: number }> = ({
  project,
  index,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  // Subtle image parallax on scroll
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  const imageParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [18, -18]
  );

  return (
    <article
      ref={rowRef}
      className="relative w-full border-b border-[#161513]/10 dark:border-white/10 py-16 sm:py-24 lg:py-32 group"
    >
      {/* ── Section Index Bar / Metadata Header ── */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6 sm:pb-8 border-b border-[#161513]/10 dark:border-white/10 font-mono text-[11px] uppercase tracking-[0.22em] text-[#8E8980] dark:text-[#A09A90]">
        <div className="flex items-center gap-3">
          <span className="text-[#161513] dark:text-[#F4F1EA] font-bold">
            N° {project.num}
          </span>
          <span className="text-[#161513]/25 dark:text-white/20">/</span>
          <span>{project.category}</span>
        </div>
        <div className="flex items-center gap-6">
          <span>{project.role}</span>
          <span className="text-[#161513]/25 dark:text-white/20">·</span>
          <span>{project.year}</span>
        </div>
      </div>

      {/* ── Asymmetric Editorial Split Composition ── */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-10 lg:pt-14 items-center ${
          isEven ? '' : 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
        }`}
      >
        {/* ── Left Editorial Column: Oversized Typography & Dossier ── */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div>
            {/* Oversized Serif Title */}
            <motion.h3
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal text-[#161513] dark:text-[#F4F1EA] tracking-tight leading-[0.98] select-none"
            >
              {project.title}
              <span className="italic font-serif text-[#8F5431] dark:text-[#C58B65] ml-2">
                .
              </span>
            </motion.h3>

            {/* Editorial Subtitle */}
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8F5431] dark:text-[#C58B65] mt-4">
              [ {project.subtitle} ]
            </p>

            {/* Project Narrative */}
            <p className="mt-6 text-[#5C5852] dark:text-[#B8AFA4] font-light text-sm sm:text-[15px] leading-relaxed max-w-md">
              {project.description}
            </p>

            {/* Metrics Dossier */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#161513]/10 dark:border-white/10">
              {project.metrics.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-serif text-2xl sm:text-3xl text-[#161513] dark:text-[#F4F1EA] font-normal tracking-tight">
                    {m.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8E8980] dark:text-[#A09A90] mt-1 leading-snug">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Deliverables Taxonomy */}
            <div className="flex flex-wrap gap-2 pt-6">
              {project.deliverables.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-[#5C5852] dark:text-[#B8AFA4] border border-[#161513]/10 dark:border-white/15 bg-[#FAF8F5] dark:bg-white/[0.03]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Understated Editorial Link */}
          <div className="pt-10 sm:pt-14">
            {project.link.startsWith('#') ? (
              <a
                href={project.link}
                className="group/cta inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-[#161513] dark:text-[#F4F1EA] hover:text-[#8F5431] dark:hover:text-[#C58B65] transition-colors duration-300 pb-1 border-b border-[#161513]/30 dark:border-white/30 hover:border-[#8F5431] dark:hover:border-[#C58B65]"
              >
                <span>{project.ctaText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </a>
            ) : (
              <Link
                to={project.link}
                className="group/cta inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-[#161513] dark:text-[#F4F1EA] hover:text-[#8F5431] dark:hover:text-[#C58B65] transition-colors duration-300 pb-1 border-b border-[#161513]/30 dark:border-white/30 hover:border-[#8F5431] dark:hover:border-[#C58B65]"
              >
                <span>{project.ctaText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* ── Right Editorial Column: Full Image / Video Showcase (No mobile frame) ── */}
        <div className="lg:col-span-7 relative w-full">
          <motion.div
            ref={mediaRef}
            style={{ y: imageParallaxY }}
            className="group/media relative w-full aspect-[16/10.5] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#161513]/10 dark:border-white/10 bg-[#FAF8F5] dark:bg-[#181614] shadow-[0_16px_45px_-12px_rgba(22,21,19,0.08)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] transition-all duration-500 hover:shadow-2xl hover:border-[#8F5431]/35 dark:hover:border-[#C58B65]/40"
          >
            {project.link.startsWith('#') ? (
              <a href={project.link} className="block w-full h-full relative overflow-hidden">
                {project.video ? (
                  <video
                    src={project.video}
                    poster={project.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.025]"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.025]"
                  />
                )}

                {/* Soft Ambient Depth Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 dark:bg-[#161513]/85 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider border border-white/20 shadow-md">
                    <Sparkles className="w-3 h-3 text-[#8F5431] dark:text-[#C58B65]" />
                    {project.badge}
                  </span>
                </div>

                {/* Bottom View Indicator */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20 pointer-events-none opacity-0 group-hover/media:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#161513] text-[10px] font-mono uppercase tracking-wider font-semibold shadow-lg">
                    <span>Explore Project</span>
                    <ArrowUpRight className="w-3 h-3 text-[#8F5431]" />
                  </span>
                </div>
              </a>
            ) : (
              <Link to={project.link} className="block w-full h-full relative overflow-hidden">
                {project.video ? (
                  <video
                    src={project.video}
                    poster={project.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.025]"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.025]"
                  />
                )}

                {/* Soft Ambient Depth Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 dark:bg-[#161513]/85 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider border border-white/20 shadow-md">
                    <Sparkles className="w-3 h-3 text-[#8F5431] dark:text-[#C58B65]" />
                    {project.badge}
                  </span>
                </div>

                {/* Bottom View Indicator */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20 pointer-events-none opacity-0 group-hover/media:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#161513] text-[10px] font-mono uppercase tracking-wider font-semibold shadow-lg">
                    <span>Explore Project</span>
                    <ArrowUpRight className="w-3 h-3 text-[#8F5431]" />
                  </span>
                </div>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </article>
  );
};

/* ── Main Selected Work Section Component ─────────────────────────── */

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="work"
      data-section="projects"
      className="relative w-full bg-[#F4F1EA] dark:bg-[#121110] text-[#161513] dark:text-[#F4F1EA] py-24 sm:py-32 lg:py-40 border-t border-[#161513]/10 dark:border-white/10 overflow-hidden transition-colors duration-500"
    >
      {/* Subtle Background Glows matching portfolio identity */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#8F5431]/4 dark:bg-[#C58B65]/4 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#8F5431]/4 dark:bg-[#C58B65]/4 blur-[140px] rounded-full pointer-events-none" />

      {/* ── Section Container ── */}
      <div className="max-w-[1536px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20 relative z-10">
        
        {/* ── Section Header: Editorial Architecture ── */}
        <header className="pb-14 sm:pb-18 border-b border-[#161513]/10 dark:border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            
            {/* Left: Oversized Typography Header */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-[#8F5431] dark:text-[#C58B65] mb-5">
                <span className="w-6 h-px bg-[#8F5431] dark:bg-[#C58B65]" />
                <span>INDEX / 2024 — 2026</span>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal text-[#161513] dark:text-[#F4F1EA] tracking-tight leading-[0.95] select-none"
              >
                Selected{' '}
                <span className="italic font-serif font-normal text-[#8F5431] dark:text-[#C58B65]">
                  Work
                </span>
                <span>.</span>
              </motion.h2>
            </div>

            {/* Right: Curator Dossier & Introduction */}
            <div className="max-w-md lg:pb-2">
              <p className="text-sm sm:text-[15px] font-light leading-relaxed text-[#5C5852] dark:text-[#B8AFA4]">
                A rigorous archive of mobile interface systems, interaction psychology, and rapid digital product architectures engineered for scale.
              </p>
              <div className="mt-5 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8E8980] dark:text-[#A09A90]">
                <span>03 Curated Releases</span>
                <span className="text-[#161513]/25 dark:text-white/20">|</span>
                <span>End-to-End iOS &amp; Web</span>
              </div>
            </div>

          </div>
        </header>

        {/* ── Editorial Project Rows ── */}
        <div className="flex flex-col">
          {PROJECTS.map((project, index) => (
            <EditorialProjectRow
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;