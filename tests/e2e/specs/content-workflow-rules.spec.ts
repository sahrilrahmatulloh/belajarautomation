import { expect, test } from "@playwright/test";

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
