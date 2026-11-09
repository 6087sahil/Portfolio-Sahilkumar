import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CONFIG = {
  audioSrc:   '/assets/audio/song.mp3',
  coverSrc:   '/assets/images/miles-cover.jpg',
  trackName:  'Sunflower',
  artistName: 'Post Malone & Swae Lee',
};

// ─── ANIMATION VARIABLES (tweak here) ───────────────────────────────────────
const ANIM = {
  spinDuration:    '8s',          // album cover spin speed
  eqSpeed:         '0.8s',        // equalizer bar base duration
  entranceDelay:   '800ms',       // how long after mount before player slides in
  entranceEase:    'cubic-bezier(0.22, 1, 0.36, 1)',
  glowPulseDur:    '3s',          // breathing glow cycle
  bubbleFloatDur:  '2.4s',        // tooltip up-down float cycle
  collapseEase:    'cubic-bezier(0.4, 0, 0.2, 1)',
  rippleDur:       '500ms',       // play button click ripple
  ringPulseDur:    '2s',          // spinning ring glow pulse
};

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface SessionState { playing: boolean; collapsed: boolean; }

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function readSession(): SessionState {
  try {
    const raw = sessionStorage.getItem('mp-state');
    if (raw) return { ...{ playing: false, collapsed: false }, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { playing: false, collapsed: false };
}
function writeSession(s: SessionState) {
  try { sessionStorage.setItem('mp-state', JSON.stringify(s)); } catch { /* ignore */ }
}
function fadeTo(audio: HTMLAudioElement, target: number, ms: number) {
  const start = audio.volume, steps = 20, delta = (target - start) / steps, delay = ms / steps;
  let i = 0;
  const id = setInterval(() => {
    i++;
    audio.volume = Math.min(1, Math.max(0, start + delta * i));
    if (i >= steps) { audio.volume = target; clearInterval(id); if (target === 0) audio.pause(); }
  }, delay);
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const MusicPlayer: React.FC = () => {
  const init                        = readSession();
  const [playing,    setPlaying]    = useState(false);
  const [collapsed,  setCollapsed]  = useState(init.collapsed);
  const [mounted,    setMounted]    = useState(false);
  const [entered,    setEntered]    = useState(false);   // controls slide-in
  const [bubbleIn,   setBubbleIn]   = useState(false);   // controls bubble pop-in
  const [imgErr,     setImgErr]     = useState(false);
  const [bubbleMsg,  setBubbleMsg]  = useState('Tap & Enjoy Song');
  const [bubbleVis,  setBubbleVis]  = useState(true);
  const [ripple,     setRipple]     = useState(false);   // play-btn ripple
  const [tabHidden,  setTabHidden]  = useState(false);

  const audioRef    = useRef<HTMLAudioElement>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Reduced-motion
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Entrance sequence: mount → slide in → bubble pops in
  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 100);
    const t2 = setTimeout(() => setEntered(true), prefersReduced ? 100 : 900);  // 100ms mount + 800ms delay
    const t3 = setTimeout(() => setBubbleIn(true), prefersReduced ? 150 : 1250); // bubble 350ms after player
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // ── Persist state
  useEffect(() => { writeSession({ playing: false, collapsed }); }, [collapsed]);

  // ── Tab visibility
  useEffect(() => {
    const onVis = () => {
      setTabHidden(document.hidden);
      if (document.hidden && playing) handlePlayPause();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [playing]);

  // ── Bubble
  function showBubble(msg: string, autohide = false) {
    setBubbleMsg(msg); setBubbleVis(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (autohide) bubbleTimer.current = setTimeout(() => setBubbleVis(false), 2500);
  }

  // ── Play / Pause
  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) {
      audio.play().then(() => {
        fadeTo(audio, 0.6, 400);
        setPlaying(true);
        showBubble('Now Playing ♪', true);
        // ripple
        setRipple(true);
        setTimeout(() => setRipple(false), 600);
      }).catch(() => {});
    } else {
      fadeTo(audio, 0, 400);
      setTimeout(() => setPlaying(false), 420);
      showBubble('Tap & Enjoy Song');
      setRipple(true);
      setTimeout(() => setRipple(false), 600);
    }
  }, [playing]);

  // ── Collapse
  function handleCollapse() {
    if (playing) handlePlayPause();
    setCollapsed(c => !c);
  }

  // Should animations run?
  const animate = !prefersReduced && !tabHidden && !collapsed;

  return (
    <>
      {/* ─── Scoped CSS ──────────────────────────────────────────────────── */}
      <style>{`
        /* ── CSS Variables (tweak these) */
        .mp-root {
          --mp-spin:          ${ANIM.spinDuration};
          --mp-eq-speed:      ${ANIM.eqSpeed};
          --mp-entrance-ease: ${ANIM.entranceEase};
          --mp-glow-dur:      ${ANIM.glowPulseDur};
          --mp-float-dur:     ${ANIM.bubbleFloatDur};
          --mp-ripple-dur:    ${ANIM.rippleDur};
          --mp-ring-pulse:    ${ANIM.ringPulseDur};
          --mp-accent:        rgba(143,84,49,1);
          --mp-accent-dim:    rgba(143,84,49,0.25);
        }

        /* ── Entrance: player slides in from left */
        @keyframes mp-enter {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* ── Bubble pop-in with bounce */
        @keyframes mp-bubble-in {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.75); }
          70%  { transform: translateX(-50%) scale(1.06); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        /* ── Bubble float */
        @keyframes mp-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-3px); }
        }
        /* ── Album spin */
        @keyframes mp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* ── Ring glow pulse */
        @keyframes mp-ring-pulse {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(143,84,49,0); }
          50%       { box-shadow: 0 0 8px 2px rgba(143,84,49,0.45); }
        }
        /* ── Equalizer bars — scaleY on a 18px container */
        @keyframes mp-eq1 { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
        @keyframes mp-eq2 { 0%,100%{transform:scaleY(0.9)} 40%{transform:scaleY(0.3)} 80%{transform:scaleY(1)} }
        @keyframes mp-eq3 { 0%,100%{transform:scaleY(0.5)} 30%{transform:scaleY(1)} 70%{transform:scaleY(0.3)} }
        @keyframes mp-eq4 { 0%,100%{transform:scaleY(1)}   60%{transform:scaleY(0.35)} }
        /* ── Breathing glow behind pill */
        @keyframes mp-glow {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.5; }
        }
        /* ── Play-btn ripple */
        @keyframes mp-ripple {
          from { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
          to   { transform: translate(-50%,-50%) scale(1.65); opacity: 0; }
        }

        /* ── Tooltip bubble base + animation */
        .mp-bubble {
          position:        absolute;
          bottom:          calc(100% + 14px);
          left:            50%;
          transform:       translateX(-50%);
          background:      rgba(20,15,10,0.92);
          border:          1px solid rgba(143,84,49,0.35);
          color:           #F5E6C8;
          font-size:       11px;
          font-weight:     700;
          letter-spacing:  0.03em;
          white-space:     nowrap;
          padding:         5px 12px;
          border-radius:   20px;
          pointer-events:  none;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index:         2;
          transition:      opacity 0.4s ease;
        }
        .mp-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px; left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: rgba(20,15,10,0.92);
          border-bottom: 0;
        }
        .mp-bubble.mp-bubble-hidden { opacity: 0 !important; }
        .mp-bubble.mp-bubble-animate {
          animation: mp-bubble-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .mp-bubble.mp-bubble-float {
          animation: mp-float var(--mp-float-dur, 2.4s) ease-in-out infinite;
        }

        /* ── Player card wrap: slide out when collapsed */
        .mp-player-wrap {
          transition: transform 0.45s ${ANIM.collapseEase}, opacity 0.35s ease;
          position: relative;
        }
        .mp-player-wrap.mp-collapsed {
          transform: translateX(calc(-100% - 48px));
          opacity: 0;
          pointer-events: none;
        }

        /* ── Card: hover lift */
        .mp-card {
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease;
        }
        .mp-card:hover {
          transform: translateY(-2px);
        }

        /* ── Cover disc wrapper: hover scale */
        .mp-disc-wrap {
          transition: transform 0.2s ease;
        }
        .mp-disc-wrap:hover {
          transform: scale(1.05);
        }

        /* ── Spinning ring */
        .mp-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid rgba(143,84,49,0.5);
          border-top-color: #8F5431;
          transition: animation 0.3s;
        }
        .mp-ring.mp-ring-spin {
          animation: mp-spin var(--mp-spin, 8s) linear infinite,
                     mp-ring-pulse var(--mp-ring-pulse, 2s) ease-in-out infinite;
        }
        .mp-ring.mp-ring-paused {
          animation-play-state: paused;
        }

        /* ── Cover image */
        .mp-cover-img {
          width: 52px; height: 52px;
          border-radius: 50%; overflow: hidden;
          background: rgba(59,30,8,0.8);
        }
        .mp-cover-img.mp-cover-spin {
          animation: mp-spin var(--mp-spin, 8s) linear infinite;
        }
        .mp-cover-img.mp-cover-paused {
          animation-play-state: paused;
        }

        /* ── EQ bars container */
        .mp-eq-wrap {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 6px;
          height: 18px;
        }
        /* Each bar */
        .mp-eq-bar {
          width: 3px;
          border-radius: 2px;
          background: #8F5431;
          height: 4px;        /* resting dot height */
          transform-origin: bottom center;
          transition: height 0.3s ease;
        }
        .mp-eq-bar.mp-eq-playing {
          height: 14px;       /* expanded height for scaleY to work from */
          animation: var(--mp-eq-anim) var(--mp-eq-speed, 0.8s) ease-in-out infinite;
          animation-play-state: running;
        }
        .mp-eq-bar.mp-eq-paused  { animation-play-state: paused; }

        /* ── Play button */
        .mp-play-btn {
          position: relative;
          overflow: visible;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.15s ease,
                      box-shadow 0.3s ease;
        }
        .mp-play-btn:hover  { transform: scale(1.06); filter: brightness(1.2); }
        .mp-play-btn:active { transform: scale(0.94); }

        /* ── Ripple ring */
        .mp-ripple {
          position: absolute;
          top: 50%; left: 50%;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(143,84,49,0.6);
          pointer-events: none;
          animation: mp-ripple var(--mp-ripple-dur, 500ms) ease-out forwards;
        }

        /* ── Track title: fade-slide on state change */
        .mp-title {
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .mp-title.mp-title-change {
          opacity: 0;
          transform: translateY(6px);
        }

        /* ── Breathing glow pseudo-element */
        .mp-glow-wrap {
          position: absolute;
          inset: 0;
          border-radius: 64px;
          pointer-events: none;
          z-index: -1;
        }
        .mp-glow-wrap.mp-glow-on {
          background: radial-gradient(ellipse at center, rgba(143,84,49,0.35) 0%, transparent 70%);
          animation: mp-glow var(--mp-glow-dur, 3s) ease-in-out infinite;
        }

        /* ── Collapse arrow rotation */
        .mp-collapse-btn {
          transition: border-color 0.2s, background 0.2s, transform 0.4s ${ANIM.collapseEase};
        }
        .mp-collapse-btn.mp-collapse-active {
          transform: rotate(180deg);
        }

        /* ── prefers-reduced-motion: kill all animations */
        @media (prefers-reduced-motion: reduce) {
          .mp-ring.mp-ring-spin,
          .mp-cover-img.mp-cover-spin,
          .mp-eq-bar.mp-eq-playing,
          .mp-bubble.mp-bubble-float,
          .mp-bubble.mp-bubble-animate,
          .mp-glow-wrap.mp-glow-on,
          .mp-ripple {
            animation: none !important;
          }
          .mp-bubble { opacity: 1 !important; transform: translateX(-50%) !important; }
          .mp-card:hover { transform: none !important; }
          .mp-disc-wrap:hover { transform: none !important; }
          .mp-collapse-btn { transition: none !important; }
        }
      `}</style>

      {/* ── Audio ─────────────────────────────────────────────────────────── */}
      <audio ref={audioRef} src={CONFIG.audioSrc} preload="none" loop />

      {/* ── Root wrapper — fixed bottom-right ─────────────────────────────── */}
      <div
        className="mp-root"
        style={{
          position:      'fixed',
          bottom:        '24px',
          right:         '24px',
          zIndex:         40,
          display:       'flex',
          alignItems:    'flex-end',
          gap:           '10px',
          pointerEvents: 'none',
          // entrance: invisible until mounted, then animate in
          opacity:        mounted ? 1 : 0,
          ...(entered && !prefersReduced ? {
            animation: `mp-enter 0.6s ${ANIM.entranceEase} both`,
          } : {}),
        }}
      >
        {/* ── Collapse toggle ─────────────────────────────────────────────── */}
        <button
          onClick={handleCollapse}
          aria-label={collapsed ? 'Show music player' : 'Hide music player'}
          className={`mp-collapse-btn${collapsed ? ' mp-collapse-active' : ''}`}
          style={{
            pointerEvents:        'auto',
            width:                 '36px',
            height:                '36px',
            borderRadius:          '50%',
            border:                '1.5px solid rgba(255,255,255,0.18)',
            background:            'rgba(10,8,6,0.65)',
            backdropFilter:        'blur(12px)',
            WebkitBackdropFilter:  'blur(12px)',
            color:                 '#fff',
            fontSize:              '14px',
            cursor:                'pointer',
            display:               'flex',
            alignItems:            'center',
            justifyContent:        'center',
            flexShrink:             0,
            outline:               'none',
            alignSelf:             'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(143,84,49,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
          onFocus={e    => (e.currentTarget.style.outline = '2px solid #8F5431')}
          onBlur={e     => (e.currentTarget.style.outline = 'none')}
        >
          ←
        </button>

        {/* ── Player card wrap ────────────────────────────────────────────── */}
        <div
          className={`mp-player-wrap${collapsed ? ' mp-collapsed' : ''}`}
          style={{ pointerEvents: collapsed ? 'none' : 'auto' }}
        >
          {/* Speech-bubble tooltip */}
          <div
            className={[
              'mp-bubble',
              bubbleIn && !collapsed ? 'mp-bubble-animate' : '',
              // switch to float once visible & paused & not collapsed
              bubbleIn && !playing && !collapsed && bubbleVis ? 'mp-bubble-float' : '',
              !bubbleVis || collapsed ? 'mp-bubble-hidden' : '',
            ].join(' ')}
          >
            {bubbleMsg}
          </div>

          {/* ── Card ──────────────────────────────────────────────────────── */}
          <div
            className="mp-card"
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
              minWidth:       '220px',
              position:       'relative',
            }}
          >
            {/* Breathing glow (behind pill) */}
            <div className={`mp-glow-wrap${animate && playing ? ' mp-glow-on' : ''}`} />

            {/* ── Album art disc ─────────────────────────────────────────── */}
            <div
              className="mp-disc-wrap"
              style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}
            >
              {/* Spinning accent ring */}
              <div
                className={`mp-ring${
                  animate ? (playing ? ' mp-ring-spin' : ' mp-ring-spin mp-ring-paused') : ''
                }`}
              />

              {/* Cover */}
              <div
                className={`mp-cover-img${
                  animate ? (playing ? ' mp-cover-spin' : ' mp-cover-spin mp-cover-paused') : ''
                }`}
              >
                {!imgErr ? (
                  <img
                    src={CONFIG.coverSrc}
                    alt="Album art"
                    onError={() => setImgErr(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%', height: '100%',
                      background: `
                        radial-gradient(circle at 50% 50%, #2a1200 18%, transparent 18%),
                        repeating-radial-gradient(circle at 50% 50%, #1a0a00 0px, #1a0a00 1px, #231000 2px, #231000 3px)
                      `,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#111' }} />
                  </div>
                )}
              </div>

              {/* Spindle dot */}
              <div
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#111', border: '1px solid rgba(255,255,255,0.15)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ── Track info + EQ bars ───────────────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Title */}
              <div
                className="mp-title"
                style={{
                  color: '#F5E6C8', fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.02em', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'sans-serif',
                }}
              >
                {CONFIG.trackName}
              </div>
              {/* Artist */}
              <div
                style={{
                  color: 'rgba(255,255,255,0.45)', fontSize: '10px', fontWeight: 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  fontFamily: 'sans-serif', marginTop: '2px',
                }}
              >
                {CONFIG.artistName}
              </div>

              {/* EQ bars */}
              <div className="mp-eq-wrap">
                {(
                  [
                    { anim: 'mp-eq1', dur: '0.9s',  delay: '0s'    },
                    { anim: 'mp-eq2', dur: '1.1s',  delay: '0.2s'  },
                    { anim: 'mp-eq3', dur: '0.8s',  delay: '0.4s'  },
                    { anim: 'mp-eq4', dur: '1.2s',  delay: '0.1s'  },
                  ] as const
                ).map(({ anim, dur, delay }, i) => (
                  <div
                    key={i}
                    className={`mp-eq-bar${
                      animate && playing
                        ? ' mp-eq-playing'
                        : animate && !playing && i === 0 // keep paused state via class when just stopped
                        ? ' mp-eq-paused'
                        : ''
                    }`}
                    style={{
                      // drive the right keyframe + timings via CSS vars on each bar
                      ['--mp-eq-anim' as string]: anim,
                      ['--mp-eq-speed' as string]: dur,
                      animationDelay: delay,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>

            {/* ── Play / Pause button ────────────────────────────────────── */}
            <button
              onClick={handlePlayPause}
              aria-label={playing ? 'Pause music' : 'Play music'}
              aria-pressed={playing}
              className="mp-play-btn"
              style={{
                width:          '40px',
                height:         '40px',
                borderRadius:   '50%',
                border:         '1.5px solid rgba(143,84,49,0.6)',
                background:      playing ? 'rgba(143,84,49,0.25)' : 'rgba(255,255,255,0.05)',
                color:          '#8F5431',
                fontSize:       '14px',
                cursor:         'pointer',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:      0,
                outline:        'none',
                pointerEvents:  'auto',
                boxShadow:       playing ? '0 0 12px rgba(143,84,49,0.4)' : 'none',
              }}
              onFocus={e => (e.currentTarget.style.outline = '2px solid #8F5431')}
              onBlur={e  => (e.currentTarget.style.outline = 'none')}
            >
              {/* Ripple */}
              {ripple && !prefersReduced && <span className="mp-ripple" />}

              {/* Icon — cross-fade via opacity+scale */}
              <span
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  opacity: 1, transform: 'scale(1)',
                }}
              >
                {playing ? (
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                    <rect x="0" y="0" width="4" height="14" rx="1.5"/>
                    <rect x="8" y="0" width="4" height="14" rx="1.5"/>
                  </svg>
                ) : (
                  <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor" style={{ marginLeft: '2px' }}>
                    <path d="M1 1.5l11 5.5-11 5.5V1.5z"/>
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
