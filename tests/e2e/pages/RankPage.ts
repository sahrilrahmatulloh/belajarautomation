import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

// Halaman Rank & XP (/rank).
export class RankPage extends BasePage {
  readonly heading: Locator;
  readonly tiers: Locator;
  readonly currentTier: Locator;
  readonly xpRewards: Locator;
  readonly leaderboardLink: Locator;

  constructor(page: Page) {
    super(page, "/rank");
    this.heading = page.getByRole("heading", { level: 1, name: "Rank & XP" });
    this.tiers = page.getByRole("list", { name: "Tingkatan rank, dari terendah ke tertinggi" }).getByRole("listitem");
    this.currentTier = this.tiers.filter({ hasText: "Rank kamu" });
    this.xpRewards = page.getByRole("region", { name: "Cara Mendapatkan XP" });
    this.leaderboardLink = page.getByRole("main").getByRole("link", { name: "Lihat leaderboard" });
  }
}
