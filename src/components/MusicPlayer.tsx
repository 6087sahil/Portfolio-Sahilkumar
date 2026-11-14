import React, { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PLAYLIST — Edit tracks here. Use `src: ''` for a silent fallback.
// ─────────────────────────────────────────────────────────────────────────────
interface Track {
  title:    string;
  artist:   string;
  art:      string;   // path relative to /public
  src:      string;   // path relative to /public
}

const TRACKS: Track[] = [
  {
    title:  'Sunflower',
    artist: 'Post Malone & Swae Lee',
    art:    '/assets/images/miles-cover.jpg',
    src:    '/assets/audio/song.mp3',
  },
  // Add more tracks below ↓
  // {
  //   title:  'Another Song',
  //   artist: 'Another Artist',
  //   art:    '/assets/images/another-cover.jpg',
  //   src:    '/assets/audio/another.mp3',
  // },
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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const MusicPlayer: React.FC = () => {
  /* ── Core state ─────────────────────────────────────────────────────── */
  const [trackIdx,    setTrackIdx]    = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [isMuted,     setIsMuted]     = useState(false);
  const [isSeeking,   setIsSeeking]   = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [artError,    setArtError]    = useState<Record<number, boolean>>({});

  /* ── Refs ───────────────────────────────────────────────────────────── */
  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const progressRef   = useRef<HTMLDivElement | null>(null);
  const diskRef       = useRef<HTMLDivElement | null>(null);
  const diskAngle     = useRef<number>(0);        // accumulated rotation in degrees
  const rafRef        = useRef<number | undefined>(undefined);  // requestAnimationFrame id
  const lastTs        = useRef<number | undefined>(undefined);  // timestamp for RAF delta
  const playerRef     = useRef<HTMLDivElement | null>(null);

  const track    = TRACKS[trackIdx];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ── prefers-reduced-motion ─────────────────────────────────────────── */
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Entrance mount ─────────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 250);
    return () => clearTimeout(t);
  }, []);

  /* ── Keyboard shortcut: Space = play/pause ──────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.closest('[data-mp-player]')
      ) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying]);                   // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Auto-pause on tab hide ─────────────────────────────────────────── */
  useEffect(() => {
    const fn = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    document.addEventListener('visibilitychange', fn);
    return () => document.removeEventListener('visibilitychange', fn);
  }, []);

  /* ── Sync volume to audio element ───────────────────────────────────── */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.8;
    }
  }, [isMuted]);

  /* ── Vinyl disc rotation via RAF (smooth, GPU-friendly) ─────────────── */
  useEffect(() => {
    if (reduced) return;

    const spin = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;

      if (diskRef.current) {
        // 360° per 8 s = 45°/s = 0.045°/ms
        diskAngle.current = (diskAngle.current + delta * 0.045) % 360;
        diskRef.current.style.transform = `rotate(${diskAngle.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(spin);
    };

    if (isPlaying) {
      lastTs.current = undefined as unknown as number;
      rafRef.current = requestAnimationFrame(spin);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTs.current = undefined as unknown as number;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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

    audio.addEventListener('play',       onPlay);
    audio.addEventListener('pause',      onPause);
    audio.addEventListener('waiting',    onWaiting);
    audio.addEventListener('canplay',    onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended',      onEnded);

    return () => {
      audio.removeEventListener('play',       onPlay);
      audio.removeEventListener('pause',      onPause);
      audio.removeEventListener('waiting',    onWaiting);
      audio.removeEventListener('canplay',    onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended',      onEnded);
    };
  }, [isSeeking, trackIdx]);         // eslint-disable-line react-hooks/exhaustive-deps

  /* ── When track changes: reset + optionally continue playing ─────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setArtError({});          // reset per-track art errors
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [trackIdx]);              // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Helpers ────────────────────────────────────────────────────────── */
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      try { await audio.play(); } catch { setIsPlaying(false); setIsLoading(false); }
    }
  };

  const handlePrev = () => {
    if (currentTime > 3 && audioRef.current) {
      // restart current track if >3 s in, else go to prev
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length);
    }
  };

  const handleNext = () => {
    setTrackIdx(i => (i + 1) % TRACKS.length);
  };

  /* ── Progress bar seek (click + drag) ──────────────────────────────── */
  const getSeekFraction = (e: MouseEvent | React.MouseEvent) => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const { left, width } = bar.getBoundingClientRect();
    return clamp((e.clientX - left) / width, 0, 1);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSeeking(true);
    const frac = getSeekFraction(e);
    setCurrentTime(frac * duration);

    const onMove = (ev: MouseEvent) => {
      const f = getSeekFraction(ev);
      setCurrentTime(f * duration);
    };
    const onUp = (ev: MouseEvent) => {
      const f = getSeekFraction(ev);
      if (audioRef.current && duration) {
        audioRef.current.currentTime = f * duration;
      }
      setCurrentTime(f * duration);
      setIsSeeking(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  const hasArt = !artError[trackIdx];

  return (
    <>
      {/* ── Scoped CSS keyframes & helpers ───────────────────────────── */}
      <style>{`
        /* Only active when prefers-reduced-motion is NOT set */
        @keyframes mp-glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.04); }
        }
        @keyframes mp-eq1 { 0%,100%{scaleY:.25} 40%{scaleY:1} 70%{scaleY:.6} }
        @keyframes mp-eq2 { 0%,100%{scaleY:.8}  30%{scaleY:.2} 65%{scaleY:1} }
        @keyframes mp-eq3 { 0%,100%{scaleY:.4}  50%{scaleY:1} 80%{scaleY:.3} }
        @keyframes mp-eq4 { 0%,100%{scaleY:1}   45%{scaleY:.3} 75%{scaleY:.7} }

        .mp-eq-bar { transform-origin: bottom center; }
        .mp-eq-playing .mp-eq-bar-1 { animation: mp-eq1 0.85s ease-in-out infinite; }
        .mp-eq-playing .mp-eq-bar-2 { animation: mp-eq2 0.70s ease-in-out infinite; animation-delay:.15s; }
        .mp-eq-playing .mp-eq-bar-3 { animation: mp-eq3 0.95s ease-in-out infinite; animation-delay:.08s; }
        .mp-eq-playing .mp-eq-bar-4 { animation: mp-eq4 0.75s ease-in-out infinite; animation-delay:.22s; }

        /* Focus ring on interactive elements */
        .mp-btn:focus-visible { outline: 2px solid #E07A3B; outline-offset: 3px; }

        /* Seek thumb appears on progress hover */
        .mp-progress:hover .mp-thumb { opacity: 1 !important; }
        .mp-progress { cursor: pointer; }

        /* Loading spinner */
        @keyframes mp-spin { to { transform: rotate(360deg); } }
        .mp-spinner { animation: mp-spin .9s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .mp-eq-bar, .mp-glow, .mp-spinner {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Hidden native audio element ───────────────────────────────── */}
      <audio
        ref={audioRef}
        src={track.src || undefined}
        preload="metadata"
        loop={TRACKS.length === 1}
      />

      {/* ══ PLAYER ROOT ════════════════════════════════════════════════ */}
      <div
        ref={playerRef}
        data-mp-player
        role="region"
        aria-label="Music player"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 select-none pointer-events-auto"
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: reduced ? 'none' : 'opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {/* ── Ambient glow — behind the player, pulses while playing ─── */}
        {!reduced && (
          <div
            className="mp-glow pointer-events-none absolute -inset-6 rounded-full"
            style={{
              background:   'radial-gradient(ellipse at center, rgba(217,119,54,.35) 0%, transparent 70%)',
              animation:    isPlaying ? 'mp-glow-pulse 3s ease-in-out infinite' : 'none',
              opacity:      isPlaying ? 0.4 : 0,
              transition:   'opacity .6s ease',
              zIndex:       -1,
            }}
          />
        )}

        {/* ══ PILL CONTAINER ════════════════════════════════════════════ */}
        <div
          className="relative flex items-center gap-3 px-3 py-2.5 sm:px-4"
          style={{
            /* Luxury glassmorphism */
            borderRadius:         '999px',
            background:           'linear-gradient(140deg, rgba(32,20,13,.86) 0%, rgba(16,10,7,.92) 100%)',
            backdropFilter:       'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            border:               isPlaying ? '1px solid rgba(217,119,54,.4)' : '1px solid rgba(255,255,255,.09)',
            boxShadow: isPlaying
              ? 'inset 0 1px 1px rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.45), 0 18px 40px -6px rgba(0,0,0,.7), 0 0 24px rgba(217,119,54,.22)'
              : 'inset 0 1px 1px rgba(255,255,255,.12), inset 0 -1px 0 rgba(0,0,0,.45), 0 14px 32px -6px rgba(0,0,0,.65)',
            transition:   'border-color .4s ease, box-shadow .4s ease',
            minWidth:     '270px',
            maxWidth:     '340px',
          }}
          /* Hover lift */
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
        >

          {/* ── Vinyl disc album art ─────────────────────────────────── */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 48, height: 48 }}
          >
            {/* Rotating outer glow/accent ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset:       '-3px',
                border:      `1.5px solid ${isPlaying ? 'rgba(224,122,59,.8)' : 'rgba(224,122,59,.3)'}`,
                boxShadow:   isPlaying ? '0 0 10px rgba(224,122,59,.4)' : 'none',
                transition:  'border-color .4s, box-shadow .4s',
              }}
            />

            {/* Disc — rotated by RAF, not CSS animation (smoother pause) */}
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
                /* Fallback vinyl grooves */
                <div
                  className="w-full h-full"
                  style={{
                    background: `
                      radial-gradient(circle, #2E190E 0%, #110B07 100%),
                      repeating-radial-gradient(circle at 50%, #190F08 0, #190F08 1px, transparent 1px, transparent 4px)
                    `,
                  }}
                />
              )}

              {/* Glossy sheen overlay */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 32% 24%, rgba(255,255,255,.26) 0%, transparent 55%)' }}
              />
            </div>

            {/* Centre spindle */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 8, height: 8,
                background: 'radial-gradient(circle, #E07A3B 20%, #1A110C 80%)',
                boxShadow:  '0 0 4px rgba(0,0,0,.8), inset 0 0 1px rgba(255,255,255,.4)',
              }}
            />
          </div>

          {/* ── Track info + progress ────────────────────────────────── */}
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            {/* Title row with equalizer */}
            <div className="flex items-center gap-1.5 min-w-0">
              {/* 4-bar EQ (visible + animating only while playing) */}
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

              {/* Song title — truncated */}
              <span
                className="text-[12.5px] font-semibold leading-tight truncate"
                style={{ color: '#FDF8F0', fontFamily: 'inherit', textShadow: '0 1px 2px rgba(0,0,0,.4)' }}
              >
                {track.title}
              </span>
            </div>

            {/* Artist — truncated */}
            <span
              className="text-[10px] font-medium leading-none truncate"
              style={{ color: 'rgba(253,248,240,.52)', fontFamily: 'inherit' }}
            >
              {track.artist}
            </span>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mt-0.5">
              {/* Current time */}
              <span className="text-[9px] font-mono tabular-nums" style={{ color: 'rgba(253,248,240,.4)', minWidth: 24 }}>
                {fmt(currentTime)}
              </span>

              {/* Seek track */}
              <div
                ref={progressRef}
                className="mp-progress relative flex-1 flex items-center"
                style={{ height: 16 }}
                onMouseDown={handleProgressMouseDown}
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
                {/* Track background */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 2.5, background: 'rgba(255,255,255,.12)' }}
                >
                  {/* Filled gradient bar */}
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:      `${progress}%`,
                      background: 'linear-gradient(90deg, #C06028 0%, #E07A3B 60%, #F09050 100%)',
                      boxShadow:  '0 0 6px rgba(224,122,59,.55)',
                      transition: isSeeking ? 'none' : 'width .15s linear',
                    }}
                  />
                </div>

                {/* Scrubber thumb — visible on hover via CSS */}
                <div
                  className="mp-thumb absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width:    10,
                    height:   10,
                    left:     `calc(${progress}% - 5px)`,
                    background: '#FAF5ED',
                    boxShadow: '0 0 6px rgba(0,0,0,.8), 0 0 4px #E07A3B',
                    opacity:  0,
                    transition: 'opacity .15s ease',
                  }}
                />
              </div>

              {/* Duration */}
              <span className="text-[9px] font-mono tabular-nums" style={{ color: 'rgba(253,248,240,.4)', minWidth: 24, textAlign: 'right' }}>
                {fmt(duration)}
              </span>
            </div>
          </div>

          {/* ── Controls: Prev · Play/Pause · Next · Volume ──────────── */}
          <div className="flex items-center gap-1.5 flex-shrink-0">

            {/* Previous track */}
            <button
              className="mp-btn flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ width: 28, height: 28, color: 'rgba(253,248,240,.65)', background: 'transparent' }}
              onClick={handlePrev}
              aria-label="Previous track"
              title="Previous"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>

            {/* Play / Pause — large gradient button */}
            <button
              className="mp-btn relative flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
              style={{
                width:    40,
                height:   40,
                color:    '#FDF8F0',
                background: isPlaying
                  ? 'linear-gradient(145deg, #C06028 0%, #E07A3B 50%, #F09050 100%)'
                  : 'linear-gradient(145deg, #A85020 0%, #C86830 60%, #E07A3B 100%)',
                boxShadow: isPlaying
                  ? '0 0 20px rgba(224,122,59,.55), 0 4px 10px rgba(0,0,0,.4), inset 0 1px 1px rgba(255,255,255,.25)'
                  : '0 4px 12px rgba(0,0,0,.45), inset 0 1px 1px rgba(255,255,255,.2)',
                transition: 'background .3s ease, box-shadow .3s ease',
              }}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              aria-pressed={isPlaying}
            >
              {isLoading ? (
                /* Spinner */
                <svg
                  className="mp-spinner"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                >
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                  <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : isPlaying ? (
                /* Pause bars */
                <svg width="13" height="15" viewBox="0 0 12 15" fill="currentColor">
                  <rect x="0" y="0" width="4" height="15" rx="1.5" />
                  <rect x="8" y="0" width="4" height="15" rx="1.5" />
                </svg>
              ) : (
                /* Play triangle */
                <svg width="14" height="15" viewBox="0 0 14 15" fill="currentColor" style={{ marginLeft: 2 }}>
                  <path d="M1.5 1.3a1 1 0 0 0-1.5.86v11.68a1 1 0 0 0 1.5.87l10.9-5.84a1 1 0 0 0 0-1.74L1.5 1.3z" />
                </svg>
              )}
            </button>

            {/* Next track */}
            <button
              className="mp-btn flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ width: 28, height: 28, color: 'rgba(253,248,240,.65)', background: 'transparent' }}
              onClick={handleNext}
              aria-label="Next track"
              title="Next"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18 14.5 12 6 6v12zm8-12v12h2V6h-2z" />
              </svg>
            </button>

            {/* Volume toggle */}
            <button
              className="mp-btn flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ width: 28, height: 28, color: isMuted ? 'rgba(253,248,240,.3)' : 'rgba(253,248,240,.65)' }}
              onClick={() => setIsMuted(m => !m)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>

        </div>{/* end pill */}
      </div>
    </>
  );
};

export default MusicPlayer;
