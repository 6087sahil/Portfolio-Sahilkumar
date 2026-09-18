import React from 'react';
import HeroSection from '../components/HeroSection';
import MarqueeSection from '../components/MarqueeSection';
import ProjectsSection from '../components/ProjectsSection';
import ServicesSection from '../components/ServicesSection';
import ProcessSection from '../components/ProcessSection';
import SkillsSection from '../components/SkillsSection';
import ContactSection from '../components/ContactSection';

interface HomePageProps {
  isLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoading }) => {
  return (
    <>
      <HeroSection isLoaded={!isLoading} />
      <MarqueeSection />
      <ProjectsSection />
      <ServicesSection />
      <ProcessSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
};

export default HomePage;
