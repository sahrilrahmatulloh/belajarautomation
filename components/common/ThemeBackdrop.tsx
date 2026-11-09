"use client";

import Image from "next/image";

import { useReducedMotion } from "@/lib/useReducedMotion";

interface ThemeBackdropProps {
  image: string;
  // Video tema bergerak (MP4, tanpa suara, berulang). Opsional.
  video?: string;
  sizes: string;
  priority?: boolean;
  // Kelas posisi dan ukuran, sama untuk gambar dan video (mis. "object-cover object-[75%_50%]").
  className?: string;
}

// Latar tema banner (PRD FR-12). Gambar diam selalu dirender lebih dulu agar halaman cepat
// tampil; video diputar di atasnya setelah halaman siap. Pengguna yang mengaktifkan
// "kurangi gerakan" hanya melihat gambar diam.
export default function ThemeBackdrop({ image, video, sizes, priority = false, className = "" }: ThemeBackdropProps) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Image src={image} alt="" fill priority={priority} sizes={sizes} className={className} />
      {video && !reduceMotion && (
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          data-theme-video=""
          className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
        />
      )}
    </>
  );
}
