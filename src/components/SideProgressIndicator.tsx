import React, { useEffect, useState } from 'react';

export interface SectionIndicator {
  id: string;
  num: string;
  title: string;
}

interface SideProgressIndicatorProps {
  sections: SectionIndicator[];
}

export const SideProgressIndicator: React.FC<SideProgressIndicatorProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Case study navigation"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 select-none pointer-events-auto"
    >
      <div className="bg-[#06000c]/85 backdrop-blur-xl border border-white/[0.08] p-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-2.5">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group relative flex items-center justify-end p-1 rounded-full focus:outline-none"
              aria-label={`Jump to ${section.title}`}
            >
              {/* Tooltip on hover */}
              <div className="absolute right-7 px-2.5 py-1 rounded-md bg-[#120b1c] border border-white/10 text-white text-[10px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                <span className="text-[#E5336D] mr-1.5">{section.num}</span>
                <span>{section.title}</span>
              </div>

              {/* Indicator Dot */}
              <div
                className={`relative transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'w-2.5 h-6 bg-[#E5336D] shadow-[0_0_12px_#E5336D]'
                    : 'w-2 h-2 bg-white/20 group-hover:bg-white/50'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
