import { CourseAccess, CourseAvailability, CourseContentStatus } from "./Course";

// Katalog Belajar dan Moderasi (PRD FR-16 D dan G, 7.25).
export interface CourseCatalogState {
  availability: CourseAvailability;
  contentStatus: CourseContentStatus;
  access: CourseAccess;
}

export type CatalogOverride = Partial<CourseCatalogState>;

export type CatalogItemKind = "roadmap" | "latihan";

export type CatalogItemStatus = "aktif" | "nonaktif";

export interface PlatformOverrides {
  courses: Record<string, CatalogOverride>;
  // Kunci: "<jenis>:<id>".
  items: Record<string, CatalogItemStatus>;
}

export type ModerationReason = "lonjakan-xp" | "lesson-terlalu-cepat";

export type ModerationFlagStatus = "terbuka" | "diabaikan" | "ditangani";

export interface ModerationFlag {
  id: string;
  userId: string;
  reason: ModerationReason;
  detail: string;
  status: ModerationFlagStatus;
  createdAt: string;
}

export type ModerationActionKind = "abaikan" | "koreksi-xp" | "sembunyikan" | "tampilkan";

// Riwayat tindakan moderasi per akun.
export interface ModerationAction {
  id: string;
  userId: string;
  flagId: string | null;
  kind: ModerationActionKind;
  alasan: string | null;
  actorId: string;
  at: string;
}

// Koreksi XP dicatat sebagai transaksi baru, bukan mengubah riwayat (PRD FR-16 D).
export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  kind: "koreksi";
  alasan: string;
  actorId: string;
  at: string;
}
