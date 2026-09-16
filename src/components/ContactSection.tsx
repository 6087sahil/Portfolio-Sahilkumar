import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useTheme } from './ThemeProvider';

const InputField = ({ label, type = "text", isTextArea = false }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const active = isFocused || hasValue;

  return (
    <div 
      className={`relative group w-full ${isTextArea ? 'flex-1 min-h-[140px] flex flex-col' : ''}`}
    >
      <label 
        className={`absolute left-5 text-[#686868]/70 dark:text-white/40 text-xs font-semibold tracking-wider uppercase transition-all duration-500 pointer-events-none z-10
          ${active ? 'top-3 text-[9px] text-purple-600 dark:text-purple-300' : 'top-5 text-[11px] group-hover:text-[#111111] dark:group-hover:text-white/60'}
        `}
      >
        {label}
      </label>

      {isTextArea ? (
        <textarea 
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value.length > 0); }}
          className="w-full flex-1 h-full bg-white dark:bg-white/[0.02] border border-[#DCD9D4] dark:border-white/5 rounded-2xl pt-9 pb-4 px-5 text-[#111111] dark:text-white text-sm focus:outline-none focus:border-purple-500/40 focus:bg-[#F5F3EF] dark:focus:bg-white/[0.04] transition-all duration-500 resize-none hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] focus:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        />
      ) : (
        <input 
          type={type} 
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => { setIsFocused(false); setHasValue(e.target.value.length > 0); }}
          className="w-full bg-white dark:bg-white/[0.02] border border-[#DCD9D4] dark:border-white/5 rounded-2xl pt-9 pb-4 px-5 text-[#111111] dark:text-white text-sm focus:outline-none focus:border-purple-500/40 focus:bg-[#F5F3EF] dark:focus:bg-white/[0.04] transition-all duration-500 hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] focus:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        />
      )}
    </div>
  );
};

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  // Subtle scroll-linked motion for headline lines
  const word1Y = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const word2Y = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const word3Y = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const word4Y = useTransform(scrollYProgress, [0, 1], [0, -25]);

  // Subtle form upward motion
  const formY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section ref={sectionRef} id="contact" className="relative w-full bg-[#F5F3EF] dark:bg-[#030108] transition-colors duration-500 py-24 md:py-32 border-t border-[#DCD9D4] dark:border-white/5 overflow-hidden flex items-center">
      
      {/* Background Motion */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-500/10 via-blue-500/5 dark:from-purple-900/10 dark:via-blue-900/5 to-transparent blur-[120px] rounded-full pointer-events-none z-0 transition-colors duration-500"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Balanced Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: Typography */}
          <div className="flex flex-col w-full">
            
            {/* Headline */}
            <h2 className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-tight leading-[1.0] mb-8 flex flex-col items-start" style={{ fontFamily: "'Arima', sans-serif" }}>
              <ScrollReveal staggerChildren={0.15}>
                <motion.span 
                  style={{ y: word1Y }}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="text-[#111111] dark:text-white relative z-10 block transition-colors duration-500"
                >
                  Let's create
                </motion.span>
                
                <motion.span 
                  style={{ y: word2Y }}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="text-[#686868] dark:text-white/40 italic font-medium ml-0 sm:ml-8 relative z-10 block transition-colors duration-500"
                >
                  something
                </motion.span>

                <motion.span 
                  style={{ y: word3Y }}
                  variants={{ hidden: { opacity: 0, filter: "blur(10px)" }, visible: { opacity: 1, filter: "blur(0px)" } }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 ml-0 sm:ml-16 py-1 relative z-10 block transition-colors duration-500"
                >
                  meaningful
                </motion.span>
                
                <motion.span 
                  style={{ y: word4Y }}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  className="text-[#111111] dark:text-white relative z-10 block transition-colors duration-500"
                >
                  together.
                </motion.span>
              </ScrollReveal>
            </h2>

            <ScrollReveal delay={0.4} staggerChildren={0.2} className="flex flex-col gap-8">
              {/* Description */}
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-[#686868] dark:text-white/50 text-base md:text-lg leading-relaxed max-w-md font-light transition-colors duration-500"
              >
                Have a project, idea, or opportunity in mind? I'd love to hear about it and explore how we can turn it into a thoughtful digital experience.
              </motion.p>


            </ScrollReveal>

          </div>

          {/* RIGHT COLUMN: Form & Socials */}
          <div className="flex flex-col h-full lg:max-w-[480px] lg:ml-auto w-full">
            <ScrollReveal delay={0.6} yOffset={40}>
              <motion.form 
                style={{ y: formY }}
                animate={{ 
                  boxShadow: theme === 'dark' 
                    ? ["0 30px 60px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.05)", "0 30px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.15)", "0 30px 60px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.05)"]
                    : ["0 30px 60px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.1)", "0 30px 60px rgba(0,0,0,0.05), 0 0 40px rgba(168,85,247,0.25)", "0 30px 60px rgba(0,0,0,0.05), 0 0 20px rgba(168,85,247,0.1)"]
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-full bg-white/40 dark:bg-[#0a0a0a]/40 backdrop-blur-3xl border border-[#DCD9D4] dark:border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-3 relative overflow-hidden group/form transition-colors duration-500"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Form ambient hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover/form:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <ScrollReveal delay={0.7} staggerChildren={0.1} className="flex flex-col gap-3">
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <InputField label="Name" />
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <InputField label="Email Address" type="email" />
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <InputField label="Subject" />
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="flex-1 flex flex-col">
                    <InputField label="Message" isTextArea={true} />
                  </motion.div>
                  
                  <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="pt-3">
                    <motion.button
                      whileHover={{ 
                        scale: 1.01, 
                        backgroundColor: theme === 'dark' ? "rgba(255,255,255,1)" : "rgba(17,17,17,1)", 
                        color: theme === 'dark' ? "#000" : "#fff", 
                        boxShadow: "0 0 30px rgba(168,85,247,0.3)" 
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group w-full bg-[#111111] dark:bg-white/90 text-white dark:text-black py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Send Message
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </motion.button>
                  </motion.div>
                </ScrollReveal>
              </motion.form>
            </ScrollReveal>
            
            {/* Socials placed neatly below the form */}
            <ScrollReveal delay={1.1} className="flex flex-wrap items-center gap-6 mt-8 sm:mt-10 px-2 justify-center lg:justify-start">
              {['Email', 'LinkedIn', 'Dribbble', 'GitHub'].map((social) => (
                <a 
                  key={social}
                  href="#"
                  className="group relative text-[#686868] dark:text-white/50 text-xs sm:text-sm font-medium hover:text-[#111111] dark:hover:text-white transition-colors duration-300 py-1"
                >
                  <span className="relative z-10 transition-transform duration-300 inline-block group-hover:-translate-y-0.5">{social}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
