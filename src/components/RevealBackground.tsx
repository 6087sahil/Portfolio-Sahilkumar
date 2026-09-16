import React, { useEffect, useRef } from 'react';

interface RevealBackgroundProps {
  topImageSrc?: string;
  bottomImageSrc?: string;
}

interface Stamp {
  x: number;
  y: number;
  birth: number;
}

const RevealBackground: React.FC<RevealBackgroundProps> = ({
  topImageSrc = '/hero-top.png',
  bottomImageSrc = '/hero-bottom.png',
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bottomCanvasRef = useRef<HTMLCanvasElement>(null);
  const topCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const bottomCanvas = bottomCanvasRef.current;
    const topCanvas = topCanvasRef.current;
    if (!hero || !bottomCanvas || !topCanvas) return;

    const bottomCtx = bottomCanvas.getContext('2d', { alpha: false });
    const topCtx = topCanvas.getContext('2d');
    if (!bottomCtx || !topCtx) return;

    let cw = 0, ch = 0;
    let baseRadius = 0;
    let isMounted = true;

    // Offscreen canvases for performance
    const stampSize = 128;
    const stampCanvas = document.createElement('canvas');
    stampCanvas.width = stampSize;
    stampCanvas.height = stampSize;
    const sCtx = stampCanvas.getContext('2d');
    const stampR = stampSize / 2 - 8;

    const topCoverCanvas = document.createElement('canvas');
    const tcCtx = topCoverCanvas.getContext('2d', { alpha: false });

    const topImg = new Image();
    const bottomImg = new Image();
    
    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2 && isMounted) {
        init();
      }
    };

    topImg.onload = onImageLoad;
    bottomImg.onload = onImageLoad;
    
    topImg.onerror = (e) => {
      console.error("Failed to load topImageSrc:", topImageSrc, e);
      imagesLoaded++;
      if (imagesLoaded === 2 && isMounted) init();
    };
    bottomImg.onerror = (e) => {
      console.error("Failed to load bottomImageSrc:", bottomImageSrc, e);
      imagesLoaded++;
      if (imagesLoaded === 2 && isMounted) init();
    };

    topImg.src = topImageSrc;
    bottomImg.src = bottomImageSrc;

    const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
      if (!cw || !ch) return;
      const imgRatio = img.width / img.height;
      const canvasRatio = cw / ch;
      let renderWidth, renderHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        renderWidth = cw;
        renderHeight = cw / imgRatio;
        offsetX = 0;
        offsetY = (ch - renderHeight) / 2;
      } else {
        renderHeight = ch;
        renderWidth = ch * imgRatio;
        offsetY = 0;
        offsetX = (cw - renderWidth) / 2;
      }
      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    };

    const drawBottom = () => {
      if (imagesLoaded < 2) return;
      drawImageCover(bottomCtx, bottomImg);
    };

    const resize = () => {
      cw = hero.clientWidth;
      ch = hero.clientHeight;
      bottomCanvas.width = cw;
      bottomCanvas.height = ch;
      topCanvas.width = cw;
      topCanvas.height = ch;
      
      topCoverCanvas.width = cw;
      topCoverCanvas.height = ch;
      
      baseRadius = Math.min(cw, ch) * 0.19;
      
      drawBottom();
      if (imagesLoaded >= 2 && tcCtx) {
        drawImageCover(tcCtx, topImg);
      }
    };

    const stamps: Stamp[] = [];
    const MAX_AGE = 2.7;

    let pointerX = cw / 2;
    let pointerY = ch / 2;
    let followerX = pointerX;
    let followerY = pointerY;
    let isPointerInside = false;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = topCanvas.getBoundingClientRect();
      const scaleX = topCanvas.width / rect.width;
      const scaleY = topCanvas.height / rect.height;
      let cx: number, cy: number;
      if ('touches' in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      return {
        x: (cx - rect.left) * scaleX,
        y: (cy - rect.top) * scaleY,
      };
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getPos(e);
      pointerX = x;
      pointerY = y;
    };

    const onEnter = (e: MouseEvent | TouchEvent) => {
      isPointerInside = true;
      const { x, y } = getPos(e);
      pointerX = x;
      pointerY = y;
      followerX = pointerX;
      followerY = pointerY;
    };

    const onLeave = () => {
      isPointerInside = false;
    };

    hero.addEventListener('pointermove', onMove as EventListener);
    hero.addEventListener('pointerenter', onEnter as EventListener);
    hero.addEventListener('pointerleave', onLeave as EventListener);
    window.addEventListener('resize', resize);

    const drawBrushPath = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, time: number) => {
      const numPoints = 24;
      const points = [];
      
      for (let i = 0; i < numPoints; i++) {
        const a = (i / numPoints) * Math.PI * 2;
        const r = radius * (1 + 0.085 * Math.sin(3 * a + time) + 0.048 * Math.sin(5 * a - 1.15 * time) + 0.022 * Math.sin(9 * a + 0.6 * time));
        points.push({ x: x + r * Math.cos(a), y: y + r * Math.sin(a) });
      }

      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const p0 = points[(i - 1 + numPoints) % numPoints];
        const p1 = points[i];
        const p2 = points[(i + 1) % numPoints];
        const p3 = points[(i + 2) % numPoints];

        if (i === 0) {
          ctx.moveTo(p1.x, p1.y);
        }

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
      ctx.closePath();
      ctx.fill();
    };

    let lastTime = performance.now();
    let rafId: number;

    const loop = (now: number) => {
      const dtRaw = (now - lastTime) / 1000;
      lastTime = now;

      if (!cw || !ch) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(dtRaw, 0.05);
      const t = now / 1000;

      if (isPointerInside) {
        const k = 1 - Math.pow(1 - 0.17, dt * 60);
        const dx = pointerX - followerX;
        const dy = pointerY - followerY;
        
        const dist = Math.hypot(dx, dy);
        const stampInterval = baseRadius * 0.15; // Increased interval for performance
        
        if (dist > 0.1) {
          const steps = Math.floor(dist / stampInterval);
          for(let i=0; i<steps; i++){
            const frac = (i + 1) / steps;
            const ix = followerX + dx * frac * k;
            const iy = followerY + dy * frac * k;
            stamps.push({ x: ix, y: iy, birth: t });
          }
          
          followerX += dx * k;
          followerY += dy * k;
        }
      }

      while (stamps.length > 0 && (t - stamps[0].birth) > MAX_AGE) {
        stamps.shift();
      }

      // Redraw top image from pre-rendered canvas (insanely fast)
      topCtx.globalCompositeOperation = 'source-over';
      topCtx.clearRect(0, 0, cw, ch);
      if (tcCtx) {
        topCtx.drawImage(topCoverCanvas, 0, 0);
      }

      // Punch holes
      topCtx.globalCompositeOperation = 'destination-out';

      // Draw active trail stamps using pre-rendered stamp (hardware accelerated)
      for (let i = 0; i < stamps.length; i++) {
        const stamp = stamps[i];
        const age = t - stamp.birth;
        if (age < MAX_AGE) {
          const scale = Math.pow(1 - age / MAX_AGE, 0.85);
          const r = baseRadius * scale;
          if(r > 0){
             const drawW = stampSize * (r / stampR);
             topCtx.drawImage(stampCanvas, stamp.x - drawW/2, stamp.y - drawW/2, drawW, drawW);
          }
        }
      }



      rafId = requestAnimationFrame(loop);
    };

    const init = () => {
      // Pre-render stamp shape once
      if (sCtx) {
        sCtx.fillStyle = 'black';
        sCtx.clearRect(0, 0, stampSize, stampSize);
        drawBrushPath(sCtx, stampSize/2, stampSize/2, stampR, 0);
      }

      resize();
      if (!pointerX && cw) {
         pointerX = cw / 2;
         pointerY = ch / 2;
         followerX = pointerX;
         followerY = pointerY;
      }
      lastTime = performance.now();
      rafId = requestAnimationFrame(loop);
    };

    return () => {
      isMounted = false;
      hero.removeEventListener('pointermove', onMove as EventListener);
      hero.removeEventListener('pointerenter', onEnter as EventListener);
      hero.removeEventListener('pointerleave', onLeave as EventListener);
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [topImageSrc, bottomImageSrc]);

  return (
    <div
      ref={heroRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0a0a]"
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={bottomCanvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={topCanvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ zIndex: 2 }}
      />
    </div>
  );
};

export default RevealBackground;
