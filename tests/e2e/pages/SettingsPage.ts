import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class SettingsPage extends BasePage {
  readonly publicProfileSwitch: Locator;
  readonly notificationSection: Locator;

  constructor(page: Page) {
    super(page, "/settings");
    this.publicProfileSwitch = page.getByRole("switch", { name: "Profil dapat dilihat publik" });
    this.notificationSection = page.locator("#notifikasi");
  }

  notificationSwitch(name: string) {
    return this.notificationSection.getByRole("switch", { name, exact: true });
  }
}
