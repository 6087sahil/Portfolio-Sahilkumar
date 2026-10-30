import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Magnet from './Magnet';
import { useTheme } from './ThemeProvider';

/* ── Navigation Links & Expertise Submenu ────────────────────────── */

interface NavItem {
  label: string;
  href: string;
}

const navLinks: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/#services' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Work', href: '/#work' },
];

const expertiseSubmenu: NavItem[] = [
  { label: 'UI/UX Design', href: '/#services' },
  { label: 'Product Thinking', href: '/#services' },
  { label: 'Design Systems', href: '/#skills' },
  { label: 'Frontend Development', href: '/#skills' },
];

/* ── Main Navigation Bar Component ────────────────────────────────── */

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [expertiseOpen, setExpertiseOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isScrolledRef = useRef(false);
  const isClickNavigatingRef = useRef(false);
  const expertiseDropdownRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';
  // On home page, transparent over hero until scrolled
  const isTransparent = isHomePage && !scrolled;

  /* ── Scroll listener with hysteresis ── */
  useEffect(() => {
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (!isScrolledRef.current && y > 60) {
          isScrolledRef.current = true;
          setScrolled(true);
        } else if (isScrolledRef.current && y < 30) {
          isScrolledRef.current = false;
          setScrolled(false);
        }
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── IntersectionObserver for active section on Home page ── */
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(location.pathname);
      return;
    }

    const sectionMap: Record<string, string> = {
      services: '/#services',
      skills: '/#skills',
      work: '/#work',
      projects: '/#work',
      contact: '/#contact',
    };

    const intersecting = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickNavigatingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.set(entry.target.id, entry.intersectionRatio);
          } else {
            intersecting.delete(entry.target.id);
          }
        });

        let highestRatio = -1;
        let bestMatch = '';
        intersecting.forEach((ratio, id) => {
          if (ratio > highestRatio) {
            highestRatio = ratio;
            bestMatch = id;
          }
        });

        if (bestMatch && sectionMap[bestMatch]) {
          setActiveSection(sectionMap[bestMatch]);
        } else if (window.scrollY < 200) {
          setActiveSection('');
        }
      },
      { root: null, rootMargin: '-20% 0px -50% 0px', threshold: [0, 0.2, 0.5] }
    );

    ['services', 'skills', 'work', 'projects', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  /* ── Close expertise dropdown on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        expertiseDropdownRef.current &&
        !expertiseDropdownRef.current.contains(e.target as Node)
      ) {
        setExpertiseOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  /* ── Navigation click handler ── */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setExpertiseOpen(false);

    if (href.startsWith('/#')) {
      const hash = href.substring(1);
      setActiveSection(href);
      isClickNavigatingRef.current = true;
      setTimeout(() => {
        isClickNavigatingRef.current = false;
      }, 800);

      if (location.pathname === '/') {
        const id = hash.substring(1);
        const element =
          document.getElementById(id) ||
          (id === 'work' ? document.getElementById('projects') : null);
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
      } else {
        navigate(`/${hash}`);
      }
    } else {
      navigate(href);
    }
  };

  /* ── Color & Style Tokens ── */
  const textPrimary = isTransparent
    ? 'text-white'
    : 'text-[#161513] dark:text-[#F4F1EA]';

  const textSecondary = isTransparent
    ? 'text-white/65 hover:text-white'
    : 'text-[#161513]/60 dark:text-[#F4F1EA]/60 hover:text-[#161513] dark:hover:text-[#F4F1EA]';

  const borderLine = isTransparent
    ? 'border-white/10'
    : 'border-[#161513]/10 dark:border-white/10';

  const isExpertiseActive =
    activeSection === '/#services' || activeSection === '/#skills';

  return (
    <>
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-[100] w-full"
      >
        {/* Full-width background: transparent on hero, subtle backdrop on scroll */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isTransparent
              ? 'opacity-0'
              : 'opacity-100 bg-[#F4F1EA]/90 dark:bg-[#161513]/90 backdrop-blur-md'
          }`}
        />

        {/* Full-width bar with subtle 1px bottom border */}
        <div
          className={`relative w-full border-b transition-colors duration-500 ${borderLine}`}
        >
          <div className="w-full max-w-[1536px] mx-auto flex items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16 h-16 md:h-[72px]">
            {/* ── Logo — far left ── */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                style={{ fontFamily: "'Ysabeau SC', sans-serif" }}
                className={`font-extrabold text-[22px] md:text-2xl tracking-tight select-none transition-colors duration-300 group inline-flex items-center ${textPrimary}`}
              >
                SK
                <span
                  className={`inline-block transition-transform duration-300 group-hover:scale-110 ${
                    isTransparent
                      ? 'text-white/70'
                      : 'text-[#8F5431] dark:text-[#C58B65]'
                  }`}
                >
                  .
                </span>
              </Link>
            </div>

            {/* ── Desktop Single-line Navigation ── */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-1 lg:gap-2"
              onMouseLeave={() => setHoveredLink(null)}
            >
              {/* ▸ Expertise with Circular Downward Arrow */}
              <div ref={expertiseDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setExpertiseOpen((prev) => !prev)}
                  onMouseEnter={() => setHoveredLink('expertise')}
                  aria-expanded={expertiseOpen}
                  className={`relative inline-flex items-center gap-2 px-3 lg:px-4 h-16 md:h-[72px] text-[12.5px] lg:text-[13px] font-medium tracking-[0.05em] uppercase select-none transition-colors duration-300 cursor-pointer ${
                    isExpertiseActive || expertiseOpen
                      ? textPrimary
                      : textSecondary
                  }`}
                >
                  <span>Expertise</span>
                  {/* Small Circular Arrow */}
                  <motion.span
                    animate={{ rotate: expertiseOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-colors duration-300 ${
                      isTransparent
                        ? 'border-white/30 text-white'
                        : 'border-[#161513]/25 dark:border-white/25 text-[#161513] dark:text-[#F4F1EA]'
                    }`}
                  >
                    <ChevronDown className="w-2.5 h-2.5" />
                  </motion.span>

                  {/* Active Underline */}
                  {isExpertiseActive && (
                    <motion.span
                      layoutId="navActiveUnderline"
                      className={`absolute bottom-0 left-3 right-3 h-[1.5px] ${
                        isTransparent
                          ? 'bg-white'
                          : 'bg-[#8F5431] dark:bg-[#C58B65]'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Hover Underline */}
                  {hoveredLink === 'expertise' && !isExpertiseActive && (
                    <motion.span
                      layoutId="navHoverUnderline"
                      className={`absolute bottom-0 left-3 right-3 h-px ${
                        isTransparent
                          ? 'bg-white/40'
                          : 'bg-[#161513]/25 dark:bg-white/25'
                      }`}
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </button>

                {/* Expertise Submenu Dropdown */}
                <AnimatePresence>
                  {expertiseOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-0 min-w-[200px] py-2 bg-[#F4F1EA] dark:bg-[#1A1816] border border-[#161513]/10 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] z-50 rounded-none"
                    >
                      {expertiseSubmenu.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          onClick={(e) => handleNavClick(e, subItem.href)}
                          className="block px-5 py-2.5 text-[12px] uppercase tracking-[0.05em] font-medium text-[#161513]/70 dark:text-[#F4F1EA]/70 hover:text-[#161513] dark:hover:text-[#F4F1EA] hover:bg-[#161513]/5 dark:hover:bg-white/5 transition-colors duration-200"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ▸ About, Services, Skills, Work */}
              {navLinks.map((link) => {
                const isActive =
                  activeSection === link.href || location.pathname === link.href;
                const isHovered = hoveredLink === link.href;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative inline-flex items-center px-3 lg:px-4 h-16 md:h-[72px] text-[12.5px] lg:text-[13px] font-medium tracking-[0.05em] uppercase select-none transition-colors duration-300 ${
                      isActive ? textPrimary : textSecondary
                    }`}
                  >
                    <span>{link.label}</span>

                    {/* Active Underline */}
                    {isActive && (
                      <motion.span
                        layoutId="navActiveUnderline"
                        className={`absolute bottom-0 left-3 right-3 h-[1.5px] ${
                          isTransparent
                            ? 'bg-white'
                            : 'bg-[#8F5431] dark:bg-[#C58B65]'
                        }`}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Hover Underline */}
                    {isHovered && !isActive && (
                      <motion.span
                        layoutId="navHoverUnderline"
                        className={`absolute bottom-0 left-3 right-3 h-px ${
                          isTransparent
                            ? 'bg-white/40'
                            : 'bg-[#161513]/25 dark:bg-white/25'
                        }`}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </a>
                );
              })}

              {/* Thin Vertical Divider */}
              <div
                className={`w-px h-4 mx-2 lg:mx-3 transition-colors duration-500 ${
                  isTransparent
                    ? 'bg-white/15'
                    : 'bg-[#161513]/10 dark:bg-white/10'
                }`}
              />

              {/* ▸ Theme Toggle */}
              <motion.button
                type="button"
                onClick={toggleTheme}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className={`w-9 h-9 flex items-center justify-center cursor-pointer transition-colors duration-300 ${textSecondary}`}
              >
                <div className="relative w-4 h-4">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: theme === 'dark' ? 1 : 0,
                      rotate: theme === 'dark' ? 0 : -90,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sun className="w-4 h-4" />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: theme === 'dark' ? 0 : 1,
                      rotate: theme === 'dark' ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.button>

              {/* ▸ Let's Talk CTA */}
              <div className="ml-2">
                <Magnet strength={2} padding={16}>
                  <a
                    href="/#contact"
                    onClick={(e) => handleNavClick(e, '/#contact')}
                    className={`group inline-flex items-center gap-2 px-4 lg:px-5 py-2 text-[12px] lg:text-[12.5px] font-semibold tracking-[0.05em] uppercase transition-all duration-300 select-none ${
                      isTransparent
                        ? 'bg-white text-[#161513] hover:bg-white/90 shadow-sm'
                        : 'bg-[#161513] dark:bg-[#C58B65] text-[#F4F1EA] dark:text-[#171512] hover:bg-[#8F5431] dark:hover:bg-[#d49a75]'
                    }`}
                  >
                    <span>Let's Talk</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Magnet>
              </div>
            </nav>

            {/* ── Mobile & Tablet Header Controls ── */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`w-9 h-9 flex items-center justify-center cursor-pointer ${textSecondary}`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className={`w-9 h-9 flex items-center justify-center cursor-pointer transition-colors ${textPrimary}`}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-screen Editorial Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] bg-[#F4F1EA] dark:bg-[#161513] flex flex-col justify-between p-6 sm:p-10 transition-colors duration-500"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between pb-6 border-b border-[#161513]/10 dark:border-white/10">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontFamily: "'Ysabeau SC', sans-serif" }}
                className="font-extrabold text-2xl tracking-tight text-[#161513] dark:text-[#F4F1EA]"
              >
                SK<span className="text-[#8F5431] dark:text-[#C58B65]">.</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center text-[#161513] dark:text-[#F4F1EA] hover:opacity-70 transition-opacity cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Editorial Nav Links */}
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.1 },
                },
                hidden: {
                  transition: { staggerChildren: 0.03, staggerDirection: -1 },
                },
              }}
              className="flex-1 flex flex-col justify-center gap-4 py-8"
            >
              {[
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/#services' },
                { label: 'Skills', href: '/#skills' },
                { label: 'Work', href: '/#work' },
              ].map((link, idx) => {
                const isActive =
                  activeSection === link.href || location.pathname === link.href;

                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    className="group flex items-baseline justify-between py-3 border-b border-[#161513]/8 dark:border-white/8 select-none"
                  >
                    <span
                      className={`text-2xl sm:text-3xl font-light uppercase tracking-tight transition-colors duration-300 ${
                        isActive
                          ? 'text-[#8F5431] dark:text-[#C58B65]'
                          : 'text-[#161513] dark:text-[#F4F1EA] group-hover:text-[#8F5431] dark:group-hover:text-[#C58B65]'
                      }`}
                    >
                      {link.label}
                    </span>
                    <span className="text-[#161513]/30 dark:text-white/30 text-xs font-mono">
                      0{idx + 1}
                    </span>
                  </motion.a>
                );
              })}
            </motion.nav>

            {/* Bottom Contact CTA inside Overlay */}
            <div className="pt-6 border-t border-[#161513]/10 dark:border-white/10 flex items-center justify-between">
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, '/#contact')}
                className="inline-flex items-center gap-2 bg-[#161513] dark:bg-[#C58B65] text-[#F4F1EA] dark:text-[#171512] px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em]"
              >
                <span>Let's Talk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-[#161513]/40 dark:text-white/40">
                Sahil Kumar &copy; {new Date().getFullYear()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;