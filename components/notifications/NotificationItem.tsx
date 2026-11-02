"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Clock3 } from "lucide-react";

import { NOTIFICATION_GROUPS } from "@/data/notificationGroups";
import { NotificationEntry } from "@/lib/notificationEntries";
import { formatNotificationTime } from "@/lib/notificationTime";
import { resolveNotificationHref } from "@/lib/notificationTarget";
import { notificationActions } from "@/lib/notifications";
import { Notification } from "@/types/Notification";

const rowClassName = "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-accent sm:gap-4 sm:p-4";

interface RowContentProps {
  group: Notification["group"];
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  arrow: ReactNode;
}

function RowContent({ group, title, body, createdAt, read, arrow }: RowContentProps) {
  const { icon: Icon, iconStyle } = NOTIFICATION_GROUPS[group];
  const time = formatNotificationTime(createdAt);

  return (
    <>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconStyle}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug">{title}</span>
        <span className="mt-0.5 block text-sm leading-5 text-muted-foreground">{body}</span>
        <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
          <Clock3 className="h-3 w-3 shrink-0" aria-hidden="true" />
          {time}
        </span>
      </span>

      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{time}</span>

      <span className="flex shrink-0 items-center gap-2">
        {!read && (
          <span className="h-2 w-2 rounded-full bg-primary">
            <span className="sr-only">Belum dibaca</span>
          </span>
        )}
        {arrow}
      </span>
    </>
  );
}

interface NotificationRowProps {
  notification: Notification;
  onAnnouncement: (notification: Notification) => void;
}

function NotificationRow({ notification, onAnnouncement }: NotificationRowProps) {
  const content = (
    <RowContent
      group={notification.group}
      title={notification.title}
      body={notification.body}
      createdAt={notification.createdAt}
      read={notification.read}
      arrow={<ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
    />
  );
  const markRead = () => notificationActions.markRead([notification.id]);
  const href = resolveNotificationHref(notification);

  return href ? (
    <Link href={href} onClick={markRead} className={rowClassName}>
      {content}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => {
        markRead();
        onAnnouncement(notification);
      }}
      className={rowClassName}
    >
      {content}
    </button>
  );
}

interface NotificationItemProps {
  entry: NotificationEntry;
  onAnnouncement: (notification: Notification) => void;
}

export default function NotificationItem({ entry, onAnnouncement }: NotificationItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isMerged = entry.items.length > 1;

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-border ${entry.read ? "bg-card" : "bg-primary/[0.06] dark:bg-primary/10"}`}
    >
      {isMerged ? (
        <>
          {/* Membuka gabungan tidak menandai dibaca: tiap isinya ditandai saat diklik. */}
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className={rowClassName}
          >
            <RowContent
              group={entry.group}
              title={entry.title}
              body={entry.body}
              createdAt={entry.createdAt}
              read={entry.read}
              arrow={
                expanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )
              }
            />
          </button>

          {expanded && (
            <ul className="divide-y divide-border border-t border-border bg-card">
              {entry.items.map((item) => (
                <li key={item.id}>
                  <NotificationRow notification={item} onAnnouncement={onAnnouncement} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <NotificationRow notification={entry.items[0]} onAnnouncement={onAnnouncement} />
      )}
    </article>
  );
}
