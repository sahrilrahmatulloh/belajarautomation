import Link from "next/link";

import {
  Bell,
  BookOpen,
  FlaskConical,
  Library,
} from "lucide-react";

import { Notification } from "@/types/Notification";

interface NotificationItemProps {
  notification: Notification;
}

const notificationIcons = {
  course: BookOpen,
  playground: FlaskConical,
  book: Library,
  system: Bell,
};

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const Icon =
    notificationIcons[notification.type];

  const content = (
    <div
      className={`flex gap-4 rounded-2xl border border-border p-4 transition-colors hover:bg-accent ${
        !notification.read
          ? "bg-primary/[0.03]"
          : "bg-card"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">
              {notification.title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {notification.description}
            </p>
          </div>

          {!notification.read && (
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
          )}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {notification.time}
        </p>
      </div>
    </div>
  );

  if (notification.href) {
    return (
      <Link href={notification.href}>
        {content}
      </Link>
    );
  }

  return content;
}