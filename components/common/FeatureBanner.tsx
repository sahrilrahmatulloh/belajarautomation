"use client";

import { ReactNode } from "react";
import { Info } from "lucide-react";

import ThemeBackdrop from "@/components/common/ThemeBackdrop";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { useAppearance } from "@/lib/useAppearance";

interface FeatureBannerProps {
  // Ikon lucide yang sudah dirender, mis. <Route />; ukurannya diatur banner.
  icon: ReactNode;
  title: string;
  // Keterangan fitur di popup (i); beberapa paragraf boleh, mis. aturan XP fitur tersebut.
  description: string | string[];
}

// Banner sampul halaman fitur setelah login (PRD FR-12 v2.47): Playground, Belajar, Roadmap,
// Leaderboard, eBook, dan Project. Keterangan fitur dibuka dari ikon (i). Latar mengikuti tema
// aktif dengan gradasi warna kartu agar teks terbaca di mode terang dan gelap, tanpa avatar.
// Blog tidak memakai banner ini karena dapat dibuka publik tanpa login.
export default function FeatureBanner({ icon, title, description }: FeatureBannerProps) {
  const { theme } = useAppearance();

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

      <div className="relative flex items-center gap-4 px-5 pb-5 sm:max-w-[72%] sm:p-6 lg:gap-5">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:h-16 sm:w-16 [&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-8 sm:[&>svg]:w-8"
        >
          {icon}
        </div>

        <div className="min-w-0">
          {/* Judul inline agar ikon (i) menempel di akhir judul walau judul turun baris. */}
          <h1 className="inline text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {/* Keterangan fitur di balik ikon (i) agar banner minimalis (PRD FR-12 v2.47). */}
          <Popover>
            <PopoverTrigger
              aria-label={`Tentang ${title}`}
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full align-middle text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Info className="h-5 w-5" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={6} className="w-80 max-w-[calc(100vw-2rem)] gap-1.5 p-3">
              <PopoverTitle>{title}</PopoverTitle>
              {/* Satu deskripsi popup (aria-describedby) berisi semua paragraf. */}
              <PopoverDescription render={<div />} className="space-y-1.5 text-sm leading-6">
                {(Array.isArray(description) ? description : [description]).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </PopoverDescription>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  );
}
