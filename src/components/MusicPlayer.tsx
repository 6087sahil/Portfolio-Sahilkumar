import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// PLAYLIST — Edit tracks here. `src: ''` = silent fallback.
// ─────────────────────────────────────────────────────────────────────────────
interface Track {
  title:  string;
  artist: string;
  art:    string;   // path relative to /public
  src:    string;   // path relative to /public
}

const TRACKS: Track[] = [
  {
    title:  'Sunflower',
    artist: 'Post Malone & Swae Lee',
    art:    '/assets/images/miles-cover.jpg',
    src:    '/assets/audio/song.mp3',
  },
  // Add more tracks below ↓
  // { title: 'Track 2', artist: 'Artist', art: '/assets/images/x.jpg', src: '/assets/audio/x.mp3' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (s: number): string => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m  = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss < 10 ? '0' : ''}${ss}`;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const LS_TRACK = 'mp-track-idx';
const LS_TIME  = 'mp-current-time';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const MusicPlayer: React.FC = () => {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  /* ── Persist track index across reloads ─────────────────────────────── */
  const [trackIdx,    setTrackIdx]    = useState<number>(() => {
    const saved = parseInt(localStorage.getItem(LS_TRACK) ?? '0', 10);
    return isNaN(saved) ? 0 : clamp(saved, 0, TRACKS.length - 1);
  });
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(() => {
    const saved = parseFloat(localStorage.getItem(LS_TIME) ?? '0');
    return isNaN(saved) ? 0 : saved;
  });
  const [duration,    setDuration]    = useState(0);
  const [isMuted,     setIsMuted]     = useState(false);
  const [isSeeking,   setIsSeeking]   = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [artError,    setArtError]    = useState<Record<number, boolean>>({});

  /* ── Mobile expand/collapse ─────────────────────────────────────────── */
  const [mobileExpanded, setMobileExpanded] = useState(false);

  /* ── Scroll-shrink: hide when user scrolls past hero ───────────────── */
  const [scrolledPast, setScrolledPast] = useState(false);

  /* ── Refs ───────────────────────────────────────────────────────────── */
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const diskRef     = useRef<HTMLDivElement | null>(null);
  const diskAngle   = useRef<number>(0);
  const rafRef      = useRef<number | undefined>(undefined);
  const lastTs      = useRef<number | undefined>(undefined);
  const playerRef   = useRef<HTMLDivElement | null>(null);

  const track    = TRACKS[trackIdx];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ── prefers-reduced-motion ─────────────────────────────────────────── */
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Design tokens: dark vs light ────────────────────────────────────
  // Dark: deep chocolate glass  |  Light: frosted cream glass
  const tokens = {
    bg: isDark
      ? 'linear-gradient(140deg, rgba(32,20,13,.90) 0%, rgba(16,10,7,.95) 100%)'
      : 'linear-gradient(140deg, rgba(244,241,234,.82) 0%, rgba(237,232,222,.88) 100%)',
    border: isDark
      ? (isPlaying ? 'rgba(224,122,59,.4)' : 'rgba(255,255,255,.09)')
      : (isPlaying ? 'rgba(224,122,59,.5)' : 'rgba(22,21,19,.14)'),
    shadow: isDark
      ? (isPlaying
          ? 'inset 0 1px 1px rgba(255,255,255,.14), 0 20px 48px -8px rgba(0,0,0,.75), 0 0 28px rgba(224,122,59,.22)'
          : 'inset 0 1px 1px rgba(255,255,255,.12), 0 16px 40px -8px rgba(0,0,0,.70)')
      : (isPlaying
          ? 'inset 0 1px 0 rgba(255,255,255,.65), 0 16px 40px -8px rgba(110,61,30,.22), 0 0 20px rgba(224,122,59,.14)'
          : 'inset 0 1px 0 rgba(255,255,255,.55), 0 12px 32px -6px rgba(110,61,30,.18), 0 2px 8px rgba(0,0,0,.06)'),
    titleColor: isDark ? '#FDF8F0' : '#161513',
    artistColor: isDark ? 'rgba(253,248,240,.52)' : 'rgba(22,21,19,.5)',
    timeColor: isDark ? 'rgba(253,248,240,.4)' : 'rgba(22,21,19,.38)',
    btnColor: isDark ? 'rgba(253,248,240,.65)' : 'rgba(22,21,19,.6)',
    btnHoverBg: isDark ? 'rgba(255,255,255,.07)' : 'rgba(22,21,19,.06)',
    trackBg: isDark ? 'rgba(255,255,255,.12)' : 'rgba(22,21,19,.1)',
    glowBg: 'radial-gradient(ellipse at center, rgba(224,122,59,.35) 0%, transparent 70%)',
  };

  /* ── Entrance mount ─────────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* ── Scroll-past detection ──────────────────────────────────────────── */
  useEffect(() => {
    const heroHeight = () =>
      (document.querySelector('#hero, .hero-section, [data-section="hero"]') as HTMLElement)
        ?.offsetHeight ?? window.innerHeight;

    const onScroll = () => setScrolledPast(window.scrollY > heroHeight() * 0.75);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Keyboard shortcuts ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const focused = document.activeElement;
      const inPlayer = focused?.closest('[data-mp-player]');
      if (!inPlayer) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'ArrowRight' && audioRef.current)
        audioRef.current.currentTime = clamp(audioRef.current.currentTime + 5, 0, duration);
      if (e.code === 'ArrowLeft' && audioRef.current)
        audioRef.current.currentTime = clamp(audioRef.current.currentTime - 5, 0, duration);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Auto-pause on tab hide ─────────────────────────────────────────── */
  useEffect(() => {
    const fn = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused)
        audioRef.current.pause();
    };
    document.addEventListener('visibilitychange', fn);
    return () => document.removeEventListener('visibilitychange', fn);
  }, []);

  /* ── Persist state to localStorage ─────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem(LS_TRACK, String(trackIdx));
  }, [trackIdx]);

  useEffect(() => {
    localStorage.setItem(LS_TIME, String(currentTime));
  }, [currentTime]);

  /* ── Volume sync ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : 0.8;
  }, [isMuted]);

  /* ── Vinyl disc rotation via RAF ─────────────────────────────────────── */
  useEffect(() => {
    if (reduced) return;

    const spin = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;
      if (diskRef.current) {
        diskAngle.current = (diskAngle.current + delta * 0.045) % 360;
        diskRef.current.style.transform = `rotate(${diskAngle.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(spin);
    };

    if (isPlaying) {
      lastTs.current = undefined;
      rafRef.current = requestAnimationFrame(spin);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTs.current = undefined;
    }

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, reduced]);

  /* ── Audio event wiring ─────────────────────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay       = () => { setIsPlaying(true);  setIsLoading(false); };
    const onPause      = () => { setIsPlaying(false); setIsLoading(false); };
    const onWaiting    = () => setIsLoading(true);
    const onCanPlay    = () => setIsLoading(false);
    const onTimeUpdate = () => { if (!isSeeking) setCurrentTime(audio.currentTime); };
    const onMeta       = () => setDuration(audio.duration || 0);
    const onEnded      = () => handleNext();

    audio.addEventListener('play',            onPlay);
    audio.addEventListener('pause',           onPause);
    audio.addEventListener('waiting',         onWaiting);
    audio.addEventListener('canplay',         onCanPlay);
    audio.addEventListener('timeupdate',      onTimeUpdate);
    audio.addEventListener('loadedmetadata',  onMeta);
    audio.addEventListener('ended',           onEnded);

    return () => {
      audio.removeEventListener('play',            onPlay);
      audio.removeEventListener('pause',           onPause);
      audio.removeEventListener('waiting',         onWaiting);
      audio.removeEventListener('canplay',         onCanPlay);
      audio.removeEventListener('timeupdate',      onTimeUpdate);
      audio.removeEventListener('loadedmetadata',  onMeta);
      audio.removeEventListener('ended',           onEnded);
    };
  }, [isSeeking, trackIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Track change: reset + optionally continue playing ──────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setArtError({});
    audio.load();
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [trackIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      try { await audio.play(); } catch { setIsPlaying(false); setIsLoading(false); }
    }
  }, [isPlaying]);

  const handlePrev = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length);
    }
  }, [currentTime]);

  const handleNext = useCallback(() => {
    setTrackIdx(i => (i + 1) % TRACKS.length);
  }, []);

  /* ── Progress bar seek (mouse) ──────────────────────────────────────── */
  const getSeekFrac = (e: MouseEvent | React.MouseEvent) => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const { left, width } = bar.getBoundingClientRect();
    return clamp((e.clientX - left) / width, 0, 1);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSeeking(true);
    setCurrentTime(getSeekFrac(e) * duration);

    const onMove = (ev: MouseEvent) => setCurrentTime(getSeekFrac(ev) * duration);
    const onUp   = (ev: MouseEvent) => {
      const f = getSeekFrac(ev);
      if (audioRef.current && duration) audioRef.current.currentTime = f * duration;
      setCurrentTime(f * duration);
      setIsSeeking(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /* ── Progress bar seek (touch) ──────────────────────────────────────── */
  const getSeekFracTouch = (e: TouchEvent | React.TouchEvent) => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const touch = (e as TouchEvent).touches?.[0] ?? (e as React.TouchEvent).touches?.[0];
    const { left, width } = bar.getBoundingClientRect();
    return clamp((touch.clientX - left) / width, 0, 1);
  };

  const handleProgressTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsSeeking(true);
    setCurrentTime(getSeekFracTouch(e) * duration);

    const onMove = (ev: TouchEvent) => setCurrentTime(getSeekFracTouch(ev) * duration);
    const onEnd  = (ev: TouchEvent) => {
      const f = getSeekFracTouch(ev);
      if (audioRef.current && duration) audioRef.current.currentTime = f * duration;
      setCurrentTime(f * duration);
      setIsSeeking(false);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  };

  /* ── Swipe-down to collapse (mobile expanded) ───────────────────────── */
  const swipeStartY = useRef<number | null>(null);
  const handleTouchStartPlayer = (e: React.TouchEvent) => {
    swipeStartY.current = e.touches[0].clientY;
  };
  const handleTouchEndPlayer = (e: React.TouchEvent) => {
    if (swipeStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - swipeStartY.current;
    if (dy > 60) setMobileExpanded(false);  // swipe down ≥60px → collapse
    swipeStartY.current = null;
  };

  /* ── Click-outside to collapse (mobile expanded) ────────────────────── */
  useEffect(() => {
    if (!mobileExpanded) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (playerRef.current && !playerRef.current.contains(e.target as Node))
        setMobileExpanded(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [mobileExpanded]);

  /* ── Render ─────────────────────────────────────────────────────────── */
  const hasArt = !artError[trackIdx];

  /* ─────────────────────────────────────────────────────────────────────
     The player has three visual modes controlled by CSS + inline styles:
       • mobile-collapsed  (<640px, default)   – disc + play button only
       • mobile-expanded   (<640px, tapped)    – full-width bottom bar
       • desktop/tablet    (≥640px)            – pill, bottom-right
     ───────────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Scoped CSS ──────────────────────────────────────────────────── */}
      <style>{`
        /* ── EQ bar animations ─────────────────────── */
        @keyframes mp-eq1 { 0%,100%{transform:scaleY(.25)} 40%{transform:scaleY(1)}   70%{transform:scaleY(.6)}  }
        @keyframes mp-eq2 { 0%,100%{transform:scaleY(.8)}  30%{transform:scaleY(.2)}  65%{transform:scaleY(1)}   }
        @keyframes mp-eq3 { 0%,100%{transform:scaleY(.4)}  50%{transform:scaleY(1)}   80%{transform:scaleY(.3)}  }
        @keyframes mp-eq4 { 0%,100%{transform:scaleY(1)}   45%{transform:scaleY(.3)}  75%{transform:scaleY(.7)}  }

        .mp-eq-bar { transform-origin: bottom center; }
        .mp-eq-playing .mp-eq-bar-1 { animation: mp-eq1 0.85s ease-in-out infinite; }
        .mp-eq-playing .mp-eq-bar-2 { animation: mp-eq2 0.70s ease-in-out infinite; animation-delay:.15s; }
        .mp-eq-playing .mp-eq-bar-3 { animation: mp-eq3 0.95s ease-in-out infinite; animation-delay:.08s; }
        .mp-eq-playing .mp-eq-bar-4 { animation: mp-eq4 0.75s ease-in-out infinite; animation-delay:.22s; }

        /* ── Ambient glow pulse ────────────────────── */
        @keyframes mp-glow { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.55;transform:scale(1.04)} }

        /* ── Spinner ───────────────────────────────── */
        @keyframes mp-spin { to{transform:rotate(360deg)} }
        .mp-spinner { animation: mp-spin .9s linear infinite; }

        /* ── Focus ring ────────────────────────────── */
        .mp-btn:focus-visible { outline: 2px solid #E07A3B; outline-offset: 3px; border-radius: 50%; }

        /* ── Progress: thumb on hover ──────────────── */
        .mp-progress:hover .mp-thumb { opacity: 1 !important; }
        .mp-progress { cursor: pointer; touch-action: none; }

        /* ── Hover-lift on pill ────────────────────── */
        .mp-pill {
          transition:
            transform 0.25s cubic-bezier(.22,1,.36,1),
            border-color 0.4s ease,
            box-shadow 0.4s ease;
        }
        .mp-pill:hover { transform: translateY(-2px); }

        /* ───────────────────────────────────────────────────────────────
           RESPONSIVE LAYOUT
           ─────────────────────────────────────────────────────────────── */

        /* ── Root wrapper ──────────────────────────────────────────────── */
        .mp-root {
          position: fixed;
          z-index: 9998;
          pointer-events: auto;
          user-select: none;

          /* Desktop/Tablet default: bottom-right */
          bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
          right:  calc(1.5rem + env(safe-area-inset-right, 0px));
        }

        /* ── Desktop (≥1024px) ─────────────────────────────────────────── */
        @media (min-width: 1024px) {
          .mp-root {
            bottom: calc(2rem + env(safe-area-inset-bottom, 0px));
            right:  calc(2rem  + env(safe-area-inset-right, 0px));
          }
          .mp-pill { min-width: 380px; max-width: 440px; }
          .mp-volume-btn { display: flex !important; }
          .mp-time { display: block !important; }
        }

        /* ── Tablet (640–1023px) ───────────────────────────────────────── */
        @media (min-width: 640px) and (max-width: 1023px) {
          .mp-pill { min-width: 300px; max-width: 360px; }
          .mp-volume-btn { display: none !important; }   /* hide volume on tablet */
          .mp-time { display: block !important; }
        }

        /* ── Mobile (<640px) ───────────────────────────────────────────── */
        @media (max-width: 639px) {
          /* Collapsed state: compact pill, disc + play only */
          .mp-root {
            bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
            right:  calc(1rem + env(safe-area-inset-right, 0px));
          }
          .mp-pill {
            min-width: 0;
            max-width: none;
          }
          .mp-collapsed-pill {
            display: flex !important;
          }
          .mp-full-pill {
            display: none !important;
          }

          /* Expanded state: slides up as a full-width bottom bar */
          .mp-root.mp-mobile-expanded {
            bottom: 0;
            right: 0;
            left: 0;
          }
          .mp-root.mp-mobile-expanded .mp-collapsed-pill {
            display: none !important;
          }
          .mp-root.mp-mobile-expanded .mp-full-pill {
            display: flex !important;
            border-radius: 20px 20px 0 0 !important;
            min-width: 100% !important;
            padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px)) !important;
          }
          .mp-root.mp-mobile-expanded .mp-pill {
            border-radius: 20px 20px 0 0 !important;
          }
          .mp-volume-btn { display: none !important; }
          .mp-time { display: block !important; }
        }

        /* ── Scroll-shrunk state ───────────────────────────────────────── */
        .mp-root.mp-scrolled {
          opacity: 0.75;
          transform: scale(0.92);
          transform-origin: bottom right;
        }
        .mp-root.mp-scrolled:hover {
          opacity: 1;
          transform: scale(1);
        }

        /* ── Reduced motion overrides ──────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .mp-eq-bar, .mp-spinner { animation: none !important; }
          .mp-pill:hover { transform: none; }
          .mp-root, .mp-pill { transition: none !important; }
        }
      `}</style>

      {/* ── Hidden native audio element ──────────────────────────────────── */}
      <audio
        ref={audioRef}
        src={track.src || undefined}
        preload="metadata"
        loop={TRACKS.length === 1}
      />

      {/* ══ PLAYER ROOT ═════════════════════════════════════════════════════ */}
      <div
        ref={playerRef}
        data-mp-player
        role="region"
        aria-label="Music player"
        className={[
          'mp-root',
          scrolledPast  ? 'mp-scrolled' : '',
          mobileExpanded ? 'mp-mobile-expanded' : '',
        ].join(' ')}
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? undefined : 'translateY(24px)',
          transition: reduced
            ? 'none'
            : 'opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {/* ── Ambient glow ───────────────────────────────────────────────── */}
        {!reduced && (
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              inset:     '-32px',
              background: tokens.glowBg,
              animation:  isPlaying ? 'mp-glow 3s ease-in-out infinite' : 'none',
              opacity:    isPlaying ? (isDark ? 0.4 : 0.25) : 0,
              transition: 'opacity .6s ease',
              zIndex:     -1,
            }}
          />
        )}

        {/* ══ MOBILE COLLAPSED PILL (disc + play only, <640px) ════════════ */}
        <div
          className="mp-collapsed-pill"
          style={{
            display:        'none',         /* shown via CSS at <640px */
            alignItems:     'center',
            gap:            '10px',
            padding:        '8px 14px 8px 8px',
            borderRadius:   '999px',
            background:     tokens.bg,
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border:         `1px solid ${tokens.border}`,
            boxShadow:      tokens.shadow,
          }}
        >
          {/* Disc — tapping expands player */}
          <button
            className="mp-btn relative flex-shrink-0"
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'transparent', padding: 0 }}
            onClick={() => setMobileExpanded(true)}
            aria-label="Expand music player"
          >
            {/* Ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: '-3px',
                border: `1.5px solid ${isPlaying ? 'rgba(224,122,59,.8)' : 'rgba(224,122,59,.3)'}`,
                boxShadow: isPlaying ? '0 0 10px rgba(224,122,59,.4)' : 'none',
                transition: 'border-color .4s, box-shadow .4s',
              }}
            />
            {/* Disc */}
            <div
              ref={diskRef}
              className="w-full h-full rounded-full overflow-hidden"
              style={{ background: '#160E09', willChange: 'transform' }}
            >
              {hasArt ? (
                <img
                  src={track.art}
                  alt={`${track.title} album art`}
                  onError={() => setArtError(p => ({ ...p, [trackIdx]: true }))}
                  className="w-full h-full object-cover block"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full"
                  style={{ background: 'radial-gradient(circle, #2E190E 0%, #110B07 100%)' }}
                />
              )}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 32% 24%, rgba(255,255,255,.26) 0%, transparent 55%)' }}
              />
            </div>
            {/* Spindle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 7, height: 7, background: 'radial-gradient(circle, #E07A3B 20%, #1A110C 80%)' }}
            />
          </button>

          {/* Play/Pause */}
          <button
            className="mp-btn relative flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              width: 44, height: 44, minWidth: 44, color: '#FDF8F0',
              background: isPlaying
                ? 'linear-gradient(145deg,#C06028,#E07A3B 50%,#F09050)'
                : 'linear-gradient(145deg,#A85020,#C86830 60%,#E07A3B)',
              boxShadow: isPlaying
                ? '0 0 20px rgba(224,122,59,.55), 0 4px 10px rgba(0,0,0,.4)'
                : '0 4px 12px rgba(0,0,0,.35)',
            }}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            aria-pressed={isPlaying}
          >
            {isLoading ? (
              <svg className="mp-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            ) : isPlaying ? (
              <svg width="13" height="15" viewBox="0 0 12 15" fill="currentColor">
                <rect x="0" y="0" width="4" height="15" rx="1.5"/>
                <rect x="8" y="0" width="4" height="15" rx="1.5"/>
              </svg>
            ) : (
              <svg width="14" height="15" viewBox="0 0 14 15" fill="currentColor" style={{ marginLeft: 2 }}>
                <path d="M1.5 1.3a1 1 0 0 0-1.5.86v11.68a1 1 0 0 0 1.5.87l10.9-5.84a1 1 0 0 0 0-1.74L1.5 1.3z"/>
              </svg>
            )}
          </button>
        </div>

        {/* ══ FULL PILL (tablet + desktop always; mobile-expanded on tap) ═══ */}
        <div
          className="mp-full-pill mp-pill relative flex items-center gap-3"
          style={{
            /* Mobile: hidden by default (shown via .mp-mobile-expanded CSS) */
            display:              'flex',   /* overridden to none on <640px */
            padding:              'clamp(8px,1.2vw,10px) clamp(10px,1.5vw,16px)',
            borderRadius:         '999px',
            background:           tokens.bg,
            backdropFilter:       'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border:               `1px solid ${tokens.border}`,
            boxShadow:            tokens.shadow,
          }}
          onTouchStart={handleTouchStartPlayer}
          onTouchEnd={handleTouchEndPlayer}
        >
          {/* Close button — mobile expanded only */}
          <button
            className="mp-btn absolute top-3 right-4 flex items-center justify-center rounded-full"
            style={{
              display:    'none',           /* shown via CSS when expanded on mobile */
              width:  32, height: 32,
              background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(22,21,19,.07)',
              color:      tokens.btnColor,
            }}
            onClick={() => setMobileExpanded(false)}
            aria-label="Collapse player"
            id="mp-close-btn"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2 10 10M10 2 2 10"/>
            </svg>
          </button>

          {/* ── Vinyl disc ────────────────────────────────────────────────── */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 'clamp(44px,5vw,52px)', height: 'clamp(44px,5vw,52px)' }}
          >
            {/* Accent ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset:     '-3px',
                border:    `1.5px solid ${isPlaying ? 'rgba(224,122,59,.8)' : 'rgba(224,122,59,.3)'}`,
                boxShadow: isPlaying ? '0 0 10px rgba(224,122,59,.4)' : 'none',
                transition: 'border-color .4s, box-shadow .4s',
              }}
            />
            {/* Disc */}
            <div
              ref={diskRef}
              className="w-full h-full rounded-full overflow-hidden relative"
              style={{ background: '#160E09', willChange: 'transform' }}
            >
              {hasArt ? (
                <img
                  src={track.art}
                  alt={`${track.title} album art`}
                  onError={() => setArtError(p => ({ ...p, [trackIdx]: true }))}
                  className="w-full h-full object-cover block"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full"
                  style={{ background: 'radial-gradient(circle, #2E190E 0%, #110B07 100%)' }}
                />
              )}
              {/* Sheen */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 32% 24%, rgba(255,255,255,.26) 0%, transparent 55%)' }}
              />
            </div>
            {/* Spindle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 8, height: 8,
                background: 'radial-gradient(circle, #E07A3B 20%, #1A110C 80%)',
                boxShadow: '0 0 4px rgba(0,0,0,.8)',
              }}
            />
          </div>

          {/* ── Track info + progress ─────────────────────────────────────── */}
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            {/* Title row + EQ */}
            <div className="flex items-center gap-1.5 min-w-0">
              {/* 4-bar EQ */}
              <div
                className={`flex items-end gap-[2px] flex-shrink-0 overflow-hidden ${isPlaying ? 'mp-eq-playing' : ''}`}
                style={{ height: 12, width: 14 }}
                aria-hidden="true"
              >
                {[1, 2, 3, 4].map(n => (
                  <span
                    key={n}
                    className={`mp-eq-bar mp-eq-bar-${n} rounded-sm`}
                    style={{
                      width:      3,
                      height:     isPlaying ? 12 : 4,
                      background: '#E07A3B',
                      display:    'block',
                      flexShrink: 0,
                      transition: isPlaying ? 'none' : 'height .3s ease',
                    }}
                  />
                ))}
              </div>

              {/* Title — truncated */}
              <span
                className="text-[clamp(11px,1.1vw,13px)] font-semibold leading-tight truncate"
                style={{
                  color:      tokens.titleColor,
                  fontFamily: "'Satoshi','Manrope',sans-serif",
                  textShadow: isDark ? '0 1px 2px rgba(0,0,0,.4)' : 'none',
                }}
              >
                {track.title}
              </span>
            </div>

            {/* Artist — truncated */}
            <span
              className="text-[clamp(9px,0.9vw,11px)] font-medium leading-none truncate"
              style={{ color: tokens.artistColor, fontFamily: "'Satoshi','Manrope',sans-serif" }}
            >
              {track.artist}
            </span>

            {/* Progress bar row */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Current time */}
              <span
                className="mp-time text-[9px] font-mono tabular-nums"
                style={{ color: tokens.timeColor, minWidth: 24 }}
              >
                {fmt(currentTime)}
              </span>

              {/* Seek track */}
              <div
                ref={progressRef}
                className="mp-progress relative flex-1 flex items-center"
                style={{ height: 20 }}
                onMouseDown={handleProgressMouseDown}
                onTouchStart={handleProgressTouchStart}
                role="slider"
                aria-label="Seek"
                aria-valuenow={Math.round(currentTime)}
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                tabIndex={0}
                onKeyDown={e => {
                  if (!audioRef.current) return;
                  if (e.code === 'ArrowRight') audioRef.current.currentTime = clamp(currentTime + 5, 0, duration);
                  if (e.code === 'ArrowLeft')  audioRef.current.currentTime = clamp(currentTime - 5, 0, duration);
                }}
              >
                {/* Track bg */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 3, background: tokens.trackBg }}
                >
                  {/* Fill */}
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:      `${progress}%`,
                      background: 'linear-gradient(90deg,#C06028,#E07A3B 60%,#F09050)',
                      boxShadow:  '0 0 6px rgba(224,122,59,.55)',
                      transition: isSeeking ? 'none' : 'width .15s linear',
                    }}
                  />
                </div>
                {/* Thumb */}
                <div
                  className="mp-thumb absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width:      12,
                    height:     12,
                    left:       `calc(${progress}% - 6px)`,
                    background: isDark ? '#FAF5ED' : '#161513',
                    boxShadow:  '0 0 6px rgba(0,0,0,.5), 0 0 4px #E07A3B',
                    opacity:    0,
                    transition: 'opacity .15s ease',
                  }}
                />
              </div>

              {/* Duration */}
              <span
                className="mp-time text-[9px] font-mono tabular-nums"
                style={{ color: tokens.timeColor, minWidth: 24, textAlign: 'right' }}
              >
                {fmt(duration)}
              </span>
            </div>
          </div>

          {/* ── Controls ──────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Previous */}
            <button
              className="mp-btn flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                width: 36, height: 36, minWidth: 36,
                color:      tokens.btnColor,
                background: 'transparent',
              }}
              onClick={handlePrev}
              aria-label="Previous track"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Pause — large gradient button */}
            <button
              className="mp-btn relative flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
              style={{
                width: 44, height: 44, minWidth: 44,
                color: '#FDF8F0',
                background: isPlaying
                  ? 'linear-gradient(145deg,#C06028,#E07A3B 50%,#F09050)'
                  : 'linear-gradient(145deg,#A85020,#C86830 60%,#E07A3B)',
                boxShadow: isPlaying
                  ? '0 0 20px rgba(224,122,59,.55), 0 4px 10px rgba(0,0,0,.4), inset 0 1px 1px rgba(255,255,255,.25)'
                  : '0 4px 12px rgba(0,0,0,.35), inset 0 1px 1px rgba(255,255,255,.2)',
                transition: 'background .3s ease, box-shadow .3s ease',
              }}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              aria-pressed={isPlaying}
            >
              {isLoading ? (
                <svg className="mp-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                  <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              ) : isPlaying ? (
                <svg width="13" height="15" viewBox="0 0 12 15" fill="currentColor">
                  <rect x="0" y="0" width="4" height="15" rx="1.5"/>
                  <rect x="8" y="0" width="4" height="15" rx="1.5"/>
                </svg>
              ) : (
                <svg width="14" height="15" viewBox="0 0 14 15" fill="currentColor" style={{ marginLeft: 2 }}>
                  <path d="M1.5 1.3a1 1 0 0 0-1.5.86v11.68a1 1 0 0 0 1.5.87l10.9-5.84a1 1 0 0 0 0-1.74L1.5 1.3z"/>
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              className="mp-btn flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                width: 36, height: 36, minWidth: 36,
                color:      tokens.btnColor,
                background: 'transparent',
              }}
              onClick={handleNext}
              aria-label="Next track"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18 14.5 12 6 6v12zm8-12v12h2V6h-2z"/>
              </svg>
            </button>

            {/* Volume (desktop only via CSS) */}
            <button
              className="mp-btn mp-volume-btn flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                display: 'flex',          /* hidden tablet/mobile via CSS */
                width: 36, height: 36, minWidth: 36,
                color: isMuted ? (isDark ? 'rgba(253,248,240,.3)' : 'rgba(22,21,19,.28)') : tokens.btnColor,
                background: 'transparent',
              }}
              onClick={() => setIsMuted(m => !m)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              )}
            </button>
          </div>

        </div>{/* end full pill */}

        {/* ── Show close button in expanded mobile only via inline override ── */}
        <style>{`
          @media (max-width: 639px) {
            .mp-root.mp-mobile-expanded #mp-close-btn { display: flex !important; }
          }
        `}</style>

      </div>
    </>
  );
};

export default MusicPlayer;
