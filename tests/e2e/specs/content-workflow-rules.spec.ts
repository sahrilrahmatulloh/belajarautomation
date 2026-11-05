import { expect, test } from "@playwright/test";

import { COURSES } from "@/data/courses";
import { freeXpTotal } from "@/lib/content/catalogRules";
import { createDummyRepository } from "@/lib/content/dummyRepository";
import { ContentRepository, ContentRuleError } from "@/lib/content/repository";
import { CREATOR_CHECKLIST, REVIEWER_CHECKLIST } from "@/lib/content/rules";

// Aturan alur konten dan peran di lapisan data (PRD FR-15), tanpa browser, agar pelanggaran
// yang tidak bisa dipicu lewat tampilan tetap teruji.
const ANDI = "user-andi";
const GALIH = "user-galih";
const RAHMA = "user-rahma";
const BIMA = "user-bima";
const ADMIN = "user-admin";
const SOBAT = "user-sobat";

const CREATOR_ALL = CREATOR_CHECKLIST.map((item) => item.id);
const REVIEWER_ALL = REVIEWER_CHECKLIST.map((item) => item.id);

const COMPLETE = {
  judul: "Judul",
  ringkasan: "Ringkasan",
  kategori: "Career",
  sampul: "/covers/courses/playwright.webp",
  body: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Isi" }] }] },
};

const REASON = "Alasan uji.";
const AGREEMENT = { tanggal: "2026-11-01", dokumen: "Dokumen kesepakatan" };

let repo: ContentRepository;

const expectRule = async (action: Promise<unknown>, message: RegExp) => {
  const error = await action.then(
    () => null,
    (reason: unknown) => reason
  );
  expect(error).toBeInstanceOf(ContentRuleError);
  expect((error as Error).message).toMatch(message);
};

const statusOf = async (contentId: string) => (await repo.getContent(contentId))?.status;

test.beforeEach(() => {
  repo = createDummyRepository(null);
});

test.describe("Aturan Creator", () => {
  test("hanya Creator yang bisa membuat konten", async () => {
    await expectRule(repo.createDraft(SOBAT, COMPLETE), /Creator/);
  });

  test("hanya penulis yang bisa mengubah, dan hanya saat Draf atau Perlu Revisi", async () => {
    await expectRule(repo.updateDraft(GALIH, "konten-qa", { judul: "Baru" }), /penulis/);
    await expectRule(repo.updateDraft(ANDI, "konten-pemula", { judul: "Baru" }), /Draf atau Perlu Revisi/);
    await repo.updateDraft(ANDI, "konten-bug-report", { judul: "Baru" });
    expect((await repo.getContent("konten-bug-report"))?.judul).toBe("Baru");
  });

  test("kirim untuk review wajib kolom lengkap dan checklist penuh", async () => {
    const draft = await repo.createDraft(ANDI, { judul: "Baru" });
    await expectRule(repo.submitForReview(ANDI, draft.id, CREATOR_ALL), /Lengkapi kolom wajib/);
    await repo.updateDraft(ANDI, draft.id, COMPLETE);
    await expectRule(repo.submitForReview(ANDI, draft.id, CREATOR_ALL.slice(1)), /checklist/);

    const sent = await repo.submitForReview(ANDI, draft.id, CREATOR_ALL);

    expect(sent.status).toBe("menunggu-review");
    expect(sent.submissionCount).toBe(1);
  });

  test("maksimal 3 video", async () => {
    const video = { id: "x", judul: "x", channel: "x", durasi: "1:00", bahasa: "Indonesia", embed: true, alasan: "x" };
    await expectRule(repo.updateDraft(ANDI, "konten-qa", { videos: [video, video, video, video] }), /Maksimal 3/);
  });

  test("tarik kembali hanya oleh penulis dan dari Menunggu Review", async () => {
    await expectRule(repo.withdraw(GALIH, "konten-pemula"), /penulis/);
    await expectRule(repo.withdraw(ANDI, "konten-qa"), /Menunggu Review/);
    expect((await repo.withdraw(ANDI, "konten-pemula")).status).toBe("draf");
  });

  test("hanya draf yang bisa dihapus", async () => {
    await expectRule(repo.deleteDraft(ANDI, "konten-pemula"), /Draf/);
    await repo.deleteDraft(ANDI, "konten-qa");
    expect(await repo.getContent("konten-qa")).toBeNull();
  });

  test("kirim ulang hanya bila semua catatan ronde terakhir ditandai", async () => {
    await expectRule(repo.resubmit(ANDI, "konten-bug-report"), /Tandai semua catatan/);
    for (const note of await repo.listNotes("konten-bug-report")) await repo.setNoteFixed(ANDI, note.id, true);

    const sent = await repo.resubmit(ANDI, "konten-bug-report");

    expect(sent.status).toBe("menunggu-review");
    expect(sent.submissionCount).toBe(2);
  });

  test("hanya penulis yang bisa membalas dan menandai catatan", async () => {
    await expectRule(repo.setNoteFixed(RAHMA, "catatan-bug-umum", true), /penulis/);
    await expectRule(repo.replyToNote(GALIH, "catatan-bug-umum", "x"), /penulis/);
  });

  test("buat revisi menghasilkan salinan draf dan versi terbit tetap tayang", async () => {
    await expectRule(repo.createRevision(ANDI, "konten-qa"), /terbit/);

    const revision = await repo.createRevision(ANDI, "konten-locator");

    expect(revision.status).toBe("draf");
    expect(revision.revisionOf).toBe("konten-locator");
    expect(await statusOf("konten-locator")).toBe("terbit");
  });
});

test.describe("Aturan Reviewer", () => {
  test("tidak bisa mengambil konten tulisan sendiri", async () => {
    await expectRule(repo.claimReview(BIMA, "konten-regression"), /tulisanmu sendiri/);
  });

  test("hanya Reviewer yang bisa mengambil, dan hanya yang belum ditugaskan", async () => {
    await expectRule(repo.claimReview(ANDI, "konten-api"), /Reviewer/);
    await expectRule(repo.claimReview(BIMA, "konten-manual"), /sudah ditugaskan/);
    expect((await repo.claimReview(BIMA, "konten-api")).reviewerId).toBe(BIMA);
  });

  test("minta revisi wajib minimal satu catatan baru", async () => {
    await expectRule(repo.requestRevision(RAHMA, "konten-pemula"), /minimal satu catatan baru/);
    await repo.addNote(RAHMA, "konten-pemula", { kind: "umum", anchor: null, isi: "Perbaiki." });

    expect((await repo.requestRevision(RAHMA, "konten-pemula")).status).toBe("perlu-revisi");
  });

  test("catatan per bagian dan video wajib menunjuk sasarannya", async () => {
    await expectRule(repo.addNote(RAHMA, "konten-pemula", { kind: "bagian", anchor: null, isi: "x" }), /bagian/);
    await expectRule(repo.addNote(RAHMA, "konten-pemula", { kind: "umum", anchor: null, isi: "  " }), /wajib diisi/);
  });

  test("setujui wajib seluruh checklist dan menyelesaikan semua catatan", async () => {
    await expectRule(repo.approve(RAHMA, "konten-pemula", REVIEWER_ALL.slice(1)), /checklist/);

    expect((await repo.approve(RAHMA, "konten-pemula", REVIEWER_ALL)).status).toBe("disetujui");
    const notes = await repo.listNotes("konten-pemula");
    expect(notes.length).toBeGreaterThan(0);
    expect(notes.every((note) => note.resolved)).toBe(true);
  });

  test("hanya reviewer yang ditugaskan yang bisa memutuskan", async () => {
    await expectRule(repo.approve(BIMA, "konten-pemula", REVIEWER_ALL), /tidak ditugaskan/);
    await expectRule(repo.addNote(BIMA, "konten-pemula", { kind: "umum", anchor: null, isi: "x" }), /tidak ditugaskan/);
  });

  test("Reviewer tidak bisa mengubah isi konten", async () => {
    await expectRule(repo.updateDraft(RAHMA, "konten-bug-report", { judul: "Diubah" }), /penulis/);
  });
});

test.describe("Aturan Admin", () => {
  test("tugaskan reviewer: hanya Admin, harus Reviewer, dan bukan penulisnya", async () => {
    await expectRule(repo.assignReviewer(RAHMA, "konten-api", RAHMA), /Admin/);
    await expectRule(repo.assignReviewer(ADMIN, "konten-api", ANDI), /bukan Reviewer/);
    await expectRule(repo.assignReviewer(ADMIN, "konten-regression", BIMA), /Penulis/);

    expect((await repo.assignReviewer(ADMIN, "konten-api", RAHMA)).reviewerId).toBe(RAHMA);
  });

  test("terbitkan hanya dari Disetujui dan hanya oleh Admin", async () => {
    await expectRule(repo.publish(RAHMA, "konten-login"), /Admin/);
    await expectRule(repo.publish(ADMIN, "konten-qa"), /Disetujui/);
    await repo.recordAgreement(ADMIN, ANDI, AGREEMENT);

    expect((await repo.publish(ADMIN, "konten-login")).status).toBe("terbit");
  });

  test("tarik dari website wajib alasan, dan alasannya menjadi catatan umum", async () => {
    await expectRule(repo.takedown(ADMIN, "konten-locator", " "), /Alasan/);
    await expectRule(repo.takedown(ADMIN, "konten-qa", "x"), /Terbit/);

    expect((await repo.takedown(ADMIN, "konten-locator", "Ada data yang keliru.")).status).toBe("draf");

    const notes = await repo.listNotes("konten-locator");
    expect(notes.some((note) => note.kind === "umum" && note.released && note.isi === "Ada data yang keliru.")).toBe(true);
  });

  test("revisi yang terbit menggantikan versi lama", async () => {
    await repo.recordAgreement(ADMIN, ANDI, AGREEMENT);
    const revision = await repo.createRevision(ANDI, "konten-locator");
    await repo.updateDraft(ANDI, revision.id, COMPLETE);
    await repo.submitForReview(ANDI, revision.id, CREATOR_ALL);
    await repo.assignReviewer(ADMIN, revision.id, RAHMA);
    await repo.approve(RAHMA, revision.id, REVIEWER_ALL);

    const published = await repo.publish(ADMIN, revision.id);

    expect(published.publicPath).toBe("/blog/locator-playwright-best-practice");
    expect((await repo.listContents()).some((item) => item.id === "konten-locator")).toBe(false);
  });

  test("kelola peran: banyak peran, tercatat, dan Admin terakhir tidak bisa dicabut", async () => {
    await expectRule(repo.setRole(RAHMA, SOBAT, "creator", "tambah", REASON), /Admin/);
    await expectRule(repo.setRole(ADMIN, SOBAT, "creator", "tambah", " "), /Alasan wajib/);
    await expectRule(repo.setRole(ADMIN, ADMIN, "admin", "cabut", REASON), /satu-satunya Admin/);

    const updated = await repo.setRole(ADMIN, SOBAT, "creator", "tambah", REASON);
    expect(updated.roles).toEqual(["user", "creator"]);
    await expectRule(repo.setRole(ADMIN, SOBAT, "creator", "tambah", REASON), /sudah memiliki/);
    expect((await repo.listRoleEvents()).at(-1)).toMatchObject({ userId: SOBAT, role: "creator", action: "tambah", actorId: ADMIN });

    await repo.setRole(ADMIN, SOBAT, "admin", "tambah", REASON);
    await repo.setRole(ADMIN, ADMIN, "admin", "cabut", REASON);
    expect((await repo.listUsers()).find((user) => user.id === ADMIN)?.roles).not.toContain("admin");
  });
});

test.describe("Aturan Panel Admin", () => {
  test("terbitkan ditolak selama Creator belum punya kesepakatan", async () => {
    await expectRule(repo.publish(ADMIN, "konten-login"), /kesepakatan/);
    expect(await statusOf("konten-login")).toBe("disetujui");

    await repo.recordAgreement(ADMIN, ANDI, AGREEMENT);

    expect((await repo.publish(ADMIN, "konten-login")).status).toBe("terbit");
  });

  test("kesepakatan hanya untuk Creator, wajib lengkap, dan pembaruan menambah catatan baru", async () => {
    await expectRule(repo.recordAgreement(RAHMA, ANDI, AGREEMENT), /Admin/);
    await expectRule(repo.recordAgreement(ADMIN, SOBAT, AGREEMENT), /Creator/);
    await expectRule(repo.recordAgreement(ADMIN, ANDI, { tanggal: "", dokumen: "x" }), /Tanggal/);
    await expectRule(repo.recordAgreement(ADMIN, ANDI, { tanggal: "2026-11-01", dokumen: " " }), /dokumen/);

    await repo.recordAgreement(ADMIN, ANDI, AGREEMENT);
    await repo.recordAgreement(ADMIN, ANDI, { tanggal: "2026-11-02", dokumen: "Dokumen baru" });

    expect((await repo.listAgreements()).filter((item) => item.userId === ANDI)).toHaveLength(2);
  });

  test("nonaktifkan akun wajib alasan, dan Admin tidak bisa menonaktifkan dirinya", async () => {
    await expectRule(repo.setAccountStatus(RAHMA, SOBAT, "nonaktif", REASON), /Admin/);
    await expectRule(repo.setAccountStatus(ADMIN, SOBAT, "nonaktif", " "), /Alasan wajib/);
    await expectRule(repo.setAccountStatus(ADMIN, ADMIN, "nonaktif", REASON), /akunmu sendiri/);

    expect((await repo.setAccountStatus(ADMIN, SOBAT, "nonaktif", REASON)).status).toBe("nonaktif");
    await expectRule(repo.setAccountStatus(ADMIN, SOBAT, "nonaktif", REASON), /sudah nonaktif/);
    expect((await repo.setAccountStatus(ADMIN, SOBAT, "aktif", REASON)).status).toBe("aktif");
  });

  test("setiap aksi Admin tercatat lengkap di log, dan log tidak bisa diubah dari luar", async () => {
    await repo.assignReviewer(ADMIN, "konten-api", RAHMA);
    await repo.recordAgreement(ADMIN, ANDI, AGREEMENT);
    await repo.publish(ADMIN, "konten-login");
    await repo.takedown(ADMIN, "konten-locator", "Keliru.");
    await repo.setRole(ADMIN, SOBAT, "creator", "tambah", REASON);
    await repo.setRole(ADMIN, SOBAT, "creator", "cabut", REASON);
    await repo.setAccountStatus(ADMIN, SOBAT, "nonaktif", REASON);
    await repo.setAccountStatus(ADMIN, SOBAT, "aktif", REASON);

    const log = await repo.listAuditLog();
    expect(log.map((entry) => entry.action)).toEqual([
      "tugaskan-reviewer",
      "catat-kesepakatan",
      "terbitkan",
      "tarik-website",
      "tambah-peran",
      "cabut-peran",
      "nonaktifkan-akun",
      "aktifkan-akun",
    ]);
    expect(log[3]).toMatchObject({ adminId: ADMIN, targetId: "konten-locator", alasan: "Keliru.", before: { status: "terbit" }, after: { status: "draf" } });

    log[0].alasan = "diubah";
    log.pop();
    const again = await repo.listAuditLog();
    expect(again).toHaveLength(8);
    expect(again[0].alasan).toBeNull();
  });

  test("aksi yang ditolak tidak tercatat di log", async () => {
    await expectRule(repo.setRole(ADMIN, ADMIN, "admin", "cabut", REASON), /satu-satunya Admin/);
    await expectRule(repo.publish(ADMIN, "konten-login"), /kesepakatan/);

    expect(await repo.listAuditLog()).toEqual([]);
  });
});

test.describe("Aturan transaksi dan hak akses", () => {
  const membershipOf = async (userId: string) => (await repo.listUsers()).find((user) => user.id === userId)?.membership;
  const transaction = async (id: string) => (await repo.listTransactions()).find((item) => item.id === id);

  test("data dummy memuat semua status transaksi", async () => {
    expect(new Set((await repo.listTransactions()).map((item) => item.status))).toEqual(new Set(["menunggu", "berhasil", "gagal", "kedaluwarsa", "refund"]));
  });

  test("setiap membership berbayar punya transaksi dan hak akses aktif", async () => {
    const [users, entitlements] = await Promise.all([repo.listUsers(), repo.listEntitlements()]);

    for (const user of users.filter((item) => item.membership !== "basic")) {
      expect(entitlements.some((entry) => entry.userId === user.id && entry.kind === "membership" && entry.itemId === user.membership && entry.active)).toBe(true);
    }
  });

  test("refund: hanya Admin, wajib alasan, hanya dari Berhasil, dan mencabut akses tanpa menghapus", async () => {
    await expectRule(repo.refundTransaction(RAHMA, "trx-sobat-ebook", REASON), /Admin/);
    await expectRule(repo.refundTransaction(ADMIN, "trx-sobat-ebook", " "), /Alasan wajib/);
    await expectRule(repo.refundTransaction(ADMIN, "trx-sobat-pro", REASON), /Berhasil/);

    const refunded = await repo.refundTransaction(ADMIN, "trx-sobat-ebook", REASON);

    expect(refunded.status).toBe("refund");
    expect(refunded.history.at(-1)).toMatchObject({ status: "refund", source: "admin", actorId: ADMIN, alasan: REASON });
    const entry = (await repo.listEntitlements()).find((item) => item.transactionId === "trx-sobat-ebook");
    expect(entry).toMatchObject({ active: false, revokeReason: REASON });
    await expectRule(repo.refundTransaction(ADMIN, "trx-sobat-ebook", REASON), /Berhasil/);
  });

  test("refund membership menurunkan tingkat membership", async () => {
    const andi = (await repo.listTransactions()).find((item) => item.userId === ANDI && item.kind === "membership");
    expect(await membershipOf(ANDI)).toBe("pro");

    await repo.refundTransaction(ADMIN, andi?.id ?? "", REASON);

    expect(await membershipOf(ANDI)).toBe("basic");
  });

  test("Admin tidak punya operasi untuk mengubah status pembayaran", async () => {
    expect(Object.keys(repo).filter((name) => /status/i.test(name) && /transaction/i.test(name))).toEqual([]);
    expect(Object.keys(repo)).not.toContain("setTransactionStatus");
  });

  test("simulasi gateway hanya dari Menunggu, memberi akses saat Berhasil, dan tidak masuk log", async () => {
    await expectRule(repo.simulateGateway("trx-sobat-ebook", "gagal"), /Menunggu Pembayaran/);

    const paid = await repo.simulateGateway("trx-sobat-pro", "berhasil");

    expect(paid.history.at(-1)).toMatchObject({ status: "berhasil", source: "gateway", actorId: null });
    expect(await membershipOf(SOBAT)).toBe("pro");
    expect(await repo.listAuditLog()).toEqual([]);

    await repo.simulateGateway("trx-galih-project", "kedaluwarsa");
    expect((await repo.listEntitlements()).some((item) => item.transactionId === "trx-galih-project")).toBe(false);
  });

  test("pemberian manual: wajib alasan, tanpa transaksi, tidak dobel, dan bisa dicabut", async () => {
    const before = (await repo.listTransactions()).length;
    await expectRule(repo.grantEntitlement(RAHMA, SOBAT, { kind: "membership", itemId: "premium" }, REASON), /Admin/);
    await expectRule(repo.grantEntitlement(ADMIN, SOBAT, { kind: "membership", itemId: "premium" }, " "), /Alasan wajib/);
    await expectRule(repo.grantEntitlement(ADMIN, SOBAT, { kind: "membership", itemId: "basic" }, REASON), /tidak valid/);
    await expectRule(repo.grantEntitlement(ADMIN, SOBAT, { kind: "ebook", itemId: "tidak-ada" }, REASON), /Produk tidak ditemukan/);

    const entry = await repo.grantEntitlement(ADMIN, SOBAT, { kind: "membership", itemId: "premium" }, REASON);

    expect(entry).toMatchObject({ source: "pemberian-manual", transactionId: null, grantedBy: ADMIN, alasan: REASON });
    expect((await repo.listTransactions()).length).toBe(before);
    expect(await membershipOf(SOBAT)).toBe("premium");
    await expectRule(repo.grantEntitlement(ADMIN, SOBAT, { kind: "membership", itemId: "premium" }, REASON), /sudah memiliki/);

    await expectRule(repo.revokeEntitlement(ADMIN, entry.id, " "), /Alasan wajib/);
    await repo.revokeEntitlement(ADMIN, entry.id, REASON);
    expect(await membershipOf(SOBAT)).toBe("basic");
    await expectRule(repo.revokeEntitlement(ADMIN, entry.id, REASON), /sudah dicabut/);
    expect((await repo.listAuditLog()).map((item) => item.action)).toEqual(["berikan-akses", "cabut-akses"]);
  });

  test("hak akses dari pembelian tidak bisa dicabut lewat aksi manual", async () => {
    await expectRule(repo.revokeEntitlement(ADMIN, "akses-trx-sobat-ebook", REASON), /pemberian manual/);
  });

  test("ubah harga wajib alasan dan tidak mengubah transaksi lama", async () => {
    const sold = await transaction("trx-sobat-ebook");
    const product = (await repo.listProducts()).find((item) => item.title === sold?.itemTitle);
    if (!product) throw new Error("Produk tidak ditemukan");
    const amount = (await transaction("trx-sobat-ebook"))?.amount;
    const input = { kind: product.kind, title: product.title, description: product.description, cover: product.cover, fileName: product.fileName, status: product.status };

    await expectRule(repo.saveProduct(ADMIN, product.id, { ...input, price: amount! + 1000 }, ""), /Alasan perubahan harga/);
    await expectRule(repo.saveProduct(RAHMA, product.id, { ...input, price: 1 }, REASON), /Admin/);
    await expectRule(repo.saveProduct(ADMIN, product.id, { ...input, price: -1 }, REASON), /Harga/);

    const saved = await repo.saveProduct(ADMIN, product.id, { ...input, price: amount! + 1000 }, REASON);

    expect(saved.price).toBe(amount! + 1000);
    expect((await transaction("trx-sobat-ebook"))?.amount).toBe(amount);
  });
});

test.describe("Aturan Katalog Belajar", () => {
  const FREE_READY = { availability: "coming-soon", contentStatus: "draft", access: "free" } as const;

  test("Tersedia ditolak selama konten belum Siap", async () => {
    await expectRule(repo.updateCourseCatalog(ADMIN, "cypress", { ...FREE_READY, availability: "available" }, REASON), /belum Siap/);

    expect(await repo.updateCourseCatalog(ADMIN, "cypress", { ...FREE_READY, availability: "available", contentStatus: "ready" }, REASON)).toMatchObject({ availability: "available" });
  });

  test("gratis ke premium ditolak bila fondasi, sudah dipelajari, atau XP gratis kurang", async () => {
    const premium = (availability: "available" | "coming-soon") => ({ availability, contentStatus: "draft", access: "premium" }) as const;

    await expectRule(repo.updateCourseCatalog(ADMIN, "git-github", premium("available"), REASON), /fondasi/);
    await expectRule(repo.updateCourseCatalog(ADMIN, "playwright", premium("available"), REASON), /sudah ada pengguna/);
    await expectRule(repo.updateCourseCatalog(ADMIN, "cypress", premium("coming-soon"), REASON), /kurang dari batas rank Master/);
  });

  test("hanya Admin, wajib alasan, tercatat, dan tidak mengubah data katalog asli", async () => {
    await expectRule(repo.updateCourseCatalog(RAHMA, "cypress", { ...FREE_READY }, REASON), /Admin/);
    await expectRule(repo.updateCourseCatalog(ADMIN, "cypress", { ...FREE_READY }, " "), /Alasan wajib/);
    await expectRule(repo.updateCourseCatalog(ADMIN, "tidak-ada", { ...FREE_READY }, REASON), /tidak ditemukan/);

    await repo.updateCourseCatalog(ADMIN, "cypress", { ...FREE_READY, contentStatus: "ready" }, REASON);

    expect((await repo.listAuditLog()).at(-1)).toMatchObject({ action: "ubah-katalog", before: { contentStatus: "draft" }, after: { contentStatus: "ready" } });
    expect(COURSES.find((course) => course.slug === "cypress")?.contentStatus).toBe("draft");
  });

  test("XP gratis dihitung dari target lesson dan latihan", () => {
    expect(freeXpTotal({})).toBe(3880);
    expect(freeXpTotal({ cypress: { access: "premium" } })).toBe(3880 - 130);
  });
});

test.describe("Aturan Moderasi", () => {
  test("koreksi XP wajib alasan, menambah transaksi, tidak membuat XP negatif, dan menutup penandaan", async () => {
    await expectRule(repo.correctXp(RAHMA, "user-1", -100, REASON, "flag-rina"), /Admin/);
    await expectRule(repo.correctXp(ADMIN, "user-1", -100, " ", "flag-rina"), /Alasan wajib/);
    await expectRule(repo.correctXp(ADMIN, "user-1", 0, REASON, "flag-rina"), /tidak boleh 0/);
    await expectRule(repo.correctXp(ADMIN, "user-1", -999999, REASON, "flag-rina"), /kurang dari 0/);

    const updated = await repo.correctXp(ADMIN, "user-1", -2000, REASON, "flag-rina");

    expect(updated.xp).toBe(4400);
    expect(await repo.listXpTransactions()).toMatchObject([{ userId: "user-1", amount: -2000, kind: "koreksi", alasan: REASON }]);
    expect((await repo.listModerationFlags()).find((flag) => flag.id === "flag-rina")?.status).toBe("ditangani");

    await repo.correctXp(ADMIN, "user-1", 100, REASON, null);
    expect(await repo.listXpTransactions()).toHaveLength(2);
    expect((await repo.listAuditLog()).filter((entry) => entry.action === "koreksi-xp")).toHaveLength(2);
  });

  test("abaikan hanya penandaan terbuka dan tetap tercatat", async () => {
    await repo.ignoreFlag(ADMIN, "flag-dimas");

    await expectRule(repo.ignoreFlag(ADMIN, "flag-dimas"), /sudah ditindak/);
    expect((await repo.listModerationActions()).at(-1)).toMatchObject({ kind: "abaikan", userId: "user-2" });
  });

  test("sembunyikan dan tampilkan kembali wajib alasan, tanpa mengubah XP", async () => {
    await expectRule(repo.setLeaderboardVisibility(ADMIN, "user-1", false, " ", null), /Alasan wajib/);

    const hidden = await repo.setLeaderboardVisibility(ADMIN, "user-1", false, REASON, null);
    expect(hidden).toMatchObject({ hiddenFromLeaderboard: true, xp: 6400 });
    await expectRule(repo.setLeaderboardVisibility(ADMIN, "user-1", false, REASON, null), /sudah disembunyikan/);

    expect((await repo.setLeaderboardVisibility(ADMIN, "user-1", true, REASON, null)).hiddenFromLeaderboard).toBe(false);
  });
});

test.describe("Riwayat dan reset", () => {
  test("setiap transisi mencatat peristiwa status", async () => {
    await repo.withdraw(ANDI, "konten-pemula");

    expect((await repo.listStatusEvents("konten-pemula")).at(-1)).toMatchObject({
      action: "tarik-kembali",
      from: "menunggu-review",
      to: "draf",
      actorId: ANDI,
    });
  });

  test("reset mengembalikan data awal", async () => {
    await repo.deleteDraft(ANDI, "konten-qa");
    await repo.reset();

    expect(await repo.getContent("konten-qa")).not.toBeNull();
  });

  test("data dummy memiliki semua status dan sekitar 12 konten", async () => {
    const contents = await repo.listContents();

    expect(contents.length).toBe(12);
    expect(new Set(contents.map((item) => item.status))).toEqual(new Set(["draf", "menunggu-review", "perlu-revisi", "disetujui", "terbit"]));
  });
});
