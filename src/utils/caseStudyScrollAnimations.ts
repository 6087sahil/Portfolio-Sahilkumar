/**
 * Case Study Scroll-Triggered Animation Controller
 * 
 * Automatically identifies and animates case study elements without modifying existing markup.
 * - IntersectionObserver (threshold: 0.15, rootMargin: '0px 0px -10% 0px')
 * - GPU-accelerated transforms & opacity with dynamic will-change cleanup
 * - Number count-up animation for stats
 * - Soft upward slide + scale + subtle scroll parallax for phone mockups
 * - Thin 2px maroon (#560E22) progress bar for sticky top nav
 * - Respects prefers-reduced-motion
 */

export function initCaseStudyScrollAnimations(): () => void {
  // Check user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Apply 'js' class on <html> to enable initial hidden states only when JS runs
  document.documentElement.classList.add('js');
  document.body.classList.add('case-study-active');

  const container = document.querySelector('article');
  if (!container) {
    return () => {};
  }

  // 2. Mark and categorize elements inside the case study container
  markCaseStudyElements(container);

  // 3. Inject sticky top nav 2px scroll progress bar
  const removeProgressBar = setupTopNavProgressBar();

  // If reduced motion is requested, immediately reveal everything without animating
  if (prefersReduced) {
    const revealEls = container.querySelectorAll<HTMLElement>('[data-reveal]');
    revealEls.forEach((el) => el.classList.add('is-revealed'));
    return () => {
      document.body.classList.remove('case-study-active');
      removeProgressBar();
    };
  }

  // 4. Setup IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;

          // Add will-change right before transition starts
          el.style.willChange = 'opacity, transform';

          // Reveal element
          el.classList.add('is-revealed');

          // If element has stat number or contains stat counters, run number count-up
          if (el.hasAttribute('data-reveal-stat')) {
            animateNumberCountUp(el);
          } else {
            const childStats = el.querySelectorAll<HTMLElement>('[data-reveal-stat]');
            childStats.forEach((statEl) => animateNumberCountUp(statEl));
          }

          // Clean up will-change after transition completes
          const cleanupWillChange = () => {
            el.style.willChange = 'auto';
            el.removeEventListener('transitionend', cleanupWillChange);
          };
          el.addEventListener('transitionend', cleanupWillChange);
          // Fallback timer if transitionend does not fire
          setTimeout(cleanupWillChange, 1200);

          // Animate only once
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  const elementsToObserve = container.querySelectorAll<HTMLElement>('[data-reveal]');
  elementsToObserve.forEach((el) => observer.observe(el));

  // 5. Light Parallax for Phone Mockups (max ~20-25px translate)
  const phoneEls = container.querySelectorAll<HTMLElement>('[data-reveal="phone"]');
  let ticking = false;

  const onScrollParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const windowHeight = window.innerHeight;
      phoneEls.forEach((phone) => {
        if (!phone.classList.contains('is-revealed')) return;
        const rect = phone.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > windowHeight) return;

        // Progress from center of viewport (-1 to 1)
        const centerY = rect.top + rect.height / 2;
        const delta = (centerY - windowHeight / 2) / (windowHeight / 2);
        // Max ±20px translate
        const parallaxY = Math.round(delta * 20);
        phone.style.setProperty('--phone-parallax-y', `${parallaxY}px`);
      });
    });
  };

  window.addEventListener('scroll', onScrollParallax, { passive: true });
  onScrollParallax(); // Initial position check

  // Cleanup handler
  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', onScrollParallax);
    removeProgressBar();
    document.body.classList.remove('case-study-active');
  };
}

/**
 * Automatically tag case study sections and children without modifying raw markup
 */
function markCaseStudyElements(container: HTMLElement) {
  const sections = container.querySelectorAll<HTMLElement>('section');

  sections.forEach((section) => {
    // 1. Eyebrow labels (uppercase monospace tags)
    const eyebrows = section.querySelectorAll<HTMLElement>(
      'span.font-mono.text-xs.uppercase, span.font-mono.text-\\[11px\\].uppercase'
    );
    eyebrows.forEach((el) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'section');
        el.setAttribute('data-reveal-delay', '0');
      }
    });

    // 2. Section Headings (h1, h2, h3)
    const headings = section.querySelectorAll<HTMLElement>('h1, h2, h3');
    headings.forEach((el) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'section');
        el.setAttribute('data-reveal-delay', '1');
      }
    });

    // 3. Body paragraphs
    const paragraphs = section.querySelectorAll<HTMLElement>('p');
    paragraphs.forEach((el, index) => {
      // Avoid tagging paragraphs already inside cards or phones to prevent double transforms
      if (el.closest('[data-reveal="card"]') || el.closest('[data-reveal="phone"]')) return;
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'section');
        const delayStep = Math.min(2 + (index % 3), 4);
        el.setAttribute('data-reveal-delay', delayStep.toString());
      }
    });

    // 4. Cards (bordered cards, 2-column cards, reflection cards, process artifacts)
    const cardCandidates = section.querySelectorAll<HTMLElement>(
      '.rounded-xl.border, .rounded-2xl.border, .rounded-2xl.bg-\\[\\#FAF8F5\\], .rounded-xl.bg-\\[\\#FAF8F5\\]'
    );
    cardCandidates.forEach((card, index) => {
      // Don't mark if it's already inside another card or is a phone mockup
      if (card.parentElement?.closest('.rounded-2xl.border') || card.querySelector('figure')) return;
      if (!card.hasAttribute('data-reveal')) {
        card.setAttribute('data-reveal', 'card');
        const colDelay = (index % 2).toString();
        card.setAttribute('data-reveal-delay', colDelay);
      }
    });

    // 5. Pull quote block (Tanya M. quote)
    const pullQuotes = section.querySelectorAll<HTMLElement>('blockquote');
    pullQuotes.forEach((quote) => {
      if (!quote.hasAttribute('data-reveal')) {
        quote.setAttribute('data-reveal', 'quote');
        quote.setAttribute('data-reveal-delay', '3'); // Reveal gently after heading
      }
    });

    // 6. Phone mockups and device figures
    const phoneFigures = section.querySelectorAll<HTMLElement>('figure');
    phoneFigures.forEach((figure) => {
      if (!figure.hasAttribute('data-reveal')) {
        figure.setAttribute('data-reveal', 'phone');
      }
    });

    // Also check for phone mockup image wrappers if figure is not used
    const phoneScreens = section.querySelectorAll<HTMLElement>('.aspect-\\[9\\/19\\.5\\]');
    phoneScreens.forEach((screen) => {
      const parent = screen.closest<HTMLElement>('.relative.rounded-\\[36px\\], .relative.rounded-\\[40px\\]');
      if (parent && !parent.hasAttribute('data-reveal') && !parent.closest('[data-reveal="phone"]')) {
        parent.setAttribute('data-reveal', 'phone');
      }
    });

    // 7. Stats & Number Callouts
    const statNumbers = section.querySelectorAll<HTMLElement>(
      '.font-serif.text-4xl, .font-serif.text-2xl, .font-serif.text-3xl'
    );
    statNumbers.forEach((stat) => {
      const text = stat.textContent || '';
      // Look for numbers like "14+ days", "£15,000 / month", "₹15,000"
      if (/\d+/.test(text) && !stat.querySelector('span[ref]')) {
        stat.setAttribute('data-reveal-stat', 'true');
      }
    });
  });

  // Footer CTA heading & arrow nudge
  const footer = container.querySelector<HTMLElement>('footer');
  if (footer) {
    const footerHeading = footer.querySelector<HTMLElement>('a.font-serif, .font-serif');
    if (footerHeading && !footerHeading.hasAttribute('data-reveal')) {
      footerHeading.setAttribute('data-reveal', 'section');
      footerHeading.setAttribute('data-reveal-delay', '0');
    }
    const footerArrow = footer.querySelector<HTMLElement>('svg.lucide-arrow-up-right');
    if (footerArrow) {
      footerArrow.classList.add('cta-arrow-nudge');
    }
  }
}

/**
 * 2px scroll progress bar at the very top of the sticky top nav
 */
function setupTopNavProgressBar(): () => void {
  const header = document.querySelector<HTMLElement>('header');
  if (!header) return () => {};

  // Check if already injected
  let progressBar = header.querySelector<HTMLElement>('.case-study-nav-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'case-study-nav-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    header.style.position = 'sticky';
    header.prepend(progressBar);
  }

  let rafId: number | null = null;
  const updateProgress = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (!progressBar) return;
      const scrollY = window.scrollY;
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalDocHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalDocHeight)) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    });
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  return () => {
    window.removeEventListener('scroll', updateProgress);
    if (progressBar && progressBar.parentNode) {
      progressBar.parentNode.removeChild(progressBar);
    }
  };
}

/**
 * Count up numeric stats from 0 once entering viewport
 */
function animateNumberCountUp(el: HTMLElement) {
  if (el.dataset.counted === 'true') return;
  el.dataset.counted = 'true';

  const originalContent = el.textContent || '';
  // Match prefix, number (with optional commas/decimals), and suffix
  const match = originalContent.trim().match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return;

  const prefix = match[1];
  const rawNum = match[2].replace(/,/g, '');
  const suffix = match[3];
  const target = parseFloat(rawNum);
  if (isNaN(target)) return;

  const hasCommas = match[2].includes(',');
  const duration = 1100;
  const startTime = performance.now();

  function step(time: number) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * ease);

    const formatted = hasCommas ? current.toLocaleString('en-US') : current.toString();
    el.textContent = `${prefix}${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Ensure pixel-identical final string
      el.textContent = originalContent;
    }
  }

  requestAnimationFrame(step);
}
