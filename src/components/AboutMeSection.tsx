import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import TextReveal from './TextReveal';
import { useCountUp } from './useCountUp';

/* ── Stat card with count-up ── */
const StatCard = ({
  target,
  suffix = '',
  label,
  index,
}: {
  target: number;
  suffix?: string;
  label: string;
  index: number;
}) => {
  const { count, ref } = useCountUp(target, 1600);

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col p-5 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-[#DCD9D4] dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-colors duration-500"
    >
      <span className="text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white mb-1 tracking-tight transition-colors duration-500">
        {count}{suffix}
      </span>
      <span className="text-purple-600/80 dark:text-purple-300/80 text-[9px] uppercase tracking-[0.15em] font-bold transition-colors duration-500">
        {label}
      </span>
    </motion.div>
  );
};

/* ── Trait pill ── */
const TraitCard = ({ label, desc, index }: { label: string; desc: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: 0.15 + index * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -4 }}
    className="group p-6 rounded-2xl border border-[#DCD9D4] dark:border-white/8 bg-white dark:bg-[#06000c] hover:border-purple-500/30 hover:bg-[#F5F3EF] dark:hover:bg-white/[0.02] transition-all duration-500 cursor-default"
  >
    <div className="w-6 h-px bg-purple-500/60 dark:bg-purple-400/60 mb-5 transition-all duration-500 group-hover:w-10 group-hover:bg-purple-500" />
    <h4 className="text-[#111111] dark:text-white font-bold text-sm mb-2 transition-colors duration-500">{label}</h4>
    <p className="text-[#686868] dark:text-white/40 text-sm leading-relaxed transition-colors duration-500">{desc}</p>
  </motion.div>
);

const stats = [
  { target: 50, suffix: '+', label: 'Projects Shipped' },
  { target: 3,  suffix: '+', label: 'Years Experience' },
  { target: 99, suffix: '%', label: 'Client Satisfaction' },
  { target: 4,  suffix: '',  label: 'Design Awards' },
];

const traits = [
  { label: 'User-Centered',   desc: 'Every decision starts with the user.' },
  { label: 'Detail-Oriented', desc: 'Consistency at every pixel matters.' },
  { label: 'Problem Solver',  desc: 'Design is a tool for real challenges.' },
];

const timeline = [
  { period: '2026 – Present', role: 'UI/UX & Product Designer', org: 'Freelance & Self-Initiated', accent: 'bg-purple-500 dark:bg-purple-400' },
  { period: 'Ongoing',        role: 'Bachelor of Arts',          org: 'School of Open Learning · University of Delhi', accent: 'bg-indigo-500 dark:bg-indigo-400' },
];

const AboutMeSection: React.FC = () => {
  const imageUrl = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop';

  return (
    <section
      id="aboutme"
      className="relative w-full bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 py-24 md:py-32 border-t border-[#DCD9D4] dark:border-white/5 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-purple-600/5 dark:bg-purple-900/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* ── Section label ── */}
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#686868] dark:text-white/60 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-10 block uppercase transition-colors duration-500"
        >
          03 &bull; About Me
        </motion.span>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          {/* ── Left: Photo card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[480px] lg:min-h-[560px] bg-[#111111]"
          >
            <img
              src={imageUrl}
              alt="Sahil Kumar"
              className="w-full h-full object-cover object-center grayscale-[20%] opacity-80 mix-blend-luminosity"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0010]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent pointer-events-none" />

            {/* Name overlay */}
            <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">New Delhi, India</p>
              <h3 className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Arima', sans-serif" }}>
                Sahil Kumar
              </h3>
            </div>

            {/* "Open to work" badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-6 right-6 z-10"
            >
              <div className="flex items-center gap-2 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-white text-[11px] font-semibold tracking-wide">Open to work</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: Content ── */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">

            {/* Headline */}
            <div>
              <h2 className="font-bold tracking-tight leading-[1.0] mb-6 flex flex-col" style={{ fontFamily: "'Arima', sans-serif" }}>
                <TextReveal as="span" className="text-purple-600 dark:text-purple-200 text-4xl sm:text-5xl md:text-6xl transition-colors duration-500 block" delay={0.1} stagger={0.07}>
                  Turning ideas
                </TextReveal>
                <TextReveal as="span" className="text-[#111111]/30 dark:text-white/30 text-4xl sm:text-5xl md:text-6xl italic transition-colors duration-500 block" delay={0.35} stagger={0.07}>
                  into experiences.
                </TextReveal>
              </h2>

              {/* Bio */}
              <div className="space-y-4 max-w-xl" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[#111111] dark:text-white/80 text-base sm:text-lg leading-relaxed font-normal transition-colors duration-500"
                >
                  I'm Sahil Kumar, a UI/UX &amp; Product Designer based in New Delhi, India — passionate about creating digital products that are not just visually stunning but deeply functional and human-centered.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.62, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[#686868] dark:text-white/50 text-sm leading-relaxed transition-colors duration-500"
                >
                  My design philosophy centers on simplicity, clarity, and purpose. I believe the best interfaces get out of the way and let users accomplish their goals effortlessly.
                </motion.p>
              </div>
            </div>

            {/* Education timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[#686868]/80 dark:text-white/40 text-[10px] font-semibold tracking-[0.2em] uppercase block mb-4 transition-colors duration-500">
                Education &amp; Experience
              </span>
              <div className="divide-y divide-[#DCD9D4] dark:divide-white/8 transition-colors duration-500">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.65 + i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="py-4 flex gap-4"
                  >
                    <div className={`w-1.5 h-1.5 ${item.accent} rounded-full mt-1.5 flex-shrink-0 transition-colors duration-500`} />
                    <div>
                      <span className="text-[#686868]/70 dark:text-white/30 text-[10px] font-semibold tracking-widest uppercase block mb-0.5 transition-colors duration-500">{item.period}</span>
                      <h4 className="text-[#111111] dark:text-white font-bold text-sm transition-colors duration-500">{item.role}</h4>
                      <p className="text-[#686868] dark:text-white/40 text-xs mt-0.5 transition-colors duration-500">{item.org}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <StatCard key={s.label} target={s.target} suffix={s.suffix} label={s.label} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Trait cards row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {traits.map((t, i) => (
            <TraitCard key={t.label} label={t.label} desc={t.desc} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutMeSection;
