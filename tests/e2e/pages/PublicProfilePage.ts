import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class PublicProfilePage extends BasePage {
  readonly main: Locator;
  readonly name: Locator;
  readonly tabs: Locator;
  readonly stats: Locator;
  readonly ownerNotice: Locator;
  readonly privateNotice: Locator;
  readonly settingsLink: Locator;
  readonly shareButton: Locator;

  constructor(page: Page, username: string) {
    super(page, `/u/${username}`);
    this.main = page.getByRole("main");
    this.name = this.main.getByRole("heading", { level: 1 });
    this.tabs = page.getByRole("tablist", { name: "Bagian profil" }).getByRole("tab");
    this.stats = page.getByRole("region", { name: "Statistik belajar" });
    this.ownerNotice = page.getByText("Ini tampilan profilmu bagi pengguna lain.");
    this.privateNotice = page.getByRole("heading", { name: "Profil ini privat" });
    this.settingsLink = page.getByRole("link", { name: "Pengaturan profil" });
    this.shareButton = page.getByRole("button", { name: "Bagikan profil" });
  }

  async gotoTab(tab: string) {
    await this.page.goto(`${this.path}?tab=${tab}`);
  }

  tab(name: string) {
    return this.page.getByRole("tab", { name, exact: true });
  }
}
