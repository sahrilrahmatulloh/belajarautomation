import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";
import { CHALLENGE_KEYS } from "../fixtures/testData";
import { ChallengePage } from "../pages/ChallengePage";

// Batas waktu latihan (PRD FR-04): Kuis 15 menit, Bug Hunt, Test Case, dan Locator 30 menit.
// Saat waktu habis, jawaban yang sudah diisi dikirim otomatis. Jam browser dikendalikan
// page.clock agar test tidak perlu menunggu.

test.use({ role: "user" });

const { quiz, bugHunt, testCase, locator } = CHALLENGE_KEYS;

async function open(page: Page, slug: string) {
  await page.clock.install();
  const challenge = new ChallengePage(page, slug);
  await challenge.goto();
  await expect(challenge.timer).toBeVisible();
  return challenge;
}

async function expectNoSeriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")).map((item) => item.id)).toEqual([]);
}

test.describe("Batas waktu Kuis", () => {
  test("menampilkan sisa waktu 15 menit yang berkurang", async ({ page }) => {
    const challenge = await open(page, quiz.slug);
    await expect(challenge.timer).toContainText(/Sisa waktu (15:00|14:5\d)/);
    await expect(page.getByText("Batas 15 menit. Jawaban terkirim otomatis saat waktu habis.")).toBeVisible();

    await page.clock.fastForward("02:00");

    await expect(challenge.timer).toContainText(/Sisa waktu (13:00|12:5\d)/);
  });

  test("waktu habis mengirim jawaban otomatis; soal kosong dihitung salah", async ({ page }) => {
    const challenge = await open(page, quiz.slug);
    await challenge.answerQuiz(quiz.answers.slice(0, 3));

    await page.clock.fastForward("15:00");

    await expect(page.getByText("Waktu habis. Jawabanmu dikirim otomatis.")).toBeVisible();
    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Waktu habis, jawaban dikirim otomatis. 3 dari 8 jawaban benar.");
    await expect(challenge.review.filter({ hasText: "Tidak dijawab" })).toHaveCount(quiz.answers.length - 3);
    await expect(challenge.timer).toBeHidden();
  });

  test("memuat ulang halaman tidak mengulang waktu", async ({ page }) => {
    const challenge = await open(page, quiz.slug);
    await challenge.options.nth(0).check();

    await page.clock.fastForward("05:00");
    await page.reload();

    await expect(challenge.timer).toContainText(/Sisa waktu (10:00|09:5\d)/);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`mode ${colorScheme === "light" ? "terang" : "gelap"}`, () => {
      test.use({ colorScheme });

      test("peringatan saat sisa waktu 1 menit, tanpa pelanggaran aksesibilitas", async ({ page }) => {
        const challenge = await open(page, quiz.slug);
        await expectNoSeriousViolations(page);

        await page.clock.fastForward("14:10");

        await expect(page.getByText("Sisa waktu 1 menit.")).toBeVisible();
        await expect(challenge.timer).toContainText(/Sisa waktu 00:[0-5]\d/);
        await expectNoSeriousViolations(page);
      });
    });
  }

  test("mengulang latihan memulai waktu penuh lagi", async ({ page }) => {
    const challenge = await open(page, quiz.slug);
    await page.clock.fastForward("15:00");
    await expect(challenge.result).toBeVisible();

    await challenge.retryButton.click();

    await expect(challenge.timer).toContainText(/Sisa waktu (15:00|14:5\d)/);
  });
});

test.describe("Batas waktu challenge 30 menit", () => {
  test("Bug Hunt: waktu habis mengirim temuan yang sudah dicentang", async ({ page }) => {
    const challenge = await open(page, bugHunt.slug);
    await expect(challenge.timer).toContainText(/Sisa waktu (30:00|29:5\d)/);
    await challenge.finding(bugHunt.bugs[0]).check();

    await page.clock.fastForward("30:00");

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Waktu habis, temuan dikirim otomatis. 1 bug ditemukan");
  });

  test("Test Case: waktu habis mengirim jawaban, lalu checklist dikerjakan tanpa batas waktu", async ({ page }) => {
    const challenge = await open(page, testCase.slug);
    await challenge.answerInput.fill("Judul: Login berhasil");

    await page.clock.fastForward("30:00");

    await expect(challenge.checklist).toBeVisible();
    await expect(page.getByRole("region", { name: "Jawaban kamu" })).toContainText("Judul: Login berhasil");
    await expect(challenge.timer).toBeHidden();
  });

  test("Test Case: waktu habis tanpa jawaban tetap membuka checklist", async ({ page }) => {
    const challenge = await open(page, testCase.slug);

    await page.clock.fastForward("30:00");

    await expect(challenge.checklist).toBeVisible();
    await expect(page.getByRole("region", { name: "Jawaban kamu" })).toContainText("Tidak ada jawaban sampai waktu habis.");
  });

  test("Locator: waktu habis tanpa selector dinilai tidak mengenai elemen", async ({ page }) => {
    const challenge = await open(page, locator.slug);
    await expect(challenge.timer).toContainText(/Sisa waktu (30:00|29:5\d)/);

    await page.clock.fastForward("30:00");

    await expect(challenge.result.getByRole("heading", { name: "Belum lulus" })).toBeVisible();
    await expect(challenge.result).toContainText("Waktu habis, selector dikirim otomatis. Selector tidak mengenai elemen apa pun.");
  });
});
