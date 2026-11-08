"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, Share2, Sparkles, Star, TrendingUp } from "lucide-react";

import { getRank, Rank, RANKS } from "@/data/ranks";
import { useAccountStats } from "@/lib/lessonProgress";
import { dismissRankCelebration, syncCelebratedRank, useShowingRankCelebration } from "@/lib/rankCelebration";
import { addRankUpNotification } from "@/lib/rankUpNotifications";
import { useSession } from "@/lib/session";

import Confetti from "./Confetti";
import RankUpShare from "./RankUpShare";

// Ilustrasi kucing + tameng per rank dibuat pemilik di public/rank-up/<rank>.webp. Selama
// filenya belum ada, popup memakai emblem rank. Ilustrasi ini khusus perayaan; emblem rank di
// tempat lain tetap tameng tanpa maskot (PRD FR-05).
function celebrationImage(rank: Rank) {
  return `/rank-up/${rank.name.toLowerCase()}.webp`;
}

function Illustration({ rank }: { rank: Rank }) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? rank.emblem : celebrationImage(rank)}
      alt={`Emblem rank ${rank.name}`}
      width={220}
      height={220}
      priority
      onError={() => setFailed(true)}
      className="relative h-44 w-44 object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)] sm:h-52 sm:w-52"
    />
  );
}

// Posisi bintang kecil yang berkelip di sekitar emblem.
const SPARKLES = [
  { top: "12%", left: "14%", size: 14, delay: "0s" },
  { top: "22%", left: "82%", size: 18, delay: "0.4s" },
  { top: "62%", left: "8%", size: 12, delay: "0.8s" },
  { top: "70%", left: "88%", size: 14, delay: "0.2s" },
  { top: "4%", left: "60%", size: 10, delay: "1.1s" },
  { top: "44%", left: "94%", size: 9, delay: "0.6s" },
];

// Popup perayaan naik rank (PRD FR-05, ekspresi maskot "merayakan" FR-12). Tampil di halaman
// mana pun saat total XP melewati batas rank yang belum dirayakan, sekali per rank, dan
// sekaligus menambah notifikasi di kelompok Progres.
export default function RankUpCelebration() {
  const session = useSession();
  const stats = useAccountStats();
  const account = session ? (session.userId ?? session.email) : undefined;
  const showing = useShowingRankCelebration(account);
  const rank = showing === null ? null : (RANKS.find((item) => item.minXp === showing) ?? null);
  const currentMinXp = getRank(stats.xp).minXp;
  // Tampilan bagikan pencapaian di dalam popup yang sama.
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (!account || !stats.isLoaded) return;
    if (syncCelebratedRank(account, currentMinXp)) {
      addRankUpNotification(account, getRank(stats.xp).name);
    }
  }, [account, stats.isLoaded, stats.xp, currentMinXp]);

  const colors = useMemo(
    () => (rank ? [rank.color, rank.accentColor ?? "#FACC15", "#3B82F6", "#22D3EE", "#F472B6", "#FFFFFF", "#FACC15"] : []),
    [rank]
  );

  if (!rank || !account) return null;

  const next = RANKS.find((item) => item.minXp > rank.minXp);
  const close = () => {
    setIsSharing(false);
    dismissRankCelebration(account);
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-in fade-in-0 duration-300" />
        <Confetti colors={colors} />
        <Dialog.Popup
          className="dark fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border bg-slate-950 text-center text-white outline-none animate-in fade-in-0 zoom-in-90 duration-500"
          style={{ borderColor: `${rank.color}cc`, boxShadow: `0 0 0 1px ${rank.color}55, 0 0 60px ${rank.color}55, 0 0 120px #2563eb33` }}
        >
          {isSharing ? (
            <RankUpShare
              rank={rank}
              xp={stats.xp}
              displayName={session?.name ?? ""}
              username={session?.username ?? null}
              image={celebrationImage(rank)}
              onBack={() => setIsSharing(false)}
            />
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 px-5 pt-5">
                <span className="flex items-center gap-2 text-left text-sm font-semibold">
                  <Image src="/logo.webp" alt="" width={28} height={28} className="h-7 w-7" />
                  belajarautomation.com
                </span>
                <button
                  type="button"
                  aria-label="Bagikan pencapaian"
                  onClick={() => setIsSharing(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/5 transition-colors hover:bg-white/15"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Panggung emblem: sinar berputar, cahaya warna rank, dan bintang berkelip. */}
              <div className="relative mx-auto mt-2 flex h-60 w-full items-center justify-center overflow-hidden sm:h-64">
                {/* Tepi atas dan bawah dipudarkan agar sinar tidak terpotong kotak. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    maskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
                  }}
                >
                  <div
                    className="rank-rays absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-60"
                    style={{
                      background: `repeating-conic-gradient(from 0deg, ${rank.color}55 0deg 8deg, transparent 8deg 22deg)`,
                      maskImage: "radial-gradient(circle, black 15%, transparent 62%)",
                      WebkitMaskImage: "radial-gradient(circle, black 15%, transparent 62%)",
                    }}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="rank-glow absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                  style={{ background: rank.color }}
                />
                {SPARKLES.map((sparkle) => (
                  <Star
                    key={`${sparkle.top}-${sparkle.left}`}
                    aria-hidden="true"
                    className="rank-twinkle absolute fill-amber-300 text-amber-300"
                    style={{ top: sparkle.top, left: sparkle.left, width: sparkle.size, height: sparkle.size, animationDelay: sparkle.delay }}
                  />
                ))}
                <div className="rank-pop">
                  <div className="rank-float">
                    <Illustration rank={rank} />
                  </div>
                </div>
              </div>

              <div className="relative -mt-4 px-6 pb-6">
                <span
                  className="rank-rise inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-1.5 text-lg font-extrabold tracking-wide shadow-lg shadow-blue-600/40 ring-1 ring-white/30"
                  style={{ animationDelay: "0.5s" }}
                >
                  Rank Up!
                </span>

                <Dialog.Title className="rank-rise mt-4" style={{ animationDelay: "0.65s" }}>
                  <span className="flex items-center justify-center gap-2 text-4xl font-extrabold">
                    <Sparkles className="rank-twinkle h-6 w-6 text-amber-300" aria-hidden="true" />
                    Selamat!
                    <Sparkles className="rank-twinkle h-6 w-6 text-amber-300" aria-hidden="true" style={{ animationDelay: "0.5s" }} />
                  </span>
                  <span className="mt-1 block text-base font-medium text-slate-200">Kamu telah naik ke rank</span>
                </Dialog.Title>

                <p
                  className="rank-rise rank-shimmer mx-auto mt-3 w-fit rounded-full border-2 px-7 py-2 text-3xl font-extrabold"
                  style={{
                    animationDelay: "0.8s",
                    borderColor: rank.accentColor ?? rank.color,
                    backgroundImage: `linear-gradient(110deg, transparent 35%, ${rank.color}55 50%, transparent 65%)`,
                    boxShadow: `0 0 24px ${rank.color}66`,
                  }}
                >
                  {rank.name}
                </p>

                <Dialog.Description className="rank-rise mt-4 text-sm leading-6 text-slate-200" style={{ animationDelay: "0.95s" }}>
                  {next
                    ? `Terus lanjutkan perjalanan belajarmu, selesaikan lebih banyak course, dan raih rank ${next.name} di ${next.minXp.toLocaleString("id-ID")} XP!`
                    : "Kamu mencapai rank tertinggi. Luar biasa, terus bagikan ilmumu!"}
                </Dialog.Description>

                <div className="rank-rise mt-6 grid gap-3 sm:grid-cols-2" style={{ animationDelay: "1.1s" }}>
                  <Link
                    href="/rank"
                    onClick={close}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 px-4 text-sm font-semibold transition-colors hover:bg-white/10"
                  >
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    Lihat Progress Rank
                  </Link>
                  <Dialog.Close className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-semibold shadow-lg shadow-blue-600/40 transition-colors hover:bg-blue-500">
                    Lanjut Belajar
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Dialog.Close>
                </div>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
