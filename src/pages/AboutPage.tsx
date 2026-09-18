import React, { useEffect } from 'react';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default AboutPage;
