import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  readonly simulationNote: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    super(page, "/checkout");
    this.simulationNote = page.getByRole("note").filter({ hasText: "Mode simulasi" });
    this.payButton = page.getByRole("button", { name: /\(simulasi\)$/ });
  }
}
