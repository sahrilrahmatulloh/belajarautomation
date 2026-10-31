import Image from "next/image";
import {
  Activity,
  Clock3,
  Crown,
  FileCheck2,
  Inbox,
  Palette,
  Receipt,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import ComingSoonButton from "@/components/roles/ComingSoonButton";
import DashboardPanel from "@/components/roles/DashboardPanel";
import RoleGreeting from "@/components/roles/RoleGreeting";
import RolePreviewNotice from "@/components/roles/RolePreviewNotice";
import RoleStatCard from "@/components/roles/RoleStatCard";
import {
  DUMMY_ADMIN_ACTIVITY,
  DUMMY_ADMIN_STATS,
  DUMMY_RECENT_USERS,
  DUMMY_ROLE_DISTRIBUTION,
} from "@/data/dummy/admin";
import { ROLE_LABELS } from "@/data/navigation";
import { DEFAULT_AVATAR } from "@/data/profile";
import { formatDate, formatNumber } from "@/lib/format";
import { UserRole } from "@/types/Role";

const stats = [
  {
    label: "Total Pengguna",
    value: DUMMY_ADMIN_STATS.totalUsers,
    detail: "Semua role",
    icon: Users,
    iconStyle: "bg-brand-blue/10 text-brand-blue",
  },
  {
    label: "Pengguna Premium",
    value: DUMMY_ADMIN_STATS.premiumUsers,
    detail: "Premium Lifetime",
    icon: Crown,
    iconStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
  {
    label: "Konten Terbit",
    value: DUMMY_ADMIN_STATS.publishedContent,
    detail: "Materi, modul, soal, artikel",
    icon: FileCheck2,
    iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  {
    label: "Menunggu Review",
    value: DUMMY_ADMIN_STATS.pendingReview,
    detail: "Di antrean reviewer",
    icon: Inbox,
    iconStyle: "bg-brand-sky/10 text-brand-sky",
  },
  {
    label: "Transaksi Bulan Ini",
    value: DUMMY_ADMIN_STATS.transactionsThisMonth,
    detail: "Pembayaran berhasil",
    icon: Wallet,
    iconStyle: "bg-brand-indigo/10 text-brand-indigo",
  },
  {
    label: "Transaksi Pending",
    value: DUMMY_ADMIN_STATS.pendingTransactions,
    detail: "Menunggu konfirmasi",
    icon: Clock3,
    iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
];

const roleOrder: UserRole[] = ["user", "creator", "reviewer", "admin"];

const roleBarStyles: Record<UserRole, string> = {
  user: "bg-brand-blue",
  creator: "bg-brand-sky",
  reviewer: "bg-brand-cyan",
  admin: "bg-brand-indigo",
};

const shortcuts = [
  { label: "Kelola Pengguna", icon: Users },
  { label: "Kelola Paket Premium", icon: Crown },
  { label: "Kelola Skin", icon: Palette },
  { label: "Lihat Transaksi", icon: Receipt },
];

export default function AdminDashboard() {
  const totalByRole = roleOrder.reduce(
    (sum, role) => sum + DUMMY_ROLE_DISTRIBUTION[role],
    0
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-5 lg:space-y-6">
      <RolePreviewNotice />

      <RoleGreeting
        title="Halo, Admin!"
        description="Pantau pengguna, konten, dan transaksi untuk menjaga kondisi platform tetap sehat."
        icon={ShieldCheck}
      />

      <section aria-label="Statistik platform" className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
        {stats.map((stat) => (
          <RoleStatCard
            key={stat.label}
            {...stat}
            value={formatNumber(stat.value)}
          />
        ))}
      </section>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:gap-6">
        <DashboardPanel
          id="admin-role-distribution"
          title="Distribusi Role"
          description={`${formatNumber(totalByRole)} akun terdaftar`}
        >
          {totalByRole > 0 ? (
            <ul className="space-y-4">
              {roleOrder.map((role) => {
                const count = DUMMY_ROLE_DISTRIBUTION[role];
                const percent = (count / totalByRole) * 100;

                return (
                  <li key={role}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{ROLE_LABELS[role]}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatNumber(count)}
                      </span>
                    </div>
                    <div
                      className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`Persentase ${ROLE_LABELS[role]}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(percent)}
                    >
                      {/* Lebar minimum agar role dengan jumlah kecil tetap terlihat */}
                      <div
                        className={`h-full rounded-full ${roleBarStyles[role]}`}
                        style={{ width: `${Math.max(percent, 1.5)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={Users}
              title="Belum ada pengguna"
              description="Distribusi role akan tampil setelah ada akun terdaftar."
            />
          )}
        </DashboardPanel>

        <DashboardPanel
          id="admin-shortcuts"
          title="Pintasan Pengelolaan"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;

              return (
                <ComingSoonButton
                  key={shortcut.label}
                  label={shortcut.label}
                  icon={<Icon className="h-4 w-4" aria-hidden="true" />}
                  variant="outline"
                />
              );
            })}
          </div>
        </DashboardPanel>
      </div>

      <div className="grid min-w-0 gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <DashboardPanel
          id="admin-recent-users"
          title="Pengguna Terbaru"
        >
          {DUMMY_RECENT_USERS.length > 0 ? (
            <div className="relative -mx-4 overflow-x-auto sm:-mx-5">
              <table className="w-full min-w-[560px] text-left text-sm">
                <caption className="sr-only">
                  Pengguna yang baru bergabung beserta role dan status Premium
                </caption>
                <thead className="border-y border-border bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Pengguna</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Role</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Premium</th>
                    <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Bergabung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DUMMY_RECENT_USERS.map((user) => (
                    <tr key={user.id}>
                      <th scope="row" className="px-4 py-3 font-normal sm:px-5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={DEFAULT_AVATAR}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 shrink-0 rounded-full"
                          />
                          <div className="min-w-0">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.maskedEmail}</p>
                          </div>
                        </div>
                      </th>
                      <td className="px-3 py-3">{ROLE_LABELS[user.role]}</td>
                      <td className="px-3 py-3">
                        {user.isPremium ? (
                          <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                            Premium
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Gratis</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-5">
                        {formatDate(user.joinedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Belum ada pengguna baru"
              description="Pengguna yang baru mendaftar akan muncul di sini."
            />
          )}
        </DashboardPanel>

        <DashboardPanel
          id="admin-activity"
          title="Log Aktivitas Terbaru"
        >
          {DUMMY_ADMIN_ACTIVITY.length > 0 ? (
            <ol className="space-y-4">
              {DUMMY_ADMIN_ACTIVITY.map((log) => (
                <li key={log.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm leading-6">{log.message}</p>
                    <p className="text-xs text-muted-foreground">{log.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              icon={Activity}
              title="Belum ada aktivitas"
              description="Aktivitas pengguna, konten, dan transaksi akan tercatat di sini."
            />
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}
