"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { NOTIFICATION_GROUPS } from "@/data/notificationGroups";
import { Notification } from "@/types/Notification";

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

// Pengumuman tanpa halaman tujuan, mis. jadwal maintenance (PRD 4.4).
export default function NotificationModal({ notification, onClose }: NotificationModalProps) {
  if (!notification) return null;

  const { icon: Icon, iconStyle } = NOTIFICATION_GROUPS[notification.group];

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
          <div className="flex items-start gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <Dialog.Title className="min-w-0 flex-1 self-center text-lg font-bold leading-snug">
              {notification.title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Tutup"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="mt-4 text-sm leading-6 text-muted-foreground">
            {notification.body}
          </Dialog.Description>

          <Dialog.Close className="mt-5 min-h-10 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
            Mengerti
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
