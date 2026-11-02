import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class SettingsPage extends BasePage {
  readonly publicProfileSwitch: Locator;

  constructor(page: Page) {
    super(page, "/settings");
    this.publicProfileSwitch = page.getByRole("switch", { name: "Profil dapat dilihat publik" });
  }
}
