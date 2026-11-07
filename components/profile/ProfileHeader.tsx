import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";

import LinkifiedText from "@/components/common/LinkifiedText";
import RankEmblem from "@/components/common/RankEmblem";
import { getRankProgress } from "@/data/ranks";
import { formatNumber } from "@/lib/format";

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  bio: string;
  avatarImage: string;
  avatarName: string;
  themeImage: string;
  xp: number;
  // Pemilik melihat progres rank dan tombol pengaturan; publik hanya rank dan total XP.
  isOwner: boolean;
  // Tombol bagikan, tampil di bawah tombol pengaturan.
  shareAction?: ReactNode;
}

// Header profil (PRD FR-13): banner tema aktif, avatar aktif, rank, dan XP.
// Tanpa level, sub-tingkat rank, atau lencana verifikasi.
export default function ProfileHeader({
  displayName,
  username,
  bio,
  avatarImage,
  avatarName,
  themeImage,
  xp,
  isOwner,
  shareAction,
}: ProfileHeaderProps) {
  const { rank, nextRank, xpToNext, percent } = getRankProgress(xp);

  return (
    <section className="@container relative isolate overflow-hidden rounded-3xl border border-border bg-slate-900 text-white">
      <Image
        src={themeImage}
        alt=""
        fill
        priority
        sizes="(min-width: 1152px) 1152px, 100vw"
        className="-z-20 object-cover object-[75%_50%]"
      />
      {/* Gradasi gelap dari kiri agar teks putih terbaca di tema apa pun */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/45 sm:via-slate-950/60 sm:to-transparent"
      />

      {isOwner && (
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <Link
            href="/settings"
            aria-label="Pengaturan profil"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/40 text-white backdrop-blur-sm transition-colors hover:bg-slate-950/60"
          >
            <Settings2 className="h-5 w-5" aria-hidden="true" />
          </Link>
          {shareAction}
        </div>
      )}

      {/* Dua baris di semua ukuran agar nama tidak pernah terhimpit. Lebar mengikuti
          kartu, bukan layar, karena sidebar ikut memengaruhi ruang yang tersedia;
          di kartu lebar dibatasi agar teks tidak menimpa ilustrasi di sisi kanan. */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 @2xl:max-w-[68%]">
        <div className={`flex min-w-0 items-center gap-4 sm:gap-5 ${isOwner ? "pr-12 @2xl:pr-0" : ""}`}>
          <div className="shrink-0 overflow-hidden rounded-2xl bg-white p-1 shadow-lg">
            <Image
              src={avatarImage}
              alt={`Avatar ${avatarName}`}
              width={112}
              height={112}
              className="h-20 w-20 sm:h-24 sm:w-24"
            />
          </div>
          <div className="min-w-0">
            <h1 className="line-clamp-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h1>
            {username && <p className="truncate text-sm text-white/75">@{username}</p>}
            {bio && (
              <p className="mt-1 line-clamp-3 break-words text-sm leading-5 text-white/85 sm:line-clamp-2">
                <LinkifiedText text={bio} linkClassName="text-white hover:text-sky-200" />
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-5 sm:gap-8">
          {/* Rank */}
          <div className="flex shrink-0 items-center gap-3">
            <RankEmblem rank={rank} variant="full" size={56} />
            <div>
              <p className="text-xs text-white/70">Rank</p>
              <p className="font-semibold">{rank.name}</p>
            </div>
          </div>

          {/* XP; pemilik juga melihat progres menuju rank berikutnya */}
          <div className="min-w-0 max-w-xs flex-1 border-l border-white/20 pl-5 sm:pl-8">
            <p className="text-lg font-bold tabular-nums">{formatNumber(xp)} XP</p>
            {isOwner && (
              <>
                <div
                  role="progressbar"
                  aria-label={nextRank ? `Progress menuju ${nextRank.name}` : "Rank tertinggi tercapai"}
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"
                >
                  <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: rank.color }} />
                </div>
                <p className="mt-1.5 text-xs text-white/75">
                  {nextRank
                    ? `${formatNumber(xpToNext)} XP lagi ke ${nextRank.name} (${percent}%)`
                    : "Rank tertinggi tercapai"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
