import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextReveal from './TextReveal';
import Magnet from './Magnet';
import { ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useState } from 'react';

/* ── Underline Input Field ── */
const UnderlineField = ({
  label,
  type = 'text',
  isTextArea = false,
  index,
}: {
  label: string;
  type?: string;
  isTextArea?: boolean;
  index: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const active = isFocused || hasValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      <label
        className={`absolute left-0 font-semibold tracking-wider uppercase pointer-events-none transition-all duration-400 z-10
          ${active
            ? 'top-0 text-[9px] text-purple-600 dark:text-purple-300'
            : 'top-5 text-[11px] text-[#686868]/70 dark:text-white/40'
          }`}
      >
        {label}
      </label>

      {isTextArea ? (
        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value.length > 0); }}
          rows={5}
          className="w-full bg-transparent pt-7 pb-3 text-[#111111] dark:text-white text-sm resize-none focus:outline-none transition-colors duration-500 caret-purple-500"
        />
      ) : (
        <input
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value.length > 0); }}
          className="w-full bg-transparent pt-7 pb-3 text-[#111111] dark:text-white text-sm focus:outline-none transition-colors duration-500 caret-purple-500"
        />
      )}

      {/* Static underline track */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-[#DCD9D4] dark:bg-white/10 transition-colors duration-500" />
      {/* Animated fill underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-purple-600 dark:bg-purple-400"
        animate={{ width: isFocused ? '100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
};

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const word1Y = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const word2Y = useTransform(scrollYProgress, [0, 1], [0, -16]);
  const word3Y = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const word4Y = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 border-t border-[#DCD9D4] dark:border-white/5 overflow-hidden"
    >
      {/* Background glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] max-w-[900px] max-h-[900px] bg-gradient-to-b from-purple-500/8 via-indigo-500/5 dark:from-purple-900/12 dark:via-indigo-900/6 to-transparent blur-[120px] rounded-full pointer-events-none z-0"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── LEFT: Sticky headline + socials ── */}
          <div className="lg:sticky lg:top-28">

            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#686868] dark:text-white/60 font-semibold tracking-[0.2em] text-[10px] sm:text-xs mb-8 block uppercase transition-colors duration-500"
            >
              06 &bull; Contact
            </motion.span>

            {/* Headline with scroll-linked drift */}
            <h2
              className="text-5xl sm:text-6xl lg:text-[68px] font-bold tracking-tight leading-[1.05] mb-8 flex flex-col items-start"
              style={{ fontFamily: "'Arima', sans-serif" }}
            >
              <motion.div style={{ y: word1Y }}>
                <TextReveal as="span" delay={0} stagger={0.07} className="text-[#111111] dark:text-white block transition-colors duration-500">
                  Let's create
                </TextReveal>
              </motion.div>
              <motion.div style={{ y: word2Y }} className="ml-0 sm:ml-8">
                <TextReveal as="span" delay={0.22} stagger={0.07} className="text-[#686868] dark:text-white/40 italic font-medium block transition-colors duration-500">
                  something
                </TextReveal>
              </motion.div>
              <motion.div style={{ y: word3Y }} className="ml-0 sm:ml-16">
                <TextReveal as="span" delay={0.42} stagger={0.07} className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 block">
                  meaningful
                </TextReveal>
              </motion.div>
              <motion.div style={{ y: word4Y }}>
                <TextReveal as="span" delay={0.62} stagger={0.07} className="text-[#111111] dark:text-white block transition-colors duration-500">
                  together.
                </TextReveal>
              </motion.div>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#686868] dark:text-white/50 text-base leading-relaxed max-w-sm font-light mb-10 transition-colors duration-500"
            >
              Have a project, idea, or opportunity? I'd love to hear about it and turn it into a thoughtful digital experience.
            </motion.p>

            {/* Social links */}
            <div className="flex flex-wrap gap-6">
              {['Email', 'LinkedIn', 'Dribbble', 'GitHub'].map((social, i) => (
                <motion.a
                  key={social}
                  href="#"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative text-[#686868] dark:text-white/50 text-sm font-medium hover:text-[#111111] dark:hover:text-white transition-colors duration-300 py-1"
                >
                  <span className="relative z-10 transition-transform duration-300 inline-block group-hover:-translate-y-0.5">{social}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Scrolling form with underline inputs ── */}
          <div>
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-8"
            >
              <UnderlineField label="Name" index={0} />
              <UnderlineField label="Email Address" type="email" index={1} />
              <UnderlineField label="Subject" index={2} />
              <UnderlineField label="Message" isTextArea index={3} />

              {/* Magnetic send button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="pt-4"
              >
                <Magnet strength={4} padding={60}>
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: 'rgba(147,51,234,1)',
                      color: '#ffffff',
                      boxShadow: '0 0 40px rgba(168,85,247,0.6)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="group w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    <span className="flex items-center gap-2">
                      Send Message
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                </Magnet>
              </motion.div>
            </motion.form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
