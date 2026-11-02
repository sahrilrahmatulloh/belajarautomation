"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Check, ChevronDown, CircleAlert, X } from "lucide-react";

import FilterChips from "@/components/filters/FilterChips";
import { NOTIFICATION_GROUPS } from "@/data/notificationGroups";
import { toFilterSlug, validFilterValue } from "@/lib/filters";
import { toNotificationEntries } from "@/lib/notificationEntries";
import { UNAVAILABLE_PARAM, UNAVAILABLE_VALUE } from "@/lib/notificationTarget";
import { useNotificationPreferences } from "@/lib/notificationPreferences";
import { formatNotificationDay } from "@/lib/notificationTime";
import { notificationActions, useNotifications } from "@/lib/notifications";
import { useSession } from "@/lib/session";
import { useUrlFilters } from "@/lib/useUrlFilters";
import { Notification, NotificationGroup } from "@/types/Notification";

import NotificationItem from "./NotificationItem";
import NotificationModal from "./NotificationModal";

const FILTER_KEYS = ["tab", "kelompok", UNAVAILABLE_PARAM] as const;
const UNREAD_TAB = "belum-dibaca";
const TAB_OPTIONS = [
  { value: "", label: "Semua" },
  { value: UNREAD_TAB, label: "Belum dibaca" },
];

const GROUP_OPTIONS = (Object.keys(NOTIFICATION_GROUPS) as NotificationGroup[]).map((group) => ({
  group,
  value: toFilterSlug(NOTIFICATION_GROUPS[group].label),
  label: NOTIFICATION_GROUPS[group].label,
}));

export default function NotificationsPage() {
  const router = useRouter();
  const session = useSession();
  const notifications = useNotifications();
  const { mutedGroups } = useNotificationPreferences();
  const { values, setFilters } = useUrlFilters(FILTER_KEYS);
  const [announcement, setAnnouncement] = useState<Notification | null>(null);

  // Kelompok "Khusus role" hanya untuk pengguna dengan role tersebut, dan kelompok
  // yang dimatikan di pengaturan tidak bisa dipilih.
  const groupOptions = GROUP_OPTIONS.filter(
    ({ group }) => (group !== "role" || session?.role !== "user") && !mutedGroups.includes(group)
  );

  const tab = validFilterValue(values.tab, TAB_OPTIONS);
  const groupValue = validFilterValue(values.kelompok, groupOptions);
  const activeGroup = groupOptions.find((option) => option.value === groupValue);
  const unread = notifications.filter((notification) => !notification.read);

  const filtered = notifications.filter(
    (notification) =>
      (!tab || !notification.read) && (!activeGroup || notification.group === activeGroup.group)
  );
  const byDay = new Map<string, ReturnType<typeof toNotificationEntries>>();
  for (const entry of toNotificationEntries(filtered)) {
    const day = formatNotificationDay(entry.createdAt);
    byDay.set(day, [...(byDay.get(day) ?? []), entry]);
  }
  const days = [...byDay];

  const emptyTitle = tab
    ? activeGroup
      ? `Tidak ada yang belum dibaca di ${activeGroup.label}`
      : "Semua notifikasi sudah dibaca"
    : activeGroup
      ? `Belum ada notifikasi ${activeGroup.label}`
      : "Belum ada notifikasi";

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="flex items-start gap-3 sm:items-center sm:gap-4">
        <button
          type="button"
          aria-label="Kembali"
          onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
          className="-ml-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent md:hidden"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground md:flex">
          <Bell className="h-6 w-6" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notifikasi</h1>
          <p className="mt-1 text-sm leading-5 text-muted-foreground sm:text-base">
            Semua kabar tentang progres belajar, konten baru, transaksi, dan akun kamu.
          </p>
        </div>
      </header>

      {values[UNAVAILABLE_PARAM] === UNAVAILABLE_VALUE && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium"
        >
          <CircleAlert className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          <span className="min-w-0 flex-1">Konten ini sudah tidak tersedia</span>
          <button
            type="button"
            aria-label="Tutup pesan"
            onClick={() => setFilters({ [UNAVAILABLE_PARAM]: "" })}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1 basis-56">
          <FilterChips
            label="Status"
            layout="scroll"
            options={TAB_OPTIONS}
            active={tab}
            onChange={(value) => setFilters({ tab: value })}
          />
        </div>

        <div className="relative w-full sm:w-52">
          <select
            aria-label="Filter kelompok"
            value={groupValue}
            onChange={(event) => setFilters({ kelompok: event.target.value })}
            className="h-10 w-full appearance-none rounded-xl border border-input bg-background pl-3 pr-9 text-sm font-medium dark:bg-card"
          >
            <option value="">Semua kelompok</option>
            {groupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <button
          type="button"
          disabled={unread.length === 0}
          onClick={() => notificationActions.markRead(unread.map((item) => item.id))}
          className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Tandai semua dibaca
        </button>
      </div>

      <section aria-label="Daftar notifikasi" className="space-y-5">
        {days.length > 0 ? (
          days.map(([day, entries]) => (
            <div key={day} className="space-y-2.5">
              <h2 className="font-semibold">{day}</h2>
              <div className="space-y-2.5">
                {entries.map((entry) => (
                  <NotificationItem key={entry.key} entry={entry} onAnnouncement={setAnnouncement} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-semibold">{emptyTitle}</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Kabar terbaru untukmu akan tampil di sini.</p>
          </div>
        )}
      </section>

      <NotificationModal notification={announcement} onClose={() => setAnnouncement(null)} />
    </div>
  );
}
