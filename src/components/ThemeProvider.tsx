import React, { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent<HTMLElement> | MouseEvent) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = (event?: React.MouseEvent<HTMLElement> | MouseEvent) => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isViewTransitionSupported =
      !isReducedMotion &&
      typeof document !== 'undefined' &&
      'startViewTransition' in document;

    const switchTheme = () => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
      localStorage.setItem('portfolio-theme', nextTheme);
      setThemeState(nextTheme);
    };

    if (!isViewTransitionSupported) {
      switchTheme();
      return;
    }

    // Coordinates of the toggle button center
    const btn = (event?.currentTarget as HTMLElement) || (event?.target as HTMLElement);
    const rect = btn?.getBoundingClientRect ? btn.getBoundingClientRect() : null;
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;

    // Radius to cover the furthest viewport corner from button center
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Disable background/color transitions during view transition to eliminate flicker
    document.documentElement.classList.add('vt-active');

    try {
      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          switchTheme();
        });
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 700,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {});

      transition.finished.finally(() => {
        document.documentElement.classList.remove('vt-active');
      });
    } catch {
      document.documentElement.classList.remove('vt-active');
      switchTheme();
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
