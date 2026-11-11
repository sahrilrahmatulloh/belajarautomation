import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class PublicProfilePage extends BasePage {
  readonly main: Locator;
  readonly name: Locator;
  readonly tabs: Locator;
  readonly stats: Locator;
  readonly ownerNotice: Locator;
  readonly privateNotice: Locator;
  readonly bannerActions: Locator;
  readonly customizeLink: Locator;
  readonly shareButton: Locator;
  readonly achievementCard: Locator;
  readonly rankProgress: Locator;
  readonly xpProgress: Locator;
  readonly recentActivity: Locator;

  constructor(page: Page, username: string) {
    super(page, `/u/${username}`);
    this.main = page.getByRole("main");
    this.name = this.main.getByRole("heading", { level: 1 });
    this.tabs = page.getByRole("tablist", { name: "Bagian profil" }).getByRole("tab");
    this.stats = page.getByRole("region", { name: "Statistik belajar" });
    this.ownerNotice = page.getByText("Ini tampilan profilmu bagi pengguna lain.");
    this.privateNotice = page.getByRole("heading", { name: "Profil ini privat" });
    this.bannerActions = page.getByRole("navigation", { name: "Aksi profil" });
    this.customizeLink = page.getByRole("link", { name: "Ubah avatar dan tema" });
    this.shareButton = page.getByRole("button", { name: "Bagikan profil" });
    this.achievementCard = page.getByRole("region", { name: "Achievement", exact: true });
    this.rankProgress = page.getByRole("region", { name: "Progress Rank" });
    this.xpProgress = page.getByRole("region", { name: "Progres XP" });
    this.recentActivity = page.getByRole("region", { name: "Aktivitas Terbaru" });
  }

  async gotoTab(tab: string) {
    await this.page.goto(`${this.path}?tab=${tab}`);
  }

  tab(name: string) {
    return this.page.getByRole("tab", { name, exact: true });
  }
}
