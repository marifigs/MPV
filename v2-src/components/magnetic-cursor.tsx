'use client';

import { useEffect, useRef } from 'react';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Luxury editorial cursor — white dot + lagged ring, mix-blend-mode:difference
 * Renders only on fine-pointer (desktop) devices.
 * Adds class `custom-cursor` to <html> to suppress the native cursor via CSS.
 */
export function MagneticCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    // Only activate on true pointer (not touch)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.documentElement.classList.add('custom-cursor');

    let mouseX = -200, mouseY = -200;
    let ringX  = -200, ringY  = -200;
    let hovered = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Event delegation: grow cursor over interactive elements
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) {
        hovered = true;
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) {
        hovered = false;
      }
    };

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.11);
      ringY = lerp(ringY, mouseY, 0.11);

      const dot  = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.style.transform  = `translate(${mouseX}px,${mouseY}px)`;
        if (hovered) {
          dot.style.width  = '52px';
          dot.style.height = '52px';
          dot.style.marginLeft = '-26px';
          dot.style.marginTop  = '-26px';
          dot.style.opacity = '0.55';
        } else {
          dot.style.width  = '8px';
          dot.style.height = '8px';
          dot.style.marginLeft = '-4px';
          dot.style.marginTop  = '-4px';
          dot.style.opacity = '1';
        }
      }

      if (ring) {
        ring.style.transform = `translate(${ringX}px,${ringY}px)`;
        if (hovered) {
          ring.style.opacity = '0';
        } else {
          ring.style.opacity = '0.45';
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout',  onOut,  { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove('custom-cursor');
    };
  }, []);

  return (
    <>
      {/* Dot — tracks cursor exactly */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#fff',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 99999,
          marginLeft: '-4px',
          marginTop: '-4px',
          willChange: 'transform, width, height',
          transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s, margin 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      {/* Ring — lags ~9 frames behind */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1px solid #fff',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 99998,
          marginLeft: '-18px',
          marginTop: '-18px',
          willChange: 'transform, opacity',
          transition: 'opacity 0.4s',
        }}
      />
    </>
  );
}
