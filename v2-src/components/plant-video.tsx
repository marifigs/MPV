'use client';

import { useEffect, useRef } from 'react';
import { assetUrl } from '@/lib/asset-url';

interface PlantVideoProps {
  videoFile: string;
  name: string;
}

export function PlantVideo({ videoFile, name }: PlantVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.play().catch(() => {});
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: '3 / 4',
        borderRadius: '20px',
        boxShadow: '0 24px 64px rgba(26,31,27,0.18), 0 6px 20px rgba(26,31,27,0.10)',
      }}
    >
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={`Video de ${name}`}
      >
        <source src={assetUrl(`/videos/${videoFile}.mp4`)} type="video/mp4" />
      </video>
      {/* Subtle gradient vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(26,31,27,0.45), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pointer-events-none"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
          Video en vivo
        </p>
      </div>
    </div>
  );
}
