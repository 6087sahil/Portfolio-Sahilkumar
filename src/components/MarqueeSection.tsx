import React, { useEffect, useState, useRef } from 'react';

const images = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
];

const row1 = [...images.slice(0, 11), ...images.slice(0, 11)];
const row2 = [...images.slice(11), ...images.slice(11)];

const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.offsetTop;
        const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.25;
        setScrollOffset(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F4F1EA] py-16 overflow-hidden flex flex-col gap-6 border-t border-[#161513]/10 relative select-none"
    >
      <div 
        className="flex gap-5 will-change-transform whitespace-nowrap relative z-10 py-2"
        style={{ transform: `translateX(${scrollOffset - 120}px)` }}
      >
        {row1.map((src, i) => (
          <img 
            key={`row1-${i}`}
            src={src} 
            alt="Design visual sample"
            loading="lazy"
            className="w-[380px] h-[240px] rounded-2xl object-cover shrink-0 border border-[#161513]/15 shadow-[0_12px_36px_-6px_rgba(110,61,30,0.18),0_4px_16px_-2px_rgba(156,102,68,0.10)] hover:shadow-[0_20px_45px_-6px_rgba(110,61,30,0.28),0_6px_20px_-2px_rgba(156,102,68,0.16)] hover:border-[#9c6644]/40 hover:-translate-y-1 transition-all duration-300"
          />
        ))}
      </div>
      <div 
        className="flex gap-5 will-change-transform whitespace-nowrap relative z-10 py-2"
        style={{ transform: `translateX(${-(scrollOffset) - 250}px)` }}
      >
        {row2.map((src, i) => (
          <img 
            key={`row2-${i}`}
            src={src} 
            alt="Design visual sample"
            loading="lazy"
            className="w-[380px] h-[240px] rounded-2xl object-cover shrink-0 border border-[#161513]/15 shadow-[0_12px_36px_-6px_rgba(110,61,30,0.18),0_4px_16px_-2px_rgba(156,102,68,0.10)] hover:shadow-[0_20px_45px_-6px_rgba(110,61,30,0.28),0_6px_20px_-2px_rgba(156,102,68,0.16)] hover:border-[#9c6644]/40 hover:-translate-y-1 transition-all duration-300"
          />
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
