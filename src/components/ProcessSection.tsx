import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Play, Search, Check } from 'lucide-react';

interface Step {
  num: string;
  title: string;
  desc: string;
  deliverable: string;
  category: string;
}

const steps: Step[] = [
  {
    num: '01',
    title: 'Research & Discovery',
    desc: 'Understand users, markets, and competitors through verbatim interviews and field observations.',
    deliverable: 'Affinity Maps & User Pain Points',
    category: 'User Research',
  },
  {
    num: '02',
    title: 'Define & Frame',
    desc: 'Synthesize raw qualitative insights into problem statements, user journeys, and non-negotiables.',
    deliverable: 'Problem Mandate & Personas',
    category: 'Strategy & Architecture',
  },
  {
    num: '03',
    title: 'Paper Wireframes',
    desc: 'Map information architecture and sketch rough layout thumbnails to stress-test hierarchy early.',
    deliverable: 'Low-Fi Layout Sketches',
    category: 'Information Architecture',
  },
  {
    num: '04',
    title: 'Systematic UI',
    desc: 'Craft component libraries, fluid typography scales, and high-fidelity screens with high contrast.',
    deliverable: 'Production Figma Systems',
    category: 'Design Systems',
  },
  {
    num: '05',
    title: 'Prototypes',
    desc: 'Build realistic interactive prototypes to simulate micro-interactions, gestures, and state transitions.',
    deliverable: 'Interactive Figma Flow',
    category: 'Motion & Interaction',
  },
  {
    num: '06',
    title: 'Usability Testing',
    desc: 'Validate prototypes with real participants, observing hesitation points and drop-offs.',
    deliverable: 'Audit Findings & Feedback',
    category: 'Validation',
  },
  {
    num: '07',
    title: 'Refine & Hand off',
    desc: 'Iterate based on test findings and prepare production-ready token specs for engineering handoff.',
    deliverable: 'Handoff Specs & Assets',
    category: 'Design Ops & Delivery',
  },
];

/* ── Individual Step Artboard Visuals ─────────────────────────────── */

const Step01Visual: React.FC = () => (
  <div className="flex flex-col h-full justify-between gap-4">
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[#FFF8E7] p-3.5 rounded-xl border border-[#F2E0BA] shadow-2xs rotate-[-1deg]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#9C7018] mb-1 font-semibold">Pain Point</div>
        <p className="text-xs text-[#4A3D1E] font-medium leading-snug">"Sublet discovery felt fragmented across 4 apps with zero verification."</p>
      </div>
      <div className="bg-[#F2F7F2] p-3.5 rounded-xl border border-[#D5E5D5] shadow-2xs rotate-[1.5deg]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#356E3B] mb-1 font-semibold">Core Finding</div>
        <p className="text-xs text-[#224025] font-medium leading-snug">"Verified landlord & roommate badges increase inquiry intent by 4.2×."</p>
      </div>
    </div>
    <div className="bg-white p-3.5 rounded-xl border border-[#161513]/10 shadow-xs flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#161513]/10 flex items-center justify-center text-[#D82E54]">
          <Search className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-[#161513]">Qualitative Cohort</div>
          <div className="text-[11px] text-[#8E8980]">14 interviews · 3 persona groups</div>
        </div>
      </div>
      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#F4F1EA] px-2.5 py-1 rounded text-[#5C5852] border border-[#161513]/10">
        Synthesized
      </span>
    </div>
  </div>
);

const Step02Visual: React.FC = () => (
  <div className="flex flex-col h-full justify-between gap-3">
    <div className="bg-white p-4 rounded-xl border border-[#161513]/10 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#D82E54]" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] font-semibold">Problem Statement</span>
      </div>
      <p className="font-serif text-sm sm:text-base text-[#161513] leading-snug italic">
        "How might we turn opaque room listings into transparent, verified matches with clear financial terms?"
      </p>
    </div>
    <div className="grid grid-cols-3 gap-2 text-center">
      {['Verified ID', 'No Hidden Fees', 'Direct Chat'].map((pillar, i) => (
        <div key={i} className="bg-[#FAF8F5] py-2 px-2 rounded-lg border border-[#161513]/10 text-[11px] font-mono font-medium text-[#161513]">
          {pillar}
        </div>
      ))}
    </div>
  </div>
);

const Step03Visual: React.FC = () => (
  <div className="flex flex-col h-full justify-between gap-3">
    <div className="flex items-center justify-center gap-4 py-2">
      {/* Low-Fi Wireframe Screen 1 */}
      <div className="w-32 h-44 rounded-xl border-2 border-dashed border-[#161513]/25 bg-white p-2 flex flex-col gap-1.5 shadow-2xs">
        <div className="w-8 h-2 bg-[#161513]/20 rounded-full" />
        <div className="w-full h-14 bg-[#161513]/10 rounded-md border border-[#161513]/10" />
        <div className="w-3/4 h-2 bg-[#161513]/15 rounded" />
        <div className="w-1/2 h-2 bg-[#161513]/10 rounded" />
        <div className="mt-auto w-full h-5 bg-[#161513]/15 rounded" />
      </div>
      {/* Low-Fi Wireframe Screen 2 */}
      <div className="w-32 h-44 rounded-xl border-2 border-dashed border-[#D82E54]/40 bg-white p-2 flex flex-col gap-1.5 shadow-2xs">
        <div className="w-12 h-2 bg-[#D82E54]/25 rounded-full" />
        <div className="grid grid-cols-2 gap-1 my-1">
          <div className="h-10 bg-[#161513]/10 rounded" />
          <div className="h-10 bg-[#161513]/10 rounded" />
        </div>
        <div className="w-full h-2 bg-[#161513]/15 rounded" />
        <div className="w-4/5 h-2 bg-[#161513]/10 rounded" />
        <div className="mt-auto w-full h-5 bg-[#D82E54] rounded text-[8px] font-mono text-white flex items-center justify-center">
          Inquire
        </div>
      </div>
    </div>
    <div className="text-center text-[11px] font-mono text-[#8E8980]">
      Layout Thumbnails &bull; Testing scan hierarchy before pixel styling
    </div>
  </div>
);

const Step04Visual: React.FC = () => (
  <div className="flex flex-col h-full justify-between gap-3">
    {/* Swatches & Tokens */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] font-semibold">Color Tokens</span>
        <span className="text-[10px] font-mono text-[#4FA765] bg-[#EBF7EE] px-2 py-0.5 rounded font-semibold">WCAG AAA 7.2:1</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { name: 'Crimson', hex: '#D82E54', bg: 'bg-[#D82E54]', text: 'text-white' },
          { name: 'Charcoal', hex: '#161513', bg: 'bg-[#161513]', text: 'text-white' },
          { name: 'Cream', hex: '#FAF8F5', bg: 'bg-[#FAF8F5]', text: 'text-[#161513] border border-[#161513]/15' },
          { name: 'Sage', hex: '#4FA765', bg: 'bg-[#4FA765]', text: 'text-white' },
        ].map((c, i) => (
          <div key={i} className={`p-2 rounded-lg ${c.bg} ${c.text} flex flex-col justify-between h-14 shadow-2xs`}>
            <span className="text-[9px] font-mono opacity-80">{c.hex}</span>
            <span className="text-[10px] font-semibold tracking-tight">{c.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Component Buttons Showcase */}
    <div className="bg-white p-3 rounded-xl border border-[#161513]/10 shadow-2xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button type="button" className="px-4 py-2 rounded-full bg-[#161513] text-white text-[11px] font-mono font-semibold tracking-wider uppercase hover:bg-[#D82E54] transition-colors">
          Reserve Room
        </button>
        <button type="button" className="px-3.5 py-2 rounded-full border border-[#161513]/20 text-[#161513] text-[11px] font-mono font-semibold tracking-wider uppercase">
          Save &bull; 14
        </button>
      </div>
      <span className="text-[11px] font-mono text-[#8E8980] hidden sm:inline">
        Tokens &bull; 16px R
      </span>
    </div>
  </div>
);

const Step05Visual: React.FC = () => (
  <div className="flex flex-col h-full justify-between gap-3">
    <div className="bg-white p-4 rounded-xl border border-[#161513]/10 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D82E54] animate-ping" />
          <span className="text-[11px] font-mono font-semibold text-[#161513]">Figma Interaction Node</span>
        </div>
        <span className="text-[10px] font-mono text-[#8E8980]">Smart Animate · 300ms</span>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F5] border border-[#161513]/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#161513] text-white flex items-center justify-center text-[10px] font-mono">
            A
          </div>
          <span className="text-xs font-medium text-[#161513]">On Tap / Drag</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#D82E54]">
          <span className="text-[11px] font-mono">Navigate to Sheet</span>
          <Play className="w-3 h-3 fill-current" />
        </div>
      </div>
    </div>

    <div className="text-center text-[11px] font-mono text-[#8E8980] flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#4FA765]" />
      <span>6 Interactive Screens Tested &bull; Fluid Spring Physics</span>
    </div>
  </div>
);

const Step06Visual: React.FC = () => (
  <div className="flex flex-col h-full justify-between gap-3">
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white p-3.5 rounded-xl border border-[#161513]/10 shadow-2xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] mb-0.5">Task Success</div>
        <div className="text-2xl font-serif text-[#161513] font-semibold">94%</div>
        <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full mt-2 overflow-hidden border border-[#161513]/10">
          <div className="bg-[#4FA765] h-full w-[94%]" />
        </div>
      </div>
      <div className="bg-white p-3.5 rounded-xl border border-[#161513]/10 shadow-2xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E8980] mb-0.5">Time on Task</div>
        <div className="text-2xl font-serif text-[#161513] font-semibold">1m 24s</div>
        <div className="text-[10px] text-[#4FA765] font-mono font-medium mt-1">↓ 68% vs Benchmark</div>
      </div>
    </div>

    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#161513]/10 text-xs text-[#5C5852] italic leading-snug">
      "Finding a room feels like exploring an editorial magazine instead of browsing Craigslist."
      <div className="text-[10px] font-mono not-italic text-[#8E8980] mt-1 font-medium">&mdash; Participant 6, Unmoderated Test</div>
    </div>
  </div>
);

const Step07Visual: React.FC = () => (
  <div className="flex flex-col h-full justify-between gap-3">
    <div className="bg-[#161513] text-[#F4F1EA] p-3.5 rounded-xl font-mono text-[11px] leading-relaxed shadow-xs">
      <div className="flex items-center justify-between text-[#8E8980] text-[10px] pb-2 mb-2 border-b border-white/10">
        <span>tokens.config.json</span>
        <span className="text-[#4FA765] flex items-center gap-1">
          <Check className="w-3 h-3" /> Ready
        </span>
      </div>
      <p className="text-[#D82E54]">"theme": &#123;</p>
      <p className="pl-3 text-white/80">"borderRadius": "16px",</p>
      <p className="pl-3 text-white/80">"fontFamily": "Fraunces, serif",</p>
      <p className="pl-3 text-white/80">"contrastChecked": true</p>
      <p className="text-[#D82E54]">&#125;</p>
    </div>

    <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#161513]/10 text-xs">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#4FA765]" />
        <span className="font-semibold text-[#161513]">Production Handoff</span>
      </div>
      <span className="text-[10px] font-mono text-[#8E8980] uppercase tracking-wider">
        24 Components Synced
      </span>
    </div>
  </div>
);

/* ── StepVisual Panel with Figma Artboard Shell ─────────────────────── */

const StepVisualPanel: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const step = steps[activeStep];

  return (
    <div className="relative w-full h-[400px] rounded-3xl bg-[#FAF8F5] border border-[#161513]/15 overflow-hidden flex flex-col shadow-[0_12px_36px_-6px_rgba(110,61,30,0.18),0_4px_16px_-2px_rgba(156,102,68,0.10)] hover:shadow-[0_20px_45px_-6px_rgba(110,61,30,0.26),0_6px_20px_-2px_rgba(156,102,68,0.16)] hover:border-[#9c6644]/40 transition-all duration-500 select-none">
      
      {/* Top Figma/Studio Window Bar */}
      <div className="h-10 px-4 bg-[#F2EFE8] border-b border-[#161513]/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#161513]/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#161513]/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#161513]/20" />
          <span className="text-xs font-mono font-medium text-[#161513]/60 ml-2">
            Process_Deck &bull; Step {step.num}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D82E54] font-semibold bg-white/70 px-2 py-0.5 rounded border border-[#161513]/10">
            {step.category}
          </span>
          <span className="text-[11px] font-mono text-[#8E8980] hidden sm:inline">100%</span>
        </div>
      </div>

      {/* Main Artboard Content with Zero Overlapping Transitions */}
      <div className="flex-1 p-6 flex flex-col justify-between overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Header with Title and Deliverable Badge */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#D82E54] tracking-wider uppercase block mb-0.5">
                  Phase {step.num}
                </span>
                <h3 className="font-serif text-[#161513] text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C5852] bg-white px-3 py-1 rounded-full border border-[#161513]/15 shadow-2xs flex-shrink-0">
                {step.deliverable}
              </span>
            </div>

            {/* Bespoke Interactive Preview for This Step */}
            <div className="flex-1 min-h-0 py-1">
              {activeStep === 0 && <Step01Visual />}
              {activeStep === 1 && <Step02Visual />}
              {activeStep === 2 && <Step03Visual />}
              {activeStep === 3 && <Step04Visual />}
              {activeStep === 4 && <Step05Visual />}
              {activeStep === 5 && <Step06Visual />}
              {activeStep === 6 && <Step07Visual />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Step Pager Footnote */}
      <div className="h-8 px-4 bg-[#F7F5EE] border-t border-[#161513]/10 flex items-center justify-between text-[11px] font-mono text-[#8E8980]">
        <span>Scroll or click left items to inspect steps</span>
        <span>{activeStep + 1} of {steps.length}</span>
      </div>

    </div>
  );
};

/* ── Main ProcessSection Component ────────────────────────────────── */

const ProcessSection: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const stepCount = steps.length;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate discrete active step on scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const rawIndex = Math.floor(latest * stepCount);
    const clampedIndex = Math.min(stepCount - 1, Math.max(0, rawIndex));
    setActiveStep(clampedIndex);
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={outerRef}
      id="process"
      className="relative bg-[#F4F1EA] text-[#161513] border-t border-[#161513]/10"
      style={{ height: `${100 + stepCount * 30}vh` }}
    >
      {/* Sticky panel */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-6 md:py-8">

          {/* Section label + headline */}
          <div className="mb-6">
            <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider mb-2 block">
              03 / Design Process
            </span>
            <h2 className="font-serif text-[#161513] text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.05]">
              How I turn ideas{' '}
              <span className="italic text-[#D82E54] font-serif">
                into products.
              </span>
            </h2>
          </div>

          {/* Two-column: steps left, visual right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 flex-1 min-h-0 items-center">

            {/* LEFT: progress line + interactive clickable steps */}
            <div className="flex gap-4 md:gap-6 min-h-0">
              {/* Vertical progress line */}
              <div className="relative flex-shrink-0 flex flex-col items-center pt-2">
                <div className="w-px bg-[#161513]/10 flex-1" />
                <motion.div
                  className="absolute top-0 left-0 w-full bg-[#D82E54] origin-top"
                  style={{ scaleY: lineScaleY, height: '100%' }}
                />
              </div>

              {/* Steps list */}
              <div className="flex flex-col divide-y divide-[#161513]/10 flex-1 min-h-0">
                {steps.map((step, i) => {
                  const isActive = activeStep === i;
                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => setActiveStep(i)}
                      className={`text-left flex items-start gap-4 py-3 px-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#FAF8F5] border border-[#D82E54]/40 shadow-sm'
                          : 'hover:bg-black/[0.02] border border-transparent opacity-65 hover:opacity-100'
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-bold tracking-wider flex-shrink-0 w-6 pt-0.5 transition-colors ${
                          isActive ? 'text-[#D82E54]' : 'text-[#8E8980]'
                        }`}
                      >
                        {step.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3
                            className={`font-serif text-base md:text-lg tracking-tight transition-colors ${
                              isActive ? 'text-[#161513] font-semibold' : 'text-[#161513]/80 font-normal'
                            }`}
                          >
                            {step.title}
                          </h3>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D82E54]" />
                          )}
                        </div>
                        <p className="text-[#5C5852] text-xs sm:text-sm leading-relaxed font-light line-clamp-2">
                          {step.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Active step visual artboard */}
            <div className="hidden lg:flex w-full items-center justify-center">
              <StepVisualPanel activeStep={activeStep} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProcessSection;
