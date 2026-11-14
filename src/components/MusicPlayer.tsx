import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// PLAYLIST — Exact tracks from the design reference + Sunflower
// ─────────────────────────────────────────────────────────────────────────────
interface Track {
  title:    string;
  artist:   string;
  tag?:     string;
  art:      string;
  src:      string;
}

const TRACKS: Track[] = [
  {
    title:  'Soft Landing',
    artist: 'Milo June',
    tag:    'DAILY ROTATION',
    art:    '/assets/images/album-cover.jpg',
    src:    '/assets/audio/song.mp3',
  },
  {
    title:  'Sunflower',
    artist: 'Post Malone & Swae Lee',
    tag:    'RECOMMENDED',
    art:    '/assets/images/miles-cover.jpg',
    src:    '/assets/audio/song.mp3',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (s: number): string => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss < 10 ? '0' : ''}${ss}`;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const LS_TRACK = 'mp-crate-track';
const LS_TIME  = 'mp-crate-time';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const MusicPlayer: React.FC = () => {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  /* ── Core state ───────────────────────────────────────────────────────── */
  const [trackIdx, setTrackIdx] = useState<number>(() => {
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
  const [isShuffle,   setIsShuffle]   = useState(false);
  const [isRepeat,    setIsRepeat]    = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [artError,    setArtError]    = useState<Record<number, boolean>>({});

  /* ── Refs ─────────────────────────────────────────────────────────────── */
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const diskRef     = useRef<HTMLDivElement | null>(null);
  const miniDiskRef = useRef<HTMLDivElement | null>(null);
  const diskAngle   = useRef<number>(0);
  const rafRef      = useRef<number | undefined>(undefined);
  const lastTs      = useRef<number | undefined>(undefined);

  const track    = TRACKS[trackIdx];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const reduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mount animation ──────────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 250);
    return () => clearTimeout(t);
  }, []);

  /* ── Persist to localStorage ──────────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem(LS_TRACK, String(trackIdx));
  }, [trackIdx]);

  useEffect(() => {
    localStorage.setItem(LS_TIME, String(currentTime));
  }, [currentTime]);

  /* ── Keyboard shortcut: Space = Play/Pause ────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inPlayer = document.activeElement?.closest('[data-crate-player]');
      if (!inPlayer) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'ArrowRight' && audioRef.current) {
        audioRef.current.currentTime = clamp(audioRef.current.currentTime + 5, 0, duration);
      }
      if (e.code === 'ArrowLeft' && audioRef.current) {
        audioRef.current.currentTime = clamp(audioRef.current.currentTime - 5, 0, duration);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Tab visibility ───────────────────────────────────────────────────── */
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  /* ── Volume sync ──────────────────────────────────────────────────────── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : 0.8;
  }, [isMuted]);

  /* ── Vinyl RAF rotation ───────────────────────────────────────────────── */
  useEffect(() => {
    if (reduced) return;

    const spin = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;

      diskAngle.current = (diskAngle.current + delta * 0.045) % 360;
      if (diskRef.current) {
        diskRef.current.style.transform = `rotate(${diskAngle.current}deg)`;
      }
      if (miniDiskRef.current) {
        miniDiskRef.current.style.transform = `rotate(${diskAngle.current}deg)`;
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

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, reduced]);

  /* ── Audio event wiring ───────────────────────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay       = () => { setIsPlaying(true);  setIsLoading(false); };
    const onPause      = () => { setIsPlaying(false); setIsLoading(false); };
    const onWaiting    = () => setIsLoading(true);
    const onCanPlay    = () => setIsLoading(false);
    const onTimeUpdate = () => { if (!isSeeking) setCurrentTime(audio.currentTime); };
    const onMeta       = () => setDuration(audio.duration || 0);
    const onEnded      = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('waiting',        onWaiting);
    audio.addEventListener('canplay',        onCanPlay);
    audio.addEventListener('timeupdate',     onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended',          onEnded);

    return () => {
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.removeEventListener('waiting',        onWaiting);
      audio.removeEventListener('canplay',        onCanPlay);
      audio.removeEventListener('timeupdate',     onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended',          onEnded);
    };
  }, [isSeeking, trackIdx, isRepeat]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Track change ─────────────────────────────────────────────────────── */
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

  /* ── Controls ─────────────────────────────────────────────────────────── */
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        setIsLoading(false);
      }
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
    if (isShuffle && TRACKS.length > 1) {
      let next = Math.floor(Math.random() * TRACKS.length);
      while (next === trackIdx) next = Math.floor(Math.random() * TRACKS.length);
      setTrackIdx(next);
    } else {
      setTrackIdx(i => (i + 1) % TRACKS.length);
    }
  }, [isShuffle, trackIdx]);

  /* ── Seek progress bar ────────────────────────────────────────────────── */
  const getSeekFrac = (clientX: number) => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const { left, width } = bar.getBoundingClientRect();
    return clamp((clientX - left) / width, 0, 1);
  };

  const handleProgressDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsSeeking(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setCurrentTime(getSeekFrac(clientX) * duration);

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
      setCurrentTime(getSeekFrac(cx) * duration);
    };

    const onUp = (ev: MouseEvent | TouchEvent) => {
      const cx = 'touches' in ev ? (ev.changedTouches?.[0]?.clientX ?? 0) : ev.clientX;
      const f = getSeekFrac(cx);
      if (audioRef.current && duration) {
        audioRef.current.currentTime = f * duration;
      }
      setCurrentTime(f * duration);
      setIsSeeking(false);
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('mouseup', onUp as any);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend', onUp as any);
    };

    window.addEventListener('mousemove', onMove as any);
    window.addEventListener('mouseup', onUp as any);
    window.addEventListener('touchmove', onMove as any, { passive: true });
    window.addEventListener('touchend', onUp as any);
  };

  const hasArt = !artError[trackIdx];

  return (
    <>
      {/* ── Keyframes & Styles ───────────────────────────────────────────── */}
      <style>{`
        @keyframes crate-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.9); }
        }
        .crate-dot-pulse {
          animation: crate-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Equalizer bars for Lossless badge */
        @keyframes crate-lossless-1 { 0%,100%{height:4px} 50%{height:12px} }
        @keyframes crate-lossless-2 { 0%,100%{height:12px} 50%{height:5px} }
        @keyframes crate-lossless-3 { 0%,100%{height:7px} 50%{height:14px} }
        .crate-bar-1 { animation: crate-lossless-1 0.9s ease-in-out infinite; }
        .crate-bar-2 { animation: crate-lossless-2 0.7s ease-in-out infinite; }
        .crate-bar-3 { animation: crate-lossless-3 0.85s ease-in-out infinite; }

        @keyframes crate-spin-loader { to { transform: rotate(360deg); } }
        .crate-spinner { animation: crate-spin-loader 0.8s linear infinite; }

        /* Vinyl realistic grooves */
        .crate-vinyl-grooves {
          background:
            radial-gradient(circle at center, #181716 0%, #11100f 28%, #1f1d1b 30%, #11100f 32%, #1a1917 48%, #11100f 50%, #1e1d1b 68%, #11100f 70%, #151412 100%);
        }
        .crate-sheen {
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.18) 0%,
            rgba(255,255,255,0.02) 40%,
            transparent 50%,
            rgba(255,255,255,0.14) 100%
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .crate-dot-pulse, .crate-bar-1, .crate-bar-2, .crate-bar-3, .crate-spinner {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Native Audio element ─────────────────────────────────────────── */}
      <audio
        ref={audioRef}
        src={track.src || undefined}
        preload="metadata"
        loop={isRepeat}
      />

      {/* ── Floating Root Container ──────────────────────────────────────── */}
      <div
        data-crate-player
        role="region"
        aria-label="Crate Music Player"
        className="fixed z-50 pointer-events-auto select-none transition-all duration-500 ease-out"
        style={{
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          right:  'calc(1.5rem + env(safe-area-inset-right, 0px))',
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? (isMinimized ? 'translateY(0) scale(0.96)' : 'translateY(0) scale(1)')
            : 'translateY(24px) scale(0.96)',
          transformOrigin: 'bottom right',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════════
            MINIMIZED STATE (Sleek Compact Floating Pill)
           ════════════════════════════════════════════════════════════════════ */}
        {isMinimized ? (
          <div
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
            style={{
              background: isDark
                ? 'linear-gradient(145deg, #24201C 0%, #1B1815 100%)'
                : 'linear-gradient(145deg, #FAF7F2 0%, #EFE9DF 100%)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(22,21,19,0.08)',
              boxShadow: isDark
                ? '0 16px 36px -8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 16px 36px -8px rgba(110,61,30,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
            }}
          >
            {/* Mini Vinyl */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 shadow-md">
              <div
                ref={miniDiskRef}
                className="w-full h-full crate-vinyl-grooves relative flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-[#E07A3B] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#181716]" />
                </div>
              </div>
            </div>

            {/* Title & Artist */}
            <div className="flex flex-col pr-1">
              <span
                className="text-[13px] font-bold leading-tight truncate max-w-[120px]"
                style={{ color: isDark ? '#F4F1EA' : '#161513' }}
              >
                {track.title}
              </span>
              <span
                className="text-[10px] font-medium leading-none truncate max-w-[120px]"
                style={{ color: isDark ? '#9E988E' : '#7A746B' }}
              >
                {track.artist}
              </span>
            </div>

            {/* Mini Play / Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-transform active:scale-90"
              style={{
                background: isDark ? '#F4F1EA' : '#161513',
                color: isDark ? '#161513' : '#F4F1EA',
              }}
            >
              {isPlaying ? (
                <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
                  <rect x="0" y="0" width="3.2" height="11" rx="1.2" />
                  <rect x="6.8" y="0" width="3.2" height="11" rx="1.2" />
                </svg>
              ) : (
                <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor" style={{ marginLeft: 1 }}>
                  <path d="M1 0.8a0.8 0.8 0 0 0-1.2.69v8.02a0.8 0.8 0 0 0 1.2.7l7.5-4a0.8 0.8 0 0 0 0-1.41L1 0.8z" />
                </svg>
              )}
            </button>
          </div>
        ) : (
          /* ════════════════════════════════════════════════════════════════════
              EXPANDED EXACT CARD (Matching Reference Image)
             ════════════════════════════════════════════════════════════════════ */
          <div
            className="w-[430px] max-w-[calc(100vw-2rem)] rounded-[32px] p-5 sm:p-6 transition-colors duration-400"
            style={{
              background: isDark
                ? 'linear-gradient(155deg, #231F1B 0%, #1A1714 100%)'
                : 'linear-gradient(155deg, #FBF8F3 0%, #EFE9DF 100%)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(22,21,19,0.06)',
              boxShadow: isDark
                ? '0 24px 60px -10px rgba(0,0,0,0.75), 0 8px 24px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 24px 60px -12px rgba(90,52,25,0.14), 0 8px 20px -6px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            {/* ── TOP HEADER ROW ────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-4">
              {/* Left: 4 orange squares + "Crate" */}
              <div className="flex items-center gap-2.5">
                <div className="grid grid-cols-2 gap-[2.5px] w-4 h-4">
                  <span className="w-[6px] h-[6px] rounded-[1.8px] bg-[#E07A3B]" />
                  <span className="w-[6px] h-[6px] rounded-[1.8px] bg-[#E07A3B]" />
                  <span className="w-[6px] h-[6px] rounded-[1.8px] bg-[#E07A3B]" />
                  <span className="w-[6px] h-[6px] rounded-[1.8px] bg-[#E07A3B]" />
                </div>
                <span
                  className="font-bold text-[15px] tracking-tight leading-none"
                  style={{ color: isDark ? '#F4F1EA' : '#161513' }}
                >
                  Crate
                </span>
              </div>

              {/* Right: Orange dot + "NOW PLAYING" + Minimize button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full bg-[#E07A3B] ${isPlaying ? 'crate-dot-pulse' : ''}`}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: isDark ? '#A69E92' : '#8C8273' }}
                  >
                    NOW PLAYING
                  </span>
                </div>

                {/* Subtle minimize toggle */}
                <button
                  onClick={() => setIsMinimized(true)}
                  aria-label="Minimize player"
                  className="w-5 h-5 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: isDark ? '#F4F1EA' : '#161513' }}
                  title="Minimize"
                >
                  <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
                    <rect width="10" height="2" rx="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── MIDDLE ROW: VINYL & CONTROLS ───────────────────────────── */}
            <div className="flex items-center gap-4 sm:gap-5 mb-5">
              {/* ─ Left: Album Sleeve with sliding vinyl record ─ */}
              <div className="relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center">
                {/* Vinyl Record (protruding ~40% to the right) */}
                <div
                  className="absolute right-[-24px] sm:right-[-28px] w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-xl pointer-events-none"
                  style={{
                    zIndex: 0,
                  }}
                >
                  {/* Rotating Disc */}
                  <div
                    ref={diskRef}
                    className="w-full h-full crate-vinyl-grooves relative flex items-center justify-center"
                    style={{ willChange: 'transform' }}
                  >
                    {/* Concentric sheen */}
                    <div className="absolute inset-0 crate-sheen rounded-full pointer-events-none" />

                    {/* Center Orange Label */}
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-inner relative"
                      style={{ background: '#E07A3B' }}
                    >
                      {/* Spindle hole */}
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{
                          background: '#121110',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.4)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Square Album Jacket/Sleeve (In front of vinyl on the left) */}
                <div
                  className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0"
                  style={{
                    boxShadow: isDark
                      ? '4px 6px 20px -3px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.5)'
                      : '4px 8px 24px -4px rgba(70,40,20,0.22), 0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  {hasArt ? (
                    <img
                      src={track.art}
                      alt={track.title}
                      onError={() => setArtError(p => ({ ...p, [trackIdx]: true }))}
                      className="w-full h-full object-cover block"
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: '#2E190E', color: '#FAF5ED' }}
                    >
                      <span className="text-xs font-bold">{track.title}</span>
                    </div>
                  )}

                  {/* Gentle edge shadow to simulate sleeve opening */}
                  <div
                    className="absolute inset-y-0 right-0 w-3 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to left, rgba(0,0,0,0.3) 0%, transparent 100%)',
                    }}
                  />
                </div>
              </div>

              {/* ─ Right: Song Info, Progress Bar & Controls ─ */}
              <div className="flex flex-col flex-1 min-w-0 pl-1 sm:pl-2">
                {/* Daily Rotation Tag */}
                <span
                  className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] mb-0.5 leading-tight truncate"
                  style={{ color: isDark ? '#9E988E' : '#8A8275' }}
                >
                  {track.tag || 'DAILY ROTATION'}
                </span>

                {/* Song Title */}
                <h3
                  className="text-[18px] sm:text-[21px] font-bold leading-tight truncate tracking-tight mb-0.5"
                  style={{
                    color: isDark ? '#F4F1EA' : '#161513',
                    fontFamily: "'Satoshi', 'Manrope', sans-serif",
                  }}
                >
                  {track.title}
                </h3>

                {/* Artist Name */}
                <p
                  className="text-[12px] sm:text-[13px] font-medium leading-tight truncate mb-3"
                  style={{ color: isDark ? '#B0A89C' : '#6A645B' }}
                >
                  {track.artist}
                </p>

                {/* ─ Progress Bar ─ */}
                <div className="mb-3">
                  <div
                    ref={progressRef}
                    onClick={handleProgressDown}
                    onTouchStart={handleProgressDown}
                    className="relative w-full h-4 flex items-center cursor-pointer group"
                  >
                    {/* Background Track */}
                    <div
                      className="w-full h-[3px] rounded-full overflow-hidden"
                      style={{
                        background: isDark
                          ? 'rgba(255,255,255,0.12)'
                          : 'rgba(22,21,19,0.12)',
                      }}
                    >
                      {/* Active Fill */}
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: '#E07A3B',
                          transition: isSeeking ? 'none' : 'width 0.15s linear',
                        }}
                      />
                    </div>

                    {/* Progress Orange Dot Thumb */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#E07A3B] pointer-events-none transition-transform"
                      style={{
                        left: `calc(${progress}% - 6px)`,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>

                  {/* Time Labels */}
                  <div
                    className="flex justify-between items-center text-[10px] font-medium tracking-tight mt-[-2px]"
                    style={{ color: isDark ? '#8E877C' : '#8C8273' }}
                  >
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration)}</span>
                  </div>
                </div>

                {/* ─ Playback Controls Row ─ */}
                <div className="flex items-center justify-between pt-0.5">
                  {/* Shuffle button */}
                  <button
                    onClick={() => setIsShuffle(s => !s)}
                    aria-label="Toggle shuffle"
                    className="p-1 rounded-full transition-colors"
                    style={{
                      color: isShuffle
                        ? '#E07A3B'
                        : (isDark ? '#8E877C' : '#8C8273'),
                    }}
                    title="Shuffle"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
                    </svg>
                  </button>

                  {/* Previous button */}
                  <button
                    onClick={handlePrev}
                    aria-label="Previous track"
                    className="p-1 rounded-full transition-transform active:scale-90"
                    style={{ color: isDark ? '#F4F1EA' : '#161513' }}
                    title="Previous"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
                    </svg>
                  </button>

                  {/* Play / Pause (Large Solid Dark Round Button) */}
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
                    style={{
                      background: isDark ? '#F4F1EA' : '#181614',
                      color: isDark ? '#181614' : '#F4F1EA',
                      boxShadow: isDark
                        ? '0 6px 18px -2px rgba(0,0,0,0.6)'
                        : '0 8px 20px -3px rgba(0,0,0,0.3)',
                    }}
                  >
                    {isLoading ? (
                      <svg className="crate-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    ) : isPlaying ? (
                      <svg width="13" height="15" viewBox="0 0 12 15" fill="currentColor">
                        <rect x="0" y="0" width="3.8" height="15" rx="1.5" />
                        <rect x="7.2" y="0" width="3.8" height="15" rx="1.5" />
                      </svg>
                    ) : (
                      <svg width="14" height="15" viewBox="0 0 14 15" fill="currentColor" style={{ marginLeft: 2 }}>
                        <path d="M1.5 1.3a1 1 0 0 0-1.5.86v11.68a1 1 0 0 0 1.5.87l10.9-5.84a1 1 0 0 0 0-1.74L1.5 1.3z"/>
                      </svg>
                    )}
                  </button>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    aria-label="Next track"
                    className="p-1 rounded-full transition-transform active:scale-90"
                    style={{ color: isDark ? '#F4F1EA' : '#161513' }}
                    title="Next"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 18 14.5 12 6 6v12zm8-12v12h2V6h-2z"/>
                    </svg>
                  </button>

                  {/* Repeat button */}
                  <button
                    onClick={() => setIsRepeat(r => !r)}
                    aria-label="Toggle repeat"
                    className="p-1 rounded-full transition-colors"
                    style={{
                      color: isRepeat
                        ? '#E07A3B'
                        : (isDark ? '#8E877C' : '#8C8273'),
                    }}
                    title="Repeat"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m17 2 4 4-4 4"/>
                      <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
                      <path d="m7 22-4-4 4-4"/>
                      <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ── BOTTOM FOOTER ROW ─────────────────────────────────────── */}
            <div
              className="flex items-center justify-between pt-3 border-t"
              style={{
                borderColor: isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(22,21,19,0.06)',
              }}
            >
              {/* Left: Speaker icon + "Living room" + Chevron */}
              <button
                onClick={() => setIsMuted(m => !m)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="flex items-center gap-2 group transition-opacity hover:opacity-80"
                style={{ color: isDark ? '#B8AFA4' : '#5C5549' }}
              >
                {/* Speaker icon */}
                {isMuted ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                )}

                <span className="text-[12px] font-medium tracking-tight">
                  {isMuted ? 'Muted' : 'Living room'}
                </span>

                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {/* Right: Pill Badge with Animated Bars + "Lossless" */}
              <div
                className="flex items-center gap-2 px-2.5 py-1 rounded-full"
                style={{
                  background: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(22,21,19,0.05)',
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(22,21,19,0.06)',
                }}
              >
                {/* 3 animated audio bars */}
                <div className="flex items-end gap-[1.5px] h-3.5">
                  <span
                    className={`w-[2px] rounded-full bg-[#E07A3B] ${isPlaying ? 'crate-bar-1' : 'h-[6px]'}`}
                  />
                  <span
                    className={`w-[2px] rounded-full bg-[#E07A3B] ${isPlaying ? 'crate-bar-2' : 'h-[10px]'}`}
                  />
                  <span
                    className={`w-[2px] rounded-full bg-[#E07A3B] ${isPlaying ? 'crate-bar-3' : 'h-[4px]'}`}
                  />
                </div>

                <span
                  className="text-[10px] font-semibold tracking-wider"
                  style={{ color: isDark ? '#A69E92' : '#736B5F' }}
                >
                  Lossless
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
