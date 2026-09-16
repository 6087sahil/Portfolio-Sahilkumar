import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import LoadingScreen from './components/LoadingScreen';

import IntroSection from './components/IntroSection';
import ProjectsSection from './components/ProjectsSection';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className={`main-wrapper relative min-h-screen bg-[#F5F3EF] dark:bg-[#0a0a0a] transition-colors duration-500 ${isLoading ? 'h-screen overflow-hidden' : ''}`}>
        <CustomCursor />
        {!isLoading && <NavBar />}
        <HeroSection />
        <MarqueeSection />
        <IntroSection />
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
