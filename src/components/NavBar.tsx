import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Magnet from './Magnet';
import { useTheme } from './ThemeProvider';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/#services' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Work', href: '/#work' },
];

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isScrolledRef = useRef(false);
  const isClickNavigatingRef = useRef(false);

  // Stable scroll listener with hysteresis & requestAnimationFrame
  // Activate scrolled state at > 65px; deactivate only when scrolling back above < 30px
  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const currentScrolled = isScrolledRef.current;

        if (!currentScrolled && y > 65) {
          isScrolledRef.current = true;
          setScrolled(true);
        } else if (currentScrolled && y < 30) {
          isScrolledRef.current = false;
          setScrolled(false);
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial sync
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Intersection Observer for active section on home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(location.pathname);
      return;
    }

    // Map section IDs to their corresponding nav href
    const sectionToNavMap: Record<string, string> = {
      services: '/#services',
      skills: '/#skills',
      work: '/#work',
      projects: '/#work',
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      // Focus on the upper center of the viewport for natural reading position
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0, 0.2, 0.5],
    };

    const intersectingMap = new Map<string, number>();

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isClickNavigatingRef.current) return;

      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          intersectingMap.set(id, entry.intersectionRatio);
        } else {
          intersectingMap.delete(id);
        }
      });

      // Find the section with the highest intersection ratio
      let bestId = '';
      let highestRatio = -1;
      intersectingMap.forEach((ratio, id) => {
        if (ratio > highestRatio) {
          highestRatio = ratio;
          bestId = id;
        }
      });

      if (bestId && sectionToNavMap[bestId]) {
        setActiveSection(sectionToNavMap[bestId]);
      } else if (window.scrollY < 180) {
        // At the top of hero, clear active section
        setActiveSection('');
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeIds = ['services', 'skills', 'work', 'projects'];
    observeIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href.startsWith('/#')) {
      const hash = href.substring(1); // e.g. '#services'
      setActiveSection(href);
      isClickNavigatingRef.current = true;
      setTimeout(() => {
        isClickNavigatingRef.current = false;
      }, 800);

      if (location.pathname === '/') {
        // We are already on home, scroll to target element
        const id = hash.substring(1);
        const element = document.getElementById(id) || (id === 'work' ? document.getElementById('projects') : null);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
          });
        }
      } else {
        navigate(`/${hash}`);
      }
    } else {
      navigate(href);
    }
  };

  const isScrolledStyle = scrolled || location.pathname === '/about';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] w-full transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolledStyle ? 'py-3.5 px-4 sm:px-8' : 'py-7 px-6 lg:px-12'
        }`}
      >
        <div 
          className={`mx-auto flex items-center w-full transition-[max-width,padding,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolledStyle 
              ? 'max-w-4xl bg-white/70 dark:bg-[#211E1A]/80 backdrop-blur-xl border border-black/10 dark:border-[#403830] rounded-full py-3 px-6 sm:px-8 shadow-[0_4px_30px_rgba(156,102,68,0.08)]' 
              : 'max-w-7xl bg-transparent border-transparent py-0 px-0 shadow-none'
          }`}
        >
          {/* LEFT: Logo */}
          <div className="flex-1 flex justify-start">
            <Link 
              to="/" 
              style={{ fontFamily: "'Ysabeau SC', sans-serif" }}
              className="text-[#111111] dark:text-[#F4F1EA] font-extrabold text-2xl sm:text-3xl tracking-tighter hover:text-[#8F5431] dark:hover:text-[#C58B65] transition-colors duration-300 z-50 relative block"
            >
              SK.
            </Link>
          </div>

          {/* CENTER: Desktop Links with Smooth LayoutId Pill Motion */}
          <div 
            className="hidden md:flex flex-shrink-0 items-center gap-1 lg:gap-2"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href || (location.pathname === link.href);
              const isHovered = hoveredLink === link.href;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative inline-flex items-center justify-center px-4 lg:px-5 py-2 text-xs font-medium tracking-[0.05em] uppercase transition-colors duration-300 select-none ${
                    isActive 
                      ? 'text-[#111111] dark:text-[#F4F1EA]' 
                      : 'text-[#111111]/55 dark:text-[#B8AFA4] hover:text-[#111111] dark:hover:text-[#F4F1EA]'
                  }`}
                >
                  <span className="relative z-10 pt-[1px] pointer-events-none">{link.label}</span>

                  {/* Refined Active Indicator Spring */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-black/[0.06] dark:bg-white/[0.12] rounded-full pointer-events-none"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                        mass: 0.8
                      }}
                    />
                  )}

                  {/* Subtle Gentle Hover Background (when not active) */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hoverNavBackground"
                      className="absolute inset-0 bg-black/[0.03] dark:bg-white/[0.05] rounded-full pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* RIGHT: Theme Toggle, CTA & Mobile Menu */}
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
            {/* Luxury Editorial Sun/Moon Theme Toggle */}
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer select-none overflow-hidden backdrop-blur-xl bg-white/75 dark:bg-[#29251F]/75 border border-[#8F5431]/20 dark:border-[#C58B65]/30 shadow-[0_2px_8px_rgba(143,84,49,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)] hover:border-[#8F5431]/50 dark:hover:border-[#C58B65]/60 hover:shadow-[0_0_14px_rgba(197,139,101,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8F5431] dark:focus-visible:ring-[#C58B65] group transition-colors duration-450"
            >
              {/* Soft inner radial highlight sheen */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8F5431]/0 via-white/10 dark:via-white/5 to-white/30 dark:to-white/10 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Seamless Stacked Icon Animation - Zero Stutter, Perfectly Centered */}
              <div className="relative w-4 h-4 flex items-center justify-center">
                <motion.div
                  initial={false}
                  animate={{
                    opacity: theme === 'dark' ? 1 : 0,
                    scale: theme === 'dark' ? 1 : 0.6,
                    rotate: theme === 'dark' ? 0 : -90,
                  }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center text-[#C58B65] pointer-events-none"
                >
                  <Sun className="w-4 h-4 stroke-[2.2]" />
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    opacity: theme === 'dark' ? 0 : 1,
                    scale: theme === 'dark' ? 0.6 : 1,
                    rotate: theme === 'dark' ? 90 : 0,
                  }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center text-[#8F5431] pointer-events-none"
                >
                  <Moon className="w-4 h-4 stroke-[2.2]" />
                </motion.div>
              </div>
            </motion.button>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Magnet strength={4} padding={40}>
                <a
                  href="/#contact"
                  data-no-cursor-magnet="true"
                  onClick={(e) => handleNavClick(e, '/#contact')}
                  className="group relative inline-flex items-center gap-2 overflow-hidden bg-[#111111] dark:bg-[#C58B65] text-white dark:text-[#171512] px-6 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-[background-color,color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-stone-800 dark:hover:bg-[#d49a75] hover:shadow-[0_4px_20px_rgba(197,139,101,0.35)] active:scale-[0.97]"
                >
                  <span className="relative z-10">Let's Talk</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                </a>
              </Magnet>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle menu"
              className="md:hidden w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-[#403830] flex items-center justify-center text-[#111111] dark:text-[#F4F1EA] z-50 relative hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE: Full Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] bg-[#F5F3EF]/95 dark:bg-[#171512]/95 backdrop-blur-3xl flex flex-col items-center justify-center transition-colors duration-500"
          >
            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-[#403830] flex items-center justify-center text-[#111111] dark:text-[#F4F1EA] hover:bg-black/10 dark:hover:bg-white/15 hover:scale-105 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col items-center gap-8 w-full px-6"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-[#111111] dark:text-[#F4F1EA] text-4xl sm:text-5xl font-light tracking-wide hover:text-[#8F5431] dark:hover:text-[#C58B65] transition-colors duration-300"
                  style={{ fontFamily: "'Arima', sans-serif" }}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="mt-12 flex flex-col items-center gap-8 w-full"
              >
                <div className="w-16 h-px bg-black/10 dark:bg-white/10" />
                <a 
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, '/#contact')}
                  className="bg-[#111111] dark:bg-[#C58B65] text-white dark:text-[#171512] px-10 py-4 rounded-full font-semibold tracking-wider text-sm hover:scale-105 transition-transform duration-300 flex items-center gap-3"
                >
                  Let's Talk
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
