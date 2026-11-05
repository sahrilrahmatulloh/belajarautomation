import { createDummyContentState, DummyContentState } from "@/data/dummy/contents";
import {
  AdminAuditLog,
  ContentDraftInput,
  ContentItem,
  ContentStatusId,
  ContentUser,
  CreatorAgreement,
  ReviewNote,
  StatusAction,
} from "@/types/ContentWorkflow";
import { DUMMY_LEARNING_PROGRESS } from "@/data/dummy/learningProgress";
import { isAvailableHref } from "@/lib/notificationTarget";
import { ModerationActionKind } from "@/types/AdminPlatform";
import { Announcement } from "@/types/Announcement";
import { Entitlement, EntitlementKind, Product } from "@/types/Commerce";

import { courseCatalogState, freeXpTotal, isRequiredFree, MASTER_XP } from "./catalogRules";
import { ContentRepository, ContentRuleError } from "./repository";
import { CREATOR_CHECKLIST, latestRoundNotes, MAX_VIDEOS, missingRequiredFields, REVIEWER_CHECKLIST } from "./rules";

// Versi di nama kunci: data lama dengan bentuk berbeda tidak ikut terbaca.
const STORAGE_KEY = "belajarautomation-content-workflow-v5";

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function browserStorage(): KeyValueStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

const EMPTY_BODY = { type: "doc", content: [{ type: "paragraph" }] };

// Implementasi dummy: state di localStorage. Diganti implementasi Supabase saat backend siap.
export function createDummyRepository(storage: KeyValueStorage | null = browserStorage()): ContentRepository {
  let cache: DummyContentState | null = null;
  const listeners = new Set<() => void>();

  const state = (): DummyContentState => {
    if (cache) return cache;
    try {
      const stored = storage?.getItem(STORAGE_KEY);
      if (stored) cache = JSON.parse(stored) as DummyContentState;
    } catch {
      // Data rusak atau penyimpanan tidak tersedia; memakai data awal.
    }
    cache ??= createDummyContentState();
    return cache;
  };

  const commit = () => {
    let isFull = false;
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      // Penyimpanan yang tidak tersedia cukup bertahan di memori; yang penuh perlu diketahui pengguna.
      isFull = error instanceof DOMException && error.name === "QuotaExceededError";
    }
    listeners.forEach((listener) => listener());
    if (isFull) throw new ContentRuleError("Penyimpanan browser penuh. Perubahan terakhir akan hilang saat halaman dimuat ulang. Reset data dummy atau hapus sebagian gambar.");
  };

  const newId = (prefix: string) => {
    const current = state();
    current.nextId += 1;
    return `${prefix}-${current.nextId}`;
  };

  const now = () => new Date().toISOString();

  const user = (userId: string): ContentUser => {
    const found = state().users.find((item) => item.id === userId);
    if (!found) throw new ContentRuleError("Pengguna tidak ditemukan.");
    return found;
  };

  const requireRole = (userId: string, role: "creator" | "reviewer" | "admin", label: string) => {
    if (!user(userId).roles.includes(role)) throw new ContentRuleError(`Hanya ${label} yang dapat melakukan tindakan ini.`);
  };

  const content = (contentId: string): ContentItem => {
    const found = state().contents.find((item) => item.id === contentId);
    if (!found) throw new ContentRuleError("Konten tidak ditemukan.");
    return found;
  };

  const note = (noteId: string): ReviewNote => {
    const found = state().notes.find((item) => item.id === noteId);
    if (!found) throw new ContentRuleError("Catatan tidak ditemukan.");
    return found;
  };

  const requireAuthor = (item: ContentItem, actorId: string, action: string) => {
    if (item.authorId !== actorId) throw new ContentRuleError(`Hanya penulis yang dapat ${action}.`);
  };

  const requireStatus = (item: ContentItem, statuses: ContentStatusId[], message: string) => {
    if (!statuses.includes(item.status)) throw new ContentRuleError(message);
  };

  const requireAssignedReviewer = (item: ContentItem, actorId: string) => {
    requireRole(actorId, "reviewer", "Reviewer");
    if (item.authorId === actorId) throw new ContentRuleError("Kamu tidak dapat me-review konten tulisanmu sendiri.");
    if (item.reviewerId !== actorId) throw new ContentRuleError("Konten ini tidak ditugaskan kepadamu.");
    requireStatus(item, ["menunggu-review"], "Konten ini tidak sedang menunggu review.");
  };

  const record = (item: ContentItem, action: StatusAction, from: ContentStatusId | null, actorId: string, extra: { targetUserId?: string; alasan?: string } = {}) => {
    state().statusEvents.push({
      id: newId("event"),
      contentId: item.id,
      action,
      from,
      to: item.status,
      actorId,
      targetUserId: extra.targetUserId ?? null,
      alasan: extra.alasan ?? null,
      at: now(),
    });
  };

  // Setiap aksi Admin tercatat dan catatannya tidak bisa diubah (PRD FR-16).
  const audit = (entry: Omit<AdminAuditLog, "id" | "at">) => {
    state().auditLog.push({ ...entry, id: newId("log"), at: now() });
  };

  const requireReason = (alasan: string) => {
    if (!alasan.trim()) throw new ContentRuleError("Alasan wajib diisi.");
    return alasan.trim();
  };

  const hasAgreement = (userId: string) => state().agreements.some((item) => item.userId === userId);

  // Membership mengikuti hak akses aktif tertinggi, jadi refund dan pencabutan langsung berdampak.
  const syncMembership = (userId: string) => {
    const tiers = state().entitlements.filter((item) => item.userId === userId && item.kind === "membership" && item.active).map((item) => item.itemId);
    user(userId).membership = tiers.includes("premium") ? "premium" : tiers.includes("pro") ? "pro" : "basic";
  };

  const transaction = (transactionId: string) => {
    const found = state().transactions.find((item) => item.id === transactionId);
    if (!found) throw new ContentRuleError("Transaksi tidak ditemukan.");
    return found;
  };

  const itemTitle = (kind: EntitlementKind, itemId: string) => {
    if (kind === "membership") {
      if (itemId !== "pro" && itemId !== "premium") throw new ContentRuleError("Paket membership tidak valid.");
      return `Membership ${itemId === "pro" ? "Pro" : "Premium"}`;
    }
    const product = state().products.find((item) => item.id === itemId && item.kind === kind);
    if (!product) throw new ContentRuleError("Produk tidak ditemukan.");
    return product.title;
  };

  const recordModeration = (userId: string, flagId: string | null, kind: ModerationActionKind, alasan: string | null, actorId: string) => {
    state().moderationActions.push({ id: newId("moderasi"), userId, flagId, kind, alasan, actorId, at: now() });
    const flag = state().moderationFlags.find((item) => item.id === flagId);
    if (flag && flag.status === "terbuka") flag.status = kind === "abaikan" ? "diabaikan" : "ditangani";
  };

  const validateVideos = (input: ContentDraftInput) => {
    if (input.videos && input.videos.length > MAX_VIDEOS) throw new ContentRuleError(`Maksimal ${MAX_VIDEOS} video per konten.`);
  };

  const requireComplete = (item: ContentItem) => {
    const missing = missingRequiredFields(item);
    if (missing.length > 0) throw new ContentRuleError(`Lengkapi kolom wajib: ${missing.join(", ")}.`);
  };

  const requireChecklist = (checked: string[], list: { id: string }[], message: string) => {
    if (!list.every((item) => checked.includes(item.id))) throw new ContentRuleError(message);
  };

  const currentNotes = (item: ContentItem) => state().notes.filter((entry) => entry.contentId === item.id && entry.round === item.submissionCount);

  return {
    subscribe(listener) {
      listeners.add(listener);
      // Sinkron antar tab.
      const onStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) return;
        cache = null;
        listener();
      };
      if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
      };
    },

    async listUsers() {
      return structuredClone(state().users);
    },
    async listContents() {
      return structuredClone(state().contents.filter((item) => !state().supersededIds.includes(item.id)));
    },
    async getContent(contentId) {
      return structuredClone(state().contents.find((item) => item.id === contentId) ?? null);
    },
    async listNotes(contentId) {
      return structuredClone(state().notes.filter((item) => item.contentId === contentId));
    },
    async listAllNotes() {
      return structuredClone(state().notes);
    },
    async listStatusEvents(contentId) {
      return structuredClone(state().statusEvents.filter((item) => !contentId || item.contentId === contentId));
    },
    async listRoleEvents() {
      return structuredClone(state().roleEvents);
    },
    async listAgreements() {
      return structuredClone(state().agreements);
    },
    async listAuditLog() {
      return structuredClone(state().auditLog);
    },
    async listTransactions() {
      return structuredClone(state().transactions);
    },
    async listEntitlements() {
      return structuredClone(state().entitlements);
    },
    async listClaims() {
      return structuredClone(state().claims);
    },
    async listProducts() {
      return structuredClone(state().products);
    },
    async getPlatformOverrides() {
      return structuredClone(state().overrides);
    },
    async listModerationFlags() {
      return structuredClone(state().moderationFlags);
    },
    async listModerationActions() {
      return structuredClone(state().moderationActions);
    },
    async listXpTransactions() {
      return structuredClone(state().xpTransactions);
    },
    async listAnnouncements() {
      return structuredClone(state().announcements);
    },

    async createDraft(actorId, input) {
      requireRole(actorId, "creator", "Creator");
      validateVideos(input);
      const at = now();
      const item: ContentItem = {
        id: newId("konten"),
        type: "artikel",
        judul: "",
        ringkasan: "",
        kategori: "",
        sampul: "",
        ajakan: null,
        sumber: [],
        body: EMPTY_BODY,
        videos: [],
        ...input,
        authorId: actorId,
        reviewerId: null,
        status: "draf",
        submissionCount: 0,
        revisionOf: null,
        publicPath: null,
        submittedAt: null,
        createdAt: at,
        updatedAt: at,
      };
      state().contents.unshift(item);
      record(item, "buat", null, actorId);
      commit();
      return structuredClone(item);
    },

    async updateDraft(actorId, contentId, input) {
      const item = content(contentId);
      requireAuthor(item, actorId, "mengubah konten ini");
      requireStatus(item, ["draf", "perlu-revisi"], "Konten hanya dapat diubah saat berstatus Draf atau Perlu Revisi.");
      validateVideos(input);
      Object.assign(item, input, { updatedAt: now() });
      commit();
      return structuredClone(item);
    },

    async deleteDraft(actorId, contentId) {
      const item = content(contentId);
      requireAuthor(item, actorId, "menghapus konten ini");
      requireStatus(item, ["draf"], "Hanya konten berstatus Draf yang dapat dihapus.");
      const current = state();
      current.contents = current.contents.filter((entry) => entry.id !== contentId);
      current.notes = current.notes.filter((entry) => entry.contentId !== contentId);
      commit();
    },

    async submitForReview(actorId, contentId, checklist) {
      const item = content(contentId);
      requireAuthor(item, actorId, "mengirim konten ini");
      requireStatus(item, ["draf"], "Hanya konten berstatus Draf yang dapat dikirim untuk review.");
      requireComplete(item);
      requireChecklist(checklist, CREATOR_CHECKLIST, "Centang seluruh checklist sebelum mengirim.");
      item.status = "menunggu-review";
      item.submissionCount += 1;
      item.submittedAt = now();
      item.updatedAt = item.submittedAt;
      record(item, "kirim", "draf", actorId);
      commit();
      return structuredClone(item);
    },

    async withdraw(actorId, contentId) {
      const item = content(contentId);
      requireAuthor(item, actorId, "menarik kembali konten ini");
      requireStatus(item, ["menunggu-review"], "Hanya konten berstatus Menunggu Review yang dapat ditarik kembali.");
      item.status = "draf";
      item.updatedAt = now();
      // Catatan yang belum dikirim Reviewer ikut dihapus, karena belum ada keputusan.
      const current = state();
      current.notes = current.notes.filter((entry) => entry.contentId !== contentId || entry.released);
      record(item, "tarik-kembali", "menunggu-review", actorId);
      commit();
      return structuredClone(item);
    },

    async resubmit(actorId, contentId) {
      const item = content(contentId);
      requireAuthor(item, actorId, "mengirim ulang konten ini");
      requireStatus(item, ["perlu-revisi"], "Hanya konten berstatus Perlu Revisi yang dapat dikirim ulang.");
      requireComplete(item);
      const latest = latestRoundNotes(state().notes.filter((entry) => entry.contentId === contentId));
      if (latest.some((entry) => !entry.markedFixed)) throw new ContentRuleError("Tandai semua catatan sebagai sudah diperbaiki sebelum mengirim ulang.");
      item.status = "menunggu-review";
      item.submissionCount += 1;
      item.submittedAt = now();
      item.updatedAt = item.submittedAt;
      record(item, "kirim-ulang", "perlu-revisi", actorId);
      commit();
      return structuredClone(item);
    },

    async replyToNote(actorId, noteId, reply) {
      const entry = note(noteId);
      requireAuthor(content(entry.contentId), actorId, "membalas catatan ini");
      if (entry.resolved) throw new ContentRuleError("Catatan ini sudah selesai.");
      entry.creatorReply = reply;
      commit();
      return structuredClone(entry);
    },

    async setNoteFixed(actorId, noteId, fixed) {
      const entry = note(noteId);
      requireAuthor(content(entry.contentId), actorId, "menandai catatan ini");
      if (entry.resolved) throw new ContentRuleError("Catatan ini sudah selesai.");
      entry.markedFixed = fixed;
      commit();
      return structuredClone(entry);
    },

    async createRevision(actorId, contentId) {
      const source = content(contentId);
      requireAuthor(source, actorId, "merevisi konten ini");
      requireStatus(source, ["terbit"], "Revisi hanya dapat dibuat dari konten yang sudah terbit.");
      const at = now();
      const item: ContentItem = {
        ...structuredClone(source),
        id: newId("konten"),
        reviewerId: null,
        status: "draf",
        submissionCount: 0,
        revisionOf: source.id,
        publicPath: null,
        submittedAt: null,
        createdAt: at,
        updatedAt: at,
      };
      state().contents.unshift(item);
      record(item, "buat-revisi", null, actorId);
      commit();
      return structuredClone(item);
    },

    async claimReview(actorId, contentId) {
      const item = content(contentId);
      requireRole(actorId, "reviewer", "Reviewer");
      if (item.authorId === actorId) throw new ContentRuleError("Kamu tidak dapat mengambil konten tulisanmu sendiri.");
      requireStatus(item, ["menunggu-review"], "Konten ini tidak sedang menunggu review.");
      if (item.reviewerId) throw new ContentRuleError("Konten ini sudah ditugaskan.");
      item.reviewerId = actorId;
      item.updatedAt = now();
      record(item, "ambil", "menunggu-review", actorId, { targetUserId: actorId });
      commit();
      return structuredClone(item);
    },

    async addNote(actorId, contentId, input) {
      const item = content(contentId);
      requireAssignedReviewer(item, actorId);
      if (!input.isi.trim()) throw new ContentRuleError("Isi catatan wajib diisi.");
      if (input.kind !== "umum" && !input.anchor) throw new ContentRuleError(input.kind === "bagian" ? "Pilih bagian yang dimaksud." : "Pilih video yang dimaksud.");
      const entry: ReviewNote = {
        id: newId("catatan"),
        contentId,
        kind: input.kind,
        anchor: input.kind === "umum" ? null : input.anchor,
        isi: input.isi.trim(),
        reviewerId: actorId,
        round: item.submissionCount,
        released: false,
        creatorReply: "",
        markedFixed: false,
        resolved: false,
        createdAt: now(),
      };
      state().notes.push(entry);
      commit();
      return structuredClone(entry);
    },

    async removeNote(actorId, noteId) {
      const entry = note(noteId);
      if (entry.reviewerId !== actorId) throw new ContentRuleError("Hanya pembuat catatan yang dapat menghapusnya.");
      if (entry.released) throw new ContentRuleError("Catatan yang sudah dikirim tidak dapat dihapus.");
      const current = state();
      current.notes = current.notes.filter((item) => item.id !== noteId);
      commit();
    },

    async requestRevision(actorId, contentId) {
      const item = content(contentId);
      requireAssignedReviewer(item, actorId);
      const fresh = currentNotes(item).filter((entry) => !entry.released);
      if (fresh.length === 0) throw new ContentRuleError("Tambahkan minimal satu catatan baru sebelum meminta revisi.");
      fresh.forEach((entry) => {
        entry.released = true;
      });
      item.status = "perlu-revisi";
      item.updatedAt = now();
      record(item, "minta-revisi", "menunggu-review", actorId);
      commit();
      return structuredClone(item);
    },

    async approve(actorId, contentId, checklist) {
      const item = content(contentId);
      requireAssignedReviewer(item, actorId);
      requireChecklist(checklist, REVIEWER_CHECKLIST, "Centang seluruh checklist Reviewer sebelum menyetujui.");
      // Seluruh catatan dinyatakan selesai saat Reviewer menyetujui konten.
      state().notes.forEach((entry) => {
        if (entry.contentId === contentId) {
          entry.released = true;
          entry.resolved = true;
        }
      });
      item.status = "disetujui";
      item.updatedAt = now();
      record(item, "setujui", "menunggu-review", actorId);
      commit();
      return structuredClone(item);
    },

    async assignReviewer(actorId, contentId, reviewerId) {
      requireRole(actorId, "admin", "Admin");
      const item = content(contentId);
      requireStatus(item, ["menunggu-review"], "Reviewer hanya dapat ditugaskan pada konten Menunggu Review.");
      if (!user(reviewerId).roles.includes("reviewer")) throw new ContentRuleError("Pengguna ini bukan Reviewer.");
      if (item.authorId === reviewerId) throw new ContentRuleError("Penulis tidak dapat me-review kontennya sendiri.");
      audit({
        adminId: actorId,
        action: "tugaskan-reviewer",
        targetType: "konten",
        targetId: item.id,
        targetLabel: item.judul,
        alasan: null,
        before: { reviewer: item.reviewerId ? user(item.reviewerId).name : null },
        after: { reviewer: user(reviewerId).name },
      });
      item.reviewerId = reviewerId;
      item.updatedAt = now();
      record(item, "tugaskan", "menunggu-review", actorId, { targetUserId: reviewerId });
      commit();
      return structuredClone(item);
    },

    async publish(actorId, contentId) {
      requireRole(actorId, "admin", "Admin");
      const item = content(contentId);
      requireStatus(item, ["disetujui"], "Hanya konten Disetujui yang dapat diterbitkan.");
      if (!hasAgreement(item.authorId)) throw new ContentRuleError(`Konten belum bisa diterbitkan karena ${user(item.authorId).name} belum memiliki kesepakatan tertulis yang tercatat.`);
      audit({
        adminId: actorId,
        action: "terbitkan",
        targetType: "konten",
        targetId: item.id,
        targetLabel: item.judul,
        alasan: null,
        before: { status: "disetujui" },
        after: { status: "terbit" },
      });
      item.status = "terbit";
      item.updatedAt = now();
      // Revisi yang terbit menggantikan versi lama, yang tetap tayang sampai saat ini.
      if (item.revisionOf) {
        const original = content(item.revisionOf);
        item.publicPath = original.publicPath;
        original.publicPath = null;
        state().supersededIds.push(original.id);
      } else {
        item.publicPath = `/creator/konten/${item.id}`;
      }
      record(item, "terbitkan", "disetujui", actorId);
      commit();
      return structuredClone(item);
    },

    async takedown(actorId, contentId, alasan) {
      requireRole(actorId, "admin", "Admin");
      const item = content(contentId);
      requireStatus(item, ["terbit"], "Hanya konten Terbit yang dapat ditarik dari website.");
      if (!alasan.trim()) throw new ContentRuleError("Alasan penarikan wajib diisi.");
      audit({
        adminId: actorId,
        action: "tarik-website",
        targetType: "konten",
        targetId: item.id,
        targetLabel: item.judul,
        alasan: alasan.trim(),
        before: { status: "terbit" },
        after: { status: "draf" },
      });
      item.status = "draf";
      item.publicPath = null;
      item.updatedAt = now();
      // Alasannya tampil sebagai catatan umum bagi Creator.
      state().notes.push({
        id: newId("catatan"),
        contentId,
        kind: "umum",
        anchor: null,
        isi: alasan.trim(),
        reviewerId: actorId,
        round: item.submissionCount,
        released: true,
        creatorReply: "",
        markedFixed: false,
        resolved: false,
        createdAt: now(),
      });
      record(item, "tarik-website", "terbit", actorId, { alasan: alasan.trim() });
      commit();
      return structuredClone(item);
    },

    async setRole(actorId, userId, role, action, alasan) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      if (role === "user") throw new ContentRuleError("Peran pelajar dimiliki semua pengguna dan tidak dapat diubah.");
      const target = user(userId);
      const rolesBefore = target.roles;
      if (action === "tambah") {
        if (target.roles.includes(role)) throw new ContentRuleError("Pengguna ini sudah memiliki peran tersebut.");
        target.roles = [...target.roles, role];
      } else {
        if (!target.roles.includes(role)) throw new ContentRuleError("Pengguna ini tidak memiliki peran tersebut.");
        if (role === "admin" && userId === actorId && state().users.filter((item) => item.roles.includes("admin")).length === 1) {
          throw new ContentRuleError("Kamu tidak dapat mencabut peran Admin karena kamu satu-satunya Admin.");
        }
        target.roles = target.roles.filter((item) => item !== role);
      }
      state().roleEvents.push({ id: newId("peran"), userId, role, action, actorId, at: now() });
      audit({
        adminId: actorId,
        action: action === "tambah" ? "tambah-peran" : "cabut-peran",
        targetType: "pengguna",
        targetId: userId,
        targetLabel: target.name,
        alasan: reason,
        before: { peran: rolesBefore },
        after: { peran: target.roles },
      });
      commit();
      return structuredClone(target);
    },

    async setAccountStatus(actorId, userId, status, alasan) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      if (status === "nonaktif" && userId === actorId) throw new ContentRuleError("Kamu tidak dapat menonaktifkan akunmu sendiri.");
      const target = user(userId);
      if (target.status === status) throw new ContentRuleError(status === "nonaktif" ? "Akun ini sudah nonaktif." : "Akun ini sudah aktif.");
      audit({
        adminId: actorId,
        action: status === "nonaktif" ? "nonaktifkan-akun" : "aktifkan-akun",
        targetType: "pengguna",
        targetId: userId,
        targetLabel: target.name,
        alasan: reason,
        before: { status: target.status },
        after: { status },
      });
      target.status = status;
      commit();
      return structuredClone(target);
    },

    async recordAgreement(actorId, userId, { tanggal, dokumen }) {
      requireRole(actorId, "admin", "Admin");
      const target = user(userId);
      if (!target.roles.includes("creator")) throw new ContentRuleError("Kesepakatan hanya untuk pengguna berperan Creator.");
      if (!tanggal.trim()) throw new ContentRuleError("Tanggal kesepakatan wajib diisi.");
      if (!dokumen.trim()) throw new ContentRuleError("Tautan atau keterangan dokumen wajib diisi.");
      const previous = state().agreements.filter((item) => item.userId === userId).at(-1);
      const entry: CreatorAgreement = { id: newId("kesepakatan"), userId, tanggal: tanggal.trim(), dokumen: dokumen.trim(), recordedBy: actorId, recordedAt: now() };
      state().agreements.push(entry);
      audit({
        adminId: actorId,
        action: "catat-kesepakatan",
        targetType: "pengguna",
        targetId: userId,
        targetLabel: target.name,
        alasan: null,
        before: previous ? { tanggal: previous.tanggal, dokumen: previous.dokumen } : null,
        after: { tanggal: entry.tanggal, dokumen: entry.dokumen },
      });
      commit();
      return structuredClone(entry);
    },

    async refundTransaction(actorId, transactionId, alasan) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      const item = transaction(transactionId);
      if (item.status !== "berhasil") throw new ContentRuleError("Refund hanya untuk transaksi berstatus Berhasil.");
      const at = now();
      audit({ adminId: actorId, action: "refund", targetType: "transaksi", targetId: item.id, targetLabel: item.itemTitle, alasan: reason, before: { status: item.status }, after: { status: "refund" } });
      item.status = "refund";
      item.history.push({ status: "refund", at, source: "admin", actorId, alasan: reason });
      // Hak akses dicabut, bukan dihapus (PRD FR-16).
      state().entitlements.forEach((entry) => {
        if (entry.transactionId === item.id && entry.active) {
          entry.active = false;
          entry.revokedAt = at;
          entry.revokedBy = actorId;
          entry.revokeReason = reason;
        }
      });
      syncMembership(item.userId);
      commit();
      return structuredClone(item);
    },

    async grantEntitlement(actorId, userId, { kind, itemId }, alasan) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      const target = user(userId);
      const title = itemTitle(kind, itemId);
      if (state().entitlements.some((entry) => entry.userId === userId && entry.itemId === itemId && entry.active)) throw new ContentRuleError(`${target.name} sudah memiliki ${title}.`);
      const entry: Entitlement = {
        id: newId("akses"),
        userId,
        kind,
        itemId,
        itemTitle: title,
        source: "pemberian-manual",
        transactionId: null,
        active: true,
        grantedAt: now(),
        grantedBy: actorId,
        alasan: reason,
        revokedAt: null,
        revokedBy: null,
        revokeReason: null,
      };
      state().entitlements.push(entry);
      audit({ adminId: actorId, action: "berikan-akses", targetType: "pengguna", targetId: userId, targetLabel: target.name, alasan: reason, before: null, after: { hakAkses: title, sumber: "Pemberian manual" } });
      syncMembership(userId);
      commit();
      return structuredClone(entry);
    },

    async revokeEntitlement(actorId, entitlementId, alasan) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      const entry = state().entitlements.find((item) => item.id === entitlementId);
      if (!entry) throw new ContentRuleError("Hak akses tidak ditemukan.");
      if (entry.source !== "pemberian-manual") throw new ContentRuleError("Hanya hak akses pemberian manual yang dapat dicabut di sini.");
      if (!entry.active) throw new ContentRuleError("Hak akses ini sudah dicabut.");
      entry.active = false;
      entry.revokedAt = now();
      entry.revokedBy = actorId;
      entry.revokeReason = reason;
      audit({ adminId: actorId, action: "cabut-akses", targetType: "pengguna", targetId: entry.userId, targetLabel: user(entry.userId).name, alasan: reason, before: { hakAkses: entry.itemTitle, aktif: true }, after: { hakAkses: entry.itemTitle, aktif: false } });
      syncMembership(entry.userId);
      commit();
      return structuredClone(entry);
    },

    async saveProduct(actorId, productId, input, alasan) {
      requireRole(actorId, "admin", "Admin");
      if (!input.title.trim()) throw new ContentRuleError("Judul produk wajib diisi.");
      if (!input.description.trim()) throw new ContentRuleError("Deskripsi produk wajib diisi.");
      if (!Number.isInteger(input.price) || input.price < 0) throw new ContentRuleError("Harga harus berupa angka bulat, minimal 0.");
      const fields = { ...input, title: input.title.trim(), description: input.description.trim() };

      if (productId) {
        const product = state().products.find((item) => item.id === productId);
        if (!product) throw new ContentRuleError("Produk tidak ditemukan.");
        const isPriceChanged = product.price !== input.price;
        // Perubahan harga termasuk aksi yang menyangkut uang (PRD FR-16).
        if (isPriceChanged && !alasan.trim()) throw new ContentRuleError("Alasan perubahan harga wajib diisi.");
        const before = { judul: product.title, harga: product.price, status: product.status };
        Object.assign(product, fields, { kind: product.kind, updatedAt: now() });
        audit({ adminId: actorId, action: "ubah-produk", targetType: "produk", targetId: product.id, targetLabel: product.title, alasan: isPriceChanged ? alasan.trim() : null, before, after: { judul: product.title, harga: product.price, status: product.status } });
        commit();
        return structuredClone(product);
      }

      const slug = `${fields.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${state().nextId + 1}`;
      const product: Product = { ...fields, id: newId(fields.kind), slug, updatedAt: now() };
      state().products.push(product);
      audit({ adminId: actorId, action: "tambah-produk", targetType: "produk", targetId: product.id, targetLabel: product.title, alasan: null, before: null, after: { judul: product.title, harga: product.price, status: product.status } });
      commit();
      return structuredClone(product);
    },

    async simulateGateway(transactionId, status) {
      const item = transaction(transactionId);
      if (item.status !== "menunggu") throw new ContentRuleError("Hanya transaksi Menunggu Pembayaran yang bisa berubah dari gateway.");
      const at = now();
      item.status = status;
      item.history.push({ status, at, source: "gateway", actorId: null, alasan: null });
      if (status === "berhasil") {
        state().entitlements.push({
          id: newId("akses"),
          userId: item.userId,
          kind: item.kind,
          itemId: item.itemId,
          itemTitle: item.itemTitle,
          source: "pembelian",
          transactionId: item.id,
          active: true,
          grantedAt: at,
          grantedBy: null,
          alasan: null,
          revokedAt: null,
          revokedBy: null,
          revokeReason: null,
        });
        syncMembership(item.userId);
      }
      commit();
      return structuredClone(item);
    },

    async updateCourseCatalog(actorId, courseSlug, change, alasan) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      const current = courseCatalogState(courseSlug, state().overrides.courses);
      if (!current) throw new ContentRuleError("Course tidak ditemukan.");

      const isVisibilityChanged = current.availability !== change.availability || current.contentStatus !== change.contentStatus;
      if (isVisibilityChanged && change.availability === "available" && change.contentStatus !== "ready") {
        throw new ContentRuleError("Course tidak bisa dijadikan Tersedia selama kontennya belum Siap. Aturan ini berlaku untuk UAT dan Production.");
      }
      if (current.access === "free" && change.access === "premium") {
        if (isRequiredFree(courseSlug)) throw new ContentRuleError("Course fondasi wajib gratis.");
        if (DUMMY_LEARNING_PROGRESS.some((entry) => entry.courseSlug === courseSlug)) throw new ContentRuleError("Course gratis tidak bisa dijadikan premium karena sudah ada pengguna yang mempelajarinya.");
      }
      const afterChange = freeXpTotal({ ...state().overrides.courses, [courseSlug]: change });
      if (change.access === "premium" && current.access === "free" && afterChange < MASTER_XP) {
        throw new ContentRuleError(`Perubahan ditolak: XP dari materi gratis menjadi ${afterChange}, kurang dari batas rank Master (${MASTER_XP}).`);
      }

      state().overrides.courses[courseSlug] = change;
      audit({ adminId: actorId, action: "ubah-katalog", targetType: "katalog", targetId: courseSlug, targetLabel: courseSlug, alasan: reason, before: { ...current }, after: { ...change } });
      commit();
      return structuredClone(change);
    },

    async setCatalogItemStatus(actorId, kind, itemId, status, alasan) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      const key = `${kind}:${itemId}`;
      const before = state().overrides.items[key] ?? null;
      state().overrides.items[key] = status;
      audit({ adminId: actorId, action: "ubah-katalog", targetType: "katalog", targetId: key, targetLabel: itemId, alasan: reason, before: { status: before }, after: { status } });
      commit();
    },

    async ignoreFlag(actorId, flagId) {
      requireRole(actorId, "admin", "Admin");
      const flag = state().moderationFlags.find((item) => item.id === flagId);
      if (!flag) throw new ContentRuleError("Penandaan tidak ditemukan.");
      if (flag.status !== "terbuka") throw new ContentRuleError("Penandaan ini sudah ditindak.");
      audit({ adminId: actorId, action: "abaikan-moderasi", targetType: "pengguna", targetId: flag.userId, targetLabel: user(flag.userId).name, alasan: null, before: { status: "terbuka" }, after: { status: "diabaikan" } });
      recordModeration(flag.userId, flagId, "abaikan", null, actorId);
      commit();
      return structuredClone(flag);
    },

    async correctXp(actorId, userId, amount, alasan, flagId) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      if (!Number.isInteger(amount) || amount === 0) throw new ContentRuleError("Jumlah koreksi harus angka bulat dan tidak boleh 0.");
      const target = user(userId);
      if (target.xp + amount < 0) throw new ContentRuleError("Koreksi tidak boleh membuat XP kurang dari 0.");
      const before = target.xp;
      target.xp += amount;
      state().xpTransactions.push({ id: newId("xp"), userId, amount, kind: "koreksi", alasan: reason, actorId, at: now() });
      audit({ adminId: actorId, action: "koreksi-xp", targetType: "pengguna", targetId: userId, targetLabel: target.name, alasan: reason, before: { xp: before }, after: { xp: target.xp } });
      recordModeration(userId, flagId, "koreksi-xp", reason, actorId);
      commit();
      return structuredClone(target);
    },

    async setLeaderboardVisibility(actorId, userId, visible, alasan, flagId) {
      requireRole(actorId, "admin", "Admin");
      const reason = requireReason(alasan);
      const target = user(userId);
      if (target.hiddenFromLeaderboard === !visible) throw new ContentRuleError(visible ? "Akun ini sudah tampil di leaderboard." : "Akun ini sudah disembunyikan dari leaderboard.");
      target.hiddenFromLeaderboard = !visible;
      audit({ adminId: actorId, action: visible ? "tampilkan-leaderboard" : "sembunyikan-leaderboard", targetType: "pengguna", targetId: userId, targetLabel: target.name, alasan: reason, before: { tampil: !visible }, after: { tampil: visible } });
      recordModeration(userId, flagId, visible ? "tampilkan" : "sembunyikan", reason, actorId);
      commit();
      return structuredClone(target);
    },

    async saveAnnouncement(actorId, announcementId, input, mode) {
      requireRole(actorId, "admin", "Admin");
      const title = input.title.trim();
      const body = input.body.trim();
      const href = input.href.trim();
      if (!title) throw new ContentRuleError("Judul pengumuman wajib diisi.");
      if (mode !== "draf" && !body) throw new ContentRuleError("Isi pengumuman wajib diisi.");
      if (href && (!href.startsWith("/") || href.startsWith("//") || !isAvailableHref(href))) throw new ContentRuleError("Tautan tujuan harus halaman internal yang tersedia, mis. /learn.");
      let scheduledAt: string | null = null;
      if (mode === "jadwal") {
        const time = Date.parse(input.scheduledAt);
        if (Number.isNaN(time)) throw new ContentRuleError("Waktu kirim wajib diisi.");
        if (time <= Date.now()) throw new ContentRuleError("Waktu kirim harus di masa depan.");
        scheduledAt = new Date(time).toISOString();
      }

      const existing = announcementId ? state().announcements.find((item) => item.id === announcementId) : undefined;
      if (announcementId && !existing) throw new ContentRuleError("Pengumuman tidak ditemukan.");
      if (existing && existing.status !== "draf") throw new ContentRuleError("Hanya draf yang dapat diubah.");

      const at = now();
      const status = mode === "kirim" ? "terkirim" : mode === "jadwal" ? "terjadwal" : "draf";
      const entry: Announcement = {
        id: existing?.id ?? newId("pengumuman"),
        title,
        body,
        href,
        group: input.group,
        target: input.target,
        status,
        scheduledAt,
        sentAt: mode === "kirim" ? at : null,
        createdBy: existing?.createdBy ?? actorId,
        createdAt: existing?.createdAt ?? at,
      };
      if (existing) Object.assign(existing, entry);
      else state().announcements.push(entry);
      audit({
        adminId: actorId,
        action: mode === "kirim" ? "kirim-pengumuman" : mode === "jadwal" ? "jadwalkan-pengumuman" : "simpan-pengumuman",
        targetType: "pengumuman",
        targetId: entry.id,
        targetLabel: title,
        alasan: null,
        before: existing ? { status: "draf" } : null,
        after: { status, target: input.target, jadwal: scheduledAt },
      });
      commit();
      return structuredClone(entry);
    },

    async cancelAnnouncement(actorId, announcementId) {
      requireRole(actorId, "admin", "Admin");
      const entry = state().announcements.find((item) => item.id === announcementId);
      if (!entry) throw new ContentRuleError("Pengumuman tidak ditemukan.");
      if (entry.status !== "terjadwal") throw new ContentRuleError("Hanya pengumuman terjadwal yang dapat dibatalkan.");
      entry.status = "dibatalkan";
      audit({ adminId: actorId, action: "batalkan-pengumuman", targetType: "pengumuman", targetId: entry.id, targetLabel: entry.title, alasan: null, before: { status: "terjadwal" }, after: { status: "dibatalkan" } });
      commit();
      return structuredClone(entry);
    },

    async processScheduledAnnouncements() {
      const due = state().announcements.filter((item) => item.status === "terjadwal");
      const at = now();
      due.forEach((item) => {
        item.status = "terkirim";
        item.sentAt = at;
      });
      commit();
      return due.length;
    },

    async reset() {
      cache = createDummyContentState();
      try {
        storage?.removeItem(STORAGE_KEY);
      } catch {
        // Penyimpanan tidak tersedia.
      }
      listeners.forEach((listener) => listener());
    },
  };
}
