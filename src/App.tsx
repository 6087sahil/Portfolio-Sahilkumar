import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import NavBar from './components/NavBar';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgressBar from './components/ScrollProgressBar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RoomlyCaseStudy from './pages/RoomlyCaseStudy';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Lenis smooth scroll
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

  // Handle scrolling to hash on route change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const isAboutPage = location.pathname === '/about';
  const isCaseStudy = location.pathname.startsWith('/case-study/');

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div
        className={`main-wrapper relative min-h-screen bg-[#F4F1EA] text-[#161513] transition-colors duration-500 ${
          isLoading ? 'h-screen overflow-hidden' : ''
        }`}
      >
        <ScrollProgressBar />
        <CustomCursor />
        {!isLoading && !isCaseStudy && <NavBar />}
        
        <Routes>
          <Route path="/" element={<HomePage isLoading={isLoading} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/case-study/roomly" element={<RoomlyCaseStudy />} />
          <Route path="/case-study/pet-adoption" element={<Navigate to="/case-study/roomly" replace />} />
        </Routes>
        
        {!isCaseStudy && <Footer isAboutPage={isAboutPage} />}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
