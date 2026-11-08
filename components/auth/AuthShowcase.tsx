"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, Pause, Play } from "lucide-react";

import ThemeBackdrop from "@/components/common/ThemeBackdrop";
import { AUTH_SLIDE_INTERVAL_MS, AUTH_SLIDES, AuthSlide } from "@/data/authSlides";
import { DEFAULT_THEME_ID, getTheme } from "@/data/themes";
import { useReducedMotion } from "@/lib/useReducedMotion";

const defaultTheme = getTheme(DEFAULT_THEME_ID)!;
// Jarak geser minimum (px) agar dianggap menggeser slide, bukan klik.
const SWIPE_THRESHOLD = 50;

function SlideVisual({ slide, isActive }: { slide: AuthSlide; isActive: boolean }) {
  const visual = slide.visual;
  if (visual.kind === "theme") {
    return (
      <ThemeBackdrop
        image={defaultTheme.image}
        // Video hanya diputar saat slide ini aktif.
        video={isActive ? defaultTheme.video : undefined}
        priority
        sizes="50vw"
        className="object-cover object-[78%_50%]"
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-900 to-slate-950">
      <div className="absolute inset-x-0 top-[18%] flex justify-center px-10">
        {visual.kind === "avatars" ? (
          <div className="grid max-w-md grid-cols-4 gap-4">
            {visual.images.map((image) => (
              <Image key={image} src={image} alt="" width={96} height={96} className="h-20 w-20 drop-shadow-lg xl:h-24 xl:w-24" />
            ))}
          </div>
        ) : (
          <div className="flex items-end justify-center">
            {visual.titles.map((title, index) => (
              <div
                key={title}
                className={`flex h-56 w-40 flex-col justify-between rounded-lg bg-gradient-to-br from-white to-blue-100 p-4 text-left text-slate-900 shadow-2xl ring-1 ring-white/30 xl:h-64 xl:w-44 ${
                  index === 0 ? "-rotate-6" : index === 2 ? "rotate-6" : "z-10 -mx-6 -translate-y-4"
                }`}
              >
                <BookOpen className="h-7 w-7 text-blue-600" aria-hidden="true" />
                <p className="text-base font-bold leading-snug">{title}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">belajarautomation</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Panel promosi bergeser di halaman masuk dan daftar (PRD 4.5). Hanya desktop.
export default function AuthShowcase() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const count = AUTH_SLIDES.length;
  const isAutoPlaying = !reduceMotion && !isPaused && !isInteracting;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % count), AUTH_SLIDE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isAutoPlaying, index, count]);

  const goTo = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promosi belajarautomation.com"
      className="relative h-full select-none overflow-hidden"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsInteracting(false);
      }}
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStart.current === null) return;
        const delta = event.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(delta) >= SWIPE_THRESHOLD) goTo(index + (delta < 0 ? 1 : -1));
      }}
    >
      {/* Saat bergeser otomatis, perubahan slide tidak diumumkan agar tidak mengganggu pembaca layar. */}
      <div aria-live={isAutoPlaying ? "off" : "polite"} className="h-full">
        {AUTH_SLIDES.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} dari ${count}: ${slide.title}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <SlideVisual slide={slide} isActive={isActive} />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-10 pb-24 text-white">
                <p className="flex items-center gap-2 text-sm font-semibold text-sky-300">
                  {slide.eyebrow}
                  {slide.badge && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">{slide.badge}</span>
                  )}
                </p>
                <p className="mt-3 max-w-md text-2xl font-bold leading-snug">{slide.title}</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">{slide.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kontrol: titik navigasi dan tombol jeda (wajib untuk konten yang bergerak sendiri). */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-10 pb-8">
        <div className="flex items-center gap-2" role="group" aria-label="Pilih slide">
          {AUTH_SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-label={`Slide ${slideIndex + 1}: ${slide.eyebrow}`}
              aria-current={slideIndex === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${
                slideIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            aria-label={isPaused ? "Putar slide" : "Jeda slide"}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
}
