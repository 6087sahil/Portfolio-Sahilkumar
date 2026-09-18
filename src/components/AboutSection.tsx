import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import Magnet from './Magnet';

const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Global scroll progress for parallax and draw effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax elements
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yBadge1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yBadge2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yBadge3 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  
  // Line drawing


  const imageUrl = "/sahil-profile.png";

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative w-full bg-[#06000c] text-white overflow-hidden flex flex-col pt-32 pb-40"
    >
      {/* GLOBAL BACKGROUND GRID */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', 
          backgroundSize: '100px 100px',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }} 
      />



      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-24 flex flex-col gap-32 md:gap-48">
        
        {/* ========================================================= */}
        {/* 1. INTRO SECTION */}
        {/* ========================================================= */}
        <div className="flex flex-col items-start gap-8 relative pt-20">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-purple-300 text-xs font-bold tracking-[0.3em] uppercase">
              ABOUT ME / PRODUCT DESIGNER
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.05] max-w-5xl"
            style={{ fontFamily: "'Arima', sans-serif" }}
          >
            Designing digital experiences that feel as <span className="text-purple-400 italic font-light">good</span> as they <span className="text-indigo-400 italic font-light">function</span>.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl font-light leading-relaxed"
          >
            I'm a UI/UX & Product Designer focused on turning complex problems into simple, intuitive and meaningful digital experiences.
          </motion.p>

          {/* Animated Draw Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
            className="w-full h-px bg-gradient-to-r from-purple-500/50 via-white/10 to-transparent origin-left mt-8"
          />
        </div>

        {/* ========================================================= */}
        {/* 2. PROFILE AREA (Asymmetric) */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row gap-20 items-center lg:items-start relative">
          {/* Left: Image Area */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-start">
            <div className="relative w-[300px] sm:w-[400px]">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full" />
              
              <motion.div 
                style={{ y: yImage }}
                className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-[3/4] bg-white/5 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#06000c] via-transparent to-transparent z-10" />
                <img 
                  src={imageUrl} 
                  alt="Sahil Kumar" 
                  className="w-full h-full object-cover filter grayscale opacity-90 mix-blend-luminosity hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out" 
                />
                
                {/* Embedded details */}
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-2xl font-bold tracking-tight">SAHIL KUMAR</h3>
                  <p className="text-white/60 text-sm tracking-widest uppercase mt-1">UI/UX & Product Designer</p>
                </div>
              </motion.div>

              {/* Floating Status */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute -top-6 -right-4 sm:-right-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-[#06000c]/80 backdrop-blur-xl shadow-lg"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white text-[10px] font-bold tracking-wider uppercase">Available for work</span>
              </motion.div>

              {/* Parallax Floating Tags */}
              <motion.div style={{ y: yBadge1 }} className="absolute top-[20%] -left-8 sm:-left-16 z-20 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                <span className="text-white/90 text-xs font-medium tracking-widest uppercase">DESIGN</span>
              </motion.div>
              
              <motion.div style={{ y: yBadge2 }} className="absolute top-[60%] -right-8 sm:-right-12 z-20 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                <span className="text-white/90 text-xs font-medium tracking-widest uppercase">RESEARCH</span>
              </motion.div>
              
              <motion.div style={{ y: yBadge3 }} className="absolute bottom-1/4 -left-6 sm:-left-12 z-20 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                <span className="text-white/90 text-xs font-medium tracking-widest uppercase">INTERACTION</span>
              </motion.div>
            </div>
          </div>

          {/* Right: Editorial Text */}
          <div className="w-full lg:w-1/2 flex flex-col gap-12 lg:pl-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-px bg-white/20" />
              <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">A LITTLE ABOUT ME</span>
            </div>

            {[
              {
                title: "WHO I AM",
                desc: "Passionate about creating digital products that balance usability, aesthetics and business goals."
              },
              {
                title: "WHAT I DO",
                desc: "UX research, wireframing, UI design, prototyping, design systems and interaction design."
              },
              {
                title: "WHAT I CARE ABOUT",
                desc: "Clarity, accessibility, meaningful interactions and thoughtful visual details."
              }
            ].map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group border-l border-white/10 pl-6 hover:border-purple-500/50 transition-colors duration-500"
              >
                <h4 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-2 group-hover:text-purple-300 transition-colors duration-500">{block.title}</h4>
                <p className="text-xl md:text-2xl font-medium tracking-tight text-white/90 leading-snug">{block.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. DESIGNER METRICS */}
        {/* ========================================================= */}
        <div className="relative w-full py-16 border-y border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { val: "01+", label: "YEARS PRACTICING DESIGN" },
              { val: "10+", label: "UI/UX PROJECTS" },
              { val: "100+", label: "DESIGN EXPLORATIONS" },
              { val: "∞", label: "CURIOSITY FOR BETTER PRODUCTS" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <span className="text-5xl md:text-6xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                  {stat.val}
                </span>
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/40 max-w-[150px]">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. VISUAL DESIGN CARDS */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">EXPERTISE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              { 
                num: "01", 
                title: "USER EXPERIENCE", 
                desc: "Understanding users and transforming problems into intuitive experiences.",
                visual: (
                  <>
                    <video 
                      src="/ux-video.mp4" 
                      autoPlay loop muted playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06000c] via-[#06000c]/80 to-transparent pointer-events-none" />
                  </>
                )
              },
              { 
                num: "02", 
                title: "VISUAL DESIGN", 
                desc: "Creating visual systems with typography, hierarchy, spacing and interaction.",
                visual: (
                  <>
                    <video 
                      src="/visual-design-video.mp4" 
                      autoPlay loop muted playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06000c] via-[#06000c]/80 to-transparent pointer-events-none" />
                  </>
                )
              },
              { 
                num: "03", 
                title: "PRODUCT THINKING", 
                desc: "Connecting user needs, business goals and meaningful product solutions.",
                visual: (
                  <>
                    <video 
                      src="/product-thinking-video.mp4" 
                      autoPlay loop muted playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06000c] via-[#06000c]/80 to-transparent pointer-events-none" />
                  </>
                )
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#06000c] hover:-translate-y-2 transition-all duration-700 ease-out cursor-default shadow-xl hover:shadow-2xl hover:shadow-purple-900/20 hover:border-purple-500/20 min-h-[400px]`}
              >
                {/* Background Visual */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {card.visual}
                </div>

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
                
                {/* Subtle Ambient Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/5 transition-all duration-700 opacity-0 group-hover:opacity-100 pointer-events-none z-0" />
                
                {/* Top Highlight Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/10 group-hover:via-purple-400/50 to-transparent transition-colors duration-700 z-10" />
                
                <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
                  <div className="flex justify-between items-start mb-auto">
                    <span className="text-white/30 font-mono text-sm tracking-widest group-hover:text-purple-300/70 transition-colors duration-700">{card.num}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-purple-400 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all duration-700" />
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-48">
                    <h4 className="text-xl sm:text-2xl font-bold text-white/90 tracking-tight group-hover:text-white group-hover:-translate-y-1 transition-all duration-700">{card.title}</h4>
                    <p className="text-white/40 text-xs sm:text-sm tracking-wider uppercase font-medium leading-relaxed group-hover:text-purple-200/80 transition-colors duration-700 max-w-sm">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* ========================================================= */}
        {/* 6. DESIGN PROCESS TIMELINE */}
        {/* ========================================================= */}
        <div className="relative w-full max-w-4xl mx-auto flex flex-col pt-10">
          <div className="flex items-center gap-4 mb-16 md:mb-24">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">MY DESIGN PROCESS</span>
          </div>

          <div className="relative flex flex-col gap-16 md:gap-24">
            {/* Timeline Line */}
            <div className="absolute left-[19px] md:left-[50%] top-0 bottom-0 w-[2px] bg-white/5 md:-translate-x-1/2" />
            
            {[
              { num: "01", title: "DISCOVER", desc: "Understand the users and problem." },
              { num: "02", title: "DEFINE", desc: "Identify the core opportunity." },
              { num: "03", title: "EXPLORE", desc: "Generate possible solutions." },
              { num: "04", title: "DESIGN", desc: "Create the visual and interaction system." },
              { num: "05", title: "TEST", desc: "Validate and refine the experience." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative flex items-center w-full"
              >
                {/* Left Text Space (Desktop Only) */}
                <div className={`hidden md:flex flex-1 justify-end pr-16 ${i % 2 === 0 ? 'invisible' : ''}`}>
                  <div className="flex flex-col gap-2 group cursor-default text-right">
                    <span className="text-white/20 font-mono text-xs">{step.num}</span>
                    <h4 className="text-3xl font-bold tracking-tight text-white/90 group-hover:text-purple-300 transition-colors duration-300">{step.title}</h4>
                    <p className="text-white/50 text-base font-light tracking-wide uppercase">{step.desc}</p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-0 md:relative md:left-auto w-10 h-10 rounded-full bg-[#06000c] border border-white/20 z-10 flex shrink-0 items-center justify-center shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40 transition-colors duration-500" />
                </div>
                
                {/* Right Text Space (Mobile Always, Desktop Alternate) */}
                <div className={`w-full md:w-auto md:flex-1 pl-16 md:pl-16 ${i % 2 !== 0 ? 'md:invisible' : ''}`}>
                  <div className="flex flex-col gap-2 group cursor-default text-left">
                    <span className="text-white/20 font-mono text-xs">{step.num}</span>
                    <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90 group-hover:text-purple-300 transition-colors duration-300">{step.title}</h4>
                    <p className="text-white/50 text-sm md:text-base font-light tracking-wide uppercase">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 7. PHILOSOPHY MOMENT */}
        {/* ========================================================= */}
        <div className="relative w-[100vw] left-1/2 -translate-x-1/2 py-32 md:py-48 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/philosophy-bg.jpg" 
              alt="Design Philosophy Statue"
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
            />
            {/* Top and bottom gradient fades to blend smoothly into the page */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#06000c] via-transparent to-[#06000c]" />
            {/* Dark overlay to ensure text legibility */}
            <div className="absolute inset-0 bg-[#06000c]/60" />
          </div>

          {/* Ambient Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 flex justify-center items-center opacity-30 pointer-events-none z-0"
          >
            <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen" />
          </motion.div>

          <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8 items-center">
            <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">DESIGN PHILOSOPHY</span>
            <div className="flex flex-col gap-2">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/90"
                style={{ fontFamily: "'Arima', sans-serif" }}
              >
                Good design gets attention.
              </motion.h2>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic"
                style={{ fontFamily: "'Arima', sans-serif" }}
              >
                Great design makes things effortless.
              </motion.h2>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 8. RESUME / JOURNEY SECTION */}
        {/* ========================================================= */}
        <div className="relative w-full flex flex-col items-center text-center gap-10">
          <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">MY JOURNEY</span>
          
          <div className="flex flex-col gap-4 max-w-2xl">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Want to explore my journey?</h3>
            <p className="text-white/60 text-lg font-light leading-relaxed">
              Take a closer look at my skills, education, experience and design work.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <Magnet strength={15} padding={20}>
              <a 
                href="/resume.pdf" 
                download
                className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300"
              >
                <span>DOWNLOAD RESUME</span>
                <Download className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              </a>
            </Magnet>
            
            <Magnet strength={10} padding={20}>
              <a 
                href="/#work" 
                className="group relative flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-300"
              >
                <span>VIEW PROJECTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Magnet>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
