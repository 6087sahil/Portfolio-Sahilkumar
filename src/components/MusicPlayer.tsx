import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const CONFIG = {
  audioSrc:   '/assets/audio/song.mp3',
  coverSrc:   '/assets/images/miles-cover.jpg',
  trackName:  'Sunflower',
  artistName: 'Post Malone & Swae Lee',
};

const MusicPlayer: React.FC = () => {
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [hasError,    setHasError]    = useState(false);
  const [tooltipMsg,  setTooltipMsg]  = useState('Tap & Enjoy Song');
  const [showTooltip, setShowTooltip] = useState(true);
  const [imgError,    setImgError]    = useState(false);
  const [mounted,     setMounted]     = useState(false);

  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mount entrance transition
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Update tooltip helper with auto-hide option
  const triggerTooltip = useCallback((msg: string, autoHide = false) => {
    setTooltipMsg(msg);
    setShowTooltip(true);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    if (autoHide) {
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 2600);
    }
  }, []);

  // Pause audio automatically when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Audio Event Listeners for real playback sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setHasError(false);
      triggerTooltip('Now Playing ♪', true);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsLoading(false);
      if (!hasError) triggerTooltip('Tap & Enjoy Song', false);
    };

    const onEnded = () => {
      setIsPlaying(false);
      triggerTooltip('Tap & Enjoy Song', false);
    };

    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setHasError(true);
      triggerTooltip('Audio not found at /assets/audio/song.mp3', false);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [hasError, triggerTooltip]);

  // Handle Play / Pause Toggle
  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      setHasError(false);
      try {
        await audio.play();
      } catch (err: unknown) {
        setIsPlaying(false);
        setIsLoading(false);
        setHasError(true);
        triggerTooltip('Add song.mp3 to /assets/audio/', false);
      }
    }
  };

  // Handle Previous Track / Restart
  const handlePreviousTrack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    if (!isPlaying) {
      handleTogglePlay();
    } else {
      triggerTooltip('Restarting Track ↺', true);
    }
  };

  return (
    <>
      {/* ── Scoped Keyframes & Animations ──────────────────────────────── */}
      <style>{`
        /* Smooth continuous album spin */
        @keyframes mp-album-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Tooltip subtle floating bob */
        @keyframes mp-float-bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-3px); }
        }

        /* Equalizer bar heights */
        @keyframes mp-eq-bar-1 { 0%, 100% { height: 4px; } 50% { height: 14px; } }
        @keyframes mp-eq-bar-2 { 0%, 100% { height: 11px; } 40% { height: 3px; } 80% { height: 15px; } }
        @keyframes mp-eq-bar-3 { 0%, 100% { height: 5px; } 30% { height: 14px; } 70% { height: 4px; } }
        @keyframes mp-eq-bar-4 { 0%, 100% { height: 13px; } 60% { height: 4px; } }

        /* Subtle warm breathing glow when playing */
        @keyframes mp-pulse-glow {
          0%, 100% { box-shadow: 0 10px 30px rgba(0,0,0,0.55), 0 0 18px rgba(217, 119, 54, 0.18); }
          50%      { box-shadow: 0 10px 35px rgba(0,0,0,0.65), 0 0 28px rgba(217, 119, 54, 0.35); }
        }

        /* Tooltip arrow down */
        .mp-tooltip-tail::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px 5px 0 5px;
          border-style: solid;
          border-color: rgba(28, 18, 12, 0.94) transparent transparent transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .mp-animated-spin,
          .mp-animated-float,
          .mp-animated-glow,
          .mp-eq-anim {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Native Audio Element ───────────────────────────────────────── */}
      <audio
        ref={audioRef}
        src={CONFIG.audioSrc}
        preload="metadata"
        loop
      />

      {/* ── Fixed Floating Container (Bottom-Right) ───────────────────── */}
      <div
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 select-none transition-all duration-700 pointer-events-auto"
        style={{
          opacity:   mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* ── Previous Track Button (Outside Player) ──────────────────── */}
        <button
          onClick={handlePreviousTrack}
          aria-label="Previous track / restart"
          title="Restart / Previous track"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D97736]"
          style={{
            background:           'rgba(26, 17, 12, 0.75)',
            border:               '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter:       'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color:                '#FDF8F0',
            boxShadow:            '0 4px 16px rgba(0, 0, 0, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217, 119, 54, 0.6)';
            e.currentTarget.style.background = 'rgba(38, 24, 16, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.background = 'rgba(26, 17, 12, 0.75)';
          }}
        >
          {/* Previous Track Icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* ── Player Pill Container ───────────────────────────────────── */}
        <div className="relative">
          {/* ── Floating Tooltip Bubble Above Player ──────────────────── */}
          <div
            className={`mp-tooltip-tail absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full pointer-events-none transition-all duration-400 whitespace-nowrap z-20 ${
              !prefersReduced && !isPlaying ? 'mp-animated-float' : ''
            }`}
            style={{
              background:           hasError ? 'rgba(70, 20, 15, 0.94)' : 'rgba(28, 18, 12, 0.94)',
              border:               `1px solid ${hasError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(217, 119, 54, 0.35)'}`,
              color:                hasError ? '#FCA5A5' : '#FDF8F0',
              fontSize:             '11px',
              fontWeight:           600,
              letterSpacing:        '0.02em',
              backdropFilter:       'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow:            '0 6px 20px rgba(0, 0, 0, 0.45)',
              opacity:              showTooltip ? 1 : 0,
              transform:            showTooltip
                ? 'translateX(-50%) translateY(0) scale(1)'
                : 'translateX(-50%) translateY(6px) scale(0.9)',
              animation:            !prefersReduced && !isPlaying ? 'mp-float-bob 2.4s ease-in-out infinite' : 'none',
            }}
          >
            {tooltipMsg}
          </div>

          {/* ── Main Glassmorphism Player Card ────────────────────────── */}
          <div
            className={`flex items-center gap-3 sm:gap-3.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full transition-all duration-500 hover:-translate-y-0.5 ${
              isPlaying && !prefersReduced ? 'mp-animated-glow' : ''
            }`}
            style={{
              background:           'rgba(26, 17, 12, 0.78)',
              border:               `1px solid ${isPlaying ? 'rgba(217, 119, 54, 0.45)' : 'rgba(255, 255, 255, 0.12)'}`,
              backdropFilter:       'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              boxShadow:            isPlaying
                ? '0 10px 30px rgba(0,0,0,0.6), 0 0 24px rgba(217, 119, 54, 0.22)'
                : '0 10px 30px rgba(0,0,0,0.5)',
              minWidth:             '230px',
              maxWidth:             '320px',
              animation:            isPlaying && !prefersReduced ? 'mp-pulse-glow 3s ease-in-out infinite' : 'none',
            }}
          >
            {/* ── Circular Album Cover with Subtle Orange Ring ───────── */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0">
              {/* Outer Subtle Orange Ring */}
              <div
                className="absolute -inset-1 rounded-full pointer-events-none transition-all duration-500"
                style={{
                  border:          `1.5px solid ${isPlaying ? 'rgba(217, 119, 54, 0.75)' : 'rgba(217, 119, 54, 0.35)'}`,
                  boxShadow:       isPlaying ? '0 0 10px rgba(217, 119, 54, 0.35)' : 'none',
                }}
              />

              {/* Rotating Album Cover Disc */}
              <div
                className="w-full h-full rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{
                  animation:          !prefersReduced ? 'mp-album-spin 8s linear infinite' : 'none',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                  background:         '#1A110C',
                }}
              >
                {!imgError ? (
                  <img
                    src={CONFIG.coverSrc}
                    alt={CONFIG.trackName}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  /* Fallback Vinyl Groove Pattern */
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, #2b180d 20%, #150c06 80%)',
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/20" />
                  </div>
                )}
              </div>

              {/* Center Spindle Dot */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#111] border border-white/30 pointer-events-none"
              />
            </div>

            {/* ── Song Title, Artist & Equalizer Bars ─────────────────── */}
            <div className="flex-1 min-w-0 pr-1">
              <div
                className="text-xs sm:text-[13px] font-bold tracking-tight truncate leading-tight"
                style={{ color: '#FDF8F0', fontFamily: 'inherit' }}
              >
                {CONFIG.trackName}
              </div>
              <div
                className="text-[10px] sm:text-[11px] font-medium truncate mt-0.5"
                style={{ color: 'rgba(253, 248, 240, 0.55)', fontFamily: 'inherit' }}
              >
                {CONFIG.artistName}
              </div>

              {/* Animated Equalizer Bars */}
              <div className="flex items-center gap-1 mt-1.5 h-3.5">
                {[
                  { anim: 'mp-eq-bar-1', speed: '0.8s', delay: '0s' },
                  { anim: 'mp-eq-bar-2', speed: '1.0s', delay: '0.2s' },
                  { anim: 'mp-eq-bar-3', speed: '0.7s', delay: '0.4s' },
                  { anim: 'mp-eq-bar-4', speed: '1.1s', delay: '0.1s' },
                ].map((bar, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full transition-all duration-300"
                    style={{
                      background:         '#D97736',
                      height:             isPlaying ? '12px' : '3px',
                      borderRadius:       isPlaying ? '2px' : '50%',
                      animation:          isPlaying && !prefersReduced
                        ? `${bar.anim} ${bar.speed} ease-in-out infinite`
                        : 'none',
                      animationDelay:     bar.delay,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Play / Pause Button with Subtle Orange Border ──────── */}
            <button
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              aria-pressed={isPlaying}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-108 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D97736]"
              style={{
                border:               '1.5px solid rgba(217, 119, 54, 0.75)',
                background:           isPlaying ? 'rgba(217, 119, 54, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                color:                '#D97736',
                boxShadow:            isPlaying ? '0 0 14px rgba(217, 119, 54, 0.4)' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D97736';
                e.currentTarget.style.background = 'rgba(217, 119, 54, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(217, 119, 54, 0.75)';
                e.currentTarget.style.background = isPlaying
                  ? 'rgba(217, 119, 54, 0.22)'
                  : 'rgba(255, 255, 255, 0.05)';
              }}
            >
              {isLoading ? (
                /* Loading Spinner */
                <svg className="animate-spin w-4 h-4 text-[#D97736]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : isPlaying ? (
                /* Pause Icon */
                <svg width="12" height="13" viewBox="0 0 12 14" fill="currentColor">
                  <rect x="0" y="0" width="4" height="14" rx="1.5" />
                  <rect x="8" y="0" width="4" height="14" rx="1.5" />
                </svg>
              ) : (
                /* Play Icon */
                <svg width="13" height="13" viewBox="0 0 13 14" fill="currentColor" style={{ marginLeft: '2px' }}>
                  <path d="M1 1.5l11 5.5-11 5.5V1.5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
