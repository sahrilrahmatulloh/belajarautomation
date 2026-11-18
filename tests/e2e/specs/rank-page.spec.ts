import { expect, test } from "../fixtures/auth";
import { USER_RANK } from "../fixtures/testData";
import { DashboardPage } from "../pages/DashboardPage";
import { LeaderboardPage } from "../pages/LeaderboardPage";
import { RankPage } from "../pages/RankPage";

// Halaman Rank & XP (PRD FR-01 C dan FR-05): dibuka dari kartu "Rank kamu" di dashboard,
// berisi tingkatan rank dan cara mendapatkan XP, dan tidak lagi berada di halaman leaderboard.
test.use({ role: "user" });

test.describe("Halaman Rank & XP", () => {
  test("kartu Rank kamu di dashboard membuka halaman Rank & XP", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.rankCard.getByRole("link", { name: "Lihat detail rank" }).click();

    await expect(page).toHaveURL("/rank");
    await expect(new RankPage(page).heading).toBeVisible();
  });

  test("emblem kartu Rank kamu di tengah pada mobile dan di kiri pada layar lebar", async ({ page, isMobile }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const card = (await dashboard.rankCard.boundingBox())!;
    const emblem = (await dashboard.rankCard.getByRole("img", { name: /^Emblem rank / }).boundingBox())!;
    const cardCenter = card.x + card.width / 2;
    const emblemCenter = emblem.x + emblem.width / 2;

    if (isMobile) {
      expect(Math.abs(emblemCenter - cardCenter)).toBeLessThanOrEqual(2);
      await expect(dashboard.rankCard.getByRole("heading", { name: USER_RANK })).toHaveCSS("text-align", "center");
    } else {
      expect(emblem.x + emblem.width).toBeLessThan(card.x + card.width / 4);
    }
  });

  test("berisi 6 tingkatan rank, rank pengguna, dan cara mendapatkan XP", async ({ page }) => {
    const rank = new RankPage(page);
    await rank.goto();

    await expect(rank.tiers).toHaveCount(6);
    await expect(rank.tiers.first()).toContainText("Trainee");
    await expect(rank.tiers.last()).toContainText("Master");
    await expect(rank.currentTier).toContainText(USER_RANK);
    await expect(rank.currentTier).toHaveAttribute("aria-current", "step");
    await expect(rank.xpRewards.getByRole("listitem")).toHaveCount(4);
    await expect(rank.xpRewards).toContainText("Menyelesaikan seluruh lesson dalam satu modul");
  });

  test("tombol Lihat leaderboard membuka halaman leaderboard", async ({ page }) => {
    const rank = new RankPage(page);
    await rank.goto();

    await rank.leaderboardLink.click();

    await expect(page).toHaveURL("/leaderboard");
  });
});

test.describe("Leaderboard tanpa tingkatan rank", () => {
  test("tingkatan rank dan cara mendapatkan XP tidak ada lagi, diganti tautan ke halaman Rank", async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.goto();
    await expect(leaderboard.topList.first()).toBeVisible();

    await expect(page.getByRole("heading", { name: "Tingkatan Rank" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Cara Mendapatkan XP/i })).toHaveCount(0);

    await leaderboard.positionCard.getByRole("link", { name: "Lihat tingkatan rank" }).click();
    await expect(page).toHaveURL("/rank");
  });
});
