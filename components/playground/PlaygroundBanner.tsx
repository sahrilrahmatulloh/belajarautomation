"use client";

import Image from "next/image";
import { FlaskConical } from "lucide-react";

import ThemeBackdrop from "@/components/common/ThemeBackdrop";
import { useAppearance } from "@/lib/useAppearance";

// Mengikuti pola Welcome Banner: latar tema aktif dengan gradasi warna kartu agar
// teks terbaca di mode terang dan gelap, dan avatar aktif di kanan.
export default function PlaygroundBanner() {
  const { avatar, theme } = useAppearance();
  return (
    <section className="relative isolate flex flex-col overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-sm sm:min-h-36 sm:flex-row sm:items-center">
      {/* Mulai tablet gambar hanya mengisi sisi kanan: bila memenuhi banner yang
          pendek dan lebar, ilustrasinya terpotong. */}
      <div className="relative -z-20 h-24 w-full sm:absolute sm:inset-y-0 sm:right-0 sm:h-auto sm:w-[30rem] lg:w-[36rem]">
        <ThemeBackdrop
          image={theme.image}
          video={theme.video}
          priority
          sizes="(min-width: 1024px) 576px, (min-width: 640px) 480px, 100vw"
          className="object-cover object-[75%_50%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-2/3 bg-gradient-to-r from-card via-card/70 to-transparent sm:block"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-12 -z-10 h-12 bg-gradient-to-t from-card to-transparent sm:hidden"
      />

      {!theme.hasCharacter && (
        <Image
          src={avatar.image}
          alt=""
          width={144}
          height={144}
          className="absolute right-3 top-2 -z-10 h-20 w-20 drop-shadow-lg sm:bottom-0 sm:right-6 sm:top-auto sm:h-28 sm:w-28 lg:right-10 lg:h-32 lg:w-32"
        />
      )}

      <div className="relative flex items-center gap-4 px-5 pb-5 sm:max-w-[72%] sm:p-6 lg:gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:h-16 sm:w-16">
          <FlaskConical className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            QA Automation Playground
          </h1>
          <p className="mt-1 text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6">
            Latih skill QA dan automation melalui challenge interaktif.
          </p>
        </div>
      </div>
    </section>
  );
}
