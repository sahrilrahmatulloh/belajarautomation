import { expect, test } from "../fixtures/auth";
import { USER_RANK } from "../fixtures/testData";
import { LeaderboardPage } from "../pages/LeaderboardPage";

test.use({ role: "user" });

test.describe("Leaderboard", () => {
  let leaderboard: LeaderboardPage;

  test.beforeEach(async ({ page }) => {
    leaderboard = new LeaderboardPage(page);
    await leaderboard.goto();
  });

  test("tab awal adalah tab rank pengguna dengan label nama rank", async () => {
    await expect(leaderboard.rankTab).toContainText(USER_RANK);
    await expect(leaderboard.rankTab).toHaveAttribute("aria-selected", "true");
    await expect(leaderboard.positionCard).toContainText(`di ${USER_RANK}`);
  });

  test('tab Global menampilkan daftar dan kartu "Posisi kamu"', async () => {
    await leaderboard.globalTab.click();

    await expect(leaderboard.globalTab).toHaveAttribute("aria-selected", "true");
    await expect(leaderboard.topList.first()).toBeVisible();
    await expect(leaderboard.positionCard).toContainText("Posisi kamu secara global");
  });

  test("tab tersimpan di URL dan bertahan setelah dimuat ulang", async ({ page }) => {
    await leaderboard.globalTab.click();
    await expect(page).toHaveURL(/[?&]tab=global/);

    await page.reload();

    await expect(leaderboard.globalTab).toHaveAttribute("aria-selected", "true");
  });

  test("50 teratas ditampilkan 10 per halaman dengan navigasi 5 halaman", async ({ page }) => {
    await expect(leaderboard.topList).toHaveCount(10);
    await expect(page.getByText(/^Peringkat 1–10 dari 50 teratas/)).toBeVisible();
    await expect(leaderboard.pagination.getByRole("button", { name: /^Halaman \d$/ })).toHaveCount(5);
    await expect(leaderboard.pageButton(1)).toHaveAttribute("aria-current", "page");
    await expect(leaderboard.pagination.getByRole("button", { name: "Halaman sebelumnya" })).toBeDisabled();

    await leaderboard.pageButton(2).click();

    await expect(page).toHaveURL(/[?&]halaman=2/);
    await expect(leaderboard.pageButton(2)).toHaveAttribute("aria-current", "page");
    await expect(leaderboard.topList.first()).toContainText("11");
    await expect(page.getByText(/^Peringkat 11–20 dari 50 teratas/)).toBeVisible();

    await leaderboard.pageButton(5).click();
    await expect(leaderboard.pagination.getByRole("button", { name: "Halaman berikutnya" })).toBeDisabled();
  });

  test("berpindah tab kembali ke halaman 1", async ({ page }) => {
    await leaderboard.pageButton(3).click();
    await expect(page).toHaveURL(/[?&]halaman=3/);

    await leaderboard.globalTab.click();

    await expect(page).not.toHaveURL(/halaman=/);
    await expect(leaderboard.pageButton(1)).toHaveAttribute("aria-current", "page");
  });

  test("Lompat ke posisiku membuka halaman yang memuat baris pengguna dan menyorotnya", async ({ page }) => {
    // Akun demo berada di posisi 36 pada tab Apprentice, yaitu halaman 4.
    await expect(leaderboard.positionCard).toContainText("#36");
    await expect(leaderboard.jumpButton).toContainText("halaman 4");

    await leaderboard.jumpButton.click();

    await expect(page).toHaveURL(/[?&]halaman=4/);
    const ownRow = leaderboard.topList.filter({ hasText: "Kamu" });
    await expect(ownRow).toBeFocused();
    await expect(ownRow).toBeInViewport();
    await expect(leaderboard.jumpButton).toHaveCount(0);
  });

  test("tombol lompat tidak tampil bila pengguna di luar 50 teratas", async () => {
    await leaderboard.globalTab.click();

    await expect(leaderboard.positionCard).toContainText("#51");
    await expect(leaderboard.jumpButton).toHaveCount(0);
  });
});
