import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Inline SVG logos ── */
const FigmaLogo = () => (
  <svg viewBox="0 0 38 57" className="w-7 h-7" fill="none">
    <path d="M19 28.5a9.5 9.5 0 1 1 19-9.5 9.5 9.5 0 0 1-19 9.5z" fill="#1ABCFE" />
    <path d="M0 47.5C0 42.253 4.253 38 9.5 38H19v9.5c0 5.247-4.253 9.5-9.5 9.5S0 52.747 0 47.5z" fill="#0ACF83" />
    <path d="M19 0v19h9.5c5.247 0 9.5-4.253 9.5-9.5S33.747 0 28.5 0H19z" fill="#FF7262" />
    <path d="M0 9.5C0 4.253 4.253 0 9.5 0H19v19H9.5C4.253 19 0 14.747 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5C0 23.253 4.253 19 9.5 19H19v19H9.5C4.253 38 0 33.747 0 28.5z" fill="#A259FF" />
  </svg>
);

const FramerLogo = () => (
  <svg viewBox="0 0 14 21" className="w-6 h-6 text-[#161513]" fill="none">
    <path d="M0 0h14v7H7L0 0z" fill="currentColor" />
    <path d="M0 7h14v7H7L0 7z" fill="currentColor" />
    <path d="M0 14h7v7L0 14z" fill="currentColor" />
  </svg>
);

const VSCodeLogo = () => (
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" alt="VS Code" className="w-7 h-7" />
);

const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#161513]" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const featuredTools = [
  { name: 'Figma', role: 'Primary Design Tool', tag: 'Expert', Logo: FigmaLogo, prof: 95 },
  { name: 'Framer', role: 'Interactive Prototyping', tag: 'Advanced', Logo: FramerLogo, prof: 80 },
  { name: 'VS Code', role: 'Frontend Exploration', tag: 'Proficient', Logo: VSCodeLogo, prof: 75 },
  { name: 'GitHub', role: 'Version Control', tag: 'Proficient', Logo: GitHubLogo, prof: 72 },
];

const skills = [
  'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems',
  'Interaction Design', 'Responsive Layouts', 'Usability Testing', 'Field Interviews',
  'Typography', 'Information Architecture', 'Micro-Interactions', 'Accessibility (WCAG)',
  'Design Tokens', 'Visual Craft', 'Component Libraries',
];

/* ── Featured Tool Card ── */
const ToolCard = ({ tool, index }: { tool: typeof featuredTools[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#161513]/15 flex flex-col gap-4 shadow-[0_8px_24px_-4px_rgba(147,51,234,0.14)] hover:border-purple-400/40 hover:shadow-[0_16px_36px_-4px_rgba(147,51,234,0.24)] transition-all duration-300"
    >
      {/* Logo + tag */}
      <div className="flex items-start justify-between">
        <tool.Logo />
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#EDE8DE] text-[#5C5852]">
          {tool.tag}
        </span>
      </div>

      <div>
        <h4 className="font-serif text-lg text-[#161513] font-semibold">
          {tool.name}
        </h4>
        <p className="text-xs text-[#5C5852] font-mono mt-0.5">
          {tool.role}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#161513]/10 h-1 rounded-full overflow-hidden mt-1">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${tool.prof}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + index * 0.08, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="h-full bg-[#D82E54] rounded-full"
        />
      </div>
    </motion.div>
  );
};

const SkillsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative bg-[#F4F1EA] text-[#161513] py-24 md:py-32 border-t border-[#161513]/10"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* ── Heading ── */}
        <motion.div style={{ y: headingY }} className="mb-14">
          <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider mb-3 block">
            04 / Skills &amp; Tools
          </span>

          <h2 className="font-serif text-[#161513] text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.05]">
            What I bring{' '}
            <span className="italic text-[#D82E54] font-serif">
              to every project.
            </span>
          </h2>

          <p className="mt-4 text-[#5C5852] text-base md:text-lg max-w-[600px] leading-relaxed font-light">
            Combining thoughtful UX strategy, rigorous typographic hierarchy, and systematic Figma component architecture.
          </p>
        </motion.div>

        {/* ── Featured Tool Cards ── */}
        <div className="mb-14">
          <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider block mb-4">
            Primary Tooling
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredTools.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} index={i} />
            ))}
          </div>
        </div>

        {/* ── Skills Cloud ── */}
        <div>
          <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider block mb-4">
            Core Competencies
          </span>

          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full border border-[#161513]/15 bg-[#FAF8F5] text-[#161513] hover:border-[#D82E54] hover:text-[#D82E54] hover:shadow-sm transition-all duration-300 font-mono text-xs cursor-default"
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
