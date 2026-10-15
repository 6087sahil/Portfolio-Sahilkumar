import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────
   HUMAN EDITORIAL CONSTANTS & TIMINGS
   Restrained, purposeful motion: 16px fade-up, 0.5s, no floaters.
───────────────────────────────────────────────────────────────── */
const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;

const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}> = ({ children, delay = 0, className = '', y = 16 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   HAND-DRAWN SVG ACCENTS (Subtle human touch)
───────────────────────────────────────────────────────────────── */
const HandDrawnUnderline: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute left-0 -bottom-2 w-full h-[10px] pointer-events-none text-[#D82E54] ${className}`}
    preserveAspectRatio="none"
  >
    <path
      d="M3 10C55 4 125 3 237 8C185 11 110 12 35 11"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HandDrawnCircle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute -inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)] pointer-events-none text-[#D82E54] ${className}`}
    preserveAspectRatio="none"
  >
    <path
      d="M14 26C11 15 32 6 62 5C96 4 114 14 110 27C105 40 70 44 34 42C12 40 4 30 16 19C24 11 44 7 70 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   AUTHENTIC EDITORIAL DEVICE FRAME
   Clean titanium edge, true 9:19.5 aspect ratio, realistic drop
   shadow on paper plane, zero glowing halos.
───────────────────────────────────────────────────────────────── */
interface PhoneProps {
  src?: string;
  video?: string;
  alt: string;
  className?: string;
  caption?: string;
  priority?: boolean;
}

const EditorialPhone: React.FC<PhoneProps> = ({
  src,
  video,
  alt,
  className = '',
  caption,
  priority = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <figure className={`flex flex-col items-center w-full select-none ${className}`}>
      <div
        className="relative rounded-[36px] sm:rounded-[40px] p-[6px] sm:p-[7px] bg-[#1A1918] border border-purple-500/25 select-none w-full max-w-[280px] sm:max-w-[305px] md:max-w-[320px] shadow-purple-card hover:shadow-purple-glow transition-all duration-500"
        style={{
          boxShadow:
            '0 20px 48px -10px rgba(147, 51, 234, 0.28), 0 8px 20px -4px rgba(168, 85, 247, 0.18), 0 0 0 1px rgba(147, 51, 234, 0.2)',
        }}
      >
        {/* Screen Bezel */}
        <div className="relative rounded-[30px] sm:rounded-[34px] overflow-hidden bg-[#FAF8F5] aspect-[9/19.5] w-full border border-black/10">
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-top"
            />
          ) : src && !error ? (
            <img
              src={src}
              alt={alt}
              width={430}
              height={932}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-[#F4F1EA] p-6 pt-16 flex flex-col justify-between text-[#161513]">
              <div className="border-b border-[#161513]/10 pb-2 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[#5C5852]">
                <span>Roomly iOS</span>
                <span>Screen Mockup</span>
              </div>
              <div className="space-y-3 my-auto">
                <div className="w-3/4 h-3 bg-[#161513]/15 rounded" />
                <div className="w-full h-24 bg-[#EDE8DE] border border-[#161513]/10 rounded-xl" />
                <div className="w-1/2 h-2.5 bg-[#161513]/10 rounded" />
              </div>
              <p className="text-[10px] font-mono text-[#8E8980] text-center">{alt}</p>
            </div>
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs text-[#5C5852] font-mono text-center tracking-tight">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

/* ─────────────────────────────────────────────────────────────────
   BEFORE / AFTER WIREFRAME TO HI-FI COMPARISON
   Draggable / Interactive slider with hairline rules.
───────────────────────────────────────────────────────────────── */
const WireframeHiFiSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          isDragging.current = true;
          handleMove(e.clientX);
        }}
        onMouseUp={() => {
          isDragging.current = false;
        }}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden border border-[#161513]/15 bg-[#FAF8F5] cursor-ew-resize select-none shadow-md"
      >
        {/* Left Layer: Wireframe (Structural Blueprint) */}
        <div className="absolute inset-0 bg-[#EDE8DE] flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md bg-white border border-dashed border-[#161513]/30 rounded-2xl p-5 md:p-7 space-y-4 shadow-sm font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#161513]/15">
              <span className="text-[#8E8980] uppercase tracking-wider text-[10px]">Lo-Fi Wireframe · Step 1</span>
              <span className="px-2 py-0.5 rounded bg-[#161513]/5 text-[#161513]/70 text-[10px]">430 × 932 pt</span>
            </div>
            <div className="h-9 rounded-lg border border-dashed border-[#161513]/25 flex items-center px-3 text-[#8E8980]">
              [⌕ Search Gurgaon districts...]
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[4/3] rounded-lg border border-dashed border-[#161513]/25 flex flex-col justify-end p-2 text-[10px] text-[#8E8980]">
                Photo slot (3:2)
              </div>
              <div className="space-y-2 py-1">
                <div className="h-3 w-3/4 bg-[#161513]/15 rounded" />
                <div className="h-2 w-1/2 bg-[#161513]/10 rounded" />
                <div className="h-2 w-full bg-[#161513]/10 rounded" />
                <div className="h-5 w-20 bg-[#161513]/10 rounded mt-2" />
              </div>
            </div>
            <div className="pt-2 border-t border-[#161513]/10 flex items-center justify-between text-[11px] text-[#5C5852]">
              <span>Rule tags: Non-smoker · Quiet</span>
              <span className="text-[#D82E54] font-semibold">₹15,000/mo</span>
            </div>
          </div>
        </div>

        {/* Right Layer: High-Fidelity Final UI */}
        <div
          className="absolute inset-y-0 right-0 overflow-hidden bg-[#FAF8F5] flex items-center justify-center p-6 md:p-10"
          style={{ width: `${100 - sliderPos}%` }}
        >
          <div
            className="absolute inset-y-0 right-0 w-[896px] max-w-none flex items-center justify-center p-6 md:p-10 pointer-events-none"
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
          >
            <div className="w-full max-w-md bg-[#FDEAF0] border border-[#560E22]/15 rounded-2xl p-5 md:p-7 space-y-4 shadow-sm text-[#161513]">
              <div className="flex justify-between items-center pb-2 border-b border-[#560E22]/10">
                <span className="text-[#560E22] font-semibold text-xs tracking-tight">Final UI · Production Screen</span>
                <span className="px-2 py-0.5 rounded-full bg-[#560E22] text-white text-[10px] font-medium">Verified Spec</span>
              </div>
              <div className="h-9 rounded-xl bg-white border border-[#560E22]/15 flex items-center justify-between px-3 text-xs shadow-sm">
                <span className="text-[#161513]">DLF Phase 5, Gurgaon</span>
                <span className="text-[#D82E54] font-medium text-[11px]">Filters (3)</span>
              </div>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm relative">
                  <img
                    src="/roomly/room_detail_screen.png"
                    alt="Hi-Fi Room Preview"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-[#161513] leading-snug">Private Balcony Suite</h4>
                  <p className="text-xs text-[#5C5852]">Sector 57 · 2BHK Shared</p>
                  <div className="flex gap-1 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#560E22] border border-[#560E22]/15">
                      Non-Smoker
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#560E22] pt-1">₹15,000 <span className="text-xs font-normal text-[#5C5852]">/mo</span></p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#560E22]/10 flex items-center justify-between text-xs">
                <span className="text-[#5C5852] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4FA765]" />
                  Flatmate: Mike (Cleanliness 94%)
                </span>
                <button className="px-3 py-1 rounded-lg bg-[#560E22] text-white text-xs font-medium">
                  View Room
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Draggable Divider Line */}
        <div
          className="absolute inset-y-0 w-[2px] bg-[#D82E54] pointer-events-none z-20 shadow-sm"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-[#D82E54] flex items-center justify-center shadow-md text-[#D82E54] text-xs font-mono font-bold">
            ↔
          </div>
        </div>

        {/* Labels at Bottom Corners */}
        <div className="absolute bottom-3 left-4 pointer-events-none z-10 text-[11px] font-mono uppercase tracking-wider text-[#5C5852] bg-[#FAF8F5]/85 px-2 py-0.5 rounded border border-[#161513]/10">
          Lo-Fi Blueprint
        </div>
        <div className="absolute bottom-3 right-4 pointer-events-none z-10 text-[11px] font-mono uppercase tracking-wider text-[#560E22] bg-[#FAF8F5]/85 px-2 py-0.5 rounded border border-[#560E22]/20 font-medium">
          Hi-Fi Design
        </div>
      </div>
      <p className="text-center font-mono text-xs text-[#5C5852] mt-2.5">
        Fig. 5 — Drag the divider horizontally to compare the structural layout grid against the final visual system.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   MAIN ROOMLY CASE STUDY COMPONENT
───────────────────────────────────────────────────────────────── */
export default function RoomlyCaseStudy() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const swatches = [
    { name: 'Baby Pink', hex: '#FDEAF0', role: 'App Canvas Base', border: true },
    { name: 'Dark Burgundy', hex: '#560E22', role: 'Primary CTA & Headers', dark: true },
    { name: 'Surface Pink', hex: '#FEEFF3', role: 'Card & Sheet Surface', border: true },
    { name: 'Warm Charcoal', hex: '#161513', role: 'Primary Typography', dark: true },
    { name: 'Muted Ink', hex: '#776B6E', role: 'Secondary Body Copy' },
    { name: 'Hairline Rule', hex: '#E5E5EA', role: 'Dividers & Borders', border: true },
    { name: 'Verified Green', hex: '#4FA765', role: 'Safety & Trust Check' },
  ];

  return (
    <article className="min-h-screen bg-[#F4F1EA] text-[#161513] font-sans antialiased selection:bg-[#D82E54]/15 selection:text-[#161513]">
      {/* ─────────────────────────────────────────────────────────────
         00 — MINIMAL EDITORIAL TOP BAR
         Clean back link and quiet project title, no floating pills.
      ───────────────────────────────────────────────────────────── */}
      <header className="w-full border-b border-[#161513]/10 bg-[#F4F1EA]/95 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between text-xs font-mono">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-[#5C5852] hover:text-[#161513] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Sahil Kumar / Portfolio</span>
          </Link>
          <div className="flex items-center gap-4 text-[#8E8980]">
            <span className="hidden sm:inline">Case Study · 01</span>
            <span className="w-1 h-1 rounded-full bg-[#D82E54]" />
            <span className="text-[#161513] font-medium">Roomly App</span>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
         01 — ASYMMETRIC HERO SECTION
         Left: Big title, 1-sentence summary, meta table.
         Right: Cropped phone slightly tilted, real shadow, no glow.
      ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 md:pt-20 pb-20 md:pb-28 border-b border-[#161513]/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Left Column (Cols 1-7) */}
            <div className="lg:col-span-7 flex flex-col">
              <FadeUp>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#FAF8F5] border border-[#161513]/15 text-[11px] font-mono uppercase tracking-wider text-[#5C5852]">
                    Mobile UX Design · 2024
                  </span>
                  <span className="text-xs font-mono text-[#D82E54] font-medium">
                    Self-Initiated Case Study
                  </span>
                </div>

                <h1 className="font-serif text-[clamp(3.8rem,9vw,8rem)] font-normal tracking-[-0.03em] leading-[0.92] text-[#161513] mb-6">
                  Roomly
                </h1>

                <p className="text-xl sm:text-2xl md:text-[1.65rem] text-[#161513] font-light leading-[1.38] tracking-tight max-w-[55ch] mb-10">
                  I redesigned how young urban renters find shared apartments—solving for{' '}
                  <span className="relative inline-block font-normal">
                    roommate chemistry
                    <HandDrawnUnderline />
                  </span>{' '}
                  first, rather than treating properties as sterile square-footage listings.
                </p>
              </FadeUp>

              {/* Meta List Table with Hairline Rules */}
              <FadeUp delay={0.1}>
                <div className="border-t border-[#161513]/15 text-xs font-mono divide-y divide-[#161513]/10">
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <span className="col-span-4 text-[#8E8980] uppercase tracking-wider">Role</span>
                    <span className="col-span-8 text-[#161513]">Product Designer · User Research, Wireframing, Visual System</span>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <span className="col-span-4 text-[#8E8980] uppercase tracking-wider">Timeline</span>
                    <span className="col-span-8 text-[#161513]">6 Weeks · Q1 2024</span>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <span className="col-span-4 text-[#8E8980] uppercase tracking-wider">Platform</span>
                    <span className="col-span-8 text-[#161513]">Native iOS · 430 × 932 pt Canvas</span>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <span className="col-span-4 text-[#8E8980] uppercase tracking-wider">Tools</span>
                    <span className="col-span-8 text-[#161513]">Figma, FigJam, Pen & Paper, User Interviews</span>
                  </div>
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <span className="col-span-4 text-[#8E8980] uppercase tracking-wider">Prototype</span>
                    <span className="col-span-8">
                      <a
                        href="https://www.figma.com/proto/B3oFSh9ObaTE5YMCLYamwa/Roommate---Rooms-app?node-id=243-2171&t=iD2BAYVWj3NWawEU-1"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#D82E54] hover:underline font-semibold"
                      >
                        <span>Live Figma Prototype</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </span>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Right Column (Cols 8-12): One cropped phone tilted, real shadow */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center pt-4 lg:pt-0">
              <FadeUp delay={0.15} className="w-full max-w-[270px] sm:max-w-[290px] lg:max-w-[310px]">
                <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <EditorialPhone
                    src="/roomly/home_screen.png"
                    alt="Roomly Home Screen showing room feed and recommended flatmates"
                    priority
                  />
                  {/* Human margin note badge */}
                  <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-[#FAF8F5] border border-[#161513]/15 rounded-lg p-2.5 shadow-sm max-w-[175px] rotate-2 z-10">
                    <p className="font-handwriting text-base text-[#161513] leading-tight">
                      Final home feed: Rooms and flatmates in one view.
                    </p>
                  </div>
                </div>
              </FadeUp>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         02 — THE REAL PROBLEM (Written narrative, not 3 equal cards)
         Broken grid: Wide narrative on left, marginalia & numbers on right.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#161513]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Header / Marginalia (Cols 1-4) */}
            <div className="lg:col-span-4">
              <FadeUp>
                <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-2">
                  01 / Field Notes
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#161513] tracking-tight leading-snug">
                  What I discovered when talking to renters.
                </h2>
                
                {/* Real Inline Stat Callout */}
                <div className="mt-8 p-5 bg-[#FAF8F5] border border-[#161513]/10 rounded-xl space-y-2">
                  <div className="pt-1 pb-1">
                    <span className="relative inline-block font-serif text-4xl text-[#D82E54] font-normal">
                      7 of 10
                      <HandDrawnCircle />
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5852] font-mono leading-relaxed pt-1">
                    people I interviewed in Gurgaon and Bangalore had moved out of a shared flat within four months of signing.
                  </p>
                </div>

                <div className="mt-6 p-5 bg-[#FAF8F5] border border-[#161513]/10 rounded-xl space-y-2">
                  <span className="font-serif text-4xl text-[#161513] font-normal block">
                    14+ days
                  </span>
                  <p className="text-xs text-[#5C5852] font-mono leading-relaxed">
                    wasted browsing outdated listings and coordinating fragmented WhatsApp group chats before seeing an apartment in person.
                  </p>
                </div>
              </FadeUp>
            </div>

            {/* Right Narrative (Cols 5-12) */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-[#161513]/85 text-lg sm:text-xl font-light leading-relaxed max-w-[65ch]">
              <FadeUp delay={0.08}>
                <p>
                  Every major rental platform in India—from Housing.com to NoBroker—treats apartment hunting as an inventory problem. They optimize for broker fees, square footage, and security deposits. But for young people relocating to high-stress tech corridors like Gurgaon or Bangalore, the biggest gamble isn't the distance to the metro.
                </p>
              </FadeUp>

              <FadeUp delay={0.14}>
                <p className="text-[#161513] font-normal">
                  The biggest gamble is the stranger sleeping across the corridor.
                </p>
              </FadeUp>

              <FadeUp delay={0.18}>
                <p>
                  In traditional apps, roommate chemistry is a total black box until after the lease is signed. You might verify that the bedroom has air conditioning and a balcony, but you have no clue whether the current occupant works night shifts, throws impromptu parties on Tuesdays, or expects a strictly vegetarian kitchen.
                </p>
              </FadeUp>

              {/* Oversized Editorial Pull Quote */}
              <FadeUp delay={0.22}>
                <blockquote className="my-6 pl-6 border-l-2 border-[#D82E54] py-2">
                  <p className="font-serif italic text-2xl sm:text-3xl text-[#161513] leading-snug">
                    “I don’t care if the living room has Italian marble. If the person across from me throws parties on Tuesday nights when I have a 9 AM standup, I'm miserable.”
                  </p>
                  <cite className="block text-xs font-mono text-[#5C5852] uppercase tracking-wider mt-3 not-italic">
                    — Tanya M., 26, Product Analyst relocating from Pune to Cyber City
                  </cite>
                </blockquote>
              </FadeUp>

              <FadeUp delay={0.26}>
                <p>
                  This insight shifted the entire project. Roomly couldn't just be another property listing catalogue. It had to be a tool that matches <span className="font-medium text-[#161513]">people first</span>, and spaces second.
                </p>
              </FadeUp>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         03 — PROCESS ARTIFACTS: Sketches, Scrapped Ideas, & Redlines
         Human evidence: Hand sketches slot, crossed-out idea, annotated UI.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#161513]/10 bg-[#FAF8F5]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-2">
              02 / Process & Scrapped Ideas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#161513] tracking-tight">
              Honest process: What worked, and what died on paper.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Artifact 1: Notebook Sketches Placeholder Slot (Cols 1-7) */}
            <div className="lg:col-span-7 bg-[#F4F1EA] border border-dashed border-[#161513]/25 rounded-2xl p-6 sm:p-8 relative">
              {/* Tape detail top-left */}
              <div className="absolute -top-3 left-8 w-20 h-6 bg-[#EAE5DC]/80 rotate-[-3deg] border border-[#161513]/10 shadow-xs pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-[#161513]/10 mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-[#5C5852]">
                  Process Artifact · Early Ideation
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#161513]/15 font-mono text-[10px] text-[#D82E54] font-semibold">
                  Field Artifact Slot
                </span>
              </div>

              {/* Hand Sketch Mockup Canvas */}
              <div className="w-full aspect-[16/10] bg-[#FAF8F5] border border-[#161513]/10 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
                {/* Subtle Grid Paper Pattern */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #161513 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                <div className="relative z-10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#8E8980] text-[11px]">
                    <span>[NOTEBOOK PAGE 14 · DEC 18]</span>
                    <span className="font-handwriting text-base text-[#D82E54]">"Room vs Person toggle"</span>
                  </div>
                  
                  {/* Rough sketch representation */}
                  <div className="space-y-2 pt-2 text-[#5C5852]">
                    <div className="h-6 w-48 border border-dashed border-[#161513]/30 rounded flex items-center px-2 text-[10px]">
                      [ Search: DLF Phase 5 ]
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="h-20 border border-dashed border-[#161513]/25 rounded p-2 text-[10px]">
                        Draft Card A: Photo on top, price below. (Users ignored roommate info)
                      </div>
                      <div className="h-20 border border-solid border-[#D82E54]/40 bg-[#D82E54]/5 rounded p-2 text-[10px]">
                        Draft Card B: Split tile showing flatmate avatar + habit chips. Winner!
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-3 border-t border-[#161513]/10 flex justify-between items-center text-[11px] font-mono text-[#8E8980]">
                  <span>Sketch Index #04</span>
                  <span className="text-[#161513]">Paper exploration before Figma</span>
                </div>
              </div>

              <p className="mt-3.5 font-mono text-xs text-[#5C5852]">
                Fig. 1 — Early notebook sketches testing whether to lead with rent or flatmate habits. (Asset placeholder: replace with your phone photo of physical sketchbook).
              </p>
            </div>

            {/* Artifact 2: The Crossed-Out Idea (Cols 8-12) */}
            <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#161513]/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#D82E54]/10 text-[#D82E54] font-mono text-xs font-semibold mb-4">
                  <span>✕ Killed Feature</span>
                </div>

                <h3 className="font-serif text-2xl text-[#161513] tracking-tight line-through decoration-[#D82E54] decoration-2 mb-3">
                  The 20-Question Personality Matchmaker Quiz
                </h3>

                <div className="space-y-3 text-sm text-[#5C5852] font-light leading-relaxed">
                  <p>
                    <strong className="font-medium text-[#161513]">What I tried first:</strong> In version 0.1, I built a mandatory onboarding quiz asking tenants about introversion scores, cleaning frequency on a 1–5 scale, and cooking habits.
                  </p>
                  <p>
                    <strong className="font-medium text-[#D82E54]">Why it died:</strong> 8 of 10 user testing participants abandoned the flow by question four. People told me it felt patronizing, intrusive, and uncomfortably similar to a dating app.
                  </p>
                  <p>
                    <strong className="font-medium text-[#161513]">What I replaced it with:</strong> Four non-negotiable lifestyle pills right on the property card (Non-Smoker, Pet Friendly, Quiet Hours, WFH). Clean, factual, zero pseudo-psychology.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#161513]/10 font-handwriting text-lg text-[#D82E54]">
                “Don't over-engineer trust. Give people the facts and let them message each other.”
              </div>
            </div>

          </div>

          {/* Artifact 3: Annotated Real Screenshot with Human Callouts */}
          <div className="mt-12 bg-[#F4F1EA] border border-[#161513]/15 rounded-2xl p-6 sm:p-10">
            <div className="max-w-xl mb-8">
              <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-1">
                Fig. 2 — Design Annotations
              </span>
              <h3 className="font-serif text-2xl text-[#161513]">
                Micro-decisions on the Room Details Screen
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Phone Centerpiece */}
              <div className="md:col-span-5 flex justify-center">
                <div className="w-[240px] sm:w-[260px]">
                  <EditorialPhone
                    src="/roomly/room_detail_screen.png"
                    alt="Roomly Room Detail screen showing balcony, verified inventory, and flatmate preview"
                  />
                </div>
              </div>

              {/* Editorial Callouts */}
              <div className="md:col-span-7 flex flex-col gap-6 font-mono text-xs">
                
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#161513]/10 relative">
                  <span className="text-[#D82E54] font-bold block mb-1">Callout 01 · Hero Balcony View</span>
                  <p className="text-[#5C5852] font-sans text-sm leading-relaxed">
                    Renters told me they fear dark, windowless rooms in Gurgaon builder floors. The full-bleed natural light header immediately answers whether the room feels claustrophobic.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#161513]/10 relative">
                  <span className="text-[#D82E54] font-bold block mb-1">Callout 02 · Factual Inventory, Not Prose</span>
                  <p className="text-[#5C5852] font-sans text-sm leading-relaxed">
                    Replaced lengthy paragraphs with standardized icons (Bed, AC, Attached Bath, Dining). Users can verify essentials in 2 seconds during a lunch break scroll.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#161513]/10 relative">
                  <span className="text-[#D82E54] font-bold block mb-1">Callout 03 · Persistent "Message Mike" CTA</span>
                  <p className="text-[#5C5852] font-sans text-sm leading-relaxed">
                    Instead of a generic "Schedule Visit" that pings an unresponsive broker, the button connects directly to the current tenant living in the flat.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         04 — USER PERSONA (Single clean page-style dossier layout)
         NOT 4 glass cards. Looks like an authentic field interview sheet.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#161513]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-2">
              03 / Persona Dossier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#161513] tracking-tight">
              Synthesizing 10 interviews into one core user reality.
            </h2>
          </div>

          <div className="bg-[#FAF8F5] border border-[#161513]/15 rounded-2xl p-8 md:p-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Persona Profile Column (Cols 1-4) */}
              <div className="lg:col-span-4 flex flex-col items-start border-b lg:border-b-0 lg:border-r border-[#161513]/10 pb-8 lg:pb-0 lg:pr-8">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#161513]/20 bg-[#EDE8DE] mb-4">
                  <img
                    src="/roomly/reviewer_avatar.png"
                    alt="Persona Avatar - Priya"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="font-serif text-2xl text-[#161513] font-semibold">Priya & Arjun</h3>
                <span className="font-mono text-xs text-[#8E8980] uppercase tracking-wider block mt-0.5 mb-4">
                  Relocating Tech Professionals · Age 24 & 26
                </span>
                
                <div className="w-full space-y-2 pt-4 border-t border-[#161513]/10 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-[#161513]/5">
                    <span className="text-[#8E8980]">Current City:</span>
                    <span className="text-[#161513]">Pune / Bangalore</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#161513]/5">
                    <span className="text-[#8E8980]">Destination:</span>
                    <span className="text-[#161513]">Gurgaon (Cyber City)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#161513]/5">
                    <span className="text-[#8E8980]">Budget:</span>
                    <span className="text-[#161513]">₹14,000 – ₹20,000 / mo</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8E8980]">Move-in Window:</span>
                    <span className="text-[#D82E54] font-medium">Under 2 Weeks</span>
                  </div>
                </div>
              </div>

              {/* Persona Insights Grid (Cols 5-12) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                
                <div className="p-5 rounded-xl bg-[#F4F1EA] border border-[#161513]/10 space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#D82E54] font-bold">
                    Primary Goals
                  </h4>
                  <ul className="space-y-1.5 text-[#5C5852] font-light leading-relaxed list-disc list-inside">
                    <li>Find a verified room within a 20-minute commute to work.</li>
                    <li>Verify flatmate daily rhythms (WFH vs in-office, quiet hours).</li>
                    <li>Schedule in-person visits without handing phone numbers to 10 brokers.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-[#F4F1EA] border border-[#161513]/10 space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#161513] font-bold">
                    Daily Frustrations
                  </h4>
                  <ul className="space-y-1.5 text-[#5C5852] font-light leading-relaxed list-disc list-inside">
                    <li>Misleading photos: 0.5x wide-angle shots hiding damp walls and small rooms.</li>
                    <li>No way to filter by lifestyle (smoking, pets, dietary rules).</li>
                    <li>Leads dumped into chaotic WhatsApp group threads where context dies.</li>
                  </ul>
                </div>

                <div className="sm:col-span-2 p-5 rounded-xl bg-[#EDE8DE]/70 border border-[#161513]/10">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#8E8980] block mb-1">
                    Design Mandate
                  </span>
                  <p className="font-serif italic text-lg text-[#161513] leading-snug">
                    “If Roomly cannot tell me who lives in the apartment before I leave the office to visit, it has failed me just like Housing.com.”
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         05 — WIREFRAME TO HI-FI (Simple interactive comparison)
         Plain and clear before/after with hairline details.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#161513]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mb-8">
            <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-2">
              04 / Wireframe to Hi-Fi
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#161513] tracking-tight">
              From layout constraints to production craft.
            </h2>
            <p className="text-base text-[#5C5852] font-light leading-relaxed mt-3">
              I began with strict 16px margins and a two-zone hierarchy in low-fidelity wireframes before layering in Roomly’s soft paper palette, typography, and contrast checks.
            </p>
          </div>

          <WireframeHiFiSlider />

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         06 — KEY FEATURE SCREENS (3-4 Large Screens, No Tab Switcher)
         Each screen has:
         1. Large high-res screen
         2. One sentence on the decision behind it
         3. A small "what I tried first" note
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#161513]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-2">
              05 / Key Screens & Decisions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#161513] tracking-tight">
              Four screens that shaped the core product.
            </h2>
            <p className="text-base text-[#5C5852] font-light leading-relaxed mt-2">
              Each view was built to eliminate one specific friction point discovered during interviews.
            </p>
          </div>

          <div className="space-y-24 md:space-y-32">
            
            {/* Screen 1: Home Discovery Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-[260px] sm:w-[280px]">
                  <EditorialPhone
                    src="/roomly/home_screen.png"
                    alt="Roomly Home Discovery screen"
                    caption="Fig. 6A — Primary Discovery Feed (iOS)"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-5 max-w-[55ch]">
                <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest">
                  Screen 01 · Discovery Architecture
                </span>
                <h3 className="font-serif text-3xl text-[#161513] tracking-tight">
                  Dual-Feed Home Screen
                </h3>
                <p className="text-lg text-[#161513] font-normal leading-relaxed">
                  I split the feed into two equal browsing lanes—available rooms and recommended flatmates—so users don’t have to choose between searching for a space or searching for a person.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#161513]/10 text-xs font-mono text-[#5C5852] space-y-1">
                  <span className="text-[#D82E54] font-bold block uppercase tracking-wider">What I tried first:</span>
                  <p className="font-sans text-sm text-[#5C5852] font-light">
                    I initially placed flatmate profiles behind a separate bottom navigation tab. Testing showed 80% of users never opened that tab—they expected to see who lived in the neighborhood directly within their room feed.
                  </p>
                </div>
              </div>
            </div>

            {/* Screen 2: Precision Filter Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <div className="lg:col-span-7 lg:order-1 order-2 flex flex-col gap-5 max-w-[55ch]">
                <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest">
                  Screen 02 · Constraint System
                </span>
                <h3 className="font-serif text-3xl text-[#161513] tracking-tight">
                  Precision Filter Sheet
                </h3>
                <p className="text-lg text-[#161513] font-normal leading-relaxed">
                  I consolidated budget ranges, room types, and non-negotiable lifestyle rules into a single bottom sheet with instant live result counts.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#161513]/10 text-xs font-mono text-[#5C5852] space-y-1">
                  <span className="text-[#D82E54] font-bold block uppercase tracking-wider">What I tried first:</span>
                  <p className="font-sans text-sm text-[#5C5852] font-light">
                    I first designed a multi-step modal wizard. Participants disliked having to tap "Next" three times just to see if any rooms met their budget in Sector 54. A single scrollable sheet with immediate feedback reduced filter abandonment.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5 lg:order-2 order-1 flex justify-center">
                <div className="w-[260px] sm:w-[280px]">
                  <EditorialPhone
                    src="/roomly/filters_screen.png"
                    alt="Roomly Filters screen with budget slider and lifestyle rules"
                    caption="Fig. 6B — Single-sheet constraint filter"
                  />
                </div>
              </div>
            </div>

            {/* Screen 3: Room Details & Living Context */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-[260px] sm:w-[280px]">
                  <EditorialPhone
                    src="/roomly/room_detail_screen.png"
                    alt="Roomly Room Detail screen with verified balcony view"
                    caption="Fig. 6C — Room specs & flatmate profile preview"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-5 max-w-[55ch]">
                <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest">
                  Screen 03 · Detail Transparency
                </span>
                <h3 className="font-serif text-3xl text-[#161513] tracking-tight">
                  Room Details & Living Context
                </h3>
                <p className="text-lg text-[#161513] font-normal leading-relaxed">
                  I placed the existing flatmate's profile and verified inventory right below the hero photo, before legal and lease terms.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#161513]/10 text-xs font-mono text-[#5C5852] space-y-1">
                  <span className="text-[#D82E54] font-bold block uppercase tracking-wider">What I tried first:</span>
                  <p className="font-sans text-sm text-[#5C5852] font-light">
                    Earlier mockups had the security deposit terms taking up the first screenful. Testers scrolled straight past the numbers to see who was living in the flat. Prioritizing human context mirrored real user behavior.
                  </p>
                </div>
              </div>
            </div>

            {/* Screen 4: Roommate Match Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <div className="lg:col-span-7 lg:order-1 order-2 flex flex-col gap-5 max-w-[55ch]">
                <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest">
                  Screen 04 · People First
                </span>
                <h3 className="font-serif text-3xl text-[#161513] tracking-tight">
                  Roommate Discovery & Mutual Alignment
                </h3>
                <p className="text-lg text-[#161513] font-normal leading-relaxed">
                  I replaced vague "compatibility scores" with concrete habit badges (Cleanliness, Sleep Schedule, Dietary preference) so users can make an informed choice on their own terms.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#161513]/10 text-xs font-mono text-[#5C5852] space-y-1">
                  <span className="text-[#D82E54] font-bold block uppercase tracking-wider">What I tried first:</span>
                  <p className="font-sans text-sm text-[#5C5852] font-light">
                    My v1 design featured an animated "94% Match" badge. Every single interview subject asked what that number meant: "94% of what?" Replacing the score with factual tags built far greater trust.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5 lg:order-2 order-1 flex justify-center">
                <div className="w-[260px] sm:w-[280px]">
                  <EditorialPhone
                    src="/roomly/onboarding_2.png"
                    alt="Roomly Roommate matching profile screen"
                    caption="Fig. 6D — Transparent habit tags over arbitrary scores"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         07 — OPTIONAL DARK SHOWCASE SECTION
         A single, intentional, exhibition-like dark gallery where the final
         iOS screens pop against warm deep black (#121110).
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-[#121110] text-[#F4F1EA] border-y border-[#161513]/20 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="max-w-2xl mb-16 text-left">
            <span className="font-mono text-xs text-[#D82E54] uppercase tracking-widest block mb-2 font-semibold">
              Final UI Gallery · Exhibition
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              The high-fidelity iOS interface in context.
            </h2>
            <p className="text-base text-[#FAF8F5]/60 font-light leading-relaxed mt-3">
              Designed around soft pink surfaces (<span className="text-[#FDEAF0] font-mono">#FDEAF0</span>) that reduce anxiety during high-stakes housing relocations.
            </p>
          </div>

          {/* Exhibition Screen Layout: 3 screens staggered on paper stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <EditorialPhone
                src="/roomly/filters_screen.png"
                alt="Filters Screen"
                className="w-[220px] sm:w-[240px]"
                caption="01 · Constraint Engine"
              />
            </div>
            <div className="flex flex-col items-center -translate-y-4 md:-translate-y-8">
              <EditorialPhone
                video="/Mockup-1791278724467.mp4"
                src="/roomly/home_screen.png"
                alt="Roomly Live App Prototype Walkthrough"
                className="w-[250px] sm:w-[270px]"
                caption="02 · Live Prototype Motion"
              />
            </div>
            <div className="flex flex-col items-center">
              <EditorialPhone
                src="/roomly/room_detail_screen.png"
                alt="Room Detail Screen"
                className="w-[220px] sm:w-[240px]"
                caption="03 · Verified Living Spec"
              />
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="https://www.figma.com/proto/B3oFSh9ObaTE5YMCLYamwa/Roommate---Rooms-app?node-id=243-2171&t=iD2BAYVWj3NWawEU-1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#121110] font-semibold text-xs hover:bg-[#D82E54] hover:text-white transition-all shadow-md font-mono uppercase tracking-wider"
            >
              <span>Inspect Full Figma Flow</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         08 — DESIGN SYSTEM (Tidy Swatch Row & Understated Type Specimen)
         Clean swatches with hex codes, type scale, component specimen.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#161513]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-2">
              06 / Visual Foundation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#161513] tracking-tight">
              The Roomly Design Tokens
            </h2>
            <p className="text-base text-[#5C5852] font-light leading-relaxed mt-2">
              An understated palette built on warm off-whites, baby pink surfaces, and high-contrast dark burgundy typography.
            </p>
          </div>

          {/* Color Swatches Grid */}
          <div className="bg-[#FAF8F5] border border-[#161513]/15 rounded-2xl p-6 sm:p-8 mb-10">
            <div className="flex justify-between items-center pb-4 border-b border-[#161513]/10 mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C5852]">
                Color Tokens · Click to copy hex
              </span>
              <span className="font-mono text-xs text-[#8E8980]">
                {copiedHex ? `Copied ${copiedHex}!` : '7 Core Swatches'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {swatches.map((swatch) => (
                <button
                  key={swatch.name}
                  onClick={() => handleCopyHex(swatch.hex)}
                  className="flex flex-col text-left p-3 rounded-xl border border-[#161513]/10 bg-white hover:border-[#D82E54] transition-colors group cursor-pointer"
                >
                  <div
                    className={`w-full aspect-square rounded-lg mb-2.5 ${
                      swatch.border ? 'border border-[#161513]/10' : ''
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-xs font-semibold text-[#161513] truncate">{swatch.name}</span>
                  <span className="text-[11px] font-mono text-[#8E8980] group-hover:text-[#D82E54] transition-colors">
                    {swatch.hex}
                  </span>
                  <span className="text-[10px] text-[#5C5852] font-light mt-1 truncate">
                    {swatch.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Specimen & Components */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Typography Specimen */}
            <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#161513]/15 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="pb-3 border-b border-[#161513]/10 flex justify-between items-center text-xs font-mono">
                <span className="text-[#5C5852] uppercase tracking-wider">Type Specimen</span>
                <span className="text-[#8E8980]">Plus Jakarta Sans + Hedvig Serif</span>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-[#161513]/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] block mb-1">
                    Display Title · Plus Jakarta Sans (SemiBold)
                  </span>
                  <p className="text-3xl font-semibold text-[#161513] tracking-tight">
                    Find Your Room & People
                  </p>
                </div>

                <div className="pb-4 border-b border-[#161513]/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] block mb-1">
                    Editorial Accent · Hedvig Letters Serif
                  </span>
                  <p className="font-serif text-2xl text-[#560E22] italic">
                    ₹15,000 / month · DLF Phase 5
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] block mb-1">
                    Body Copy · SF Pro / Inter (Regular, 15pt)
                  </span>
                  <p className="text-sm text-[#5C5852] font-light leading-relaxed max-w-prose">
                    Private room with private balcony in a furnished 3BHK flat. Looking for a working professional who values quiet hours past 11 PM.
                  </p>
                </div>
              </div>
            </div>

            {/* Component Cards Specimen */}
            <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#161513]/15 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="pb-3 border-b border-[#161513]/10 text-xs font-mono text-[#5C5852] uppercase tracking-wider">
                Micro-Components
              </div>

              {/* Roommate preview pill component */}
              <div className="p-3.5 bg-white border border-[#161513]/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EDE8DE] flex items-center justify-center font-mono text-xs font-bold text-[#161513]">
                    MK
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#161513]">Mike Chen</h5>
                    <p className="text-[10px] text-[#5C5852]">Software Engineer · Non-Smoker</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#4FA765]/10 text-[#4FA765] text-[10px] font-mono font-medium">
                  94% Match
                </span>
              </div>

              {/* Action Button Specimen */}
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl bg-[#560E22] text-white text-xs font-medium text-center">
                  Message Mike
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-white border border-[#161513]/15 text-[#161513] text-xs font-medium text-center">
                  Book Visit
                </button>
              </div>

              {/* Filter chips specimen */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Attached Bath', 'Balcony', 'Non-Smoker', 'Pet Friendly', 'AC'].map((chip) => (
                  <span
                    key={chip}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#161513]/10 text-[11px] text-[#5C5852]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         09 — HONEST OUTCOMES & LEARNINGS
         3-4 honest first-person bullets, including what didn't work.
         Then a simple next project link.
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#161513]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-2">
              07 / Reflection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#161513] tracking-tight">
              What worked, what failed, and what I'd change.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#161513]/15 space-y-2">
              <span className="font-mono text-xs text-[#4FA765] font-semibold uppercase tracking-wider block">
                01 · What Worked
              </span>
              <h3 className="font-serif text-xl text-[#161513] font-semibold">
                Lifestyle pills cut awkward chats
              </h3>
              <p className="text-sm text-[#5C5852] font-light leading-relaxed">
                Surfacing non-negotiable lifestyle habits directly on the discovery cards immediately eliminated the standard 15-minute interrogation dance on WhatsApp. Testers knew within 5 seconds if a household was an alignment match.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#161513]/15 space-y-2">
              <span className="font-mono text-xs text-[#4FA765] font-semibold uppercase tracking-wider block">
                02 · What Worked
              </span>
              <h3 className="font-serif text-xl text-[#161513] font-semibold">
                Single-sheet filter sheet
              </h3>
              <p className="text-sm text-[#5C5852] font-light leading-relaxed">
                Moving from multi-page questionnaires to a single bottom sheet with live matching counters tripled the number of filters applied per user session during evaluation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#161513]/15 space-y-2">
              <span className="font-mono text-xs text-[#D82E54] font-semibold uppercase tracking-wider block">
                03 · What Failed & Got Scrapped
              </span>
              <h3 className="font-serif text-xl text-[#161513] font-semibold">
                The automated deposit calculator
              </h3>
              <p className="text-sm text-[#5C5852] font-light leading-relaxed">
                I spent a week designing a complex shared deposit splitting calculator that accounted for variable utility splits. In usability tests, people were overwhelmed. Users simply wanted to see their exact fixed monthly share without entering utility formulas. I scrapped it in favor of a clear, fixed rent line.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#161513]/15 space-y-2">
              <span className="font-mono text-xs text-[#161513] font-semibold uppercase tracking-wider block">
                04 · What I'd Do Next
              </span>
              <h3 className="font-serif text-xl text-[#161513] font-semibold">
                Verified leaseholder endorsements
              </h3>
              <p className="text-sm text-[#5C5852] font-light leading-relaxed">
                If I took this project into production, I would design a verified past-roommate review system (similar to Airbnb guest reviews) validating cleanliness, quiet hours, and bill timeliness to build durable tenant trust.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
         10 — SIMPLE NEXT PROJECT LINK
         Quiet, print-like transition, no giant neon buttons.
      ───────────────────────────────────────────────────────────── */}
      <footer className="py-20 md:py-28 bg-[#F4F1EA]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-[#8E8980] uppercase tracking-widest block mb-1">
              Have a Project in Mind?
            </span>
            <Link
              to="/#contact"
              className="group inline-flex items-center gap-3 font-serif text-3xl sm:text-4xl text-[#161513] hover:text-[#D82E54] transition-colors"
            >
              <span>Let's Build Something Memorable</span>
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <p className="text-xs text-[#5C5852] font-mono mt-1">
              Open for full-time product design opportunities and select contract work.
            </p>
          </div>

          <Link
            to="/"
            className="px-5 py-2.5 rounded-full border border-[#161513]/20 font-mono text-xs text-[#161513] hover:bg-[#161513] hover:text-white transition-all shadow-xs"
          >
            ← Back to All Work
          </Link>
        </div>
      </footer>
    </article>
  );
}
