'use client';

import { useEffect, useRef } from 'react';

const PLANTS = [
  { file: 'abedul', name: 'Abedul', label: 'Exterior' },
  { file: 'agapanto', name: 'Agapanto', label: 'Exterior' },
  { file: 'acer', name: 'Acer Japonés', label: 'Exterior' },
  { file: 'impatiens', name: 'Impatiens', label: 'Interior' },
  { file: 'margarita', name: 'Margarita Azul', label: 'Exterior' },
  { file: 'maple', name: 'Maple Japonés', label: 'Exterior' },
  { file: 'abeto', name: 'Abeto Azul', label: 'Exterior' },
  { file: 'new-guinea', name: 'N. Guinea', label: 'Interior' },
  { file: 'begonia', name: 'Begonia', label: 'Interior' },
  { file: 'cana', name: 'Caña de India', label: 'Exterior' },
  { file: 'abelia', name: 'Abelia', label: 'Exterior' },
  { file: 'chile', name: 'Chile Ornamental', label: 'Exterior' },
];

function PlantVideo({ file, name, label }: { file: string; name: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="group relative shrink-0 snap-start overflow-hidden rounded-2xl"
      style={{ width: '220px' }}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        className="w-full object-cover"
        style={{ height: '276px' }}
      >
        <source src={`/MPV/v2/videos/${file}.mp4`} type="video/mp4" />
      </video>
      {/* Card overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4"
        style={{ background: 'linear-gradient(to top, rgba(15,19,16,0.80) 0%, transparent 100%)' }}>
        <p className="font-semibold text-[13px] leading-tight text-white">{name}</p>
        <p className="mt-0.5 font-medium text-[10px] uppercase tracking-[0.1em] text-white/50">{label}</p>
      </div>
    </div>
  );
}

export function BotanicalGallery() {
  return (
    <div
      className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
      style={{ scrollbarWidth: 'none' }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      {PLANTS.map((p) => (
        <PlantVideo key={p.file} {...p} />
      ))}
    </div>
  );
}
