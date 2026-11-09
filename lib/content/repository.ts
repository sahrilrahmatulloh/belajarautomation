import {
  AccountStatus,
  AdminAuditLog,
  ContentDraftInput,
  ContentItem,
  ContentUser,
  CreatorAgreement,
  ReviewNote,
  ReviewNoteKind,
  RoleChangeAction,
  RoleChangeEvent,
  StatusEvent,
} from "@/types/ContentWorkflow";
import { Announcement, AnnouncementInput } from "@/types/Announcement";
import { CreditClaim, Entitlement, EntitlementKind, GatewayResult, Product, ProductInput, Transaction } from "@/types/Commerce";
import { CatalogItemKind, CatalogItemStatus, CourseCatalogState, ModerationAction, ModerationFlag, PlatformOverrides, XpTransaction } from "@/types/AdminPlatform";
import { MaintenanceInput, MaintenanceSimulation, MaintenanceWindow } from "@/types/Maintenance";
import { UserRole } from "@/types/Role";

// Pelanggaran aturan alur konten atau peran. Pesannya aman ditampilkan ke pengguna.
export class ContentRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentRuleError";
  }
}

// Satu pintu akses data konten (PRD FR-15). Halaman hanya memanggil antarmuka ini, jadi
// implementasi dummy nantinya cukup diganti Supabase tanpa mengubah komponen. Aturan alur
// status dan peran ditegakkan di sini, bukan hanya disembunyikan di tampilan. Semua operasi
// async karena implementasi akhirnya memanggil jaringan.
export interface ContentRepository {
  // Dipanggil setiap kali data berubah. Mengembalikan fungsi untuk berhenti berlangganan.
  subscribe(listener: () => void): () => void;

  listUsers(): Promise<ContentUser[]>;
  listContents(): Promise<ContentItem[]>;
  getContent(contentId: string): Promise<ContentItem | null>;
  listNotes(contentId: string): Promise<ReviewNote[]>;
  listAllNotes(): Promise<ReviewNote[]>;
  listStatusEvents(contentId?: string): Promise<StatusEvent[]>;
  listRoleEvents(): Promise<RoleChangeEvent[]>;
  listAgreements(): Promise<CreatorAgreement[]>;
  listTransactions(): Promise<Transaction[]>;
  listEntitlements(): Promise<Entitlement[]>;
  listClaims(): Promise<CreditClaim[]>;
  listProducts(): Promise<Product[]>;
  getPlatformOverrides(): Promise<PlatformOverrides>;
  listModerationFlags(): Promise<ModerationFlag[]>;
  listModerationActions(): Promise<ModerationAction[]>;
  listXpTransactions(): Promise<XpTransaction[]>;
  listAnnouncements(): Promise<Announcement[]>;
  listMaintenance(): Promise<MaintenanceWindow[]>;
  // Log hanya bisa dibaca: tidak ada operasi untuk mengubah atau menghapusnya (PRD FR-16 J).
  listAuditLog(): Promise<AdminAuditLog[]>;

  // Creator
  createDraft(actorId: string, input: ContentDraftInput): Promise<ContentItem>;
  updateDraft(actorId: string, contentId: string, input: ContentDraftInput): Promise<ContentItem>;
  deleteDraft(actorId: string, contentId: string): Promise<void>;
  submitForReview(actorId: string, contentId: string, checklist: string[]): Promise<ContentItem>;
  withdraw(actorId: string, contentId: string): Promise<ContentItem>;
  resubmit(actorId: string, contentId: string): Promise<ContentItem>;
  replyToNote(actorId: string, noteId: string, reply: string): Promise<ReviewNote>;
  setNoteFixed(actorId: string, noteId: string, fixed: boolean): Promise<ReviewNote>;
  createRevision(actorId: string, contentId: string): Promise<ContentItem>;

  // Reviewer
  claimReview(actorId: string, contentId: string): Promise<ContentItem>;
  addNote(
    actorId: string,
    contentId: string,
    note: { kind: ReviewNoteKind; anchor: string | null; isi: string }
  ): Promise<ReviewNote>;
  removeNote(actorId: string, noteId: string): Promise<void>;
  requestRevision(actorId: string, contentId: string): Promise<ContentItem>;
  approve(actorId: string, contentId: string, checklist: string[]): Promise<ContentItem>;

  // Admin
  assignReviewer(actorId: string, contentId: string, reviewerId: string): Promise<ContentItem>;
  publish(actorId: string, contentId: string): Promise<ContentItem>;
  takedown(actorId: string, contentId: string, alasan: string): Promise<ContentItem>;
  setRole(actorId: string, userId: string, role: UserRole, action: RoleChangeAction, alasan: string): Promise<ContentUser>;
  setAccountStatus(actorId: string, userId: string, status: AccountStatus, alasan: string): Promise<ContentUser>;
  recordAgreement(actorId: string, userId: string, agreement: { tanggal: string; dokumen: string }): Promise<CreatorAgreement>;

  // Transaksi dan hak akses. Tidak ada operasi Admin untuk mengubah status pembayaran: refund
  // adalah satu-satunya aksi Admin, dan hanya dari status Berhasil (PRD FR-16 E).
  refundTransaction(actorId: string, transactionId: string, alasan: string): Promise<Transaction>;
  grantEntitlement(actorId: string, userId: string, item: { kind: EntitlementKind; itemId: string }, alasan: string): Promise<Entitlement>;
  revokeEntitlement(actorId: string, entitlementId: string, alasan: string): Promise<Entitlement>;
  saveProduct(actorId: string, productId: string | null, input: ProductInput, alasan: string): Promise<Product>;
  // Meniru kabar dari payment gateway. Hanya untuk tahap dummy; bukan aksi Admin.
  simulateGateway(transactionId: string, status: GatewayResult): Promise<Transaction>;

  // Katalog Belajar: simulasi, sumber kebenaran tetap file data (PRD FR-16 G).
  updateCourseCatalog(actorId: string, courseSlug: string, change: CourseCatalogState, alasan: string): Promise<CourseCatalogState>;
  setCatalogItemStatus(actorId: string, kind: CatalogItemKind, itemId: string, status: CatalogItemStatus, alasan: string): Promise<void>;

  // Moderasi (PRD FR-16 D).
  ignoreFlag(actorId: string, flagId: string): Promise<ModerationFlag>;
  correctXp(actorId: string, userId: string, amount: number, alasan: string, flagId: string | null): Promise<ContentUser>;
  setLeaderboardVisibility(actorId: string, userId: string, visible: boolean, alasan: string, flagId: string | null): Promise<ContentUser>;

  // Pengumuman (PRD FR-16 H).
  saveAnnouncement(actorId: string, announcementId: string | null, input: AnnouncementInput, mode: "draf" | "kirim" | "jadwal"): Promise<Announcement>;
  cancelAnnouncement(actorId: string, announcementId: string): Promise<Announcement>;
  // Meniru penjadwal di server. Hanya untuk tahap dummy; mengirim semua yang terjadwal.
  processScheduledAnnouncements(): Promise<number>;

  // Mode Maintenance (PRD FR-16 K). Hanya satu jadwal yang berjalan pada satu waktu.
  saveMaintenance(actorId: string, windowId: string | null, input: MaintenanceInput, alasan: string): Promise<MaintenanceWindow>;
  cancelMaintenance(actorId: string, windowId: string, alasan: string): Promise<MaintenanceWindow>;
  endMaintenance(actorId: string, windowId: string, alasan: string): Promise<MaintenanceWindow>;
  // Meniru waktu yang berjalan. Hanya untuk tahap dummy; bukan aksi Admin.
  simulateMaintenance(windowId: string, target: MaintenanceSimulation): Promise<MaintenanceWindow>;

  // Mengembalikan data ke kondisi awal. Hanya untuk tahap dummy.
  reset(): Promise<void>;
}
