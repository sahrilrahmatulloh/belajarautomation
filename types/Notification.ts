import { UserRole } from "./Role";

export type NotificationGroup = "progress" | "content" | "transaction" | "system" | "role";

export interface Notification {
  id: string;
  group: NotificationGroup;
  // Hanya untuk notifikasi khusus role.
  role?: UserRole;
  title: string;
  body: string;
  // Kosong berarti pengumuman yang dibuka di modal.
  href?: string;
  // Format ISO.
  createdAt: string;
  read: boolean;
}
