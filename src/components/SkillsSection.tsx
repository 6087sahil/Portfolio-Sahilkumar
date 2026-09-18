import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextReveal from './TextReveal';


/* ── Inline SVG logos ── */
const FigmaLogo = () => (
  <svg viewBox="0 0 38 57" className="w-8 h-8" fill="none">
    <path d="M19 28.5a9.5 9.5 0 1 1 19-9.5 9.5 9.5 0 0 1-19 9.5z" fill="#1ABCFE" />
    <path d="M0 47.5C0 42.253 4.253 38 9.5 38H19v9.5c0 5.247-4.253 9.5-9.5 9.5S0 52.747 0 47.5z" fill="#0ACF83" />
    <path d="M19 0v19h9.5c5.247 0 9.5-4.253 9.5-9.5S33.747 0 28.5 0H19z" fill="#FF7262" />
    <path d="M0 9.5C0 4.253 4.253 0 9.5 0H19v19H9.5C4.253 19 0 14.747 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5C0 23.253 4.253 19 9.5 19H19v19H9.5C4.253 38 0 33.747 0 28.5z" fill="#A259FF" />
  </svg>
);
const FramerLogo = () => (
  <svg viewBox="0 0 14 21" className="w-7 h-7 text-[#111111] dark:text-white transition-colors duration-500" fill="none">
    <path d="M0 0h14v7H7L0 0z" fill="currentColor" />
    <path d="M0 7h14v7H7L0 7z" fill="currentColor" />
    <path d="M0 14h7v7L0 14z" fill="currentColor" />
  </svg>
);
const VSCodeLogo = () => (
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" alt="VS Code" className="w-8 h-8" />
);
const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#111111] dark:text-white transition-colors duration-500" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const featuredTools = [
  { name: 'Figma', role: 'Primary Design Tool', tag: 'Expert', Logo: FigmaLogo, prof: 95 },
  { name: 'Framer', role: 'Interactive Prototyping', tag: 'Advanced', Logo: FramerLogo, prof: 80 },
  { name: 'VS Code', role: 'Frontend Dev', tag: 'Proficient', Logo: VSCodeLogo, prof: 75 },
  { name: 'GitHub', role: 'Version Control', tag: 'Proficient', Logo: GitHubLogo, prof: 72 },
];

const skills = [
  'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'Design Systems',
  'Interaction Design', 'Responsive Design', 'Usability Testing', 'User Research',
  'Typography', 'Information Architecture', 'Motion Design', 'Accessibility',
  'Brand Identity', 'Visual Design', 'Component Libraries',
];

/* ── Featured Tool Card ── */
const ToolCard = ({ tool, index }: { tool: typeof featuredTools[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative p-7 rounded-3xl bg-white dark:bg-white/[0.025] border border-[#DCD9D4] dark:border-white/5 flex flex-col gap-5 cursor-default transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.12)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Logo + tag */}
      <div className="flex items-start justify-between relative z-10">
        <motion.div whileHover={{ scale: 1.12, rotate: 3 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
          <tool.Logo />
        </motion.div>
        <span className="text-[9px] font-bold tracking-wider px-3 py-1.5 rounded-full border border-purple-500/20 text-purple-600 dark:text-purple-300 bg-purple-500/8 uppercase transition-colors duration-500">
          {tool.tag}
        </span>
      </div>

      {/* Name + role */}
      <div className="relative z-10">
        <h4 className="text-[#111111] dark:text-white font-bold text-xl mb-0.5 group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors duration-300">
          {tool.name}
        </h4>
        <p className="text-[#686868] dark:text-white/40 text-xs font-medium tracking-wide transition-colors duration-500">
          {tool.role}
        </p>
      </div>

      {/* Proficiency bar */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] text-[#686868] dark:text-white/30 uppercase tracking-widest font-semibold transition-colors duration-500">Proficiency</span>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold transition-colors duration-500">{tool.prof}%</span>
        </div>
        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${tool.prof}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-500 dark:to-indigo-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

const SkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '10%']);
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  // Duplicate skills for seamless marquee
  const marqueeItems = [...skills, ...skills];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 py-28 md:py-36 border-t border-[#DCD9D4] dark:border-white/5 overflow-hidden"
    >
      {/* Background orb */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full bg-gradient-to-b from-purple-500/8 via-indigo-500/4 dark:from-purple-900/12 dark:via-indigo-900/6 to-transparent blur-[160px] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* ── Heading ── */}
        <motion.div style={{ y: headingY }} className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#686868] dark:text-white/50 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-8 block uppercase transition-colors duration-500"
          >
            04 &bull; Skills &amp; Tools
          </motion.span>

          <TextReveal
            as="h2"
            className="text-purple-600 dark:text-purple-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0] block transition-colors duration-500"
            style={{ fontFamily: "'Arima', sans-serif" }}
            delay={0.1} stagger={0.08}
          >
            What I bring
          </TextReveal>
          <TextReveal
            as="span"
            className="text-[#111111]/35 dark:text-white/35 text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic font-bold tracking-tight leading-[1.0] block transition-colors duration-500"
            style={{ fontFamily: "'Arima', sans-serif" }}
            delay={0.38} stagger={0.08}
          >
            to every project.
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[#686868] dark:text-white/50 text-base md:text-lg max-w-[600px] leading-relaxed font-light transition-colors duration-500"
          >
            Combining thoughtful UX strategy, refined visual design, and modern tools to create experiences that feel intuitive and beautifully crafted.
          </motion.p>
        </motion.div>

        {/* ── Featured Tool Cards ── */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase block mb-6 transition-colors duration-500"
          >
            Primary Tools
          </motion.span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredTools.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} index={i} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Marquee ── */}
      <div className="relative z-10 mb-0 mt-4">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase block transition-colors duration-500"
          >
            Core Skills
          </motion.span>
        </div>

        {/* Marquee row */}
        <div
          className="relative w-full overflow-hidden group"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="marquee-track flex gap-4 py-3 w-max">
            {marqueeItems.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="flex-shrink-0 px-6 py-3 rounded-full border border-[#DCD9D4] dark:border-white/8 bg-white dark:bg-white/[0.02] text-[#686868] dark:text-white/50 text-sm font-medium tracking-wide whitespace-nowrap transition-colors duration-500 hover:border-purple-400/50 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default SkillsSection;
