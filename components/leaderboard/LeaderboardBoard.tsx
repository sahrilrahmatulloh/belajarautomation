"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Crown, EyeOff, Globe2, LocateFixed, TrendingUp } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { useAppearance } from "@/lib/useAppearance";
import { getRankProgress } from "@/data/ranks";
import { DEMO_LEARNER_ID, useLeaderboardOverlay } from "@/lib/content";
import { formatNumber } from "@/lib/format";
import { getLeaderboard, LEADERBOARD_LIMIT, LeaderboardTab } from "@/lib/leaderboard";
import { useUrlFilters } from "@/lib/useUrlFilters";

import LeaderboardRowItem from "./LeaderboardRowItem";

const FILTER_KEYS = ["tab", "halaman"] as const;
// 50 teratas ditampilkan 10 per halaman (PRD FR-06).
export const LEADERBOARD_PAGE_SIZE = 10;
const CURRENT_USER_ROW_ID = "posisi-kamu-baris";

export default function LeaderboardBoard() {
  const { avatar } = useAppearance();
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);
  // Tab rank pengguna aktif lebih dulu; nilai URL lain dianggap tab rank.
  const tab: LeaderboardTab = values.tab === "global" ? "global" : "rank";

  // Label dan isi tab rank mengikuti XP pengguna, jadi otomatis berubah saat naik rank.
  const { rank, nextRank, xpToNext } = getRankProgress(DUMMY_ACCOUNT.xp);
  const isHidden = !DUMMY_ACCOUNT.showOnLeaderboard;
  const { excludedIds, xpOverrides } = useLeaderboardOverlay();
  const isCurrentUserVisible = DUMMY_ACCOUNT.showOnLeaderboard && !excludedIds.includes(DEMO_LEARNER_ID);
  const { top, total, currentUser, isCurrentUserInTop } = getLeaderboard(tab, undefined, isCurrentUserVisible, excludedIds, xpOverrides);

  const pageCount = Math.max(1, Math.ceil(top.length / LEADERBOARD_PAGE_SIZE));
  const requestedPage = Number.parseInt(values.halaman, 10);
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), pageCount) : 1;
  const pageRows = top.slice((page - 1) * LEADERBOARD_PAGE_SIZE, page * LEADERBOARD_PAGE_SIZE);
  const firstShown = top.length === 0 ? 0 : (page - 1) * LEADERBOARD_PAGE_SIZE + 1;
  const lastShown = (page - 1) * LEADERBOARD_PAGE_SIZE + pageRows.length;

  // Halaman yang memuat baris pengguna bila ia termasuk 50 teratas.
  const currentUserIndex = isCurrentUserInTop ? top.findIndex((row) => row.isCurrentUser) : -1;
  const currentUserPage = currentUserIndex >= 0 ? Math.floor(currentUserIndex / LEADERBOARD_PAGE_SIZE) + 1 : null;
  const [highlightCurrentUser, setHighlightCurrentUser] = useState(false);

  const goToPage = (next: number) => {
    setHighlightCurrentUser(false);
    setFilters({ halaman: next > 1 ? String(next) : "" });
  };

  const jumpToCurrentUser = () => {
    if (!currentUserPage) return;
    setFilters({ halaman: currentUserPage > 1 ? String(currentUserPage) : "" });
    setHighlightCurrentUser(true);
  };

  // Setelah melompat, gulir ke baris pengguna dan pindahkan fokus ke sana.
  useEffect(() => {
    if (!highlightCurrentUser || page !== currentUserPage) return;
    const row = document.getElementById(CURRENT_USER_ROW_ID);
    row?.scrollIntoView({ block: "center", behavior: "smooth" });
    row?.focus({ preventScroll: true });
  }, [highlightCurrentUser, page, currentUserPage]);

  const tabs = [
    {
      value: "rank" as const,
      label: rank.name,
      icon: <RankEmblem rank={rank} variant="compact" size={22} />,
    },
    {
      value: "global" as const,
      label: "Global",
      icon: <Globe2 className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Kategori leaderboard"
        className="inline-flex w-fit rounded-xl border border-border bg-muted/50 p-1"
      >
        {tabs.map((item) => {
          const isActive = item.value === tab;
          const isRankTab = item.value === "rank";
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`tab-${item.value}`}
              aria-selected={isActive}
              aria-controls="leaderboard-panel"
              onClick={() => {
                setHighlightCurrentUser(false);
                setFilters({ tab: item.value, halaman: "" });
              }}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              // Tab rank memakai warna identitas rank untuk border dan latar tipisnya.
              style={
                isRankTab && isActive
                  ? { borderColor: rank.color, backgroundColor: `${rank.color}1f` }
                  : isActive
                    ? { borderColor: "var(--border)" }
                    : undefined
              }
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      <div id="leaderboard-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-5">
        {/* Posisi pengguna selalu disematkan, termasuk di luar 50 besar. */}
        <section
          aria-label="Posisi kamu"
          className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4 sm:p-5"
          style={{ borderColor: `${rank.color}80` }}
        >
          <div className="flex items-center gap-3">
            <Image
              src={avatar.image}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full bg-muted"
            />
            <div>
              <p className="text-sm text-muted-foreground">
                Posisi kamu {tab === "global" ? "secara global" : `di ${rank.name}`}
              </p>
              <p className="mt-0.5 text-3xl font-bold tabular-nums">#{currentUser.position}</p>
            </div>
          </div>

          {/* Lebar minimum agar turun ke baris baru di layar sempit, tidak terhimpit. */}
          <div className="flex min-w-[12rem] flex-1 items-center gap-3">
            <RankEmblem rank={rank} variant="full" size={56} priority />
            <div className="min-w-0">
              <p className="font-semibold">{rank.name}</p>
              <p className="text-sm text-muted-foreground">{formatNumber(currentUser.totalXp)} XP</p>
            </div>
          </div>

          {tab === "rank" && (
            <p className="flex w-full items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm">
              {nextRank ? (
                <>
                  <TrendingUp className="h-4 w-4 shrink-0 text-primary-accent" aria-hidden="true" />
                  Butuh {formatNumber(xpToNext)} XP lagi untuk naik ke {nextRank.name}
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 shrink-0" style={{ color: rank.accentColor }} aria-hidden="true" />
                  Rank tertinggi telah tercapai
                </>
              )}
            </p>
          )}

          <Link
            href="/rank"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-accent hover:underline"
          >
            Lihat tingkatan rank
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          {currentUserPage && currentUserPage !== page && (
            <button
              type="button"
              onClick={jumpToCurrentUser}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <LocateFixed className="h-4 w-4" aria-hidden="true" />
              Lompat ke posisiku
              <span className="font-normal text-muted-foreground">(halaman {currentUserPage})</span>
            </button>
          )}

          {isHidden && (
            <p className="flex w-full items-start gap-2 text-xs text-muted-foreground">
              <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                Kamu tidak ditampilkan di leaderboard publik.{" "}
                <Link href="/settings#privasi" className="font-medium text-primary-accent hover:underline">
                  Ubah di Pengaturan
                </Link>
              </span>
            </p>
          )}
        </section>

        <section aria-label={`${LEADERBOARD_LIMIT} peringkat teratas`}>
          <p className="mb-2 text-sm text-muted-foreground">
            Peringkat {firstShown}–{lastShown} dari {Math.min(LEADERBOARD_LIMIT, total)} teratas · {formatNumber(total)} peserta ·{" "}
            {tab === "global" ? "Global" : rank.name}
          </p>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <ol className="divide-y divide-border">
              {pageRows.map((row) => (
                <LeaderboardRowItem
                  key={row.id}
                  row={row}
                  id={row.isCurrentUser ? CURRENT_USER_ROW_ID : undefined}
                  isHighlighted={row.isCurrentUser && highlightCurrentUser}
                />
              ))}
            </ol>

            {!isHidden && !isCurrentUserInTop && (
              <>
                <div
                  aria-hidden="true"
                  className="border-y border-border bg-muted/40 py-1 text-center text-sm font-bold tracking-widest text-muted-foreground"
                >
                  …
                </div>
                <ol aria-label="Posisi kamu di luar 50 besar">
                  <LeaderboardRowItem row={currentUser} />
                </ol>
              </>
            )}
          </div>

          {pageCount > 1 && (
            <nav aria-label="Halaman leaderboard" className="mt-4 flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label="Halaman sebelumnya"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => goToPage(number)}
                  aria-label={`Halaman ${number}`}
                  aria-current={number === page ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold tabular-nums transition-colors ${
                    number === page
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page === pageCount}
                aria-label="Halaman berikutnya"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
