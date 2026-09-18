import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Magnet from './Magnet';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/#services' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Work', href: '/#work' },
];

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll logic for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section (only on home page)
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(location.pathname);
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`/#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      if (link.href.startsWith('/#')) {
        const id = link.href.substring(2);
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }
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
      if (location.pathname === '/') {
        // We are already on home, just scroll
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      } else {
        // Navigate to home with hash
        navigate(`/${hash}`);
      }
    } else {
      // Just navigate to the page
      navigate(href);
    }
  };

  const isScrolledStyle = scrolled || location.pathname === '/about';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolledStyle ? 'py-4 px-4 sm:px-8' : 'py-8 px-6 lg:px-12'
        }`}
      >
        <div 
          className={`mx-auto flex items-center w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolledStyle 
              ? 'max-w-4xl bg-white/60 dark:bg-[#06000c]/60 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full py-3 px-6 sm:px-8 shadow-[0_4px_30px_rgba(168,85,247,0.06)]' 
              : 'max-w-7xl bg-transparent border-transparent py-0 px-0 shadow-none'
          }`}
        >
          {/* LEFT: Logo */}
          <div className="flex-1 flex justify-start">
            <Link 
              to="/" 
              style={{ fontFamily: "'Ysabeau SC', sans-serif" }}
              className="text-[#111111] dark:text-white font-extrabold text-2xl sm:text-3xl tracking-tighter hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-300 z-50 relative block"
            >
              SK.
            </Link>
          </div>

          {/* CENTER: Desktop Links */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href || (location.pathname === link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative inline-flex items-center justify-center px-4 lg:px-5 py-2 text-[12px] font-medium tracking-[0.05em] uppercase transition-colors duration-300 ${
                    isActive ? 'text-[#111111] dark:text-white' : 'text-[#111111]/50 dark:text-white/50 hover:text-[#111111]/90 dark:hover:text-white/90'
                  }`}
                >
                  <span className="relative z-10 pt-[1px]">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* RIGHT: CTA & Mobile Menu */}
          <div className="flex-1 flex justify-end items-center">
            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Magnet strength={5} padding={50}>
                <a
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, '/#contact')}
                  className="group relative inline-flex items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#0a0a0a] px-6 py-2.5 rounded-full font-semibold text-[13px] tracking-wide hover:bg-purple-900 dark:hover:bg-purple-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  Let's Talk
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Magnet>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#111111] dark:text-white z-50 relative hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
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
            className="fixed inset-0 z-[200] bg-[#F5F3EF]/95 dark:bg-[#06000c]/95 backdrop-blur-3xl flex flex-col items-center justify-center transition-colors duration-500"
          >
            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#111111] dark:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300"
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
                  className="text-[#111111] dark:text-white text-4xl sm:text-5xl font-light tracking-wide hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-300"
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
                  className="bg-[#111111] dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-semibold tracking-wider text-sm hover:scale-105 transition-transform duration-300 flex items-center gap-3"
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
