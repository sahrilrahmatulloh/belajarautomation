import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class LeaderboardPage extends BasePage {
  readonly tabs: Locator;
  readonly rankTab: Locator;
  readonly globalTab: Locator;
  readonly positionCard: Locator;
  readonly topList: Locator;

  constructor(page: Page) {
    super(page, "/leaderboard");
    this.tabs = page.getByRole("tab");
    this.rankTab = this.tabs.first();
    this.globalTab = page.getByRole("tab", { name: "Global" });
    this.positionCard = page.getByRole("region", { name: "Posisi kamu" });
    this.topList = page.getByRole("region", { name: /peringkat teratas$/ }).getByRole("listitem");
  }
}
