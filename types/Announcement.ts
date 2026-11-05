import { MembershipTier } from "./Membership";
import { UserRole } from "./Role";

// Pengumuman Admin (PRD FR-16 H dan 7.26).
export type AnnouncementGroup = "content" | "system";

export type AnnouncementStatus = "draf" | "terjadwal" | "terkirim" | "dibatalkan";

export type AnnouncementTarget = { type: "semua" } | { type: "membership"; tier: MembershipTier } | { type: "peran"; role: UserRole };

export interface Announcement {
  id: string;
  title: string;
  body: string;
  // Kosong berarti notifikasi dibuka di modal.
  href: string;
  group: AnnouncementGroup;
  target: AnnouncementTarget;
  status: AnnouncementStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  createdBy: string;
  createdAt: string;
}

export type AnnouncementInput = Pick<Announcement, "title" | "body" | "href" | "group" | "target"> & {
  // Format datetime-local; hanya dipakai saat menjadwalkan.
  scheduledAt: string;
};
