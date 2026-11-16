"use client";

import Link from "next/link";
import { BadgeCheck, CheckCircle2, ChevronRight, Clock3, Crown, FilePen, Flag, Hourglass, Inbox, LucideIcon, RotateCcw, Sparkles, Undo2, UserPlus, UserRoundX, Users, Wallet } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import RankEmblem from "@/components/common/RankEmblem";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { getRank, RANKS } from "@/data/ranks";
import { formatContentDate } from "@/lib/content/document";
import { formatNumber, formatRupiah } from "@/lib/format";
import { useSession } from "@/lib/session";
import { ContentStatusId } from "@/types/ContentWorkflow";

import { ACTION_LABELS } from "./AuditLogPage";
import WeeklyChart, { lastWeeks, WeeklyPoint } from "@/components/common/WeeklyChart";
import { formatDateTime, isLongWaiting, isNewUser, isToday, LONG_WAIT_DAYS, NEW_USER_DAYS, PAID_MEMBERSHIP, useAdminData } from "./useAdminData";

const RECENT_LIMIT = 5;
const TERBIT_LIMIT = 3;
const GROWTH_WEEKS = 12;
const REVENUE_WEEKS = 8;
const compactNumber = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 });


interface AttentionItem {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  iconStyle: string;
  // Kosong untuk angka yang datanya belum ada (tidak dapat diklik).
  href?: string;
}

// Satu baris di "Perlu Perhatian": label lalu angka, sehingga nama tautannya "Label angka".
function AttentionRow({ label, value, detail, icon: Icon, iconStyle, href }: AttentionItem) {
  const content = (
    <>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">
          {label}{" "}
          <span className={`ml-1 inline-flex min-w-6 justify-center rounded-full px-1.5 text-xs font-bold tabular-nums ${value > 0 ? "bg-primary/10 text-primary-accent" : "bg-muted text-muted-foreground"}`}>
            {href ? formatNumber(value) : "–"}
          </span>
        </span>
        <span className="block text-xs text-muted-foreground">{detail}</span>
      </span>
    </>
  );
  if (!href) {
    // Placeholder: judul tetap heading agar mudah ditemukan, tanpa tautan.
    return (
      <li className="flex items-center gap-3 px-1 py-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{label}</h3>
          <span className="block text-xs text-muted-foreground">{detail}</span>
        </span>
        <span className="text-xs font-bold text-muted-foreground">–</span>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-accent">
        {content}
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </li>
  );
}

// Dashboard Admin versi prototipe DEV (PRD FR-16 A). Setiap angka membuka daftar yang sudah tersaring.
export default function AdminSummary() {
  const session = useSession();
  const { data } = useAdminData();
  const now = data?.loadedAt ?? 0;
  const contents = data?.contents ?? [];
  const users = data?.users ?? [];
  const transactions = data?.transactions ?? [];
  const activeUsers = users.filter((user) => user.status === "aktif").length;
  const proCount = users.filter((user) => user.membership === "pro").length;
  const premiumCount = users.filter((user) => user.membership === "premium").length;
  const totalXp = users.reduce((total, user) => total + user.xp, 0);
  const rankCounts = RANKS.map((rank) => users.filter((user) => getRank(user.xp).name === rank.name).length);
  const maxRankCount = Math.max(1, ...rankCounts);
  const recentActions = [...(data?.auditLog ?? [])].sort((a, b) => b.at.localeCompare(a.at)).slice(0, RECENT_LIMIT);
  const count = (status: ContentStatusId) => contents.filter((content) => content.status === status).length;
  const waiting = contents.filter((content) => content.status === "menunggu-review");
  const published = contents
    .filter((content) => content.status === "terbit")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, TERBIT_LIMIT);

  // Pertumbuhan total pengguna dan pendapatan transaksi Berhasil per minggu.
  const growth: WeeklyPoint[] = lastWeeks(now, GROWTH_WEEKS).map((week) => {
    const joinedAt = users.map((user) => Date.parse(user.joinedAt));
    const added = joinedAt.filter((time) => time > week.start && time <= week.end).length;
    return { label: week.label, value: joinedAt.filter((time) => time <= week.end).length, detail: `+${formatNumber(added)} pengguna baru` };
  });
  const revenue: WeeklyPoint[] = lastWeeks(now, REVENUE_WEEKS).map((week) => {
    const sold = transactions.filter((item) => item.status === "berhasil" && Date.parse(item.createdAt) > week.start && Date.parse(item.createdAt) <= week.end);
    return { label: week.label, value: sold.reduce((total, item) => total + item.amount, 0), detail: `${formatNumber(sold.length)} transaksi berhasil` };
  });
  const revenueTotal = revenue.reduce((total, point) => total + point.value, 0);

  const userCards = [
    { label: "Total Pengguna", value: formatNumber(users.length), detail: `${formatNumber(activeUsers)} akun aktif`, icon: Users, iconStyle: "bg-brand-blue/10 text-brand-blue", href: "/admin/pengguna" },
    {
      label: `Pengguna Baru ${NEW_USER_DAYS} Hari`,
      value: formatNumber(users.filter((user) => isNewUser(user, now)).length),
      detail: `Mendaftar dalam ${NEW_USER_DAYS} hari terakhir`,
      icon: UserPlus,
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
      href: "/admin/pengguna?baru=1",
    },
    {
      label: "Membership Aktif",
      value: formatNumber(proCount + premiumCount),
      detail: `Pro ${formatNumber(proCount)} · Premium ${formatNumber(premiumCount)}`,
      icon: Crown,
      iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
      href: `/admin/pengguna?membership=${PAID_MEMBERSHIP}`,
    },
    { label: "Total XP Terkumpul", value: formatNumber(totalXp), detail: "Dari semua pengguna", icon: Sparkles, iconStyle: "bg-violet-500/10 text-violet-600 dark:text-violet-300", href: "/admin/laporan" },
  ];

  const statusItems = [
    { label: "Draf", status: "draf", icon: FilePen, iconStyle: "bg-muted text-muted-foreground" },
    { label: "Menunggu Review", status: "menunggu-review", icon: Inbox, iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
    { label: "Perlu Revisi", status: "perlu-revisi", icon: RotateCcw, iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
    { label: "Disetujui", status: "disetujui", icon: BadgeCheck, iconStyle: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
    { label: "Terbit", status: "terbit", icon: CheckCircle2, iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" },
  ] as const;

  // Semua hal yang menunggu tindakan Admin, dalam satu daftar.
  const attention: AttentionItem[] = [
    {
      label: "Belum Ditugaskan",
      value: waiting.filter((content) => !content.reviewerId).length,
      detail: "Menunggu Review tanpa Reviewer",
      icon: UserRoundX,
      iconStyle: "bg-brand-blue/10 text-brand-blue",
      href: "/admin/konten?status=menunggu-review&reviewer=belum",
    },
    {
      label: `Menunggu Lebih dari ${LONG_WAIT_DAYS} Hari`,
      value: waiting.filter((content) => isLongWaiting(content, now)).length,
      detail: "Review yang perlu dipercepat",
      icon: Hourglass,
      iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
      href: "/admin/konten?status=menunggu-review&lama=1",
    },
    {
      label: "Ditandai Moderasi",
      value: (data?.flags ?? []).filter((flag) => flag.status === "terbuka").length,
      detail: "Pola XP tidak wajar, perlu ditinjau",
      icon: Flag,
      iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
      href: "/admin/moderasi?status=terbuka",
    },
    {
      label: "Transaksi Hari Ini",
      value: transactions.filter((item) => isToday(item.createdAt, now)).length,
      detail: "Semua status",
      icon: Wallet,
      iconStyle: "bg-brand-blue/10 text-brand-blue",
      href: "/admin/transaksi?hari=ini",
    },
    {
      label: "Menunggu Pembayaran",
      value: transactions.filter((item) => item.status === "menunggu").length,
      detail: "Belum ada kabar dari gateway",
      icon: Clock3,
      iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
      href: "/admin/transaksi?status=menunggu",
    },
    { label: "Permintaan Refund", value: 0, detail: "Menunggu kebijakan refund (PRD Bagian 12)", icon: Undo2, iconStyle: "bg-muted text-muted-foreground" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-6">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Halo, Admin!</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Ringkasan konten, pengguna, dan transaksi{session?.name ? ` · Masuk sebagai ${session.name}` : ""}.
        </p>
      </header>

      <section aria-labelledby="ringkasan-pengguna">
        <h2 id="ringkasan-pengguna" className="sr-only">Pengguna</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {userCards.map(({ href, ...card }) => (
            <Link key={card.label} href={href} className="rounded-xl transition-shadow hover:shadow-md [&>div]:h-full">
              <RoleStatCard as="div" {...card} />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashboardPanel id="pertumbuhan-pengguna" title="Pertumbuhan Pengguna" description={`Total pengguna, ${GROWTH_WEEKS} minggu terakhir.`}>
          <WeeklyChart kind="area" points={growth} formatValue={(value) => `${formatNumber(value)} pengguna`} formatAxis={formatNumber} label="Pertumbuhan total pengguna per minggu" />
        </DashboardPanel>
        <DashboardPanel
          id="pendapatan-mingguan"
          title="Pendapatan per Minggu"
          description={`Transaksi Berhasil, ${REVENUE_WEEKS} minggu terakhir: ${formatRupiah(revenueTotal)}.`}
        >
          <WeeklyChart
            kind="bar"
            points={revenue}
            formatValue={formatRupiah}
            formatAxis={(value) => (value === 0 ? "0" : `Rp ${compactNumber.format(value)}`)}
            label="Pendapatan transaksi Berhasil per minggu"
          />
        </DashboardPanel>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <DashboardPanel id="ringkasan-status" title="Konten per Status" description="Alur konten dari draf sampai terbit.">
          {/* Layar kecil: baris ringkas (ikon, label, angka di kanan). Layar lebar: lima kotak
              sejajar dengan angka rata bawah walau labelnya dua baris. */}
          <ul className="grid gap-2 sm:grid-cols-5">
            {statusItems.map(({ label, status, icon: Icon, iconStyle }) => (
              <li key={status}>
                <Link
                  href={`/admin/konten?status=${status}`}
                  className="flex h-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 transition-colors hover:bg-accent sm:flex-col sm:items-start sm:gap-0 sm:p-3"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-muted-foreground sm:mt-2 sm:text-xs">{label}</span>
                  <span className="text-lg font-bold tabular-nums sm:mt-auto sm:pt-1 sm:text-xl">{count(status)}</span>
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-semibold">Terbit Terbaru</h3>
          {published.length > 0 ? (
            <ul className="mt-1 divide-y divide-border">
              {published.map((content) => (
                <li key={content.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{content.judul}</p>
                    <p className="text-xs text-muted-foreground">{userName(users, content.authorId)}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatContentDate(content.updatedAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Belum ada konten terbit.</p>
          )}
        </DashboardPanel>

        <DashboardPanel id="perlu-perhatian" title="Perlu Perhatian" description="Hal yang menunggu tindakan Admin.">
          <ul className="-my-1 divide-y divide-border">
            {attention.map((item) => (
              <AttentionRow key={item.label} {...item} />
            ))}
          </ul>
        </DashboardPanel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <DashboardPanel id="sebaran-rank" title="Sebaran Rank" description="Jumlah pengguna di setiap rank.">
          <ul className="space-y-3">
            {RANKS.map((rank, index) => (
              <li key={rank.name} className="flex items-center gap-3 text-sm">
                <RankEmblem rank={rank} variant="compact" size={24} />
                <span className="w-24 shrink-0 font-medium">{rank.name}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <span className="block h-full rounded-full" style={{ width: `${(rankCounts[index] / maxRankCount) * 100}%`, background: rank.color }} />
                </span>
                <span className="w-10 shrink-0 text-right tabular-nums">{formatNumber(rankCounts[index])}</span>
              </li>
            ))}
          </ul>
        </DashboardPanel>

        <DashboardPanel id="aksi-admin-terbaru" title="Aksi Admin Terbaru" description="Lima aksi terakhir di Log Aktivitas Admin.">
          {recentActions.length > 0 ? (
            <ul className="divide-y divide-border">
              {recentActions.map((entry) => (
                <li key={entry.id} className="py-2.5 text-sm first:pt-0">
                  <p className="font-medium">
                    {ACTION_LABELS[entry.action]} · {entry.targetLabel}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {userName(users, entry.adminId)} · {formatDateTime(entry.at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Belum ada aksi Admin" description="Setiap aksi Admin tercatat dan tampil di sini." />
          )}
          <Link href="/admin/log" className="mt-4 inline-flex text-sm font-medium text-primary-accent hover:underline">
            Lihat Log Aktivitas Admin
          </Link>
        </DashboardPanel>
      </div>
    </div>
  );
}
