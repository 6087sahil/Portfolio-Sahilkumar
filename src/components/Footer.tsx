import React from 'react';
import ScrollReveal, { ScrollRevealItem } from './ScrollReveal';

interface FooterProps {
  isAboutPage?: boolean;
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer
      className="w-full bg-[#EDE8DE] border-t border-[#161513]/10 text-[#161513] pt-16 pb-12 relative z-20 overflow-hidden transition-colors duration-500"
    >
      <ScrollReveal delay={0.1} duration={1} yOffset={30} className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          
          <ScrollRevealItem className="flex flex-col">
            <h3 className="font-serif text-[#161513] text-2xl sm:text-3xl tracking-tight mb-2 transition-colors duration-500">
              Sahil Kumar
            </h3>
            <p className="text-[#5C5852] text-sm font-medium tracking-wide transition-colors duration-500">
              UI/UX &amp; Product Designer
            </p>
          </ScrollRevealItem>

          <ScrollReveal delay={0.2} staggerChildren={0.1} className="flex flex-wrap items-center gap-6 sm:gap-10">
            {['Email', 'LinkedIn', 'Dribbble', 'GitHub'].map((link) => (
              <ScrollRevealItem key={link} yOffset={10}>
                <a 
                  href={link === 'Email' ? 'mailto:6087sahilkumar@gmail.com' : '#'} 
                  className="group text-[#5C5852] hover:text-[#161513] text-sm font-medium transition-colors duration-300 relative py-1"
                >
                  <span className="relative z-10 inline-block transition-transform duration-300 group-hover:-translate-y-0.5">{link}</span>
                </a>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>

        </div>

        <ScrollReveal delay={0.4} className="mt-16 pt-8 border-t border-[#161513]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-500">
          <p className="text-[#8E8980] text-xs font-semibold tracking-wide transition-colors duration-500">
            &copy; {new Date().getFullYear()} Sahil Kumar. All rights reserved.
          </p>
          <div className="text-[#8E8980] text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors duration-500">
            Set in Fraunces &amp; Plus Jakarta Sans on Paper Ground
          </div>
        </ScrollReveal>

      </ScrollReveal>
    </footer>
  );
};

export default Footer;
