import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import TextReveal from './TextReveal';
import ScrollReveal from './ScrollReveal';


const projectsData = [
  {
    num: '01',
    category: 'Mobile App · UI/UX Design',
    tools: ['UI/UX', 'App Design'],
    name: 'Pet Adoption App',
    desc: 'A warm, intuitive mobile app connecting pet lovers with animals in need. Focused on emotional UI and a seamless adoption flow.',
    image: '/pet-adoption-mockup.png',
    accentLight: 'rgba(124,58,237,0.04)',
    accentDark: 'rgba(124,58,237,0.08)',
  },
  {
    num: '02',
    category: 'Mobile App · UX Research',
    tools: ['UI/UX', 'User Research'],
    name: 'Grocery Delivery App',
    desc: 'A fast, minimal grocery ordering experience designed around speed and ease. Streamlined cart flow with smart suggestions.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    accentLight: 'rgba(5,150,105,0.04)',
    accentDark: 'rgba(5,150,105,0.06)',
  },
];

function useCardTilt() {
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { damping: 30, stiffness: 150 });
  const sRotY = useSpring(rotY, { damping: 30, stiffness: 150 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rotX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
    rotY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
  };
  const handleMouseLeave = () => { rotX.set(0); rotY.set(0); };
  return { sRotX, sRotY, handleMouseMove, handleMouseLeave };
}

const ProjectCard = ({
  project,
  index,
  sectionScrollYProgress,
}: {
  project: typeof projectsData[0];
  index: number;
  sectionScrollYProgress: any;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { sRotX, sRotY, handleMouseMove, handleMouseLeave } = useCardTilt();

  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ['start 90%', 'start 35%'],
  });

  const clipPath = useTransform(
    cardProgress,
    [0, 1],
    ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
  );
  const imgScale = useTransform(cardProgress, [0, 1], [1.12, 1]);

  // Parallax: even cards drift one way, odd the other
  const imageParallaxY = useTransform(
    sectionScrollYProgress,
    [0, 1],
    index % 2 === 0 ? [40, -40] : [20, -70]
  );

  const isFlipped = index % 2 !== 0;

  return (
    <div
      ref={cardRef}
      className={`group cursor-pointer flex flex-col ${isFlipped ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-14 items-center`}
      data-cursor="project"
    >
      {/* ── Image ── */}
      <div className="w-full lg:w-3/5">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
          className="w-full aspect-[4/3] lg:aspect-video rounded-[28px] overflow-hidden relative border border-black/5 dark:border-white/5 group-hover:border-purple-500/30 transition-colors duration-500"
        >
          <motion.div style={{ clipPath, scale: imgScale }} className="w-full h-full">
            <motion.div style={{ y: imageParallaxY }} className="w-full h-full">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="w-full lg:w-2/5 flex flex-col">
        <ScrollReveal delay={0.1} staggerChildren={0.1}>
          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-4 mb-5">
            <span className="text-[#111111]/25 dark:text-white/20 font-mono text-xl font-light transition-colors duration-500">{project.num}</span>
            <div className="h-px w-10 bg-black/10 dark:bg-white/10 transition-colors duration-500" />
            <span className="text-purple-600 dark:text-purple-400 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-500">{project.category}</span>
          </motion.div>

          <motion.h3
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            className="text-[#111111] dark:text-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-5 group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors duration-300"
            style={{ fontFamily: "'Arima', sans-serif" }}
          >
            {project.name}
          </motion.h3>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            className="text-[#686868] dark:text-white/50 text-base leading-relaxed mb-8 max-w-sm font-light transition-colors duration-500"
          >
            {project.desc}
          </motion.p>

          {/* Tags + arrow — stagger last */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="flex items-center justify-between" transition={{ delay: 0.25 }}>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool, ti) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + ti * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-[#686868] dark:text-white/60 text-xs font-medium tracking-wide group-hover:border-purple-500/30 group-hover:text-purple-700 dark:group-hover:text-purple-300 bg-black/5 dark:bg-white/[0.02] transition-colors duration-300"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-11 h-11 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#686868] dark:text-white/50 transition-all duration-500 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 group-hover:scale-110 flex-shrink-0 ml-4"
            >
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
            </motion.div>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <motion.section
      ref={sectionRef}
      id="work"
      className="bg-[#06000c] transition-colors duration-500 py-32 relative z-20 border-t border-white/5"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* Header */}
        <div className="mb-20">
          <TextReveal
            as="h2"
            className="text-[#111111] dark:text-white font-bold text-3xl md:text-4xl lg:text-5xl transition-colors duration-500"
            style={{ fontFamily: "'Arima', sans-serif" }}
            delay={0.1} stagger={0.06}
          >
            Featured Projects
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#686868] dark:text-white/40 text-sm mt-3 transition-colors duration-500"
          >
            A selection of recent UI/UX design work.
          </motion.p>
        </div>

        {/* Alternating split-screen cards */}
        <div className="flex flex-col gap-28 md:gap-36">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              sectionScrollYProgress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </motion.section>
  );
};

export default ProjectsSection;
