import { expect, test } from "../fixtures/auth";
import { CHALLENGE_ANSWERS, WRONG_CHALLENGE_ANSWER } from "../fixtures/testData";
import { ChallengePage } from "../pages/ChallengePage";
import { PlaygroundPage } from "../pages/PlaygroundPage";

test.use({ role: "user" });

test.describe("Daftar challenge", () => {
  let playground: PlaygroundPage;

  test.beforeEach(async ({ page }) => {
    playground = new PlaygroundPage(page);
    await playground.goto();
    await expect(playground.cards.first()).toBeVisible();
  });

  test("filter kategori dan level bekerja dan tersimpan di URL", async ({ page }) => {
    await playground.selectCategory("Web Automation");

    await expect(playground.cards).toHaveCount(2);
    await expect(page).toHaveURL(/[?&]kategori=web-automation/);

    await playground.selectPanelFilter("Level", "Advanced");

    await expect(playground.cards).toHaveCount(1);
    await expect(playground.card("Build Login Automation")).toBeVisible();
    await expect(page).toHaveURL(/[?&]level=advanced/);

    await page.reload();

    await expect(playground.cards).toHaveCount(1);
    await expect(playground.card("Build Login Automation")).toBeVisible();
  });

  test("kartu challenge menampilkan tautan course terkait", async ({ page }) => {
    const link = playground.relatedCourseLink("Playwright Locator");
    await expect(link).toHaveText("Course: Playwright");

    await link.click();

    await expect(page).toHaveURL("/learn/playwright");
  });
});

test.describe("Menjawab challenge", () => {
  const slug = "playwright-locator";

  test("jawaban salah menampilkan hasil gagal", async ({ page }) => {
    const challenge = new ChallengePage(page, slug);
    await challenge.goto();
    await challenge.submitAnswer(WRONG_CHALLENGE_ANSWER);

    await expect(challenge.failedResult).toBeVisible();
    await expect(challenge.successResult).toBeHidden();
  });

  test("jawaban benar menampilkan hasil berhasil", async ({ page }) => {
    const challenge = new ChallengePage(page, slug);
    await challenge.goto();
    await challenge.submitAnswer(CHALLENGE_ANSWERS[slug]);

    await expect(challenge.successResult).toBeVisible();
    await expect(challenge.failedResult).toBeHidden();
  });
});
