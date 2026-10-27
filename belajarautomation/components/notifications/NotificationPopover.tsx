"use client";

import { Bell, BookOpen, CheckCheck, Trophy } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const notifications = [
  {
    id: 1,
    icon: BookOpen,
    title: "Materi baru tersedia",
    description: "Playwright Advanced sudah bisa dipelajari.",
    time: "2 jam lalu",
    unread: true,
  },
  {
    id: 2,
    icon: Trophy,
    title: "Progress mingguan",
    description: "Kamu sudah belajar selama 5 hari minggu ini.",
    time: "5 jam lalu",
    unread: true,
  },
  {
    id: 3,
    icon: CheckCheck,
    title: "Lesson selesai",
    description: "CSS Selector berhasil kamu selesaikan.",
    time: "1 hari lalu",
    unread: false,
  },
];

export default function NotificationPopover() {
  const hasUnread = notifications.some(
    (notification) => notification.unread
  );

  return (
    <Popover>
      <PopoverTrigger
        className="relative rounded-lg p-2 transition-colors hover:bg-accent"
        aria-label="Notifikasi"
      >
        <Bell size={20} />

        {hasUnread && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[360px] p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="font-semibold">
              Notifikasi
            </h3>

            <p className="text-xs text-muted-foreground">
              2 notifikasi belum dibaca
            </p>
          </div>

          <button
            type="button"
            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Tandai dibaca
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notification.icon;

            return (
              <button
                key={notification.id}
                type="button"
                className="flex w-full gap-3 border-b border-border p-4 text-left transition-colors last:border-b-0 hover:bg-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">
                      {notification.title}
                    </p>

                    {notification.unread && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {notification.description}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <button
            type="button"
            className="w-full rounded-lg py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-accent dark:text-blue-400"
          >
            Lihat semua notifikasi
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}