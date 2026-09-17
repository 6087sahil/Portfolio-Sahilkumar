import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import TextReveal from './TextReveal';

const IntroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll storytelling parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 40]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.98]);

  // Image 3D Hover Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { damping: 30, stiffness: 100 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section ref={sectionRef} id="about" className="relative w-full min-h-screen bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 flex items-center overflow-hidden border-t border-[#DCD9D4] dark:border-white/5">
      
      {/* Subtle Premium Background Shifting */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center"
      >
        <div className="w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-gradient-to-tr from-purple-900/10 to-indigo-900/10 rounded-full blur-[150px] opacity-70" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-28 md:py-36">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24 items-center">
          
          {/* LEFT: Typography & Storytelling */}
          <motion.div style={{ y: textY }} className="flex flex-col">
            
            {/* 1. Intro Label */}
            <ScrollReveal delay={0.1} yOffset={20} className="mb-10 sm:mb-12 block">
              <span className="text-[#686868] dark:text-white/60 font-semibold text-[10px] sm:text-xs uppercase transition-colors duration-500" style={{ letterSpacing: "0.2em" }}>
                Introduction &bull; About Me
              </span>
            </ScrollReveal>

            {/* 2. Main Typography — word-mask reveal */}
            <div className="mb-6 flex flex-col">
              <TextReveal
                as="span"
                className="text-[#686868] dark:text-white/70 text-2xl sm:text-3xl md:text-4xl font-light tracking-wide mb-3 transition-colors duration-500 block"
                delay={0.15}
                stagger={0.06}
              >
                UI/UX &amp; Product Designer
              </TextReveal>
              <TextReveal
                as="span"
                className="text-[#111111] dark:text-white text-5xl sm:text-6xl md:text-7xl lg:text-[90px] tracking-tight leading-[1.0] transition-colors duration-500 block"
                style={{ fontFamily: "'Arima', sans-serif" }}
                delay={0.35}
                stagger={0.07}
              >
                Sahil Kumar
              </TextReveal>
            </div>

            {/* 3. Description */}
            <ScrollReveal delay={0.4} staggerChildren={0.15} className="mt-4 sm:mt-6 max-w-lg mb-10" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-[#111111]/80 dark:text-white/80 font-normal leading-relaxed text-base sm:text-lg mb-4 transition-colors duration-500"
              >
                I design digital experiences that are simple, intuitive, and memorable.
              </motion.p>
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-[#686868] dark:text-white/50 font-normal leading-relaxed text-sm sm:text-base transition-colors duration-500"
              >
                Based in New Delhi, India. Open to freelance and full-time opportunities.
              </motion.p>
            </ScrollReveal>

            {/* 6. CTA Buttons */}
            <ScrollReveal delay={0.6} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <motion.a
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#work"
                className="group relative bg-[#111111] dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-[0.1em] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work
                </span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#contact"
                className="group relative bg-transparent border border-[#111111]/20 dark:border-white/20 text-[#111111] dark:text-white px-8 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-[0.1em] transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                Let's Connect
              </motion.a>
            </ScrollReveal>

            {/* 7. Stats */}
            <ScrollReveal delay={0.7} staggerChildren={0.1} className="flex items-center gap-10 sm:gap-14 mt-16 pt-10 border-t border-[#DCD9D4] dark:border-white/5 transition-colors duration-500">
              {[
                { val: '50+', label: 'Projects' },
                { val: '3+', label: 'Years' },
                { val: '99%', label: 'Satisfaction' }
              ].map((stat) => (
                <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col">
                  <span className="text-[#111111] dark:text-white font-bold text-3xl sm:text-4xl block mb-1 tracking-tight transition-colors duration-500">
                    {stat.val}
                  </span>
                  <span className="text-[#686868] dark:text-white/40 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-500">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </ScrollReveal>
            
          </motion.div>

          {/* RIGHT: Profile Image & Parallax */}
          <motion.div 
            style={{ y: imageY, scale: imageScale }} 
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Image Glow */}
            <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full scale-90 pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-[#DCD9D4] dark:border-white/10 bg-white/50 dark:bg-[#0f0a14] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors duration-500"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop"
                alt="Sahil Kumar"
                className="w-full h-full object-cover grayscale-[15%] opacity-90 mix-blend-multiply dark:mix-blend-lighten"
              />
              
              {/* Image Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5F3EF] dark:from-[#0a0a0a] via-transparent to-transparent pointer-events-none transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />

              {/* 5. "Open to work" Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -5, 0] }}
                transition={{ default: { duration: 0.8, delay: 0.6 }, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                className="absolute bottom-6 left-6 right-6"
                style={{ transform: "translateZ(30px)" }} // 3D pop effect
              >
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-[#DCD9D4] dark:border-white/15 rounded-xl px-5 py-4 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group transition-colors duration-500">
                  <div className="flex flex-col">
                    <span className="text-[#111111] dark:text-white text-sm font-semibold tracking-wide transition-colors duration-500">Open to work</span>
                    <span className="text-[#686868] dark:text-white/40 text-[11px] font-medium mt-0.5 transition-colors duration-500">New Delhi, India</span>
                  </div>
                  {/* Breathing Dot */}
                  <div className="relative flex h-3 w-3 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default IntroSection;
