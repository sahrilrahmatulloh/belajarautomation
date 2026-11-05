import { Announcement, AnnouncementTarget } from "@/types/Announcement";
import { ContentUser } from "@/types/ContentWorkflow";
import { Notification } from "@/types/Notification";

export function announcementMatches(target: AnnouncementTarget, user: Pick<ContentUser, "membership" | "roles">) {
  if (target.type === "semua") return true;
  if (target.type === "membership") return user.membership === target.tier;
  return user.roles.includes(target.role);
}

// Pengumuman terkirim masuk ke sistem notifikasi yang sudah ada, jadi ikut tunduk pada filter mode
// dan preferensi pengguna (PRD 4.4). Pengguna tanpa data repository hanya menerima target semua.
export function announcementsToNotifications(announcements: Announcement[], user: Pick<ContentUser, "membership" | "roles"> | undefined): Notification[] {
  return announcements
    .filter((item) => item.status === "terkirim" && (user ? announcementMatches(item.target, user) : item.target.type === "semua"))
    .map((item) => ({
      id: `pengumuman-${item.id}`,
      group: item.group,
      title: item.title,
      body: item.body,
      href: item.href || undefined,
      createdAt: item.sentAt ?? item.createdAt,
      read: false,
    }));
}
