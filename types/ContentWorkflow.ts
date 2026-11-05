import { MembershipTier } from "./Membership";
import { UserRole } from "./Role";

// Alur penerbitan konten (PRD FR-15).
export type ContentStatusId = "draf" | "menunggu-review" | "perlu-revisi" | "disetujui" | "terbit";

export type ContentKind = "artikel" | "lesson" | "soal";

export type ContentCta = { type: "course" | "practice"; slug: string };

export interface ContentSource {
  title: string;
  url: string;
}

export interface ContentVideo {
  id: string;
  judul: string;
  channel: string;
  durasi: string;
  bahasa: string;
  embed: boolean;
  // Hanya terlihat oleh Reviewer.
  alasan: string;
}

// Isi konten dalam format dokumen editor (ProseMirror JSON).
export interface ContentNode {
  type: string;
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: ContentNode[];
}

export interface ContentItem {
  id: string;
  type: ContentKind;
  judul: string;
  ringkasan: string;
  kategori: string;
  sampul: string;
  ajakan: ContentCta | null;
  sumber: ContentSource[];
  body: ContentNode;
  videos: ContentVideo[];
  authorId: string;
  reviewerId: string | null;
  status: ContentStatusId;
  submissionCount: number;
  // Konten terbit yang direvisi lewat salinan ini.
  revisionOf: string | null;
  // Alamat halaman publik untuk konten terbit. Di tahap dummy hanya simulasi.
  publicPath: string | null;
  // Tanggal kiriman terakhir, untuk menghitung lama menunggu.
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ReviewNoteKind = "umum" | "bagian" | "video";

export interface ReviewNote {
  id: string;
  contentId: string;
  kind: ReviewNoteKind;
  // Id heading untuk catatan bagian, id video untuk catatan video.
  anchor: string | null;
  isi: string;
  reviewerId: string;
  // Kiriman ke berapa saat catatan dibuat.
  round: number;
  // Catatan baru terlihat Creator setelah Reviewer meminta revisi.
  released: boolean;
  creatorReply: string;
  markedFixed: boolean;
  // Seluruh catatan selesai saat Reviewer menyetujui konten (PRD FR-15).
  resolved: boolean;
  createdAt: string;
}

export type StatusAction =
  | "buat"
  | "kirim"
  | "kirim-ulang"
  | "tarik-kembali"
  | "ambil"
  | "tugaskan"
  | "minta-revisi"
  | "setujui"
  | "terbitkan"
  | "tarik-website"
  | "buat-revisi";

export interface StatusEvent {
  id: string;
  contentId: string;
  action: StatusAction;
  from: ContentStatusId | null;
  to: ContentStatusId;
  actorId: string;
  // Reviewer yang ditugaskan.
  targetUserId: string | null;
  alasan: string | null;
  at: string;
}

export type RoleChangeAction = "tambah" | "cabut";

export interface RoleChangeEvent {
  id: string;
  userId: string;
  role: UserRole;
  action: RoleChangeAction;
  actorId: string;
  at: string;
}

export type AccountStatus = "aktif" | "nonaktif";

export interface ContentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  roles: UserRole[];
  status: AccountStatus;
  membership: MembershipTier;
  joinedAt: string;
  lastActiveAt: string;
  // Ringkasan belajar. Rank dihitung dari XP, tidak disimpan.
  xp: number;
  coursesStudied: number;
  hiddenFromLeaderboard: boolean;
}

// Catatan setiap aksi Admin (PRD 7.23). Tidak dapat diubah atau dihapus.
export type AdminAction =
  | "tugaskan-reviewer"
  | "terbitkan"
  | "tarik-website"
  | "tambah-peran"
  | "cabut-peran"
  | "nonaktifkan-akun"
  | "aktifkan-akun"
  | "catat-kesepakatan"
  | "refund"
  | "berikan-akses"
  | "cabut-akses"
  | "tambah-produk"
  | "ubah-produk"
  | "ubah-katalog"
  | "abaikan-moderasi"
  | "koreksi-xp"
  | "sembunyikan-leaderboard"
  | "tampilkan-leaderboard";

export interface AdminAuditLog {
  id: string;
  at: string;
  adminId: string;
  action: AdminAction;
  targetType: "konten" | "pengguna" | "transaksi" | "produk" | "katalog";
  targetId: string;
  targetLabel: string;
  alasan: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
}

// Kesepakatan tertulis Creator (PRD 7.24). Pembaruan menambah catatan baru.
export interface CreatorAgreement {
  id: string;
  userId: string;
  tanggal: string;
  dokumen: string;
  recordedBy: string;
  recordedAt: string;
}

export type ContentDraftInput = Partial<
  Pick<ContentItem, "judul" | "ringkasan" | "kategori" | "sampul" | "ajakan" | "sumber" | "body" | "videos">
>;
