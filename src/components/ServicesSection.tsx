import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  const outerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress → horizontal translate of card track
  const x = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '-65%']);

  return (
    <div
      ref={outerRef}
      id="services"
      className="relative bg-[#EDE8DE] text-[#161513] border-t border-[#161513]/10"
      style={{ height: '350vh' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header row */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-10 flex items-end justify-between">
          <div>
            <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider mb-3 block">
              02 / Capabilities &amp; Services
            </span>

            <div className="flex flex-col">
              <h2 className="font-serif text-[#161513] text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.05]">
                Capabilities{' '}
                <span className="italic text-[#D82E54] font-serif">
                  &amp; Expertise.
                </span>
              </h2>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="hidden md:flex items-center gap-2 text-[#5C5852] font-mono text-xs uppercase tracking-wider bg-[#FAF8F5] px-4 py-2 rounded-full border border-[#161513]/15">
            <span>Scroll to explore &bull;</span>
          </div>
        </div>

        {/* Horizontal scroll track */}
        <div className="relative z-10 w-full overflow-visible pl-6 md:pl-16 lg:pl-24">
          <motion.div
            style={{ x }}
            className="flex gap-6 items-stretch"
          >
            {services.map((item) => (
              <div
                key={item.num}
                className="w-[82vw] sm:w-[60vw] md:w-[42vw] lg:w-[32vw] flex-shrink-0 p-8 sm:p-10 rounded-3xl bg-[#FAF8F5] border border-[#161513]/15 flex flex-col justify-between shadow-[0_12px_36px_-6px_rgba(110,61,30,0.18),0_4px_16px_-2px_rgba(156,102,68,0.10)] hover:shadow-[0_20px_45px_-6px_rgba(110,61,30,0.26),0_6px_20px_-2px_rgba(156,102,68,0.16)] hover:border-[#9c6644]/40 hover:-translate-y-1 transition-all duration-500 select-none"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-[#161513]/10 mb-6">
                    <span className="font-mono text-sm text-[#D82E54] font-bold">
                      {item.num}
                    </span>
                    <span className="text-[11px] font-mono text-[#8E8980] uppercase tracking-wider">
                      Service Offering
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#161513] font-normal tracking-tight mb-4">
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
                      className="px-2.5 py-1 rounded-full bg-[#E5DFD4] text-[#5C5852] font-mono text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ServicesSection;
