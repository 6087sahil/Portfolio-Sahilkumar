import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronRight, ChevronLeft } from 'lucide-react';

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const CONFIG = {
  audioSrc:   '/assets/audio/song.mp3',
  coverSrc:   '/assets/images/miles-cover.jpg',
  trackName:  'Sunflower',
  artistName: 'Post Malone & Swae Lee',
};

// Format seconds into m:ss
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicPlayer: React.FC = () => {
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [isAvailable,  setIsAvailable]  = useState(true);
  const [isCollapsed,  setIsCollapsed]  = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(0.85);
  const [isMuted,      setIsMuted]      = useState(false);
  const [showVolume,   setShowVolume]   = useState(false);
  const [imgError,     setImgError]     = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);

  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Check prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mount entrance
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Pause when tab is hidden to save CPU/battery
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Audio lifecycle listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setIsAvailable(true);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsAvailable(true);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setIsAvailable(false);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
      setIsAvailable(true);
      if (audio.duration) setDuration(audio.duration);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  // Handle Play/Pause
  const handleTogglePlay = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !isAvailable) return;

    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        setIsLoading(false);
        setIsAvailable(false);
      }
    }
  };

  // Handle Seek through Progress Bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percent * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle Mute
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* ── Luxury Scoped CSS ──────────────────────────────────────────── */}
      <style>{`
        @keyframes luxury-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes luxury-pulse {
          0%, 100% {
            box-shadow: 
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.14),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.4),
              0 14px 34px -4px rgba(0, 0, 0, 0.65),
              0 0 20px rgba(217, 119, 54, 0.18);
          }
          50% {
            box-shadow: 
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.18),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.4),
              0 18px 40px -4px rgba(0, 0, 0, 0.75),
              0 0 28px rgba(217, 119, 54, 0.3);
          }
        }

        .luxury-glass {
          background: linear-gradient(135deg, rgba(24, 16, 12, 0.8) 0%, rgba(14, 9, 7, 0.88) 100%);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 0 rgba(0, 0, 0, 0.4),
            0 16px 36px -6px rgba(0, 0, 0, 0.65),
            0 4px 16px rgba(0, 0, 0, 0.35);
        }

        .luxury-glass:hover {
          border-color: rgba(217, 119, 54, 0.35);
        }
      `}</style>

      {/* ── Native Audio Element ───────────────────────────────────────── */}
      <audio
        ref={audioRef}
        src={CONFIG.audioSrc}
        preload="metadata"
        loop
      />

      {/* ── Fixed Bottom-Right Container ───────────────────────────────── */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none pointer-events-auto"
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: prefersReduced ? 'none' : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowVolume(false);
        }}
      >
        {/* ── Collapsed Mini Mode ─────────────────────────────────────── */}
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand music player"
            className="group relative flex items-center gap-2 p-1.5 rounded-full luxury-glass transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
            style={{
              borderColor: isPlaying ? 'rgba(217, 119, 54, 0.5)' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Spinning Mini Disc */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <div
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                  animation:          !prefersReduced ? 'luxury-spin 8s linear infinite' : 'none',
                  animationPlayState: isPlaying ? 'running' : 'paused',
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
                  <div className="w-full h-full bg-[#1A110C] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#D97736]" />
                  </div>
                )}
              </div>

              {/* Center Spindle Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black border border-white/30" />
            </div>

            {/* Expand Chevron Icon */}
            <div className="pr-2 text-stone-300 group-hover:text-[#D97736] transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>
        ) : (
          /* ── Full Expanded Luxury Glass Pill ───────────────────────── */
          <div
            className="relative flex flex-col luxury-glass rounded-[24px] sm:rounded-full transition-all duration-300"
            style={{
              minWidth:  '260px',
              maxWidth:  '320px',
              animation: isPlaying && !prefersReduced ? 'luxury-pulse 3.5s ease-in-out infinite' : 'none',
            }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2">
              {/* ── Circular Album Artwork ─────────────────────────────── */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                {/* Thin Ambient Accent Ring */}
                <div
                  className="absolute -inset-[2px] rounded-full pointer-events-none transition-all duration-500"
                  style={{
                    border:    `1px solid ${isPlaying ? 'rgba(217, 119, 54, 0.65)' : 'rgba(217, 119, 54, 0.25)'}`,
                    boxShadow: isPlaying ? '0 0 10px rgba(217, 119, 54, 0.3)' : 'none',
                  }}
                />

                {/* Rotating Artwork */}
                <div
                  className="w-full h-full rounded-full overflow-hidden relative shadow-inner"
                  style={{
                    animation:          !prefersReduced ? 'luxury-spin 9s linear infinite' : 'none',
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
                    <div className="w-full h-full bg-[#1A110C] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D97736]" />
                    </div>
                  )}

                  {/* Top-Left Specular Sheen */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.24) 0%, transparent 60%)',
                    }}
                  />
                </div>

                {/* Metallic Spindle Dot */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, #E07A3B 30%, #1A110C 90%)',
                    boxShadow:  '0 0 3px rgba(0, 0, 0, 0.8), inset 0 0 1px rgba(255, 255, 255, 0.4)',
                  }}
                />
              </div>

              {/* ── Track Info & Progress ─────────────────────────────── */}
              <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-[12px] sm:text-[12.5px] font-semibold tracking-tight truncate leading-tight text-[#FDF8F0]"
                    style={{ fontFamily: 'inherit' }}
                  >
                    {CONFIG.trackName}
                  </span>

                  {/* Time indicator (shown on hover) */}
                  <span
                    className="text-[9.5px] font-mono text-stone-400 transition-opacity duration-200"
                    style={{ opacity: isHovered || isPlaying ? 0.8 : 0 }}
                  >
                    {formatTime(currentTime)}
                  </span>
                </div>

                <div
                  className="text-[10px] sm:text-[10.5px] font-medium truncate mt-0.5 text-stone-400"
                  style={{ color: 'rgba(253, 248, 240, 0.52)', fontFamily: 'inherit' }}
                >
                  {CONFIG.artistName}
                </div>

                {/* ── Thin Audio Progress Indicator ───────────────────── */}
                <div
                  ref={progressBarRef}
                  onClick={handleSeek}
                  className="relative w-full mt-1.5 h-3 flex items-center cursor-pointer group/progress"
                >
                  {/* Progress Track Background */}
                  <div className="w-full h-[2px] group-hover/progress:h-[3px] rounded-full bg-white/10 overflow-hidden transition-all duration-200">
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{
                        width:      `${progressPercent}%`,
                        background: 'linear-gradient(90deg, #D97736 0%, #E07A3B 100%)',
                        boxShadow:  '0 0 6px rgba(217, 119, 54, 0.5)',
                      }}
                    />
                  </div>

                  {/* Scrubber Knob (visible on progress hover) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FAF5ED] opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{
                      left:      `calc(${progressPercent}% - 4px)`,
                      boxShadow: '0 0 6px rgba(0, 0, 0, 0.8), 0 0 4px #D97736',
                    }}
                  />
                </div>
              </div>

              {/* ── Controls Group (Volume, Play/Pause, Collapse) ──────── */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                {/* Volume Button */}
                <div className="relative flex items-center">
                  <button
                    onClick={handleToggleMute}
                    onMouseEnter={() => setShowVolume(true)}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-[#D97736] transition-colors duration-200 focus:outline-none cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Volume Slider Popover */}
                  {showVolume && (
                    <div
                      className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2 py-2 rounded-xl luxury-glass flex flex-col items-center gap-1 z-30"
                      onMouseEnter={() => setShowVolume(true)}
                      onMouseLeave={() => setShowVolume(false)}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          setVolume(parseFloat(e.target.value));
                          setIsMuted(false);
                        }}
                        className="w-16 h-1 accent-[#D97736] cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Play / Pause Circular Button */}
                <button
                  onClick={handleTogglePlay}
                  disabled={!isAvailable}
                  aria-label={isPlaying ? 'Pause music' : 'Play music'}
                  aria-pressed={isPlaying}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer focus:outline-none transition-all duration-300 hover:scale-106 active:scale-94"
                  style={{
                    border:     isPlaying ? '1.5px solid #E07A3B' : '1.5px solid rgba(217, 119, 54, 0.7)',
                    background: isPlaying
                      ? 'radial-gradient(circle, rgba(217, 119, 54, 0.28) 0%, rgba(217, 119, 54, 0.08) 100%)'
                      : 'radial-gradient(circle, rgba(217, 119, 54, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
                    color:      '#E07A3B',
                    boxShadow:  isPlaying
                      ? '0 0 14px rgba(217, 119, 54, 0.4), inset 0 0 6px rgba(217, 119, 54, 0.2)'
                      : '0 2px 6px rgba(0, 0, 0, 0.3)',
                    opacity:    isAvailable ? 1 : 0.4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#E07A3B';
                    e.currentTarget.style.boxShadow = '0 0 18px rgba(217, 119, 54, 0.5), inset 0 0 8px rgba(217, 119, 54, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isPlaying ? '#E07A3B' : 'rgba(217, 119, 54, 0.7)';
                    e.currentTarget.style.boxShadow = isPlaying
                      ? '0 0 14px rgba(217, 119, 54, 0.4), inset 0 0 6px rgba(217, 119, 54, 0.2)'
                      : '0 2px 6px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  {isLoading ? (
                    <div className="w-3 h-3 rounded-full border-2 border-[#E07A3B] border-t-transparent animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current translate-x-[1px]" />
                  )}
                </button>

                {/* Collapse Chevron Button */}
                <button
                  onClick={() => setIsCollapsed(true)}
                  aria-label="Collapse player"
                  title="Minimize"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-all duration-200 focus:outline-none cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
