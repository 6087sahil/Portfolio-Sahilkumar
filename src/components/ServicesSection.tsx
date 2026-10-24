import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const services = [
  {
    num: '01',
    title: 'UI/UX Design',
    desc: 'Crafting intuitive, human-centered interfaces that solve real problems — from field research through pixel-perfect auto-layout delivery.',
    tags: ['Figma', 'Prototyping', 'Design Systems', 'iOS HIG'],
  },
  {
    num: '02',
    title: 'Web & Product Design',
    desc: 'Designing responsive, performance-focused digital products with rigorous typography, content hierarchy, and deliberate spacing.',
    tags: ['Information Architecture', 'Responsive', 'Typography'],
  },
  {
    num: '03',
    title: 'User Research & Discovery',
    desc: 'Conducting in-depth interviews, affinity mapping, and usability audits to uncover why users hesitate and where products break down.',
    tags: ['User Interviews', 'Usability Audits', 'Journey Mapping'],
  },
  {
    num: '04',
    title: 'Interaction & Motion',
    desc: 'Bringing interfaces to life with purposeful, restrained micro-interactions that communicate state without distracting the user.',
    tags: ['Framer Motion', 'Micro-Interactions', 'Prototyping'],
  },
];

const ServicesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Raw translate motion value + spring-damped momentum for 60fps physics
  const x = useMotionValue(0);
  const springX = useSpring(x, {
    damping: 38,
    stiffness: 220,
    mass: 0.8,
  });

  // Calculate maximum negative horizontal displacement based on track & container width
  const updateConstraints = () => {
    if (trackRef.current && containerRef.current) {
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = containerRef.current.offsetWidth;
      const padding = window.innerWidth >= 1024 ? 96 : window.innerWidth >= 768 ? 64 : 24;
      const overflow = Math.max(0, trackWidth - viewportWidth + padding);
      setMaxScroll(-overflow);
      
      // Clamp current position if resize made it exceed boundaries
      if (x.get() < -overflow) {
        x.set(-overflow);
      }
    }
  };

  useEffect(() => {
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  // Mouse wheel & trackpad horizontal navigation handler
  const handleWheel = (e: React.WheelEvent) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const delta = isHorizontal ? e.deltaX : e.deltaY;

    const currentX = x.get();
    const newX = currentX - delta * 1.15;
    const clampedX = Math.max(maxScroll, Math.min(0, newX));

    if ((delta > 0 && currentX > maxScroll) || (delta < 0 && currentX < 0)) {
      x.set(clampedX);
    }
  };

  return (
    <section
      id="services"
      ref={containerRef}
      onWheel={handleWheel}
      className="relative bg-[#EDE8DE] text-[#161513] py-24 sm:py-28 md:py-36 overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#8F5431]/4 blur-[140px] rounded-full pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-12 md:mb-16 flex items-end justify-between flex-wrap gap-6">
        <div>
          <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider mb-3 block">
            02 / Capabilities &amp; Services
          </span>

          <div className="flex flex-col">
            <h2 className="font-serif text-[#161513] text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.05]">
              Capabilities{' '}
              <span className="italic text-[#8F5431] font-serif">
                &amp; Expertise.
              </span>
            </h2>
          </div>
        </div>

        {/* Scroll & Drag Hint with Visual Indicator */}
        <div className="hidden md:flex items-center gap-2 text-[#5C5852] font-mono text-xs uppercase tracking-wider bg-[#FAF8F5] px-4 py-2 rounded-full border border-[#161513]/15 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8F5431] animate-pulse" />
          <span>Scroll or drag to explore &bull;</span>
        </div>
      </div>

      {/* Cursor-Controlled Draggable Track */}
      <div
        className={`relative z-10 w-full overflow-hidden pl-6 md:pl-16 lg:pl-24 py-8 -my-8 hide-scrollbar ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <motion.div
          ref={trackRef}
          drag={shouldReduceMotion ? false : 'x'}
          dragConstraints={{ left: maxScroll, right: 0 }}
          dragElastic={0.12}
          dragMomentum={true}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 28, power: 0.25, timeConstant: 250 }}
          style={{ x: shouldReduceMotion ? x : springX }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className="flex gap-6 sm:gap-8 items-stretch will-change-transform pr-12 md:pr-24"
        >
          {services.map((item) => (
            <motion.div
              key={item.num}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-[82vw] sm:w-[58vw] md:w-[42vw] lg:w-[32vw] flex-shrink-0 p-8 sm:p-10 md:p-11 rounded-3xl bg-[#FAF8F5] border border-[#161513]/15 flex flex-col justify-between shadow-[0_12px_36px_-6px_rgba(110,61,30,0.16),0_4px_16px_-2px_rgba(156,102,68,0.08)] hover:shadow-[0_24px_50px_-6px_rgba(110,61,30,0.24),0_8px_22px_-2px_rgba(156,102,68,0.14)] hover:border-[#8F5431]/40 transition-shadow duration-500 select-none group"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#161513]/10 mb-6">
                  <span className="font-mono text-sm text-[#8F5431] font-bold group-hover:scale-110 transition-transform origin-left">
                    {item.num}
                  </span>
                  <span className="text-[11px] font-mono text-[#8E8980] uppercase tracking-wider">
                    Service Offering
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#161513] font-normal tracking-tight mb-4 group-hover:text-[#8F5431] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-[#5C5852] font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-8 mt-6 border-t border-[#161513]/10">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-[#E5DFD4] text-[#5C5852] font-mono text-[10px] group-hover:border group-hover:border-[#8F5431]/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
