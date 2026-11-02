import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class MembershipPage extends BasePage {
  readonly plans: Locator;
  readonly comparisonTable: Locator;

  constructor(page: Page) {
    super(page, "/membership");
    this.plans = page.getByRole("article");
    this.comparisonTable = page.getByRole("table");
  }

  plan(name: string) {
    return this.plans.filter({ has: this.page.getByRole("heading", { name, exact: true }) });
  }

  // Sel nilai saja, tanpa judul baris: urutannya Basic, Pro, Premium.
  comparisonValues(feature: string) {
    return this.comparisonTable.getByRole("row", { name: feature }).getByRole("cell");
  }

  async buy(planName: string) {
    await this.page.getByRole("button", { name: `Beli ${planName}`, exact: true }).click();
  }
}
