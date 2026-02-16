import { useEffect, useMemo, useRef, useState } from 'react';

export type ProductGalleryProps = {
  images: string[];
  alt: string;
  /** CSS color string for subtle accents (optional) */
  accent?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ProductGallery({ images, alt, accent = '#00ff41' }: ProductGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const safeImages = useMemo(() => {
    const arr = Array.isArray(images) ? images.filter(Boolean) : [];
    // Guard against duplicates
    return Array.from(new Set(arr));
  }, [images]);

  const total = safeImages.length;

  const scrollToIndex = (idx: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const i = clamp(idx, 0, Math.max(0, total - 1));
    const w = el.clientWidth;
    el.scrollTo({ left: i * w, behavior: 'smooth' });
  };

  const prev = () => scrollToIndex(active - 1);
  const next = () => scrollToIndex(active + 1);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateActive = () => {
      const w = el.clientWidth || 1;
      const i = Math.round(el.scrollLeft / w);
      setActive(clamp(i, 0, Math.max(0, total - 1)));
    };

    const onResize = () => {
      // Keep current slide aligned after layout changes
      scrollToIndex(active);
      updateActive();
    };

    el.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', onResize);

    // Initial sync
    updateActive();

    return () => {
      el.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (total === 0) return null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div
          ref={viewportRef}
          className="
            flex
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            rounded-2xl
            bg-dark-900/40
            border
            border-white/10
            glass
            
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
          style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px rgba(0,0,0,0.45)` }}
          aria-label="Галерея фотографий"
        >
          {safeImages.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative shrink-0 w-full snap-center"
              style={{ aspectRatio: '16 / 9' }}
            >
              <img
                src={src}
                alt={`${alt} — фото ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          ))}
        </div>

        {/* Controls */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={active === 0}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-11 h-11 rounded-full
                bg-black/45 backdrop-blur-md
                border border-white/10
                flex items-center justify-center
                text-white/90
                hover:bg-black/55
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
              "
              aria-label="Предыдущее фото"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={next}
              disabled={active === total - 1}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-11 h-11 rounded-full
                bg-black/45 backdrop-blur-md
                border border-white/10
                flex items-center justify-center
                text-white/90
                hover:bg-black/55
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
              "
              aria-label="Следующее фото"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-xs text-white/90">
              {active + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safeImages.map((src, i) => {
            const isActive = i === active;
            return (
              <button
                key={`thumb-${src}-${i}`}
                type="button"
                onClick={() => scrollToIndex(i)}
                className="
                  relative
                  shrink-0
                  w-20 h-14
                  rounded-xl
                  overflow-hidden
                  border
                  transition
                  hover:opacity-95
                "
                style={{
                  borderColor: isActive ? accent : 'rgba(255,255,255,0.12)',
                  boxShadow: isActive ? `0 0 0 1px ${accent}, 0 10px 30px rgba(0,0,0,0.35)` : undefined,
                }}
                aria-label={`Открыть фото ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                {isActive && <div className="absolute inset-0 bg-black/10" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
