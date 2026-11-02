"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Check, Clock3 } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NOTIFICATION_GROUPS } from "@/data/notificationGroups";
import { NotificationEntry, toNotificationEntries } from "@/lib/notificationEntries";
import { resolveNotificationHref } from "@/lib/notificationTarget";
import { formatNotificationTime } from "@/lib/notificationTime";
import { notificationActions, useNotifications } from "@/lib/notifications";
import { Notification } from "@/types/Notification";

import NotificationModal from "./NotificationModal";

const POPOVER_LIMIT = 5;

const bellClassName =
  "relative inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-accent active:scale-95";

function BellIcon({ unreadCount }: { unreadCount: number }) {
  return (
    <>
      <Bell size={20} aria-hidden="true" />
      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </>
  );
}

interface PopoverEntryProps {
  entry: NotificationEntry;
  onClose: () => void;
  onAnnouncement: (notification: Notification) => void;
}

function PopoverEntry({ entry, onClose, onAnnouncement }: PopoverEntryProps) {
  const { icon: Icon, iconStyle } = NOTIFICATION_GROUPS[entry.group];
  const className = `flex w-full gap-3 rounded-xl p-3 text-left transition-colors hover:bg-accent ${
    entry.read ? "" : "bg-primary/[0.06] dark:bg-primary/10"
  }`;
  const content = (
    <>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold leading-snug">{entry.title}</span>
          {!entry.read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary">
              <span className="sr-only">Belum dibaca</span>
            </span>
          )}
        </span>
        <span className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{entry.body}</span>
        <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="h-3 w-3 shrink-0" aria-hidden="true" />
          {formatNotificationTime(entry.createdAt)}
        </span>
      </span>
    </>
  );

  // Notifikasi gabungan dibuka di halaman, dan ditandai dibaca saat isinya diklik di sana.
  if (entry.items.length > 1) {
    return (
      <Link href="/notifications" onClick={onClose} className={className}>
        {content}
      </Link>
    );
  }

  const [notification] = entry.items;
  const href = resolveNotificationHref(notification);
  const markRead = () => notificationActions.markRead([notification.id]);

  return href ? (
    <Link
      href={href}
      onClick={() => {
        markRead();
        onClose();
      }}
      className={className}
    >
      {content}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => {
        markRead();
        onClose();
        onAnnouncement(notification);
      }}
      className={className}
    >
      {content}
    </button>
  );
}

// Desktop: popover tanpa pindah halaman. Mobile: langsung ke halaman notifikasi (PRD 4.4).
export default function NotificationBell() {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<Notification | null>(null);

  const unread = notifications.filter((notification) => !notification.read);
  const entries = useMemo(
    () => toNotificationEntries(notifications).slice(0, POPOVER_LIMIT),
    [notifications]
  );
  const label = unread.length > 0 ? `Notifikasi, ${unread.length} belum dibaca` : "Notifikasi";

  return (
    <>
      <Link href="/notifications" aria-label={label} className={`${bellClassName} md:hidden`}>
        <BellIcon unreadCount={unread.length} />
      </Link>

      <div className="hidden md:block">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger aria-label={label} className={bellClassName}>
            <BellIcon unreadCount={unread.length} />
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            aria-label="Notifikasi"
            className="w-[360px] max-w-[calc(100vw-2rem)] gap-0 p-0"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <h2 className="text-base font-semibold">Notifikasi</h2>
              <button
                type="button"
                disabled={unread.length === 0}
                onClick={() => notificationActions.markRead(unread.map((item) => item.id))}
                className="inline-flex items-center gap-1 rounded text-xs font-medium text-primary enabled:hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Tandai semua dibaca
              </button>
            </div>

            {entries.length > 0 ? (
              <ul className="max-h-[min(36rem,calc(100dvh-10rem))] space-y-1 overflow-y-auto px-2">
                {entries.map((entry) => (
                  <li key={entry.key}>
                    <PopoverEntry entry={entry} onClose={() => setOpen(false)} onAnnouncement={setAnnouncement} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center px-6 py-8 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold">Belum ada notifikasi</p>
                <p className="mt-1 text-xs text-muted-foreground">Kabar terbaru untukmu akan tampil di sini.</p>
              </div>
            )}

            <div className="mt-1 border-t border-border p-2">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
              >
                Lihat semua notifikasi
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <NotificationModal notification={announcement} onClose={() => setAnnouncement(null)} />
    </>
  );
}
