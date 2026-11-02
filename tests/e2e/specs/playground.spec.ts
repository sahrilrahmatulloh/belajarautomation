import { expect, test } from "../fixtures/auth";
import { PlaygroundPage } from "../pages/PlaygroundPage";

test.use({ role: "user" });

test.describe("Daftar latihan", () => {
  let playground: PlaygroundPage;

  test.beforeEach(async ({ page }) => {
    playground = new PlaygroundPage(page);
    await playground.goto();
    await expect(playground.cards.first()).toBeVisible();
  });

  test("menampilkan 10 latihan tanpa filter", async () => {
    await expect(playground.cards).toHaveCount(10);
    await expect(playground.list.getByText("10 latihan tersedia")).toBeVisible();
    await expect(playground.list.getByRole("button", { name: "Reset filter" })).toBeHidden();
  });

  test("chip jenis, panel Level, dan panel Kategori saling melengkapi dan tersimpan di URL", async ({ page }) => {
    await playground.selectType("Locator Challenge");

    await expect(playground.cards).toHaveCount(2);
    await expect(page).toHaveURL(/[?&]jenis=locator/);

    await playground.selectPanelFilter("Level", "Beginner");

    await expect(playground.cards).toHaveCount(1);
    await expect(playground.card("Playwright Locator")).toBeVisible();
    await expect(page).toHaveURL(/[?&]level=beginner/);
    await expect(playground.filterButton).toHaveText("Filter (1)");

    await playground.selectPanelFilter("Kategori", "Web Automation");

    await expect(playground.cards).toHaveCount(1);
    await expect(page).toHaveURL(/[?&]kategori=web-automation/);
    await expect(playground.filterButton).toHaveText("Filter (2)");

    await page.reload();

    await expect(playground.cards).toHaveCount(1);
    await expect(playground.card("Playwright Locator")).toBeVisible();
    await expect(
      playground.typeFilter.getByRole("button", { name: "Locator Challenge" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("pencarian tanpa hasil menampilkan empty state dan bisa direset", async ({ page }) => {
    await playground.search("tidak-ada-latihan-ini");

    await expect(playground.cards).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Latihan tidak ditemukan" })).toBeVisible();

    await playground.list.getByRole("button", { name: "Reset filter" }).first().click();

    await expect(playground.cards).toHaveCount(10);
    await expect(page).toHaveURL("/playground");
  });

  test("status dan tombol kartu mengikuti riwayat dan skor terakhir", async () => {
    for (const [title, score] of [
      ["Playwright Locator", 100],
      ["Find the Checkout Bug", 100],
      ["Kuis QA Fundamental", 80],
    ] as const) {
      const card = playground.card(title);
      await expect(card.getByText("Lulus", { exact: true })).toBeVisible();
      await expect(card.getByText(`Skor terakhir ${score}%`)).toBeVisible();
      await expect(playground.actionLink(title, "Ulangi")).toBeVisible();
    }

    const failed = playground.card("Kuis Git & GitHub");
    await expect(failed.getByText("Belum lulus", { exact: true })).toBeVisible();
    await expect(failed.getByText("Skor terakhir 50%")).toBeVisible();
    await expect(playground.actionLink("Kuis Git & GitHub", "Coba Lagi")).toBeVisible();

    const fresh = playground.card("Login Test Case");
    await expect(fresh.getByText("Belum dikerjakan")).toBeVisible();
    await expect(fresh.getByText(/Skor terakhir/)).toBeHidden();
    await expect(playground.actionLink("Login Test Case", "Mulai Latihan")).toBeVisible();
  });

  test("kuis menampilkan jumlah soal dan jenis lain tidak", async () => {
    await expect(playground.card("Kuis Playwright").getByText("10 soal")).toBeVisible();
    await expect(playground.card("Login Test Case").getByText(/\d+ soal/)).toBeHidden();
  });

  test("kartu latihan menampilkan tautan course terkait", async ({ page }) => {
    const link = playground.relatedCourseLink("Playwright Locator");
    await expect(link).toHaveText("Playwright");

    await link.click();

    await expect(page).toHaveURL("/learn/playwright");
  });
});
