"use client";

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Menu, Pencil, Settings, X } from "lucide-react";

import ThemeBackdrop from "@/components/common/ThemeBackdrop";
import LinkifiedText from "@/components/common/LinkifiedText";
import RankEmblem from "@/components/common/RankEmblem";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getRankProgress } from "@/data/ranks";
import { formatNumber } from "@/lib/format";

import BannerAction, { BANNER_ACTION_CLASS } from "./BannerAction";
import { CUSTOMIZATION_TAB } from "./ProfileTabs";

const CUSTOMIZATION_HREF = `/profile?tab=${CUSTOMIZATION_TAB}`;

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  bio: string;
  avatarImage: string;
  avatarName: string;
  themeImage: string;
  themeVideo?: string;
  xp: number;
  // Pemilik melihat progres rank, ikon pensil di avatar, dan tombol aksi; publik hanya rank dan total XP.
  isOwner: boolean;
  // Tombol Bagikan profil (pemicu dialog), tampil di antara Edit profil dan Pengaturan.
  shareAction?: ReactNode;
}

// Header profil (PRD FR-13, acuan docs/desain/profil.webp): banner tema aktif, avatar aktif,
// rank, XP, dan tombol aksi pemilik. Tanpa level, sub-tingkat rank, atau lencana verifikasi.
export default function ProfileHeader({
  displayName,
  username,
  bio,
  avatarImage,
  avatarName,
  themeImage,
  themeVideo,
  xp,
  isOwner,
  shareAction,
}: ProfileHeaderProps) {
  const { rank, nextRank, xpToNext, percent } = getRankProgress(xp);
  const { open: actionsOpen, toggle: toggleActions, menuId, buttonRef, menuRef } = useBannerActionsMenu();

  return (
    <section
      aria-label="Profil"
      className="@container relative isolate overflow-hidden rounded-3xl border border-border bg-slate-900 text-white"
    >
      <ThemeBackdrop
        image={themeImage}
        video={themeVideo}
        priority
        sizes="(min-width: 1152px) 1152px, 100vw"
        className="-z-20 object-cover object-[75%_50%]"
      />
      {/* Gradasi gelap dari kiri agar teks putih terbaca di tema apa pun */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/45 sm:via-slate-950/60 sm:to-transparent"
      />

      {/* Tanpa position agar tombol aksi (absolute) diposisikan terhadap banner, bukan kolom teks. */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 @2xl:min-h-56 @2xl:justify-center @2xl:pr-20 @3xl:max-w-[70%] @3xl:pr-6">
        {/* Grid: di banner sempit rank dan XP turun ke baris sendiri selebar banner agar nama
            tidak terhimpit; di banner lebar berada di bawah nama, sejajar dengan avatar. */}
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-5 sm:gap-x-6 @2xl:gap-y-4">
          {/* Bingkai bulat mengikuti bentuk avatar kucing. */}
          <div className="relative shrink-0 @2xl:row-span-2">
            <div className="overflow-hidden rounded-full bg-white p-1 shadow-lg ring-4 ring-white/30">
              <Image
                src={avatarImage}
                alt={`Avatar ${avatarName}`}
                width={128}
                height={128}
                className="h-20 w-20 rounded-full sm:h-24 sm:w-24 @2xl:h-28 @2xl:w-28"
              />
            </div>
            {isOwner && (
              <Tooltip>
                <TooltipTrigger
                  aria-label="Ubah avatar dan tema"
                  render={<Link href={CUSTOMIZATION_HREF} />}
                  className="absolute -bottom-0.5 -right-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>Kustomisasi</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Ruang kanan untuk tombol menu aksi di banner sempit, agar nama tidak tertutup. */}
          <div className={`min-w-0 @2xl:self-end ${isOwner ? "pr-10 @2xl:pr-0" : ""}`}>
            <h1 className="line-clamp-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h1>
            {username && <p className="truncate text-sm text-white/80">@{username}</p>}
            {bio && (
              <p className="mt-1 line-clamp-3 break-words text-sm leading-5 text-white/90 sm:line-clamp-2">
                <LinkifiedText text={bio} linkClassName="text-white hover:text-sky-200" />
              </p>
            )}
          </div>

          <div className="col-span-2 flex items-center gap-5 sm:gap-8 @2xl:col-span-1 @2xl:col-start-2 @2xl:self-start @2xl:gap-6">
            <RankAndXp rank={rank} nextRank={nextRank} xp={xp} xpToNext={xpToNext} percent={percent} isOwner={isOwner} />
          </div>
        </div>

        {isOwner && (
          <>
            {/* Banner sempit: tombol aksi diringkas ke menu agar banner tetap minimalis (PRD FR-13). */}
            <button
              ref={buttonRef}
              type="button"
              aria-label="Aksi profil"
              aria-expanded={actionsOpen}
              aria-controls={menuId}
              onClick={toggleActions}
              className={`${BANNER_ACTION_CLASS} absolute right-4 top-4 z-10 @2xl:hidden`}
            >
              {actionsOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
            <nav
              ref={menuRef}
              id={menuId}
              aria-label="Aksi profil"
              // Banner sempit: satu baris di bawah isi banner saat menu dibuka, agar tidak menutupi teks.
              className={`${actionsOpen ? "flex" : "hidden"} flex-wrap gap-2 @2xl:absolute @2xl:right-4 @2xl:top-1/2 @2xl:z-10 @2xl:flex @2xl:-translate-y-1/2 @2xl:flex-col`}
            >
              <BannerAction label="Edit profil" icon={Pencil} href="/settings#informasi-profil" />
              {shareAction}
              <BannerAction label="Pengaturan" icon={Settings} href="/settings" />
              {username && <BannerAction label="Lihat sebagai publik" icon={Eye} href={`/u/${username}`} />}
            </nav>
          </>
        )}
      </div>
    </section>
  );
}

function RankAndXp({
  rank,
  nextRank,
  xp,
  xpToNext,
  percent,
  isOwner,
}: ReturnType<typeof getRankProgress> & { xp: number; isOwner: boolean }) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-3">
        <RankEmblem rank={rank} variant="full" size={52} />
        <div>
          <p className="text-xs text-white/75">Rank</p>
          <p className="font-semibold">{rank.name}</p>
        </div>
      </div>

      {/* XP; pemilik juga melihat progres menuju rank berikutnya */}
      <div className="min-w-0 max-w-xs flex-1 border-l border-white/25 pl-5 sm:pl-6">
        <p className="text-lg font-bold tabular-nums">{formatNumber(xp)} XP</p>
        {isOwner && (
          <>
            <div
              role="progressbar"
              aria-label={nextRank ? `Progress menuju ${nextRank.name}` : "Rank tertinggi tercapai"}
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2 h-2 overflow-hidden rounded-full bg-white/25"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-white/85">
              {nextRank ? `${formatNumber(xpToNext)} XP lagi ke ${nextRank.name} (${percent}%)` : "Rank tertinggi tercapai"}
            </p>
          </>
        )}
      </div>
    </>
  );
}

// Menu tombol aksi di banner sempit: dibuka dengan tombol menu, ditutup lagi dengan tombol yang
// sama, tombol Escape, atau klik di luar menu. Di banner lebar tombol aksi selalu tampil.
function useBannerActionsMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // Escape di dalam dialog Bagikan profil hanya menutup dialognya.
      if (event.key !== "Escape" || document.querySelector("[role=dialog]")) return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      // Klik di dalam dialog atau tooltip (dirender di luar menu) tidak menutup menu.
      if (target instanceof Element && target.closest("[role=dialog], [data-slot=tooltip-content]")) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return { open, toggle: () => setOpen((value) => !value), menuId, buttonRef, menuRef };
}
