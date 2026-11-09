import React, { useEffect, useRef, useState } from 'react';

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const CONFIG = {
  audioSrc:   '/assets/audio/song.mp3',
  coverSrc:   '/assets/images/album-cover.jpg',
  trackName:  'Sunflower',
  artistName: 'Post Malone & Swae Lee',
};

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface State {
  playing:   boolean;
  collapsed: boolean;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function readSession(): State {
  try {
    const raw = sessionStorage.getItem('mp-state');
    if (raw) return { ...{ playing: false, collapsed: false }, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { playing: false, collapsed: false };
}

function writeSession(s: State) {
  try { sessionStorage.setItem('mp-state', JSON.stringify(s)); } catch { /* ignore */ }
}

function fadeTo(audio: HTMLAudioElement, target: number, ms: number) {
  const start  = audio.volume;
  const steps  = 20;
  const delta  = (target - start) / steps;
  const delay  = ms / steps;
  let   i      = 0;
  const id = setInterval(() => {
    i++;
    audio.volume = Math.min(1, Math.max(0, start + delta * i));
    if (i >= steps) {
      audio.volume = target;
      clearInterval(id);
      if (target === 0) audio.pause();
    }
  }, delay);
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const MusicPlayer: React.FC = () => {
  const init            = readSession();
  const [playing,    setPlaying]    = useState(false);           // never auto-play
  const [collapsed,  setCollapsed]  = useState(init.collapsed);
  const [mounted,    setMounted]    = useState(false);
  const [imgErr,     setImgErr]     = useState(false);
  const [bubbleMsg,  setBubbleMsg]  = useState('Tap & Enjoy Song');
  const [bubbleVis,  setBubbleVis]  = useState(true);
  const audioRef      = useRef<HTMLAudioElement>(null);
  const bubbleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Reduced-motion check
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Mount entrance
  useEffect(() => { const t = setTimeout(() => setMounted(true), 300); return () => clearTimeout(t); }, []);

  // ── Persist state (but never re-start audio on reload)
  useEffect(() => { writeSession({ playing: false, collapsed }); }, [collapsed]);

  // ── Pause on tab hide
  useEffect(() => {
    const onVis = () => { if (document.hidden && playing) handlePlayPause(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [playing]);

  // ── Bubble auto-hide when playing
  function showBubble(msg: string, autohide = false) {
    setBubbleMsg(msg);
    setBubbleVis(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (autohide) {
      bubbleTimer.current = setTimeout(() => setBubbleVis(false), 2500);
    }
  }

  // ── Play / Pause
  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) {
      audio.play().then(() => {
        fadeTo(audio, 0.6, 400);
        setPlaying(true);
        showBubble('Now Playing ♪', true);
      }).catch(() => { /* blocked by browser */ });
    } else {
      fadeTo(audio, 0, 400);
      setTimeout(() => setPlaying(false), 420);
      showBubble('Tap & Enjoy Song');
    }
  }

  // ── Collapse / Expand
  function handleCollapse() {
    if (playing) { handlePlayPause(); }
    setCollapsed(c => !c);
  }

  const spinDuration = prefersReduced ? '0s' : '8s';

  return (
    <>
      {/* ── Scoped CSS ─────────────────────────────────────────────────── */}
      <style>{`
        /* Spin */
        @keyframes mp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* Waveform bars */
        @keyframes mp-bar1 { 0%,100%{height:4px} 50%{height:14px} }
        @keyframes mp-bar2 { 0%,100%{height:10px} 40%{height:4px}  80%{height:16px} }
        @keyframes mp-bar3 { 0%,100%{height:6px}  30%{height:16px} 70%{height:4px}  }
        @keyframes mp-bar4 { 0%,100%{height:12px} 60%{height:5px}  }
        /* Entrance */
        @keyframes mp-rise {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        /* Bubble tail */
        .mp-bubble::after {
          content:'';
          position:absolute;
          bottom:-6px; left:50%;
          transform:translateX(-50%);
          border:6px solid transparent;
          border-top-color:rgba(20,15,10,0.92);
          border-bottom:0;
        }
        /* Slide off-screen */
        .mp-player-wrap {
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
        }
        .mp-player-wrap.mp-collapsed {
          transform: translateX(calc(-100% - 48px));
          opacity: 0;
          pointer-events: none;
        }
      `}</style>

      {/* ── Audio ──────────────────────────────────────────────────────── */}
      <audio
        ref={audioRef}
        src={CONFIG.audioSrc}
        preload="none"
        loop
      />

      {/* ── Wrapper — fixed bottom-right ───────────────────────────────── */}
      <div
        style={{
          position:      'fixed',
          bottom:        '24px',
          right:         '24px',
          zIndex:        40,
          display:       'flex',
          alignItems:    'flex-end',
          gap:           '10px',
          pointerEvents: 'none',
          opacity:        mounted ? 1 : 0,
          animation:      mounted ? 'mp-rise 0.6s ease forwards' : 'none',
        }}
      >
        {/* Collapse toggle — always visible */}
        <button
          onClick={handleCollapse}
          aria-label={collapsed ? 'Show music player' : 'Hide music player'}
          style={{
            pointerEvents:   'auto',
            width:            '36px',
            height:           '36px',
            borderRadius:     '50%',
            border:           '1.5px solid rgba(255,255,255,0.18)',
            background:       'rgba(10,8,6,0.65)',
            backdropFilter:   'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color:            '#fff',
            fontSize:         '14px',
            cursor:           'pointer',
            display:          'flex',
            alignItems:       'center',
            justifyContent:   'center',
            flexShrink:        0,
            transition:       'border-color 0.2s, background 0.2s',
            outline:          'none',
            alignSelf:        'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(143,84,49,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
          onFocus={e    => (e.currentTarget.style.outline = '2px solid #8F5431')}
          onBlur={e     => (e.currentTarget.style.outline = 'none')}
        >
          {collapsed ? '→' : '←'}
        </button>

        {/* ── The player card ─────────────────────────────────────────── */}
        <div
          className={`mp-player-wrap${collapsed ? ' mp-collapsed' : ''}`}
          style={{ pointerEvents: collapsed ? 'none' : 'auto' }}
        >
          {/* Speech-bubble tooltip */}
          <div
            className="mp-bubble"
            style={{
              position:         'absolute',
              bottom:           'calc(100% + 14px)',
              left:             '50%',
              transform:        'translateX(-50%)',
              background:       'rgba(20,15,10,0.92)',
              border:           '1px solid rgba(143,84,49,0.35)',
              color:            '#F5E6C8',
              fontSize:         '11px',
              fontWeight:       700,
              letterSpacing:    '0.03em',
              whiteSpace:       'nowrap',
              padding:          '5px 12px',
              borderRadius:     '20px',
              pointerEvents:    'none',
              opacity:           bubbleVis ? 1 : 0,
              transition:       'opacity 0.4s ease',
              backdropFilter:   'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex:            2,
            }}
          >
            {bubbleMsg}
          </div>

          {/* Card */}
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '12px',
              background:     'rgba(10,8,6,0.72)',
              border:         `1px solid ${playing ? 'rgba(143,84,49,0.45)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius:   '64px',
              padding:        '10px 18px 10px 10px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow:       playing
                ? '0 0 0 1px rgba(143,84,49,0.2), 0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(143,84,49,0.25)'
                : '0 8px 32px rgba(0,0,0,0.5)',
              transition:     'border-color 0.4s ease, box-shadow 0.4s ease',
              minWidth:       '220px',
              position:       'relative',
            }}
          >
            {/* Album art disc */}
            <div
              style={{
                position:     'relative',
                width:         '52px',
                height:        '52px',
                flexShrink:    0,
              }}
            >
              {/* Spinning ring */}
              <div
                style={{
                  position:        'absolute',
                  inset:           '-4px',
                  borderRadius:    '50%',
                  border:          '1.5px solid rgba(143,84,49,0.5)',
                  animation:        playing && !prefersReduced
                    ? `mp-spin ${spinDuration} linear infinite`
                    : 'none',
                  borderTopColor:  '#8F5431',
                }}
              />
              {/* Cover */}
              <div
                style={{
                  width:         '52px',
                  height:        '52px',
                  borderRadius:  '50%',
                  overflow:      'hidden',
                  background:    'rgba(59,30,8,0.8)',
                  animation:      playing && !prefersReduced
                    ? `mp-spin ${spinDuration} linear infinite`
                    : 'none',
                }}
              >
                {!imgErr ? (
                  <img
                    src={CONFIG.coverSrc}
                    alt="Album art"
                    onError={() => setImgErr(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  /* Fallback: grooved vinyl look */
                  <div
                    style={{
                      width:        '100%',
                      height:       '100%',
                      background:   `
                        radial-gradient(circle at 50% 50%, #2a1200 18%, transparent 18%),
                        repeating-radial-gradient(circle at 50% 50%, #1a0a00 0px, #1a0a00 1px, #231000 2px, #231000 3px)
                      `,
                      display:       'flex',
                      alignItems:    'center',
                      justifyContent:'center',
                    }}
                  >
                    <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#111' }} />
                  </div>
                )}
              </div>
              {/* Center spindle dot */}
              <div
                style={{
                  position:     'absolute',
                  top:          '50%', left: '50%',
                  transform:    'translate(-50%,-50%)',
                  width:         '6px', height: '6px',
                  borderRadius: '50%',
                  background:   '#111',
                  border:       '1px solid rgba(255,255,255,0.15)',
                  pointerEvents:'none',
                }}
              />
            </div>

            {/* Track info + waveform */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color:         '#F5E6C8',
                  fontSize:      '12px',
                  fontWeight:     700,
                  letterSpacing: '0.02em',
                  whiteSpace:    'nowrap',
                  overflow:      'hidden',
                  textOverflow:  'ellipsis',
                  fontFamily:    'sans-serif',
                }}
              >
                {CONFIG.trackName}
              </div>
              <div
                style={{
                  color:         'rgba(255,255,255,0.45)',
                  fontSize:      '10px',
                  fontWeight:     500,
                  whiteSpace:    'nowrap',
                  overflow:      'hidden',
                  textOverflow:  'ellipsis',
                  fontFamily:    'sans-serif',
                  marginTop:     '2px',
                }}
              >
                {CONFIG.artistName}
              </div>

              {/* Waveform bars */}
              <div
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '3px',
                  marginTop:     '6px',
                  height:        '18px',
                }}
              >
                {(['mp-bar1','mp-bar2','mp-bar3','mp-bar4'] as const).map((anim, i) => (
                  <div
                    key={i}
                    style={{
                      width:            '3px',
                      borderRadius:     '2px',
                      background:       '#8F5431',
                      height:           '4px',
                      animation:         playing && !prefersReduced
                        ? `${anim} 0.8s ease-in-out infinite`
                        : 'none',
                      animationDelay:   `${i * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Play / Pause button */}
            <button
              onClick={handlePlayPause}
              aria-label={playing ? 'Pause music' : 'Play music'}
              aria-pressed={playing}
              style={{
                width:          '40px',
                height:         '40px',
                borderRadius:   '50%',
                border:         '1.5px solid rgba(143,84,49,0.6)',
                background:      playing
                  ? 'rgba(143,84,49,0.25)'
                  : 'rgba(255,255,255,0.05)',
                color:          '#8F5431',
                fontSize:       '14px',
                cursor:         'pointer',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:      0,
                transition:     'background 0.3s ease, border-color 0.3s ease, transform 0.15s ease',
                outline:        'none',
                pointerEvents:  'auto',
                boxShadow:       playing ? '0 0 12px rgba(143,84,49,0.4)' : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              onFocus={e    => { e.currentTarget.style.outline = '2px solid #8F5431'; }}
              onBlur={e     => { e.currentTarget.style.outline = 'none'; }}
            >
              {playing ? (
                /* Pause icon */
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                  <rect x="0" y="0" width="4" height="14" rx="1.5"/>
                  <rect x="8" y="0" width="4" height="14" rx="1.5"/>
                </svg>
              ) : (
                /* Play icon */
                <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor" style={{ marginLeft: '2px' }}>
                  <path d="M1 1.5l11 5.5-11 5.5V1.5z"/>
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

