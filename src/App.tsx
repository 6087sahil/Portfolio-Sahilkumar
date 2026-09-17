import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import NavBar from './components/NavBar';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgressBar from './components/ScrollProgressBar';


import ProjectsSection from './components/ProjectsSection';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Lenis smooth scroll — respects prefers-reduced-motion
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className={`main-wrapper relative min-h-screen bg-[#F5F3EF] dark:bg-[#06000c] transition-colors duration-500 ${isLoading ? 'h-screen overflow-hidden' : ''}`}>
        <ScrollProgressBar />
        <CustomCursor />
        {!isLoading && <NavBar />}
        <HeroSection isLoaded={!isLoading} />
        <MarqueeSection />

        <ProjectsSection />
        <ServicesSection />
        <ProcessSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}

export default App;
