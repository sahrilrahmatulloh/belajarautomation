import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage {
  readonly tabs: Locator;
  readonly header: Locator;
  readonly rankEmblem: Locator;
  readonly activeAppearance: Locator;
  readonly usedAvatar: Locator;
  readonly usedTheme: Locator;

  constructor(page: Page) {
    super(page, "/profile");
    this.tabs = page.getByRole("tablist", { name: "Bagian profil" }).getByRole("tab");
    this.header = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    this.rankEmblem = this.header.getByRole("img", { name: /^Emblem rank / });
    this.activeAppearance = page.getByRole("region", { name: "Digunakan Saat Ini" });
    this.usedAvatar = this.activeAppearance.getByRole("button", { name: /^Avatar/ });
    this.usedTheme = this.activeAppearance.getByRole("button", { name: /^Tema/ });
  }

  tab(name: string) {
    return this.page.getByRole("tab", { name, exact: true });
  }

  async gotoTab(tab: string) {
    await this.page.goto(`${this.path}?tab=${tab}`);
  }
}
