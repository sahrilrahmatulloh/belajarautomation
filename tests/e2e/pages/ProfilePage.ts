import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage {
  readonly tabs: Locator;
  readonly header: Locator;
  readonly rankEmblem: Locator;
  readonly shareButton: Locator;
  readonly viewAsPublicLink: Locator;
  readonly stats: Locator;
  readonly featuredAchievements: Locator;
  readonly preview: Locator;
  readonly saveAppearanceButton: Locator;
  readonly activitySummary: Locator;
  readonly activityRows: Locator;
  readonly xpChart: Locator;
  readonly heatmap: Locator;
  readonly achievementTotal: Locator;

  constructor(page: Page) {
    super(page, "/profile");
    this.tabs = page.getByRole("tablist", { name: "Bagian profil" }).getByRole("tab");
    this.header = page
      .getByRole("main")
      .locator("section")
      .filter({ has: page.getByRole("heading", { level: 1 }) });
    this.rankEmblem = this.header.getByRole("img", { name: /^Emblem rank / });
    this.shareButton = page.getByRole("button", { name: "Bagikan profil" });
    this.viewAsPublicLink = page.getByRole("link", { name: "Lihat sebagai publik" });
    this.stats = page.getByRole("region", { name: "Statistik belajar" });
    this.featuredAchievements = page.getByRole("region", { name: "Achievement Unggulan" });
    this.preview = page.getByRole("region", { name: "Pratinjau Profil" });
    this.saveAppearanceButton = this.preview.getByRole("button", { name: "Simpan Pilihan" });
    this.activitySummary = page.getByRole("region", { name: /^Ringkasan \d+ hari terakhir$/ });
    this.activityRows = page.getByRole("region", { name: "Riwayat aktivitas" }).getByRole("listitem");
    this.xpChart = page.getByRole("region", { name: "XP 7 Hari Terakhir" });
    this.heatmap = page.getByRole("region", { name: "Konsistensi 30 Hari" });
    this.achievementTotal = page.getByRole("region", { name: "Progres total achievement" });
  }

  tab(name: string) {
    return this.page.getByRole("tab", { name, exact: true });
  }

  async gotoTab(tab: string) {
    await this.page.goto(`${this.path}?tab=${tab}`);
  }

  activityTypeChip(label: string) {
    return this.page
      .getByRole("group", { name: "Filter jenis aktivitas" })
      .getByRole("button", { name: label, exact: true });
  }

  activityPeriodChip(label: string) {
    return this.page
      .getByRole("group", { name: "Filter periode" })
      .getByRole("button", { name: label, exact: true });
  }

  achievementCategoryChip(label: string) {
    return this.page
      .getByRole("group", { name: "Filter kategori achievement" })
      .getByRole("button", { name: label, exact: true });
  }

  achievementSection(title: string) {
    return this.page.getByRole("region", { name: title, exact: true });
  }

  achievementProgress(name: string) {
    return this.page.getByRole("progressbar", { name: `Progres ${name}` });
  }
}
