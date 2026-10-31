import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LearningRankCard() {
  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-slate-950 p-4 text-white shadow-sm sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-24 h-56 w-40 rotate-45 rounded-[2rem] border border-blue-400/20 bg-blue-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 h-52 w-28 -rotate-45 rounded-[2rem] border border-cyan-300/15 bg-cyan-300/5"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-1 sm:h-[4.5rem] sm:w-[4.5rem]">
          <Image
            src="/ranks/spesialits.png"
            alt="Contoh emblem rank Specialist"
          width={80}
          height={80}
            className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(45,212,191,0.35)]"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
            Rank &amp; XP
          </p>
          <h2 className="mt-0.5 text-lg font-bold sm:text-xl">
            Belum tersedia
          </h2>
          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-300 sm:text-sm">
            Emblem ini contoh tampilan. Sistem rank dan XP belum terhubung ke progres belajar.
          </p>
        </div>

        <Link
          href="/learn"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Jelajahi materi
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        <Sparkles
          className="absolute right-4 top-4 hidden h-4 w-4 text-cyan-200/70 sm:block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
