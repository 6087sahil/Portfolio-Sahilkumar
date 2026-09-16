import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FolderGit2, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useTheme } from './ThemeProvider';

const projectsData = [
  {
    num: "01",
    category: "Mobile App · UI/UX Design",
    tools: ["UI/UX", "App Design"],
    name: "Pet Adoption App",
    desc: "A warm, intuitive mobile app connecting pet lovers with animals in need. Focused on emotional UI and a seamless adoption flow.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "02",
    category: "Mobile App · UX Research",
    tools: ["UI/UX", "User Research"],
    name: "Grocery Delivery App",
    desc: "A fast, minimal grocery ordering experience designed around speed and ease. Streamlined cart flow with smart suggestions.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
  },
];

const ProjectCard = ({ project, index, scrollYProgress }: any) => {
  const { theme } = useTheme();

  // Parallax for the project image
  const yOffset = index % 2 === 0 ? [50, -50] : [20, -80];
  const imageY = useTransform(scrollYProgress, [0, 1], yOffset);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 1.05]);

  const darkShadows = [
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)", 
    "0 10px 30px rgba(0,0,0,0.4), 0 0 50px rgba(168,85,247,0.12)", 
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)"
  ];
  
  const lightShadows = [
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.02)", 
    "0 10px 30px rgba(0,0,0,0.05), 0 0 50px rgba(168,85,247,0.08)", 
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.02)"
  ];

  return (
    <ScrollReveal delay={0.2} duration={1.2}>
      <div className={`group cursor-pointer flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}>
        
        {/* Image Side */}
        <div className="w-full lg:w-3/5">
          <motion.div 
            animate={{ 
              boxShadow: theme === 'dark' ? darkShadows : lightShadows
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full aspect-[4/3] lg:aspect-[16/10] rounded-[32px] overflow-hidden bg-black/5 dark:bg-[#0f0420] border border-black/5 dark:border-white/5 relative transition-colors duration-500 group-hover:border-purple-500/30 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div style={{ y: imageY, scale: imageScale }} className="w-full h-full relative">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        </div>

        {/* Content Side */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <ScrollReveal delay={0.3} staggerChildren={0.1}>
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-4 mb-6">
              <span className="text-[#111111]/30 dark:text-white/20 font-mono text-xl sm:text-2xl font-light transition-colors duration-500">{project.num}</span>
              <div className="h-px w-12 bg-black/10 dark:bg-white/10 transition-colors duration-500" />
              <span className="text-purple-600 dark:text-purple-400 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500">{project.category}</span>
            </motion.div>
            
            <motion.h3 variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="text-[#111111] dark:text-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors duration-300" style={{ fontFamily: "'Arima', sans-serif" }}>
              {project.name}
            </motion.h3>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="text-[#686868] dark:text-white/50 text-base sm:text-lg leading-relaxed mb-10 max-w-md font-light transition-colors duration-500">
              {project.desc}
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {project.tools.map((tool: string) => (
                  <span key={tool} className="px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-[#686868] dark:text-white/60 text-xs font-medium tracking-wide transition-colors duration-300 group-hover:border-purple-500/30 group-hover:text-purple-700 dark:group-hover:text-purple-300 group-hover:bg-purple-50 dark:group-hover:bg-transparent bg-black/5 dark:bg-white/[0.02]">
                    {tool}
                  </span>
                ))}
              </div>
              <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[#686868] dark:text-white/50 transition-all duration-500 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 group-hover:scale-110 flex-shrink-0 ml-4">
                <ArrowRight className="w-5 h-5 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
              </div>
            </motion.div>
          </ScrollReveal>
        </div>

      </div>
    </ScrollReveal>
  );
}

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={sectionRef} id="work" className="bg-[#F5F3EF] dark:bg-[#0a0a0a] transition-colors duration-500 py-32 relative z-20">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Header */}
        <ScrollReveal delay={0.1} yOffset={30}>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.02] flex items-center justify-center flex-shrink-0 transition-colors duration-500">
              <FolderGit2 className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-colors duration-500" />
            </div>
            <div>
              <h2 className="text-[#111111] dark:text-white font-bold text-3xl md:text-4xl transition-colors duration-500" style={{ fontFamily: "'Arima', sans-serif" }}>
                Featured Projects
              </h2>
              <p className="text-[#686868] dark:text-white/40 text-sm mt-1 transition-colors duration-500">A selection of recent UI/UX design work.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Editorial Layout */}
        <div className="flex flex-col gap-24 md:gap-32">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} scrollYProgress={scrollYProgress} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
