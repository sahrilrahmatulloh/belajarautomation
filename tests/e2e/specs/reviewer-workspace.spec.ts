import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import type { ContentRepository } from "@/lib/content/repository";

import { expect, test } from "../fixtures/auth";
import { DEMO_PASSWORD, REVIEWER_WORKSPACE, ROLE_MODE } from "../fixtures/testData";
import { LoginPage } from "../pages/LoginPage";
import { ReviewPageObject, ReviewQueuePageObject } from "../pages/ReviewerPages";

const { assignedTitle, resubmittedId, resubmittedTitle, unassignedId, unassignedTitle, ownId, ownTitle, firstRoundId, columns, counts } = REVIEWER_WORKSPACE;

const notesOf = (page: Page, contentId: string) =>
  page.evaluate((id) => (window as unknown as { __contentRepository: ContentRepository }).__contentRepository.listNotes(id), contentId);

const statusOf = (page: Page, contentId: string) =>
  page.evaluate((id) => (window as unknown as { __contentRepository: ContentRepository }).__contentRepository.getContent(id).then((item) => item?.status), contentId);

test.describe("Reviewer", () => {
  test.use({ role: "reviewer" });

  test.describe("Antrean Review", () => {
    let queue: ReviewQueuePageObject;

    test.beforeEach(async ({ page }) => {
      queue = new ReviewQueuePageObject(page);
      await queue.goto();
      await expect(queue.heading).toBeVisible();
    });

    test("tab menampilkan jumlah dan kolom sesuai PRD", async ({ page }) => {
      await expect(queue.tab(/^Ditugaskan ke saya/)).toHaveText(`Ditugaskan ke saya (${counts.assigned})`);
      await expect(queue.tab(/^Belum ditugaskan/)).toHaveText(`Belum ditugaskan (${counts.unassigned})`);
      await expect(queue.tab(/^Riwayat/)).toHaveText(`Riwayat (${counts.history})`);
      await expect(page.getByRole("columnheader")).toHaveText([...columns]);
      await expect(queue.rows).toHaveCount(counts.assigned);
    });

    test("kiriman ulang dan lama menunggu tampil di baris", async () => {
      await expect(queue.row(resubmittedTitle)).toContainText("Ulang (ke-2)");
      await expect(queue.row(assignedTitle)).toContainText("Pertama");
      await expect(queue.row(assignedTitle)).toContainText("4 hari");
    });

    test("pencarian dan filter jenis menyaring daftar", async ({ page }) => {
      await queue.search.fill(assignedTitle);
      await expect(queue.rows).toHaveCount(1);

      await queue.search.fill("");
      await queue.typeFilter.selectOption({ label: "Soal" });
      await expect(page.getByText("Tidak ada konten yang cocok.")).toBeVisible();
    });

    test("riwayat memuat konten yang pernah diputuskan", async () => {
      await queue.tab(/^Riwayat/).click();

      await expect(queue.rows).toHaveCount(counts.history);
      await expect(queue.row(REVIEWER_WORKSPACE.approvedTitle)).toContainText("Disetujui");
      await expect(queue.row(REVIEWER_WORKSPACE.approvedTitle).getByRole("link", { name: "Lihat" })).toBeVisible();
    });

    test("halaman Riwayat Review langsung membuka tab Riwayat", async ({ page }) => {
      await page.goto("/reviewer/riwayat");

      await expect(queue.tab(/^Riwayat/)).toHaveAttribute("aria-pressed", "true");
      await expect(queue.rows).toHaveCount(counts.history);
    });
  });

  test.describe("Alur review", () => {
    test("ambil konten, tulis catatan, lalu minta revisi", async ({ page }) => {
      const queue = new ReviewQueuePageObject(page);
      await queue.goto();
      await queue.tab(/^Belum ditugaskan/).click();

      await queue.row(unassignedTitle).getByRole("button", { name: "Ambil untuk review" }).click();

      await expect(page).toHaveURL(`/reviewer/review/${unassignedId}`);
      const review = new ReviewPageObject(page);
      await expect(review.requestRevision).toBeDisabled();

      await review.writeNote("Catatan umum", "Tambahkan contoh request.");
      await review.noteKind.selectOption({ label: "Per bagian" });
      await review.noteSection.selectOption({ label: "Pembahasan" });
      await review.noteText.fill("Perjelas bagian ini.");
      await review.addNote.click();

      await expect(review.newNotes).toHaveCount(2);
      await expect(review.newNotes.last()).toContainText("Bagian: Pembahasan");

      await review.newNotes.first().getByRole("button", { name: /^Hapus catatan/ }).click();
      await expect(review.newNotes).toHaveCount(1);

      await review.requestRevision.click();
      await expect(review.dialog).toContainText("1 catatan baru");
      await review.dialog.getByRole("button", { name: "Minta Revisi" }).click();

      await expect(page).toHaveURL("/reviewer/antrean");
      expect(await statusOf(page, unassignedId)).toBe("perlu-revisi");
      expect((await notesOf(page, unassignedId)).map((note) => [note.kind, note.anchor, note.released])).toEqual([["bagian", "pembahasan", true]]);
    });

    test("kiriman ulang menampilkan catatan sebelumnya, lalu disetujui setelah checklist lengkap", async ({ page }) => {
      const review = new ReviewPageObject(page);
      await review.goto(resubmittedId);

      await expect(review.previousNotes).toHaveCount(1);
      await expect(review.previousNotes.first()).toContainText("Balasan Creator: Sudah saya tambahkan penjelasannya.");
      await expect(review.previousNotes.first()).toContainText("Sudah diperbaiki");
      await expect(review.approve).toBeDisabled();

      await review.checkAll();
      await review.approve.click();
      await review.dialog.getByRole("button", { name: "Setujui" }).click();

      await expect(page).toHaveURL("/reviewer/antrean");
      expect(await statusOf(page, resubmittedId)).toBe("disetujui");
      expect((await notesOf(page, resubmittedId)).every((note) => note.resolved)).toBe(true);
    });

    test("catatan per video dan alasan Creator tampil di panel", async ({ page }) => {
      const review = new ReviewPageObject(page);
      await review.goto(resubmittedId);
      await expect(page.getByRole("region", { name: "Referensi Video" })).toContainText("Alasan: Menjelaskan dasar penggunaan locator");

      await review.noteKind.selectOption({ label: "Per video" });
      await review.noteText.fill("Ganti dengan versi baru.");
      await review.addNote.click();

      await expect(review.newNotes.first()).toContainText("Video: Mengenal Locator di Playwright");
    });

    test("Reviewer hanya memberi catatan, tanpa mengedit isi", async ({ page }) => {
      const review = new ReviewPageObject(page);
      await review.goto(resubmittedId);
      await expect(review.noteText).toBeVisible();

      await expect(page.getByRole("heading", { level: 1, name: resubmittedTitle })).toBeVisible();
      await expect(page.locator("[contenteditable=true]")).toHaveCount(0);
      await expect(page.getByRole("toolbar")).toHaveCount(0);
    });

    test("konten yang sudah diputuskan hanya bisa dilihat", async ({ page }) => {
      const review = new ReviewPageObject(page);
      await review.goto(REVIEWER_WORKSPACE.approvedId);
      await expect(review.panel).toBeVisible();

      await expect(review.noteText).toBeHidden();
      await expect(review.approve).toBeHidden();
    });

    test("draf yang belum dikirim tidak bisa dibuka", async ({ page }) => {
      await new ReviewPageObject(page).goto(REVIEWER_WORKSPACE.draftId);

      await expect(page.getByRole("heading", { name: "Konten tidak ditemukan" })).toBeVisible();
    });
  });

  test.describe("Dashboard dan profil", () => {
    test("dashboard memakai data repository dan menautkan ke halaman review", async ({ page }) => {
      await page.goto("/reviewer");
      const stats = page.getByRole("region", { name: "Statistik review" });

      await expect(stats.getByRole("heading", { level: 3, name: "Ditugaskan ke Saya" }).locator("xpath=following-sibling::p")).toHaveText(String(counts.assigned));
      await page.getByRole("link", { name: `Buka review ${assignedTitle}` }).click();

      await expect(page).toHaveURL(new RegExp("/reviewer/review/"));
    });

    test("keputusan baru langsung terhitung di profil", async ({ page }) => {
      const review = new ReviewPageObject(page);
      await review.goto(resubmittedId);
      await review.checkAll();
      await review.approve.click();
      await review.dialog.getByRole("button", { name: "Setujui" }).click();
      await expect(page).toHaveURL("/reviewer/antrean");

      await page.goto("/profile");

      const stats = page.getByRole("region", { name: "Aktivitas Review" });
      const approved = ROLE_MODE.reviewerStats.find((item) => item.label === "Disetujui");
      await expect(stats.getByRole("heading", { level: 3, name: "Disetujui" }).locator("xpath=following-sibling::p")).toHaveText(String(Number(approved?.value) + 1));
    });
  });

  test.describe("Aksesibilitas", () => {
    for (const colorScheme of ["light", "dark"] as const) {
      test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
        test.use({ colorScheme });

        for (const path of REVIEWER_WORKSPACE.axePaths) {
          test(`${path} tanpa pelanggaran critical dan serious`, async ({ page }) => {
            await page.goto(path);
            await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();

            const { violations } = await new AxeBuilder({ page }).analyze();

            expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
          });
        }

        test("dialog keputusan tanpa pelanggaran critical dan serious", async ({ page }) => {
          const review = new ReviewPageObject(page);
          await review.goto(resubmittedId);
          await review.checkAll();
          await review.approve.click();
          await expect(review.dialog).toBeVisible();

          const { violations } = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();

          expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
        });
      });
    }
  });
});

test.describe("Reviewer yang juga Creator", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(ROLE_MODE.multiRoleEmail, DEMO_PASSWORD);
    await expect(page).toHaveURL("/reviewer");
  });

  test("tombol ambil disembunyikan untuk tulisan sendiri", async ({ page }) => {
    const queue = new ReviewQueuePageObject(page);
    await queue.goto();
    await queue.tab(/^Belum ditugaskan/).click();

    await expect(queue.row(ownTitle)).toContainText("Tulisanmu sendiri");
    await expect(queue.row(ownTitle).getByRole("button", { name: "Ambil untuk review" })).toHaveCount(0);
    await expect(queue.row(unassignedTitle).getByRole("button", { name: "Ambil untuk review" })).toBeVisible();
  });

  test("halaman review konten sendiri tidak menyediakan aksi, dan repository menolak", async ({ page }) => {
    const review = new ReviewPageObject(page);
    await review.goto(ownId);
    await expect(review.panel).toContainText("tulisanmu sendiri");
    await expect(review.panel.getByRole("button", { name: "Ambil untuk review" })).toHaveCount(0);
    await expect(review.noteText).toBeHidden();

    const message = await page.evaluate(
      (id) =>
        (window as unknown as { __contentRepository: ContentRepository }).__contentRepository.claimReview("user-bima", id).then(
          () => "",
          (error: Error) => error.message
        ),
      ownId
    );

    expect(message).toContain("tulisanmu sendiri");
  });
});

test("konten kiriman pertama yang ditugaskan terbuka tanpa catatan sebelumnya", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const login = new LoginPage(page);
  await login.goto();
  await login.login("reviewer@demo.belajarautomation.com", DEMO_PASSWORD);
  await expect(page).toHaveURL("/reviewer");

  const review = new ReviewPageObject(page);
  await review.goto(firstRoundId);

  await expect(review.noteText).toBeVisible();
  await expect(review.previousNotes).toHaveCount(0);
  await context.close();
});
