"use client";

import Link from "next/link";
import { ArrowRight, Crown, Sparkles } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { getRankProgress } from "@/data/ranks";
import { formatNumber } from "@/lib/format";
import { useAccountXp } from "@/lib/lessonProgress";

export default function LearningRankCard() {
  const xp = useAccountXp();
  const { rank, nextRank, xpToNext, percent } = getRankProgress(xp);

  // Latar memakai warna identitas rank (PRD FR-01 bagian C, FR-05), jadi kartu ikut berubah
  // saat naik rank. Dasarnya tetap gelap agar teks putih terbaca di semua rank.
  const accent = rank.accentColor ?? rank.color;

  return (
    <section
      className="relative isolate overflow-hidden rounded-xl border p-4 text-white shadow-sm sm:p-5"
      style={{
        borderColor: `${rank.color}66`,
        backgroundColor: "#020617",
        backgroundImage: `radial-gradient(circle at 10% 50%, ${rank.color}59 0%, transparent 45%), linear-gradient(120deg, #020617 35%, ${rank.color}40 100%)`,
      }}
    >
      {/* Pola garis diagonal tipis dan kilau warna rank di sisi kanan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#fff_0_1px,transparent_1px_14px)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: `${accent}40` }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border p-1.5 sm:h-[4.5rem] sm:w-[4.5rem]"
          style={{
            borderColor: `${rank.color}80`,
            backgroundColor: `${rank.color}26`,
            boxShadow: `0 0 28px ${rank.color}66`,
          }}
        >
          <RankEmblem
            rank={rank}
            variant="full"
            size={56}
            priority
            className="drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
            Rank kamu
          </p>
          {/* Latar kartu selalu gelap, jadi warna rank aman dipakai sebagai teks. */}
          <h2 className="mt-0.5 text-lg font-bold sm:text-xl" style={{ color: rank.accentColor ?? rank.color }}>
            {rank.name}
          </h2>

          <div className="mt-2 max-w-md">
            {nextRank ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-x-3 text-xs text-slate-300">
                  <span className="font-semibold text-white">{formatNumber(xp)} XP</span>
                  <span>
                    {formatNumber(xpToNext)} XP lagi menuju {nextRank.name} · {percent}%
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label={`Progres menuju ${nextRank.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: rank.color }}
                  />
                </div>
              </>
            ) : (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                <span className="font-semibold text-white">{formatNumber(xp)} XP</span>
                <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: rank.accentColor }}>
                  <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                  Rank tertinggi tercapai
                </span>
              </p>
            )}
          </div>
        </div>

        <Link
          href="/rank"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Lihat detail rank
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
