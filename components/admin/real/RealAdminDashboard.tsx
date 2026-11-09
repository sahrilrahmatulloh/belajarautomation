"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Crown,
  FilePen,
  FlaskConical,
  Hourglass,
  Inbox,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Undo2,
  UserPlus,
  Users,
  UserRoundX,
  Wallet,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import RankEmblem from "@/components/common/RankEmblem";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleGreeting from "@/components/roles/RoleGreeting";
import RoleStatCard from "@/components/roles/RoleStatCard";
import { ADMIN_DASHBOARD_SAMPLE } from "@/data/dummy/adminDashboard";
import { RANKS } from "@/data/ranks";
import { ADMIN_ACTION_LABEL, AdminDashboardStats, adminApi } from "@/lib/adminApi";
import { formatNumber } from "@/lib/format";
import { useSession } from "@/lib/session";

// Dashboard Admin untuk akun sungguhan (PRD FR-16 A). Pengguna, membership, rank, dan aksi Admin
// memakai data asli dari database. Konten dan transaksi belum punya backend, jadi memakai angka
// contoh berlabel "Data contoh" (data/dummy/adminDashboard.ts, keputusan pemilik).

const sample = ADMIN_DASHBOARD_SAMPLE;

function SampleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
      <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
      Data contoh
    </span>
  );
}

function SectionTitle({ id, title, sample: isSample = false }: { id: string; title: string; sample?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 id={id} className="text-lg font-bold">{title}</h2>
      {isSample && <SampleBadge />}
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function RealAdminDashboard() {
  const session = useSession();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminApi.dashboardStats(RANKS.map((rank) => rank.minXp)).then((result) => {
      if (!active) return;
      if (result.ok) setStats(result.data);
      else setError(result.message);
    });
    return () => {
      active = false;
    };
  }, []);

  const value = (n: number | undefined) => (stats ? formatNumber(n ?? 0) : "…");
  const maxRankCount = Math.max(1, ...(stats?.rank_counts ?? [0]));

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-5 lg:space-y-6">
      <RoleGreeting
        title="Halo, Admin!"
        description="Pantau pengguna, membership, dan alur konten. Angka bertanda Data contoh belum berasal dari database."
        icon={ShieldCheck}
        meta={`Masuk sebagai ${session?.name ?? ""}`}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</p>
      )}

      <section aria-labelledby="dashboard-pengguna">
        <SectionTitle id="dashboard-pengguna" title="Pengguna" />
        <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Link href="/admin/pengguna" className="rounded-xl transition-shadow hover:shadow-md">
            <RoleStatCard as="div" label="Total Pengguna" value={value(stats?.total_users)} detail={`${value(stats?.active_users)} akun aktif`} icon={Users} iconStyle="bg-brand-blue/10 text-brand-blue" />
          </Link>
          <Link href="/admin/pengguna" className="rounded-xl transition-shadow hover:shadow-md">
            <RoleStatCard as="div" label="Pengguna Baru 7 Hari" value={value(stats?.new_users_7d)} detail="Mendaftar 7 hari terakhir" icon={UserPlus} iconStyle="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" />
          </Link>
          <Link href="/admin/pengguna" className="rounded-xl transition-shadow hover:shadow-md">
            <RoleStatCard
              as="div"
              label="Membership Aktif"
              value={value(stats ? stats.memberships.pro + stats.memberships.premium : undefined)}
              detail={`${value(stats?.memberships.premium)} Premium · ${value(stats?.memberships.pro)} Pro`}
              icon={Crown}
              iconStyle="bg-amber-500/10 text-amber-600 dark:text-amber-300"
            />
          </Link>
          <RoleStatCard label="Total XP Terkumpul" value={value(stats?.total_xp)} detail="Dari semua pengguna" icon={Sparkles} iconStyle="bg-violet-500/10 text-violet-600 dark:text-violet-300" />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <DashboardPanel id="dashboard-rank" title="Sebaran Rank" description="Jumlah pengguna di setiap rank.">
          <ul className="space-y-2.5">
            {RANKS.map((rank, index) => {
              const count = stats?.rank_counts[index] ?? 0;
              return (
                <li key={rank.name} className="flex items-center gap-3 text-sm">
                  <RankEmblem rank={rank} variant="compact" size={24} />
                  <span className="w-24 shrink-0 font-medium">{rank.name}</span>
                  <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span className="block h-full rounded-full" style={{ width: `${(count / maxRankCount) * 100}%`, background: rank.color }} />
                  </span>
                  <span className="w-10 shrink-0 text-right font-semibold tabular-nums">{stats ? formatNumber(count) : "…"}</span>
                </li>
              );
            })}
          </ul>
        </DashboardPanel>

        <DashboardPanel id="dashboard-aksi" title="Aksi Admin Terbaru" description="Lima aksi terakhir yang tercatat di log.">
          {stats && stats.recent_actions.length === 0 ? (
            <EmptyState title="Belum ada aksi Admin" description="Koreksi XP dan pemberian membership akan tercatat di sini." />
          ) : (
            <ul className="divide-y divide-border">
              {(stats?.recent_actions ?? []).map((item) => (
                <li key={`${item.created_at}-${item.action}`} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5 text-sm first:pt-0 last:pb-0">
                  <span className="min-w-0">
                    <span className="font-semibold">{ADMIN_ACTION_LABEL[item.action] ?? item.action}</span>
                    {item.target_name && <span className="text-muted-foreground"> · {item.target_name}</span>}
                    {item.reason && <span className="mt-0.5 block text-xs text-muted-foreground">{item.reason}</span>}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatTime(item.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardPanel>
      </div>

      <section aria-labelledby="dashboard-konten">
        <SectionTitle id="dashboard-konten" title="Konten per Status" sample />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
          <RoleStatCard label="Draf" value={String(sample.contentByStatus.draf)} detail="Masih di tangan Creator" icon={FilePen} iconStyle="bg-muted text-muted-foreground" />
          <RoleStatCard label="Menunggu Review" value={String(sample.contentByStatus.menungguReview)} detail="Di antrean Reviewer" icon={Inbox} iconStyle="bg-amber-500/10 text-amber-600 dark:text-amber-300" />
          <RoleStatCard label="Perlu Revisi" value={String(sample.contentByStatus.perluRevisi)} detail="Ada catatan dari Reviewer" icon={RotateCcw} iconStyle="bg-rose-500/10 text-rose-600 dark:text-rose-300" />
          <RoleStatCard label="Disetujui" value={String(sample.contentByStatus.disetujui)} detail="Siap diterbitkan" icon={BadgeCheck} iconStyle="bg-sky-500/10 text-sky-700 dark:text-sky-300" />
          <RoleStatCard label="Terbit" value={String(sample.contentByStatus.terbit)} detail="Sudah tayang" icon={CheckCircle2} iconStyle="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <section aria-labelledby="dashboard-perhatian">
          <SectionTitle id="dashboard-perhatian" title="Perlu Perhatian" sample />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <RoleStatCard label="Belum Ditugaskan" value={String(sample.unassignedReview)} detail="Menunggu Review tanpa Reviewer" icon={UserRoundX} iconStyle="bg-brand-blue/10 text-brand-blue" />
            <RoleStatCard label="Menunggu Lebih dari 3 Hari" value={String(sample.longWaitingReview)} detail="Review yang perlu dipercepat" icon={Hourglass} iconStyle="bg-rose-500/10 text-rose-600 dark:text-rose-300" />
          </div>
        </section>

        <section aria-labelledby="dashboard-transaksi">
          <SectionTitle id="dashboard-transaksi" title="Transaksi" sample />
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <RoleStatCard label="Hari Ini" value={String(sample.transactionsToday)} detail="Semua status" icon={Wallet} iconStyle="bg-brand-blue/10 text-brand-blue" />
            <RoleStatCard label="Menunggu Bayar" value={String(sample.pendingPayments)} detail="Belum ada kabar gateway" icon={Clock3} iconStyle="bg-amber-500/10 text-amber-600 dark:text-amber-300" />
            <RoleStatCard label="Refund" value={String(sample.refundRequests)} detail="Permintaan masuk" icon={Undo2} iconStyle="bg-rose-500/10 text-rose-600 dark:text-rose-300" />
          </div>
        </section>
      </div>
    </div>
  );
}
