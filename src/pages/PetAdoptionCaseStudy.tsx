import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/* ── CONSTANTS & VARS ── */
const EXPO = [0.16, 1, 0.3, 1] as const;

/* ── HELPERS ── */
const SectionHeader = ({ num, title }: { num: string; title: string }) => (
  <div className="mb-12 md:mb-20">
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: EXPO }}
      className="text-white/40 font-mono text-xs font-bold tracking-[0.25em]"
    >
      {num}
    </motion.span>
    <motion.h2
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: EXPO }}
      className="text-white font-bold text-3xl md:text-5xl mt-3 tracking-tight"
    >
      {title}
    </motion.h2>
  </div>
);

/* ── 01: HERO / INTRO ── */
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 150]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.05]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20 z-10 relative">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EXPO }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] w-max"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
              <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">
                CASE STUDY / 01
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EXPO }}
              className="text-white font-bold tracking-tight leading-[1.05] text-5xl md:text-7xl"
            >
              Pet Adoption App
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EXPO }}
              className="text-white/50 text-lg leading-relaxed font-light"
            >
              Designing a simpler, more emotional way to find a forever home. A seamless adoption flow connecting pet lovers with animals in need.
            </motion.p>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EXPO }}
              className="grid grid-cols-2 gap-y-6 mt-4 border-t border-white/10 pt-8"
            >
              <div>
                <span className="text-white/30 text-xs font-mono uppercase tracking-wider block mb-1">Role</span>
                <span className="text-white/80 text-sm font-medium">UI/UX Designer</span>
              </div>
              <div>
                <span className="text-white/30 text-xs font-mono uppercase tracking-wider block mb-1">Timeline</span>
                <span className="text-white/80 text-sm font-medium">6 Weeks</span>
              </div>
              <div>
                <span className="text-white/30 text-xs font-mono uppercase tracking-wider block mb-1">Platform</span>
                <span className="text-white/80 text-sm font-medium">Mobile App</span>
              </div>
              <div>
                <span className="text-white/30 text-xs font-mono uppercase tracking-wider block mb-1">Tools</span>
                <span className="text-white/80 text-sm font-medium">Figma, ProtoPie</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EXPO }}
              className="mt-4"
            >
              <button className="px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#7c3aed] hover:text-white transition-colors duration-300">
                View Prototype
              </button>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <div className="w-full lg:w-[55%] relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EXPO }}
              style={{ y, scale, opacity }}
              className="relative rounded-[2.5rem] border border-white/5 overflow-hidden shadow-[0_30px_80px_rgba(124,58,237,0.15)]"
            >
              <video 
                src="/Mockup-1791278724467.mp4" 
                autoPlay loop muted playsInline 
                className="w-full h-auto rounded-[2.5rem] object-cover" 
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── 02: OVERVIEW ── */
const OverviewSection = () => (
  <section className="py-24 md:py-32 relative border-t border-white/5">
    <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
      <SectionHeader num="02" title="Designing a simpler way to find a forever home." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: EXPO }}
        >
          <h3 className="text-white text-xl font-bold mb-4">The Problem</h3>
          <p className="text-white/40 leading-relaxed font-light text-[15px]">
            The current pet adoption process is often fragmented. Users struggle to find reliable information, resulting in choice paralysis. Shelters lack modern tools to present their animals effectively, leading to prolonged adoption times.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: EXPO }}
        >
          <h3 className="text-white text-xl font-bold mb-4">The Goal & Approach</h3>
          <p className="text-white/40 leading-relaxed font-light text-[15px]">
            Create a centralized, trustworthy platform that simplifies discovery. The design approach focused on large imagery, emotional connection, clear health data, and a transparent step-by-step application flow to build trust.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ── 03: CHALLENGE ── */
const ChallengeSection = () => {
  const challenges = [
    { num: '01', title: 'Difficult Discovery', desc: 'Overwhelming interfaces make finding the right pet frustrating.' },
    { num: '02', title: 'Missing Information', desc: 'Crucial health and behavioral data is often hidden or absent.' },
    { num: '03', title: 'Complex Applications', desc: 'Long, paper-based application forms cause user drop-off.' },
    { num: '04', title: 'Trust Deficit', desc: 'Lack of direct communication channels with shelters creates doubt.' },
  ];

  return (
    <section className="py-24 md:py-32 relative bg-[#0a0512]">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
        <SectionHeader num="03" title="The Core Challenges" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c, i) => (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EXPO }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="p-10 rounded-[2rem] border border-white/[0.05] bg-white/[0.01] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 font-bold text-6xl group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                {c.num}
              </div>
              <h4 className="text-white text-xl font-bold mb-3">{c.title}</h4>
              <p className="text-white/40 font-light text-[15px] max-w-[85%]">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── 04: USER FLOW ── */
const UserFlowSection = () => {
  const steps = ['Discover', 'Explore', 'Pet Details', 'Apply', 'Connect', 'Adopt'];
  
  return (
    <section className="py-24 md:py-32 relative">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
        <SectionHeader num="04" title="Mapping the Journey" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative mt-20">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: EXPO }}
              className="relative z-10 flex flex-row md:flex-col items-center gap-4 mb-8 md:mb-0"
            >
              <div className="w-12 h-12 rounded-full border border-[#7c3aed] bg-[#06000c] flex items-center justify-center text-white/80 font-mono text-sm shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                {i + 1}
              </div>
              <span className="text-white/60 font-medium text-sm">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── 05: WIREFRAMES ── */
const WireframesSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden bg-[#08040d]">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
        <SectionHeader num="05" title="From Structure to Experience" />
      </div>
      
      <motion.div style={{ x }} className="flex gap-8 px-6 md:px-20 mt-10 w-[150vw] md:w-[120vw]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-[280px] h-[580px] rounded-[2.5rem] border border-white/10 bg-white/[0.02] flex-shrink-0 flex flex-col items-center justify-center p-6">
            <div className="w-full h-full rounded-3xl border border-white/[0.05] bg-white/[0.01] flex flex-col p-4 gap-4">
              <div className="w-full h-32 bg-white/5 rounded-xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              <div className="w-3/4 h-6 bg-white/5 rounded-md" />
              <div className="w-1/2 h-4 bg-white/5 rounded-md" />
              <div className="mt-auto w-full h-12 bg-white/10 rounded-full" />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

/* ── 06: DESIGN SYSTEM ── */
const DesignSystemSection = () => (
  <section className="py-24 md:py-32 relative">
    <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
      <SectionHeader num="06" title="Visual Language" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 p-10 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col justify-between group hover:bg-white/[0.03] transition-colors">
          <span className="text-white/30 text-xs font-mono uppercase">Typography</span>
          <div className="mt-8">
            <div className="text-white text-5xl font-bold mb-4 font-sans">Inter</div>
            <div className="flex gap-4 opacity-50 font-sans text-xl">
              <span className="font-light">Light</span>
              <span className="font-normal">Regular</span>
              <span className="font-medium">Medium</span>
              <span className="font-bold">Bold</span>
            </div>
          </div>
        </div>
        
        <div className="p-10 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col justify-between group hover:bg-white/[0.03] transition-colors">
          <span className="text-white/30 text-xs font-mono uppercase">Colors</span>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="w-16 h-16 rounded-full bg-[#7c3aed] shadow-[0_0_20px_rgba(124,58,237,0.3)]" />
            <div className="w-16 h-16 rounded-full bg-white" />
            <div className="w-16 h-16 rounded-full bg-[#111]" />
          </div>
        </div>

        <div className="col-span-1 md:col-span-3 p-10 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
          <span className="text-white/30 text-xs font-mono uppercase block mb-8">Components</span>
          <div className="flex flex-wrap gap-8 items-center">
            <button className="px-8 py-4 rounded-full bg-[#7c3aed] text-white font-semibold text-sm hover:-translate-y-1 transition-transform">Primary Button</button>
            <button className="px-8 py-4 rounded-full bg-white/10 text-white font-semibold text-sm hover:-translate-y-1 transition-transform">Secondary Action</button>
            <div className="flex gap-2 p-2 rounded-full border border-white/10 bg-white/5">
              <div className="w-10 h-10 rounded-full bg-white/20" />
              <div className="w-10 h-10 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ── 07: HIGH-FI SHOWCASE ── */
const HighFiSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -150]);

  return (
    <section ref={ref} className="py-32 relative bg-gradient-to-b from-[#06000c] via-[#0d0718] to-[#06000c] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20 text-center relative z-20 mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white font-bold text-4xl md:text-6xl tracking-tight"
        >
          High-Fidelity Design
        </motion.h2>
      </div>
      
      <div className="flex justify-center items-center gap-6 md:gap-12 relative w-[120%] -left-[10%]">
        <motion.div style={{ y: y1 }} className="w-[280px] md:w-[320px] rounded-[3rem] overflow-hidden border-[8px] border-[#1a1a1a] shadow-2xl relative opacity-40 md:opacity-80">
          <img src="/pet-adoption-mockup.png" alt="Screen 1" className="w-full h-auto" />
        </motion.div>
        
        <motion.div style={{ y: y2 }} className="w-[300px] md:w-[380px] rounded-[3.5rem] overflow-hidden border-[10px] border-[#111] shadow-[0_40px_100px_rgba(124,58,237,0.2)] relative z-10">
          <video src="/Mockup-1791278724467.mp4" autoPlay loop muted playsInline className="w-full h-auto" />
        </motion.div>
        
        <motion.div style={{ y: y3 }} className="w-[280px] md:w-[320px] rounded-[3rem] overflow-hidden border-[8px] border-[#1a1a1a] shadow-2xl relative opacity-40 md:opacity-80">
          <img src="/pet-adoption-mockup.png" alt="Screen 3" className="w-full h-auto filter grayscale opacity-80" />
        </motion.div>
      </div>
    </section>
  );
};

/* ── 08: UX FEATURES ── */
const FeaturesSection = () => {
  const features = [
    { num: '01', title: 'Smart Pet Discovery', desc: 'Advanced filtering matching lifestyle, space, and experience level with the perfect companion.' },
    { num: '02', title: 'Detailed Profiles', desc: 'Medical history, behavioral traits, and video introductions all in one readable view.' },
    { num: '03', title: 'Simple Adoption Flow', desc: 'A transparent, step-by-step application tracker reducing anxiety and drop-offs.' }
  ];

  return (
    <section className="py-24 md:py-32 relative">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
        <SectionHeader num="08" title="Key UX Features" />
        
        <div className="flex flex-col gap-12 md:gap-24 mt-20">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: EXPO }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
            >
              <div className="w-full md:w-1/2">
                <span className="text-[#7c3aed] font-mono text-xl mb-4 block">{f.num}</span>
                <h3 className="text-white text-3xl font-bold mb-6">{f.title}</h3>
                <p className="text-white/50 leading-relaxed text-lg font-light">{f.desc}</p>
              </div>
              <div className="w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center p-8 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/10 to-transparent" />
                 {/* Abstract UI representation */}
                 <div className="w-full h-full bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col gap-4 backdrop-blur-sm">
                    <div className="w-1/2 h-8 bg-white/10 rounded-lg" />
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-full bg-white/5" />
                      <div className="flex-1 flex flex-col gap-2 justify-center">
                        <div className="w-full h-4 bg-white/10 rounded" />
                        <div className="w-3/4 h-4 bg-white/5 rounded" />
                      </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── 11: IMPACT ── */
const ImpactSection = () => (
  <section className="py-24 md:py-32 relative bg-[#7c3aed]">
    <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-white font-bold text-4xl md:text-5xl tracking-tight mb-16"
      >
        Design Impact
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { label: "Simpler Discovery", desc: "Intuitive filtering cuts search time drastically." },
          { label: "Clear Information", desc: "Transparent health records build immediate trust." },
          { label: "Faster Adoptions", desc: "A streamlined application journey removes friction." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <h4 className="text-white text-2xl font-bold mb-4">{item.label}</h4>
            <p className="text-white/80 font-medium max-w-xs">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── 12: NEXT PROJECT ── */
const NextProjectSection = () => (
  <section className="py-32 relative border-t border-white/5 group overflow-hidden cursor-pointer">
    <div className="absolute inset-0 bg-[#06000c] group-hover:bg-[#0a0512] transition-colors duration-700" />
    <div className="w-full max-w-7xl mx-auto px-6 md:px-14 lg:px-20 relative z-10 flex flex-col items-center text-center">
      <span className="text-white/40 font-mono text-sm uppercase tracking-widest mb-6 block">Next Project</span>
      <h2 className="text-white font-bold text-5xl md:text-8xl tracking-tighter mb-12 group-hover:scale-105 transition-transform duration-700 ease-out">
        Grocery App
      </h2>
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 text-white">
        <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </div>
  </section>
);


/* ── MAIN COMPONENT ── */
export default function PetAdoptionCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#06000c] text-white selection:bg-[#7c3aed] selection:text-white">
      <HeroSection />
      <OverviewSection />
      <ChallengeSection />
      <UserFlowSection />
      <WireframesSection />
      <DesignSystemSection />
      <HighFiSection />
      <FeaturesSection />
      <ImpactSection />
      <NextProjectSection />
    </div>
  );
}
