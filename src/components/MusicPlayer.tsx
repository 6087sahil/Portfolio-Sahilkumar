import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const CONFIG = {
  audioSrc:   '/assets/audio/song.mp3',
  coverSrc:   '/assets/images/miles-cover.jpg',
  trackName:  'Sunflower',
  artistName: 'Post Malone & Swae Lee',
};

const MusicPlayer: React.FC = () => {
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [isLoading,     setIsLoading]     = useState(false);
  const [missingAudio,  setMissingAudio]  = useState(false);
  const [showTooltip,   setShowTooltip]   = useState(true);
  const [tooltipText,   setTooltipText]   = useState('Tap & Enjoy Song');
  const [imgError,      setImgError]      = useState(false);
  const [mounted,       setMounted]       = useState(false);

  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mount entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Tooltip controller with auto-dismiss
  const triggerTooltip = useCallback((text: string, autoDismiss = false) => {
    setTooltipText(text);
    setShowTooltip(true);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    if (autoDismiss) {
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 2400);
    }
  }, []);

  // Auto-pause when user leaves tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Audio lifecycle event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setMissingAudio(false);
      triggerTooltip('Now Playing ♪', true);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsLoading(false);
      if (!missingAudio) triggerTooltip('Tap & Enjoy Song', false);
    };

    const onEnded = () => {
      setIsPlaying(false);
      triggerTooltip('Tap & Enjoy Song', false);
    };

    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setMissingAudio(true);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
      setMissingAudio(false);
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
  }, [missingAudio, triggerTooltip]);

  // Handle Play/Pause
  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      setMissingAudio(false);
      try {
        await audio.play();
      } catch (err: unknown) {
        setIsPlaying(false);
        setIsLoading(false);
        setMissingAudio(true);
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
      triggerTooltip('Restarting ↺', true);
    }
  };

  return (
    <>
      {/* ── Luxury Scoped CSS Animations ───────────────────────────────── */}
      <style>{`
        /* Smooth continuous vinyl rotation */
        @keyframes mp-vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Subtle organic floating bob for tooltip */
        @keyframes mp-subtle-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-3px); }
        }

        /* Sophisticated Equalizer Frequencies */
        @keyframes mp-eq-wave-1 {
          0%, 100% { height: 3px; }
          30%      { height: 13px; }
          60%      { height: 6px; }
          80%      { height: 11px; }
        }
        @keyframes mp-eq-wave-2 {
          0%, 100% { height: 10px; }
          25%      { height: 4px; }
          50%      { height: 14px; }
          75%      { height: 5px; }
        }
        @keyframes mp-eq-wave-3 {
          0%, 100% { height: 4px; }
          35%      { height: 14px; }
          70%      { height: 3px; }
          90%      { height: 9px; }
        }
        @keyframes mp-eq-wave-4 {
          0%, 100% { height: 12px; }
          40%      { height: 5px; }
          65%      { height: 13px; }
          85%      { height: 4px; }
        }

        /* Breathing amber glow behind player when active */
        @keyframes mp-amber-aura {
          0%, 100% {
            box-shadow: 
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.14),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.4),
              0 14px 34px -4px rgba(0, 0, 0, 0.7),
              0 0 20px rgba(217, 119, 54, 0.16);
          }
          50% {
            box-shadow: 
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.18),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.4),
              0 16px 40px -4px rgba(0, 0, 0, 0.75),
              0 0 28px rgba(217, 119, 54, 0.28);
          }
        }

        /* Tooltip downward pointer */
        .mp-tooltip-arrow::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px 4px 0 4px;
          border-style: solid;
          border-color: rgba(22, 14, 9, 0.94) transparent transparent transparent;
        }

        /* Warning arrow */
        .mp-warning-arrow::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px 4px 0 4px;
          border-style: solid;
          border-color: rgba(50, 16, 12, 0.95) transparent transparent transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .mp-reduced-static {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Native Audio Element (Hidden) ──────────────────────────────── */}
      <audio
        ref={audioRef}
        src={CONFIG.audioSrc}
        preload="metadata"
        loop
      />

      {/* ── Fixed Floating Container (Bottom-Right) ───────────────────── */}
      <div
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 sm:gap-2.5 select-none pointer-events-auto"
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: prefersReduced ? 'none' : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── Previous Track Button (Refined Floating Circle) ─────────── */}
        <button
          onClick={handlePreviousTrack}
          aria-label="Previous track / restart"
          title="Restart / Previous"
          className="group w-[38px] h-[38px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer focus:outline-none transition-all duration-300 active:scale-95"
          style={{
            background:           'linear-gradient(135deg, rgba(28, 18, 12, 0.8) 0%, rgba(18, 11, 7, 0.85) 100%)',
            border:               '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow:            'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 24px rgba(0, 0, 0, 0.45)',
            backdropFilter:       'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            color:                'rgba(250, 245, 237, 0.8)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217, 119, 54, 0.55)';
            e.currentTarget.style.boxShadow = 'inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 0 8px 28px rgba(0, 0, 0, 0.5), 0 0 12px rgba(217, 119, 54, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1.5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 24px rgba(0, 0, 0, 0.45)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Previous Track Icon */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* ── Main Music Player Capsule ───────────────────────────────── */}
        <div className="relative">
          {/* ── Floating Tooltip / Missing File Badge ─────────────────── */}
          {missingAudio ? (
            /* Elegant Missing-Audio Warning Label (Appears ONLY when file is missing) */
            <div
              className="mp-warning-arrow absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap z-20 flex items-center gap-1.5 transition-all duration-300"
              style={{
                background:           'rgba(48, 15, 11, 0.94)',
                border:               '1px solid rgba(239, 68, 68, 0.38)',
                boxShadow:            '0 6px 20px rgba(0, 0, 0, 0.5), 0 0 12px rgba(239, 68, 68, 0.2)',
                color:                '#FCA5A5',
                fontSize:             '10.5px',
                fontWeight:           500,
                letterSpacing:        '0.01em',
                backdropFilter:       'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>song.mp3 missing in /assets/audio/</span>
            </div>
          ) : (
            /* Subtle Floating Tooltip (Shown when idle or playing) */
            <div
              className={`mp-tooltip-arrow absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full pointer-events-none whitespace-nowrap z-20 transition-all duration-400 ${
                !prefersReduced && !isPlaying ? 'mp-reduced-static' : ''
              }`}
              style={{
                background:           'rgba(22, 14, 9, 0.94)',
                border:               '1px solid rgba(217, 119, 54, 0.3)',
                boxShadow:            'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 18px rgba(0, 0, 0, 0.45)',
                color:                '#FAF5ED',
                fontSize:             '10.5px',
                fontWeight:           600,
                letterSpacing:        '0.02em',
                backdropFilter:       'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                opacity:              showTooltip ? 1 : 0,
                transform:            showTooltip
                  ? 'translateX(-50%) translateY(0) scale(1)'
                  : 'translateX(-50%) translateY(4px) scale(0.92)',
                animation:            !prefersReduced && !isPlaying && showTooltip ? 'mp-subtle-float 2.5s ease-in-out infinite' : 'none',
              }}
            >
              {tooltipText}
            </div>
          )}

          {/* ── Refined Dark Chocolate Glassmorphic Player Card ───────── */}
          <div
            className="flex items-center gap-3 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full cursor-default transition-all duration-400"
            style={{
              background:           'linear-gradient(135deg, rgba(30, 19, 13, 0.82) 0%, rgba(18, 11, 7, 0.88) 100%)',
              border:               isPlaying ? '1px solid rgba(217, 119, 54, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter:       'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow:            isPlaying
                ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 0 rgba(0, 0, 0, 0.4), 0 14px 34px -4px rgba(0, 0, 0, 0.7), 0 0 20px rgba(217, 119, 54, 0.2)'
                : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 0 rgba(0, 0, 0, 0.4), 0 12px 30px -4px rgba(0, 0, 0, 0.65)',
              minWidth:             '230px',
              maxWidth:             '310px',
              animation:            isPlaying && !prefersReduced ? 'mp-amber-aura 3.2s ease-in-out infinite' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1.5px)';
              e.currentTarget.style.borderColor = isPlaying ? 'rgba(217, 119, 54, 0.55)' : 'rgba(255, 255, 255, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = isPlaying ? 'rgba(217, 119, 54, 0.45)' : 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {/* ── Precision Album Artwork with Metallic Rim ───────────── */}
            <div className="relative w-11 h-11 sm:w-11 sm:h-11 flex-shrink-0 group/cover">
              {/* Outer Fine Accent Ring */}
              <div
                className="absolute -inset-[3px] rounded-full pointer-events-none transition-all duration-500"
                style={{
                  border:    `1px solid ${isPlaying ? 'rgba(217, 119, 54, 0.7)' : 'rgba(217, 119, 54, 0.35)'}`,
                  boxShadow: isPlaying ? '0 0 8px rgba(217, 119, 54, 0.35)' : 'none',
                }}
              />

              {/* Rotating Cover Disc */}
              <div
                className="w-full h-full rounded-full overflow-hidden relative shadow-inner transition-transform duration-300"
                style={{
                  animation:          !prefersReduced ? 'mp-vinyl-spin 9s linear infinite' : 'none',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                  background:         '#160E09',
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
                  /* Fallback Vinyl Pattern */
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, #2E180E 25%, #140C07 80%)',
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-black/80 border border-white/20" />
                  </div>
                )}

                {/* Subtle Radial Gloss Highlight */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)',
                  }}
                />
              </div>

              {/* Central Metallic Spindle Dot */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, #E07A3B 30%, #1A110C 90%)',
                  boxShadow:  '0 0 3px rgba(0, 0, 0, 0.8), inset 0 0 1px rgba(255, 255, 255, 0.4)',
                }}
              />
            </div>

            {/* ── Track Info & Studio Equalizer ───────────────────────── */}
            <div className="flex-1 min-w-0 pr-1">
              <div
                className="text-[12.5px] font-semibold tracking-tight truncate leading-tight text-[#FAF5ED]"
                style={{
                  fontFamily: 'inherit',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                }}
              >
                {CONFIG.trackName}
              </div>
              <div
                className="text-[10.5px] font-medium truncate mt-0.5 tracking-wide text-stone-400"
                style={{
                  color:      'rgba(250, 245, 237, 0.55)',
                  fontFamily: 'inherit',
                }}
              >
                {CONFIG.artistName}
              </div>

              {/* Sophisticated Equalizer Bars */}
              <div className="flex items-center gap-[3px] mt-1.5 h-3">
                {[
                  { anim: 'mp-eq-wave-1', dur: '0.85s', delay: '0s' },
                  { anim: 'mp-eq-wave-2', dur: '0.7s',  delay: '0.2s' },
                  { anim: 'mp-eq-wave-3', dur: '0.95s', delay: '0.4s' },
                  { anim: 'mp-eq-wave-4', dur: '0.75s', delay: '0.1s' },
                ].map((bar, i) => (
                  <span
                    key={i}
                    className="w-[2.5px] rounded-full transition-all duration-300"
                    style={{
                      background:         isPlaying ? '#E07A3B' : 'rgba(224, 122, 59, 0.5)',
                      height:             isPlaying ? '11px' : '3px',
                      boxShadow:          isPlaying ? '0 0 6px rgba(224, 122, 59, 0.45)' : 'none',
                      animation:          isPlaying && !prefersReduced
                        ? `${bar.anim} ${bar.dur} ease-in-out infinite`
                        : 'none',
                      animationDelay:     bar.delay,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Redesigned Premium Play/Pause Button ─────────────────── */}
            <button
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              aria-pressed={isPlaying}
              className="group/btn relative w-[38px] h-[38px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer focus:outline-none transition-all duration-300 active:scale-95"
              style={{
                border:               isPlaying ? '1.5px solid #E07A3B' : '1.5px solid rgba(224, 122, 59, 0.65)',
                background:           isPlaying
                  ? 'radial-gradient(circle, rgba(224, 122, 59, 0.28) 0%, rgba(224, 122, 59, 0.08) 100%)'
                  : 'radial-gradient(circle, rgba(224, 122, 59, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
                color:                '#E07A3B',
                boxShadow:            isPlaying
                  ? '0 0 16px rgba(224, 122, 59, 0.4), inset 0 0 8px rgba(224, 122, 59, 0.2)'
                  : '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E07A3B';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(224, 122, 59, 0.5), inset 0 0 10px rgba(224, 122, 59, 0.25)';
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isPlaying ? '#E07A3B' : 'rgba(224, 122, 59, 0.65)';
                e.currentTarget.style.boxShadow = isPlaying
                  ? '0 0 16px rgba(224, 122, 59, 0.4), inset 0 0 8px rgba(224, 122, 59, 0.2)'
                  : '0 2px 8px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isLoading ? (
                /* Sleek Loading Spinner */
                <svg className="animate-spin w-3.5 h-3.5 text-[#E07A3B]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : isPlaying ? (
                /* Precision Pause Icon */
                <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor">
                  <rect x="0" y="0" width="3.5" height="13" rx="1.5" />
                  <rect x="7.5" y="0" width="3.5" height="13" rx="1.5" />
                </svg>
              ) : (
                /* Precision Play Icon */
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="currentColor"
                  style={{ marginLeft: '2px' }}
                >
                  <path d="M1.5 1.2a1 1 0 00-1.5.87v9.86a1 1 0 001.5.87l8.6-4.93a1 1 0 000-1.74l-8.6-4.93z" />
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
