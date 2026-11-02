"use client";

import { useNotifications } from "@/lib/notifications";

import NotificationItem from "./NotificationItem";
import NotificationsHeader from "./NotificationsHeader";

export default function NotificationsPage() {
  const notifications = useNotifications();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <NotificationsHeader />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Semua Notifikasi</h2>

        <span className="text-sm text-muted-foreground">{unreadCount} belum dibaca</span>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
