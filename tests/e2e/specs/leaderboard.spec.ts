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
});
