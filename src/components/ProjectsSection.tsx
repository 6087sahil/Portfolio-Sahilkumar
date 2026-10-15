import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    accent: '#9333EA',
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
    accent: '#10B981',
  },
];

/* ── 3D Card Tilt Hook ──────────────────────────────────── */
function useCardTilt() {
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 25, stiffness: 160 });
  const sRotY = useSpring(rotY, { damping: 25, stiffness: 160 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    rotX.set(-yPct * 8);
    rotY.set(xPct * 8);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return { sRotX, sRotY, handleMouseMove, handleMouseLeave };
}

/* ── Individual Project Showcase Card ───────────────────── */
const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { sRotX, sRotY, handleMouseMove, handleMouseLeave } = useCardTilt();
  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-3xl p-7 sm:p-10 md:p-12 lg:p-14 bg-[#FAF8F5] border border-[#161513]/15 shadow-[0_12px_36px_-6px_rgba(147,51,234,0.18),0_4px_16px_-2px_rgba(168,85,247,0.10)] transition-all duration-500 hover:border-purple-400/40 hover:shadow-[0_24px_50px_-6px_rgba(147,51,234,0.26),0_6px_20px_-2px_rgba(168,85,247,0.16)]`}
    >
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-14 items-center`}>
        
        {/* ── Content Column (45%) ── */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6 lg:order-none order-2">
          
          {/* Header Metadata */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold tracking-widest text-[#D82E54]">
              {project.num}
            </span>
            <div className="h-px w-8 bg-[#161513]/15" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8980]">
              {project.category}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#161513] font-normal tracking-tight leading-[1.06]">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[#8E8980]">
              <span>{project.role}</span>
              <span>&bull;</span>
              <span>{project.timeline}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#5C5852] font-light leading-relaxed text-sm sm:text-base">
            {project.desc}
          </p>

          {/* Key Metrics / Highlights Strip */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#161513]/10">
            {project.metrics.map((m, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#161513]">
                  {m.value}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] mt-0.5">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tool Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 rounded-full text-xs font-mono border border-[#161513]/10 text-[#5C5852] bg-[#EDE8DE]/70 transition-colors group-hover:border-[#D82E54]/30 group-hover:text-[#D82E54]"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Interactive CTA Button */}
          <div className="pt-2">
            {project.link.startsWith('#') ? (
              <a
                href={project.link}
                className="group/btn inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#161513] text-white hover:bg-[#D82E54] transition-all duration-300 font-mono text-xs uppercase tracking-wider font-semibold shadow-sm hover:-translate-y-0.5"
              >
                <span>{project.ctaText || 'Explore Case Study'}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover/btn:bg-white text-white group-hover/btn:text-[#D82E54] flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover/btn:rotate-0" />
                </div>
              </a>
            ) : (
              <Link
                to={project.link}
                className="group/btn inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#161513] text-white hover:bg-[#D82E54] transition-all duration-300 font-mono text-xs uppercase tracking-wider font-semibold shadow-sm hover:-translate-y-0.5"
              >
                <span>{project.ctaText || 'Explore Case Study'}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover/btn:bg-white text-white group-hover/btn:text-[#D82E54] flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover/btn:rotate-0" />
                </div>
              </Link>
            )}
          </div>

        </div>

        {/* ── Media Column (55%) with 3D Tilt ── */}
        <div className="w-full lg:w-[55%] lg:order-none order-1">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX: sRotX,
              rotateY: sRotY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full rounded-2xl overflow-hidden border border-[#161513]/15 shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#D82E54]/40"
          >
            <div className="w-full aspect-[16/10] bg-[#161513] overflow-hidden relative">
              {project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}

              {/* Status Badge overlay */}
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161513]/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D82E54]" />
                  {project.video ? 'Interactive Prototype' : 'High-Fi Showcase'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

/* ── Main Projects Section ──────────────────────────────── */
const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="relative bg-[#F4F1EA] text-[#161513] py-28 md:py-36 border-t border-[#161513]/10">
      
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-16 md:mb-20">
        <div className="flex flex-col items-start">
          
          <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider mb-3 block">
            01 / Selected Work
          </span>

          <h2 className="font-serif text-[#161513] text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.05]">
            Featured{' '}
            <span className="italic text-[#D82E54] font-serif">
              Projects.
            </span>
          </h2>

          <p className="mt-4 text-[#5C5852] text-base md:text-lg max-w-[600px] leading-relaxed font-light">
            A curated selection of end-to-end design case studies exploring mobile workflows, user psychology, and systems.
          </p>

        </div>
      </div>

      {/* Projects Cards List */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col gap-14 md:gap-20">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>

    </section>
  );
};

export default ProjectsSection;
