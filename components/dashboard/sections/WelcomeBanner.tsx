"use client";

import Image from "next/image";

import { ACTIVE_AVATAR, ACTIVE_THEME } from "@/data/dummy/appearance";
import { useSession } from "@/lib/session";

// Welcome Banner (PRD FR-01 bagian B): latar mengikuti tema banner aktif dan
// avatar aktif tampil besar di kanan bawah, kecuali bila ilustrasi tema sudah
// memuat karakter kucing sendiri.
export default function WelcomeBanner() {
  const session = useSession();

  return (
    <section className="relative isolate flex flex-col overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-sm sm:min-h-48 sm:flex-row sm:items-center lg:min-h-56">
      {/* Latar tema: strip di atas teks pada mobile, memenuhi banner mulai tablet */}
      <div className="relative -z-20 h-36 w-full sm:absolute sm:inset-0 sm:h-auto">
        <Image
          src={ACTIVE_THEME.image}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 75vw, 100vw"
          className="object-cover object-[75%_50%]"
        />
      </div>

      {/* Gradasi memakai warna kartu agar teks terbaca di mode terang dan gelap:
          dari bawah pada mobile, dari kiri mulai tablet. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-24 -z-10 h-12 bg-gradient-to-t from-card to-transparent sm:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-card from-20% via-card/80 via-45% to-transparent to-75% sm:block"
      />

      {!ACTIVE_THEME.hasCharacter && (
        <Image
          src={ACTIVE_AVATAR.image}
          alt=""
          width={192}
          height={192}
          className="absolute bottom-3 right-4 -z-10 hidden h-32 w-32 drop-shadow-lg sm:block lg:bottom-4 lg:right-8 lg:h-44 lg:w-44"
        />
      )}

      {/* Struktur teks sama di semua tema */}
      <div className="relative px-5 pb-5 sm:max-w-[60%] sm:p-6 lg:max-w-[52%]">
        <p className="text-xs font-semibold text-brand-blue sm:text-sm">
          Belajar · Practice · Build · Grow
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Halo, <span className="text-primary">{session?.name}!</span>
        </h1>

        <p className="mt-2 text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6">
          Terus belajar dan bangun skill QA Automation untuk masa depan yang lebih baik.
        </p>
      </div>
    </section>
  );
}
