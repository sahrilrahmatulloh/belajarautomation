import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly greeting: Locator;
  readonly welcomeBanner: Locator;
  readonly rankCard: Locator;
  readonly rankEmblem: Locator;
  readonly continueLearning: Locator;
  readonly continueCover: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page, "/");
    this.greeting = page.getByRole("heading", { level: 1, name: /^Halo,/ });
    this.welcomeBanner = page.locator("section").filter({ has: this.greeting });
    this.rankCard = page.locator("section").filter({ hasText: "Rank kamu" });
    this.rankEmblem = this.rankCard.getByRole("img", { name: /^Emblem rank / });
    this.continueLearning = page.getByRole("region", { name: "Lanjutkan Belajar" });
    this.continueCover = this.continueLearning.getByRole("img", { name: /^Sampul course / }).first();
    this.continueButton = this.continueLearning.getByRole("link", { name: "Lanjutkan", exact: true });
  }
}
