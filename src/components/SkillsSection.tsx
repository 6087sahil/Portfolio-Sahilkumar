import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useTheme } from './ThemeProvider';

// --- LOGO COMPONENTS ---
const FigmaLogo = () => (
  <svg viewBox="0 0 38 57" className="w-auto h-[32px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5a9.5 9.5 0 1 1 19-9.5 9.5 9.5 0 0 1-19 9.5z" fill="#1ABCFE" />
    <path d="M0 47.5C0 42.253 4.253 38 9.5 38H19v9.5c0 5.247-4.253 9.5-9.5 9.5S0 52.747 0 47.5z" fill="#0ACF83" />
    <path d="M19 0v19h9.5c5.247 0 9.5-4.253 9.5-9.5S33.747 0 28.5 0H19z" fill="#FF7262" />
    <path d="M0 9.5C0 4.253 4.253 0 9.5 0H19v19H9.5C4.253 19 0 14.747 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5C0 23.253 4.253 19 9.5 19H19v19H9.5C4.253 38 0 33.747 0 28.5z" fill="#A259FF" />
  </svg>
);

const AdobeXDLogo = () => (
  <div className="flex items-center justify-center w-[30px] h-[30px] bg-[#470137] rounded-md border border-[#FF61F6]/20 shadow-sm">
    <span className="text-[#FF61F6] font-bold text-[15px] tracking-tight" style={{ fontFamily: 'sans-serif' }}>Xd</span>
  </div>
);

const FramerLogo = () => (
  <svg viewBox="0 0 14 21" className="w-auto h-[32px] text-[#111111] dark:text-white transition-colors duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h14v7H7L0 0z" fill="currentColor" />
    <path d="M0 7h14v7H7L0 7z" fill="currentColor" />
    <path d="M0 14h7v7L0 14z" fill="currentColor" />
  </svg>
);

const VSCodeLogo = () => (
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg"
    alt="VS Code"
    className="w-[32px] h-[32px]"
  />
);

const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] text-[#111111] dark:text-white transition-colors duration-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const FigJamLogo = () => (
  <svg viewBox="0 0 38 57" className="w-auto h-[32px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5a9.5 9.5 0 1 1 19-9.5 9.5 9.5 0 0 1-19 9.5z" fill="#0ACF83" />
    <path d="M0 47.5C0 42.253 4.253 38 9.5 38H19v9.5c0 5.247-4.253 9.5-9.5 9.5S0 52.747 0 47.5z" fill="#A259FF" />
    <path d="M19 0v19h9.5c5.247 0 9.5-4.253 9.5-9.5S33.747 0 28.5 0H19z" fill="#FFC900" />
    <path d="M0 9.5C0 4.253 4.253 0 9.5 0H19v19H9.5C4.253 19 0 14.747 0 9.5z" fill="#FF7262" />
    <path d="M0 28.5C0 23.253 4.253 19 9.5 19H19v19H9.5C4.253 38 0 33.747 0 28.5z" fill="#F24E1E" />
  </svg>
);


// --- DATA ---
const skills = [
  'UI Design', 'UX Design', 'Wireframing', 'Prototyping',
  'Design Systems', 'Interaction Design', 'Responsive Design',
  'Usability Testing', 'User Research',
];

const tools = [
  { name: 'Figma', tag: 'Expert', desc: 'UI design, prototyping & design systems.', Icon: FigmaLogo },
  { name: 'Adobe XD', tag: '', desc: 'Wireframing & UI design.', Icon: AdobeXDLogo },
  { name: 'Framer', tag: '', desc: 'Interactive websites & motion.', Icon: FramerLogo },
  { name: 'VS Code', tag: '', desc: 'Frontend development & implementation.', Icon: VSCodeLogo },
  { name: 'GitHub', tag: '', desc: 'Version control & project collaboration.', Icon: GitHubLogo },
  { name: 'FigJam', tag: '', desc: 'Brainstorming & user flows.', Icon: FigJamLogo },
];

const ToolCard = ({ tool, index, scrollYProgress }: { tool: any, index: number, scrollYProgress: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Row Parallax (Row 0: normal, Row 1: slower, Row 2: faster)
  const row = Math.floor(index / 3);
  const parallaxOffset = row === 1 ? -20 : row === 2 ? 20 : 0;
  const cardY = useTransform(scrollYProgress, [0, 1], [0, parallaxOffset]);

  const darkShadows = [
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)",
    "0 10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.1)",
    "0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.03)"
  ];

  const lightShadows = [
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.15)",
    "0 10px 30px rgba(0,0,0,0.05), 0 0 40px rgba(168,85,247,0.3)",
    "0 10px 30px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.15)"
  ];

  return (
    <motion.div
      style={{ y: cardY }}
      className="relative h-full"
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        whileHover="hover"
        animate={{
          boxShadow: theme === 'dark' ? darkShadows : lightShadows
        }}
        transition={{
          duration: 0.8,
          delay: 0.1 + (index * 0.1),
          ease: [0.25, 0.1, 0.25, 1],
          boxShadow: { repeat: Infinity, duration: 6, ease: "easeInOut" }
        }}
        className="group relative p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#DCD9D4] dark:border-white/5 overflow-hidden transition-colors duration-500 hover:border-purple-500/40 hover:bg-[#F5F3EF] dark:hover:bg-white/[0.02] cursor-default h-full flex flex-col"
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-8">
            <motion.div
              variants={{
                hover: { y: -3, scale: 1.05 }
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center w-[48px] h-[48px] relative drop-shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-500"
            >
              {/* Logo entrance animation */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                className="w-full h-full flex items-center justify-center"
              >
                <tool.Icon />
              </motion.div>
            </motion.div>

            {/* Proficiency Tag */}
            {tool.tag && (
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="text-[9px] font-semibold tracking-wider px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-[#686868] dark:text-white/50 bg-black/5 dark:bg-white/5 group-hover:border-purple-500/30 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors duration-500 uppercase"
              >
                {tool.tag}
              </motion.span>
            )}
          </div>

          <div className="mt-auto">
            <motion.h4
              variants={{ hover: { color: theme === 'dark' ? "#E9D5FF" : "#9333EA", y: -2 } }}
              transition={{ duration: 0.3 }}
              className="text-[#111111] dark:text-white font-bold text-xl mb-2 transition-colors duration-500"
            >
              {tool.name}
            </motion.h4>
            <motion.p
              variants={{ hover: { color: theme === 'dark' ? "rgba(255,255,255,0.7)" : "#111111", y: -2 } }}
              transition={{ duration: 0.3 }}
              className="text-[#686868] dark:text-white/40 text-sm font-light leading-relaxed transition-colors duration-500"
            >
              {tool.desc}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN SECTION ---
const SkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "15%"]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -100]); // Global section upward move

  return (
    <section ref={sectionRef} id="skills" className="relative w-full bg-[#F5F3EF] dark:bg-[#050108] transition-colors duration-500 py-28 md:py-36 border-t border-[#DCD9D4] dark:border-white/5 overflow-hidden">

      {/* Cinematic Continuous Background Motion */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] max-w-[1400px] max-h-[1400px] rounded-full bg-gradient-to-b from-purple-500/10 via-indigo-500/5 dark:from-purple-900/10 dark:via-indigo-900/5 to-transparent blur-[180px] pointer-events-none z-0 transition-colors duration-500"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* HERO TEXT SCROLL ANIMATION */}
        <motion.div style={{ y: headingY }} className="mb-24">
          <ScrollReveal delay={0.1}>
            <span className="text-[#686868] dark:text-white/50 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-8 sm:mb-12 block uppercase transition-colors duration-500">
              04 &bull; Skills & Tools
            </span>
          </ScrollReveal>

          <h2 className="font-bold tracking-tight leading-[1.05] flex flex-col" style={{ fontFamily: "'Arima', sans-serif" }}>
            <ScrollReveal delay={0.2} staggerChildren={0.1}>
              <motion.span
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                className="text-purple-600 dark:text-purple-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 transition-colors duration-500"
              >
                What I bring
              </motion.span>
              <motion.span
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                className="text-[#111111]/40 dark:text-white/40 text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic font-medium transition-colors duration-500"
              >
                to every project.
              </motion.span>
            </ScrollReveal>
          </h2>

          <ScrollReveal delay={0.4} yOffset={20}>
            <p className="mt-8 text-[#686868] dark:text-white/50 text-base md:text-lg max-w-[650px] leading-relaxed font-light transition-colors duration-500">
              Combining thoughtful UX strategy, refined visual design, and modern digital tools to create experiences that feel intuitive, purposeful, and beautifully crafted.
            </p>
          </ScrollReveal>
        </motion.div>

        {/* CORE SKILLS */}
        <div className="mb-28">
          <ScrollReveal delay={0.1} yOffset={20}>
            <span className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase block mb-8 transition-colors duration-500">
              Core Skills
            </span>
          </ScrollReveal>

          <ScrollReveal staggerChildren={0.05} className="flex flex-wrap gap-3 md:gap-4">
            {skills.map((skill) => (
              <motion.div
                key={skill}
                variants={{ hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="group px-7 py-3.5 rounded-full border border-[#DCD9D4] dark:border-white/5 bg-white dark:bg-white/[0.015] cursor-default transition-all duration-500 hover:border-purple-400/40 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]"
              >
                <span className="text-[#111111] dark:text-white/60 text-sm font-medium tracking-wide group-hover:text-purple-700 dark:group-hover:text-purple-100 transition-colors duration-500">
                  {skill}
                </span>
              </motion.div>
            ))}
          </ScrollReveal>
        </div>

        {/* PREMIUM TOOL GRID */}
        <motion.div style={{ y: cardsY }} className="pb-10">
          <ScrollReveal delay={0.1} yOffset={20}>
            <span className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase block mb-8 transition-colors duration-500">
              Software & Tools
            </span>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tools.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SkillsSection;
